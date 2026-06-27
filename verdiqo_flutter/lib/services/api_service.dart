// lib/services/api_service.dart

import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../models/case_model.dart';

class ApiService {
  static String get baseUrl {
    // 🌐 To connect your mobile app to the cloud database in real-time, 
    // replace this return with your Vercel deployment URL:
    // return 'https://your-vercel-project.vercel.app/api';

    if (!kIsWeb && Platform.isAndroid) {
      return 'http://10.0.2.2:3000/api';
    }
    return 'http://localhost:3000/api';
  }

  // Auth Login Request
  static Future<bool> login(String username, String password, String role) async {
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'username': username,
          'password': password,
          'role': role,
        }),
      );
      if (res.statusCode == 200) {
        return true;
      }
      return false;
    } catch (e) {
      debugPrint('API Error on login: $e');
      return false;
    }
  }

  // Get Cases Request
  static Future<List<CaseModel>> fetchCases() async {
    try {
      final res = await http.get(Uri.parse('$baseUrl/cases'));
      if (res.statusCode == 200) {
        final List<dynamic> data = jsonDecode(res.body);
        return data.map((json) => _caseFromJson(json)).toList();
      }
      throw Exception('Failed to load cases');
    } catch (e) {
      debugPrint('API Error on fetchCases: $e');
      rethrow;
    }
  }

  // Post Case Request
  static Future<CaseModel> createCase(CaseModel c) async {
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/cases'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(_caseToJson(c)),
      );
      if (res.statusCode == 201) {
        return _caseFromJson(jsonDecode(res.body));
      }
      throw Exception('Failed to create case');
    } catch (e) {
      debugPrint('API Error on createCase: $e');
      rethrow;
    }
  }

  // Put Case Verdict Request
  static Future<bool> updateVerdict(
    String caseNumber,
    String verdict,
    String remarks,
    String signature,
  ) async {
    try {
      final res = await http.put(
        Uri.parse('$baseUrl/cases/$caseNumber/verdict'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'verdict': verdict,
          'remarks': remarks,
          'signature': signature,
        }),
      );
      return res.statusCode == 200;
    } catch (e) {
      debugPrint('API Error on updateVerdict: $e');
      return false;
    }
  }

  // JSON Deserialization Mapper
  static CaseModel _caseFromJson(Map<String, dynamic> json) {
    final acc = json['accused'] as Map<String, dynamic>;
    final sur = json['surety'] as Map<String, dynamic>;
    final arg = json['arguments'] as Map<String, dynamic>;

    return CaseModel(
      caseNumber: json['caseNumber'] ?? '',
      firNumber: json['firNumber'] ?? '',
      ipcSections: json['ipcSections'] ?? '',
      dateOfArrest: json['dateOfArrest'] ?? '',
      policeStation: json['policeStation'] ?? '',
      presidingJudge: json['presidingJudge'] ?? '',
      judgeId: json['judgeId'] ?? '',
      courtLocation: json['courtLocation'] ?? '',
      previousCourtOrders: json['previousCourtOrders'] ?? '',
      filingDate: json['filingDate'] ?? '',
      supportingDocs: List<String>.from(json['supportingDocs'] ?? []),
      bailType: json['bailType'] ?? '',
      proposedBailAmount: (json['proposedBailAmount'] as num?)?.toDouble() ?? 50000.0,
      proposedConditions: List<String>.from(json['proposedConditions'] ?? []),
      hearingDate: json['hearingDate'] ?? '',
      currentStatus: json['currentStatus'] ?? '',
      orderStatus: json['orderStatus'] ?? '',
      judgeRemarks: json['judgeRemarks'] ?? '',
      digitalSignature: json['digitalSignature'] ?? '',
      accused: AccusedModel(
        fullName: acc['fullName'] ?? '',
        dob: acc['dob'] ?? '',
        fathersName: acc['fathersName'] ?? '',
        address: acc['address'] ?? '',
        mobileNumber: acc['mobileNumber'] ?? '',
        aadhaarNumber: acc['aadhaarNumber'] ?? '',
        panNumber: acc['panNumber'] ?? '',
        drivingLicense: acc['drivingLicense'] ?? '',
        passportNumber: acc['passportNumber'] ?? '',
        employmentDetails: acc['employmentDetails'] ?? '',
        monthlyIncome: (acc['monthlyIncome'] as num?)?.toDouble() ?? 0.0,
        bankAccount: acc['bankAccount'] ?? '',
        cibilScore: acc['cibilScore'] ?? 700,
        criminalHistory: acc['criminalHistory'] ?? '',
        ncrbCount: acc['ncrbCount'] ?? 0,
        prevBailsGranted: acc['prevBailsGranted'] ?? 0,
        prevBailsHonored: acc['prevBailsHonored'] ?? 0,
        abscondingCount: acc['abscondingCount'] ?? 0,
        travelRestricted: acc['travelRestricted'] == true,
        bankBalance6m: (acc['bankBalance6m'] as num?)?.toDouble() ?? 0.0,
      ),
      surety: SuretyModel(
        suretyType: sur['suretyType'] ?? 'PROPERTY',
        fullName: sur['fullName'] ?? '',
        relationToAccused: sur['relationToAccused'] ?? '',
        mobileNumber: sur['mobileNumber'] ?? '',
        aadhaarNumber: sur['aadhaarNumber'] ?? '',
        panNumber: sur['panNumber'] ?? '',
        employmentDetails: sur['employmentDetails'] ?? '',
        monthlyIncome: (sur['monthlyIncome'] as num?)?.toDouble() ?? 0.0,
        activeBailCount: sur['activeBailCount'] ?? 0,
        propertyAddress: sur['propertyAddress'] ?? '',
        surveyNumber: sur['surveyNumber'] ?? '',
        propertyValuation: (sur['propertyValuation'] as num?)?.toDouble() ?? 0.0,
        propertyOwnershipDoc: sur['propertyOwnershipDoc'] ?? '',
        propertyRevenueRecord: sur['propertyRevenueRecord'] ?? '',
        encumbranceStatus: sur['encumbranceStatus'] ?? 'CLEAN',
        mutationStatus: sur['mutationStatus'] ?? 'PENDING',
      ),
      arguments: ArgumentsModel(
        prosecution: arg['prosecution'] ?? '',
        defence: arg['defence'] ?? '',
      ),
      checks: json['checks'] ?? {},
    );
  }

  // JSON Serialization Mapper
  static Map<String, dynamic> _caseToJson(CaseModel c) {
    return {
      'caseNumber': c.caseNumber,
      'firNumber': c.firNumber,
      'ipcSections': c.ipcSections,
      'dateOfArrest': c.dateOfArrest,
      'policeStation': c.policeStation,
      'presidingJudge': c.presidingJudge,
      'judgeId': c.judgeId,
      'courtLocation': c.courtLocation,
      'previousCourtOrders': c.previousCourtOrders,
      'filingDate': c.filingDate,
      'supportingDocs': c.supportingDocs,
      'bailType': c.bailType,
      'proposedBailAmount': c.proposedBailAmount,
      'proposedConditions': c.proposedConditions,
      'hearingDate': c.hearingDate,
      'currentStatus': c.currentStatus,
      'orderStatus': c.orderStatus,
      'judgeRemarks': c.judgeRemarks,
      'digitalSignature': c.digitalSignature,
      'accused': {
        'fullName': c.accused.fullName,
        'dob': c.accused.dob,
        'fathersName': c.accused.fathersName,
        'address': c.accused.address,
        'mobileNumber': c.accused.mobileNumber,
        'aadhaarNumber': c.accused.aadhaarNumber,
        'panNumber': c.accused.panNumber,
        'drivingLicense': c.accused.drivingLicense,
        'passportNumber': c.accused.passportNumber,
        'employmentDetails': c.accused.employmentDetails,
        'monthlyIncome': c.accused.monthlyIncome,
        'bankAccount': c.accused.bankAccount,
        'cibilScore': c.accused.cibilScore,
        'criminalHistory': c.accused.criminalHistory,
        'ncrbCount': c.accused.ncrbCount,
        'prevBailsGranted': c.accused.prevBailsGranted,
        'prevBailsHonored': c.accused.prevBailsHonored,
        'abscondingCount': c.accused.abscondingCount,
        'travelRestricted': c.accused.travelRestricted,
        'bankBalance6m': c.accused.bankBalance6m,
      },
      'surety': {
        'suretyType': c.surety.suretyType,
        'fullName': c.surety.fullName,
        'relationToAccused': c.surety.relationToAccused,
        'mobileNumber': c.surety.mobileNumber,
        'aadhaarNumber': c.surety.aadhaarNumber,
        'panNumber': c.surety.panNumber,
        'employmentDetails': c.surety.employmentDetails,
        'monthlyIncome': c.surety.monthlyIncome,
        'activeBailCount': c.surety.activeBailCount,
        'propertyAddress': c.surety.propertyAddress,
        'surveyNumber': c.surety.surveyNumber,
        'propertyValuation': c.surety.propertyValuation,
        'propertyOwnershipDoc': c.surety.propertyOwnershipDoc,
        'propertyRevenueRecord': c.surety.propertyRevenueRecord,
        'encumbranceStatus': c.surety.encumbranceStatus,
        'mutationStatus': c.surety.mutationStatus,
      },
      'arguments': {
        'prosecution': c.arguments.prosecution,
        'defence': c.arguments.defence,
      }
    };
  }
}
