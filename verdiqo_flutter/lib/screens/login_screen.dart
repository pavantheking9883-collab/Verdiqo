// lib/screens/login_screen.dart

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  String _selectedRole = 'Judge'; // Default role

  final Map<String, Map<String, String>> _localizedText = {
    'en': {
      'title': 'VERDIQO',
      'subtitle': 'Secure Bail Verification & Judicial Decision Support System',
      'username': 'Username / G-ID',
      'password': 'Password / Security PIN',
      'login': 'ACCESS SYSTEM',
      'role_judge': 'Sessions Judge',
      'role_civil_judge': 'Civil Judge',
      'role_staff': 'Court Staff',
      'role_admin': 'System Admin',
      'role_citizen': 'Citizen Portal',
      'institution': 'QUANTEX INTELLIGENCE SYSTEMS (P) LTD.',
      'footer': 'Securing Judicial Integrity via Agentic Decision Support.',
    },
    'hi': {
      'title': 'वर्दीको (VERDIQO)',
      'subtitle': 'सुरक्षित जमानत सत्यापन और न्यायिक निर्णय सहायता प्रणाली',
      'username': 'यूज़रनेम / जी-आईडी (G-ID)',
      'password': 'पासवर्ड / सुरक्षा पिन (PIN)',
      'login': 'सिस्टम एक्सेस करें',
      'role_judge': 'सत्र न्यायाधीश',
      'role_civil_judge': 'दीवानी न्यायाधीश',
      'role_staff': 'न्यायालय कर्मचारी',
      'role_admin': 'सिस्टम एडमिन',
      'role_citizen': 'नागरिक पोर्टल',
      'institution': 'क्वांटेक्स इंटेलिजेंस सिस्टम्स (प्रा.) लिमिटेड',
      'footer': 'एजेंटिक निर्णय सहायता के माध्यम से न्यायिक अखंडता सुरक्षित करना।',
    }
  };

  @override
  void initState() {
    super.initState();
    _fillDemoCredentials();
  }

  void _fillDemoCredentials() {
    if (_selectedRole == 'Judge') {
      _usernameController.text = 'judge_kameswara';
      _passwordController.text = 'justice789';
    } else if (_selectedRole == 'Civil_Judge') {
      _usernameController.text = 'judge_suryaprakash';
      _passwordController.text = 'civil456';
    } else if (_selectedRole == 'Staff') {
      _usernameController.text = 'staff_rajamundry';
      _passwordController.text = 'court123';
    } else if (_selectedRole == 'Admin') {
      _usernameController.text = 'admin_prasad';
      _passwordController.text = 'district456';
    } else {
      _usernameController.clear();
      _passwordController.clear();
    }
  }

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppState>(context);
    final text = _localizedText[appState.locale]!;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Column(
          children: [
            // Top Navigation Bar (Bilingual Switcher)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              decoration: BoxDecoration(
                border: Border(
                  bottom: BorderSide(
                    color: isDark ? const Color(0xFF1E293B) : const Color(0xFFE2E8F0),
                  ),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Logo / Text
                  Row(
                    children: [
                      const Icon(
                        Icons.gavel,
                        color: Color(0xFFD4AF37),
                        size: 28,
                      ),
                      const SizedBox(width: 10),
                      Text(
                        'VERDIQO',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 2.0,
                          color: isDark ? const Color(0xFFF8FAFC) : const Color(0xFF0F172A),
                        ),
                      ),
                    ],
                  ),
                  // Language Toggle Switcher
                  Row(
                    children: [
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: appState.locale == 'en'
                              ? const Color(0xFFD4AF37)
                              : (isDark ? const Color(0xFF1E293B) : const Color(0xFFE2E8F0)),
                          foregroundColor: appState.locale == 'en'
                              ? Colors.black
                              : (isDark ? Colors.white : Colors.black),
                          shape: const RoundedRectangleBorder(
                            borderRadius: BorderRadius.horizontal(left: Radius.circular(8)),
                          ),
                          elevation: 0,
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        ),
                        onPressed: () => appState.setLocale('en'),
                        child: const Text('EN'),
                      ),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: appState.locale == 'hi'
                              ? const Color(0xFFD4AF37)
                              : (isDark ? const Color(0xFF1E293B) : const Color(0xFFE2E8F0)),
                          foregroundColor: appState.locale == 'hi'
                              ? Colors.black
                              : (isDark ? Colors.white : Colors.black),
                          shape: const RoundedRectangleBorder(
                            borderRadius: BorderRadius.horizontal(right: Radius.circular(8)),
                          ),
                          elevation: 0,
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        ),
                        onPressed: () => appState.setLocale('hi'),
                        child: const Text('हिन्दी'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            
            Expanded(
              child: Center(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(24.0),
                  child: Container(
                    constraints: const BoxConstraints(maxWidth: 500),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF1E293B) : Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: const Color(0xFFD4AF37).withOpacity(0.8),
                        width: 2.0,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFFD4AF37).withOpacity(0.15),
                          blurRadius: 24,
                          offset: const Offset(0, 8),
                        )
                      ],
                    ),
                    padding: const EdgeInsets.all(32.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // Card Header
                        Text(
                          text['title']!,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 32,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 3.0,
                            color: Color(0xFFD4AF37),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          text['subtitle']!,
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 14,
                            color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF475569),
                          ),
                        ),
                        const SizedBox(height: 32),

                        // Role Selection Stepper Row
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          alignment: WrapAlignment.center,
                          children: [
                            _buildRoleButton('Judge', text['role_judge']!, isDark),
                            _buildRoleButton('Civil_Judge', text['role_civil_judge']!, isDark),
                            _buildRoleButton('Staff', text['role_staff']!, isDark),
                            _buildRoleButton('Admin', text['role_admin']!, isDark),
                            _buildRoleButton('Citizen', text['role_citizen']!, isDark),
                          ],
                        ),
                        const SizedBox(height: 32),

                        // Input fields (if not citizen)
                        if (_selectedRole != 'Citizen') ...[
                          Text(
                            text['username']!,
                            style: const TextStyle(
                              fontWeight: FontWeight.w600,
                              fontSize: 14,
                            ),
                          ),
                          const SizedBox(height: 8),
                          TextField(
                            controller: _usernameController,
                            decoration: InputDecoration(
                              filled: true,
                              fillColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                                borderSide: BorderSide.none,
                              ),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                            ),
                          ),
                          const SizedBox(height: 18),
                          Text(
                            text['password']!,
                            style: const TextStyle(
                              fontWeight: FontWeight.w600,
                              fontSize: 14,
                            ),
                          ),
                          const SizedBox(height: 8),
                          TextField(
                            controller: _passwordController,
                            obscureText: true,
                            decoration: InputDecoration(
                              filled: true,
                              fillColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                                borderSide: BorderSide.none,
                              ),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                            ),
                          ),
                          const SizedBox(height: 32),
                        ],

                        // golden Access System / Login Button
                        ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFD4AF37),
                            foregroundColor: Colors.black,
                            elevation: 4,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                            textStyle: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 1.5,
                            ),
                          ),
                          onPressed: () {
                            appState.login(_selectedRole);
                          },
                          child: Text(text['login']!),
                        ),
                        const SizedBox(height: 24),

                        // institution footer
                        Text(
                          text['institution']!,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            letterSpacing: 1.0,
                            color: Color(0xFFD4AF37),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            
            // Footer bottom label
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Text(
                text['footer']!,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 12,
                  fontStyle: FontStyle.italic,
                  color: isDark ? const Color(0xFF64748B) : const Color(0xFF94A3B8),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRoleButton(String role, String label, bool isDark) {
    final isSelected = _selectedRole == role;
    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (selected) {
        if (selected) {
          setState(() {
            _selectedRole = role;
            _fillDemoCredentials();
          });
        }
      },
      selectedColor: const Color(0xFFD4AF37).withOpacity(0.25),
      backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9),
      labelStyle: TextStyle(
        color: isSelected
            ? const Color(0xFFD4AF37)
            : (isDark ? Colors.white70 : Colors.black87),
        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
        side: BorderSide(
          color: isSelected
              ? const Color(0xFFD4AF37)
              : Colors.transparent,
          width: 1.5,
        ),
      ),
    );
  }
}
