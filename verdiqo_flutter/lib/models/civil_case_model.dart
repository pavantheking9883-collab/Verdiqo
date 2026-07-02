// lib/models/civil_case_model.dart

class CivilCaseModel {
  final String caseId;
  final String caseType;
  final String civilType;
  final String courtNumber;
  final String presidingJudge;
  final String filingDate;
  final String lastHearingDate;
  final String nextHearingDate;
  final int pendingDays;
  String orderStatus; // PENDING, INTERIM_ORDER, FINAL_DECREE
  final List<String> interimOrders;
  String decreeText;
  String postponedTo;
  String judgeRemarks;
  String digitalSignature;
  final Map<String, dynamic> petitioner;
  final Map<String, dynamic> respondent;
  final String propertyDetails;
  final String reliefSought;
  final String stageSummary;
  final List<Map<String, dynamic>> hearingHistory;

  CivilCaseModel({
    required this.caseId,
    required this.caseType,
    required this.civilType,
    required this.courtNumber,
    required this.presidingJudge,
    required this.filingDate,
    required this.lastHearingDate,
    required this.nextHearingDate,
    required this.pendingDays,
    required this.orderStatus,
    required this.interimOrders,
    required this.decreeText,
    required this.postponedTo,
    required this.judgeRemarks,
    required this.digitalSignature,
    required this.petitioner,
    required this.respondent,
    required this.propertyDetails,
    required this.reliefSought,
    required this.stageSummary,
    required this.hearingHistory,
  });

  factory CivilCaseModel.fromJson(Map<String, dynamic> json) {
    return CivilCaseModel(
      caseId: json['caseId'] ?? '',
      caseType: json['caseType'] ?? 'CIVIL',
      civilType: json['civilType'] ?? '',
      courtNumber: json['courtNumber'] ?? '',
      presidingJudge: json['presidingJudge'] ?? '',
      filingDate: json['filingDate'] ?? '',
      lastHearingDate: json['lastHearingDate'] ?? '',
      nextHearingDate: json['nextHearingDate'] ?? '',
      pendingDays: json['pendingDays'] ?? 0,
      orderStatus: json['orderStatus'] ?? 'PENDING',
      interimOrders: List<String>.from(json['interimOrders'] ?? []),
      decreeText: json['decreeText'] ?? '',
      postponedTo: json['postponedTo'] ?? '',
      judgeRemarks: json['judgeRemarks'] ?? '',
      digitalSignature: json['digitalSignature'] ?? '',
      petitioner: Map<String, dynamic>.from(json['petitioner'] ?? {}),
      respondent: Map<String, dynamic>.from(json['respondent'] ?? {}),
      propertyDetails: json['propertyDetails'] ?? '',
      reliefSought: json['reliefSought'] ?? '',
      stageSummary: json['stageSummary'] ?? '',
      hearingHistory: List<Map<String, dynamic>>.from(
          (json['hearingHistory'] ?? []).map((e) => Map<String, dynamic>.from(e))),
    );
  }

  Map<String, dynamic> toJson() => {
        'caseId': caseId,
        'caseType': caseType,
        'civilType': civilType,
        'courtNumber': courtNumber,
        'presidingJudge': presidingJudge,
        'filingDate': filingDate,
        'lastHearingDate': lastHearingDate,
        'nextHearingDate': nextHearingDate,
        'pendingDays': pendingDays,
        'orderStatus': orderStatus,
        'interimOrders': interimOrders,
        'decreeText': decreeText,
        'postponedTo': postponedTo,
        'judgeRemarks': judgeRemarks,
        'digitalSignature': digitalSignature,
        'petitioner': petitioner,
        'respondent': respondent,
        'propertyDetails': propertyDetails,
        'reliefSought': reliefSought,
        'stageSummary': stageSummary,
        'hearingHistory': hearingHistory,
      };
}
