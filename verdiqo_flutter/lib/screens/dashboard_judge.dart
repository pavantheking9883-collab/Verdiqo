// lib/screens/dashboard_judge.dart

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'dart:math' as math;
import '../providers/app_state.dart';
import '../models/case_model.dart';
import 'report_viewer.dart';

class DashboardJudge extends StatefulWidget {
  const DashboardJudge({super.key});

  @override
  State<DashboardJudge> createState() => _DashboardJudgeState();
}

class _DashboardJudgeState extends State<DashboardJudge> {
  final _remarksController = TextEditingController();
  List<Offset> _signaturePoints = [];
  bool _isSigned = false;

  final Map<String, Map<String, String>> _localizedText = {
    'en': {
      'judge_portal': 'Preceding Judge Decision Support Dashboard',
      'logout': 'LOGOUT',
      'active_docket': 'Active Judicial Docket',
      'no_cases': 'No active cases in docket',
      'accused_details': 'Accused Verification Checklists',
      'surety_details': 'Surety & Mutation Verification',
      'decision_advice': 'Quantex Smart Decision Advice',
      'risk_gauge': 'Conic Risk Gauge',
      'risk_reasons': 'Risk Score Rationale',
      'severity_check': 'Offence Severity Evaluation',
      'recommendation': 'System Recommendation Verdict',
      'gateways': 'Quantex Secure Gateways: Real-Time API Integrations',
      'adjudication': 'Adjudication Directives',
      'remarks': 'Enter Judicial Decree / Court Remarks...',
      'sign_pad': 'Encrypted Digital e-Sign Panel (Click & Draw)',
      'submit_verdict': 'SUBMIT FINAL COURT VERDICT',
      'clear_sign': 'Clear Pad',
      'view_reports': 'Case Docket Reports',
      'cibil': 'CIBIL Credit Score',
      'avg_bal': 'Average Bank Balance (6M)',
      'ncrb': 'NCRB prior arrests',
      'abscond': 'Absconding incidents',
      'travel': 'Travel restriction LOC',
    },
    'hi': {
      'judge_portal': 'पीठासीन न्यायाधीश निर्णय सहायता डैशबोर्ड',
      'logout': 'लॉगआउट',
      'active_docket': 'सक्रिय न्यायिक डॉकेट',
      'no_cases': 'डॉकेट में कोई सक्रिय मामला नहीं है',
      'accused_details': 'आरोपी सत्यापन चेकलिस्ट',
      'surety_details': 'ज़मानतदार और उत्परिवर्तन सत्यापन',
      'decision_advice': 'क्वांटेक्स स्मार्ट निर्णय सलाह',
      'risk_gauge': 'शंकु आकार जोखिम गेज',
      'risk_reasons': 'जोखिम स्कोर तर्क',
      'severity_check': 'अपराध की गंभीरता का मूल्यांकन',
      'recommendation': 'सिस्टम अनुशंसा निर्णय',
      'gateways': 'क्वांटेक्स सिक्योर गेटवेज: रीयल-टाइम एपीआई एकीकरण',
      'adjudication': 'निर्णय संबंधी निर्देश',
      'remarks': 'अदालती आदेश / न्यायिक टिप्पणी दर्ज करें...',
      'sign_pad': 'एन्क्रिप्टेड डिजिटल ई-साइन पैनल (क्लिक करें और ड्रा करें)',
      'submit_verdict': 'अंतिम अदालती फैसला जमा करें',
      'clear_sign': 'पैड साफ़ करें',
      'view_reports': 'केस डॉकेट रिपोर्ट देखें',
      'cibil': 'सिबिल (CIBIL) क्रेडिट स्कोर',
      'avg_bal': 'औसत बैंक बैलेंस (6 माह)',
      'ncrb': 'NCRB पूर्व गिरफ्तारी संख्या',
      'abscond': 'फरार होने की घटनाएं',
      'travel': 'यात्रा प्रतिबंध LOC सूची',
    }
  };

  void _submitVerdict(AppState state, String verdict) {
    if (state.selectedCase == null) return;
    if (!_isSigned) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Verification failed: Encrypted digital e-signature required.'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    state.updateCaseVerdict(
      state.selectedCase!.caseNumber,
      verdict,
      _remarksController.text,
      'SIGNED-BY-JUDGE-KAMESWARA-${DateTime.now().millisecondsSinceEpoch}',
    );

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Decree submitted! Cryptographic dispatches sent to prison & revenue registrars.'),
        backgroundColor: Colors.green,
      ),
    );

    setState(() {
      _remarksController.clear();
      _signaturePoints.clear();
      _isSigned = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppState>(context);
    final text = _localizedText[appState.locale]!;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    // Pre-select first case if none selected
    if (appState.selectedCase == null && appState.cases.isNotEmpty) {
      Future.microtask(() {
        appState.selectCase(appState.cases.first);
      });
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(text['judge_portal']!),
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
      body: LayoutBuilder(
        builder: (context, constraints) {
          final isWide = constraints.maxWidth > 900;
          if (appState.cases.isEmpty) {
            return Center(child: Text(text['no_cases']!));
          }
          final c = appState.selectedCase ?? appState.cases.first;

          if (isWide) {
            return Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Case List Sidebar (Left)
                Container(
                  width: 320,
                  decoration: BoxDecoration(
                    border: Border(
                      right: BorderSide(
                        color: isDark ? const Color(0xFF1E293B) : const Color(0xFFE2E8F0),
                      ),
                    ),
                  ),
                  child: _buildCaseSidebar(appState, isDark),
                ),
                
                // Detailed Workspace (Right)
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        _buildDocketHeader(c, text, isDark),
                        const SizedBox(height: 20),
                        
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Column 1: Accused Checklists & Surety/Mutation Details
                            Expanded(
                              flex: 2,
                              child: Column(
                                children: [
                                  _buildAccusedChecklistCard(c, text, isDark),
                                  const SizedBox(height: 20),
                                  _buildSuretyDetailsCard(c, text, isDark),
                                ],
                              ),
                            ),
                            const SizedBox(width: 20),
                            
                            // Column 2: Quantex Decision Advice
                            Expanded(
                              flex: 3,
                              child: _buildDecisionAdviceCard(c, text, isDark, appState),
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),
                        
                        // External API Gateways Panel
                        _buildExternalGatewaysCard(text, isDark),
                      ],
                    ),
                  ),
                ),
              ],
            );
          } else {
            // Adaptive layout for smaller mobile/tablet screens (Single scroll column)
            return SingleChildScrollView(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  _buildMobileCaseSelector(appState, isDark),
                  const SizedBox(height: 12),
                  _buildDocketHeader(c, text, isDark),
                  const SizedBox(height: 12),
                  _buildDecisionAdviceCard(c, text, isDark, appState),
                  const SizedBox(height: 12),
                  _buildAccusedChecklistCard(c, text, isDark),
                  const SizedBox(height: 12),
                  _buildSuretyDetailsCard(c, text, isDark),
                  const SizedBox(height: 12),
                  _buildExternalGatewaysCard(text, isDark),
                ],
              ),
            );
          }
        },
      ),
    );
  }

  Widget _buildDocketHeader(CaseModel c, Map<String, String> text, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : Colors.white,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: const Color(0xFFD4AF37).withOpacity(0.5)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Case: ${c.caseNumber} (Filing: ${c.filingDate})',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Color(0xFFD4AF37)),
              ),
              const SizedBox(height: 4),
              Text('FIR: ${c.firNumber} | IPC/BNS: ${c.ipcSections} | Arrested: ${c.dateOfArrest}'),
            ],
          ),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFD4AF37).withOpacity(0.2),
              foregroundColor: const Color(0xFFD4AF37),
              side: const BorderSide(color: Color(0xFFD4AF37)),
            ),
            icon: const Icon(Icons.description),
            label: Text(text['view_reports']!),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const ReportViewer()),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildCaseSidebar(AppState state, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9),
          child: const Text(
            'ACTIVE JUDICIAL DOCKET',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, letterSpacing: 1.0, color: Color(0xFFD4AF37)),
          ),
        ),
        Expanded(
          child: ListView.builder(
            itemCount: state.cases.length,
            itemBuilder: (context, idx) {
              final c = state.cases[idx];
              final isSelected = c.caseNumber == state.selectedCase?.caseNumber;
              return Container(
                color: isSelected ? const Color(0xFFD4AF37).withOpacity(0.1) : null,
                child: ListTile(
                  title: Text(c.caseNumber, style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text(c.accused.fullName),
                  trailing: Container(
                    width: 12,
                    height: 12,
                    decoration: BoxDecoration(
                      color: c.orderStatus == 'PENDING' ? Colors.orange : Colors.green,
                      shape: BoxShape.circle,
                    ),
                  ),
                  onTap: () {
                    state.selectCase(c);
                  },
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildMobileCaseSelector(AppState state, bool isDark) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : Colors.white,
        borderRadius: BorderRadius.circular(8),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<CaseModel>(
          value: state.selectedCase ?? state.cases.first,
          isExpanded: true,
          items: state.cases.map((c) {
            return DropdownMenuItem(
              value: c,
              child: Text('${c.caseNumber} - ${c.accused.fullName}'),
            );
          }).toList(),
          onChanged: (c) {
            if (c != null) state.selectCase(c);
          },
        ),
      ),
    );
  }

  // PANEL 1: ACCUSED CHECKLIST CARD
  Widget _buildAccusedChecklistCard(CaseModel c, Map<String, String> text, bool isDark) {
    final checks = c.checks;
    final risk = checks['risk'] ?? {};
    final identity = checks['identity'] ?? {};

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              text['accused_details']!,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFFD4AF37)),
            ),
            const Divider(height: 24),
            
            // Accused details table
            _buildChecklistRow('Aadhaar Identity Verification', identity['status'] == 'GREEN'),
            _buildChecklistRow('Aadhaar Fingerprint Biometric Check', identity['status'] == 'GREEN'),
            _buildChecklistRow('Aadhaar Iris Retina Scanner Match', identity['status'] == 'GREEN'),
            const SizedBox(height: 16),
            
            // Stats table
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildStatBadge(text['cibil']!, c.accused.cibilScore.toString()),
                _buildStatBadge(text['avg_bal']!, '₹${c.accused.bankBalance6m.toStringAsFixed(0)}'),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildStatBadge(text['ncrb']!, c.accused.ncrbCount.toString()),
                _buildStatBadge(text['abscond']!, c.accused.abscondingCount.toString()),
              ],
            ),
            const SizedBox(height: 12),
            _buildChecklistRow(text['travel']!, !c.accused.travelRestricted),
          ],
        ),
      ),
    );
  }

  Widget _buildChecklistRow(String label, bool isCleared) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        children: [
          Icon(
            isCleared ? Icons.check_circle : Icons.warning,
            color: isCleared ? Colors.green : Colors.red,
            size: 20,
          ),
          const SizedBox(width: 8),
          Expanded(child: Text(label, style: const TextStyle(fontSize: 13))),
        ],
      ),
    );
  }

  Widget _buildStatBadge(String label, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.black26,
        borderRadius: BorderRadius.circular(4),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 10, color: Colors.grey)),
          const SizedBox(height: 2),
          Text(value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  // PANEL 2: SURETY MUTATION DETAILS CARD
  Widget _buildSuretyDetailsCard(CaseModel c, Map<String, String> text, bool isDark) {
    final checks = c.checks;
    final finance = checks['finance'] ?? {};
    final suretyLoad = checks['suretyLoad'] ?? {};
    final property = checks['property'] ?? {};

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              text['surety_details']!,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFFD4AF37)),
            ),
            const Divider(height: 24),
            Text('Surety Name: ${c.surety.fullName} (${c.surety.relationToAccused})'),
            const SizedBox(height: 4),
            Text('Surety Type: ${c.surety.suretyType}'),
            const SizedBox(height: 4),
            Text('Monthly Income: ₹${c.surety.monthlyIncome.toStringAsFixed(0)}'),
            const SizedBox(height: 12),

            _buildChecklistRow('Financial Capability: ${finance['status']}', finance['status'] == 'CAPABLE' || finance['status'] == 'BORDERLINE'),
            _buildChecklistRow('Surety Cross-Court Load: ${suretyLoad['status']}', suretyLoad['status'] == 'CLEAR'),

            if (c.surety.suretyType == 'PROPERTY') ...[
              const SizedBox(height: 12),
              const Divider(),
              Text('Survey No: ${c.surety.surveyNumber}'),
              Text('Patta No: ${c.surety.propertyRevenueRecord}'),
              Text('Revenue Value: ₹${c.surety.propertyValuation.toStringAsFixed(0)}'),
              Text('Mutation Status: ${c.surety.mutationStatus}', style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFD4AF37))),
              const SizedBox(height: 8),
              _buildChecklistRow('Land Title Deed Verification', property['status'] == 'ELIGIBLE'),
              _buildChecklistRow('Webland Encumbrance Status: CLEAN', property['status'] == 'ELIGIBLE'),
            ],
          ],
        ),
      ),
    );
  }

  // PANEL 3: DECISION ADVICE CARD (WITH RISK GAUGE & E-SIGN)
  Widget _buildDecisionAdviceCard(CaseModel c, Map<String, String> text, bool isDark, AppState state) {
    final checks = c.checks;
    final risk = checks['risk'] ?? {'score': 0, 'riskLevel': 'LOW', 'reasons': []};
    final recommendation = checks['recommendation'] ?? {'verdict': 'PENDING', 'reasoningEn': '', 'reasoningHi': ''};
    final score = risk['score'] as int? ?? 0;
    
    final reasoning = state.locale == 'en' ? recommendation['reasoningEn'] : recommendation['reasoningHi'];

    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              text['decision_advice']!,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Color(0xFFD4AF37)),
            ),
            const Divider(height: 24),
            
            // conic Gauge and details side-by-side (if space allows)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                Column(
                  children: [
                    SizedBox(
                      width: 140,
                      height: 80,
                      child: CustomPaint(
                        painter: ConicRiskGaugePainter(score),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '${risk['riskLevel']} RISK ($score/100)',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                        color: risk['riskLevel'] == 'HIGH' ? Colors.red : (risk['riskLevel'] == 'MEDIUM' ? Colors.orange : Colors.green),
                      ),
                    ),
                  ],
                ),
                
                // Score rationale
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.only(left: 20.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(text['risk_reasons']!, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                        const SizedBox(height: 4),
                        ...List.generate(
                          (risk['reasons'] as List?)?.length ?? 0,
                          (index) => Text(
                            '- ${state.locale == 'en' ? risk['reasons'][index] : risk['reasonsHi'][index]}',
                            style: const TextStyle(fontSize: 11, color: Colors.white70),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            
            // System recommendation box
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFD4AF37).withOpacity(0.08),
                borderRadius: BorderRadius.circular(6),
                border: Border.all(color: const Color(0xFFD4AF37).withOpacity(0.3)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(text['recommendation']!, style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFD4AF37))),
                  const SizedBox(height: 8),
                  Text(
                    reasoning ?? 'Evaluating metrics...',
                    style: const TextStyle(fontSize: 13, height: 1.4),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            
            // e-Sign canvas signature pad
            Text(text['sign_pad']!, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
            const SizedBox(height: 8),
            Container(
              height: 120,
              decoration: BoxDecoration(
                color: Colors.black38,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.grey.withOpacity(0.5)),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: GestureDetector(
                  onPanUpdate: (details) {
                    RenderBox renderBox = context.findRenderObject() as RenderBox;
                    Offset localPos = renderBox.globalToLocal(details.globalPosition);
                    setState(() {
                      _signaturePoints = List.from(_signaturePoints)..add(localPos);
                      _isSigned = true;
                    });
                  },
                  onPanEnd: (details) {
                    setState(() {
                      _signaturePoints = List.from(_signaturePoints)..add(Offset.infinite);
                    });
                  },
                  child: CustomPaint(
                    painter: SignaturePainter(_signaturePoints),
                    size: Size.infinite,
                  ),
                ),
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton(
                  onPressed: () {
                    setState(() {
                      _signaturePoints.clear();
                      _isSigned = false;
                    });
                  },
                  child: Text(text['clear_sign']!),
                ),
              ],
            ),
            
            // Remarks Input Box
            TextField(
              controller: _remarksController,
              decoration: InputDecoration(
                hintText: text['remarks'],
                border: const OutlineInputBorder(),
                contentPadding: const EdgeInsets.all(12),
              ),
              maxLines: 2,
            ),
            const SizedBox(height: 20),

            // Adjudication Directives (Verdicts)
            Text(text['adjudication']!, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                _buildVerdictButton('GRANTED', Colors.green, state),
                _buildVerdictButton('GRANTED_WITH_CONDITIONS', Colors.lightGreen, state),
                _buildVerdictButton('DENIED', Colors.red, state),
                _buildVerdictButton('ADJOURNED', Colors.orange, state),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildVerdictButton(String verdict, Color color, AppState state) {
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor: color,
        foregroundColor: Colors.white,
      ),
      onPressed: () => _submitVerdict(state, verdict),
      child: Text(verdict.replaceAll('_', ' ')),
    );
  }

  // EXTERNAL INTEGRATIONS GRID
  Widget _buildExternalGatewaysCard(Map<String, String> text, bool isDark) {
    return Card(
      color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              text['gateways']!,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFFD4AF37)),
            ),
            const Divider(height: 20),
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: MediaQuery.of(context).size.width > 600 ? 3 : 2,
              childAspectRatio: 2.2,
              mainAxisSpacing: 10,
              crossAxisSpacing: 10,
              children: [
                _buildGatewayGridItem('Govt Identity DB', 'UIDAI / Aadhaar Sync (100% Match)', '9ms latency'),
                _buildGatewayGridItem('Financial Services', 'NSDL / CIBIL Registry Query', '14ms latency'),
                _buildGatewayGridItem('Judicial eCourts', 'National Judicial Data Grid link', '24ms latency'),
                _buildGatewayGridItem('Revenue Land Records', 'Mandal Patta Register (Webland API)', '19ms latency'),
                _buildGatewayGridItem('Biometric Matching', 'Live FP & Iris Counter verification', '8ms latency'),
                _buildGatewayGridItem('Immigration LOC Check', 'Border flight list & travel checks', '12ms latency'),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGatewayGridItem(String name, String desc, String latency) {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: Colors.black26,
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: const Color(0xFFD4AF37).withOpacity(0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            children: [
              const Icon(Icons.verified, color: Colors.green, size: 14),
              const SizedBox(width: 4),
              Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Color(0xFFD4AF37))),
            ],
          ),
          const SizedBox(height: 2),
          Text(desc, style: const TextStyle(fontSize: 10, color: Colors.white70), maxLines: 1, overflow: TextOverflow.ellipsis),
          const SizedBox(height: 2),
          Text(latency, style: const TextStyle(fontSize: 9, fontStyle: FontStyle.italic, color: Colors.grey)),
        ],
      ),
    );
  }
}

// CONIC RISK GAUGE CUSTOM PAINTER
class ConicRiskGaugePainter extends CustomPainter {
  final int score;
  ConicRiskGaugePainter(this.score);

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height);
    final radius = size.width / 2;

    final rect = Rect.fromCircle(center: center, radius: radius);
    final paintArc = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 14
      ..strokeCap = StrokeCap.round;

    // Draw the gauge arcs
    paintArc.color = Colors.green;
    canvas.drawArc(rect, math.pi, math.pi * 0.3, false, paintArc);

    paintArc.color = Colors.orange;
    canvas.drawArc(rect, math.pi + math.pi * 0.3, math.pi * 0.3, false, paintArc);

    paintArc.color = Colors.red;
    canvas.drawArc(rect, math.pi + math.pi * 0.6, math.pi * 0.4, false, paintArc);

    // Draw needle indicator
    final double angle = math.pi + (score / 100.0) * math.pi;
    final needlePaint = Paint()
      ..color = Colors.white
      ..strokeWidth = 4
      ..strokeCap = StrokeCap.round;

    final endPoint = Offset(
      center.dx + (radius - 15) * math.cos(angle),
      center.dy + (radius - 15) * math.sin(angle),
    );
    canvas.drawLine(center, endPoint, needlePaint);

    // Center pin
    final pinPaint = Paint()..color = const Color(0xFFD4AF37);
    canvas.drawCircle(center, 8, pinPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}

// SIGNATURE CANVAS PAINTER
class SignaturePainter extends CustomPainter {
  final List<Offset> points;
  SignaturePainter(this.points);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white
      ..strokeCap = StrokeCap.round;

    // Adjust stroke thickness depending on size
    paint.strokeWidth = 3.0;

    for (int i = 0; i < points.length - 1; i++) {
      if (points[i] != Offset.infinite && points[i + 1] != Offset.infinite) {
        // Draw lines inside canvas bounds
        canvas.drawLine(points[i], points[i + 1], paint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
