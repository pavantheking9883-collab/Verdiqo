// lib/providers/app_state.dart

import 'package:flutter/material.dart';
import '../models/case_model.dart';
import '../models/civil_case_model.dart';
import '../utils/verification_engine.dart';
import '../services/api_service.dart';

class AppState extends ChangeNotifier {
  List<CaseModel> _cases = [];
  CaseModel? _selectedCase;
  List<CivilCaseModel> _civilCases = [];
  CivilCaseModel? _selectedCivilCase;
  String _locale = 'en'; // 'en' or 'hi'
  String? _currentUserRole; // 'Judge', 'Staff', 'Admin', 'Citizen', 'Civil_Judge'
  bool _useBackend = false;
  
  // Tab states for Staff and Citizen dashboards
  String _staffActiveTab = 'status'; // 'status', 'new_app', 'new_civil'
  String _citizenActiveTab = 'home'; // 'home' or 'offences' or 'track'
  
  List<CaseModel> get cases => _cases;
  CaseModel? get selectedCase => _selectedCase;
  List<CivilCaseModel> get civilCases => _civilCases;
  CivilCaseModel? get selectedCivilCase => _selectedCivilCase;
  String get locale => _locale;
  String? get currentUserRole => _currentUserRole;
  String get staffActiveTab => _staffActiveTab;
  String get citizenActiveTab => _citizenActiveTab;

  AppState() {
    _initializeDatabase();
    loadCases();
  }

  Future<void> loadCases() async {
    try {
      final backendCases = await ApiService.fetchCases();
      if (backendCases.isNotEmpty) {
        _cases = backendCases;
        _useBackend = true;
        // Keep the selection synced
        if (_selectedCase != null) {
          final idx = _cases.indexWhere((c) => c.caseNumber == _selectedCase!.caseNumber);
          if (idx != -1) {
            _selectedCase = _cases[idx];
          }
        }
      }
    } catch (e) {
      debugPrint('Backend down for criminal cases, running in offline mock mode.');
      _useBackend = false;
    }

    try {
      final backendCivil = await ApiService.fetchCivilCases();
      if (backendCivil.isNotEmpty) {
        _civilCases = backendCivil;
        _useBackend = true;
        if (_selectedCivilCase != null) {
          final idx = _civilCases.indexWhere((c) => c.caseId == _selectedCivilCase!.caseId);
          if (idx != -1) {
            _selectedCivilCase = _civilCases[idx];
          }
        }
      }
    } catch (e) {
      debugPrint('Backend down for civil cases: $e');
    }
    notifyListeners();
  }

  void setLocale(String newLocale) {
    if (newLocale == 'en' || newLocale == 'hi') {
      _locale = newLocale;
      notifyListeners();
    }
  }

  void setStaffActiveTab(String tab) {
    _staffActiveTab = tab;
    notifyListeners();
  }

  void setCitizenActiveTab(String tab) {
    _citizenActiveTab = tab;
    notifyListeners();
  }

  void login(String role) {
    _currentUserRole = role;
    notifyListeners();
  }

  void logout() {
    _currentUserRole = null;
    _selectedCase = null;
    _selectedCivilCase = null;
    notifyListeners();
  }

  void selectCase(CaseModel? c) {
    _selectedCase = c;
    notifyListeners();
  }

  void selectCivilCase(CivilCaseModel? c) {
    _selectedCivilCase = c;
    notifyListeners();
  }

  Future<void> addCivilCase(CivilCaseModel c) async {
    if (_useBackend) {
      try {
        final saved = await ApiService.createCivilCase(c);
        _civilCases.insert(0, saved);
        notifyListeners();
        return;
      } catch (e) {
        debugPrint('Failed to save civil case to backend: $e');
      }
    }
    _civilCases.insert(0, c);
    notifyListeners();
  }

  Future<void> updateCivilCaseVerdict(
    String caseId,
    String verdict,
    String decreeText,
    String remarks,
    String signature,
  ) async {
    if (_useBackend) {
      try {
        final success = await ApiService.updateCivilVerdict(
          caseId,
          verdict,
          decreeText,
          remarks,
          signature,
        );
        if (success) {
          await loadCases();
          return;
        }
      } catch (e) {
        debugPrint('Failed to submit civil verdict to backend: $e');
      }
    }

    final idx = _civilCases.indexWhere((c) => c.caseId == caseId);
    if (idx != -1) {
      _civilCases[idx].orderStatus = verdict;
      _civilCases[idx].decreeText = decreeText;
      _civilCases[idx].judgeRemarks = remarks;
      _civilCases[idx].digitalSignature = signature;
      if (_selectedCivilCase?.caseId == caseId) {
        _selectedCivilCase = _civilCases[idx];
      }
      notifyListeners();
    }
  }

  // Pre-populates form data for staff demo purposes
  CaseModel generatePrepopulatedCase(String type) {
    if (type == 'capable') {
      return CaseModel(
        caseNumber: 'BMS/2026/0045',
        firNumber: 'FIR/190/2026-RJM',
        ipcSections: 'IPC 379',
        dateOfArrest: '2026-06-01',
        policeStation: 'RJM Town PS, Inspector G. Murthy',
        presidingJudge: 'Hon\'ble J. Kameswara Rao',
        judgeId: 'JUDGE-KAMESWARA-2026',
        courtLocation: 'Sessions Court Room 2, Rajamundry',
        previousCourtOrders: 'None.',
        filingDate: '2026-06-05',
        supportingDocs: ['Character Certificate', 'Community Ties Evidence'],
        bailType: 'First Bail',
        proposedBailAmount: 25000,
        proposedConditions: ['Weekly Reporting'],
        hearingDate: '2026-06-18T10:00',
        currentStatus: 'Ready for Judge',
        orderStatus: 'PENDING',
        judgeRemarks: '',
        digitalSignature: '',
        accused: AccusedModel(
          fullName: 'Chaitanya Prasad',
          dob: '1992-04-12',
          fathersName: 'Nageswara Rao',
          address: 'D.No 5-2-1, Subhash Road, Rajamundry, AP',
          mobileNumber: '9123456789',
          aadhaarNumber: '987654321098',
          panNumber: 'CHAIT1992P',
          drivingLicense: 'AP05-2012-8472910',
          passportNumber: 'Z9384729',
          employmentDetails: 'Office Assistant, Private Agency',
          monthlyIncome: 28000,
          bankAccount: 'SBI A/c 30948293848',
          cibilScore: 710,
          criminalHistory: 'No prior convictions. Clear flight history.',
          ncrbCount: 0,
          prevBailsGranted: 0,
          prevBailsHonored: 0,
          abscondingCount: 0,
          travelRestricted: false,
          bankBalance6m: 25000,
        ),
        surety: SuretyModel(
          suretyType: 'PROPERTY',
          fullName: 'Nageswara Rao',
          relationToAccused: 'Father',
          mobileNumber: '9123456780',
          aadhaarNumber: '778899665544',
          panNumber: 'NAGES1234R',
          employmentDetails: 'Retired Clerk',
          monthlyIncome: 25000,
          activeBailCount: 0,
          propertyAddress: 'Survey RS-105/2, Rajamundry Rural',
          surveyNumber: 'RS-105/2',
          propertyValuation: 350000,
          propertyOwnershipDoc: 'Title Deed TD-2010-RJM-294',
          propertyRevenueRecord: 'Patta No: P-8472-RJM',
          encumbranceStatus: 'CLEAN',
          mutationStatus: 'PENDING',
        ),
        arguments: ArgumentsModel(
          prosecution: 'Objections: Theft of laptop from office.',
          defence: 'Accused is a local resident, cooperative, first offence.',
        ),
        checks: {},
      );
    } else {
      // high risk
      return CaseModel(
        caseNumber: 'BMS/2026/0046',
        firNumber: 'FIR/191/2026-RJM',
        ipcSections: 'NDPS Act S.21',
        dateOfArrest: '2026-06-03',
        policeStation: 'ACB Division, Inspector V. Naidu',
        presidingJudge: 'Hon\'ble J. Kameswara Rao',
        judgeId: 'JUDGE-KAMESWARA-2026',
        courtLocation: 'Sessions Court Room 2, Rajamundry',
        previousCourtOrders: 'Adjourned twice due to absconding threats.',
        filingDate: '2026-06-06',
        supportingDocs: ['Character Certificate'],
        bailType: 'First Bail',
        proposedBailAmount: 180000,
        proposedConditions: ['Weekly Reporting', 'Passport Deposit', 'Geofence Restrictions'],
        hearingDate: '2026-06-18T11:00',
        currentStatus: 'Ready for Judge',
        orderStatus: 'PENDING',
        judgeRemarks: '',
        digitalSignature: '',
        accused: AccusedModel(
          fullName: 'Vikram Singh',
          dob: '1988-11-20',
          fathersName: 'Baldev Singh',
          address: 'Ward No 4, Danavaipeta, Rajamundry, AP',
          mobileNumber: '9988776611',
          aadhaarNumber: '112233445588',
          panNumber: 'VIKRA1988S',
          drivingLicense: 'AP05-2015-0984729',
          passportNumber: 'Y2948194',
          employmentDetails: 'Unemployed',
          monthlyIncome: 0,
          bankAccount: 'ICICI A/c 2948104829',
          cibilScore: 480,
          criminalHistory: '4 registered FIR cases, 2 absconding logs.',
          ncrbCount: 4,
          prevBailsGranted: 3,
          prevBailsHonored: 1,
          abscondingCount: 2,
          travelRestricted: true,
          bankBalance6m: 3000,
        ),
        surety: SuretyModel(
          suretyType: 'INDIVIDUAL',
          fullName: 'Baldev Singh',
          relationToAccused: 'Father',
          mobileNumber: '9988776610',
          aadhaarNumber: '445566778811',
          panNumber: 'BALDE7788S',
          employmentDetails: 'Security Guard',
          monthlyIncome: 12000,
          activeBailCount: 3,
          propertyAddress: 'Survey RS-110/4, Danavaipeta',
          surveyNumber: 'RS-110/4',
          propertyValuation: 60000,
          propertyOwnershipDoc: 'Title Deed TD-1999-RJM-482',
          propertyRevenueRecord: 'Patta No: P-8472-RJM',
          encumbranceStatus: 'ENCUMBERED',
          mutationStatus: 'PENDING',
        ),
        arguments: ArgumentsModel(
          prosecution: 'Objections: Multi-recidivist, high flight risk history.',
          defence: 'Accused is seeking bail for medical rehabilitation.',
        ),
        checks: {},
      );
    }
  }

  Future<void> addCase(CaseModel newCase) async {
    if (_useBackend) {
      try {
        final savedCase = await ApiService.createCase(newCase);
        _cases.insert(0, savedCase);
        notifyListeners();
        return;
      } catch (e) {
        debugPrint('Failed to save to backend, falling back to local memory: $e');
      }
    }
    // Run scoring engines on new case
    newCase.checks = runChecksForCase(newCase);
    _cases.insert(0, newCase);
    notifyListeners();
  }

  Future<void> updateCaseVerdict(String caseNumber, String verdict, String remarks, String signature) async {
    if (_useBackend) {
      try {
        final success = await ApiService.updateVerdict(caseNumber, verdict, remarks, signature);
        if (success) {
          await loadCases();
          return;
        }
      } catch (e) {
        debugPrint('Failed to submit verdict to backend: $e');
      }
    }

    final idx = _cases.indexWhere((c) => c.caseNumber == caseNumber);
    if (idx != -1) {
      _cases[idx].orderStatus = verdict;
      _cases[idx].judgeRemarks = remarks;
      _cases[idx].digitalSignature = signature;
      _cases[idx].currentStatus = verdict == 'ADJOURNED' ? 'Adjourned' : 'Adjudicated';
      
      // If bail is granted, run mock mutation
      if (verdict == 'GRANTED' || verdict == 'GRANTED_WITH_CONDITIONS') {
        _cases[idx].surety.mutationStatus = 'COMPLETED';
      }
      
      if (_selectedCase?.caseNumber == caseNumber) {
        _selectedCase = _cases[idx];
      }
      notifyListeners();
    }
  }

  // Wires up the VerificationEngine checks to compile scoring maps
  Map<String, dynamic> runChecksForCase(CaseModel c) {
    final idCheck = VerificationEngine.verifyIdentity(
      c.accused.aadhaarNumber,
      true, // mock biometric fingerprint matched
      true, // mock biometric retina matched
    );
    final finCheck = VerificationEngine.verifyFinancialCapacity(
      c.surety.panNumber,
      [c.surety.monthlyIncome * 12],
      c.accused.bankBalance6m,
      c.accused.cibilScore,
      c.proposedBailAmount,
    );
    final riskCheck = VerificationEngine.calculateRiskScore(
      c.accused.ncrbCount,
      c.accused.prevBailsGranted,
      c.accused.prevBailsHonored,
      c.accused.abscondingCount,
      c.accused.travelRestricted,
    );
    final suretyCheck = VerificationEngine.verifySuretyLoad(
      c.surety.activeBailCount,
      0, // mock defaults count
    );
    final propCheck = VerificationEngine.verifyProperty(
      c.surety.suretyType == 'PROPERTY',
      c.surety.fullName,
      c.surety.fullName, // registry owner name matches
      c.surety.encumbranceStatus == 'ENCUMBERED',
      c.surety.propertyValuation,
      c.proposedBailAmount,
    );
    final recCheck = VerificationEngine.compileRecommendation(
      idCheck,
      finCheck,
      riskCheck,
      suretyCheck,
      propCheck,
    );

    return {
      'identity': idCheck.toMap(),
      'finance': finCheck.toMap(),
      'risk': riskCheck.toMap(),
      'suretyLoad': suretyCheck.toMap(),
      'property': propCheck.toMap(),
      'recommendation': recCheck.toMap(),
    };
  }

  void _initializeDatabase() {
    final List<CaseModel> seedList = [
      CaseModel(
        caseNumber: 'BMS/2026/0042',
        firNumber: 'FIR/148/2026-RJM',
        ipcSections: 'IPC 420, 468',
        dateOfArrest: '2026-05-24',
        policeStation: 'Rajamundry Urban PS, Inspector S. Kumar',
        presidingJudge: 'Hon\'ble J. Kameswara Rao',
        judgeId: 'JUDGE-KAMESWARA-2026',
        courtLocation: 'Sessions Court Room 2, Rajamundry',
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
        accused: AccusedModel(
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
          bankBalance6m: 35000,
        ),
        surety: SuretyModel(
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
          mutationStatus: 'PENDING',
        ),
        arguments: ArgumentsModel(
          prosecution: 'Objections: Possibility of tampering with witnesses.',
          defence: 'Accused is cooperative. Items recovered. No flight risk.',
        ),
        checks: {},
      ),
      CaseModel(
        caseNumber: 'BMS/2026/0041',
        firNumber: 'FIR/102/2026-RJM',
        ipcSections: 'IPC 302',
        dateOfArrest: '2026-05-20',
        policeStation: 'RJM Rural PS, Inspector K. Ram',
        presidingJudge: 'Hon\'ble J. Kameswara Rao',
        judgeId: 'JUDGE-KAMESWARA-2026',
        courtLocation: 'Sessions Court Room 2, Rajamundry',
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
        accused: AccusedModel(
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
          bankBalance6m: 12000,
        ),
        surety: SuretyModel(
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
          mutationStatus: 'PENDING',
        ),
        arguments: ArgumentsModel(
          prosecution: 'Severe charge (murder). Accused is highly risky.',
          defence: 'Accused acted in self-defence, zero absconding records.',
        ),
        checks: {},
      ),
      CaseModel(
        caseNumber: 'BMS/2026/0040',
        firNumber: 'FIR/98/2026-RJM',
        ipcSections: 'NDPS Act S.20',
        dateOfArrest: '2026-05-15',
        policeStation: 'RJM Urban Crime Branch, Inspector G. Rao',
        presidingJudge: 'Hon\'ble J. Kameswara Rao',
        judgeId: 'JUDGE-KAMESWARA-2026',
        courtLocation: 'Sessions Court Room 2, Rajamundry',
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
        accused: AccusedModel(
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
          bankBalance6m: 5000,
        ),
        surety: SuretyModel(
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
          mutationStatus: 'PENDING',
        ),
        arguments: ArgumentsModel(
          prosecution: 'CRITICAL OBJECT: Prior absconding events registered. Commercial quantity drug charges.',
          defence: 'Accused is suffering from chronic health issues, seeking bail on medical grounds.',
        ),
        checks: {},
      ),
      CaseModel(
        caseNumber: 'BMS/2026/0039',
        firNumber: 'FIR/84/2026-RJM',
        ipcSections: 'IPC 379, 411',
        dateOfArrest: '2026-05-18',
        policeStation: 'Rajamundry Urban PS, Inspector S. Kumar',
        presidingJudge: 'Hon\'ble J. Kameswara Rao',
        judgeId: 'JUDGE-KAMESWARA-2026',
        courtLocation: 'Sessions Court Room 2, Rajamundry',
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
        accused: AccusedModel(
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
          bankBalance6m: 20000,
        ),
        surety: SuretyModel(
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
          mutationStatus: 'PENDING',
        ),
        arguments: ArgumentsModel(
          prosecution: 'Minor theft charges, recovery completed.',
          defence: 'Accused is a young student. First offence. Cooperation maintained.',
        ),
        checks: {},
      ),
      CaseModel(
        caseNumber: 'BMS/2026/0038',
        firNumber: 'FIR/72/2026-RJM',
        ipcSections: 'IPC 498A, 406',
        dateOfArrest: '2026-05-22',
        policeStation: 'Women PS, Inspector T. Lakshmi',
        presidingJudge: 'Hon\'ble J. Kameswara Rao',
        judgeId: 'JUDGE-KAMESWARA-2026',
        courtLocation: 'Sessions Court Room 2, Rajamundry',
        previousCourtOrders: 'None.',
        filingDate: '2026-05-23',
        supportingDocs: ['Character Certificate', 'Community Ties Evidence'],
        bailType: 'First Bail',
        proposedBailAmount: 50000,
        proposedConditions: ['Weekly Reporting', 'No Contact with Witnesses'],
        hearingDate: '2026-05-29T14:30',
        currentStatus: 'Ready for Judge',
        orderStatus: 'PENDING',
        judgeRemarks: '',
        digitalSignature: '',
        accused: AccusedModel(
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
          bankBalance6m: 45000,
        ),
        surety: SuretyModel(
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
          mutationStatus: 'PENDING',
        ),
        arguments: ArgumentsModel(
          prosecution: 'Objections: Domestic dispute case, potential threat.',
          defence: 'Accused seeking mutual resolution. Clean records.',
        ),
        checks: {},
      ),
      CaseModel(
        caseNumber: 'BMS/2026/0037',
        firNumber: 'FIR/68/2026-RJM',
        ipcSections: 'PC Act S.7, 13',
        dateOfArrest: '2026-05-10',
        policeStation: 'ACB Division, Inspector V. Naidu',
        presidingJudge: 'Hon\'ble J. Kameswara Rao',
        judgeId: 'JUDGE-KAMESWARA-2026',
        courtLocation: 'Sessions Court Room 2, Rajamundry',
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
        accused: AccusedModel(
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
          bankBalance6m: 15000,
        ),
        surety: SuretyModel(
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
          mutationStatus: 'PENDING',
        ),
        arguments: ArgumentsModel(
          prosecution: 'Objections: Public corruption charges. Possibility of fleeing.',
          defence: 'Accused is a local citizen. Ready to deposit passport.',
        ),
        checks: {},
      ),
      CaseModel(
        caseNumber: 'BMS/2026/0036',
        firNumber: 'FIR/55/2026-RJM',
        ipcSections: 'IPC 420',
        dateOfArrest: '2026-05-24',
        policeStation: 'Rajamundry Urban PS, Inspector S. Kumar',
        presidingJudge: 'Hon\'ble J. Kameswara Rao',
        judgeId: 'JUDGE-KAMESWARA-2026',
        courtLocation: 'Sessions Court Room 2, Rajamundry',
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
        accused: AccusedModel(
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
          bankBalance6m: 38000,
        ),
        surety: SuretyModel(
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
          mutationStatus: 'PENDING',
        ),
        arguments: ArgumentsModel(
          prosecution: 'Financial cheating charges.',
          defence: 'Accused is a young professional. Cooperative. Full recovery.',
        ),
        checks: {},
      ),
      CaseModel(
        caseNumber: 'BMS/2026/0035',
        firNumber: 'FIR/44/2026-RJM',
        ipcSections: 'IPC 409, 468',
        dateOfArrest: '2026-05-26',
        policeStation: 'ACB Division, Inspector V. Naidu',
        presidingJudge: 'Hon\'ble J. Kameswara Rao',
        judgeId: 'JUDGE-KAMESWARA-2026',
        courtLocation: 'Sessions Court Room 2, Rajamundry',
        previousCourtOrders: 'Anticipatory bail rejected previously by Sessions court, leading to arrest.',
        filingDate: '2026-05-27',
        supportingDocs: ['Character Certificate', 'Employment Letter', 'Community Ties Evidence'],
        bailType: 'Second Bail',
        proposedBailAmount: 100000,
        proposedConditions: ['Weekly Reporting', 'Passport Deposit', 'No Contact with Witnesses'],
        hearingDate: '2026-05-29T16:00',
        currentStatus: 'Ready for Judge',
        orderStatus: 'PENDING',
        judgeRemarks: '',
        digitalSignature: '',
        accused: AccusedModel(
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
          bankBalance6m: 22000,
        ),
        surety: SuretyModel(
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
          mutationStatus: 'PENDING',
        ),
        arguments: ArgumentsModel(
          prosecution: 'Objections: Embezzlement of public funds, high amount.',
          defence: 'Accused is ready to comply with reporting intervals. Old age grounds.',
        ),
        checks: {},
      )
    ];

    // Seed calculations for each case
    for (var c in seedList) {
      c.checks = runChecksForCase(c);
      _cases.add(c);
    }

    final List<CivilCaseModel> seedCivilList = [
      CivilCaseModel(
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
          'name': 'Smt. Padmavathi Devi Alluri',
          'advocate': 'Adv. K. Ramachandra Rao',
          'address': 'D.No 2-4-17, Tadepalligudem Road, Rajamundry',
          'aadhaar': '234567890123',
          'mobileNumber': '9441234567'
        },
        respondent: {
          'name': 'Sri. Venkata Rao Alluri',
          'advocate': 'Adv. P. Subrahmanyam',
          'address': 'D.No 2-4-17, Tadepalligudem Road, Rajamundry',
          'aadhaar': '345678901234',
          'mobileNumber': '9440987654'
        },
        propertyDetails: 'Agricultural land of 2.45 acres, Survey No. RS-129/4-A, Tadepalligudem, East Godavari. Disputed succession after death of Sri. Narayana Rao Alluri (2022). Petitioner claims sole heirship.',
        reliefSought: 'Declaration of ownership and possession of the disputed land. Partition decree as legal heir.',
        stageSummary: 'Arguments concluded. Evidence recording complete. Awaiting final judgment.',
        hearingHistory: [
          {'date': '2024-04-01', 'note': 'Plaint filed. Summons issued to respondent.'},
          {'date': '2024-06-15', 'note': 'Written statement filed by respondent. Issues framed.'},
          {'date': '2024-07-01', 'note': 'Interim injunction granted. Respondent restrained from alienation.'},
          {'date': '2025-02-12', 'note': 'Petitioner examination complete. 3 witnesses examined.'},
          {'date': '2025-09-04', 'note': 'Respondent evidence recording concluded.'},
          {'date': '2026-05-10', 'note': 'Final arguments heard. Reserved for judgment.'}
        ],
      ),
      CivilCaseModel(
        caseId: 'CL-2025-0034',
        caseType: 'CIVIL',
        civilType: 'Money Recovery Suit',
        courtNumber: 'Civil Court Room 1, Rajamundry',
        presidingJudge: 'Hon\'ble J. Kameswara Rao',
        filingDate: '2025-02-10',
        lastHearingDate: '2026-05-15',
        nextHearingDate: '2026-06-29',
        pendingDays: 126,
        orderStatus: 'INTERIM_ORDER',
        interimOrders: ['Interim attachment order issued for bank accounts of respondent up to disputed sum of Rs. 15,00,000.'],
        decreeText: '',
        postponedTo: '',
        judgeRemarks: 'Interim attachment active. Respondent ordered to deposit surety or bank guarantee.',
        digitalSignature: 'SHA-256/CIVIL-2025-0034/KAMESWARA',
        petitioner: {
          'name': 'Sri. Lakshmi Narayana Karuturi',
          'advocate': 'Adv. M. Sitarama Murthy',
          'address': 'Flat 101, Ramya Enclave, Danavaipeta, Rajamundry',
          'aadhaar': '789012345678',
          'mobileNumber': '9848012345'
        },
        respondent: {
          'name': 'Sri. Satish Kumar Puppala',
          'advocate': 'Adv. G. Radhakrishna',
          'address': 'D.No 40-15-9, Siddhartha Nagar, Vijayawada',
          'aadhaar': '890123456789',
          'mobileNumber': '9849054321'
        },
        propertyDetails: 'Disputed transaction under Promissory Note dated 2024-01-10 for business loan. Principal amount Rs. 12,00,000 with 18% p.a. interest.',
        reliefSought: 'Recovery of Rs. 15,48,000 (including interest) with future interest and costs of the suit.',
        stageSummary: 'Respondent submitted written objections. Hearing on execution of Promissory Note in progress.',
        hearingHistory: [
          {'date': '2025-02-15', 'note': 'Suit registered. Notice served.'},
          {'date': '2025-04-10', 'note': 'Interim application for attachment under Order 38 Rule 5 filed.'},
          {'date': '2025-05-12', 'note': 'Counter filed by respondent.'},
          {'date': '2026-05-15', 'note': 'Interim attachment order made absolute.'}
        ],
      )
    ];

    _civilCases.addAll(seedCivilList);
  }
}
