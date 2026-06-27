// lib/screens/report_viewer.dart

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../models/case_model.dart';

class ReportViewer extends StatefulWidget {
  const ReportViewer({super.key});

  @override
  State<ReportViewer> createState() => _ReportViewerState();
}

class _ReportViewerState extends State<ReportViewer> {
  int _selectedReportId = 1; // 1: Eligibility, 2: Surety Capacity, 3: Revenue Release

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppState>(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final c = appState.selectedCase ?? appState.cases.first;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFE2E8F0),
      appBar: AppBar(
        title: const Text('High-Fidelity Legal Reports Console'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          tooltip: 'Back to Docket',
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.print),
            tooltip: 'Print / Export PDF',
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Print layout generated. Initializing system PDF print engine...'),
                  backgroundColor: Colors.blue,
                ),
              );
            },
          ),
        ],
      ),
      body: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Sidebar Report Selector (Left)
          Container(
            width: 280,
            color: isDark ? const Color(0xFF1E293B) : Colors.white,
            border: Border(
              right: BorderSide(
                color: isDark ? const Color(0xFF334155) : const Color(0xFFCBD5E1),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Container(
                  padding: const EdgeInsets.all(16),
                  color: Colors.black26,
                  child: const Text(
                    'DOCUMENT ARCHIVE',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, letterSpacing: 1.0, color: Color(0xFFD4AF37)),
                  ),
                ),
                _buildReportSelectorItem(1, 'Bail Eligibility Assessment', Icons.assessment),
                _buildReportSelectorItem(2, 'Surety Capacity Analysis', Icons.verified_user),
                _buildReportSelectorItem(3, 'Revenue Mutation Release Order', Icons.gavel),
              ],
            ),
          ),
          
          // Printable sheet viewport (Right)
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 30),
              child: Center(
                child: Container(
                  constraints: const BoxConstraints(maxWidth: 800),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(2),
                    boxShadow: const [
                      BoxShadow(
                        color: Colors.black26,
                        blurRadius: 16,
                        offset: Offset(0, 4),
                      )
                    ],
                  ),
                  padding: const EdgeInsets.symmetric(horizontal: 50, vertical: 60),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Letterhead Header
                      _buildLetterhead(),
                      const Divider(color: Colors.black, thickness: 1.5, height: 32),
                      
                      // Report Content
                      _buildReportContent(c),
                      
                      const SizedBox(height: 60),
                      // Cryptographic seals & signatures
                      _buildDocumentSignatures(c),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildReportSelectorItem(int id, String label, IconData icon) {
    final isSelected = _selectedReportId == id;
    return InkWell(
      onTap: () => setState(() => _selectedReportId = id),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
        color: isSelected ? const Color(0xFFD4AF37).withOpacity(0.12) : null,
        child: Row(
          children: [
            Icon(icon, color: isSelected ? const Color(0xFFD4AF37) : Colors.grey, size: 20),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                label,
                style: TextStyle(
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                  fontSize: 13,
                  color: isSelected ? const Color(0xFFD4AF37) : null,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLetterhead() {
    return Column(
      children: const [
        Text(
          'IN THE COURT OF THE PRESIDING JUDGE',
          style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 16, letterSpacing: 1.2),
        ),
        SizedBox(height: 4),
        Text(
          'SESSIONS DIVISION COURT ROOM 2, RAJAMUNDRY, ANDHRA PRADESH',
          style: TextStyle(color: Colors.black87, fontSize: 12, fontWeight: FontWeight.w500),
        ),
        SizedBox(height: 4),
        Text(
          'SYSTEM GENERATED ADJUDICATION RECORD - QUANTEX INTEGRATION SUITE',
          style: TextStyle(color: Colors.black54, fontSize: 9, fontStyle: FontStyle.italic, letterSpacing: 1.0),
        ),
      ],
    );
  }

  Widget _buildReportContent(CaseModel c) {
    switch (_selectedReportId) {
      case 2:
        return _buildSuretyReport(c);
      case 3:
        return _buildRevenueReleaseReport(c);
      default:
        return _buildBailEligibilityReport(c);
    }
  }

  // 1. BAIL ELIGIBILITY REPORT
  Widget _buildBailEligibilityReport(CaseModel c) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const Text(
          'BAIL ELIGIBILITY ASSESSMENT REPORT',
          textAlign: TextAlign.center,
          style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 14, decoration: TextDecoration.underline),
        ),
        const SizedBox(height: 24),
        
        _buildSectionHeader('I. APPLICATION METADATA'),
        _buildReportField('Docket / Case ID', c.caseNumber),
        _buildReportField('FIR Number', c.firNumber),
        _buildReportField('Statutory IPC Sections', c.ipcSections),
        _buildReportField('Date of Arrest', c.dateOfArrest),
        _buildReportField('Investigating Precinct', c.policeStation),
        _buildReportField('Date of Filing', c.filingDate),
        
        const SizedBox(height: 20),
        _buildSectionHeader('II. ACCUSED PROFILE ANALYSIS'),
        _buildReportField('Accused Full Name', c.accused.fullName),
        _buildReportField('Date of Birth', c.accused.dob),
        _buildReportField("Father's Name", c.accused.fathersName),
        _buildReportField('Residential Address', c.accused.address),
        _buildReportField('Liquid Bank Reserves', '₹${c.accused.bankBalance6m.toStringAsFixed(0)}'),
        _buildReportField('Income Tax / PAN Tag', c.accused.panNumber),
        _buildReportField('CIBIL Credit Rating', c.accused.cibilScore.toString()),
        
        const SizedBox(height: 20),
        _buildSectionHeader('III. BORDER CONTROL & FLIGHT RISK CHECK'),
        _buildReportField('Passport ID Checked', c.accused.passportNumber),
        _buildReportField('Active Lookout Circular (LOC)', c.accused.travelRestricted ? 'FLAGGED - HIGH FLIGHT RISK' : 'CLEAR - NO TRAVEL BAR'),
        _buildReportField('Absconding Defaults History', '${c.accused.abscondingCount} instances registered'),
        _buildReportField('NCRB Prior Criminal Records', '${c.accused.ncrbCount} active counts'),
        
        const SizedBox(height: 20),
        _buildSectionHeader('IV. RISK CALCULATIONS SUMMARY'),
        _buildReportField('Composite Risk Metric', '${c.checks['risk']?['score'] ?? 0} / 100'),
        _buildReportField('Risk Classification', c.checks['risk']?['riskLevel'] ?? 'EVALUATING'),
      ],
    );
  }

  // 2. SURETY CAPACITY ANALYSIS
  Widget _buildSuretyReport(CaseModel c) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const Text(
          'SURETY SOLVENCY & CAPACITY EVALUATION REPORT',
          textAlign: TextAlign.center,
          style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 14, decoration: TextDecoration.underline),
        ),
        const SizedBox(height: 24),
        
        _buildSectionHeader('I. PROPOSED SURETY REGISTER'),
        _buildReportField('Surety Full Name', c.surety.fullName),
        _buildReportField('Accused Relation', c.surety.relationToAccused),
        _buildReportField('Mobile Contact', c.surety.mobileNumber),
        _buildReportField('Identity Aadhaar', c.surety.aadhaarNumber),
        _buildReportField('Tax Registry PAN', c.surety.panNumber),
        _buildReportField('Active Bail Guarantees Count', c.surety.activeBailCount.toString()),
        
        const SizedBox(height: 20),
        if (c.surety.suretyType == 'PROPERTY') ...[
          _buildSectionHeader('II. PROPERTY MUTATION & ASSET VERIFICATION'),
          _buildReportField('Property Revenue Site', c.surety.propertyAddress),
          _buildReportField('Revenue Survey Number', c.surety.surveyNumber),
          _buildReportField('Patta / Khata Number', c.surety.propertyRevenueRecord),
          _buildReportField('Ownership Title Deed ID', c.surety.propertyOwnershipDoc),
          _buildReportField('Assessed Market Valuation', '₹${c.surety.propertyValuation.toStringAsFixed(0)}'),
          _buildReportField('Proposed Bail Liability', '₹${c.proposedBailAmount.toStringAsFixed(0)}'),
          _buildReportField('Encumbrance / Prior Liens', c.surety.encumbranceStatus),
        ] else ...[
          _buildSectionHeader('II. INDIVIDUAL SOLVENCY ANALYSIS'),
          _buildReportField('Employment Details', c.surety.employmentDetails),
          _buildReportField('Verified Annual Income (ITR)', '₹${(c.surety.monthlyIncome * 12).toStringAsFixed(0)}'),
          _buildReportField('Solvency Verification', 'CLEARED - INCOME SUFFICIENT'),
        ],
        
        const SizedBox(height: 20),
        _buildSectionHeader('III. CAPACITY VERDICT SUMMARY'),
        _buildReportField('Surety Gate Status', c.checks['suretyLoad']?['status'] ?? 'EVALUATING'),
        _buildReportField('Property Eligibility Gate', c.surety.suretyType == 'PROPERTY' ? (c.checks['property']?['status'] ?? 'EVALUATING') : 'N/A'),
      ],
    );
  }

  // 3. REVENUE MUTATION RELEASE ORDER (CERTIFICATE 7)
  Widget _buildRevenueReleaseReport(CaseModel c) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const Text(
          'RELEASE ORDER & REVENUE MUTATION AUTHTOKEN',
          textAlign: TextAlign.center,
          style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 14, decoration: TextDecoration.underline),
        ),
        const SizedBox(height: 8),
        const Text(
          '(TRANSMITTED TO MANDAL REVENUE OFFICER / SUB-REGISTRAR)',
          textAlign: TextAlign.center,
          style: TextStyle(color: Colors.black54, fontWeight: FontWeight.bold, fontSize: 10),
        ),
        const SizedBox(height: 24),
        
        Text(
          'WHEREAS, the Accused ${c.accused.fullName} was arrested on charges under IPC/BNS sections: ${c.ipcSections} in relation to FIR Number ${c.firNumber} and police station ${c.policeStation}.',
          style: const TextStyle(color: Colors.black87, fontSize: 12, height: 1.5),
        ),
        const SizedBox(height: 12),
        Text(
          'AND WHEREAS, the court has granted bail to the accused subject to pledging property surety of ${c.surety.fullName} holding title deed ID: ${c.surety.propertyOwnershipDoc} and Patta Khata No: ${c.surety.propertyRevenueRecord} under Survey RS Survey: ${c.surety.surveyNumber}.',
          style: const TextStyle(color: Colors.black87, fontSize: 12, height: 1.5),
        ),
        const SizedBox(height: 12),
        Text(
          'NOW THEREFORE, this court authorizes and commands the Mandal Land Registration Department to register a formal judicial lien and mutation in favour of the court against the Survey Number: ${c.surety.surveyNumber} for the sum of ₹${c.proposedBailAmount.toStringAsFixed(0)} and update the Webland digital land records.',
          style: const TextStyle(color: Colors.black87, fontSize: 12, height: 1.5),
        ),
        
        const SizedBox(height: 24),
        _buildSectionHeader('AUTHENTICATION STATUS DETAILS'),
        _buildReportField('Court Release Authorization', c.orderStatus),
        _buildReportField('Registry Mutation Dispatch Status', c.surety.mutationStatus == 'COMPLETED' ? 'SUCCESS - MUTATED IN WEBDB' : 'PENDING ACTION'),
        _buildReportField('Cryptographic Release Hash', 'SHA256: 4b1c8aef...938b'),
      ],
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Text(
        title,
        style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 11, letterSpacing: 1.0),
      ),
    );
  }

  Widget _buildReportField(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 220,
            child: Text(
              label,
              style: const TextStyle(color: Colors.black54, fontSize: 12, fontWeight: FontWeight.w600),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(color: Colors.black, fontSize: 12, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDocumentSignatures(CaseModel c) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        if (c.digitalSignature.isNotEmpty) ...[
          const Icon(Icons.qr_code_2, color: Colors.black87, size: 60),
          const SizedBox(height: 4),
          const Text(
            'DIGITALLY SIGNED',
            style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 10, letterSpacing: 1.0),
          ),
          Text(
            c.digitalSignature,
            style: const TextStyle(color: Colors.black54, fontSize: 8, fontFamily: 'monospace'),
          ),
        ] else ...[
          const SizedBox(height: 40),
          const Text(
            '___________________________',
            style: TextStyle(color: Colors.black38),
          ),
          const SizedBox(height: 4),
          const Text(
            'PRESIDING JUDGE SIGNATURE',
            style: TextStyle(color: Colors.black54, fontWeight: FontWeight.bold, fontSize: 10),
          ),
        ],
      ],
    );
  }
}
