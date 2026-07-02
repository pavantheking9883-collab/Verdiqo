/**
 * VERDIQO: CHEQUE CASE WORKFLOW VERIFICATION TEST
 * Simulates backend REST operations to verify Section 138 NI Act flows.
 */

const http = require('http');

function request(method, path, body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    body: data ? JSON.parse(data) : null
                });
            });
        });

        req.on('error', (err) => reject(err));

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function verify() {
    console.log('Starting S.138 Cheque Case Workflow Test...');
    
    // 1. Register a new cheque case
    const caseId = `CC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCasePayload = {
        caseId,
        case_id: caseId,
        caseType: 'CHEQUE',
        courtNumber: 'Special NI Act Court Room 1, Rajamundry',
        presidingJudge: "Hon'ble K. Srinivas Rao",
        filingDate: '2026-07-02',
        lastHearingDate: '2026-07-02',
        nextHearingDate: '2026-07-20',
        pendingDays: 0,
        orderStatus: 'PENDING',
        chequeNumber: '524189',
        chequeAmount: 75000,
        chequeDate: '2026-06-15',
        bankName: 'State Bank of India',
        ifscCode: 'SBIN0000918',
        dishonourDate: '2026-06-25',
        dishonourReason: 'Funds Insufficient',
        dastiStatus: 'SERVED',
        electronicStatus: 'SENT',
        electronicEmail: 'venkat.raman@outlook.com',
        electronicWhatsapp: '9988776655',
        affidavitUploaded: true,
        affidavitUrl: '/uploads/affidavit.pdf',
        qrCodeUrl: `upi://pay?pa=court.intake.rjm@upi&pn=Rajamundry%20Court%20Intake&am=75000&tr=${caseId}`,
        paymentConfirmed: false,
        paymentDate: '',
        synopsisText: 'Cheque of Rs 75,000 dishonoured for insufficient funds.',
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
            name: 'K. Pavan Kumar',
            advocate: 'K. S. Murthy',
            mobileNumber: '9848022338',
            aadhaar: '123456789012',
            address: 'Flat 402, Sai Residency, Rajamundry'
        },
        respondent: {
            name: 'B. Venkata Raman',
            advocate: '',
            mobileNumber: '9988776655',
            aadhaar: '',
            address: 'Door No 4-12, Main Bazar, Rajamundry'
        },
        hearingHistory: [
            { date: '2026-07-02', note: `NI Act Section 138 Plaint registered. Case ID allocated: ${caseId}.` }
        ]
    };

    console.log(`[POST] Registering Case ${caseId}...`);
    const registerRes = await request('POST', '/api/cheque-cases', newCasePayload);
    if (registerRes.statusCode === 200 || registerRes.statusCode === 201) {
        console.log('✓ Case registered successfully!');
    } else {
        throw new Error(`Failed case registration, Status: ${registerRes.statusCode}`);
    }

    // 2. Fetch case list and verify presence
    console.log('[GET] Verifying case presence in database...');
    const listRes = await request('GET', '/api/cheque-cases');
    const cases = listRes.body || [];
    const matched = cases.find(c => c.caseId === caseId);
    if (matched) {
        console.log(`✓ Case found in registry. Status: ${matched.orderStatus}, PaymentConfirmed: ${matched.paymentConfirmed}`);
    } else {
        throw new Error('Case not found in database registry!');
    }

    // 3. Compromise / Pay to settle case
    console.log(`[POST] Simulating UPI payment to compound case ${caseId}...`);
    const payRes = await request('POST', `/api/cheque-cases/${caseId}/pay`);
    if (payRes.statusCode === 200) {
        console.log('✓ Payment call succeeded.');
    } else {
        throw new Error(`Payment failed. Status: ${payRes.statusCode}`);
    }

    // 4. Verify status compounding
    console.log('[GET] Verifying final compounding status...');
    const verifyRes = await request('GET', '/api/cheque-cases');
    const verifiedCases = verifyRes.body || [];
    const verifiedCase = verifiedCases.find(c => c.caseId === caseId);
    if (verifiedCase && verifiedCase.orderStatus === 'COMPOUNDED' && verifiedCase.paymentConfirmed) {
        console.log('✓ SUCCESS: Case status set to COMPOUNDED and paymentConfirmed is true!');
    } else {
        throw new Error(`Failed compounding verification. Status: ${verifiedCase ? verifiedCase.orderStatus : 'not found'}`);
    }

    console.log('\n=================================================');
    console.log('S.138 Cheque Case Workflow Test passed successfully!');
    console.log('=================================================');
}

verify().catch(err => {
    console.error('❌ Test failed with error:', err);
    process.exit(1);
});
