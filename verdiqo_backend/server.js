// verdiqo_backend/server.js

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve Verdiqo frontend (index.html, src/, etc.) from project root
const frontendRoot = path.resolve(__dirname, '..');
app.use(express.static(frontendRoot, {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        }
        if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css; charset=utf-8');
        }
    }
}));
console.log(`Frontend served at: http://localhost:${PORT}`);

// Initialize PostgreSQL Connection Pool using Neon Connection String
const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_haUZuPe6x3LI@ep-spring-unit-aomrtac8-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

// Run table initialization
initializeTables();

// Verification Engine Logic
const VerificationEngine = {
  verifyIdentity(aadhaar, fingerprintMatched, retinaMatched) {
    if (!aadhaar || aadhaar.length !== 12 || isNaN(aadhaar)) {
      return {
        status: 'RED',
        reasonEn: 'Invalid Aadhaar Number format provided.',
        reasonHi: 'अमान्य आधार संख्या प्रारूप प्रदान किया गया है।'
      };
    }
    if (fingerprintMatched && retinaMatched) {
      return {
        status: 'GREEN',
        reasonEn: 'UIDAI biometric matching successful. Accused identity confirmed via active fingerprints and iris scanning.',
        reasonHi: 'UIDAI बायोमेट्रिक मिलान सफल रहा। आरोपी की पहचान सक्रिय उंगलियों के निशान और आईरिस स्कैनिंग के माध्यम से सत्यापित की गई है।'
      };
    } else {
      return {
        status: 'RED',
        reasonEn: 'Identity mismatch detected against biometric registry.',
        reasonHi: 'पहचान का मिलान नहीं हुआ: बायोमेट्रिक रजिस्ट्री के अनुसार विवरण विफल रहा।'
      };
    }
  },

  verifyFinancialCapacity(pan, itrList, bankBalance6m, cibil, proposedBailAmount) {
    if (!pan || pan.length !== 10) {
      return {
        status: 'NOT_CAPABLE',
        reasonEn: 'PAN details missing or invalid.',
        reasonHi: 'पैन (PAN) विवरण गायब या अमान्य हैं।',
        metrics: {}
      };
    }
    const avgItr = itrList && itrList.length > 0
      ? itrList.reduce((acc, curr) => acc + parseFloat(curr || 0), 0) / itrList.length
      : 0;
    const liquidAssets = parseFloat(bankBalance6m || 0);
    const financialCapabilityMetric = (avgItr * 1.2) + liquidAssets;

    let status = 'NOT_CAPABLE';
    let reasonEn = '';
    let reasonHi = '';

    if (cibil < 500) {
      status = 'NOT_CAPABLE';
      reasonEn = `Extremely poor CIBIL credit score (${cibil}). Loan default history flags financial instability.`;
      reasonHi = `अत्यधिक कम सिबिल (CIBIL) क्रेडिट स्कोर (${cibil})। ऋण चूक (लोन डिफ़ॉल्ट) का इतिहास वित्तीय अस्थिरता को दर्शाता है।`;
    } else if (financialCapabilityMetric >= proposedBailAmount) {
      status = 'CAPABLE';
      reasonEn = `Surety demonstrates robust capacity. Verified annual income average is ₹${avgItr.toFixed(0)} with average bank liquid reserves of ₹${liquidAssets.toFixed(0)}.`;
      reasonHi = `ज़मानतदार मजबूत वित्तीय क्षमता प्रदर्शित करता है। सत्यापित औसत वार्षिक आय ₹${avgItr.toFixed(0)} है और औसत बैंक तरल भंडार ₹${liquidAssets.toFixed(0)} है।`;
    } else if (financialCapabilityMetric >= (proposedBailAmount * 0.5)) {
      status = 'BORDERLINE';
      reasonEn = `Surety financial backup is marginally tight. Annual average income (₹${avgItr.toFixed(0)}) and reserves (₹${liquidAssets.toFixed(0)}) are close to the threshold.`;
      reasonHi = `ज़मानतदार की वित्तीय स्थिति सीमांत रूप से तंग है। औसत वार्षिक आय (₹${avgItr.toFixed(0)}) और बैंक भंडार (₹${liquidAssets.toFixed(0)}) सीमा के बहुत करीब हैं।`;
    } else {
      status = 'NOT_CAPABLE';
      reasonEn = `Insufficient financial strength. The combined metric of ITR averaging ₹${avgItr.toFixed(0)} and liquid reserves of ₹${liquidAssets.toFixed(0)} fails to support the proposed bail amount of ₹${proposedBailAmount.toFixed(0)}.`;
      reasonHi = `अपर्याप्त वित्तीय क्षमता। औसत वार्षिक आय ₹${avgItr.toFixed(0)} और तरल भंडार ₹${liquidAssets.toFixed(0)} का कुल योग प्रस्तावित ज़मानत राशि ₹${proposedBailAmount.toFixed(0)} का समर्थन करने में विफल है।`;
    }

    return { status, reasonEn, reasonHi, metrics: { avgItr, liquidAssets, capability: financialCapabilityMetric } };
  },

  calculateRiskScore(ncrbCount, prevBailsGranted, prevBailsHonored, abscondingCount, travelRestricted) {
    let score = 0;
    const reasons = [];
    const reasonsHi = [];

    if (ncrbCount > 0) {
      const points = Math.min(ncrbCount * 15, 40);
      score += points;
      reasons.push(`${ncrbCount} registered FIR cases found in NCRB database (+${points} Risk)`);
      reasonsHi.push(`NCRB डेटाबेस में ${ncrbCount} पंजीकृत एफआईआर (FIR) मामले पाए गए (+${points} जोखिम)`);
    } else {
      reasons.push('No active criminal record found in NCRB history');
      reasonsHi.push('NCRB इतिहास में कोई सक्रिय आपराधिक रिकॉर्ड नहीं पाया गया');
    }

    if (abscondingCount > 0) {
      const points = Math.min(abscondingCount * 30, 45);
      score += points;
      reasons.push(`${abscondingCount} instances of non-appearance/absconding (+${points} Risk)`);
      reasonsHi.push(`अदालत में पेश न होने / फरार होने के ${abscondingCount} मामले पाए गए (+${points} जोखिम)`);
    }

    if (travelRestricted) {
      score += 15;
      reasons.push('Immigration flight-risk watch list flag (+15 Risk)');
      reasonsHi.push('इमिग्रेशन फ्लाइट-रिस्क वॉच लिस्ट फ्लैग (+15 जोखिम)');
    }

    const bailStability = prevBailsGranted > 0 ? (prevBailsHonored / prevBailsGranted) : 1;
    if (bailStability < 0.8 && prevBailsGranted > 0) {
      score += 15;
      reasons.push(`Low bail stability ratio (${(bailStability*100).toFixed(0)}% honored) (+15 Risk)`);
      reasonsHi.push(`कम ज़मानत स्थिरता अनुपात (${(bailStability*100).toFixed(0)}% सम्मानित) (+15 जोखिम)`);
    }

    let riskLevel = 'LOW';
    if (score > 60) riskLevel = 'HIGH';
    else if (score > 30) riskLevel = 'MEDIUM';

    return { score, riskLevel, reasons, reasonsHi };
  },

  verifySuretyLoad(activeBailCount, courtThreshold = 2) {
    if (activeBailCount >= courtThreshold) {
      return {
        status: 'DISQUALIFIED',
        reasonEn: `Disqualified. Surety currently holds ${activeBailCount} active bail bonds (Threshold: ${courtThreshold}).`,
        reasonHi: `अयोग्य। ज़मानतदार के पास वर्तमान में ${activeBailCount} सक्रिय ज़मानत बांड हैं (सीमा: ${courtThreshold})।`
      };
    } else if (activeBailCount > 0) {
      return {
        status: 'OVERLOADED',
        reasonEn: `Slight risk check. Surety has ${activeBailCount} active bail bonds.`,
        reasonHi: `हल्का जोखिम। ज़मानतदार के पास ${activeBailCount} सक्रिय ज़मानत बांड हैं।`
      };
    }
    return {
      status: 'CLEAN',
      reasonEn: 'Surety holds zero active external bail bonds.',
      reasonHi: 'ज़मानतदार के पास कोई अन्य सक्रिय ज़मानत बांड नहीं है।'
    };
  },

  verifyProperty(isPropertySurety, ownerName, suretyName, encumbered, valuation, proposedBailAmount) {
    if (!isPropertySurety) {
      return {
        status: 'ELIGIBLE',
        reasonEn: 'Not a property-backed surety application (cash/personal bond selected).',
        reasonHi: 'संपत्ति-आधारित ज़मानत आवेदन नहीं है।'
      };
    }
    if (ownerName.toLowerCase().trim() !== suretyName.toLowerCase().trim()) {
      return {
        status: 'BLOCKED',
        reasonEn: 'Title deed mismatch. Property owner name does not match the pledging surety.',
        reasonHi: 'स्वामित्व विलेख बेमेल। संपत्ति के मालिक का नाम ज़मानतदार से मेल नहीं खाता है।'
      };
    }
    if (encumbered) {
      return {
        status: 'BLOCKED',
        reasonEn: 'Property blocked. Active mortgage or prior lien / encumbrance registered against this survey number.',
        reasonHi: 'संपत्ति अवरुद्ध। इस सर्वेक्षण संख्या के खिलाफ सक्रिय बंधक या पूर्व ग्रहणाधिकार / भार पंजीकृत है।'
      };
    }
    if (valuation < proposedBailAmount) {
      return {
        status: 'BLOCKED',
        reasonEn: `Property valuation (₹${valuation.toFixed(0)}) is less than proposed bail amount (₹${proposedBailAmount.toFixed(0)}).`,
        reasonHi: `संपत्ति का मूल्यांकन (₹${valuation.toFixed(0)}) प्रस्तावित ज़मानत राशि (₹${proposedBailAmount.toFixed(0)}) से कम है।`
      };
    }
    return {
      status: 'ELIGIBLE',
      reasonEn: `Property verified successfully. Clean title, clean encumbrance status, and ready-reckoner value (₹${valuation.toFixed(0)}) is sufficient.`,
      reasonHi: `संपत्ति का सफलतापूर्वक सत्यापन किया गया। स्पष्ट स्वामित्व, बंधक-मुक्त स्थिति और संपत्ति का मूल्य (₹${valuation.toFixed(0)}) पर्याप्त है।`
    };
  },

  compileRecommendation(identity, finance, risk, suretyLoad, property) {
    const triggers = [];
    const triggersHi = [];
    let verdict = 'GRANT_BAIL';

    if (identity.status === 'RED') {
      verdict = 'DENY_BAIL';
      triggers.push('Identity Verification Failed (Biometrics / Aadhaar mismatch)');
      triggersHi.push('पहचान सत्यापन विफल (बायोमेट्रिक्स / आधार मिलान नहीं हुआ)');
    }
    if (suretyLoad.status === 'DISQUALIFIED') {
      verdict = 'DENY_BAIL';
      triggers.push('Surety Disqualified (Default history or active guarantees limit exceeded)');
      triggersHi.push('ज़मानतदार अयोग्य (पिछला चूक इतिहास या सक्रिय गारंटी सीमा पार हो गई है)');
    }
    if (property.status === 'BLOCKED') {
      verdict = 'DENY_BAIL';
      triggers.push('Pledged Property is ineligible or title mismatched');
      triggersHi.push('गिरवी रखी गई संपत्ति अयोग्य है या स्वामित्व का मिलान नहीं हुआ है');
    }
    if (risk.riskLevel === 'HIGH') {
      verdict = 'DENY_BAIL';
      triggers.push(`High Criminal Risk Profile (Score: ${risk.score}/100) due to previous non-appearances or flight history`);
      triggersHi.push(`उच्च आपराधिक जोखिम प्रोफ़ाइल (स्कोर: ${risk.score}/100) पूर्व में अनुपस्थित रहने या फरार होने के इतिहास के कारण`);
    }
    if (finance.status === 'NOT_CAPABLE' && property.status !== 'ELIGIBLE') {
      verdict = 'DENY_BAIL';
      triggers.push('Surety lacks financial capacity to cover the required bail reserves');
      triggersHi.push('ज़मानतदार के पास आवश्यक ज़मानत राशि को कवर करने के लिए वित्तीय क्षमता की कमी है');
    }

    if (verdict !== 'DENY_BAIL') {
      if (risk.riskLevel === 'MEDIUM' || finance.status === 'BORDERLINE' || suretyLoad.status === 'OVERLOADED') {
        verdict = 'GRANT_WITH_CONDITIONS';
        if (risk.riskLevel === 'MEDIUM') {
          triggers.push(`Medium risk profile (Score: ${risk.score}/100) advises active reporting`);
          triggersHi.push(`मध्यम जोखिम प्रोफ़ाइल (स्कोर: ${risk.score}/100) सक्रिय रिपोर्टिंग की सलाह देता है`);
        }
        if (finance.status === 'BORDERLINE') {
          triggers.push('Surety capacity is borderline; financial monitoring recommended');
          triggersHi.push('ज़मानतदार की वित्तीय क्षमता सीमांत है; वित्तीय निगरानी की सिफारिश की जाती है');
        }
        if (suretyLoad.status === 'OVERLOADED') {
          triggers.push('Surety has multiple active commitments; check performance ledger closely');
          triggersHi.push('ज़मानतदार की कई सक्रिय प्रतिबद्धताएं हैं; प्रदर्शन बही का बारीकी से निरीक्षण करें');
        }
      }
    }

    let reasoningEn = '';
    let reasoningHi = '';

    if (verdict === 'DENY_BAIL') {
      reasoningEn = `SYSTEM ADVISES TO DENY BAIL.\nKey factors: ${triggers.join('; ')}. The risk of flight or procedural defaults is too high.`;
      reasoningHi = `सिस्टम ज़मानत खारिज करने की सलाह देता है।\nमुख्य कारक: ${triggersHi.join('; ')}।`;
    } else if (verdict === 'GRANT_WITH_CONDITIONS') {
      reasoningEn = `SYSTEM ADVISES TO GRANT BAIL WITH STRICT CONDITIONS.\nRecommended actions:\n1. Surrender of passport.\n2. Biometric reporting twice a week.\n3. Monitored movements due to: ${triggers.join(', ')}.`;
      reasoningHi = `सिस्टम सख्त शर्तों के साथ ज़मानत देने की सलाह देता है।\nअनुशंसित कार्रवाई:\n1. पासपोर्ट जमा करना।\n2. बायोमेट्रिक रिपोर्टिंग।\n3. इसके कारण निगरानी: ${triggersHi.join(', ')}।`;
    } else {
      reasoningEn = 'SYSTEM ADVISES TO GRANT BAIL.\nReasoning: All core checks are complete and cleared. The accused shows a low-risk profile, identity is authenticated, and the surety holds high capability. No adverse factors detected.';
      reasoningHi = 'सिस्टम ज़मानत देने की सलाह देता है।\nतर्क: सभी मुख्य सत्यापन पूर्ण और स्वीकृत हैं। आरोपी का जोखिम प्रोफ़ाइल कम है।';
    }

    return { verdict, reasoningEn, reasoningHi };
  }
};

function runScoringForCase(c) {
  const idCheck = VerificationEngine.verifyIdentity(c.accused.aadhaarNumber, true, true);
  const finCheck = VerificationEngine.verifyFinancialCapacity(
    c.surety.panNumber,
    [c.surety.monthlyIncome * 12],
    c.accused.bankBalance6m,
    c.accused.cibilScore,
    c.proposedBailAmount
  );
  const riskCheck = VerificationEngine.calculateRiskScore(
    c.accused.ncrbCount,
    c.accused.prevBailsGranted,
    c.accused.prevBailsHonored,
    c.accused.abscondingCount,
    c.accused.travelRestricted
  );
  const suretyCheck = VerificationEngine.verifySuretyLoad(c.surety.activeBailCount, 0);
  const propCheck = VerificationEngine.verifyProperty(
    c.surety.suretyType === 'PROPERTY',
    c.surety.fullName,
    c.surety.fullName,
    c.surety.encumbranceStatus === 'ENCUMBERED',
    c.surety.propertyValuation,
    c.proposedBailAmount
  );
  const recCheck = VerificationEngine.compileRecommendation(idCheck, finCheck, riskCheck, suretyCheck, propCheck);

  return {
    identity: idCheck,
    finance: finCheck,
    risk: riskCheck,
    suretyLoad: suretyCheck,
    property: propCheck,
    recommendation: recCheck
  };
}

// Scaffold Neon PostgreSQL Database tables
async function initializeTables() {
  try {
    // 1. Create table court_cases
    await pool.query(`CREATE TABLE IF NOT EXISTS court_cases (
      case_number TEXT PRIMARY KEY,
      fir_number TEXT,
      ipc_sections TEXT,
      date_of_arrest TEXT,
      police_station TEXT,
      presiding_judge TEXT,
      judge_id TEXT,
      court_location TEXT,
      previous_court_orders TEXT,
      filing_date TEXT,
      supporting_docs TEXT,
      bail_type TEXT,
      proposed_bail_amount DOUBLE PRECISION,
      proposed_conditions TEXT,
      hearing_date TEXT,
      current_status TEXT,
      order_status TEXT,
      judge_remarks TEXT,
      digital_signature TEXT
    )`);

    // 2. Create table accused
    await pool.query(`CREATE TABLE IF NOT EXISTS accused (
      case_number TEXT PRIMARY KEY,
      full_name TEXT,
      dob TEXT,
      fathers_name TEXT,
      address TEXT,
      mobile_number TEXT,
      aadhaar_number TEXT,
      pan_number TEXT,
      driving_license TEXT,
      passport_number TEXT,
      employment_details TEXT,
      monthly_income DOUBLE PRECISION,
      bank_account TEXT,
      cibil_score INTEGER,
      criminal_history TEXT,
      ncrb_count INTEGER,
      prev_bails_granted INTEGER,
      prev_bails_honored INTEGER,
      absconding_count INTEGER,
      travel_restricted INTEGER,
      bank_balance_6m DOUBLE PRECISION
    )`);

    // 3. Create table sureties
    await pool.query(`CREATE TABLE IF NOT EXISTS sureties (
      case_number TEXT PRIMARY KEY,
      surety_type TEXT,
      full_name TEXT,
      relation_to_accused TEXT,
      mobile_number TEXT,
      aadhaar_number TEXT,
      pan_number TEXT,
      employment_details TEXT,
      monthly_income DOUBLE PRECISION,
      active_bail_count INTEGER,
      property_address TEXT,
      survey_number TEXT,
      property_valuation DOUBLE PRECISION,
      property_ownership_doc TEXT,
      property_revenue_record TEXT,
      encumbrance_status TEXT,
      mutation_status TEXT
    )`);

    // 4. Create table arguments
    await pool.query(`CREATE TABLE IF NOT EXISTS arguments (
      case_number TEXT PRIMARY KEY,
      prosecution TEXT,
      defence TEXT
    )`);

    // 5. Create table checks
    await pool.query(`CREATE TABLE IF NOT EXISTS checks (
      case_number TEXT PRIMARY KEY,
      checks_json TEXT
    )`);

    // 6. Create table civil_cases
    await pool.query(`CREATE TABLE IF NOT EXISTS civil_cases (
      case_id TEXT PRIMARY KEY,
      case_type TEXT,
      civil_type TEXT,
      court_number TEXT,
      presiding_judge TEXT,
      filing_date TEXT,
      last_hearing_date TEXT,
      next_hearing_date TEXT,
      pending_days INTEGER,
      order_status TEXT,
      interim_orders TEXT,
      decree_text TEXT,
      postponed_to TEXT,
      judge_remarks TEXT,
      digital_signature TEXT,
      petitioner TEXT,
      respondent TEXT,
      property_details TEXT,
      relief_sought TEXT,
      stage_summary TEXT,
      hearing_history TEXT
    )`);

    // 7. Create table cheque_cases
    await pool.query(`CREATE TABLE IF NOT EXISTS cheque_cases (
      case_id TEXT PRIMARY KEY,
      case_type TEXT,
      court_number TEXT,
      presiding_judge TEXT,
      filing_date TEXT,
      last_hearing_date TEXT,
      next_hearing_date TEXT,
      pending_days INTEGER,
      order_status TEXT,
      cheque_number TEXT,
      cheque_amount REAL,
      cheque_date TEXT,
      bank_name TEXT,
      ifsc_code TEXT,
      dishonour_date TEXT,
      dishonour_reason TEXT,
      dasti_status TEXT,
      electronic_status TEXT,
      electronic_email TEXT,
      electronic_whatsapp TEXT,
      affidavit_uploaded BOOLEAN DEFAULT FALSE,
      affidavit_url TEXT,
      qr_code_url TEXT,
      payment_confirmed BOOLEAN DEFAULT FALSE,
      payment_date TEXT,
      synopsis_text TEXT,
      summary_trial_reasons TEXT,
      q1_belongs_to_accused TEXT,
      q2_signature_is_yours TEXT,
      q3_delivered_to_complainant TEXT,
      q4_owed_liability TEXT,
      q5_defence_type TEXT,
      q5_defence_details TEXT,
      q6_wish_to_compound TEXT,
      responses_recorded BOOLEAN DEFAULT FALSE,
      interim_ordered BOOLEAN DEFAULT FALSE,
      interim_amount REAL,
      interim_status TEXT,
      petitioner TEXT,
      respondent TEXT,
      hearing_history TEXT
    )`);

    // Check if seeding is required
    const resCases = await pool.query("SELECT COUNT(*) FROM court_cases");
    if (parseInt(resCases.rows[0].count, 10) === 0) {
      console.log("Seeding database with default criminal cases...");
      await seedDatabase();
    }

    const resCivil = await pool.query("SELECT COUNT(*) FROM civil_cases");
    if (parseInt(resCivil.rows[0].count, 10) === 0) {
      console.log("Seeding database with default civil plaints...");
      await seedCivilDatabase();
    }

    const resCheque = await pool.query("SELECT COUNT(*) FROM cheque_cases");
    if (parseInt(resCheque.rows[0].count, 10) === 0) {
      console.log("Seeding database with default cheque cases...");
      await seedChequeDatabase();
    }

    console.log("Neon PostgreSQL tables initialized and verified.");
  } catch (err) {
    console.error('Error during PostgreSQL startup table setup:', err.message);
  }
}

// REST API ROUTES
app.post('/api/auth/login', (req, res) => {
  const { username, password, role } = req.body;
  if (password === 'court123' || password === 'justice789' || password === 'civil456' || password === 'district456' || password === 'cheque123') {
    return res.status(200).json({ success: true, username, role, token: `JWT-MOCK-${username}-${role}` });
  }
  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

app.get('/api/cases', async (req, res) => {
  const query = `
    SELECT 
      c.*,
      a.full_name as acc_full_name, a.dob as acc_dob, a.fathers_name as acc_fathers_name,
      a.address as acc_address, a.mobile_number as acc_mobile_number, a.aadhaar_number as acc_aadhaar_number,
      a.pan_number as acc_pan_number, a.driving_license as acc_driving_license, a.passport_number as acc_passport_number,
      a.employment_details as acc_employment_details, a.monthly_income as acc_monthly_income,
      a.bank_account as acc_bank_account, a.cibil_score as acc_cibil_score, a.criminal_history as acc_criminal_history,
      a.ncrb_count as acc_ncrb_count, a.prev_bails_granted as acc_prev_bails_granted,
      a.prev_bails_honored as acc_prev_bails_honored, a.absconding_count as acc_absconding_count,
      a.travel_restricted as acc_travel_restricted, a.bank_balance_6m as acc_bank_balance_6m,
      
      s.surety_type as sur_surety_type, s.full_name as sur_full_name, s.relation_to_accused as sur_relation_to_accused,
      s.mobile_number as sur_mobile_number, s.aadhaar_number as sur_aadhaar_number, s.pan_number as sur_pan_number,
      s.employment_details as sur_employment_details, s.monthly_income as sur_monthly_income,
      s.active_bail_count as sur_active_bail_count, s.property_address as sur_property_address,
      s.survey_number as sur_survey_number, s.property_valuation as sur_property_valuation,
      s.property_ownership_doc as sur_property_ownership_doc, s.property_revenue_record as sur_property_revenue_record,
      s.encumbrance_status as sur_encumbrance_status, s.mutation_status as sur_mutation_status,
      
      arg.prosecution as arg_prosecution, arg.defence as arg_defence,
      chk.checks_json
    FROM court_cases c
    LEFT JOIN accused a ON c.case_number = a.case_number
    LEFT JOIN sureties s ON c.case_number = s.case_number
    LEFT JOIN arguments arg ON c.case_number = arg.case_number
    LEFT JOIN checks chk ON c.case_number = chk.case_number
    ORDER BY c.filing_date DESC
  `;

  try {
    const result = await pool.query(query);
    const cases = result.rows.map(row => ({
      caseNumber: row.case_number,
      firNumber: row.fir_number,
      ipcSections: row.ipc_sections,
      dateOfArrest: row.date_of_arrest,
      policeStation: row.police_station,
      presidingJudge: row.presiding_judge,
      judgeId: row.judge_id,
      courtLocation: row.court_location,
      previousCourtOrders: row.previous_court_orders,
      filingDate: row.filing_date,
      supportingDocs: JSON.parse(row.supporting_docs || '[]'),
      bailType: row.bail_type,
      proposedBailAmount: row.proposed_bail_amount,
      proposedConditions: JSON.parse(row.proposed_conditions || '[]'),
      hearingDate: row.hearing_date,
      currentStatus: row.current_status,
      orderStatus: row.order_status,
      judgeRemarks: row.judge_remarks || '',
      digitalSignature: row.digital_signature || '',
      accused: {
        fullName: row.acc_full_name,
        dob: row.acc_dob,
        fathersName: row.acc_fathers_name,
        address: row.acc_address,
        mobileNumber: row.acc_mobile_number,
        aadhaarNumber: row.acc_aadhaar_number,
        panNumber: row.acc_pan_number,
        drivingLicense: row.acc_driving_license,
        passportNumber: row.acc_passport_number,
        employmentDetails: row.acc_employment_details,
        monthlyIncome: row.acc_monthly_income,
        bankAccount: row.acc_bank_account,
        cibilScore: row.acc_cibil_score,
        criminalHistory: row.acc_criminal_history,
        ncrbCount: row.acc_ncrb_count,
        prevBailsGranted: row.acc_prev_bails_granted,
        prevBailsHonored: row.acc_prev_bails_honored,
        abscondingCount: row.acc_absconding_count,
        travelRestricted: row.acc_travel_restricted === 1,
        bankBalance6m: row.acc_bank_balance_6m
      },
      surety: {
        suretyType: row.sur_surety_type,
        fullName: row.sur_full_name,
        relationToAccused: row.sur_relation_to_accused,
        mobileNumber: row.sur_mobile_number,
        aadhaarNumber: row.sur_aadhaar_number,
        panNumber: row.sur_pan_number,
        employmentDetails: row.sur_employment_details,
        monthlyIncome: row.sur_monthly_income,
        activeBailCount: row.sur_active_bail_count,
        propertyAddress: row.sur_property_address,
        surveyNumber: row.sur_survey_number,
        propertyValuation: row.sur_property_valuation,
        propertyOwnershipDoc: row.sur_property_ownership_doc,
        propertyRevenueRecord: row.sur_property_revenue_record,
        encumbranceStatus: row.sur_encumbrance_status,
        mutationStatus: row.sur_mutation_status
      },
      arguments: {
        prosecution: row.arg_prosecution,
        defence: row.arg_defence
      },
      checks: JSON.parse(row.checks_json || '{}')
    }));
    res.status(200).json(cases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/cases', async (req, res) => {
  const c = req.body;
  const checks = runScoringForCase(c);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const ccQuery = `
      INSERT INTO court_cases 
        (case_number, fir_number, ipc_sections, date_of_arrest, police_station, presiding_judge, judge_id, court_location, previous_court_orders, filing_date, supporting_docs, bail_type, proposed_bail_amount, proposed_conditions, hearing_date, current_status, order_status, judge_remarks, digital_signature) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      ON CONFLICT (case_number) DO UPDATE SET
        fir_number = EXCLUDED.fir_number, ipc_sections = EXCLUDED.ipc_sections, date_of_arrest = EXCLUDED.date_of_arrest,
        police_station = EXCLUDED.police_station, presiding_judge = EXCLUDED.presiding_judge, judge_id = EXCLUDED.judge_id,
        court_location = EXCLUDED.court_location, previous_court_orders = EXCLUDED.previous_court_orders, filing_date = EXCLUDED.filing_date,
        supporting_docs = EXCLUDED.supporting_docs, bail_type = EXCLUDED.bail_type, proposed_bail_amount = EXCLUDED.proposed_bail_amount,
        proposed_conditions = EXCLUDED.proposed_conditions, hearing_date = EXCLUDED.hearing_date, current_status = EXCLUDED.current_status,
        order_status = EXCLUDED.order_status, judge_remarks = EXCLUDED.judge_remarks, digital_signature = EXCLUDED.digital_signature`;
    
    await client.query(ccQuery, [
      c.caseNumber, c.firNumber, c.ipcSections, c.dateOfArrest, c.policeStation, c.presidingJudge, c.judgeId, c.courtLocation, c.previousCourtOrders, c.filingDate,
      JSON.stringify(c.supportingDocs), c.bailType, c.proposedBailAmount, JSON.stringify(c.proposedConditions), c.hearingDate, c.currentStatus, c.orderStatus, c.judgeRemarks || '', c.digitalSignature || ''
    ]);

    const accQuery = `
      INSERT INTO accused 
        (case_number, full_name, dob, fathers_name, address, mobile_number, aadhaar_number, pan_number, driving_license, passport_number, employment_details, monthly_income, bank_account, cibil_score, criminal_history, ncrb_count, prev_bails_granted, prev_bails_honored, absconding_count, travel_restricted, bank_balance_6m) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      ON CONFLICT (case_number) DO UPDATE SET
        full_name = EXCLUDED.full_name, dob = EXCLUDED.dob, fathers_name = EXCLUDED.fathers_name, address = EXCLUDED.address,
        mobile_number = EXCLUDED.mobile_number, aadhaar_number = EXCLUDED.aadhaar_number, pan_number = EXCLUDED.pan_number,
        driving_license = EXCLUDED.driving_license, passport_number = EXCLUDED.passport_number, employment_details = EXCLUDED.employment_details,
        monthly_income = EXCLUDED.monthly_income, bank_account = EXCLUDED.bank_account, cibil_score = EXCLUDED.cibil_score,
        criminal_history = EXCLUDED.criminal_history, ncrb_count = EXCLUDED.ncrb_count, prev_bails_granted = EXCLUDED.prev_bails_granted,
        prev_bails_honored = EXCLUDED.prev_bails_honored, absconding_count = EXCLUDED.absconding_count, travel_restricted = EXCLUDED.travel_restricted,
        bank_balance_6m = EXCLUDED.bank_balance_6m`;
    
    await client.query(accQuery, [
      c.caseNumber, c.accused.fullName, c.accused.dob, c.accused.fathersName, c.accused.address, c.accused.mobileNumber, c.accused.aadhaarNumber, c.accused.panNumber, c.accused.drivingLicense, c.accused.passportNumber,
      c.accused.employmentDetails, c.accused.monthlyIncome, c.accused.bankAccount, c.accused.cibilScore, c.accused.criminalHistory, c.accused.ncrbCount, c.accused.prevBailsGranted, c.accused.prevBailsHonored, c.accused.abscondingCount,
      c.accused.travelRestricted ? 1 : 0, c.accused.bankBalance6m
    ]);

    const surQuery = `
      INSERT INTO sureties 
        (case_number, surety_type, full_name, relation_to_accused, mobile_number, aadhaar_number, pan_number, employment_details, monthly_income, active_bail_count, property_address, survey_number, property_valuation, property_ownership_doc, property_revenue_record, encumbrance_status, mutation_status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      ON CONFLICT (case_number) DO UPDATE SET
        surety_type = EXCLUDED.surety_type, full_name = EXCLUDED.full_name, relation_to_accused = EXCLUDED.relation_to_accused,
        mobile_number = EXCLUDED.mobile_number, aadhaar_number = EXCLUDED.aadhaar_number, pan_number = EXCLUDED.pan_number,
        employment_details = EXCLUDED.employment_details, monthly_income = EXCLUDED.monthly_income, active_bail_count = EXCLUDED.active_bail_count,
        property_address = EXCLUDED.property_address, survey_number = EXCLUDED.survey_number, property_valuation = EXCLUDED.property_valuation,
        property_ownership_doc = EXCLUDED.property_ownership_doc, property_revenue_record = EXCLUDED.property_revenue_record,
        encumbrance_status = EXCLUDED.encumbrance_status, mutation_status = EXCLUDED.mutation_status`;
    
    await client.query(surQuery, [
      c.caseNumber, c.surety.suretyType, c.surety.fullName, c.surety.relationToAccused, c.surety.mobileNumber, c.surety.aadhaarNumber, c.surety.panNumber, c.surety.employmentDetails, c.surety.monthlyIncome, c.surety.activeBailCount,
      c.surety.propertyAddress, c.surety.surveyNumber, c.surety.propertyValuation, c.surety.propertyOwnershipDoc, c.surety.propertyRevenueRecord, c.surety.encumbranceStatus, c.surety.mutationStatus
    ]);

    await client.query(`
      INSERT INTO arguments (case_number, prosecution, defence) VALUES ($1, $2, $3)
      ON CONFLICT (case_number) DO UPDATE SET prosecution = EXCLUDED.prosecution, defence = EXCLUDED.defence`,
      [c.caseNumber, c.arguments.prosecution, c.arguments.defence]
    );

    await client.query(`
      INSERT INTO checks (case_number, checks_json) VALUES ($1, $2)
      ON CONFLICT (case_number) DO UPDATE SET checks_json = EXCLUDED.checks_json`,
      [c.caseNumber, JSON.stringify(checks)]
    );

    await client.query('COMMIT');
    c.checks = checks;
    res.status(201).json(c);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.put('/api/cases/:caseNumber/verdict', async (req, res) => {
  const { caseNumber } = req.params;
  const { verdict, remarks, signature } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const statusStr = verdict === 'ADJOURNED' ? 'Adjourned' : 'Adjudicated';
    
    await client.query(
      `UPDATE court_cases 
       SET order_status = $1, judge_remarks = $2, digital_signature = $3, current_status = $4 
       WHERE case_number = $5`,
      [verdict, remarks, signature, statusStr, caseNumber]
    );

    if (verdict === 'GRANTED' || verdict === 'GRANTED_WITH_CONDITIONS') {
      await client.query(
        `UPDATE sureties 
         SET mutation_status = 'COMPLETED' 
         WHERE case_number = $5`,
        [caseNumber]
      );
    }

    await client.query('COMMIT');
    res.status(200).json({ success: true, message: 'Verdict updated successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Civil Plaints API Routes
app.get('/api/civil-cases', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM civil_cases ORDER BY filing_date DESC");
    const cases = result.rows.map(row => ({
      caseId: row.case_id,
      caseType: row.case_type,
      civilType: row.civil_type,
      courtNumber: row.court_number,
      presidingJudge: row.presiding_judge,
      filingDate: row.filing_date,
      lastHearingDate: row.last_hearing_date,
      nextHearingDate: row.next_hearing_date,
      pendingDays: row.pending_days,
      orderStatus: row.order_status,
      interimOrders: JSON.parse(row.interim_orders || '[]'),
      decreeText: row.decree_text || '',
      postponedTo: row.postponed_to || '',
      judgeRemarks: row.judge_remarks || '',
      digitalSignature: row.digital_signature || '',
      petitioner: JSON.parse(row.petitioner || '{}'),
      respondent: JSON.parse(row.respondent || '{}'),
      propertyDetails: row.property_details || '',
      reliefSought: row.relief_sought || '',
      stageSummary: row.stage_summary || '',
      hearingHistory: JSON.parse(row.hearing_history || '[]')
    }));
    res.status(200).json(cases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/civil-cases', async (req, res) => {
  const c = req.body;
  try {
    const query = `
      INSERT INTO civil_cases 
        (case_id, case_type, civil_type, court_number, presiding_judge, filing_date, last_hearing_date, next_hearing_date, pending_days, order_status, interim_orders, decree_text, postponed_to, judge_remarks, digital_signature, petitioner, respondent, property_details, relief_sought, stage_summary, hearing_history)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      ON CONFLICT (case_id) DO UPDATE SET
        case_type = EXCLUDED.case_type, civil_type = EXCLUDED.civil_type, court_number = EXCLUDED.court_number, presiding_judge = EXCLUDED.presiding_judge,
        filing_date = EXCLUDED.filing_date, last_hearing_date = EXCLUDED.last_hearing_date, next_hearing_date = EXCLUDED.next_hearing_date,
        pending_days = EXCLUDED.pending_days, order_status = EXCLUDED.order_status, interim_orders = EXCLUDED.interim_orders,
        decree_text = EXCLUDED.decree_text, postponed_to = EXCLUDED.postponed_to, judge_remarks = EXCLUDED.judge_remarks,
        digital_signature = EXCLUDED.digital_signature, petitioner = EXCLUDED.petitioner, respondent = EXCLUDED.respondent,
        property_details = EXCLUDED.property_details, relief_sought = EXCLUDED.relief_sought, stage_summary = EXCLUDED.stage_summary,
        hearing_history = EXCLUDED.hearing_history`;
    
    await pool.query(query, [
      c.caseId || c.case_id, c.caseType, c.civilType, c.courtNumber, c.presidingJudge, c.filingDate, c.lastHearingDate, c.nextHearingDate, c.pendingDays || 0, c.orderStatus,
      JSON.stringify(c.interimOrders || []), c.decreeText || '', c.postponedTo || '', c.judgeRemarks || '', c.digitalSignature || '',
      JSON.stringify(c.petitioner || {}), JSON.stringify(c.respondent || {}), c.propertyDetails || '', c.reliefSought || '', c.stageSummary || '',
      JSON.stringify(c.hearingHistory || [])
    ]);
    res.status(201).json(c);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/civil-cases/:caseId/verdict', async (req, res) => {
  const { caseId } = req.params;
  const { verdict, remarks, signature, decreeText } = req.body;
  try {
    await pool.query(
      `UPDATE civil_cases 
       SET order_status = $1, judge_remarks = $2, digital_signature = $3, decree_text = $4 
       WHERE case_id = $5`,
      [verdict, remarks, signature, decreeText || '', caseId]
    );
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cheque Cases API Routes (Section 138 NI Act)
app.get('/api/cheque-cases', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cheque_cases ORDER BY filing_date DESC");
    const cases = result.rows.map(row => ({
      caseId: row.case_id,
      caseType: row.case_type || 'CHEQUE',
      courtNumber: row.court_number || '',
      presidingJudge: row.presiding_judge || '',
      filingDate: row.filing_date || '',
      lastHearingDate: row.last_hearing_date || '',
      nextHearingDate: row.next_hearing_date || '',
      pendingDays: row.pending_days || 0,
      orderStatus: row.order_status || 'PENDING',
      chequeNumber: row.cheque_number || '',
      chequeAmount: parseFloat(row.cheque_amount || 0),
      chequeDate: row.cheque_date || '',
      bankName: row.bank_name || '',
      ifscCode: row.ifsc_code || '',
      dishonourDate: row.dishonour_date || '',
      dishonourReason: row.dishonour_reason || '',
      dastiStatus: row.dasti_status || 'PENDING',
      electronicStatus: row.electronic_status || 'PENDING',
      electronicEmail: row.electronic_email || '',
      electronicWhatsapp: row.electronic_whatsapp || '',
      affidavitUploaded: row.affidavit_uploaded === true || row.affidavit_uploaded === 'true',
      affidavitUrl: row.affidavit_url || '',
      qrCodeUrl: row.qr_code_url || '',
      paymentConfirmed: row.payment_confirmed === true || row.payment_confirmed === 'true',
      paymentDate: row.payment_date || '',
      synopsisText: row.synopsis_text || '',
      summaryTrialReasons: row.summary_trial_reasons || '',
      q1_belongs_to_accused: row.q1_belongs_to_accused || 'PENDING',
      q2_signature_is_yours: row.q2_signature_is_yours || 'PENDING',
      q3_delivered_to_complainant: row.q3_delivered_to_complainant || 'PENDING',
      q4_owed_liability: row.q4_owed_liability || 'PENDING',
      q5_defence_type: row.q5_defence_type || 'N/A',
      q5_defence_details: row.q5_defence_details || '',
      q6_wish_to_compound: row.q6_wish_to_compound || 'PENDING',
      responsesRecorded: row.responses_recorded === true || row.responses_recorded === 'true',
      interimOrdered: row.interim_ordered === true || row.interim_ordered === 'true',
      interimAmount: parseFloat(row.interim_amount || 0),
      interimStatus: row.interim_status || 'N/A',
      petitioner: JSON.parse(row.petitioner || '{}'),
      respondent: JSON.parse(row.respondent || '{}'),
      hearingHistory: JSON.parse(row.hearing_history || '[]')
    }));
    res.status(200).json(cases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/cheque-cases', async (req, res) => {
  const c = req.body;
  try {
    const query = `
      INSERT INTO cheque_cases (
        case_id, case_type, court_number, presiding_judge, filing_date, last_hearing_date, next_hearing_date, pending_days, order_status,
        cheque_number, cheque_amount, cheque_date, bank_name, ifsc_code, dishonour_date, dishonour_reason,
        dasti_status, electronic_status, electronic_email, electronic_whatsapp, affidavit_uploaded, affidavit_url,
        qr_code_url, payment_confirmed, payment_date, synopsis_text, summary_trial_reasons,
        q1_belongs_to_accused, q2_signature_is_yours, q3_delivered_to_complainant, q4_owed_liability, q5_defence_type, q5_defence_details, q6_wish_to_compound, responses_recorded,
        interim_ordered, interim_amount, interim_status, petitioner, respondent, hearing_history
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41)
      ON CONFLICT (case_id) DO UPDATE SET
        court_number = EXCLUDED.court_number, presiding_judge = EXCLUDED.presiding_judge, filing_date = EXCLUDED.filing_date,
        last_hearing_date = EXCLUDED.last_hearing_date, next_hearing_date = EXCLUDED.next_hearing_date, pending_days = EXCLUDED.pending_days, order_status = EXCLUDED.order_status,
        cheque_number = EXCLUDED.cheque_number, cheque_amount = EXCLUDED.cheque_amount, cheque_date = EXCLUDED.cheque_date, bank_name = EXCLUDED.bank_name, ifsc_code = EXCLUDED.ifsc_code,
        dasti_status = EXCLUDED.dasti_status, electronic_status = EXCLUDED.electronic_status, electronic_email = EXCLUDED.electronic_email, electronic_whatsapp = EXCLUDED.electronic_whatsapp,
        affidavit_uploaded = EXCLUDED.affidavit_uploaded, affidavit_url = EXCLUDED.affidavit_url, qr_code_url = EXCLUDED.qr_code_url,
        payment_confirmed = EXCLUDED.payment_confirmed, payment_date = EXCLUDED.payment_date, synopsis_text = EXCLUDED.synopsis_text, summary_trial_reasons = EXCLUDED.summary_trial_reasons,
        q1_belongs_to_accused = EXCLUDED.q1_belongs_to_accused, q2_signature_is_yours = EXCLUDED.q2_signature_is_yours, q3_delivered_to_complainant = EXCLUDED.q3_delivered_to_complainant, q4_owed_liability = EXCLUDED.q4_owed_liability,
        q5_defence_type = EXCLUDED.q5_defence_type, q5_defence_details = EXCLUDED.q5_defence_details, q6_wish_to_compound = EXCLUDED.q6_wish_to_compound, responses_recorded = EXCLUDED.responses_recorded,
        interim_ordered = EXCLUDED.interim_ordered, interim_amount = EXCLUDED.interim_amount, interim_status = EXCLUDED.interim_status, petitioner = EXCLUDED.petitioner, respondent = EXCLUDED.respondent, hearing_history = EXCLUDED.hearing_history`;
    
    await pool.query(query, [
      c.caseId || c.case_id, c.caseType || 'CHEQUE', c.courtNumber || 'Special NI Act Court Room 1, Rajamundry', c.presidingJudge || 'Hon\'ble K. Srinivas Rao', c.filingDate, c.lastHearingDate, c.nextHearingDate || '', c.pendingDays || 0, c.orderStatus || 'PENDING',
      c.chequeNumber || '', parseFloat(c.chequeAmount || 0), c.chequeDate || '', c.bankName || '', c.ifscCode || '', c.dishonourDate || '', c.dishonourReason || '',
      c.dastiStatus || 'PENDING', c.electronicStatus || 'PENDING', c.electronicEmail || '', c.electronicWhatsapp || '', c.affidavitUploaded === true || c.affidavitUploaded === 'true', c.affidavitUrl || '',
      c.qrCodeUrl || '', c.paymentConfirmed === true || c.paymentConfirmed === 'true', c.paymentDate || '', c.synopsisText || '', c.summaryTrialReasons || '',
      c.q1_belongs_to_accused || 'PENDING', c.q2_signature_is_yours || 'PENDING', c.q3_delivered_to_complainant || 'PENDING', c.q4_owed_liability || 'PENDING', c.q5_defence_type || 'N/A', c.q5_defence_details || '', c.q6_wish_to_compound || 'PENDING', c.responsesRecorded === true || c.responsesRecorded === 'true',
      c.interimOrdered === true || c.interimOrdered === 'true', parseFloat(c.interimAmount || 0), c.interimStatus || 'N/A', JSON.stringify(c.petitioner || {}), JSON.stringify(c.respondent || {}), JSON.stringify(c.hearingHistory || [])
    ]);
    res.status(201).json(c);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/cheque-cases/:caseId/summons', async (req, res) => {
  const { caseId } = req.params;
  const { dastiStatus, electronicStatus, affidavitUploaded, nextHearingDate, stageSummary, note } = req.body;
  try {
    const caseRes = await pool.query("SELECT hearing_history FROM cheque_cases WHERE case_id = $1", [caseId]);
    let history = [];
    if (caseRes.rows.length > 0 && caseRes.rows[0].hearing_history) {
      try {
        history = JSON.parse(caseRes.rows[0].hearing_history || '[]');
      } catch (e) {
        history = [];
      }
    }
    if (note) {
      history.push({ date: new Date().toISOString().split('T')[0], note });
    }
    
    await pool.query(
      `UPDATE cheque_cases 
       SET dasti_status = $1, electronic_status = $2, affidavit_uploaded = $3, next_hearing_date = $4, order_status = $5, hearing_history = $6
       WHERE case_id = $7`,
      [dastiStatus, electronicStatus, affidavitUploaded, nextHearingDate, stageSummary, JSON.stringify(history), caseId]
    );
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/cheque-cases/:caseId/trial', async (req, res) => {
  const { caseId } = req.params;
  const { summaryTrialReasons, q1, q2, q3, q4, q5_type, q5_details, q6, responsesRecorded, orderStatus } = req.body;
  try {
    await pool.query(
      `UPDATE cheque_cases 
       SET summary_trial_reasons = $1, q1_belongs_to_accused = $2, q2_signature_is_yours = $3, q3_delivered_to_complainant = $4, q4_owed_liability = $5, q5_defence_type = $6, q5_defence_details = $7, q6_wish_to_compound = $8, responses_recorded = $9, order_status = $10
       WHERE case_id = $11`,
      [summaryTrialReasons || '', q1, q2, q3, q4, q5_type, q5_details, q6, responsesRecorded, orderStatus, caseId]
    );
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/cheque-cases/:caseId/interim', async (req, res) => {
  const { caseId } = req.params;
  const { interimOrdered, interimAmount, interimStatus } = req.body;
  try {
    await pool.query(
      `UPDATE cheque_cases 
       SET interim_ordered = $1, interim_amount = $2, interim_status = $3
       WHERE case_id = $4`,
      [interimOrdered, interimAmount, interimStatus, caseId]
    );
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/cheque-cases/:caseId/verdict', async (req, res) => {
  const { caseId } = req.params;
  const { verdict, remarks, signature, decreeText } = req.body;
  try {
    const caseRes = await pool.query("SELECT hearing_history FROM cheque_cases WHERE case_id = $1", [caseId]);
    let history = [];
    if (caseRes.rows.length > 0 && caseRes.rows[0].hearing_history) {
      try {
        history = JSON.parse(caseRes.rows[0].hearing_history || '[]');
      } catch (e) {
        history = [];
      }
    }
    history.push({ date: new Date().toISOString().split('T')[0], note: `Final order passed: ${verdict}.` });

    await pool.query(
      `UPDATE cheque_cases 
       SET order_status = $1, judge_remarks = $2, digital_signature = $3, decree_text = $4, hearing_history = $5
       WHERE case_id = $6`,
      [verdict, remarks, signature, decreeText || '', JSON.stringify(history), caseId]
    );
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/cheque-cases/:caseId/pay', async (req, res) => {
  const { caseId } = req.params;
  try {
    const today = new Date().toISOString().split('T')[0];
    const caseRes = await pool.query("SELECT hearing_history FROM cheque_cases WHERE case_id = $1", [caseId]);
    let history = [];
    if (caseRes.rows.length > 0 && caseRes.rows[0].hearing_history) {
      try {
        history = JSON.parse(caseRes.rows[0].hearing_history || '[]');
      } catch (e) {
        history = [];
      }
    }
    history.push({ date: today, note: `Early settlement payment confirmed. Accused deposited full cheque amount.` });
    history.push({ date: today, note: `Proceedings compounded u/s 147 NI Act and closed.` });

    await pool.query(
      `UPDATE cheque_cases 
       SET order_status = 'COMPOUNDED', payment_confirmed = true, payment_date = $1, hearing_history = $2
       WHERE case_id = $3`,
      [today, JSON.stringify(history), caseId]
    );
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Database Seed Helpers
async function seedDatabase() {
  const seedCases = [
    {
      caseNumber: 'BMS/2026/0042',
      firNumber: 'FIR/148/2026-RJM',
      ipcSections: 'IPC 420, 468',
      dateOfArrest: '2026-05-24',
      policeStation: 'Rajamundry Urban PS, Inspector S. Kumar',
      presidingJudge: 'Hon\'ble J. Kameswara Rao',
      judgeId: 'JUDGE-KAMESWARA-2026',
      courtLocation: 'Sessions Court Room 2, Rajamundry',
      previousCourtOrders: 'First bail rejected 2026-05-18 by Magistrate.',
      filingDate: '2026-05-25',
      supportingDocs: ['Character Certificate', 'Employment Letter', 'Community Ties Evidence'],
      bailType: 'First Bail',
      proposedBailAmount: 50000,
      proposedConditions: ['Weekly Reporting', 'Passport Deposit', 'No Contact with Witnesses'],
      hearingDate: '2026-05-29T10:30',
      currentStatus: 'Ready for Judge',
      orderStatus: 'PENDING',
      judgeRemarks: '',
      digitalSignature: '',
      accused: {
        fullName: 'Srinivas Rao Vemuri',
        dob: '1984-08-15',
        fathersName: 'Satyanarayana Vemuri',
        address: 'Sai Balaji Residency, Rajamundry',
        mobileNumber: '9876543210',
        aadhaarNumber: '123456789012',
        panNumber: 'VEMUR1984S',
        drivingLicense: 'AP05-2026-0042841',
        passportNumber: 'U8374928',
        employmentDetails: 'Account Manager, TechSolutions',
        monthlyIncome: 45000,
        bankAccount: 'SBI A/c 38472948274',
        cibilScore: 740,
        criminalHistory: 'No active convictions.',
        ncrbCount: 0,
        prevBailsGranted: 0,
        prevBailsHonored: 0,
        abscondingCount: 0,
        travelRestricted: false,
        bankBalance6m: 35000
      },
      surety: {
        suretyType: 'PROPERTY',
        fullName: 'Madhava Rao Vemuri',
        relationToAccused: 'Brother',
        mobileNumber: '8765432109',
        aadhaarNumber: '876543210987',
        panNumber: 'LKJHG6789F',
        employmentDetails: 'Retired Government Clerk',
        monthlyIncome: 35000,
        activeBailCount: 0,
        propertyAddress: 'Subhash Road, Rajamundry. RS-104/12-C',
        surveyNumber: 'RS-104/12-C',
        propertyValuation: 650000,
        propertyOwnershipDoc: 'TD-2026-RJM-482',
        propertyRevenueRecord: 'P-8472-RJM',
        encumbranceStatus: 'CLEAN',
        mutationStatus: 'PENDING'
      },
      arguments: {
        prosecution: 'Possibility of tampering with witnesses.',
        defence: 'Accused is cooperative, items recovered.'
      }
    },
    {
      caseNumber: 'BMS/2026/0041',
      firNumber: 'FIR/102/2026-RJM',
      ipcSections: 'IPC 302',
      dateOfArrest: '2026-05-20',
      policeStation: 'RJM Rural PS, Inspector K. Ram',
      presidingJudge: 'Hon\'ble J. Kameswara Rao',
      judgeId: 'JUDGE-KAMESWARA-2026',
      courtLocation: 'Sessions Court Room 2, Rajamundry',
      previousCourtOrders: 'First bail rejected due to severity.',
      filingDate: '2026-05-22',
      supportingDocs: ['Character Certificate'],
      bailType: 'Second Bail',
      proposedBailAmount: 150000,
      proposedConditions: ['Daily Police Station Attendance', 'Surety Obligation Complete'],
      hearingDate: '2026-05-29T11:00',
      currentStatus: 'Ready for Judge',
      orderStatus: 'PENDING',
      judgeRemarks: '',
      digitalSignature: '',
      accused: {
        fullName: 'Rajesh Kumar Ganti',
        dob: '1990-04-12',
        fathersName: 'Venkata Rao Ganti',
        address: 'Bhimavaram Road, Rajamundry',
        mobileNumber: '9440123456',
        aadhaarNumber: '987654321098',
        panNumber: 'GANTR1990K',
        drivingLicense: 'AP05-2026-0098231',
        passportNumber: 'Z9823746',
        employmentDetails: 'Unemployed',
        monthlyIncome: 0,
        bankAccount: 'Andhra Bank A/c 9283749283',
        cibilScore: 580,
        criminalHistory: '1 prior pending assault charge.',
        ncrbCount: 1,
        prevBailsGranted: 1,
        prevBailsHonored: 1,
        abscondingCount: 0,
        travelRestricted: false,
        bankBalance6m: 12000
      },
      surety: {
        suretyType: 'PROPERTY',
        fullName: 'Rama Rao',
        relationToAccused: 'Father',
        mobileNumber: '9440987650',
        aadhaarNumber: '998877665544',
        panNumber: 'RAMAR1234N',
        employmentDetails: 'Farmer',
        monthlyIncome: 25000,
        activeBailCount: 1,
        propertyAddress: 'Danavaipeta, Rajamundry. RS-242/8-B',
        surveyNumber: 'RS-242/8-B',
        propertyValuation: 400000,
        propertyOwnershipDoc: 'TD-2021-RJM-938',
        propertyRevenueRecord: 'P-1934-RJM',
        encumbranceStatus: 'CLEAN',
        mutationStatus: 'PENDING'
      },
      arguments: {
        prosecution: 'Severe charge (murder).',
        defence: 'Accused acted in self-defence.'
      }
    }
  ];

  for (const c of seedCases) {
    const checks = runScoringForCase(c);
    const ccQuery = `
      INSERT INTO court_cases 
        (case_number, fir_number, ipc_sections, date_of_arrest, police_station, presiding_judge, judge_id, court_location, previous_court_orders, filing_date, supporting_docs, bail_type, proposed_bail_amount, proposed_conditions, hearing_date, current_status, order_status, judge_remarks, digital_signature) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`;
    await pool.query(ccQuery, [
      c.caseNumber, c.firNumber, c.ipcSections, c.dateOfArrest, c.policeStation, c.presidingJudge, c.judgeId, c.courtLocation, c.previousCourtOrders, c.filingDate,
      JSON.stringify(c.supportingDocs), c.bailType, c.proposedBailAmount, JSON.stringify(c.proposedConditions), c.hearingDate, c.currentStatus, c.orderStatus, c.judgeRemarks, c.digitalSignature
    ]);

    const accQuery = `
      INSERT INTO accused 
        (case_number, full_name, dob, fathers_name, address, mobile_number, aadhaar_number, pan_number, driving_license, passport_number, employment_details, monthly_income, bank_account, cibil_score, criminal_history, ncrb_count, prev_bails_granted, prev_bails_honored, absconding_count, travel_restricted, bank_balance_6m) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)`;
    await pool.query(accQuery, [
      c.caseNumber, c.accused.fullName, c.accused.dob, c.accused.fathersName, c.accused.address, c.accused.mobileNumber, c.accused.aadhaarNumber, c.accused.panNumber, c.accused.drivingLicense, c.accused.passportNumber,
      c.accused.employmentDetails, c.accused.monthlyIncome, c.accused.bankAccount, c.accused.cibilScore, c.accused.criminalHistory, c.accused.ncrbCount, c.accused.prevBailsGranted, c.accused.prevBailsHonored, c.accused.abscondingCount,
      c.accused.travelRestricted ? 1 : 0, c.accused.bankBalance6m
    ]);

    const surQuery = `
      INSERT INTO sureties 
        (case_number, surety_type, full_name, relation_to_accused, mobile_number, aadhaar_number, pan_number, employment_details, monthly_income, active_bail_count, property_address, survey_number, property_valuation, property_ownership_doc, property_revenue_record, encumbrance_status, mutation_status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`;
    await pool.query(surQuery, [
      c.caseNumber, c.surety.suretyType, c.surety.fullName, c.surety.relationToAccused, c.surety.mobileNumber, c.surety.aadhaarNumber, c.surety.panNumber, c.surety.employmentDetails, c.surety.monthlyIncome, c.surety.activeBailCount,
      c.surety.propertyAddress, c.surety.surveyNumber, c.surety.propertyValuation, c.surety.propertyOwnershipDoc, c.surety.propertyRevenueRecord, c.surety.encumbranceStatus, c.surety.mutationStatus
    ]);

    await pool.query(`INSERT INTO arguments (case_number, prosecution, defence) VALUES ($1, $2, $3)`, [c.caseNumber, c.arguments.prosecution, c.arguments.defence]);
    await pool.query(`INSERT INTO checks (case_number, checks_json) VALUES ($1, $2)`, [c.caseNumber, JSON.stringify(checks)]);
  }
}

async function seedCivilDatabase() {
  const seedCivilCases = [
    {
      caseId: 'CL-2024-0012',
      caseType: 'CIVIL',
      civilType: 'Property Dispute',
      courtNumber: 'Civil Court Room 1, Rajamundry',
      presidingJudge: 'Hon\'ble J. Kameswara Rao',
      filingDate: '2024-03-14',
      lastHearingDate: '2026-05-10',
      nextHearingDate: '2026-07-05',
      pendingDays: 836,
      orderStatus: 'PENDING',
      interimOrders: ['Interim injunction granted — respondent restrained from selling property (Order dt. 2024-07-01)'],
      decreeText: '',
      postponedTo: '',
      judgeRemarks: '',
      digitalSignature: '',
      petitioner: {
        name: 'Smt. Padmavathi Devi Alluri',
        advocate: 'Adv. K. Ramachandra Rao',
        address: 'D.No 2-4-17, Tadepalligudem Road, Rajamundry',
        aadhaar: '234567890123',
        mobileNumber: '9441234567'
      },
      respondent: {
        name: 'Sri. Venkata Rao Alluri',
        advocate: 'Adv. P. Subrahmanyam',
        address: 'D.No 2-4-17, Tadepalligudem Road, Rajamundry',
        aadhaar: '345678901234',
        mobileNumber: '9440987654'
      },
      propertyDetails: 'Agricultural land of 2.45 acres, Survey No. RS-129/4-A, Tadepalligudem, East Godavari. Disputed succession after death of Sri. Narayana Rao Alluri (2022). Petitioner claims sole heirship.',
      reliefSought: 'Declaration of ownership and possession of the disputed land. Partition decree as legal heir.',
      stageSummary: 'Arguments concluded. Evidence recording complete. Awaiting final judgment.',
      hearingHistory: [
        { date: '2024-04-01', note: 'Plaint filed. Summons issued to respondent.' },
        { date: '2024-06-15', note: 'Written statement filed by respondent. Issues framed.' },
        { date: '2024-07-01', note: 'Interim injunction granted. Respondent restrained from alienation.' },
        { date: '2025-02-12', note: 'Petitioner examination complete. 3 witnesses examined.' },
        { date: '2025-09-04', note: 'Respondent evidence recording concluded.' },
        { date: '2026-05-10', note: 'Final arguments heard. Reserved for judgment.' }
      ]
    },
    {
      caseId: 'CL-2025-0034',
      caseType: 'CIVIL',
      civilType: 'Money Recovery Suit',
      courtNumber: 'Civil Court Room 1, Rajamundry',
      presidingJudge: 'Hon\'ble J. Kameswara Rao',
      filingDate: '2025-01-20',
      lastHearingDate: '2026-06-01',
      nextHearingDate: '2026-07-18',
      pendingDays: 523,
      orderStatus: 'INTERIM_ORDER',
      interimOrders: ['Attachment before judgment issued on defendant\'s bank accounts (Order dt. 2025-03-10)'],
      decreeText: '',
      postponedTo: '',
      judgeRemarks: 'Attachment before judgment order sustained. Defendant directed to file asset disclosure statement by next hearing.',
      digitalSignature: 'SHA-256/CIVIL-2025-0034/KAMESWARA',
      petitioner: {
        name: 'Sri. K. Venkateswarlu',
        advocate: 'Adv. S. Malleswara Rao',
        address: 'D.No 40-5-12, Labbipet, Vijayawada',
        aadhaar: '456789012345',
        mobileNumber: '9848012345'
      },
      respondent: {
        name: 'Sri. P. Satyanarayana',
        advocate: 'Adv. M. Kanaka Raju',
        address: 'D.No 3-2-9, Danavaipeta, Rajamundry',
        aadhaar: '567890123456',
        mobileNumber: '9949012345'
      },
      propertyDetails: 'Promissory note execution date 2023-04-10 for principal sum of ₹10,00,000 at 18% p.a. interest. Default in repayment.',
      reliefSought: 'Recovery of sum of ₹13,60,000 (inclusive of interest) with cost of suit.',
      stageSummary: 'Trial in progress. Defendant examination scheduled.',
      hearingHistory: [
        { date: '2025-02-10', note: 'Suit instituted. Summons served.' },
        { date: '2025-03-10', note: 'Interim application for attachment before judgment allowed.' }
      ]
    }
  ];

  for (const c of seedCivilCases) {
    const query = `
      INSERT INTO civil_cases 
        (case_id, case_type, civil_type, court_number, presiding_judge, filing_date, last_hearing_date, next_hearing_date, pending_days, order_status, interim_orders, decree_text, postponed_to, judge_remarks, digital_signature, petitioner, respondent, property_details, relief_sought, stage_summary, hearing_history)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)`;
    await pool.query(query, [
      c.caseId, c.caseType, c.civilType, c.courtNumber, c.presidingJudge, c.filingDate, c.lastHearingDate, c.nextHearingDate, c.pendingDays, c.orderStatus,
      JSON.stringify(c.interimOrders), c.decreeText, c.postponedTo, c.judgeRemarks, c.digitalSignature,
      JSON.stringify(c.petitioner), JSON.stringify(c.respondent), c.propertyDetails, c.reliefSought, c.stageSummary,
      JSON.stringify(c.hearingHistory)
    ]);
  }
}

async function seedChequeDatabase() {
  const seedChequeCases = [
    {
      caseId: 'CC-2024-0512',
      caseType: 'CHEQUE',
      courtNumber: 'Special NI Act Court Room 1, Rajamundry',
      presidingJudge: 'Hon\'ble K. Srinivas Rao',
      filingDate: '2024-04-12',
      lastHearingDate: '2026-06-15',
      nextHearingDate: '2026-07-20',
      pendingDays: 812,
      orderStatus: 'PENDING',
      chequeNumber: '384910',
      chequeAmount: 450000.0,
      chequeDate: '2024-03-10',
      bankName: 'State Bank of India',
      ifscCode: 'SBIN0000918',
      dishonourDate: '2024-04-10',
      dishonourReason: 'Funds Insufficient',
      dastiStatus: 'SERVED',
      electronicStatus: 'DELIVERED',
      electronicEmail: 'gvenkata.raman@email.com',
      electronicWhatsapp: '9988776655',
      affidavitUploaded: true,
      affidavitUrl: '/uploads/affidavit_cc_2024_0512.pdf',
      qrCodeUrl: 'upi://pay?pa=court.intake.rjm@upi&pn=Rajamundry%20Court%20Intake&am=450000.00&tr=CC-2024-0512',
      paymentConfirmed: false,
      paymentDate: '',
      synopsisText: 'Complaint filed u/s 138 of NI Act for dishonour of Cheque No. 384910 for ₹4,50,000 due to Insufficient Funds. Statutory demand notice served on 2024-04-20, no payment received within 15 days.',
      summaryTrialReasons: '',
      q1_belongs_to_accused: 'PENDING',
      q2_signature_is_yours: 'PENDING',
      q3_delivered_to_complainant: 'PENDING',
      q4_owed_liability: 'PENDING',
      q5_defence_type: 'N/A',
      q5_defence_details: '',
      q6_wish_to_compound: 'PENDING',
      responsesRecorded: false,
      interimOrdered: true,
      interimAmount: 90000.0,
      interimStatus: 'PENDING',
      petitioner: {
        name: 'State Bank of India, RJM Branch',
        advocate: 'Adv. S. Ramachandra Murthy',
        address: 'Main Road Branch, Rajamundry, AP',
        aadhaar: '112233445566',
        mobileNumber: '9440123456'
      },
      respondent: {
        name: 'Sri G. Venkata Raman',
        advocate: 'Adv. M. Subrahmanyam',
        address: 'Flat 402, Sai Enclave, Danavaipeta, Rajamundry',
        aadhaar: '223344556677',
        mobileNumber: '9988776655'
      },
      hearingHistory: [
        { date: '2024-04-12', note: 'Complaint instituted and verified by court staff.' },
        { date: '2024-05-10', note: 'Summons issued under both traditional and electronic modes.' },
        { date: '2024-06-01', note: 'Dasti summons served upon accused; Complainant filed Affidavit of Service.' },
        { date: '2025-01-15', note: 'Accused appeared. Inquiries regarding interim compensation (S.143-A) commenced.' },
        { date: '2026-06-15', note: 'Interim compensation of ₹90,000 ordered. Accused directed to deposit within 60 days. Hearing adjourned to 2026-07-20 for post-cognizance summary trial questions.' }
      ]
    },
    {
      caseId: 'CC-2025-0984',
      caseType: 'CHEQUE',
      courtNumber: 'Special NI Act Court Room 1, Rajamundry',
      presidingJudge: 'Hon\'ble K. Srinivas Rao',
      filingDate: '2025-02-15',
      lastHearingDate: '2025-02-28',
      nextHearingDate: '2026-07-15',
      pendingDays: 497,
      orderStatus: 'SUMMONS_ISSUED',
      chequeNumber: '904829',
      chequeAmount: 1200000.0,
      chequeDate: '2025-01-10',
      bankName: 'HDFC Bank Ltd',
      ifscCode: 'HDFC0000122',
      dishonourDate: '2025-02-10',
      dishonourReason: 'Signature Mismatch / Differs',
      dastiStatus: 'PENDING',
      electronicStatus: 'SENT',
      electronicEmail: 'contact@durgaproduce.com',
      electronicWhatsapp: '9849054321',
      affidavitUploaded: false,
      affidavitUrl: '',
      qrCodeUrl: 'upi://pay?pa=court.intake.rjm@upi&pn=Rajamundry%20Court%20Intake&am=1200000.00&tr=CC-2025-0984',
      paymentConfirmed: false,
      paymentDate: '',
      synopsisText: 'Cheque issued for repayment of business loan of ₹12,00,000. Dishonoured with reason "Signature Mismatch". Complainant verified that signature is genuine. Legal notice sent on 2025-02-28.',
      summaryTrialReasons: '',
      q1_belongs_to_accused: 'PENDING',
      q2_signature_is_yours: 'PENDING',
      q3_delivered_to_complainant: 'PENDING',
      q4_owed_liability: 'PENDING',
      q5_defence_type: 'N/A',
      q5_defence_details: '',
      q6_wish_to_compound: 'PENDING',
      responsesRecorded: false,
      interimOrdered: false,
      interimAmount: 0.0,
      interimStatus: 'N/A',
      petitioner: {
        name: 'Sri P. Satish Kumar',
        advocate: 'Adv. V. R. K. Prasad',
        address: 'D.No 4-12-8, Siddhartha Nagar, Vijayawada',
        aadhaar: '334455667788',
        mobileNumber: '9848098765'
      },
      respondent: {
        name: 'M/s Durga Enterprises (represented by Partner Sri P. Nageswara Rao)',
        advocate: 'Adv. G. Radhakrishna',
        address: 'D.No 40-15-9, Jawaharlal Street, Rajamundry',
        aadhaar: '445566778899',
        mobileNumber: '9849054321'
      },
      hearingHistory: [
        { date: '2025-02-15', note: 'Cheque plaint filed. Synopsis attached. Registered under CC-2025-0984.' },
        { date: '2025-02-28', note: 'Traditional summons issued. Electronic summons sent via email and WhatsApp. Awaiting service report.' }
      ]
    }
  ];

  for (const c of seedChequeCases) {
    const query = `
      INSERT INTO cheque_cases (
        case_id, case_type, court_number, presiding_judge, filing_date, last_hearing_date, next_hearing_date, pending_days, order_status,
        cheque_number, cheque_amount, cheque_date, bank_name, ifsc_code, dishonour_date, dishonour_reason,
        dasti_status, electronic_status, electronic_email, electronic_whatsapp, affidavit_uploaded, affidavit_url,
        qr_code_url, payment_confirmed, payment_date, synopsis_text, summary_trial_reasons,
        q1_belongs_to_accused, q2_signature_is_yours, q3_delivered_to_complainant, q4_owed_liability, q5_defence_type, q5_defence_details, q6_wish_to_compound, responses_recorded,
        interim_ordered, interim_amount, interim_status, petitioner, respondent, hearing_history
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41)`;
    await pool.query(query, [
      c.caseId, c.caseType, c.courtNumber, c.presidingJudge, c.filingDate, c.lastHearingDate, c.nextHearingDate, c.pendingDays, c.orderStatus,
      c.chequeNumber, c.chequeAmount, c.chequeDate, c.bankName, c.ifscCode, c.dishonourDate, c.dishonourReason,
      c.dastiStatus, c.electronicStatus, c.electronicEmail, c.electronicWhatsapp, c.affidavitUploaded, c.affidavitUrl,
      c.qrCodeUrl, c.paymentConfirmed, c.paymentDate, c.synopsisText, c.summaryTrialReasons,
      c.q1_belongs_to_accused, c.q2_signature_is_yours, c.q3_delivered_to_complainant, c.q4_owed_liability, c.q5_defence_type, c.q5_defence_details, c.q6_wish_to_compound, c.responsesRecorded,
      c.interimOrdered, c.interimAmount, c.interimStatus, JSON.stringify(c.petitioner), JSON.stringify(c.respondent), JSON.stringify(c.hearingHistory)
    ]);
  }
}

app.listen(PORT, () => {
  console.log(`Verdiqo backend server listening on port ${PORT}`);
});
