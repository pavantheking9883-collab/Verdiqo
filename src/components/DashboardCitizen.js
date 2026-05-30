/**
 * VERDIQO: CITIZEN / ACCUSED MOBILE PORTAL SIMULATOR (UPGRADED)
 * Quantex Intelligence Systems (P) Ltd.
 * Interactive Legal Education, Case Registry Puller, Offence Search, and Surety Guide.
 */

// Comprehensive mock database of Indian Penal Code (IPC) / Bhartiya Nyaya Sanhita (BNS) offences
const OFFENCE_DATABASE = [
    {
        section: 'IPC 379',
        bnsEquivalent: 'BNS Section 303',
        nameEn: 'Theft',
        nameHi: 'Theft (चोरी)',
        descriptionEn: 'Dishonestly taking moveable property out of the possession of any person without consent.',
        descriptionHi: 'सहमति के बिना किसी भी व्यक्ति के कब्जे से बेईमानी से चल संपत्ति ले जाना।',
        classificationEn: 'NON-BAILABLE',
        classificationHi: 'NON-BAILABLE (गैर-जमानती)',
        classificationStatus: 'danger',
        punishmentEn: 'Imprisonment up to 3 years, or fine, or both.',
        punishmentHi: '3 साल तक की कैद, या जुर्माना, या दोनों।',
        bailProbabilityEn: 'Moderate. Usually granted by Magistrate if recovery of stolen property is complete and accused has no prior record.',
        bailProbabilityHi: 'मध्यम। आमतौर पर मजिस्ट्रेट द्वारा जमानत दे दी जाती है यदि चोरी की गई संपत्ति की वसूली पूरी हो चुकी हो और आरोपी का कोई पूर्व आपराधिक इतिहास न हो।',
        nextStepsEn: 'File Regular Bail Application under Section 437 CrPC (Section 480 BNSS) in the Magistrate Court.',
        nextStepsHi: 'मजिस्ट्रेट कोर्ट में धारा 437 CrPC (धारा 480 BNSS) के तहत नियमित ज़मानत याचिका दायर करें।'
    },
    {
        section: 'IPC 420',
        bnsEquivalent: 'BNS Section 318',
        nameEn: 'Cheating',
        nameHi: 'Cheating (धोखाधड़ी)',
        descriptionEn: 'Cheating and thereby dishonestly inducing the person deceived to deliver any property.',
        descriptionHi: 'धोखा देना और उसके द्वारा धोखा खाए गए व्यक्ति को बेईमानी से कोई संपत्ति सौंपने के लिए प्रेरित करना।',
        classificationEn: 'NON-BAILABLE',
        classificationHi: 'NON-BAILABLE (गैर-जमानती)',
        classificationStatus: 'danger',
        punishmentEn: 'Imprisonment up to 7 years and fine.',
        punishmentHi: '7 साल तक की कैद और जुर्माना।',
        bailProbabilityEn: 'High-Moderate. Courts frequently grant bail if the dispute is predominantly civil/commercial and money trail is documented.',
        bailProbabilityHi: 'उच्च-मध्यम। यदि विवाद मुख्य रूप से नागरिक/व्यावसायिक प्रकृति का है और पैसों का लेन-देन प्रमाणित है, तो अदालतें अक्सर ज़मानत दे देती हैं।',
        nextStepsEn: 'File Anticipatory Bail under Section 438 CrPC (Section 482 BNSS) to prevent arrest, or Regular Bail under Section 437/439 CrPC.',
        nextStepsHi: 'गिरफ्तारी से बचने के लिए धारा 438 CrPC (धारा 482 BNSS) के तहत अग्रिम ज़मानत, या धारा 437/439 CrPC के तहत नियमित ज़मानत दायर करें।'
    },
    {
        section: 'IPC 302',
        bnsEquivalent: 'BNS Section 103',
        nameEn: 'Murder',
        nameHi: 'Murder (हत्या)',
        descriptionEn: 'Voluntarily causing the death of a human being with intention or knowledge.',
        descriptionHi: 'इरादे या ज्ञान के साथ स्वेच्छा से किसी मनुष्य की मृत्यु का कारण बनना।',
        classificationEn: 'NON-BAILABLE',
        classificationHi: 'NON-BAILABLE (गैर-जमानती)',
        classificationStatus: 'danger',
        punishmentEn: 'Death Penalty or Life Imprisonment, and fine.',
        punishmentHi: 'मृत्युदंड या आजीवन कारावास, और जुर्माना।',
        bailProbabilityEn: 'Very Low. Subject to extreme judicial scrutiny. Granted only in exceptional circumstances (e.g., lack of prima facie evidence or terminal illness).',
        bailProbabilityHi: 'अत्यधिक कम। कठोर न्यायिक जांच के अधीन। केवल असाधारण परिस्थितियों में दी जाती है (जैसे, प्रथम दृष्टया सबूतों की कमी या गंभीर बीमारी)।',
        nextStepsEn: 'Bail can only be applied in Sessions Court or High Court under Section 439 CrPC (Section 483 BNSS).',
        nextStepsHi: 'ज़मानत केवल धारा 439 CrPC (धारा 483 BNSS) के तहत सत्र न्यायालय (Sessions Court) या उच्च न्यायालय में ही लागू की जा सकती है।'
    },
    {
        section: 'IPC 498A',
        bnsEquivalent: 'BNS Section 85',
        nameEn: 'Matrimonial Cruelty',
        nameHi: 'Matrimonial Cruelty (वैवाहिक क्रूरता)',
        descriptionEn: 'Husband or relative of husband of a woman subjecting her to cruelty or dowry harassment.',
        descriptionHi: 'किसी महिला का पति या पति का रिश्तेदार उसे क्रूरता या दहेज उत्पीड़न का शिकार बनाता है।',
        classificationEn: 'NON-BAILABLE',
        classificationHi: 'NON-BAILABLE (गैर-जमानती)',
        classificationStatus: 'danger',
        punishmentEn: 'Imprisonment up to 3 years and fine.',
        punishmentHi: '3 साल तक की कैद और जुर्माना।',
        bailProbabilityEn: 'High. Supreme Court (Arnesh Kumar guidelines) limits direct arrest. Bail is routinely granted, often with mediation conditions.',
        bailProbabilityHi: 'उच्च। सुप्रीम कोर्ट (अर्णेश कुमार दिशानिर्देश) प्रत्यक्ष गिरफ्तारी को सीमित करता है। ज़मानत नियमित रूप से दी जाती है, अक्सर मध्यस्थता की शर्तों के साथ।',
        nextStepsEn: 'Highly recommended to file for Anticipatory Bail under Section 438 CrPC before arrest.',
        nextStepsHi: 'गिरफ्तारी से पहले धारा 438 CrPC के तहत अग्रिम ज़मानत के लिए आवेदन करने की अत्यधिक सिफारिश की जाती है।'
    },
    {
        section: 'IPC 324',
        bnsEquivalent: 'BNS Section 115',
        nameEn: 'Hurt by Dangerous Weapons',
        nameHi: 'Hurt by Dangerous Weapons (खतरनाक हथियारों से चोट)',
        descriptionEn: 'Voluntarily causing hurt by means of instrument for shooting, stabbing or cutting.',
        descriptionHi: 'गोली मारने, छुरा घोंपने या काटने के उपकरण के माध्यम से स्वेच्छा से चोट पहुँचाना।',
        classificationEn: 'NON-BAILABLE',
        classificationHi: 'NON-BAILABLE (गैर-जमानती)',
        classificationStatus: 'danger',
        punishmentEn: 'Imprisonment up to 3 years, or fine, or both.',
        punishmentHi: '3 साल तक की कैद, या जुर्माना, या दोनों।',
        bailProbabilityEn: 'Moderate-High. Often granted once weapon is recovered and victim is out of danger.',
        bailProbabilityHi: 'मध्यम-उच्च। हथियार बरामद होने और पीड़ित के खतरे से बाहर होने के बाद अक्सर ज़मानत दे दी जाती है।',
        nextStepsEn: 'File Regular Bail under Section 437 CrPC at the local Magistrate Court.',
        nextStepsHi: 'स्थानीय मजिस्ट्रेट कोर्ट में धारा 437 CrPC के तहत नियमित ज़मानत याचिका दायर करें।'
    },
    {
        section: 'IPC 506',
        bnsEquivalent: 'BNS Section 351',
        nameEn: 'Criminal Intimidation',
        nameHi: 'Criminal Intimidation (अपराधिक धमकी)',
        descriptionEn: 'Threatening a person with injury to their person, reputation or property.',
        descriptionHi: 'किसी व्यक्ति को उसके शरीर, प्रतिष्ठा या संपत्ति को नुकसान पहुँचाने की धमकी देना।',
        classificationEn: 'BAILABLE',
        classificationHi: 'BAILABLE (जमानती)',
        classificationStatus: 'success',
        punishmentEn: 'Imprisonment up to 2 years, or fine, or both.',
        punishmentHi: '2 साल तक की कैद, या जुर्माना, या दोनों।',
        bailProbabilityEn: 'Automatic. Bail is a matter of absolute statutory right. Police must release you on executing a simple bail bond.',
        bailProbabilityHi: 'स्वचालित। ज़मानत पूर्ण वैधानिक अधिकार का मामला है। एक साधारण ज़मानत बांड भरने पर पुलिस को आपको रिहा करना होगा।',
        nextStepsEn: 'Submit a simple bail bond (Form 45) at the local Police Station or Magistrate Desk. No formal court hearing is required.',
        nextStepsHi: 'स्थानीय पुलिस स्टेशन या मजिस्ट्रेट डेस्क पर एक साधारण ज़मानत बांड (फॉर्म 45) जमा करें। कोई औपचारिक अदालती सुनवाई की आवश्यकता नहीं है।'
    }
];

export const DashboardCitizen = {
    render(container, state, onUpdate) {
        let activeMobileTab = state.citizenActiveMobileTab || 'home'; // 'home', 'tracker', 'search', 'puller', 'surety'
        
        container.innerHTML = `
            <div class="dashboard-header-block">
                <div class="dashboard-title">
                    <h2 style="display:flex; align-items:center; gap:8px;">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                        <span>${state.translate('Citizen Smart Legal Portal', 'नागरिक स्मार्ट कानूनी पोर्टल')}</span>
                    </h2>
                    <p>${state.translate('Verify active cases, explore bailable offences, and review Indian surety rules', 'अपने सक्रिय मामलों की पुष्टि करें, ज़मानती अपराधों का पता लगाएं, और भारतीय ज़मानत नियमों की समीक्षा करें')}</p>
                </div>
            </div>

            <div class="citizen-dashboard-wrapper">
                <!-- SMARTPHONE CONTAINER FRAME -->
                <div class="phone-frame">
                    <div class="phone-header-notch"></div>
                    <div class="phone-screen">
                        
                        <!-- Mini Navigation bar inside phone -->
                        <div class="phone-nav">
                            <div style="display:flex; align-items:center; gap:8px;">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><path d="M12 2v20M5 7h14M5 7L3 13h4L5 7zm14 0l-2 6h4l-2-6zM12 22h6M12 22H6"/></svg>
                                <h3 style="font-size:14px; letter-spacing:0.5px; font-weight:700;">Verdiqo Citizen</h3>
                            </div>
                            <span style="font-size: 10px; font-family:var(--font-mono); color:var(--color-gold); font-weight:700;">AP COURT</span>
                        </div>
                        
                        <!-- Phone Screen Body -->
                        <div class="phone-body" id="phone-screen-content"></div>
                        
                        <div style="background-color: var(--color-header-dark); border-top: 1px solid var(--color-border); display:grid; grid-template-columns: repeat(5, 1fr); padding: 8px 4px; text-align:center; font-size:9.5px; font-weight:700;">
                            <div class="mobile-nav-item ${activeMobileTab === 'home' ? 'active-tab' : ''}" id="tab-m-home" style="cursor:pointer; color:${activeMobileTab === 'home' ? 'var(--color-gold)' : 'rgba(255, 255, 255, 0.45)'}; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                                <div style="margin-top:4px;">${state.translate('Home', 'होम')}</div>
                            </div>
                            <div class="mobile-nav-item ${activeMobileTab === 'tracker' ? 'active-tab' : ''}" id="tab-m-tracker" style="cursor:pointer; color:${activeMobileTab === 'tracker' ? 'var(--color-gold)' : 'rgba(255, 255, 255, 0.45)'}; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
                                <div style="margin-top:4px;">${state.translate('Tracker', 'ट्रैकर')}</div>
                            </div>
                            <div class="mobile-nav-item ${activeMobileTab === 'puller' ? 'active-tab' : ''}" id="tab-m-puller" style="cursor:pointer; color:${activeMobileTab === 'puller' ? 'var(--color-gold)' : 'rgba(255, 255, 255, 0.45)'}; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                <div style="margin-top:4px;">${state.translate('My Cases', 'मेरे मामले')}</div>
                            </div>
                            <div class="mobile-nav-item ${activeMobileTab === 'search' ? 'active-tab' : ''}" id="tab-m-search" style="cursor:pointer; color:${activeMobileTab === 'search' ? 'var(--color-gold)' : 'rgba(255, 255, 255, 0.45)'}; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 20V4H20v16H6.5z"/></svg>
                                <div style="margin-top:4px;">${state.translate('Bail Law', 'ज़मानत कानून')}</div>
                            </div>
                            <div class="mobile-nav-item ${activeMobileTab === 'surety' ? 'active-tab' : ''}" id="tab-m-surety" style="cursor:pointer; color:${activeMobileTab === 'surety' ? 'var(--color-gold)' : 'rgba(255, 255, 255, 0.45)'}; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                <div style="margin-top:4px;">${state.translate('Surety', 'ज़मानतदार')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Render specific screen layout
        const phoneContent = container.querySelector('#phone-screen-content');
        if (activeMobileTab === 'home') {
            this.renderHome(phoneContent, state, onUpdate);
        } else if (activeMobileTab === 'tracker') {
            this.renderTracker(phoneContent, state, onUpdate);
        } else if (activeMobileTab === 'puller') {
            this.renderCasePuller(phoneContent, state, onUpdate);
        } else if (activeMobileTab === 'search') {
            this.renderLawSearch(phoneContent, state, onUpdate);
        } else if (activeMobileTab === 'surety') {
            this.renderSuretyGuide(phoneContent, state, onUpdate);
        }

        // Bind Bottom Tab Click Events
        const bindTab = (tabId, targetName) => {
            container.querySelector(`#${tabId}`).addEventListener('click', () => {
                state.citizenActiveMobileTab = targetName;
                onUpdate();
            });
        };
        bindTab('tab-m-home', 'home');
        bindTab('tab-m-tracker', 'tracker');
        bindTab('tab-m-puller', 'puller');
        bindTab('tab-m-search', 'search');
        bindTab('tab-m-surety', 'surety');
    },

    renderHome(phoneContent, state, onUpdate) {
        phoneContent.innerHTML = `
            <div style="text-align:center; padding: 10px 0; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                <div class="gov-emblem-badge" style="width: 68px; height: 68px; margin-bottom: 12px;">
                    <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><path d="M12 2v20M5 7h14M5 7L3 13h4L5 7zm14 0l-2 6h4l-2-6zM12 22h6M12 22H6"/></svg>
                </div>
                <h4 style="font-size:17px; margin-top:4px; font-family: var(--font-headings); color: var(--color-gold-light);">Welcome to Verdiqo Citizen</h4>
                <p style="font-size:12px; color: var(--color-text-muted); margin-top:4px;">
                    Indian Court Adjudication & Bail Assistance Portal. Know your rights under CrPC / BNSS 2023.
                </p>
            </div>

            <!-- Home Shortcuts Grid (Prestigious side-by-side layout) -->
            <div style="display:flex; flex-direction:column; gap:12px; margin-top:16px;">
                <div class="card" style="padding:14px; cursor:pointer; border-color:var(--color-border); background-color:var(--color-table-header); display:flex; align-items:center; gap:14px;" id="btn-home-track">
                    <div class="gov-emblem-badge" style="width: 38px; height: 38px; flex-shrink: 0;">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
                    </div>
                    <div>
                        <div style="font-size:14px; font-weight:700; color:var(--color-gold-light);">Track Bail Application Status</div>
                        <p style="font-size:11px; color:var(--color-text-muted); margin-top:2px;">Monitor active biometric verifications and mutation steps.</p>
                    </div>
                </div>
                <div class="card" style="padding:14px; cursor:pointer; border-color:var(--color-border); background-color:var(--color-table-header); display:flex; align-items:center; gap:14px;" id="btn-home-pull">
                    <div class="gov-emblem-badge" style="width: 38px; height: 38px; flex-shrink: 0;">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </div>
                    <div>
                        <div style="font-size:14px; font-weight:700; color:var(--color-gold-light);">Know Your Active Cases (Aadhaar)</div>
                        <p style="font-size:11px; color:var(--color-text-muted); margin-top:2px;">Check court cases and registered police FIRs against your ID.</p>
                    </div>
                </div>
                <div class="card" style="padding:14px; cursor:pointer; border-color:var(--color-border); background-color:var(--color-table-header); display:flex; align-items:center; gap:14px;" id="btn-home-law">
                    <div class="gov-emblem-badge" style="width: 38px; height: 38px; flex-shrink: 0;">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 20V4H20v16H6.5z"/></svg>
                    </div>
                    <div>
                        <div style="font-size:14px; font-weight:700; color:var(--color-gold-light);">IPC Offence & Bail Law Predictor</div>
                        <p style="font-size:11px; color:var(--color-text-muted); margin-top:2px;">Search IPC sections to discover punishments and bail probability.</p>
                    </div>
                </div>
                <div class="card" style="padding:14px; cursor:pointer; border-color:var(--color-border); background-color:var(--color-table-header); display:flex; align-items:center; gap:14px;" id="btn-home-surety">
                    <div class="gov-emblem-badge" style="width: 38px; height: 38px; flex-shrink: 0;">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <div>
                        <div style="font-size:14px; font-weight:700; color:var(--color-gold-light);">Indian Surety Guidelines & Liabilities</div>
                        <p style="font-size:11px; color:var(--color-text-muted); margin-top:2px;">Review solvent guarantor eligibility requirements under CrPC Sec 441.</p>
                    </div>
                </div>
            </div>
        `;

        // Bind clicks to switch tabs
        const bindHomeBtn = (id, target) => {
            const el = phoneContent.querySelector(`#${id}`);
            if (el) {
                el.addEventListener('click', () => {
                    state.citizenActiveMobileTab = target;
                    onUpdate();
                });
            }
        };
        bindHomeBtn('btn-home-track', 'tracker');
        bindHomeBtn('btn-home-pull', 'puller');
        bindHomeBtn('btn-home-law', 'search');
        bindHomeBtn('btn-home-surety', 'surety');
    },

    renderTracker(phoneContent, state, onUpdate) {
        let query = state.citizenSearchQuery || 'BMS/2026/0042';
        let activeCase = state.cases.find(c => c.caseNumber === query || c.accused.aadhaarNumber === query);

        if (!activeCase) {
            phoneContent.innerHTML = `
                <div style="text-align:center; padding: 20px 10px;">
                    <h4 style="font-size:16px; margin-bottom:12px;">Track Active Application</h4>
                    <p style="font-size:12px; color:var(--color-text-muted); margin-bottom:16px;">
                        Enter your Case Number or Accused Aadhaar Number to check biometric and mutation progress.
                    </p>
                    <div class="form-group">
                        <input type="text" class="form-input code-font" id="citizen-search-input" value="${query}" placeholder="BMS/2026/0042" style="font-size:13px;">
                    </div>
                    <button class="btn btn-success" id="btn-citizen-search" style="width:100%; font-size:13px; padding:10px; font-weight:700;">Search Application</button>
                    
                    <div style="margin-top: 30px; text-align:left; font-size:11px; background:var(--color-table-header); padding:12px; border-radius:6px; border:1px solid var(--color-border);">
                        <strong>Quick Sandbox Queries:</strong>
                        <p style="font-family:var(--font-mono); margin-top:4px; color:var(--color-gold-light);">• BMS/2026/0042 (Srinivas Rao Vemuri)</p>
                        <p style="font-family:var(--font-mono); margin-top:2px; color:var(--color-gold-light);">• BMS/2026/0040 (Anita Rao - Alert)</p>
                    </div>
                </div>
            `;

            phoneContent.querySelector('#btn-citizen-search').addEventListener('click', () => {
                state.citizenSearchQuery = phoneContent.querySelector('#citizen-search-input').value;
                onUpdate();
            });
            return;
        }

        const step1 = activeCase.checks.identity.status === 'GREEN' ? 'completed' : 'active';
        const step2 = activeCase.checks.finance.status === 'CAPABLE' || activeCase.checks.finance.status === 'BORDERLINE' ? 'completed' : 'active';
        const step3 = activeCase.surety.mutationStatus === 'COMPLETED' ? 'completed' : 'active';
        const step4 = activeCase.orderStatus !== 'PENDING' ? 'completed' : 'active';

        const statusLabel = activeCase.orderStatus === 'PENDING' 
            ? 'UNDER CHECK'
            : activeCase.orderStatus.replace(/_/g, ' ');

        phoneContent.innerHTML = `
            <!-- Search Bar -->
            <div style="display:flex; gap:8px; margin-bottom:14px;">
                <input type="text" class="form-input code-font" id="citizen-search-input" value="${query}" style="font-size:12px; padding:6px; flex:1;">
                <button class="btn btn-primary" id="btn-citizen-search-ref" style="padding:6px 12px; font-size:12px;">Go</button>
            </div>

            <!-- Case summary header card -->
            <div style="background:var(--color-card-dark); border-radius:8px; border:1px solid var(--color-border); padding:12px; margin-bottom:14px;">
                <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-muted); font-weight:700;">Accused Applicant</div>
                <h4 style="font-size:16px; margin-top:2px; color:var(--color-text-main);">${activeCase.accused.fullName}</h4>
                <p style="font-size:11px; font-family:var(--font-mono); color:var(--color-gold);">${activeCase.caseNumber} • FIR: ${activeCase.firNumber}</p>
                
                <div style="margin-top:10px; display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--color-border); padding-top:8px;">
                    <span style="font-size:11px; font-weight:700; color:var(--color-text-muted);">Bail Adjudication:</span>
                    <span class="status-indicator-mock ${activeCase.orderStatus === 'GRANTED' || activeCase.orderStatus === 'GRANTED_WITH_CONDITIONS' ? 'ready' : activeCase.orderStatus === 'DENIED' ? 'alert' : 'checking'}" style="font-size:10px; padding:2px 8px;">
                        ${statusLabel}
                    </span>
                </div>
            </div>

            <!-- MUTATION LOCK WARNING BANNER (Clean lock SVG) -->
            ${activeCase.surety.mutationStatus === 'COMPLETED' ? `
                <div class="mobile-banner-warning">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0; margin-top:2px; color:var(--color-danger);"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                    <div>
                        <strong>MUTATION ENCUMBRANCE MUTATED</strong>
                        <p style="font-size:10px; margin-top:2px; line-height:1.3; color:var(--color-text-muted);">
                            This pledged property land is mutated under Court Lien. Owner cannot sell or mortgage until bail is discharged.
                        </p>
                    </div>
                </div>
            ` : ''}

            <!-- NEXT HEARING DATE -->
            <div style="background:var(--color-card-dark); border-radius:8px; border:1px solid var(--color-border); padding:12px; margin-bottom:14px; border-left: 3px solid var(--color-gold);">
                <div style="font-size:10px; text-transform:uppercase; color:var(--color-text-muted); font-weight:700; display:flex; align-items:center; gap:4px;">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                    <span>Next Court appearance</span>
                </div>
                <div style="font-size:13px; font-weight:700; color:var(--color-text-main); margin-top:4px;">
                    ${activeCase.hearingDate ? new Date(activeCase.hearingDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Hearing Adjourned'}
                </div>
                <p style="font-size:10.5px; color:var(--color-text-muted); margin-top:2px;">
                    Magistrate Court Room 3, Rajamundry. Please arrive with your surety 15 minutes early.
                </p>
            </div>

            <!-- STEPPER -->
            <div style="background:var(--color-card-dark); border-radius:8px; border:1px solid var(--color-border); padding:14px; margin-bottom:14px;">
                <h5 style="font-size:12.5px; text-transform:uppercase; margin-bottom:10px; font-weight:700; color:var(--color-gold-light);">Application Checkpoints</h5>
                <div class="progress-stepper">
                    <div class="step-item ${step1}">
                        <div class="step-marker">${step1 === 'completed' ? '✓' : '1'}</div>
                        <div class="step-details">
                            <h4>UIDAI Biometric Identity</h4>
                            <p>Aadhaar counter check verified green.</p>
                        </div>
                    </div>
                    <div class="step-item ${step2}">
                        <div class="step-marker">${step2 === 'completed' ? '✓' : '2'}</div>
                        <div class="step-details">
                            <h4>Financial Solvency</h4>
                            <p>Surety credit check complete.</p>
                        </div>
                    </div>
                    <div class="step-item ${step3}">
                        <div class="step-marker">${step3 === 'completed' ? '✓' : '3'}</div>
                        <div class="step-details">
                            <h4>Land Mutation Link</h4>
                            <p>Webland Registry encumbrance link.</p>
                        </div>
                    </div>
                    <div class="step-item ${step4}">
                        <div class="step-marker">${step4 === 'completed' ? '✓' : '4'}</div>
                        <div class="step-details">
                            <h4>Bail Order & e-Sign</h4>
                            <p>Judge final adjudication decree.</p>
                        </div>
                    </div>
                </div>
            </div>

            ${activeCase.orderStatus === 'GRANTED' || activeCase.orderStatus === 'GRANTED_WITH_CONDITIONS' ? `
                <button class="btn btn-success" id="btn-download-order-citizen" style="width:100%; font-size:13px; padding:10px; font-weight:700; display:flex; align-items:center; justify-content:center; gap:6px;">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                    <span>Download Signed Bail Order</span>
                </button>
            ` : ''}

            <div style="text-align:center; margin-top:14px;">
                <button class="btn" id="btn-citizen-reset-tracker" style="border:none; color:var(--color-text-muted); font-size:11px;">↩ Track Different Application</button>
            </div>
        `;

        // Bind Tracker Actions
        phoneContent.querySelector('#btn-citizen-search-ref').addEventListener('click', () => {
            state.citizenSearchQuery = phoneContent.querySelector('#citizen-search-input').value;
            onUpdate();
        });
        phoneContent.querySelector('#btn-citizen-reset-tracker').addEventListener('click', () => {
            state.citizenSearchQuery = '';
            onUpdate();
        });
        if (phoneContent.querySelector('#btn-download-order-citizen')) {
            phoneContent.querySelector('#btn-download-order-citizen').addEventListener('click', () => {
                state.openReportViewer(activeCase, 4);
            });
        }
    },

    renderCasePuller(phoneContent, state, onUpdate) {
        let aadhaarQ = state.citizenAadhaarQuery || '';
        let matchedCases = [];

        if (aadhaarQ) {
            // Find all cases matching the Aadhaar number entered
            matchedCases = state.cases.filter(c => c.accused.aadhaarNumber.replace(/[- ]/g, '') === aadhaarQ.replace(/[- ]/g, ''));
        }

        phoneContent.innerHTML = `
            <div style="text-align:center; padding: 10px 0;">
                <h4 style="font-size:16px; margin-bottom:8px; font-weight:700;">Know Your Active Cases</h4>
                <p style="font-size:12px; color:var(--color-text-muted); margin-bottom:16px;">
                    Indian Jurisdiction Portal: Securely fetch all court proceedings and FIR files registered against your Aadhaar card ID.
                </p>
                
                <div class="form-group" style="text-align:left;">
                    <label>Enter 12-Digit Aadhaar Number</label>
                    <input type="text" class="form-input code-font" id="input-puller-aadhaar" value="${aadhaarQ}" placeholder="1234-5678-9012" style="font-size:14px; text-align:center;">
                </div>
                
                <button class="btn btn-success" id="btn-execute-puller" style="width:100%; font-size:13px; padding:10px; font-weight:700;">✓ Pull Government Case Archives</button>
                <p style="font-size: 10px; color:#666; margin-top:6px;">* Secure Verification: biometrics simulated via Aadhaar API.</p>
            </div>

            <!-- Display Results -->
            ${aadhaarQ ? `
                <div style="margin-top:20px; border-top: 1px solid var(--color-border); padding-top:16px; text-align:left;">
                    <h5 style="font-size:12px; color:var(--color-gold); font-weight:700; text-transform:uppercase; margin-bottom:10px;">
                        Found ${matchedCases.length} Registered Proceeding(s)
                    </h5>
                    
                    ${matchedCases.length > 0 ? matchedCases.map(c => `
                        <div class="card" style="padding:12px; border-color:var(--color-border); margin-bottom:10px; background-color:var(--color-table-header); cursor:pointer;" class="puller-case-row" data-case="${c.caseNumber}">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span style="font-family:var(--font-mono); font-weight:700; font-size:13px; color:var(--color-text-main);">${c.caseNumber}</span>
                                <span class="badge ${c.checks.risk.riskLevel === 'LOW' ? 'badge-green' : c.checks.risk.riskLevel === 'MEDIUM' ? 'badge-yellow' : 'badge-red'}" style="font-size:8px;">${c.checks.risk.riskLevel} Risk</span>
                            </div>
                            <div style="font-size:11px; color:var(--color-text-muted); margin-top:4px; display:flex; align-items:flex-start; gap:4px;">
                                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold); flex-shrink:0; margin-top:2px;"><path d="M12 2v20M5 7h14M5 7L3 13h4L5 7zm14 0l-2 6h4l-2-6zM12 22h6M12 22H6"/></svg>
                                <div>
                                    <strong>Charges:</strong> ${c.ipcSections}<br/>
                                    PS: ${c.policeStation.split(',')[0]} | Date: ${c.dateOfArrest}
                                </div>
                            </div>
                            <div style="margin-top:8px; text-align:right; font-size:10px; color:var(--color-gold-light); font-weight:700;">
                                Click tab to track bail progress ➔
                            </div>
                        </div>
                    `).join('') : `
                        <div style="padding:20px; text-align:center; color:var(--color-text-muted); font-size:12px;">
                            No active criminal records or pending bail proceedings found under Aadhaar ID ${aadhaarQ}.
                        </div>
                    `}
                </div>
            ` : `
                <div style="margin-top: 30px; text-align:left; font-size:11px; background:var(--color-table-header); padding:12px; border-radius:6px; border:1px solid var(--color-border);">
                    <strong>Aadhaar IDs in Sandbox registers:</strong>
                    <p style="font-family:var(--font-mono); margin-top:4px; color:var(--color-gold-light);">• Aadhaar: 1234-5678-9012 (Accused: Srinivas Vemuri)</p>
                    <p style="font-family:var(--font-mono); margin-top:2px; color:var(--color-gold-light);">• Aadhaar: 4567-8901-2345 (Accused: Vijay Ganti)</p>
                </div>
            `}
        `;

        // Bind Puller Actions
        phoneContent.querySelector('#btn-execute-puller').addEventListener('click', () => {
            state.citizenAadhaarQuery = phoneContent.querySelector('#input-puller-aadhaar').value;
            onUpdate();
        });

        // Click case to track progress
        phoneContent.querySelectorAll('.card[data-case]').forEach(el => {
            el.addEventListener('click', (e) => {
                const caseNo = e.currentTarget.getAttribute('data-case');
                state.citizenSearchQuery = caseNo;
                state.citizenActiveMobileTab = 'tracker'; // Routes to tracker tab
                onUpdate();
            });
        });
    },

    renderLawSearch(phoneContent, state, onUpdate) {
        let activeOffence = state.citizenSelectedOffence || OFFENCE_DATABASE[0];

        let selectOptions = OFFENCE_DATABASE.map(o => {
            const nameTranslated = state.translate(o.nameEn, o.nameHi);
            return `
                <option value="${o.section}" ${o.section === activeOffence.section ? 'selected' : ''}>${o.section} - ${nameTranslated.split(' (')[0]}</option>
            `;
        }).join('');

        phoneContent.innerHTML = `
            <div style="text-align:center; padding: 10px 0;">
                <h4 style="font-size:16px; margin-bottom:6px; font-weight:700;">IPC Offence & Bail Law Finder</h4>
                <p style="font-size:11.5px; color:var(--color-text-muted); margin-bottom:14px;">
                    Search IPC / BNS Sections to discover offences, jail punishments, and whether bail is Bailable (by Right) or Non-Bailable (Judicial Discretion).
                </p>
                
                <div class="form-group" style="text-align:left;">
                    <label>Select IPC Offence Section</label>
                    <select class="form-input" id="offence-dropdown-select" style="font-size:13px; font-weight:700;">
                        ${selectOptions}
                    </select>
                </div>
            </div>

            <!-- Detailed legal specs of selected offence -->
            <div style="background:var(--color-card-dark); border-radius:8px; border:1px solid var(--color-border); padding:16px; text-align:left;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--color-border); padding-bottom:8px; margin-bottom:12px;">
                    <span style="font-family:var(--font-mono); font-weight:700; font-size:14px; color:var(--color-gold-light);">${activeOffence.section}</span>
                    <span style="font-size:9.5px; color:var(--color-text-muted); font-family:var(--font-mono);">${activeOffence.bnsEquivalent}</span>
                </div>
                
                <h4 style="font-size:15px; color:var(--color-text-main); font-weight:700; margin-bottom:6px;">${state.translate(activeOffence.nameEn, activeOffence.nameHi)}</h4>
                <p style="font-size:12px; color:var(--color-text-muted); line-height:1.4; margin-bottom:12px; font-style:italic;">
                    "${state.translate(activeOffence.descriptionEn, activeOffence.descriptionHi)}"
                </p>
                
                <!-- Classification Badge -->
                <div style="margin-bottom:12px;">
                    <label style="font-size:10px; text-transform:uppercase; color:var(--color-text-muted); font-weight:700; display:block; margin-bottom:4px;">Bail Classification</label>
                    <span class="badge ${activeOffence.classificationStatus === 'success' ? 'badge-green' : 'badge-red'}" style="font-size:10.5px; font-weight:800;">
                        ${state.translate(activeOffence.classificationEn, activeOffence.classificationHi)}
                    </span>
                </div>

                <!-- Punishment -->
                <div style="margin-bottom:12px;">
                    <label style="font-size:10px; text-transform:uppercase; color:var(--color-text-muted); font-weight:700; display:block; margin-bottom:4px;">Statutory Punishment</label>
                    <p style="font-size:12.5px; color:var(--color-text-main); font-weight:500; display:flex; align-items:center; gap:6px;">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><path d="M12 2v20M5 7h14M5 7L3 13h4L5 7zm14 0l-2 6h4l-2-6zM12 22h6M12 22H6"/></svg>
                        <span>${state.translate(activeOffence.punishmentEn, activeOffence.punishmentHi)}</span>
                    </p>
                </div>

                <!-- Bail probability -->
                <div style="margin-bottom:12px; background:rgba(255,255,255,0.02); padding:8px; border-radius:4px; border:1px solid var(--color-border);">
                    <label style="font-size:10px; text-transform:uppercase; color:var(--color-gold); font-weight:700; display:block; margin-bottom:4px;">Bail Release Probability</label>
                    <p style="font-size:12px; color:var(--color-text-main); line-height:1.3; display:flex; align-items:center; gap:6px;">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                        <span>${state.translate(activeOffence.bailProbabilityEn, activeOffence.bailProbabilityHi)}</span>
                    </p>
                </div>

                <!-- Next steps -->
                <div style="border-top:1px dashed var(--color-border); padding-top:10px; margin-top:12px;">
                    <label style="font-size:10px; text-transform:uppercase; color:var(--color-text-muted); font-weight:700; display:block; margin-bottom:4px;">Next Legal Procedure Steps</label>
                    <p style="font-size:12px; color:var(--color-text-main); font-weight:700; line-height:1.3; display:flex; align-items:center; gap:6px;">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        <span>${state.translate(activeOffence.nextStepsEn, activeOffence.nextStepsHi)}</span>
                    </p>
                </div>
            </div>
        `;

        // Bind dropdown select
        phoneContent.querySelector('#offence-dropdown-select').addEventListener('change', (e) => {
            const sec = e.target.value;
            const item = OFFENCE_DATABASE.find(o => o.section === sec);
            if (item) {
                state.citizenSelectedOffence = item;
                onUpdate();
            }
        });
    },

    renderSuretyGuide(phoneContent, state, onUpdate) {
        phoneContent.innerHTML = `
            <div style="text-align:center; padding: 10px 0; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <h4 style="font-size:16px; margin-top:8px; font-weight:700;">Guarantor / Surety Guidelines</h4>
                <p style="font-size:11.5px; color:var(--color-text-muted); margin-bottom:16px;">
                    Legal responsibilities, qualifications, and liability requirements for standing as a surety in Indian Courts under Section 441 CrPC (Section 486 BNSS).
                </p>
            </div>

            <!-- Surety requirements card -->
            <div style="background:var(--color-card-dark); border-radius:8px; border:1px solid var(--color-border); padding:14px; text-align:left; margin-bottom:12px;">
                <h5 style="font-size:12.5px; color:var(--color-gold); font-weight:700; text-transform:uppercase; margin-bottom:8px; border-bottom:1px solid var(--color-border); padding-bottom:4px;">
                    1. Who is Eligible to Stand Surety?
                </h5>
                <ul style="font-size:11.5px; line-height:1.4; color:var(--color-text-main); padding-left:14px; margin-bottom:10px;">
                    <li style="margin-bottom:4px;"><strong>Age & Solvency:</strong> Must be a solvent adult citizen of India, preferably a relative or close associate with local residential ties.</li>
                    <li style="margin-bottom:4px;"><strong>Financial Capability:</strong> Must possess asset values (liquid cash, property, or salary streams) matching the required bail amount.</li>
                    <li style="margin-bottom:4px;"><strong>Clean Guarantee Record:</strong> Cannot hold more than <strong>2 active bail commitments</strong> in any Indian courts simultaneously. Must have zero past bail default logs.</li>
                </ul>

                <h5 style="font-size:12.5px; color:var(--color-gold); font-weight:700; text-transform:uppercase; margin-bottom:8px; border-bottom:1px solid var(--color-border); padding-bottom:4px;">
                    2. Mandatory Documents Needed
                </h5>
                <ul style="font-size:11.5px; line-height:1.4; color:var(--color-text-main); padding-left:14px; margin-bottom:10px;">
                    <li style="margin-bottom:4px;"><strong>Identity Details:</strong> Original Aadhaar Card and PAN Card.</li>
                    <li style="margin-bottom:4px;"><strong>Salary/Pension Surety:</strong> Latest 3 years ITR records, salary slips, or treasury pension statements.</li>
                    <li style="margin-bottom:4px;"><strong>Property/Land Surety:</strong> Title deeds, Sale deed, Latest Valuation Certificate, and clean Encumbrance Certificate (EC).</li>
                </ul>

                <h5 style="font-size:12.5px; color:var(--color-danger); font-weight:700; text-transform:uppercase; margin-bottom:8px; border-bottom:1px solid var(--color-border); padding-bottom:4px;">
                    3. Legal Bond Liabilities (CrPC Sec 446)
                </h5>
                <p style="font-size:11.5px; line-height:1.4; color:var(--color-text-muted); font-style:italic;">
                    "By signing the Bail Bond, you assume full financial liability. If the accused absconds or misses hearings, the Court is legally authorized to attach, mutate, and auction your pledged land or assets to recover the bond amount."
                </p>
            </div>
            
            <div style="background-color:rgba(201,168,76,0.04); border:1px solid var(--color-border); padding:10px; border-radius:6px; font-size:11px; text-align:justify; color:var(--color-gold-light);">
                * <strong>Bilingual Hindi Note:</strong> न्यायालय के नियमों के अनुसार, ज़मानतदार को आरोपी के आचरण और सुनवाई में उपस्थिति सुनिश्चित करने की पूर्ण कानूनी ज़िम्मेदारी लेनी होगी। यदि आरोपी फरार होता है, तो ज़मानत के रूप में दी गई संपत्ति ज़ब्त कर ली जाएगी।
            </div>
        `;
    }
};
