/**
 * VERDIQO: BAIL MANAGEMENT SYSTEM ORCHESTRATOR
 * Quantex Intelligence Systems (P) Ltd.
 * Master App Shell, Login Controller, Bilingual Engine, and Persistent State Registry.
 */

import { VerificationEngine } from './utils/verificationEngine.js';
import { DashboardStaff } from './components/DashboardStaff.js';
import { DashboardJudge } from './components/DashboardJudge.js';
import { DashboardAdmin } from './components/DashboardAdmin.js';
import { DashboardCitizen } from './components/DashboardCitizen.js';
import { ReportViewer } from './components/ReportViewer.js';

// Pre-populated cases replicating the exact 8 cases from the user's reference mockup image
const INITIAL_DATABASE = [
    {
        caseNumber: 'BMS/2026/0042',
        firNumber: 'FIR/148/2026-RJM',
        ipcSections: 'IPC 420, 468',
        dateOfArrest: '2026-05-24',
        policeStation: 'Rajamundry Urban PS, Inspector S. Kumar',
        presidingJudge: 'Hon\'ble J. Kameswara Rao',
        bailType: 'First Bail',
        proposedBailAmount: 50000,
        hearingDate: '2026-05-29T10:30',
        currentStatus: 'Ready for Judge',
        orderStatus: 'PENDING',
        judgeRemarks: '',
        digitalSignature: '',
        accused: {
            fullName: 'Srinivas Rao Vemuri',
            dob: '1984-08-15',
            fathersName: 'Satyanarayana Vemuri',
            address: 'Flat 402, Sai Balaji Residency, Rajamundry, AP',
            mobileNumber: '9876543210',
            aadhaarNumber: '123456789012',
            panNumber: 'VEMUR1984S',
            ncrbCount: 0,
            prevBailsGranted: 0,
            prevBailsHonored: 0,
            abscondingCount: 0,
            travelRestricted: false,
            bankBalance6m: 35000
        },
        surety: {
            fullName: 'Madhava Rao Vemuri',
            relationToAccused: 'Brother',
            mobileNumber: '8765432109',
            aadhaarNumber: '876543210987',
            panNumber: 'LKJHG6789F',
            employmentDetails: 'Retired Government Clerk, Pension ₹35,000',
            monthlyIncome: 35000,
            activeBailCount: 0,
            propertyAddress: 'Ward No 8, Subhash Road, Rajamundry. Survey RS-104/12-C',
            surveyNumber: 'RS-104/12-C',
            propertyValuation: 650000,
            encumbranceStatus: 'CLEAN',
            mutationStatus: 'PENDING'
        },
        arguments: {
            prosecution: 'Objections: Possibility of tampering with witnesses.',
            defence: 'Accused is cooperative. Items recovered. No flight risk.'
        },
        checks: {}
    },
    {
        caseNumber: 'BMS/2026/0041',
        firNumber: 'FIR/102/2026-RJM',
        ipcSections: 'IPC 302',
        dateOfArrest: '2026-05-20',
        policeStation: 'RJM Rural PS, Inspector K. Ram',
        presidingJudge: 'Hon\'ble J. Kameswara Rao',
        bailType: 'Second Bail',
        proposedBailAmount: 150000,
        hearingDate: '2026-05-29T11:00',
        currentStatus: 'Checking',
        orderStatus: 'PENDING',
        judgeRemarks: '',
        digitalSignature: '',
        accused: {
            fullName: 'Suresh Babu',
            dob: '1998-05-10',
            fathersName: 'Rama Rao',
            address: 'D.No 4-9-2, Danavaipeta, Rajamundry, AP',
            mobileNumber: '9440987654',
            aadhaarNumber: '246813579024',
            panNumber: 'SURES1998R',
            ncrbCount: 1,
            prevBailsGranted: 0,
            prevBailsHonored: 0,
            abscondingCount: 0,
            travelRestricted: false,
            bankBalance6m: 12000
        },
        surety: {
            fullName: 'Rama Rao',
            relationToAccused: 'Father',
            mobileNumber: '9440987650',
            aadhaarNumber: '998877665544',
            panNumber: 'RAMAR1234N',
            employmentDetails: 'Farmer, Rajamundry',
            monthlyIncome: 25000,
            activeBailCount: 1,
            propertyAddress: 'Ward No 2, Danavaipeta, Rajamundry. Survey RS-242/8-B',
            surveyNumber: 'RS-242/8-B',
            propertyValuation: 400000,
            encumbranceStatus: 'CLEAN',
            mutationStatus: 'PENDING'
        },
        arguments: {
            prosecution: 'Severe charge (murder). Accused is highly risky.',
            defence: 'Accused acted in self-defence, zero absconding records.'
        },
        checks: {}
    },
    {
        caseNumber: 'BMS/2026/0040',
        firNumber: 'FIR/98/2026-RJM',
        ipcSections: 'NDPS Act S.20',
        dateOfArrest: '2026-05-15',
        policeStation: 'RJM Urban Crime Branch, Inspector G. Rao',
        presidingJudge: 'Hon\'ble J. Kameswara Rao',
        bailType: 'Anticipatory',
        proposedBailAmount: 200000,
        hearingDate: '2026-05-29T11:30',
        currentStatus: 'Ready for Judge',
        orderStatus: 'PENDING',
        judgeRemarks: '',
        digitalSignature: '',
        accused: {
            fullName: 'Anita Rao',
            dob: '1985-02-18',
            fathersName: 'Krishnam Raju',
            address: 'D.No 8-12, Danavaipeta, Rajamundry, AP',
            mobileNumber: '9440123456',
            aadhaarNumber: '456789012345',
            panNumber: 'ANITA1985K',
            ncrbCount: 3,
            prevBailsGranted: 2,
            prevBailsHonored: 1, // Default history
            abscondingCount: 1, // Absconding Alert!
            travelRestricted: true,
            bankBalance6m: 5000
        },
        surety: {
            fullName: 'Krishnam Raju',
            relationToAccused: 'Father',
            mobileNumber: '7702456789',
            aadhaarNumber: '901234567890',
            panNumber: 'KRISH6543K',
            employmentDetails: 'Merchant',
            monthlyIncome: 30000,
            activeBailCount: 3, // Overloaded active guarantees!
            propertyAddress: 'Survey RS-241/8-A, Danavaipeta, Rajamundry',
            surveyNumber: 'RS-241/8-A',
            propertyValuation: 90000, // Valuation is less than proposed bail!
            encumbranceStatus: 'ENCUMBERED', // Property encumbered!
            mutationStatus: 'PENDING'
        },
        arguments: {
            prosecution: 'CRITICAL OBJECT: Prior absconding events registered. Commercial quantity drug charges.',
            defence: 'Accused is suffering from chronic health issues, seeking bail on medical grounds.'
        },
        checks: {}
    },
    {
        caseNumber: 'BMS/2026/0039',
        firNumber: 'FIR/84/2026-RJM',
        ipcSections: 'IPC 379, 411',
        dateOfArrest: '2026-05-18',
        policeStation: 'Rajamundry Urban PS, Inspector S. Kumar',
        presidingJudge: 'Hon\'ble J. Kameswara Rao',
        bailType: 'First Bail',
        proposedBailAmount: 30000,
        hearingDate: '2026-05-29T14:00',
        currentStatus: 'Ready for Judge',
        orderStatus: 'PENDING',
        judgeRemarks: '',
        digitalSignature: '',
        accused: {
            fullName: 'Mohammed Ali',
            dob: '2004-03-22',
            fathersName: 'Abdul Rasheed',
            address: 'Ward 14, RJM Town, AP',
            mobileNumber: '9550123456',
            aadhaarNumber: '112233445566',
            panNumber: 'MOHAM2004A',
            ncrbCount: 0,
            prevBailsGranted: 0,
            prevBailsHonored: 0,
            abscondingCount: 0,
            travelRestricted: false,
            bankBalance6m: 20000
        },
        surety: {
            fullName: 'Abdul Rasheed',
            relationToAccused: 'Father',
            mobileNumber: '9550123450',
            aadhaarNumber: '887766554433',
            panNumber: 'ABDUL1234R',
            employmentDetails: 'Mechanic Shop Owner',
            monthlyIncome: 32000,
            activeBailCount: 0,
            propertyAddress: 'Survey RS-102/4, RJM Town',
            surveyNumber: 'RS-102/4',
            propertyValuation: 500000,
            encumbranceStatus: 'CLEAN',
            mutationStatus: 'PENDING'
        },
        arguments: {
            prosecution: 'Minor theft charges, recovery completed.',
            defence: 'Accused is a young student. First offence. Cooperation maintained.'
        },
        checks: {}
    },
    {
        caseNumber: 'BMS/2026/0038',
        firNumber: 'FIR/72/2026-RJM',
        ipcSections: 'IPC 498A, 406',
        dateOfArrest: '2026-05-22',
        policeStation: 'Women PS, Inspector T. Lakshmi',
        presidingJudge: 'Hon\'ble J. Kameswara Rao',
        bailType: 'First Bail',
        proposedBailAmount: 50000,
        hearingDate: '2026-05-29T14:30',
        currentStatus: 'Checking',
        orderStatus: 'PENDING',
        judgeRemarks: '',
        digitalSignature: '',
        accused: {
            fullName: 'Priya Nair',
            dob: '1990-09-12',
            fathersName: 'Gopalan Nair',
            address: 'Ward 2, Danavaipeta, Rajamundry, AP',
            mobileNumber: '7702987654',
            aadhaarNumber: '334455667788',
            panNumber: 'PRIYA1990G',
            ncrbCount: 0,
            prevBailsGranted: 0,
            prevBailsHonored: 0,
            abscondingCount: 0,
            travelRestricted: false,
            bankBalance6m: 45000
        },
        surety: {
            fullName: 'Gopalan Nair',
            relationToAccused: 'Father',
            mobileNumber: '7702987650',
            aadhaarNumber: '445566778899',
            panNumber: 'GOPAL9876N',
            employmentDetails: 'Retired bank manager',
            monthlyIncome: 55000,
            activeBailCount: 1,
            propertyAddress: 'Survey RS-105/9-A, Danavaipeta, Rajamundry',
            surveyNumber: 'RS-105/9-A',
            propertyValuation: 1200000,
            encumbranceStatus: 'CLEAN',
            mutationStatus: 'PENDING'
        },
        arguments: {
            prosecution: 'Objections: Domestic dispute case, potential threat.',
            defence: 'Accused seeking mutual resolution. Clean records.'
        },
        checks: {}
    },
    {
        caseNumber: 'BMS/2026/0037',
        firNumber: 'FIR/68/2026-RJM',
        ipcSections: 'PC Act S.7, 13',
        dateOfArrest: '2026-05-10',
        policeStation: 'ACB Division, Inspector V. Naidu',
        presidingJudge: 'Hon\'ble J. Kameswara Rao',
        bailType: 'Anticipatory',
        proposedBailAmount: 100000,
        hearingDate: '2026-05-29T15:00',
        currentStatus: 'Ready for Judge',
        orderStatus: 'PENDING',
        judgeRemarks: '',
        digitalSignature: '',
        accused: {
            fullName: 'Srinivas Reddy',
            dob: '1971-11-22',
            fathersName: 'Venkaiah Reddy',
            address: 'Syama Prasad Nagar, Rajamundry, AP',
            mobileNumber: '9988776655',
            aadhaarNumber: '778899001122',
            panNumber: 'SRINI1971V',
            ncrbCount: 2,
            prevBailsGranted: 1,
            prevBailsHonored: 0, // Default history
            abscondingCount: 1, // Absconding Alert!
            travelRestricted: true,
            bankBalance6m: 15000
        },
        surety: {
            fullName: 'Venkaiah Reddy',
            relationToAccused: 'Father',
            mobileNumber: '9988776650',
            aadhaarNumber: '665544332211',
            panNumber: 'VENKA7788R',
            employmentDetails: 'Farmer',
            monthlyIncome: 20000,
            activeBailCount: 2,
            propertyAddress: 'Survey RS-112/5, Rajamundry Rural',
            surveyNumber: 'RS-112/5',
            propertyValuation: 70000, // Valuation is less than ₹1,00,000 proposed bail!
            encumbranceStatus: 'ENCUMBERED', // Property encumbered!
            mutationStatus: 'PENDING'
        },
        arguments: {
            prosecution: 'Objections: Public corruption charges. Possibility of fleeing.',
            defence: 'Accused is a local citizen. Ready to deposit passport.'
        },
        checks: {}
    },
    {
        caseNumber: 'BMS/2026/0036',
        firNumber: 'FIR/55/2026-RJM',
        ipcSections: 'IPC 420',
        dateOfArrest: '2026-05-24',
        policeStation: 'Rajamundry Urban PS, Inspector S. Kumar',
        presidingJudge: 'Hon\'ble J. Kameswara Rao',
        bailType: 'First Bail',
        proposedBailAmount: 40000,
        hearingDate: '2026-05-29T15:30',
        currentStatus: 'Ready for Judge',
        orderStatus: 'PENDING',
        judgeRemarks: '',
        digitalSignature: '',
        accused: {
            fullName: 'Kavya Sharma',
            dob: '1997-03-22',
            fathersName: 'Rajesh Sharma',
            address: 'Ward 8, Rajamundry, AP',
            mobileNumber: '8899776655',
            aadhaarNumber: '990088776655',
            panNumber: 'KAVYA1997R',
            ncrbCount: 0,
            prevBailsGranted: 0,
            prevBailsHonored: 0,
            abscondingCount: 0,
            travelRestricted: false,
            bankBalance6m: 38000
        },
        surety: {
            fullName: 'Rajesh Sharma',
            relationToAccused: 'Father',
            mobileNumber: '8899776650',
            aadhaarNumber: '556677889900',
            panNumber: 'RAJES7788S',
            employmentDetails: 'Merchant Shop Owner',
            monthlyIncome: 45000,
            activeBailCount: 0,
            propertyAddress: 'Survey RS-106/12, Rajamundry',
            surveyNumber: 'RS-106/12',
            propertyValuation: 800000,
            encumbranceStatus: 'CLEAN',
            mutationStatus: 'PENDING'
        },
        arguments: {
            prosecution: 'Financial cheating charges.',
            defence: 'Accused is a young professional. Cooperative. Full recovery.'
        },
        checks: {}
    },
    {
        caseNumber: 'BMS/2026/0035',
        firNumber: 'FIR/44/2026-RJM',
        ipcSections: 'IPC 409, 468',
        dateOfArrest: '2026-05-26',
        policeStation: 'ACB Division, Inspector V. Naidu',
        presidingJudge: 'Hon\'ble J. Kameswara Rao',
        bailType: 'Second Bail',
        proposedBailAmount: 100000,
        hearingDate: '2026-05-29T16:00',
        currentStatus: 'Checking',
        orderStatus: 'PENDING',
        judgeRemarks: '',
        digitalSignature: '',
        accused: {
            fullName: 'Ramesh Yadav',
            dob: '1979-05-18',
            fathersName: 'Naresh Yadav',
            address: 'Ward 12, Rajamundry Urban, AP',
            mobileNumber: '7766554433',
            aadhaarNumber: '889900112233',
            panNumber: 'RAMES1979N',
            ncrbCount: 1,
            prevBailsGranted: 1,
            prevBailsHonored: 1,
            abscondingCount: 0,
            travelRestricted: false,
            bankBalance6m: 22000
        },
        surety: {
            fullName: 'Naresh Yadav',
            relationToAccused: 'Father',
            mobileNumber: '7766554430',
            aadhaarNumber: '332211009988',
            panNumber: 'NARES7766Y',
            employmentDetails: 'Retired Government Teacher',
            monthlyIncome: 38000,
            activeBailCount: 1,
            propertyAddress: 'Survey RS-108/4, Rajamundry',
            surveyNumber: 'RS-108/4',
            propertyValuation: 600000,
            encumbranceStatus: 'CLEAN',
            mutationStatus: 'PENDING'
        },
        arguments: {
            prosecution: 'Objections: Embezzlement of public funds, high amount.',
            defence: 'Accused is ready to comply with reporting intervals. Old age grounds.'
        },
        checks: {}
    }
];

class ApplicationState {
    constructor() {
        this.language = 'EN'; // 'EN' or 'HI'
        this.currentUser = null; // Active logged-in user object
        this.cases = [];
        this.staffActiveTab = 'status'; // Status Board is default tab to match reference mockup
        this.selectedCaseNumber = null;
        this.citizenSearchQuery = '';
        this.citizenActiveMobileTab = 'home';
        
        // Persistent theme configuration
        this.theme = localStorage.getItem('verdiqo_theme') || 'dark';
        this.applyTheme();
        
        this.initDatabase();
    }

    applyTheme() {
        if (this.theme === 'light') {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('verdiqo_theme', this.theme);
        this.applyTheme();
    }

    /**
     * Initializes the registry database and runs scoring logic
     */
    initDatabase() {
        const cached = localStorage.getItem('verdiqo_db');
        if (cached) {
            this.cases = JSON.parse(cached);
        } else {
            // Populate and run verification scores on initial datasets
            this.cases = INITIAL_DATABASE.map(c => {
                const idCheck = VerificationEngine.verifyIdentity(c.accused.aadhaarNumber, true, true);
                const finCheck = VerificationEngine.verifyFinancialCapacity(c.surety.panNumber, [35000, 36000, 38000], c.accused.bankBalance6m, c.accused.cibilScore || 680, c.proposedBailAmount);
                const riskCheck = VerificationEngine.calculateRiskScore(c.accused.ncrbCount, c.accused.prevBailsGranted, c.accused.prevBailsHonored, c.accused.abscondingCount, c.accused.travelRestricted);
                const suretyCheck = VerificationEngine.verifySuretyLoad(c.surety.activeBailCount, 0);
                const propCheck = VerificationEngine.verifyProperty(true, c.surety.fullName, c.surety.fullName, c.surety.encumbranceStatus === 'ENCUMBERED', c.surety.propertyValuation, c.proposedBailAmount);
                
                const recCheck = VerificationEngine.compileRecommendation(idCheck, finCheck, riskCheck, suretyCheck, propCheck);

                c.checks = {
                    identity: idCheck,
                    finance: finCheck,
                    risk: riskCheck,
                    suretyLoad: suretyCheck,
                    property: propCheck,
                    recommendation: recCheck
                };
                return c;
            });
            this.saveDatabase();
        }
    }

    saveDatabase() {
        localStorage.setItem('verdiqo_db', JSON.stringify(this.cases));
    }

    translate(enText, hiText) {
        return this.language === 'HI' ? hiText : enText;
    }

    setLanguage(lang) {
        this.language = lang;
    }

    login(role, username, password) {
        if (role === 'STAFF') {
            if (username === 'staff_rajamundry' || username === 'staff1') {
                this.currentUser = { name: 'K. Lakshmi', role: 'STAFF', designation: 'Court Bench Clerk', court: 'Rajamundry District Court' };
                return true;
            }
        } else if (role === 'JUDGE') {
            if (username === 'judge_kameswara' || username === 'judge1') {
                this.currentUser = { name: 'Hon\'ble J. Kameswara Rao', role: 'JUDGE', designation: 'Preceding Judge', court: 'Sessions Court Room 2' };
                return true;
            }
        } else if (role === 'ADMIN') {
            if (username === 'admin_prasad' || username === 'admin1') {
                this.currentUser = { name: 'K. Prasad Rao', role: 'ADMIN', designation: 'District Head Judge', court: 'East Godavari Judicial Division' };
                return true;
            }
        } else if (role === 'CITIZEN') {
            const matchedCase = this.cases.find(c => c.caseNumber === username || c.accused.aadhaarNumber.replace(/[- ]/g, '') === username.replace(/[- ]/g, ''));
            const citizenName = matchedCase ? matchedCase.accused.fullName : 'Srinivas Rao Vemuri';
            this.currentUser = { name: citizenName, role: 'CITIZEN', designation: 'Citizen Portal', court: 'Rajamundry division' };
            this.citizenSearchQuery = username;
            return true;
        }
        return false;
    }

    logout() {
        this.currentUser = null;
        this.selectedCaseNumber = null;
        this.citizenSearchQuery = '';
        this.citizenActiveMobileTab = 'home';
    }

    openReportViewer(caseRecord, forceReportId = null) {
        if (!forceReportId) {
            const reports = [
                { id: 1, name: '1. Bail Eligibility Assessment Report' },
                { id: 2, name: '2. Surety Verification Report' },
                { id: 3, name: '3. Property Mutation Order' },
                { id: 4, name: '4. Order of Bail Adjudication (Draft)' },
                { id: 5, name: '5. Post-Bail Compliance Tracking Log' }
            ];
            
            const promptHtml = reports.map(r => `
                <button class="btn btn-primary btn-trigger-print-doc" data-id="${r.id}" style="width:100%; text-align:left; padding: 12px 20px; font-size:14px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                    <span>${r.name}</span>
                    <span>➔</span>
                </button>
            `).join('');

            const reportSelector = document.createElement('div');
            reportSelector.id = 'report-selection-modal';
            reportSelector.className = 'modal-overlay';
            reportSelector.innerHTML = `
                <div class="modal-content-container" style="max-width: 500px;">
                    <div class="modal-top-actions">
                        <h3>Select Legal Document Report</h3>
                        <button id="close-selector-btn" class="modal-close-btn">&times;</button>
                    </div>
                    <div style="padding: 24px; background-color: var(--color-bg-dark);">
                        ${promptHtml}
                    </div>
                </div>
            `;
            document.body.appendChild(reportSelector);

            reportSelector.querySelector('#close-selector-btn').addEventListener('click', () => {
                reportSelector.remove();
            });

            reportSelector.querySelectorAll('.btn-trigger-print-doc').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(e.currentTarget.getAttribute('data-id'));
                    reportSelector.remove();
                    ReportViewer.show(id, caseRecord, () => {});
                });
            });
        } else {
            ReportViewer.show(forceReportId, caseRecord, () => {});
        }
    }
}

// Initialise App State
const AppState = new ApplicationState();

// BIND DOM ROUTER
function updateUI() {
    const root = document.getElementById('app-root');
    
    // Render Login Screen if not logged in
    if (!AppState.currentUser) {
        renderLoginPortal(root);
        return;
    }

    const role = AppState.currentUser.role;

    // Render Top Navbar and Dashboard Shell replicating reference mockup perfectly with dynamic theme icon toggler
    root.innerHTML = `
        <div class="app-wrapper">
            <header class="top-navbar">
                <div class="brand-section">
                    <div class="brand-logo-box">⚖️</div>
                    <div class="brand-titles">
                        <h1>Bail Management System</h1>
                        <p>QUANTEX INTELLIGENCE SYSTEMS · Rajamundry, AP</p>
                    </div>
                </div>
                
                <div class="nav-buttons-container">
                    <!-- Bilingual Language Switcher (EN / HI) -->
                    <button class="theme-toggle-btn-mock" id="global-lang-toggle" title="Switch Language (🌐 EN / HI)" style="width: 58px; font-size: 11.5px; font-weight: 800; font-family: var(--font-mono); color: var(--color-gold-light); display: inline-flex; align-items: center; justify-content: center; gap: 4px; margin-right: 8px;">
                        <span>🌐</span>
                        <span>${AppState.language}</span>
                    </button>

                    <!-- Dynamic Light / Dark mode toggle (Sun / Moon SVG) -->
                    <button class="theme-toggle-btn-mock" id="global-theme-toggle" title="Toggle Light/Dark Theme">
                        ${AppState.theme === 'dark' 
                            ? `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#38bdf8" stroke-width="2.5" style="vertical-align:middle;"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>` 
                            : `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#b45309" stroke-width="2.5" style="vertical-align:middle;"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`}
                    </button>
                    
                    <button class="btn btn-secondary" id="global-logout-btn" style="margin-left: 12px; font-size: 11px; padding: 6px 12px;">Logout</button>
                </div>
            </header>
            
            <main class="main-content" id="dashboard-mount-point"></main>
        </div>
    `;

    root.querySelector('#global-lang-toggle').addEventListener('click', () => {
        AppState.setLanguage(AppState.language === 'EN' ? 'HI' : 'EN');
        updateUI();
    });

    root.querySelector('#global-theme-toggle').addEventListener('click', () => {
        AppState.toggleTheme();
        updateUI();
    });

    root.querySelector('#global-logout-btn').addEventListener('click', () => {
        AppState.logout();
        updateUI();
    });

    // Mount specific dashboard
    const mountPoint = root.querySelector('#dashboard-mount-point');
    const activeRole = AppState.currentUser.role;
    
    if (activeRole === 'STAFF') {
        DashboardStaff.render(mountPoint, AppState, updateUI);
    } else if (activeRole === 'JUDGE') {
        DashboardJudge.render(mountPoint, AppState, updateUI);
    } else if (activeRole === 'ADMIN') {
        DashboardAdmin.render(mountPoint, AppState, updateUI);
    } else if (activeRole === 'CITIZEN') {
        DashboardCitizen.render(mountPoint, AppState, updateUI);
    }
}

function renderLoginPortal(root) {
    let selectedRole = 'STAFF';
    
    const drawForm = () => {
        let inputFields = '';
        let defaultUser = 'staff_rajamundry';
        let defaultPass = 'court123';
        if (selectedRole === 'JUDGE') {
            defaultUser = 'judge_kameswara';
            defaultPass = 'justice789';
        } else if (selectedRole === 'ADMIN') {
            defaultUser = 'admin_prasad';
            defaultPass = 'district456';
        }

        if (selectedRole === 'CITIZEN') {
            inputFields = `
                <div class="form-group">
                    <label>Aadhaar / Case Number</label>
                    <input type="text" class="form-input code-font" id="login-username" required placeholder="Aadhaar or Case No." value="BMS/2026/0042">
                </div>
                <div class="form-group">
                    <label>OTP Verification</label>
                    <input type="password" class="form-input code-font" id="login-password" required value="123456" disabled>
                </div>
            `;
        } else {
            inputFields = `
                <div class="form-group">
                    <label>System Username</label>
                    <input type="text" class="form-input code-font" id="login-username" required value="${defaultUser}">
                </div>
                <div class="form-group">
                    <label>Access Password</label>
                    <input type="password" class="form-input code-font" id="login-password" required value="${defaultPass}">
                </div>
            `;
        }

        root.innerHTML = `
            <div class="app-wrapper">
                <header class="top-navbar" style="position:static;">
                    <div class="brand-section">
                        <div class="brand-logo-box">⚖️</div>
                        <div class="brand-titles">
                            <h1>Bail Management System</h1>
                            <p>QUANTEX INTELLIGENCE SYSTEMS · Rajamundry, AP</p>
                        </div>
                    </div>
                    <div class="nav-buttons-container">
                        <!-- Bilingual Language Switcher (EN / HI) -->
                        <button class="theme-toggle-btn-mock" id="global-lang-toggle-login" title="Switch Language (🌐 EN / HI)" style="width: 58px; font-size: 11.5px; font-weight: 800; font-family: var(--font-mono); color: var(--color-gold-light); display: inline-flex; align-items: center; justify-content: center; gap: 4px; margin-right: 8px;">
                            <span>🌐</span>
                            <span>${AppState.language}</span>
                        </button>

                        <!-- Theme Toggler in secure login header (Sun / Moon SVG) -->
                        <button class="theme-toggle-btn-mock" id="global-theme-toggle-login" title="Toggle Light/Dark Theme">
                            ${AppState.theme === 'dark' 
                                ? `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#38bdf8" stroke-width="2.5" style="vertical-align:middle;"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>` 
                                : `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#b45309" stroke-width="2.5" style="vertical-align:middle;"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`}
                        </button>
                    </div>
                </header>
                
                <div class="login-container">
                    <div class="login-card">
                        <div class="login-header">
                            <h2>VERDIQO SECURE LOGIN</h2>
                            <p>Quantex Adjudication Systems Portal</p>
                        </div>
                        <div class="login-body">
                            <div class="role-selector-grid">
                                <div class="role-option ${selectedRole === 'STAFF' ? 'active' : ''}" data-role="STAFF">
                                    <div class="gov-emblem-badge" style="margin-bottom:8px;">
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                    </div>
                                    <span>Court Staff</span>
                                </div>
                                <div class="role-option ${selectedRole === 'JUDGE' ? 'active' : ''}" data-role="JUDGE">
                                    <div class="gov-emblem-badge" style="margin-bottom:8px;">
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><path d="M12 2v20M5 7h14M5 7L3 13h4L5 7zm14 0l-2 6h4l-2-6zM12 22h6M12 22H6"/></svg>
                                    </div>
                                    <span>Preceding Judge</span>
                                </div>
                                <div class="role-option ${selectedRole === 'ADMIN' ? 'active' : ''}" data-role="ADMIN">
                                    <div class="gov-emblem-badge" style="margin-bottom:8px;">
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                                    </div>
                                    <span>District Head Judge</span>
                                </div>
                                <div class="role-option ${selectedRole === 'CITIZEN' ? 'active' : ''}" data-role="CITIZEN">
                                    <div class="gov-emblem-badge" style="margin-bottom:8px;">
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                                    </div>
                                    <span>Citizen Tracking</span>
                                </div>
                            </div>
                            
                            <form id="login-form-submit">
                                ${inputFields}
                                <button type="submit" class="login-btn" style="margin-top:20px; display:flex; align-items:center; justify-content:center; gap:6px; width:100%;">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" style="vertical-align:middle;"><polyline points="20 6 9 17 4 12"/></svg>
                                    <span>Cryptographic Login Verification</span>
                                </button>
                            </form>
                            
                            <div class="credential-tip">
                                <strong>Pre-defined Sandboxed Login Credentials:</strong>
                                ${selectedRole === 'STAFF' ? '<p>User: staff_rajamundry | Pass: court123</p>' : ''}
                                ${selectedRole === 'JUDGE' ? '<p>User: judge_kameswara | Pass: justice789</p>' : ''}
                                ${selectedRole === 'ADMIN' ? '<p>User: admin_prasad | Pass: district456</p>' : ''}
                                ${selectedRole === 'CITIZEN' ? '<p>Aadhaar / Case Number: BMS/2026/0042 (OTP: 123456)</p>' : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        root.querySelectorAll('.role-option').forEach(opt => {
            opt.addEventListener('click', (e) => {
                selectedRole = e.currentTarget.getAttribute('data-role');
                drawForm();
            });
        });

        root.querySelector('#global-lang-toggle-login').addEventListener('click', () => {
            AppState.setLanguage(AppState.language === 'EN' ? 'HI' : 'EN');
            drawForm();
        });

        root.querySelector('#global-theme-toggle-login').addEventListener('click', () => {
            AppState.toggleTheme();
            drawForm();
        });

        root.querySelector('#login-form-submit').addEventListener('submit', (e) => {
            e.preventDefault();
            const u = root.querySelector('#login-username').value;
            const p = root.querySelector('#login-password').value;
            
            const success = AppState.login(selectedRole, u, p);
            if (success) {
                updateUI();
            } else {
                alert('Access Denied. Signature verification mismatch.');
            }
        });
    };

    drawForm();
}

window.addEventListener('DOMContentLoaded', () => {
    updateUI();
});
