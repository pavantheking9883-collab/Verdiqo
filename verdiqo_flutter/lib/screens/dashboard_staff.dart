// lib/screens/dashboard_staff.dart

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../models/case_model.dart';

class DashboardStaff extends StatefulWidget {
  const DashboardStaff({super.key});

  @override
  State<DashboardStaff> createState() => _DashboardStaffState();
}

class _DashboardStaffState extends State<DashboardStaff> {
  int _currentStep = 0;
  String _searchQuery = '';
  
  // SECTION 1: CASE DETAILS
  final _caseNumController = TextEditingController();
  final _firController = TextEditingController();
  final _ipcController = TextEditingController();
  final _arrestDateController = TextEditingController(text: '2026-06-15');
  final _policeStationController = TextEditingController();
  final _filingDateController = TextEditingController(text: '2026-06-15');
  final List<String> _supportingDocs = [];

  // SECTION 2: ACCUSED
  final _accusedNameController = TextEditingController();
  final _accusedFathersNameController = TextEditingController();
  final _accusedDobController = TextEditingController(text: '1990-01-01');
  final _accusedAddressController = TextEditingController();
  final _accusedMobileController = TextEditingController();
  final _accusedAadhaarController = TextEditingController();
  final _accusedPanController = TextEditingController();
  final _accusedDlController = TextEditingController();
  final _accusedPassportController = TextEditingController();
  final _accusedEmploymentController = TextEditingController();
  final _accusedIncomeController = TextEditingController(text: '0');
  final _accusedBankController = TextEditingController();
  final _accusedCibilController = TextEditingController(text: '700');
  final _accusedHistoryController = TextEditingController();
  int _ncrbCount = 0;
  int _prevBailsGranted = 0;
  int _prevBailsHonored = 0;
  int _abscondingCount = 0;
  bool _travelRestricted = false;
  double _bankBalance6m = 10000;

  // SECTION 3: SURETY
  String _suretyType = 'PROPERTY'; // 'PROPERTY' or 'INDIVIDUAL'
  final _suretyNameController = TextEditingController();
  final _suretyRelationController = TextEditingController();
  final _suretyMobileController = TextEditingController();
  final _suretyAadhaarController = TextEditingController();
  final _suretyPanController = TextEditingController();
  final _suretyEmploymentController = TextEditingController();
  final _suretyIncomeController = TextEditingController(text: '0');
  int _suretyActiveBails = 0;
  final _suretyPropertyAddressController = TextEditingController();
  final _suretySurveyController = TextEditingController();
  final _suretyValuationController = TextEditingController(text: '0');
  final _suretyTitleDeedController = TextEditingController();
  final _suretyPattaController = TextEditingController();
  String _encumbranceStatus = 'CLEAN'; // 'CLEAN' or 'ENCUMBERED'

  // SECTION 4: ARGUMENTS & COURT
  final _prosecutionController = TextEditingController();
  final _defenceController = TextEditingController();
  final _proposedBailController = TextEditingController(text: '50000');
  final List<String> _proposedConditions = [];
  final _presidingJudgeController = TextEditingController(text: 'Hon\'ble J. Kameswara Rao');
  final _judgeIdController = TextEditingController(text: 'JUDGE-KAMESWARA-2026');
  final _courtLocationController = TextEditingController(text: 'Sessions Court Room 2, Rajamundry');
  final _hearingDateController = TextEditingController(text: '2026-06-25T10:00');
  final _previousOrdersController = TextEditingController();

  // Biometrics simulation
  bool _biometricScannerFingerprint = false;
  bool _biometricScannerIris = false;

  final Map<String, Map<String, String>> _localizedText = {
    'en': {
      'staff_portal': 'Court Staff Registry Portal',
      'status_board': 'Status Board',
      'new_application': 'New Bail Application',
      'case_no': 'Case Number',
      'fir_no': 'FIR Number',
      'ipc_sections': 'IPC / BNS Sections',
      'arrest_date': 'Date of Arrest',
      'police_station': 'Police Station / Investigating Agency',
      'filing_date': 'Filing Date',
      'docs': 'Supporting Documents Verified',
      'accused_info': 'Accused Demographics',
      'accused_name': 'Full Name',
      'fathers_name': "Father's Name",
      'dob': 'Date of Birth',
      'address': 'Address',
      'mobile': 'Mobile Number',
      'aadhaar': 'Aadhaar Number',
      'pan': 'PAN Number',
      'dl': 'Driving License Number',
      'passport': 'Passport Number',
      'employment': 'Employment Details',
      'income': 'Monthly Income (₹)',
      'bank': 'Bank Account details',
      'cibil': 'CIBIL Score',
      'crim_history': 'Criminal History Logs',
      'biometrics': 'Biometric Scanners',
      'surety_info': 'Surety Information',
      'surety_type': 'Surety Type',
      'property': 'Property',
      'individual': 'Individual / Guarantor',
      'relation': 'Relation to Accused',
      'active_bails': 'Active Bail Guarantees Count',
      'prop_address': 'Property Address',
      'survey_no': 'Survey Number',
      'valuation': 'Property Ready-Reckoner Valuation (₹)',
      'title_deed': 'Title Deed ID',
      'patta': 'Patta / Khata Number',
      'encumbrance': 'Encumbrance Status',
      'clean': 'Clean / Unencumbered',
      'encumbered': 'Encumbered / Liens exist',
      'court_details': 'Legal Arguments & Courtroom Info',
      'prosecution': 'Prosecution Objections',
      'defence': 'Defence Counsel Arguments',
      'proposed_bail': 'Proposed Bail Amount (₹)',
      'conditions': 'Proposed Bail Conditions',
      'presiding_judge': 'Presiding Judge',
      'judge_id': 'Judge ID',
      'court_location': 'Court Location',
      'hearing_date': 'Hearing Date & Time',
      'prev_orders': 'Previous Court Orders',
      'prepopulate_capable': 'Autofill Capable Surety',
      'prepopulate_risk': 'Autofill High Risk Profile',
      'submit': 'Submit Bail Application',
      'logout': 'LOGOUT',
      'search': 'Search cases by name or number...',
    },
    'hi': {
      'staff_portal': 'न्यायालय कर्मचारी रजिस्ट्री पोर्टल',
      'status_board': 'स्थिति बोर्ड',
      'new_application': 'नया जमानत आवेदन',
      'case_no': 'केस संख्या',
      'fir_no': 'एफआईआर (FIR) संख्या',
      'ipc_sections': 'आईपीसी / बीएनएस धाराएं',
      'arrest_date': 'गिरफ्तारी की तारीख',
      'police_station': 'पुलिस स्टेशन / जांच एजेंसी',
      'filing_date': 'दाखल करने की तारीख',
      'docs': 'सत्यापित सहायक दस्तावेज',
      'accused_info': 'आरोपी जनसांख्यिकी',
      'accused_name': 'पूरा नाम',
      'fathers_name': 'पिता का नाम',
      'dob': 'जन्म तिथि',
      'address': 'पता',
      'mobile': 'मोबाइल नंबर',
      'aadhaar': 'आधार संख्या',
      'pan': 'पैन संख्या',
      'dl': 'ड्राइविंग लाइसेंस संख्या',
      'passport': 'पासपोर्ट संख्या',
      'employment': 'रोजगार विवरण',
      'income': 'मासिक आय (₹)',
      'bank': 'बैंक खाता विवरण',
      'cibil': 'सिबिल (CIBIL) स्कोर',
      'crim_history': 'आपराधिक इतिहास विवरण',
      'biometrics': 'बायोमेट्रिक स्कैनर',
      'surety_info': 'ज़मानतदार की जानकारी',
      'surety_type': 'ज़मानत प्रकार',
      'property': 'संपत्ति (Property)',
      'individual': 'व्यक्तिगत (Individual)',
      'relation': 'आरोपी से संबंध',
      'active_bails': 'सक्रिय ज़मानत गारंटी संख्या',
      'prop_address': 'संपत्ति का पता',
      'survey_no': 'सर्वेक्षण संख्या (Survey No)',
      'valuation': 'संपत्ति का सरकारी मूल्यांकन (₹)',
      'title_deed': 'शीर्षक विलेख आईडी (Title Deed ID)',
      'patta': 'पट्टा / खाता संख्या',
      'encumbrance': 'भार स्थिति (Encumbrance)',
      'clean': 'स्वच्छ / भार-मुक्त (Clean)',
      'encumbered': 'भारित / बंधक (Encumbered)',
      'court_details': 'कानूनी तर्क और अदालत विवरण',
      'prosecution': 'अभियोजन पक्ष की आपत्तियां',
      'defence': 'बचाव पक्ष के तर्क',
      'proposed_bail': 'प्रस्तावित ज़मानत राशि (₹)',
      'conditions': 'प्रस्तावित ज़मानत शर्तें',
      'presiding_judge': 'पीठासीन न्यायाधीश',
      'judge_id': 'न्यायाधीश आईडी',
      'court_location': 'अदालत का स्थान',
      'hearing_date': 'सुनवाई की तारीख और समय',
      'prev_orders': 'पिछले अदालती आदेश',
      'prepopulate_capable': 'सक्षम ज़मानतदार ऑटोफिल',
      'prepopulate_risk': 'उच्च जोखिम प्रोफ़ाइल ऑटोफिल',
      'submit': 'जमानत आवेदन जमा करें',
      'logout': 'लॉगआउट',
      'search': 'नाम या केस नंबर द्वारा खोजें...',
    }
  };

  void _autofillForm(AppState state, String type) {
    final c = state.generatePrepopulatedCase(type);
    
    // Fill controllers
    _caseNumController.text = c.caseNumber;
    _firController.text = c.firNumber;
    _ipcController.text = c.ipcSections;
    _arrestDateController.text = c.dateOfArrest;
    _policeStationController.text = c.policeStation;
    _filingDateController.text = c.filingDate;
    
    _supportingDocs.clear();
    _supportingDocs.addAll(c.supportingDocs);

    _accusedNameController.text = c.accused.fullName;
    _accusedFathersNameController.text = c.accused.fathersName;
    _accusedDobController.text = c.accused.dob;
    _accusedAddressController.text = c.accused.address;
    _accusedMobileController.text = c.accused.mobileNumber;
    _accusedAadhaarController.text = c.accused.aadhaarNumber;
    _accusedPanController.text = c.accused.panNumber;
    _accusedDlController.text = c.accused.drivingLicense;
    _accusedPassportController.text = c.accused.passportNumber;
    _accusedEmploymentController.text = c.accused.employmentDetails;
    _accusedIncomeController.text = c.accused.monthlyIncome.toStringAsFixed(0);
    _accusedBankController.text = c.accused.bankAccount;
    _accusedCibilController.text = c.accused.cibilScore.toString();
    _accusedHistoryController.text = c.accused.criminalHistory;
    
    _ncrbCount = c.accused.ncrbCount;
    _prevBailsGranted = c.accused.prevBailsGranted;
    _prevBailsHonored = c.accused.prevBailsHonored;
    _abscondingCount = c.accused.abscondingCount;
    _travelRestricted = c.accused.travelRestricted;
    _bankBalance6m = c.accused.bankBalance6m;

    _suretyType = c.surety.suretyType;
    _suretyNameController.text = c.surety.fullName;
    _suretyRelationController.text = c.surety.relationToAccused;
    _suretyMobileController.text = c.surety.mobileNumber;
    _suretyAadhaarController.text = c.surety.aadhaarNumber;
    _suretyPanController.text = c.surety.panNumber;
    _suretyEmploymentController.text = c.surety.employmentDetails;
    _suretyIncomeController.text = c.surety.monthlyIncome.toStringAsFixed(0);
    _suretyActiveBails = c.surety.activeBailCount;
    
    _suretyPropertyAddressController.text = c.surety.propertyAddress;
    _suretySurveyController.text = c.surety.surveyNumber;
    _suretyValuationController.text = c.surety.propertyValuation.toStringAsFixed(0);
    _suretyTitleDeedController.text = c.surety.propertyOwnershipDoc;
    _suretyPattaController.text = c.surety.propertyRevenueRecord;
    _encumbranceStatus = c.surety.encumbranceStatus;

    _prosecutionController.text = c.arguments.prosecution;
    _defenceController.text = c.arguments.defence;
    _proposedBailController.text = c.proposedBailAmount.toStringAsFixed(0);
    
    _proposedConditions.clear();
    _proposedConditions.addAll(c.proposedConditions);
    
    _presidingJudgeController.text = c.presidingJudge;
    _judgeIdController.text = c.judgeId;
    _courtLocationController.text = c.courtLocation;
    _hearingDateController.text = c.hearingDate;
    _previousOrdersController.text = c.previousCourtOrders;

    _biometricScannerFingerprint = true;
    _biometricScannerIris = true;

    setState(() {});
  }

  void _submitApplication(AppState state) {
    // Generate case model and add to state database
    final newCase = CaseModel(
      caseNumber: _caseNumController.text,
      firNumber: _firController.text,
      ipcSections: _ipcController.text,
      dateOfArrest: _arrestDateController.text,
      policeStation: _policeStationController.text,
      presidingJudge: _presidingJudgeController.text,
      judgeId: _judgeIdController.text,
      courtLocation: _courtLocationController.text,
      previousCourtOrders: _previousOrdersController.text,
      filingDate: _filingDateController.text,
      supportingDocs: List.from(_supportingDocs),
      bailType: 'First Bail',
      proposedBailAmount: double.tryParse(_proposedBailController.text) ?? 50000.0,
      proposedConditions: List.from(_proposedConditions),
      hearingDate: _hearingDateController.text,
      currentStatus: 'Ready for Judge',
      orderStatus: 'PENDING',
      judgeRemarks: '',
      digitalSignature: '',
      accused: AccusedModel(
        fullName: _accusedNameController.text,
        dob: _accusedDobController.text,
        fathersName: _accusedFathersNameController.text,
        address: _accusedAddressController.text,
        mobileNumber: _accusedMobileController.text,
        aadhaarNumber: _accusedAadhaarController.text,
        panNumber: _accusedPanController.text,
        drivingLicense: _accusedDlController.text,
        passportNumber: _accusedPassportController.text,
        employmentDetails: _accusedEmploymentController.text,
        monthlyIncome: double.tryParse(_accusedIncomeController.text) ?? 0.0,
        bankAccount: _accusedBankController.text,
        cibilScore: int.tryParse(_accusedCibilController.text) ?? 700,
        criminalHistory: _accusedHistoryController.text,
        ncrbCount: _ncrbCount,
        prevBailsGranted: _prevBailsGranted,
        prevBailsHonored: _prevBailsHonored,
        abscondingCount: _abscondingCount,
        travelRestricted: _travelRestricted,
        bankBalance6m: _bankBalance6m,
      ),
      surety: SuretyModel(
        suretyType: _suretyType,
        fullName: _suretyNameController.text,
        relationToAccused: _suretyRelationController.text,
        mobileNumber: _suretyMobileController.text,
        aadhaarNumber: _suretyAadhaarController.text,
        panNumber: _suretyPanController.text,
        employmentDetails: _suretyEmploymentController.text,
        monthlyIncome: double.tryParse(_suretyIncomeController.text) ?? 0.0,
        activeBailCount: _suretyActiveBails,
        propertyAddress: _suretyPropertyAddressController.text,
        surveyNumber: _suretySurveyController.text,
        propertyValuation: double.tryParse(_suretyValuationController.text) ?? 0.0,
        propertyOwnershipDoc: _suretyTitleDeedController.text,
        propertyRevenueRecord: _suretyPattaController.text,
        encumbranceStatus: _encumbranceStatus,
        mutationStatus: 'PENDING',
      ),
      arguments: ArgumentsModel(
        prosecution: _prosecutionController.text,
        defence: _defenceController.text,
      ),
      checks: {},
    );

    state.addCase(newCase);
    state.setStaffActiveTab('status');
    _clearControllers();
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Bail Application filed successfully! Seeded into Court Register.'),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _clearControllers() {
    _caseNumController.clear();
    _firController.clear();
    _ipcController.clear();
    _policeStationController.clear();
    _supportingDocs.clear();
    _accusedNameController.clear();
    _accusedFathersNameController.clear();
    _accusedAddressController.clear();
    _accusedMobileController.clear();
    _accusedAadhaarController.clear();
    _accusedPanController.clear();
    _accusedDlController.clear();
    _accusedPassportController.clear();
    _accusedEmploymentController.clear();
    _accusedIncomeController.text = '0';
    _accusedBankController.clear();
    _accusedCibilController.text = '700';
    _accusedHistoryController.clear();
    _ncrbCount = 0;
    _prevBailsGranted = 0;
    _prevBailsHonored = 0;
    _abscondingCount = 0;
    _travelRestricted = false;
    _bankBalance6m = 10000;
    _suretyNameController.clear();
    _suretyRelationController.clear();
    _suretyMobileController.clear();
    _suretyAadhaarController.clear();
    _suretyPanController.clear();
    _suretyEmploymentController.clear();
    _suretyIncomeController.text = '0';
    _suretyActiveBails = 0;
    _suretyPropertyAddressController.clear();
    _suretySurveyController.clear();
    _suretyValuationController.text = '0';
    _suretyTitleDeedController.clear();
    _suretyPattaController.clear();
    _prosecutionController.clear();
    _defenceController.clear();
    _proposedBailController.text = '50000';
    _proposedConditions.clear();
    _previousOrdersController.clear();
    _biometricScannerFingerprint = false;
    _biometricScannerIris = false;
    _currentStep = 0;
  }

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppState>(context);
    final text = _localizedText[appState.locale]!;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          text['staff_portal']!,
          style: const TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.0),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.language),
            onPressed: () {
              appState.setLocale(appState.locale == 'en' ? 'hi' : 'en');
            },
          ),
          TextButton.icon(
            icon: const Icon(Icons.logout, color: Color(0xFFD4AF37)),
            label: Text(text['logout']!, style: const TextStyle(color: Color(0xFFD4AF37))),
            onPressed: () => appState.logout(),
          ),
        ],
      ),
      body: Column(
        children: [
          // Sub-navigation bar
          Container(
            color: isDark ? const Color(0xFF1E293B) : Colors.white,
            child: Row(
              children: [
                _buildTabButton('status', text['status_board']!, appState),
                _buildTabButton('new_app', text['new_application']!, appState),
              ],
            ),
          ),
          
          Expanded(
            child: appState.staffActiveTab == 'status'
                ? _buildStatusBoard(appState, text, isDark)
                : _buildNewApplicationForm(appState, text, isDark),
          ),
        ],
      ),
    );
  }

  Widget _buildTabButton(String tab, String label, AppState state) {
    final isActive = state.staffActiveTab == tab;
    return Expanded(
      child: InkWell(
        onTap: () {
          state.setStaffActiveTab(tab);
        },
        child: Container(
          alignment: Alignment.center,
          padding: const EdgeInsets.symmetric(vertical: 16),
          decoration: BoxDecoration(
            border: Border(
              bottom: BorderSide(
                color: isActive ? const Color(0xFFD4AF37) : Colors.transparent,
                width: 3,
              ),
            ),
          ),
          child: Text(
            label,
            style: TextStyle(
              fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
              color: isActive ? const Color(0xFFD4AF37) : null,
            ),
          ),
        ),
      ),
    );
  }

  // STATUS BOARD
  Widget _buildStatusBoard(AppState state, Map<String, String> text, bool isDark) {
    final filteredCases = state.cases.where((c) {
      final query = _searchQuery.toLowerCase();
      return c.caseNumber.toLowerCase().contains(query) ||
             c.accused.fullName.toLowerCase().contains(query);
    }).toList();

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        children: [
          // Search box
          TextField(
            onChanged: (val) {
              setState(() {
                _searchQuery = val;
              });
            },
            decoration: InputDecoration(
              hintText: text['search'],
              prefixIcon: const Icon(Icons.search),
              filled: true,
              fillColor: isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: BorderSide.none,
              ),
            ),
          ),
          const SizedBox(height: 16),
          
          // Case Table / List
          Expanded(
            child: ListView.builder(
              itemCount: filteredCases.length,
              itemBuilder: (context, idx) {
                final c = filteredCases[idx];
                return Card(
                  elevation: 2,
                  margin: const EdgeInsets.symmetric(vertical: 8),
                  child: ListTile(
                    contentPadding: const EdgeInsets.all(16),
                    title: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          c.caseNumber,
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                        ),
                        _buildStatusChip(c.orderStatus),
                      ],
                    ),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 8),
                        Text('Accused: ${c.accused.fullName}'),
                        Text('FIR: ${c.firNumber} | IPC: ${c.ipcSections}'),
                        Text('PS: ${c.policeStation}'),
                        Text('Presiding Judge: ${c.presidingJudge}'),
                      ],
                    ),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () {
                      // Optional: preview reports or details
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusChip(String status) {
    Color color;
    Color textColor = Colors.black;
    switch (status) {
      case 'GRANTED':
        color = Colors.green;
        textColor = Colors.white;
        break;
      case 'GRANTED_WITH_CONDITIONS':
        color = Colors.lightGreen;
        textColor = Colors.black;
        break;
      case 'DENIED':
        color = Colors.red;
        textColor = Colors.white;
        break;
      case 'ADJOURNED':
        color = Colors.orange;
        textColor = Colors.white;
        break;
      default:
        color = Colors.grey;
        textColor = Colors.white;
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        status,
        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: textColor),
      ),
    );
  }

  // STEPPER FORM FOR NEW APPLICATION
  Widget _buildNewApplicationForm(AppState state, Map<String, String> text, bool isDark) {
    return Column(
      children: [
        // Demo tools
        Container(
          padding: const EdgeInsets.all(12),
          color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFD4AF37).withOpacity(0.2),
                foregroundColor: const Color(0xFFD4AF37),
              ).build(context, 
                onPressed: () => _autofillForm(state, 'capable'),
                child: Text(text['prepopulate_capable']!),
              ),
              ElevatedButton.styleFrom(
                backgroundColor: Colors.red.withOpacity(0.2),
                foregroundColor: Colors.red,
              ).build(context, 
                onPressed: () => _autofillForm(state, 'high_risk'),
                child: Text(text['prepopulate_risk']!),
              ),
            ],
          ),
        ),

        Expanded(
          child: Stepper(
            currentStep: _currentStep,
            onStepContinue: () {
              if (_currentStep < 3) {
                setState(() {
                  _currentStep += 1;
                });
              } else {
                _submitApplication(state);
              }
            },
            onStepCancel: () {
              if (_currentStep > 0) {
                setState(() {
                  _currentStep -= 1;
                });
              }
            },
            steps: [
              Step(
                title: const Text('1. Case Details'),
                isActive: _currentStep >= 0,
                content: _buildSection1(text, isDark),
              ),
              Step(
                title: const Text('2. Accused Details'),
                isActive: _currentStep >= 1,
                content: _buildSection2(text, isDark),
              ),
              Step(
                title: const Text('3. Surety Details'),
                isActive: _currentStep >= 2,
                content: _buildSection3(text, isDark),
              ),
              Step(
                title: const Text('4. Arguments & Courtroom'),
                isActive: _currentStep >= 3,
                content: _buildSection4(text, isDark),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // Section 1: Case Details
  Widget _buildSection1(Map<String, String> text, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildTextField(_caseNumController, text['case_no']!),
        _buildTextField(_firController, text['fir_no']!),
        _buildTextField(_ipcController, text['ipc_sections']!),
        _buildTextField(_arrestDateController, text['arrest_date']!),
        _buildTextField(_policeStationController, text['police_station']!),
        _buildTextField(_filingDateController, text['filing_date']!),
        const SizedBox(height: 12),
        Text(text['docs']!, style: const TextStyle(fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        _buildDocCheckbox('Character Certificate'),
        _buildDocCheckbox('Employment Letter'),
        _buildDocCheckbox('Community Ties Evidence'),
        _buildDocCheckbox('Land Ownership Documents'),
      ],
    );
  }

  Widget _buildDocCheckbox(String doc) {
    final contains = _supportingDocs.contains(doc);
    return CheckboxListTile(
      title: Text(doc),
      value: contains,
      onChanged: (val) {
        setState(() {
          if (val == true) {
            _supportingDocs.add(doc);
          } else {
            _supportingDocs.remove(doc);
          }
        });
      },
      controlAffinity: ListTileControlAffinity.leading,
    );
  }

  // Section 2: Accused details
  Widget _buildSection2(Map<String, String> text, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildTextField(_accusedNameController, text['accused_name']!),
        _buildTextField(_accusedFathersNameController, text['fathers_name']!),
        _buildTextField(_accusedDobController, text['dob']!),
        _buildTextField(_accusedAddressController, text['address']!),
        _buildTextField(_accusedMobileController, text['mobile']!),
        _buildTextField(_accusedAadhaarController, text['aadhaar']!),
        _buildTextField(_accusedPanController, text['pan']!),
        _buildTextField(_accusedDlController, text['dl']!),
        _buildTextField(_accusedPassportController, text['passport']!),
        _buildTextField(_accusedEmploymentController, text['employment']!),
        _buildTextField(_accusedIncomeController, text['income']!, keyboardType: TextInputType.number),
        _buildTextField(_accusedBankController, text['bank']!),
        _buildTextField(_accusedCibilController, text['cibil']!, keyboardType: TextInputType.number),
        _buildTextField(_accusedHistoryController, text['crim_history']!),
        
        const SizedBox(height: 12),
        const Text('Prior Offences Tracker (NCRB / eCourts):', style: TextStyle(fontWeight: FontWeight.bold)),
        Row(
          children: [
            Expanded(child: _buildCounter('NCRB Active FIRs Count', _ncrbCount, (v) => setState(() => _ncrbCount = v))),
            Expanded(child: _buildCounter('Bails Granted', _prevBailsGranted, (v) => setState(() => _prevBailsGranted = v))),
          ],
        ),
        Row(
          children: [
            Expanded(child: _buildCounter('Bails Honored', _prevBailsHonored, (v) => setState(() => _prevBailsHonored = v))),
            Expanded(child: _buildCounter('Absconding Incidents', _abscondingCount, (v) => setState(() => _abscondingCount = v))),
          ],
        ),
        
        SwitchListTile(
          title: const Text('Travel Restrictions (Watch List LOC Checked)'),
          value: _travelRestricted,
          onChanged: (val) => setState(() => _travelRestricted = val),
        ),
        
        const SizedBox(height: 16),
        Text(text['biometrics']!, style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFD4AF37))),
        const SizedBox(height: 8),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            ElevatedButton.icon(
              icon: Icon(Icons.fingerprint, color: _biometricScannerFingerprint ? Colors.green : Colors.grey),
              label: const Text('Fingerprint Scan'),
              onPressed: () => setState(() => _biometricScannerFingerprint = true),
            ),
            ElevatedButton.icon(
              icon: Icon(Icons.remove_red_eye, color: _biometricScannerIris ? Colors.green : Colors.grey),
              label: const Text('Retina Iris Scan'),
              onPressed: () => setState(() => _biometricScannerIris = true),
            ),
          ],
        ),
      ],
    );
  }

  // Section 3: Surety Details
  Widget _buildSection3(Map<String, String> text, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(text['surety_type']!, style: const TextStyle(fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: ChoiceChip(
                label: Text(text['property']!),
                selected: _suretyType == 'PROPERTY',
                onSelected: (val) {
                  if (val) setState(() => _suretyType = 'PROPERTY');
                },
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: ChoiceChip(
                label: Text(text['individual']!),
                selected: _suretyType == 'INDIVIDUAL',
                onSelected: (val) {
                  if (val) setState(() => _suretyType = 'INDIVIDUAL');
                },
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        _buildTextField(_suretyNameController, 'Surety Full Name'),
        _buildTextField(_suretyRelationController, text['relation']!),
        _buildTextField(_suretyMobileController, 'Mobile Number'),
        _buildTextField(_suretyAadhaarController, 'Aadhaar Number'),
        _buildTextField(_suretyPanController, 'PAN Number'),
        _buildTextField(_suretyEmploymentController, text['employment']!),
        _buildTextField(_suretyIncomeController, text['income']!, keyboardType: TextInputType.number),
        _buildCounter(text['active_bails']!, _suretyActiveBails, (v) => setState(() => _suretyActiveBails = v)),

        if (_suretyType == 'PROPERTY') ...[
          const SizedBox(height: 16),
          const Text('Asset Valuation & Mandal Records (Webland API)', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFD4AF37))),
          const SizedBox(height: 8),
          _buildTextField(_suretyPropertyAddressController, text['prop_address']!),
          _buildTextField(_suretySurveyController, text['survey_no']!),
          _buildTextField(_suretyValuationController, text['valuation']!, keyboardType: TextInputType.number),
          _buildTextField(_suretyTitleDeedController, text['title_deed']!),
          _buildTextField(_suretyPattaController, text['patta']!),
          const SizedBox(height: 12),
          Text(text['encumbrance']!, style: const TextStyle(fontWeight: FontWeight.bold)),
          Row(
            children: [
              Expanded(
                child: RadioListTile<String>(
                  title: Text(text['clean']!),
                  value: 'CLEAN',
                  groupValue: _encumbranceStatus,
                  onChanged: (v) => setState(() => _encumbranceStatus = v!),
                ),
              ),
              Expanded(
                child: RadioListTile<String>(
                  title: Text(text['encumbered']!),
                  value: 'ENCUMBERED',
                  groupValue: _encumbranceStatus,
                  onChanged: (v) => setState(() => _encumbranceStatus = v!),
                ),
              ),
            ],
          ),
        ],
      ],
    );
  }

  // Section 4: Arguments & Courtroom
  Widget _buildSection4(Map<String, String> text, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildTextField(_prosecutionController, text['prosecution']!, maxLines: 2),
        _buildTextField(_defenceController, text['defence']!, maxLines: 2),
        _buildTextField(_proposedBailController, text['proposed_bail']!, keyboardType: TextInputType.number),
        
        const SizedBox(height: 12),
        Text(text['conditions']!, style: const TextStyle(fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        _buildConditionCheckbox('Weekly Reporting'),
        _buildConditionCheckbox('Passport Deposit'),
        _buildConditionCheckbox('No Contact with Witnesses'),
        _buildConditionCheckbox('Geofence Restrictions'),

        const SizedBox(height: 16),
        _buildTextField(_presidingJudgeController, text['presiding_judge']!),
        _buildTextField(_judgeIdController, text['judge_id']!),
        _buildTextField(_courtLocationController, text['court_location']!),
        _buildTextField(_hearingDateController, text['hearing_date']!),
        _buildTextField(_previousOrdersController, text['prev_orders']!),
      ],
    );
  }

  Widget _buildConditionCheckbox(String cond) {
    final contains = _proposedConditions.contains(cond);
    return CheckboxListTile(
      title: Text(cond),
      value: contains,
      onChanged: (val) {
        setState(() {
          if (val == true) {
            _proposedConditions.add(cond);
          } else {
            _proposedConditions.remove(cond);
          }
        });
      },
      controlAffinity: ListTileControlAffinity.leading,
    );
  }

  // HELPER WIDGETS
  Widget _buildTextField(
    TextEditingController controller,
    String label, {
    TextInputType keyboardType = TextInputType.text,
    int maxLines = 1,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: TextField(
        controller: controller,
        keyboardType: keyboardType,
        maxLines: maxLines,
        decoration: InputDecoration(
          labelText: label,
          border: const OutlineInputBorder(),
          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
        ),
      ),
    );
  }

  Widget _buildCounter(String label, int value, ValueChanged<int> onChanged) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 13)),
          Row(
            children: [
              IconButton(
                icon: const Icon(Icons.remove_circle_outline),
                onPressed: value > 0 ? () => onChanged(value - 1) : null,
              ),
              Text(value.toString(), style: const TextStyle(fontWeight: FontWeight.bold)),
              IconButton(
                icon: const Icon(Icons.add_circle_outline),
                onPressed: () => onChanged(value + 1),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// Extension to allow custom builders on ElevatedButton for backward compatibility
extension ElevatedButtonBuildExtension on ElevatedButton {
  Widget build(BuildContext context, {required VoidCallback onPressed, required Widget child}) {
    return ElevatedButton(
      style: style,
      onPressed: onPressed,
      child: child,
    );
  }
}
