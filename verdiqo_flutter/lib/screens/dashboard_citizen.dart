// lib/screens/dashboard_citizen.dart

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../models/case_model.dart';

class DashboardCitizen extends StatefulWidget {
  const DashboardCitizen({super.key});

  @override
  State<DashboardCitizen> createState() => _DashboardCitizenState();
}

class _DashboardCitizenState extends State<DashboardCitizen> {
  final _searchController = TextEditingController();
  final _trackController = TextEditingController();
  CaseModel? _trackedCase;
  bool _hasSearchedTrack = false;
  String _offenceFilter = '';

  final List<Map<String, String>> _offenceDb = [
    {
      'section': 'IPC 379',
      'bnsEquivalent': 'BNS Section 303',
      'nameEn': 'Theft',
      'nameHi': 'चोरी (Theft)',
      'descriptionEn': 'Dishonestly taking moveable property out of the possession of any person without consent.',
      'descriptionHi': 'सहमति के बिना किसी भी व्यक्ति के कब्जे से बेईमानी से चल संपत्ति ले जाना।',
      'classificationEn': 'NON-BAILABLE',
      'classificationHi': 'गैर-जमानती (NON-BAILABLE)',
      'punishmentEn': 'Imprisonment up to 3 years, or fine, or both.',
      'punishmentHi': '3 साल तक की कैद, या जुर्माना, या दोनों।',
      'bailProbabilityEn': 'Moderate. Usually granted by Magistrate if recovery of stolen property is complete and accused has no prior record.',
      'bailProbabilityHi': 'मध्यम। आमतौर पर मजिस्ट्रेट द्वारा जमानत दे दी जाती है यदि चोरी की गई संपत्ति की वसूली पूरी हो चुकी हो और आरोपी का कोई पूर्व आपराधिक इतिहास न हो।',
      'nextStepsEn': 'File Regular Bail Application under Section 437 CrPC (Section 480 BNSS) in the Magistrate Court.',
      'nextStepsHi': 'मजिस्ट्रेट कोर्ट में धारा 437 CrPC (धारा 480 BNSS) के तहत नियमित ज़मानत याचिका दायर करें।'
    },
    {
      'section': 'IPC 420',
      'bnsEquivalent': 'BNS Section 318',
      'nameEn': 'Cheating',
      'nameHi': 'धोखाधड़ी (Cheating)',
      'descriptionEn': 'Cheating and thereby dishonestly inducing the person deceived to deliver any property.',
      'descriptionHi': 'धोखा देना और उसके द्वारा धोखा खाए गए व्यक्ति को बेईमानी से कोई संपत्ति सौंपने के लिए प्रेरित करना।',
      'classificationEn': 'NON-BAILABLE',
      'classificationHi': 'गैर-जमानती (NON-BAILABLE)',
      'punishmentEn': 'Imprisonment up to 7 years and fine.',
      'punishmentHi': '7 साल तक की कैद और जुर्माना।',
      'bailProbabilityEn': 'High-Moderate. Courts frequently grant bail if the dispute is predominantly civil/commercial and money trail is documented.',
      'bailProbabilityHi': 'उच्च-मध्यम। यदि विवाद मुख्य रूप से नागरिक/व्यावसायिक प्रकृति का है और पैसों का लेन-देन प्रमाणित है, तो अदालतें अक्सर ज़मानत दे देती हैं।',
      'nextStepsEn': 'File Anticipatory Bail under Section 438 CrPC (Section 482 BNSS) to prevent arrest, or Regular Bail under Section 437/439 CrPC.',
      'nextStepsHi': 'गिरफ्तारी से बचने के लिए धारा 438 CrPC (धारा 482 BNSS) के तहत अग्रिम ज़मानत, या धारा 437/439 CrPC के तहत नियमित ज़मानत दायर करें।'
    },
    {
      'section': 'IPC 302',
      'bnsEquivalent': 'BNS Section 103',
      'nameEn': 'Murder',
      'nameHi': 'हत्या (Murder)',
      'descriptionEn': 'Voluntarily causing the death of a human being with intention or knowledge.',
      'descriptionHi': 'इरादे या ज्ञान के साथ स्वेच्छा से किसी मनुष्य की मृत्यु का कारण बनना।',
      'classificationEn': 'NON-BAILABLE',
      'classificationHi': 'गैर-जमानती (NON-BAILABLE)',
      'punishmentEn': 'Death Penalty or Life Imprisonment, and fine.',
      'punishmentHi': 'मृत्युदंड या आजीवन कारावास, और जुर्माना।',
      'bailProbabilityEn': 'Very Low. Subject to extreme judicial scrutiny. Granted only in exceptional circumstances (e.g., lack of prima facie evidence or terminal illness).',
      'bailProbabilityHi': 'अत्यधिक कम। कठोर न्यायिक जांच के अधीन। केवल असाधारण परिस्थितियों में दी जाती है (जैसे, प्रथम दृष्टया सबूतों की कमी या गंभीर बीमारी)।',
      'nextStepsEn': 'Bail can only be applied in Sessions Court or High Court under Section 439 CrPC (Section 483 BNSS).',
      'nextStepsHi': 'ज़मानत केवल धारा 439 CrPC (धारा 483 BNSS) के तहत सत्र न्यायालय (Sessions Court) या उच्च न्यायालय में ही लागू की जा सकती है।'
    },
    {
      'section': 'IPC 498A',
      'bnsEquivalent': 'BNS Section 85',
      'nameEn': 'Matrimonial Cruelty',
      'nameHi': 'वैवाहिक क्रूरता (Cruelty)',
      'descriptionEn': 'Husband or relative of husband of a woman subjecting her to cruelty or dowry harassment.',
      'descriptionHi': 'किसी महिला का पति या पति का रिश्तेदार उसे क्रूरता या दहेज उत्पीड़न का शिकार बनाता है।',
      'classificationEn': 'NON-BAILABLE',
      'classificationHi': 'गैर-जमानती (NON-BAILABLE)',
      'punishmentEn': 'Imprisonment up to 3 years and fine.',
      'punishmentHi': '3 साल तक की कैद और जुर्माना।',
      'bailProbabilityEn': 'High. Supreme Court (Arnesh Kumar guidelines) limits direct arrest. Bail is routinely granted, often with mediation conditions.',
      'bailProbabilityHi': 'उच्च। सुप्रीम कोर्ट (अर्णेश कुमार दिशानिर्देश) प्रत्यक्ष गिरफ्तारी को सीमित करता है। ज़मानत नियमित रूप से दी जाती है, अक्सर मध्यस्थता की शर्तों के साथ।',
      'nextStepsEn': 'Highly recommended to file for Anticipatory Bail under Section 438 CrPC before arrest.',
      'nextStepsHi': 'गिरफ्तारी से पहले धारा 438 CrPC के तहत अग्रिम ज़मानत के लिए आवेदन करने की अत्यधिक सिफारिश की जाती है।'
    }
  ];

  final Map<String, Map<String, String>> _localizedText = {
    'en': {
      'citizen_portal': 'Citizen / Accused Legal Information Portal',
      'tab_home': 'Home',
      'tab_search': 'Offence Database',
      'tab_track': 'Track Bail Status',
      'logout': 'LOGOUT',
      'welcome': 'Welcome to Verdiqo Citizen Portal',
      'edu_body': 'This portal provides interactive legal education and resources for under-trial citizens, accused persons, and prospective guarantors under Indian Penal Code and Bharatiya Nyaya Sanhita (BNS) protocols.',
      'bail_types': 'Types of Bail in Indian Law',
      'regular_bail': 'Regular Bail',
      'regular_desc': 'Applied under Section 437/439 CrPC (Section 480/483 BNSS) after arrest, seeking release from police or judicial custody.',
      'anticipatory_bail': 'Anticipatory Bail',
      'anticipatory_desc': 'Applied under Section 438 CrPC (Section 482 BNSS) prior to arrest on suspicion of non-bailable offence charges.',
      'transit_bail': 'Transit Bail',
      'transit_desc': 'Temporary protection granted to enable travel to a competent court in another district or state to apply for regular/anticipatory bail.',
      'search_hint': 'Search offences (e.g. Theft, IPC 420)...',
      'track_title': 'Track Bail Case Progress',
      'track_desc': 'Enter your 12-digit Case Number to retrieve real-time status updates directly from the court register.',
      'case_num_label': 'Case Number (e.g. BMS/2026/0042)',
      'btn_track': 'LOOKUP REGISTER',
      'status_not_found': 'No matching bail application found in the registry. Double-check your docket ID.',
      'verdict': 'Final Verdict',
      'remarks': 'Remarks / Judge Directions',
      'surety_status': 'Surety Land Mutation Release Status',
    },
    'hi': {
      'citizen_portal': 'नागरिक / आरोपी कानूनी जानकारी पोर्टल',
      'tab_home': 'मुख्य पृष्ठ',
      'tab_search': 'अपराध डेटाबेस',
      'tab_track': 'जमानत स्थिति ट्रैक करें',
      'logout': 'लॉगआउट',
      'welcome': 'वर्दीको नागरिक पोर्टल पर आपका स्वागत है',
      'edu_body': 'यह पोर्टल भारतीय दंड संहिता (IPC) और भारतीय न्याय संहिता (BNS) प्रोटोकॉल के तहत उपचाराधीन नागरिकों, आरोपी व्यक्तियों और संभावित जमानतदारों के लिए इंटरैक्टिव कानूनी शिक्षा और संसाधन प्रदान करता है।',
      'bail_types': 'भारतीय कानून में जमानत के प्रकार',
      'regular_bail': 'नियमित जमानत (Regular Bail)',
      'regular_desc': 'गिरफ्तारी के बाद पुलिस या न्यायिक हिरासत से रिहाई की मांग करते हुए धारा 437/439 CrPC (धारा 480/483 BNSS) के तहत आवेदन किया जाता है।',
      'anticipatory_bail': 'अग्रिम जमानत (Anticipatory Bail)',
      'anticipatory_desc': 'गैर-जमानती अपराध के आरोपों के संदेह में गिरफ्तारी से पहले धारा 438 CrPC (धारा 482 BNSS) के तहत लागू किया जाता है।',
      'transit_bail': 'पारगमन जमानत (Transit Bail)',
      'transit_desc': 'नियमित/अग्रिम जमानत के लिए आवेदन करने के लिए दूसरे जिले या राज्य की सक्षम अदालत में जाने के लिए अस्थायी सुरक्षा प्रदान की जाती है।',
      'search_hint': 'अपराध खोजें (जैसे: चोरी, IPC 420)...',
      'track_title': 'जमानत मामले की प्रगति को ट्रैक करें',
      'track_desc': 'अदालत के रजिस्टर से सीधे रीयल-टाइम स्थिति अपडेट प्राप्त करने के लिए अपनी 12-अंकीय केस संख्या दर्ज करें।',
      'case_num_label': 'केस नंबर (जैसे: BMS/2026/0042)',
      'btn_track': 'रजिस्टर में खोजें',
      'status_not_found': 'रजिस्ट्री में कोई मिलान नहीं मिला। अपनी केस संख्या दोबारा जांचें।',
      'verdict': 'अंतिम निर्णय',
      'remarks': 'टिप्पणियां / न्यायाधीश के निर्देश',
      'surety_status': 'ज़मानत भूमि उत्परिवर्तन जारी स्थिति',
    }
  };

  void _trackCase(AppState state) {
    final query = _trackController.text.trim();
    final match = state.cases.firstWhere(
      (c) => c.caseNumber.toLowerCase() == query.toLowerCase(),
      orElse: () => throw Exception('Not found'),
    );
    setState(() {
      _trackedCase = match;
      _hasSearchedTrack = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppState>(context);
    final text = _localizedText[appState.locale]!;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: Text(text['citizen_portal']!),
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
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: appState.citizenActiveTab == 'home'
            ? 0
            : (appState.citizenActiveTab == 'offences' ? 1 : 2),
        onTap: (idx) {
          if (idx == 0) appState.setCitizenActiveTab('home');
          if (idx == 1) appState.setCitizenActiveTab('offences');
          if (idx == 2) appState.setCitizenActiveTab('track');
        },
        selectedItemColor: const Color(0xFFD4AF37),
        items: [
          BottomNavigationBarItem(icon: const Icon(Icons.home), label: text['tab_home']!),
          BottomNavigationBarItem(icon: const Icon(Icons.gavel), label: text['tab_search']!),
          BottomNavigationBarItem(icon: const Icon(Icons.track_changes), label: text['tab_track']!),
        ],
      ),
      body: _buildActiveTabContent(appState, text, isDark),
    );
  }

  Widget _buildActiveTabContent(AppState state, Map<String, String> text, bool isDark) {
    if (state.citizenActiveTab == 'offences') {
      return _buildOffencesSearch(text, isDark);
    } else if (state.citizenActiveTab == 'track') {
      return _buildBailTracker(state, text, isDark);
    } else {
      return _buildHomeContent(text, isDark);
    }
  }

  // TAB 1: HOME/EDUCATION
  Widget _buildHomeContent(Map<String, String> text, bool isDark) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(text['welcome']!, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: Color(0xFFD4AF37))),
          const SizedBox(height: 12),
          Text(text['edu_body']!, style: const TextStyle(fontSize: 14, height: 1.5)),
          const Divider(height: 40),
          
          Text(text['bail_types']!, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFFD4AF37))),
          const SizedBox(height: 16),
          
          _buildBailTypeCard(text['regular_bail']!, text['regular_desc']!, isDark),
          _buildBailTypeCard(text['anticipatory_bail']!, text['anticipatory_desc']!, isDark),
          _buildBailTypeCard(text['transit_bail']!, text['transit_desc']!, isDark),
        ],
      ),
    );
  }

  Widget _buildBailTypeCard(String title, String desc, bool isDark) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.verified, color: Color(0xFFD4AF37), size: 20),
                const SizedBox(width: 8),
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
              ],
            ),
            const SizedBox(height: 8),
            Text(desc, style: const TextStyle(fontSize: 13, height: 1.4, color: Colors.white70)),
          ],
        ),
      ),
    );
  }

  // TAB 2: OFFENCES SEARCH
  Widget _buildOffencesSearch(Map<String, String> text, bool isDark) {
    final locale = Provider.of<AppState>(context, listen: false).locale;
    final filtered = _offenceDb.where((o) {
      final q = _offenceFilter.toLowerCase();
      return o['section']!.toLowerCase().contains(q) ||
             o['nameEn']!.toLowerCase().contains(q) ||
             o['nameHi']!.contains(q);
    }).toList();

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        children: [
          TextField(
            onChanged: (val) => setState(() => _offenceFilter = val),
            decoration: InputDecoration(
              hintText: text['search_hint'],
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
          
          Expanded(
            child: ListView.builder(
              itemCount: filtered.length,
              itemBuilder: (context, idx) {
                final o = filtered[idx];
                return ExpansionTile(
                  title: Text('${o['section']}: ${locale == 'en' ? o['nameEn'] : o['nameHi']}', style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text('${o['bnsEquivalent']} | ${locale == 'en' ? o['classificationEn'] : o['classificationHi']}', style: const TextStyle(color: Colors.redAccent, fontSize: 12)),
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          _buildDetailRow('Description', locale == 'en' ? o['descriptionEn']! : o['descriptionHi']!),
                          const Divider(),
                          _buildDetailRow('Punishment', locale == 'en' ? o['punishmentEn']! : o['punishmentHi']!),
                          const Divider(),
                          _buildDetailRow('Bail Probability', locale == 'en' ? o['bailProbabilityEn']! : o['bailProbabilityHi']!),
                          const Divider(),
                          _buildDetailRow('Next Actions Required', locale == 'en' ? o['nextStepsEn']! : o['nextStepsHi']!),
                        ],
                      ),
                    ),
                  ],
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailRow(String title, String val) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFFD4AF37))),
          const SizedBox(height: 4),
          Text(val, style: const TextStyle(fontSize: 13, height: 1.4)),
        ],
      ),
    );
  }

  // TAB 3: TRACK BAIL STATUS
  Widget _buildBailTracker(AppState state, Map<String, String> text, bool isDark) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(text['track_title']!, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Color(0xFFD4AF37))),
          const SizedBox(height: 8),
          Text(text['track_desc']!, style: const TextStyle(fontSize: 13, color: Colors.grey)),
          const SizedBox(height: 20),
          
          TextField(
            controller: _trackController,
            decoration: InputDecoration(
              labelText: text['case_num_label'],
              border: const OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 16),
          
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFD4AF37),
              foregroundColor: Colors.black,
              padding: const EdgeInsets.symmetric(vertical: 14),
            ),
            onPressed: () {
              try {
                _trackCase(state);
              } catch (e) {
                setState(() {
                  _trackedCase = null;
                  _hasSearchedTrack = true;
                });
              }
            },
            child: Text(text['btn_track']!),
          ),
          const SizedBox(height: 24),
          
          if (_hasSearchedTrack) ...[
            if (_trackedCase == null) ...[
              Text(
                text['status_not_found']!,
                style: const TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              )
            ] else ...[
              Card(
                color: isDark ? const Color(0xFF1E293B) : Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                  side: BorderSide(color: const Color(0xFFD4AF37).withOpacity(0.5)),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(_trackedCase!.caseNumber, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                          _buildTrackStatusChip(_trackedCase!.orderStatus),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Text('Accused: ${_trackedCase!.accused.fullName}'),
                      Text('Investigating PS: ${_trackedCase!.policeStation}'),
                      Text('IPC Sections Filed: ${_trackedCase!.ipcSections}'),
                      const Divider(height: 24),
                      Text('${text['verdict']}: ${_trackedCase!.orderStatus}', style: const TextStyle(fontWeight: FontWeight.bold)),
                      const SizedBox(height: 4),
                      Text('${text['remarks']}: ${_trackedCase!.judgeRemarks.isEmpty ? "No directions registered yet." : _trackedCase!.judgeRemarks}', style: const TextStyle(fontStyle: FontStyle.italic)),
                      const Divider(height: 24),
                      Text('${text['surety_status']}: ${_trackedCase!.surety.mutationStatus}', style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFD4AF37))),
                    ],
                  ),
                ),
              ),
            ],
          ],
        ],
      ),
    );
  }

  Widget _buildTrackStatusChip(String status) {
    Color color = Colors.grey;
    if (status == 'GRANTED' || status == 'GRANTED_WITH_CONDITIONS') {
      color = Colors.green;
    } else if (status == 'DENIED') {
      color = Colors.red;
    } else if (status == 'ADJOURNED') {
      color = Colors.orange;
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(12)),
      child: Text(status, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Colors.white)),
    );
  }
}
