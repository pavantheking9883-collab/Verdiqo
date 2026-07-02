// lib/screens/dashboard_civil_judge.dart

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../models/civil_case_model.dart';

class DashboardCivilJudge extends StatefulWidget {
  const DashboardCivilJudge({super.key});

  @override
  State<DashboardCivilJudge> createState() => _DashboardCivilJudgeState();
}

class _DashboardCivilJudgeState extends State<DashboardCivilJudge>
    with TickerProviderStateMixin {
  // ─── Colour palette (royal-blue + gold) ───────────────────────────────────
  static const _royalBlue = Color(0xFF2563EB);
  static const _royalBlueDark = Color(0xFF1D4ED8);
  static const _gold = Color(0xFFD4AF37);
  static const _darkBg = Color(0xFF0F172A);
  static const _darkCard = Color(0xFF1E293B);
  static const _darkBorder = Color(0xFF334155);
  static const _darkText = Color(0xFFF1F5F9);
  static const _mutedText = Color(0xFF94A3B8);
  static const _successGreen = Color(0xFF10B981);
  static const _warningAmber = Color(0xFFF59E0B);

  // ─── State ─────────────────────────────────────────────────────────────────
  String _activeView = 'list'; // 'list' | 'detail'

  // Verdict form controllers
  final _verdictController = TextEditingController();
  final _decreeController = TextEditingController();
  final _remarksController = TextEditingController();
  final _signatureController = TextEditingController();
  String _selectedOrderStatus = 'PENDING';
  bool _submitting = false;

  // Accordion state for detail view sections
  final Set<String> _expandedSections = {'parties', 'subject'};

  late AnimationController _fadeAnim;
  late Animation<double> _fadeOpacity;

  @override
  void initState() {
    super.initState();
    _fadeAnim = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 350),
    )..forward();
    _fadeOpacity = CurvedAnimation(parent: _fadeAnim, curve: Curves.easeOut);
  }

  @override
  void dispose() {
    _verdictController.dispose();
    _decreeController.dispose();
    _remarksController.dispose();
    _signatureController.dispose();
    _fadeAnim.dispose();
    super.dispose();
  }

  // ─── Helper Widgets ────────────────────────────────────────────────────────

  Color _statusColor(String status) {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return _warningAmber;
      case 'INTERIM_ORDER':
        return _royalBlue;
      case 'DECREED':
        return _successGreen;
      case 'DISMISSED':
        return Colors.redAccent;
      case 'ADJOURNED':
        return Colors.orange;
      default:
        return _mutedText;
    }
  }

  String _statusLabel(String status) {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'Pending';
      case 'INTERIM_ORDER':
        return 'Interim Order';
      case 'DECREED':
        return 'Decreed';
      case 'DISMISSED':
        return 'Dismissed';
      case 'ADJOURNED':
        return 'Adjourned';
      default:
        return status;
    }
  }

  Widget _chip(String label, Color bg, Color fg) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: bg.withOpacity(0.18),
          border: Border.all(color: bg.withOpacity(0.45)),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: fg,
            fontSize: 11,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.6,
          ),
        ),
      );

  // ─── Navigation Bar ────────────────────────────────────────────────────────

  Widget _buildNavBar(AppState appState) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      decoration: const BoxDecoration(
        color: _darkCard,
        border: Border(bottom: BorderSide(color: _darkBorder)),
      ),
      child: Row(
        children: [
          // Logo
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [_royalBlue, _royalBlueDark],
              ),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(Icons.balance, color: Colors.white, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  'VERDIQO',
                  style: TextStyle(
                    color: _gold,
                    fontSize: 16,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 2,
                  ),
                ),
                Text(
                  'Civil Court — Judge Dashboard',
                  style: TextStyle(color: _mutedText, fontSize: 11),
                ),
              ],
            ),
          ),
          // Logout
          GestureDetector(
            onTap: () => appState.logout(),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                border: Border.all(color: _darkBorder),
                borderRadius: BorderRadius.circular(6),
              ),
              child: const Row(
                children: [
                  Icon(Icons.logout, color: _mutedText, size: 16),
                  SizedBox(width: 6),
                  Text('Logout', style: TextStyle(color: _mutedText, fontSize: 13)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ─── KPI Cards ─────────────────────────────────────────────────────────────

  Widget _buildKpiCards(List<CivilCaseModel> cases) {
    final pending = cases.where((c) => c.orderStatus == 'PENDING').length;
    final interimOrders = cases.where((c) => c.orderStatus == 'INTERIM_ORDER').length;
    final decreed = cases.where((c) => c.orderStatus == 'DECREED').length;
    final avgPending = cases.isEmpty
        ? 0
        : (cases.fold(0, (s, c) => s + c.pendingDays) / cases.length).round();

    final kpis = [
      {'label': 'Total Suits', 'value': '${cases.length}', 'icon': Icons.folder_open, 'color': _royalBlue},
      {'label': 'Pending', 'value': '$pending', 'icon': Icons.hourglass_empty, 'color': _warningAmber},
      {'label': 'Interim Orders', 'value': '$interimOrders', 'icon': Icons.gavel, 'color': _gold},
      {'label': 'Decreed', 'value': '$decreed', 'icon': Icons.check_circle_outline, 'color': _successGreen},
      {'label': 'Avg. Pending Days', 'value': '$avgPending', 'icon': Icons.calendar_today, 'color': Colors.purpleAccent},
    ];

    return SizedBox(
      height: 100,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: kpis.length,
        separatorBuilder: (_, __) => const SizedBox(width: 10),
        itemBuilder: (context, i) {
          final kpi = kpis[i];
          return Container(
            width: 140,
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: _darkCard,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: _darkBorder),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      kpi['label'] as String,
                      style: const TextStyle(color: _mutedText, fontSize: 11),
                    ),
                    Icon(kpi['icon'] as IconData,
                        color: kpi['color'] as Color, size: 16),
                  ],
                ),
                Text(
                  kpi['value'] as String,
                  style: TextStyle(
                    color: kpi['color'] as Color,
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  // ─── Case List ─────────────────────────────────────────────────────────────

  Widget _buildCaseList(AppState appState) {
    final cases = appState.civilCases;

    return FadeTransition(
      opacity: _fadeOpacity,
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Row(
              children: [
                const Icon(Icons.list_alt, color: _royalBlue, size: 20),
                const SizedBox(width: 8),
                const Text(
                  'Civil Suits Register',
                  style: TextStyle(
                    color: _darkText,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const Spacer(),
                Text(
                  '${cases.length} suit${cases.length == 1 ? '' : 's'}',
                  style: const TextStyle(color: _mutedText, fontSize: 13),
                ),
              ],
            ),
          ),
          if (cases.isEmpty)
            const Expanded(
              child: Center(
                child: Text(
                  'No civil suits on record.',
                  style: TextStyle(color: _mutedText),
                ),
              ),
            )
          else
            Expanded(
              child: ListView.separated(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                itemCount: cases.length,
                separatorBuilder: (_, __) => const SizedBox(height: 10),
                itemBuilder: (context, i) {
                  final cs = cases[i];
                  return GestureDetector(
                    onTap: () {
                      appState.selectCivilCase(cs);
                      _selectedOrderStatus = cs.orderStatus;
                      _decreeController.text = cs.decreeText;
                      _remarksController.text = cs.judgeRemarks;
                      _signatureController.text = cs.digitalSignature;
                      setState(() => _activeView = 'detail');
                      _fadeAnim.forward(from: 0);
                    },
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: _darkCard,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: _darkBorder),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                cs.caseId,
                                style: const TextStyle(
                                  color: _royalBlue,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14,
                                  letterSpacing: 0.5,
                                ),
                              ),
                              _chip(
                                _statusLabel(cs.orderStatus),
                                _statusColor(cs.orderStatus),
                                _statusColor(cs.orderStatus),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Text(
                            cs.civilType,
                            style: const TextStyle(
                              color: _darkText,
                              fontWeight: FontWeight.w600,
                              fontSize: 13,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '${cs.petitioner['name'] ?? ''} vs ${cs.respondent['name'] ?? ''}',
                            style: const TextStyle(color: _mutedText, fontSize: 12),
                          ),
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              const Icon(Icons.calendar_today, color: _mutedText, size: 12),
                              const SizedBox(width: 4),
                              Text(
                                'Filed: ${cs.filingDate}',
                                style: const TextStyle(color: _mutedText, fontSize: 11),
                              ),
                              const SizedBox(width: 12),
                              const Icon(Icons.schedule, color: _warningAmber, size: 12),
                              const SizedBox(width: 4),
                              Text(
                                '${cs.pendingDays} days pending',
                                style: const TextStyle(color: _warningAmber, fontSize: 11),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              const Icon(Icons.event_note, color: _mutedText, size: 12),
                              const SizedBox(width: 4),
                              Text(
                                'Next Hearing: ${cs.nextHearingDate}',
                                style: const TextStyle(color: _mutedText, fontSize: 11),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
        ],
      ),
    );
  }

  // ─── Accordion Section ─────────────────────────────────────────────────────

  Widget _buildAccordion(String key, String title, IconData icon, Widget body) {
    final isOpen = _expandedSections.contains(key);
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: _darkCard,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(
          color: isOpen ? _royalBlue.withOpacity(0.5) : _darkBorder,
        ),
      ),
      child: Column(
        children: [
          GestureDetector(
            onTap: () => setState(() {
              if (isOpen) {
                _expandedSections.remove(key);
              } else {
                _expandedSections.add(key);
              }
            }),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 13),
              child: Row(
                children: [
                  Icon(icon, color: _royalBlue, size: 18),
                  const SizedBox(width: 10),
                  Text(
                    title,
                    style: const TextStyle(
                      color: _darkText,
                      fontWeight: FontWeight.bold,
                      fontSize: 13,
                    ),
                  ),
                  const Spacer(),
                  Icon(
                    isOpen ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down,
                    color: _mutedText,
                    size: 20,
                  ),
                ],
              ),
            ),
          ),
          if (isOpen)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 14),
              child: body,
            ),
        ],
      ),
    );
  }

  Widget _row(String label, String? value) {
    if (value == null || value.isEmpty) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 130,
            child: Text(
              label,
              style: const TextStyle(color: _mutedText, fontSize: 12),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(color: _darkText, fontSize: 12),
            ),
          ),
        ],
      ),
    );
  }

  Widget _divider() => const Divider(color: _darkBorder, height: 16);

  // ─── Case Detail View ──────────────────────────────────────────────────────

  Widget _buildCaseDetail(AppState appState) {
    final cs = appState.selectedCivilCase!;

    return FadeTransition(
      opacity: _fadeOpacity,
      child: Column(
        children: [
          // Sub-header breadcrumb
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            color: _darkCard,
            child: Row(
              children: [
                GestureDetector(
                  onTap: () {
                    appState.selectCivilCase(null);
                    setState(() => _activeView = 'list');
                    _fadeAnim.forward(from: 0);
                  },
                  child: const Row(
                    children: [
                      Icon(Icons.arrow_back_ios, color: _royalBlue, size: 14),
                      Text(
                        'Cases',
                        style: TextStyle(color: _royalBlue, fontSize: 13),
                      ),
                    ],
                  ),
                ),
                const Text(
                  ' / ',
                  style: TextStyle(color: _mutedText),
                ),
                Text(
                  cs.caseId,
                  style: const TextStyle(
                    color: _darkText,
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const Spacer(),
                _chip(
                  _statusLabel(cs.orderStatus),
                  _statusColor(cs.orderStatus),
                  _statusColor(cs.orderStatus),
                ),
              ],
            ),
          ),

          // Scrollable detail body
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Case Title
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          _royalBlue.withOpacity(0.15),
                          _royalBlueDark.withOpacity(0.08),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: _royalBlue.withOpacity(0.3)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          cs.caseId,
                          style: const TextStyle(
                            color: _gold,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 0.8,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          cs.civilType,
                          style: const TextStyle(
                            color: _darkText,
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            const Icon(Icons.account_balance, color: _mutedText, size: 13),
                            const SizedBox(width: 5),
                            Expanded(
                              child: Text(
                                cs.courtNumber,
                                style: const TextStyle(color: _mutedText, fontSize: 12),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            const Icon(Icons.person_outline, color: _mutedText, size: 13),
                            const SizedBox(width: 5),
                            Text(
                              cs.presidingJudge,
                              style: const TextStyle(color: _mutedText, fontSize: 12),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            _infoTag(Icons.calendar_today, 'Filed: ${cs.filingDate}'),
                            const SizedBox(width: 10),
                            _infoTag(Icons.schedule, '${cs.pendingDays} days pending',
                                color: _warningAmber),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Row(
                          children: [
                            _infoTag(Icons.history, 'Last: ${cs.lastHearingDate}'),
                            const SizedBox(width: 10),
                            _infoTag(Icons.event, 'Next: ${cs.nextHearingDate}',
                                color: _successGreen),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 14),

                  // Parties Section
                  _buildAccordion(
                    'parties',
                    'Parties to the Suit',
                    Icons.people_outline,
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _sectionLabel('PETITIONER'),
                        _row('Name', cs.petitioner['name']),
                        _row('Advocate', cs.petitioner['advocate']),
                        _row('Address', cs.petitioner['address']),
                        _row('Aadhaar', cs.petitioner['aadhaar']),
                        _row('Mobile', cs.petitioner['mobileNumber']),
                        _divider(),
                        _sectionLabel('RESPONDENT'),
                        _row('Name', cs.respondent['name']),
                        _row('Advocate', cs.respondent['advocate']),
                        _row('Address', cs.respondent['address']),
                        _row('Aadhaar', cs.respondent['aadhaar']),
                        _row('Mobile', cs.respondent['mobileNumber']),
                      ],
                    ),
                  ),

                  // Subject Matter
                  _buildAccordion(
                    'subject',
                    'Subject Matter & Relief Sought',
                    Icons.description_outlined,
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _sectionLabel('PROPERTY / SUBJECT MATTER'),
                        const SizedBox(height: 6),
                        Text(
                          cs.propertyDetails,
                          style: const TextStyle(color: _darkText, fontSize: 12, height: 1.5),
                        ),
                        _divider(),
                        _sectionLabel('RELIEF SOUGHT'),
                        const SizedBox(height: 6),
                        Text(
                          cs.reliefSought,
                          style: const TextStyle(color: _darkText, fontSize: 12, height: 1.5),
                        ),
                        _divider(),
                        _sectionLabel('CURRENT STAGE'),
                        const SizedBox(height: 6),
                        Text(
                          cs.stageSummary,
                          style: const TextStyle(color: _mutedText, fontSize: 12, height: 1.5),
                        ),
                      ],
                    ),
                  ),

                  // Interim Orders
                  if (cs.interimOrders.isNotEmpty)
                    _buildAccordion(
                      'interim',
                      'Interim Orders (${cs.interimOrders.length})',
                      Icons.gavel,
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: cs.interimOrders
                            .map((order) => Padding(
                                  padding: const EdgeInsets.symmetric(vertical: 4),
                                  child: Row(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Icon(Icons.circle, color: _royalBlue, size: 8),
                                      const SizedBox(width: 8),
                                      Expanded(
                                        child: Text(
                                          order,
                                          style: const TextStyle(
                                              color: _darkText, fontSize: 12, height: 1.5),
                                        ),
                                      ),
                                    ],
                                  ),
                                ))
                            .toList(),
                      ),
                    ),

                  // Hearing History
                  _buildAccordion(
                    'history',
                    'Hearing History (${cs.hearingHistory.length})',
                    Icons.history,
                    Column(
                      children: cs.hearingHistory.reversed
                          .map((h) => Padding(
                                padding: const EdgeInsets.symmetric(vertical: 5),
                                child: Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Container(
                                      width: 78,
                                      child: Text(
                                        h['date'] ?? '',
                                        style: const TextStyle(
                                          color: _gold,
                                          fontSize: 11,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                    ),
                                    Expanded(
                                      child: Text(
                                        h['note'] ?? '',
                                        style: const TextStyle(
                                            color: _darkText, fontSize: 12, height: 1.4),
                                      ),
                                    ),
                                  ],
                                ),
                              ))
                          .toList(),
                    ),
                  ),

                  // Verdict / Decree Submission Form
                  _buildAccordion(
                    'verdict',
                    'Issue Order / Pass Decree',
                    Icons.edit_note,
                    _buildVerdictForm(appState, cs),
                  ),

                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _sectionLabel(String label) => Padding(
        padding: const EdgeInsets.only(bottom: 6),
        child: Text(
          label,
          style: const TextStyle(
            color: _royalBlue,
            fontSize: 11,
            fontWeight: FontWeight.w700,
            letterSpacing: 1.2,
          ),
        ),
      );

  Widget _infoTag(IconData icon, String text, {Color color = _mutedText}) =>
      Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: color, size: 12),
          const SizedBox(width: 4),
          Text(text, style: TextStyle(color: color, fontSize: 11)),
        ],
      );

  // ─── Verdict Form ──────────────────────────────────────────────────────────

  Widget _buildVerdictForm(AppState appState, CivilCaseModel cs) {
    const statusOptions = [
      {'value': 'PENDING', 'label': 'Pending'},
      {'value': 'INTERIM_ORDER', 'label': 'Interim Order'},
      {'value': 'ADJOURNED', 'label': 'Adjourned'},
      {'value': 'DECREED', 'label': 'Decreed'},
      {'value': 'DISMISSED', 'label': 'Dismissed'},
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Order Status dropdown
        const Text(
          'Order Status',
          style: TextStyle(color: _mutedText, fontSize: 12),
        ),
        const SizedBox(height: 6),
        DropdownButtonFormField<String>(
          value: _selectedOrderStatus,
          dropdownColor: _darkCard,
          style: const TextStyle(color: _darkText, fontSize: 13),
          decoration: InputDecoration(
            filled: true,
            fillColor: _darkBg,
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: _darkBorder),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: _darkBorder),
            ),
          ),
          items: statusOptions
              .map((s) => DropdownMenuItem<String>(
                    value: s['value'],
                    child: Text(s['label']!),
                  ))
              .toList(),
          onChanged: (val) => setState(() => _selectedOrderStatus = val!),
        ),
        const SizedBox(height: 14),

        // Decree text
        const Text('Decree / Order Text', style: TextStyle(color: _mutedText, fontSize: 12)),
        const SizedBox(height: 6),
        _textArea(_decreeController, 'Enter the full decree or order text...', 5),
        const SizedBox(height: 14),

        // Remarks
        const Text('Judicial Remarks', style: TextStyle(color: _mutedText, fontSize: 12)),
        const SizedBox(height: 6),
        _textArea(_remarksController, 'Additional remarks or observations...', 3),
        const SizedBox(height: 14),

        // Digital Signature
        const Text('Digital Signature / Auth Token', style: TextStyle(color: _mutedText, fontSize: 12)),
        const SizedBox(height: 6),
        _textField(_signatureController, 'SHA-256/CIVIL-YYYY-NNNN/JUDGEID'),
        const SizedBox(height: 20),

        // Submit button
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: _royalBlue,
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
              elevation: 4,
            ),
            onPressed: _submitting
                ? null
                : () async {
                    setState(() => _submitting = true);
                    await appState.updateCivilCaseVerdict(
                      cs.caseId,
                      _selectedOrderStatus,
                      _decreeController.text,
                      _remarksController.text,
                      _signatureController.text,
                    );
                    setState(() => _submitting = false);
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('✅ Order recorded successfully'),
                          backgroundColor: Color(0xFF10B981),
                          duration: Duration(seconds: 3),
                        ),
                      );
                    }
                  },
            child: _submitting
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.white,
                    ),
                  )
                : const Text(
                    'RECORD ORDER / PASS DECREE',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.2,
                    ),
                  ),
          ),
        ),
      ],
    );
  }

  Widget _textArea(TextEditingController ctrl, String hint, int lines) =>
      TextField(
        controller: ctrl,
        maxLines: lines,
        style: const TextStyle(color: _darkText, fontSize: 13),
        decoration: InputDecoration(
          hintText: hint,
          hintStyle: const TextStyle(color: _mutedText, fontSize: 12),
          filled: true,
          fillColor: _darkBg,
          contentPadding: const EdgeInsets.all(12),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: _darkBorder),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: _darkBorder),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: _royalBlue),
          ),
        ),
      );

  Widget _textField(TextEditingController ctrl, String hint) =>
      TextField(
        controller: ctrl,
        style: const TextStyle(color: _darkText, fontSize: 13),
        decoration: InputDecoration(
          hintText: hint,
          hintStyle: const TextStyle(color: _mutedText, fontSize: 12),
          filled: true,
          fillColor: _darkBg,
          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: _darkBorder),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: _darkBorder),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: _royalBlue),
          ),
        ),
      );

  // ─── Build ──────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppState>(context);

    return Scaffold(
      backgroundColor: _darkBg,
      body: SafeArea(
        child: Column(
          children: [
            _buildNavBar(appState),

            // KPI strip (always visible on list view)
            if (_activeView == 'list') ...[
              const SizedBox(height: 14),
              _buildKpiCards(appState.civilCases),
              const SizedBox(height: 6),
            ],

            Expanded(
              child: _activeView == 'list'
                  ? _buildCaseList(appState)
                  : _buildCaseDetail(appState),
            ),
          ],
        ),
      ),
    );
  }
}
