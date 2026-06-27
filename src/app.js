/**
 * VERDIQO: BAIL MANAGEMENT SYSTEM ORCHESTRATOR
 * Quantex Intelligence Systems (P) Ltd.
 * Master App Shell, Login Controller, Bilingual Engine, and Persistent State Registry.
 */

import { VerificationEngine } from './utils/verificationEngine.js';
import { DashboardStaff } from './components/DashboardStaff.js';
import { DashboardJudge } from './components/DashboardJudge.js';
import { DashboardCivilJudge } from './components/DashboardCivilJudge.js';
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
        judgeId: 'JUDGE-KAMESWARA-2026',
        courtLocation: 'Sessions Court Room 2, Rajamundry',
        caseStatus: 'Ready for Judge',
        previousCourtOrders: 'First bail application rejected on 2026-05-18 by Magistrate Court due to jurisdictional limitations.',
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
            address: 'Flat 402, Sai Balaji Residency, Rajamundry, AP',
            mobileNumber: '9876543210',
            aadhaarNumber: '123456789012',
            panNumber: 'VEMUR1984S',
            drivingLicense: 'AP05-2026-0042841',
            passportNumber: 'U8374928',
            employmentDetails: 'Account Manager, TechSolutions Ltd',
            monthlyIncome: 45000,
            bankAccount: 'SBI A/c 38472948274',
            cibilScore: 740,
            criminalHistory: 'No active convictions. Zero flight defaults. Cooperative with investigations.',
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
            employmentDetails: 'Retired Government Clerk, Pension ₹35,000',
            monthlyIncome: 35000,
            activeBailCount: 0,
            propertyAddress: 'Ward No 8, Subhash Road, Rajamundry. Survey RS-104/12-C',
            surveyNumber: 'RS-104/12-C',
            propertyValuation: 650000,
            propertyOwnershipDoc: 'Title Deed ID: TD-2026-RJM-482',
            propertyRevenueRecord: 'Patta No: P-8472-RJM',
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
        judgeId: 'JUDGE-KAMESWARA-2026',
        courtLocation: 'Sessions Court Room 2, Rajamundry',
        caseStatus: 'Ready for Judge',
        previousCourtOrders: 'First bail rejected due to severity of murder charges and pending forensic analysis.',
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
            address: 'D.No 4-9-2, Danavaipeta, Rajamundry, AP',
            mobileNumber: '9440987654',
            aadhaarNumber: '246813579024',
            panNumber: 'SURES1998R',
            drivingLicense: 'AP05-2023-9847291',
            passportNumber: 'V2948194',
            employmentDetails: 'Unemployed student',
            monthlyIncome: 0,
            bankAccount: 'HDFC A/c 93847294827',
            cibilScore: 580,
            criminalHistory: '1 prior arrest in minor street altercation under IPC 323. No absconding records.',
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
            employmentDetails: 'Farmer, Rajamundry',
            monthlyIncome: 25000,
            activeBailCount: 1,
            propertyAddress: 'Ward No 2, Danavaipeta, Rajamundry. Survey RS-242/8-B',
            surveyNumber: 'RS-242/8-B',
            propertyValuation: 400000,
            propertyOwnershipDoc: 'Title Deed ID: TD-2021-RJM-938',
            propertyRevenueRecord: 'Patta No: P-1934-RJM',
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
        judgeId: 'JUDGE-KAMESWARA-2026',
        courtLocation: 'Sessions Court Room 2, Rajamundry',
        caseStatus: 'Ready for Judge',
        previousCourtOrders: 'Bail adjourned thrice due to prosecution requiring verification of commercial quantity details.',
        filingDate: '2026-05-16',
        supportingDocs: ['Community Ties Evidence'],
        bailType: 'Anticipatory',
        proposedBailAmount: 200000,
        proposedConditions: ['Weekly Reporting', 'Passport Deposit', 'Geofence Restrictions'],
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
            drivingLicense: 'AP05-2020-0038472',
            passportNumber: 'W9284719',
            employmentDetails: 'Boutique Owner',
            monthlyIncome: 38000,
            bankAccount: 'ICICI A/c 29384710482',
            cibilScore: 510,
            criminalHistory: '3 prior NCRB charges (NDPS possession). 1 absconding event registered in 2024.',
            ncrbCount: 3,
            prevBailsGranted: 2,
            prevBailsHonored: 1,
            abscondingCount: 1,
            travelRestricted: true,
            bankBalance6m: 5000
        },
        surety: {
            suretyType: 'INDIVIDUAL',
            fullName: 'Krishnam Raju',
            relationToAccused: 'Father',
            mobileNumber: '7702456789',
            aadhaarNumber: '901234567890',
            panNumber: 'KRISH6543K',
            employmentDetails: 'Merchant Shop Owner',
            monthlyIncome: 30000,
            activeBailCount: 3,
            propertyAddress: 'Survey RS-241/8-A, Danavaipeta, Rajamundry',
            surveyNumber: 'RS-241/8-A',
            propertyValuation: 90000,
            propertyOwnershipDoc: 'Title Deed ID: TD-2018-RJM-104',
            propertyRevenueRecord: 'Patta No: P-8472-RJM',
            encumbranceStatus: 'ENCUMBERED',
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
        judgeId: 'JUDGE-KAMESWARA-2026',
        courtLocation: 'Sessions Court Room 2, Rajamundry',
        caseStatus: 'Ready for Judge',
        previousCourtOrders: 'None.',
        filingDate: '2026-05-19',
        supportingDocs: ['Character Certificate', 'Employment Letter'],
        bailType: 'First Bail',
        proposedBailAmount: 30000,
        proposedConditions: ['Weekly Reporting'],
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
            drivingLicense: 'AP05-2025-0048293',
            passportNumber: 'X1039482',
            employmentDetails: 'Student / Part-time Delivery partner',
            monthlyIncome: 12000,
            bankAccount: 'SBI A/c 29384720482',
            cibilScore: 710,
            criminalHistory: 'No prior criminal convictions. Student profile.',
            ncrbCount: 0,
            prevBailsGranted: 0,
            prevBailsHonored: 0,
            abscondingCount: 0,
            travelRestricted: false,
            bankBalance6m: 20000
        },
        surety: {
            suretyType: 'PROPERTY',
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
            propertyOwnershipDoc: 'Title Deed ID: TD-2012-RJM-294',
            propertyRevenueRecord: 'Patta No: P-4829-RJM',
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
        judgeId: 'JUDGE-KAMESWARA-2026',
        courtLocation: 'Sessions Court Room 2, Rajamundry',
        caseStatus: 'Ready for Judge',
        previousCourtOrders: 'None.',
        filingDate: '2026-05-23',
        supportingDocs: ['Character Certificate', 'Community Ties Evidence'],
        bailType: 'First Bail',
        proposedBailAmount: 50000,
        proposedConditions: ['Weekly Reporting', 'No Contact with Witnesses'],
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
            drivingLicense: 'AP05-2015-8394819',
            passportNumber: 'Y9384729',
            employmentDetails: 'School Teacher',
            monthlyIncome: 28000,
            bankAccount: 'Canara A/c 29384710472',
            cibilScore: 780,
            criminalHistory: 'Matrimonial dispute, clean prior record.',
            ncrbCount: 0,
            prevBailsGranted: 0,
            prevBailsHonored: 0,
            abscondingCount: 0,
            travelRestricted: false,
            bankBalance6m: 45000
        },
        surety: {
            suretyType: 'PROPERTY',
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
            propertyOwnershipDoc: 'Title Deed ID: TD-2005-RJM-834',
            propertyRevenueRecord: 'Patta No: P-9384-RJM',
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
        judgeId: 'JUDGE-KAMESWARA-2026',
        courtLocation: 'Sessions Court Room 2, Rajamundry',
        caseStatus: 'Ready for Judge',
        previousCourtOrders: 'Interim protective bail granted previously by High Court, expired on 2026-05-20.',
        filingDate: '2026-05-12',
        supportingDocs: ['Employment Letter'],
        bailType: 'Anticipatory',
        proposedBailAmount: 100000,
        proposedConditions: ['Weekly Reporting', 'Passport Deposit', 'Geofence Restrictions'],
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
            drivingLicense: 'AP05-1995-0038472',
            passportNumber: 'Z8374920',
            employmentDetails: 'Assistant Engineer, Municipality',
            monthlyIncome: 65000,
            bankAccount: 'Andhra Bank A/c 2938471048',
            cibilScore: 540,
            criminalHistory: '2 active corruption complaints pending investigation. 1 absconding flag in 2023.',
            ncrbCount: 2,
            prevBailsGranted: 1,
            prevBailsHonored: 0,
            abscondingCount: 1,
            travelRestricted: true,
            bankBalance6m: 15000
        },
        surety: {
            suretyType: 'INDIVIDUAL',
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
            propertyValuation: 70000,
            propertyOwnershipDoc: 'Title Deed ID: TD-1998-RJM-938',
            propertyRevenueRecord: 'Patta No: P-2847-RJM',
            encumbranceStatus: 'ENCUMBERED',
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
        judgeId: 'JUDGE-KAMESWARA-2026',
        courtLocation: 'Sessions Court Room 2, Rajamundry',
        caseStatus: 'Ready for Judge',
        previousCourtOrders: 'None.',
        filingDate: '2026-05-25',
        supportingDocs: ['Character Certificate', 'Employment Letter'],
        bailType: 'First Bail',
        proposedBailAmount: 40000,
        proposedConditions: ['Weekly Reporting', 'Passport Deposit'],
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
            drivingLicense: 'AP05-2018-9384729',
            passportNumber: 'A9284710',
            employmentDetails: 'Software Tester',
            monthlyIncome: 55000,
            bankAccount: 'HDFC A/c 2938472048',
            cibilScore: 760,
            criminalHistory: 'Clean record. Financial fraud case.',
            ncrbCount: 0,
            prevBailsGranted: 0,
            prevBailsHonored: 0,
            abscondingCount: 0,
            travelRestricted: false,
            bankBalance6m: 38000
        },
        surety: {
            suretyType: 'INDIVIDUAL',
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
            propertyOwnershipDoc: 'Title Deed ID: TD-2009-RJM-294',
            propertyRevenueRecord: 'Patta No: P-2094-RJM',
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
        judgeId: 'JUDGE-KAMESWARA-2026',
        courtLocation: 'Sessions Court Room 2, Rajamundry',
        caseStatus: 'Ready for Judge',
        previousCourtOrders: 'Anticipatory bail rejected previously by Sessions court, leading to arrest.',
        filingDate: '2026-05-27',
        supportingDocs: ['Character Certificate', 'Employment Letter', 'Community Ties Evidence'],
        bailType: 'Second Bail',
        proposedBailAmount: 100000,
        proposedConditions: ['Weekly Reporting', 'Passport Deposit', 'No Contact with Witnesses'],
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
            drivingLicense: 'AP05-2001-0938472',
            passportNumber: 'B2938471',
            employmentDetails: 'Govt Contractor',
            monthlyIncome: 75000,
            bankAccount: 'State Bank A/c 3849104829',
            cibilScore: 680,
            criminalHistory: '1 prior case of financial non-compliance. Bail honored successfully in 2025.',
            ncrbCount: 1,
            prevBailsGranted: 1,
            prevBailsHonored: 1,
            abscondingCount: 0,
            travelRestricted: false,
            bankBalance6m: 22000
        },
        surety: {
            suretyType: 'PROPERTY',
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
            propertyOwnershipDoc: 'Title Deed ID: TD-2002-RJM-837',
            propertyRevenueRecord: 'Patta No: P-8472-RJM',
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

// Civil Plaint Cases Database — District Court Docket
const CIVIL_CASES_DATABASE = [
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
        orderStatus: 'PENDING',   // PENDING | INTERIM_ORDER | FINAL_DECREE | POSTPONED
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
            name: 'M/s. Sri Sai Traders (Prop: T. Venkateswar Rao)',
            advocate: 'Adv. S. Srinivasa Rao',
            address: '12-3-45, Commercial Complex, Main Road, Rajamundry',
            aadhaar: '456789012345',
            mobileNumber: '9849123456'
        },
        respondent: {
            name: 'Sri. Ravi Kumar Nanduri',
            advocate: 'Adv. M. Appala Raju',
            address: 'Flat 3B, Sri Venkateswara Apartments, Danavaipeta, Rajamundry',
            aadhaar: '567890123456',
            mobileNumber: '9701234567'
        },
        propertyDetails: 'Loan of ₹18,50,000 advanced on 2024-08-15 per written agreement. Defendant defaulted. Promissory note and bank transfer evidence produced.',
        reliefSought: 'Decree for recovery of ₹18,50,000 with 18% p.a. interest from date of default plus legal costs.',
        stageSummary: 'Attachment before judgment order in effect. Written statement filed. Awaiting evidence recording.',
        hearingHistory: [
            { date: '2025-01-20', note: 'Suit filed. Summons issued.' },
            { date: '2025-03-10', note: 'Application for attachment before judgment. Order granted.' },
            { date: '2025-06-05', note: 'Written statement filed. Issues framed.' },
            { date: '2025-11-14', note: 'Petitioner\'s evidence recorded.' },
            { date: '2026-06-01', note: 'Defendant examination in progress. Adjourned to next date.' }
        ]
    },
    {
        caseId: 'CL-2025-0061',
        caseType: 'CIVIL',
        civilType: 'Matrimonial (Divorce)',
        courtNumber: 'Family Court, Rajamundry',
        presidingJudge: 'Hon\'ble J. Kameswara Rao',
        filingDate: '2025-04-08',
        lastHearingDate: '2026-06-15',
        nextHearingDate: '2026-08-02',
        pendingDays: 445,
        orderStatus: 'PENDING',
        interimOrders: ['Interim maintenance of ₹8,000/month ordered to wife from 2025-06-01'],
        decreeText: '',
        postponedTo: '',
        judgeRemarks: '',
        digitalSignature: '',
        petitioner: {
            name: 'Sri. Anil Kumar Reddy',
            advocate: 'Adv. R. Nageswara Rao',
            address: 'D.No 7-1-22, Kotipalli Road, Rajamundry',
            aadhaar: '678901234567',
            mobileNumber: '9440567890'
        },
        respondent: {
            name: 'Smt. Lakshmi Reddy (W/o Anil Kumar)',
            advocate: 'Adv. K. Uma Maheshwari',
            address: 'D.No 3-9-14, Innespeta, Rajamundry',
            aadhaar: '789012345678',
            mobileNumber: '9441678901'
        },
        propertyDetails: 'Matrimonial dispute. Married on 2018-02-14. Separated since 2024-11-01. Petitioner seeks divorce on grounds of cruelty (Section 13(1)(ia), Hindu Marriage Act).',
        reliefSought: 'Decree of divorce dissolving marriage. Settlement of matrimonial assets. Child custody arrangement for minor daughter (age 4).',
        stageSummary: 'Mediation failed (2025-08-12). Evidence recording ongoing. Interim maintenance order in effect.',
        hearingHistory: [
            { date: '2025-04-08', note: 'Petition filed. Summons issued to respondent.' },
            { date: '2025-06-01', note: 'Interim maintenance ₹8,000/month ordered.' },
            { date: '2025-08-12', note: 'Mediation attempted. Failed. Trial ordered to proceed.' },
            { date: '2025-12-05', note: 'Petitioner evidence partially recorded.' },
            { date: '2026-06-15', note: 'Cross-examination of petitioner witness. Adjourned.' }
        ]
    },
    {
        caseId: 'CL-2026-0008',
        caseType: 'CIVIL',
        civilType: 'Contract Breach',
        courtNumber: 'Civil Court Room 1, Rajamundry',
        presidingJudge: 'Hon\'ble J. Kameswara Rao',
        filingDate: '2026-02-10',
        lastHearingDate: '2026-06-20',
        nextHearingDate: '2026-07-25',
        pendingDays: 137,
        orderStatus: 'PENDING',
        interimOrders: [],
        decreeText: '',
        postponedTo: '',
        judgeRemarks: '',
        digitalSignature: '',
        petitioner: {
            name: 'M/s. Coastal Constructions Pvt Ltd',
            advocate: 'Adv. B. Satyanarayana',
            address: '5th Floor, Rajamundry Tower, NH-16 Service Road',
            aadhaar: '890123456789',
            mobileNumber: '9849876543'
        },
        respondent: {
            name: 'Sri. Hanumantha Rao Pilla',
            advocate: 'Adv. G. Venkataramana',
            address: 'D.No 10-2-4, Rajanagaram Road, Rajamundry',
            aadhaar: '901234567890',
            mobileNumber: '9440234567'
        },
        propertyDetails: 'Construction contract dated 2025-09-01 for residential complex (G+3, 12 flats). Petitioner completed 65% work; respondent stopped payment citing alleged quality defects. Dispute over ₹42,00,000 balance.',
        reliefSought: 'Specific performance of contract OR damages of ₹42,00,000 plus ₹8,00,000 loss of profit with 12% interest.',
        stageSummary: 'Early stages. Written statement due. Issues framing scheduled.',
        hearingHistory: [
            { date: '2026-02-10', note: 'Plaint filed. Urgent interim injunction application filed.' },
            { date: '2026-03-15', note: 'Interim injunction application dismissed. Case to proceed on merits.' },
            { date: '2026-05-04', note: 'Summons served. Written statement time extended.' },
            { date: '2026-06-20', note: 'Written statement filed. Issues to be framed at next date.' }
        ]
    }
];

class ApplicationState {
    constructor() {
        // ── ONE-TIME FORCED RESET ──────────────────────────────────────────
        // Clears old contaminated localStorage that mixed civil + criminal cases.
        // After running once, sets a flag so it doesn't repeat on next load.
        const APP_RESET_KEY = 'verdiqo_app_reset_v5';
        if (!localStorage.getItem(APP_RESET_KEY)) {
            localStorage.removeItem('verdiqo_db');
            localStorage.removeItem('verdiqo_civil_db');
            localStorage.removeItem('verdiqo_db_version');
            localStorage.removeItem('verdiqo_civil_db_version');
            localStorage.setItem(APP_RESET_KEY, 'done');
            console.log('[Verdiqo] Cache reset complete — fresh data loaded.');
        }
        // ──────────────────────────────────────────────────────────────────

        this.language = 'EN'; // 'EN' or 'HI'
        this.currentUser = null; // Active logged-in user object
        this.cases = [];
        this.civilCases = [];
        this.staffActiveTab = 'status'; // Status Board is default tab to match reference mockup
        this.selectedCaseNumber = null;
        this.selectedCivilCaseId = null;
        this.judgeViewMode = 'CRIMINAL'; // 'CRIMINAL' | 'CIVIL' — active docket tab in judge view
        this.citizenSearchQuery = '';
        this.citizenActiveMobileTab = 'home';
        
        // Persistent theme configuration
        this.theme = localStorage.getItem('verdiqo_theme') || 'dark';
        this.applyTheme();
        
        this.initDatabase();
        this.initCivilDatabase();
        this.syncWithCloudBackend();
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
        const DB_VERSION = 'v3-criminal-only';
        const cached = localStorage.getItem('verdiqo_db');
        const cachedVersion = localStorage.getItem('verdiqo_db_version');

        // If cache version doesn't match OR cache has civil cases contamination, reset
        let parsedCache = null;
        if (cached && cachedVersion === DB_VERSION) {
            parsedCache = JSON.parse(cached);
            // Extra safety: filter out any civil cases that crept in (no caseNumber = criminal)
            parsedCache = parsedCache.filter(c => c.caseNumber && c.caseNumber.startsWith('BMS/'));
        }

        if (parsedCache && parsedCache.length > 0 && parsedCache[0]?.filingDate) {
            this.cases = parsedCache.map(c => {
                if (!c.checks || !c.checks.risk || !c.checks.identity || !c.checks.property || !c.checks.suretyLoad) {
                    const idCheck = VerificationEngine.verifyIdentity(c.accused.aadhaarNumber, true, true);
                    const finCheck = VerificationEngine.verifyFinancialCapacity(c.surety.panNumber || 'DUMMYPAN12', [35000, 36000, 38000], c.accused.bankBalance6m || 22000, c.accused.cibilScore || 680, c.proposedBailAmount || 50000);
                    const riskCheck = VerificationEngine.calculateRiskScore(c.accused.ncrbCount || 0, c.accused.prevBailsGranted || 0, c.accused.prevBailsHonored || 0, c.accused.abscondingCount || 0, c.accused.travelRestricted || false);
                    const suretyCheck = VerificationEngine.verifySuretyLoad(c.surety.activeBailCount || 0, 0);
                    const propCheck = VerificationEngine.verifyProperty(true, c.surety.fullName, c.surety.fullName, c.surety.encumbranceStatus === 'ENCUMBERED', c.surety.propertyValuation || 500000, c.proposedBailAmount || 50000);
                    
                    const recCheck = VerificationEngine.compileRecommendation(idCheck, finCheck, riskCheck, suretyCheck, propCheck);

                    c.checks = {
                        identity: idCheck,
                        finance: finCheck,
                        risk: riskCheck,
                        suretyLoad: suretyCheck,
                        property: propCheck,
                        recommendation: recCheck
                    };
                }
                return c;
            });
        } else {
            // Clear any stale cache and rebuild from source
            localStorage.removeItem('verdiqo_db');
            localStorage.removeItem('verdiqo_civil_db');

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

    async syncWithCloudBackend() {
        try {
            // Fetch criminal cases
            const resCases = await fetch('/api/cases');
            if (resCases.ok) {
                const cloudCases = await resCases.json();
                if (cloudCases && cloudCases.length > 0) {
                    this.cases = cloudCases;
                    localStorage.setItem('verdiqo_db', JSON.stringify(this.cases));
                }
            }

            // Fetch civil cases
            const resCivil = await fetch('/api/civil-cases');
            if (resCivil.ok) {
                const cloudCivil = await resCivil.json();
                if (cloudCivil && cloudCivil.length > 0) {
                    this.civilCases = cloudCivil;
                    localStorage.setItem('verdiqo_civil_db', JSON.stringify(this.civilCases));
                }
            }
            console.log('[Verdiqo] Synchronized successfully with Neon Postgres cloud backend!');
            if (window.updateUI) window.updateUI();
        } catch (e) {
            console.warn('[Verdiqo] Standalone offline mode — using localStorage database fallback.', e);
        }
    }

    async saveDatabase() {
        localStorage.setItem('verdiqo_db_version', 'v3-criminal-only');
        const criminalOnly = this.cases.filter(c => c.caseNumber && c.caseNumber.startsWith('BMS/'));
        localStorage.setItem('verdiqo_db', JSON.stringify(criminalOnly));

        try {
            for (const c of criminalOnly) {
                await fetch('/api/cases', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(c)
                });
            }
        } catch (e) {
            console.warn('[Verdiqo] Failed to push criminal case updates to backend API:', e);
        }
    }

    initCivilDatabase() {
        const CIVIL_DB_VERSION = 'v3-civil-only';
        const cached = localStorage.getItem('verdiqo_civil_db');
        const cachedVersion = localStorage.getItem('verdiqo_civil_db_version');

        let parsedCache = null;
        if (cached && cachedVersion === CIVIL_DB_VERSION) {
            parsedCache = JSON.parse(cached);
            parsedCache = parsedCache.filter(c => c.caseId && c.caseId.startsWith('CL-'));
        }

        if (parsedCache && parsedCache.length > 0) {
            this.civilCases = parsedCache;
        } else {
            this.civilCases = JSON.parse(JSON.stringify(CIVIL_CASES_DATABASE));
            this.saveCivilDatabase();
        }
    }

    async saveCivilDatabase() {
        localStorage.setItem('verdiqo_civil_db_version', 'v3-civil-only');
        const civilOnly = this.civilCases.filter(c => c.caseId && c.caseId.startsWith('CL-'));
        localStorage.setItem('verdiqo_civil_db', JSON.stringify(civilOnly));

        try {
            for (const c of civilOnly) {
                await fetch('/api/civil-cases', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(c)
                });
            }
        } catch (e) {
            console.warn('[Verdiqo] Failed to push civil case updates to backend API:', e);
        }
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
            // Criminal Sessions Judge — handles Bail Applications only
            if (username === 'judge_kameswara' || username === 'judge1') {
                this.currentUser = { name: 'Hon\'ble J. Kameswara Rao', role: 'JUDGE', designation: 'Sessions Judge (Criminal Bench)', court: 'Sessions Court Room 2, Rajamundry' };
                return true;
            }
        } else if (role === 'CIVIL_JUDGE') {
            // Civil Court Judge — handles civil plaints only
            if (username === 'judge_suryaprakash' || username === 'civiljudge1') {
                this.currentUser = { name: 'Hon\'ble B. Surya Prakash Rao', role: 'CIVIL_JUDGE', designation: 'Principal Civil Judge (Junior Division)', court: 'Civil Court Room 1, Rajamundry' };
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
                { id: 5, name: '5. Post-Bail Compliance Tracking Log' },
                { id: 7, name: '7. Bail Satisfaction & Release Certificate' }
            ];
            
            const lastViewedId = this.lastViewedReportId || null;
            const promptHtml = reports.map(r => {
                const isLastViewed = r.id === lastViewedId;
                const activeStyle = isLastViewed 
                    ? `border: 2px solid var(--color-gold); background-color: rgba(201, 168, 76, 0.15) !important; color: var(--color-gold-light) !important; font-weight: 700;`
                    : ``;
                const labelSuffix = isLastViewed ? ` <span class="badge" style="background-color: var(--color-gold-dim); color: #ffffff; font-size: 10.5px; margin-left: 10px; padding: 2px 6px; border-radius: 4px; border:none; display:inline-block;">ACTIVE</span>` : '';
                return `
                    <button class="btn btn-primary btn-trigger-print-doc" data-id="${r.id}" style="width:100%; text-align:left; padding: 12px 20px; font-size:14px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; ${activeStyle}">
                        <span>${r.name}${labelSuffix}</span>
                        <span>➔</span>
                    </button>
                `;
            }).join('');

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
                    this.lastViewedReportId = id;
                    ReportViewer.show(id, caseRecord, () => {}, () => {
                        this.openReportViewer(caseRecord);
                    });
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
                        <p>QUANTEX INTELLIGENCE SYSTEMS</p>
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
                            ? `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#2563eb" stroke-width="2.5" style="vertical-align:middle;"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>` 
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
        // Criminal Sessions Judge — bail applications only
        DashboardJudge.render(mountPoint, AppState, updateUI);
    } else if (activeRole === 'CIVIL_JUDGE') {
        // Civil Court Judge — Civil Plaint suits only
        DashboardCivilJudge.render(mountPoint, AppState, updateUI);
    } else if (activeRole === 'ADMIN') {
        DashboardAdmin.render(mountPoint, AppState, updateUI);
    } else if (activeRole === 'CITIZEN') {
        DashboardCitizen.render(mountPoint, AppState, updateUI);
    }
    window.updateUI = updateUI;
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
        } else if (selectedRole === 'CIVIL_JUDGE') {
            defaultUser = 'judge_suryaprakash';
            defaultPass = 'civil456';
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
                            <p>QUANTEX INTELLIGENCE SYSTEMS</p>
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
                                ? `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#2563eb" stroke-width="2.5" style="vertical-align:middle;"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>` 
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
                            <div class="role-selector-grid" style="grid-template-columns: repeat(3, 1fr);">
                                <div class="role-option ${selectedRole === 'STAFF' ? 'active' : ''}" data-role="STAFF">
                                    <div class="gov-emblem-badge" style="margin-bottom:8px;">
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                    </div>
                                    <span>Court Staff</span>
                                </div>
                                <div class="role-option ${selectedRole === 'JUDGE' ? 'active' : ''}" data-role="JUDGE" style="border-color: ${selectedRole === 'JUDGE' ? 'var(--color-gold)' : 'transparent'}; position:relative;">
                                    <div style="position:absolute; top:6px; right:6px; font-size:8px; font-weight:800; letter-spacing:0.5px; color:var(--color-danger); background:rgba(239,68,68,0.1); padding:1px 5px; border-radius:3px; border:1px solid rgba(239,68,68,0.3);">CRIMINAL</div>
                                    <div class="gov-emblem-badge" style="margin-bottom:8px;">
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><path d="M12 2v20M5 7h14M5 7L3 13h4L5 7zm14 0l-2 6h4l-2-6zM12 22h6M12 22H6"/></svg>
                                    </div>
                                    <span>Sessions Judge</span>
                                    <small style="font-size:9px; color:var(--color-text-muted); display:block; margin-top:2px;">Bail Applications</small>
                                </div>
                                <div class="role-option ${selectedRole === 'CIVIL_JUDGE' ? 'active' : ''}" data-role="CIVIL_JUDGE" style="position:relative;">
                                    <div style="position:absolute; top:6px; right:6px; font-size:8px; font-weight:800; letter-spacing:0.5px; color:#2563eb; background:rgba(30,58,138,0.1); padding:1px 5px; border-radius:3px; border:1px solid rgba(30,58,138,0.3);">CIVIL</div>
                                    <div class="gov-emblem-badge" style="margin-bottom:8px; border-color:${selectedRole === 'CIVIL_JUDGE' ? '#2563eb' : 'transparent'};">
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" style="color:#2563eb;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                    </div>
                                    <span>Civil Judge</span>
                                    <small style="font-size:9px; color:var(--color-text-muted); display:block; margin-top:2px;">Civil Plaint</small>
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
                                ${selectedRole === 'JUDGE' ? '<p>User: judge_kameswara | Pass: justice789</p><p style="font-size:11px; color:var(--color-text-muted);">Sessions Court &mdash; Criminal Bail Applications</p>' : ''}
                                ${selectedRole === 'CIVIL_JUDGE' ? '<p>User: judge_suryaprakash | Pass: civil456</p><p style="font-size:11px; color:var(--color-text-muted);">Civil Court &mdash; Civil Plaint Suits</p>' : ''}
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
