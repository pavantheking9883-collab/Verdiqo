// lib/screens/dashboard_admin.dart

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';

class DashboardAdmin extends StatelessWidget {
  const DashboardAdmin({super.key});

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppState>(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final budgetItems = [
      {'role': 'Principal Systems Architect (Lead Dev)', 'payout': 75000, 'color': Colors.blue},
      {'role': 'Associate Software Engineer (UI/UX / Frontend)', 'payout': 65000, 'color': Colors.indigo},
      {'role': 'Support Software Engineer (Mock Integration)', 'payout': 40000, 'color': Colors.amber},
      {'role': 'Systems Validation Specialist (Quality Analyst)', 'payout': 35000, 'color': Colors.green},
      {'role': 'Project Director & Compliance Lead (PM/CEO)', 'payout': 35000, 'color': Colors.teal},
      {'role': 'Sandboxed Mock Database & Local Server', 'payout': 0, 'color': Colors.grey},
    ];

    const double totalBudget = 250000.0;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Project Administration Console'),
        actions: [
          IconButton(
            icon: const Icon(Icons.language),
            onPressed: () {
              appState.setLocale(appState.locale == 'en' ? 'hi' : 'en');
            },
          ),
          TextButton.icon(
            icon: const Icon(Icons.logout, color: Color(0xFFD4AF37)),
            label: const Text('LOGOUT', style: TextStyle(color: Color(0xFFD4AF37))),
            onPressed: () => appState.logout(),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Pilot Budget Headline
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E293B) : Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFD4AF37)),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFFD4AF37).withOpacity(0.1),
                    blurRadius: 12,
                  )
                ],
              ),
              child: Column(
                children: [
                  const Text(
                    'VERDIQO PILOT PROJECT BUDGET SUMMARY',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 1.5, color: Color(0xFFD4AF37)),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    '₹2,50,000',
                    style: TextStyle(fontSize: 48, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Total budget locked and verified under institutional specifications.',
                    style: TextStyle(fontSize: 12, color: isDark ? Colors.grey : Colors.black87),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // budget allocation breakdown
            const Text(
              'PROJECT TEAM PAYOUT BREAKDOWN',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFFD4AF37)),
            ),
            const SizedBox(height: 12),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    // Combined bar chart representer
                    Container(
                      height: 32,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(16),
                        color: Colors.black26,
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(16),
                        child: Row(
                          children: budgetItems.where((element) => (element['payout'] as int) > 0).map((item) {
                            final fraction = (item['payout'] as int) / totalBudget;
                            return Expanded(
                              flex: (fraction * 100).round(),
                              child: Tooltip(
                                message: item['role'] as String,
                                child: Container(
                                  color: item['color'] as Color,
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),

                    // list items
                    ListView.separated(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: budgetItems.length,
                      separatorBuilder: (context, idx) => const Divider(),
                      itemBuilder: (context, idx) {
                        final item = budgetItems[idx];
                        final payout = item['payout'] as int;
                        final percent = (payout / totalBudget) * 100;
                        return Padding(
                          padding: const EdgeInsets.symmetric(vertical: 8.0),
                          child: Row(
                            children: [
                              Container(
                                width: 14,
                                height: 14,
                                decoration: BoxDecoration(
                                  color: item['color'] as Color,
                                  shape: BoxShape.circle,
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      item['role'] as String,
                                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                                    ),
                                    Text(
                                      'Percent allocation: ${percent.toStringAsFixed(1)}%',
                                      style: const TextStyle(fontSize: 11, color: Colors.grey),
                                    ),
                                  ],
                                ),
                              ),
                              Text(
                                '₹${payout.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},')}',
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFFD4AF37)),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// Simple extension to add Tooltip support inside Container
extension ContainerTooltipExtension on Container {
  Widget toolTip(String message) {
    return Tooltip(
      message: message,
      child: this,
    );
  }
}
