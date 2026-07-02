// lib/main.dart

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/app_state.dart';
import 'screens/login_screen.dart';
import 'screens/dashboard_judge.dart';
import 'screens/dashboard_civil_judge.dart';
import 'screens/dashboard_staff.dart';
import 'screens/dashboard_admin.dart';
import 'screens/dashboard_citizen.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (context) => AppState(),
      child: const VerdiqoApp(),
    ),
  );
}

class VerdiqoApp extends StatelessWidget {
  const VerdiqoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<AppState>(
      builder: (context, appState, child) {
        return MaterialApp(
          title: 'Verdiqo: Secure Bail Verification Suite',
          debugShowCheckedModeBanner: false,
          theme: ThemeData.dark().copyWith(
            scaffoldBackgroundColor: const Color(0xFF0F172A),
            primaryColor: const Color(0xFFD4AF37),
            colorScheme: const ColorScheme.dark().copyWith(
              primary: const Color(0xFFD4AF37),
              secondary: const Color(0xFFD4AF37),
              surface: const Color(0xFF1E293B),
              background: const Color(0xFF0F172A),
            ),
            cardTheme: CardThemeData(
              color: const Color(0xFF1E293B),
              elevation: 4,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
                side: BorderSide(
                  color: const Color(0xFFD4AF37).withOpacity(0.15),
                  width: 1.0,
                ),
              ),
            ),
            appBarTheme: const AppBarTheme(
              backgroundColor: Color(0xFF0F172A),
              elevation: 0,
              centerTitle: false,
              titleTextStyle: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.0,
                color: Colors.white,
              ),
            ),
            inputDecorationTheme: InputDecorationTheme(
              filled: true,
              fillColor: const Color(0xFF0F172A),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: BorderSide(
                  color: const Color(0xFFD4AF37).withOpacity(0.3),
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: const BorderSide(
                  color: Color(0xFFD4AF37),
                  width: 1.5,
                ),
              ),
              labelStyle: const TextStyle(
                color: Color(0xFF94A3B8),
                fontSize: 14,
              ),
            ),
          ),
          home: _getHomeScreen(appState.currentUserRole),
        );
      },
    );
  }

  Widget _getHomeScreen(String? role) {
    switch (role) {
      case 'Judge':
        return const DashboardJudge();
      case 'Civil_Judge':
        return const DashboardCivilJudge();
      case 'Staff':
        return const DashboardStaff();
      case 'Admin':
        return const DashboardAdmin();
      case 'Citizen':
        return const DashboardCitizen();
      default:
        return const LoginScreen();
    }
  }
}
