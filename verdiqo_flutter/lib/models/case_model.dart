// lib/models/case_model.dart

class CaseModel {
  final String caseNumber;
  final String firNumber;
  final String ipcSections;
  final String dateOfArrest;
  final String policeStation;
  final String presidingJudge;
  final String judgeId;
  final String courtLocation;
  final String previousCourtOrders;
  final String filingDate;
  final List<String> supportingDocs;
  final String bailType;
  final double proposedBailAmount;
  final List<String> proposedConditions;
  final String hearingDate;
  String currentStatus;
  String orderStatus; // PENDING, GRANTED, GRANTED_WITH_CONDITIONS, DENIED, ADJOURNED
  String judgeRemarks;
  String digitalSignature;
  
  final AccusedModel accused;
  final SuretyModel surety;
  final ArgumentsModel arguments;
  Map<String, dynamic> checks;

  CaseModel({
    required this.caseNumber,
    required this.firNumber,
    required this.ipcSections,
    required this.dateOfArrest,
    required this.policeStation,
    required this.presidingJudge,
    required this.judgeId,
    required this.courtLocation,
    required this.previousCourtOrders,
    required this.filingDate,
    required this.supportingDocs,
    required this.bailType,
    required this.proposedBailAmount,
    required this.proposedConditions,
    required this.hearingDate,
    required this.currentStatus,
    required this.orderStatus,
    required this.judgeRemarks,
    required this.digitalSignature,
    required this.accused,
    required this.surety,
    required this.arguments,
    required this.checks,
  });
}

class AccusedModel {
  final String fullName;
  final String dob;
  final String fathersName;
  final String address;
  final String mobileNumber;
  final String aadhaarNumber;
  final String panNumber;
  final String drivingLicense;
  final String passportNumber;
  final String employmentDetails;
  final double monthlyIncome;
  final String bankAccount;
  final int cibilScore;
  final String criminalHistory;
  final int ncrbCount;
  final int prevBailsGranted;
  final int prevBailsHonored;
  final int abscondingCount;
  final bool travelRestricted;
  final double bankBalance6m;

  AccusedModel({
    required this.fullName,
    required this.dob,
    required this.fathersName,
    required this.address,
    required this.mobileNumber,
    required this.aadhaarNumber,
    required this.panNumber,
    required this.drivingLicense,
    required this.passportNumber,
    required this.employmentDetails,
    required this.monthlyIncome,
    required this.bankAccount,
    required this.cibilScore,
    required this.criminalHistory,
    required this.ncrbCount,
    required this.prevBailsGranted,
    required this.prevBailsHonored,
    required this.abscondingCount,
    required this.travelRestricted,
    required this.bankBalance6m,
  });
}

class SuretyModel {
  final String suretyType; // PROPERTY or INDIVIDUAL
  final String fullName;
  final String relationToAccused;
  final String mobileNumber;
  final String aadhaarNumber;
  final String panNumber;
  final String employmentDetails;
  final double monthlyIncome;
  int activeBailCount;
  final String propertyAddress;
  final String surveyNumber;
  final double propertyValuation;
  final String propertyOwnershipDoc;
  final String propertyRevenueRecord;
  final String encumbranceStatus; // CLEAN or ENCUMBERED
  String mutationStatus; // PENDING or COMPLETED

  SuretyModel({
    required this.suretyType,
    required this.fullName,
    required this.relationToAccused,
    required this.mobileNumber,
    required this.aadhaarNumber,
    required this.panNumber,
    required this.employmentDetails,
    required this.monthlyIncome,
    required this.activeBailCount,
    required this.propertyAddress,
    required this.surveyNumber,
    required this.propertyValuation,
    required this.propertyOwnershipDoc,
    required this.propertyRevenueRecord,
    required this.encumbranceStatus,
    required this.mutationStatus,
  });
}

class ArgumentsModel {
  final String prosecution;
  final String defence;

  ArgumentsModel({
    required this.prosecution,
    required this.defence,
  });
}
