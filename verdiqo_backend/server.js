// verdiqo_backend/server.js

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
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
console.log(`Frontend served at: http://localhost:${process.env.PORT || 3000}`);



// Initialize SQLite database
const dbPath = path.resolve(__dirname, 'verdiqo.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database at:', dbPath);
    initializeTables();
  }
});

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
      reasonsHi.push('इमिग्रेशन फ्लाइट-रिस्क वॉच लिस्ट फ्लैग सक्रिय (+15 जोखिम)');
    }

    if (prevBailsGranted > 0) {
      const defaults = prevBailsGranted - prevBailsHonored;
      if (defaults > 0) {
        score += 20;
        reasons.push(`Defaulted on previous bail conditions in ${defaults} cases (+20 Risk)`);
        reasonsHi.push(`पिछले ${defaults} मामलों में ज़मानत शर्तों का उल्लंघन किया (+20 जोखिम)`);
      } else {
        score -= 10;
        reasons.push('Excellent compliance history on previous granted bail (-10 Risk reduction)');
        reasonsHi.push('पूर्व में स्वीकृत ज़मानत पर उत्कृष्ट अनुपालन इतिहास (-10 जोखिम में कमी)');
      }
    }

    score = Math.max(0, Math.min(score, 100));

    let riskLevel = 'LOW';
    if (score > 60) riskLevel = 'HIGH';
    else if (score > 30) riskLevel = 'MEDIUM';

    return { score, riskLevel, reasons, reasonsHi };
  },

  verifySuretyLoad(activeBailCount, pastDefaults) {
    if (pastDefaults > 0) {
      return {
        status: 'DISQUALIFIED',
        reasonEn: `Disqualified. Surety defaulted on guarantees in other courts (${pastDefaults} past defaults).`,
        reasonHi: `अयोग्य। ज़मानतदार अन्य न्यायालयों में गारंटी देने में चूक गया (${pastDefaults} पिछली चूकें)।`
      };
    }
    if (activeBailCount >= 3) {
      return {
        status: 'DISQUALIFIED',
        reasonEn: `Disqualified. Active bail guarantees limit exceeded. Currently holding ${activeBailCount} active commitments.`,
        reasonHi: `अयोग्य। सक्रिय ज़मानत गारंटी सीमा से अधिक। वर्तमान में ${activeBailCount} सक्रिय प्रतिबद्धताएं हैं।`
      };
    }
    if (activeBailCount === 2) {
      return {
        status: 'OVERLOADED',
        reasonEn: `Warning: High Surety Load. Currently holding ${activeBailCount} active commitments across courts. Bordering limits.`,
        reasonHi: `चेतावनी: उच्च ज़मानत भार। वर्तमान में न्यायालयों में ${activeBailCount} सक्रिय प्रतिबद्धताएं हैं। सीमा के करीब।`
      };
    }
    return {
      status: 'CLEAR',
      reasonEn: `Clearance granted. Surety holds ${activeBailCount} active guarantee(s). Well within legal limits.`,
      reasonHi: `मंजूरी दी गई। ज़मानतदार के पास ${activeBailCount} सक्रिय गारंटी है। कानूनी सीमाओं के भीतर।`
    };
  },

  verifyProperty(hasProperty, ownerName, registryOwner, encumbered, valuation, proposedBailAmount) {
    if (!hasProperty) {
      return {
        status: 'N/A',
        reasonEn: 'No property surety pledged. Individual personal surety submitted.',
        reasonHi: 'कोई संपत्ति ज़मानत गिरवी नहीं रखी गई। व्यक्तिगत ज़मानत प्रस्तुत की गई।'
      };
    }
    if (ownerName.toLowerCase().trim() !== registryOwner.toLowerCase().trim()) {
      return {
        status: 'BLOCKED',
        reasonEn: `Property title mismatch. Declared owner is "${ownerName}", but Revenue Land Registry records show "${registryOwner}".`,
        reasonHi: `संपत्ति के स्वामित्व का मिलान नहीं हुआ। घोषित स्वामी "${ownerName}" है, लेकिन राजस्व भूमि रजिस्ट्री रिकॉर्ड "${registryOwner}" दिखाता है।`
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

// Scaffold SQLite database tables
function initializeTables() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS court_cases (
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
      supporting_docs TEXT, -- JSON string array
      bail_type TEXT,
      proposed_bail_amount REAL,
      proposed_conditions TEXT, -- JSON string array
      hearing_date TEXT,
      current_status TEXT,
      order_status TEXT,
      judge_remarks TEXT,
      digital_signature TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS accused (
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
      monthly_income REAL,
      bank_account TEXT,
      cibil_score INTEGER,
      criminal_history TEXT,
      ncrb_count INTEGER,
      prev_bails_granted INTEGER,
      prev_bails_honored INTEGER,
      absconding_count INTEGER,
      travel_restricted INTEGER, -- boolean as 0/1
      bank_balance_6m REAL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS sureties (
      case_number TEXT PRIMARY KEY,
      surety_type TEXT,
      full_name TEXT,
      relation_to_accused TEXT,
      mobile_number TEXT,
      aadhaar_number TEXT,
      pan_number TEXT,
      employment_details TEXT,
      monthly_income REAL,
      active_bail_count INTEGER,
      property_address TEXT,
      survey_number TEXT,
      property_valuation REAL,
      property_ownership_doc TEXT,
      property_revenue_record TEXT,
      encumbrance_status TEXT,
      mutation_status TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS arguments (
      case_number TEXT PRIMARY KEY,
      prosecution TEXT,
      defence TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS checks (
      case_number TEXT PRIMARY KEY,
      checks_json TEXT -- JSON stringified result map
    )`);

    // Check if seeding is required
    db.get("SELECT count(*) as count FROM court_cases", (err, row) => {
      if (row.count === 0) {
        console.log("Seeding database with default court cases...");
        seedDatabase();
      }
    });
  });
}

// REST API ROUTES
app.post('/api/auth/login', (req, res) => {
  const { username, password, role } = req.body;
  // Simple credential matching for demo purposes
  if (password === 'password123') {
    return res.status(200).json({ success: true, username, role, token: `JWT-MOCK-${username}-${role}` });
  }
  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

app.get('/api/cases', (req, res) => {
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

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const cases = rows.map(row => ({
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
  });
});

app.post('/api/cases', (req, res) => {
  const c = req.body;
  const checks = runScoringForCase(c);

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    const ccStmt = db.prepare(`INSERT OR REPLACE INTO court_cases 
      (case_number, fir_number, ipc_sections, date_of_arrest, police_station, presiding_judge, judge_id, court_location, previous_court_orders, filing_date, supporting_docs, bail_type, proposed_bail_amount, proposed_conditions, hearing_date, current_status, order_status, judge_remarks, digital_signature) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    
    ccStmt.run(
      c.caseNumber, c.firNumber, c.ipcSections, c.dateOfArrest, c.policeStation, c.presidingJudge, c.judgeId, c.courtLocation, c.previousCourtOrders, c.filingDate,
      JSON.stringify(c.supportingDocs), c.bailType, c.proposedBailAmount, JSON.stringify(c.proposedConditions), c.hearingDate, c.currentStatus, c.orderStatus, c.judgeRemarks || '', c.digitalSignature || ''
    );
    ccStmt.finalize();

    const accStmt = db.prepare(`INSERT OR REPLACE INTO accused 
      (case_number, full_name, dob, fathers_name, address, mobile_number, aadhaar_number, pan_number, driving_license, passport_number, employment_details, monthly_income, bank_account, cibil_score, criminal_history, ncrb_count, prev_bails_granted, prev_bails_honored, absconding_count, travel_restricted, bank_balance_6m) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    
    accStmt.run(
      c.caseNumber, c.accused.fullName, c.accused.dob, c.accused.fathersName, c.accused.address, c.accused.mobileNumber, c.accused.aadhaarNumber, c.accused.panNumber, c.accused.drivingLicense, c.accused.passportNumber,
      c.accused.employmentDetails, c.accused.monthlyIncome, c.accused.bankAccount, c.accused.cibilScore, c.accused.criminalHistory, c.accused.ncrbCount, c.accused.prevBailsGranted, c.accused.prevBailsHonored, c.accused.abscondingCount,
      c.accused.travelRestricted ? 1 : 0, c.accused.bankBalance6m
    );
    accStmt.finalize();

    const surStmt = db.prepare(`INSERT OR REPLACE INTO sureties 
      (case_number, surety_type, full_name, relation_to_accused, mobile_number, aadhaar_number, pan_number, employment_details, monthly_income, active_bail_count, property_address, survey_number, property_valuation, property_ownership_doc, property_revenue_record, encumbrance_status, mutation_status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    
    surStmt.run(
      c.caseNumber, c.surety.suretyType, c.surety.fullName, c.surety.relationToAccused, c.surety.mobileNumber, c.surety.aadhaarNumber, c.surety.panNumber, c.surety.employmentDetails, c.surety.monthlyIncome, c.surety.activeBailCount,
      c.surety.propertyAddress, c.surety.surveyNumber, c.surety.propertyValuation, c.surety.propertyOwnershipDoc, c.surety.propertyRevenueRecord, c.surety.encumbranceStatus, c.surety.mutationStatus
    );
    surStmt.finalize();

    const argStmt = db.prepare(`INSERT OR REPLACE INTO arguments (case_number, prosecution, defence) VALUES (?, ?, ?)`);
    argStmt.run(c.caseNumber, c.arguments.prosecution, c.arguments.defence);
    argStmt.finalize();

    const chkStmt = db.prepare(`INSERT OR REPLACE INTO checks (case_number, checks_json) VALUES (?, ?)`);
    chkStmt.run(c.caseNumber, JSON.stringify(checks));
    chkStmt.finalize();

    db.run("COMMIT", (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      c.checks = checks;
      res.status(201).json(c);
    });
  });
});

app.put('/api/cases/:caseNumber/verdict', (req, res) => {
  const { caseNumber } = req.params;
  const { verdict, remarks, signature } = req.body;

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    const statusStr = verdict === 'ADJOURNED' ? 'Adjourned' : 'Adjudicated';
    db.run(
      `UPDATE court_cases 
       SET order_status = ?, judge_remarks = ?, digital_signature = ?, current_status = ? 
       WHERE case_number = ?`,
      [verdict, remarks, signature, statusStr, caseNumber]
    );

    if (verdict === 'GRANTED' || verdict === 'GRANTED_WITH_CONDITIONS') {
      db.run(
        `UPDATE sureties 
         SET mutation_status = 'COMPLETED' 
         WHERE case_number = ?`,
        [caseNumber]
      );
    }

    db.run("COMMIT", (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ success: true, message: 'Verdict updated successfully' });
    });
  });
});

function seedDatabase() {
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
      proposedConditions: ['Weekly Reporting', 'Passport Deposit', 'Witness Contact Barred'],
      hearingDate: '2026-05-29T11:00',
      currentStatus: 'Checking',
      orderStatus: 'PENDING',
      judgeRemarks: '',
      digitalSignature: '',
      accused: {
        fullName: 'Suresh Babu',
        dob: '1998-05-10',
        fathersName: 'Rama Rao',
        address: 'Danavaipeta, Rajamundry',
        mobileNumber: '9440987654',
        aadhaarNumber: '246813579024',
        panNumber: 'SURES1998R',
        drivingLicense: 'AP05-2023-9847291',
        passportNumber: 'V2948194',
        employmentDetails: 'Student',
        monthlyIncome: 0,
        bankAccount: 'HDFC A/c 93847294827',
        cibilScore: 580,
        criminalHistory: '1 prior arrest.',
        ncrbCount: 1,
        prevBailsGranted: 0,
        prevBailsHonored: 0,
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

  seedCases.forEach(c => {
    const checks = runScoringForCase(c);
    db.serialize(() => {
      db.run(`INSERT INTO court_cases 
        (case_number, fir_number, ipc_sections, date_of_arrest, police_station, presiding_judge, judge_id, court_location, previous_court_orders, filing_date, supporting_docs, bail_type, proposed_bail_amount, proposed_conditions, hearing_date, current_status, order_status, judge_remarks, digital_signature)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [c.caseNumber, c.firNumber, c.ipcSections, c.dateOfArrest, c.policeStation, c.presidingJudge, c.judgeId, c.courtLocation, c.previousCourtOrders, c.filingDate,
        JSON.stringify(c.supportingDocs), c.bailType, c.proposedBailAmount, JSON.stringify(c.proposedConditions), c.hearingDate, c.currentStatus, c.orderStatus, c.judgeRemarks, c.digitalSignature]
      );
      
      db.run(`INSERT INTO accused 
        (case_number, full_name, dob, fathers_name, address, mobile_number, aadhaar_number, pan_number, driving_license, passport_number, employment_details, monthly_income, bank_account, cibil_score, criminal_history, ncrb_count, prev_bails_granted, prev_bails_honored, absconding_count, travel_restricted, bank_balance_6m)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [c.caseNumber, c.accused.fullName, c.accused.dob, c.accused.fathersName, c.accused.address, c.accused.mobileNumber, c.accused.aadhaarNumber, c.accused.panNumber, c.accused.drivingLicense, c.accused.passportNumber,
        c.accused.employmentDetails, c.accused.monthlyIncome, c.accused.bankAccount, c.accused.cibilScore, c.accused.criminalHistory, c.accused.ncrbCount, c.accused.prevBailsGranted, c.accused.prevBailsHonored, c.accused.abscondingCount,
        c.accused.travelRestricted ? 1 : 0, c.accused.bankBalance6m]
      );

      db.run(`INSERT INTO sureties 
        (case_number, surety_type, full_name, relation_to_accused, mobile_number, aadhaar_number, pan_number, employment_details, monthly_income, active_bail_count, property_address, survey_number, property_valuation, property_ownership_doc, property_revenue_record, encumbrance_status, mutation_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [c.caseNumber, c.surety.suretyType, c.surety.fullName, c.surety.relationToAccused, c.surety.mobileNumber, c.surety.aadhaarNumber, c.surety.panNumber, c.surety.employmentDetails, c.surety.monthlyIncome, c.surety.activeBailCount,
        c.surety.propertyAddress, c.surety.surveyNumber, c.surety.propertyValuation, c.surety.propertyOwnershipDoc, c.surety.propertyRevenueRecord, c.surety.encumbranceStatus, c.surety.mutationStatus]
      );

      db.run(`INSERT INTO arguments (case_number, prosecution, defence) VALUES (?, ?, ?)`, [c.caseNumber, c.arguments.prosecution, c.arguments.defence]);
      db.run(`INSERT INTO checks (case_number, checks_json) VALUES (?, ?)`, [c.caseNumber, JSON.stringify(checks)]);
    });
  });
}

app.listen(PORT, () => {
  console.log(`Verdiqo backend server listening on port ${PORT}`);
});
