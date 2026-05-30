/**
 * VERDIQO: PRESIDING JUDGE DASHBOARD (MODULE 4B)
 * Quantex Intelligence Systems (P) Ltd.
 * The core judicial decision support dashboard.
 */

export const DashboardJudge = {
    render(container, state, onUpdate) {
        // Find selected case or default to first
        let selectedCase = null;
        if (state.selectedCaseNumber) {
            selectedCase = state.cases.find(c => c.caseNumber === state.selectedCaseNumber);
        }
        if (!selectedCase && state.cases.length > 0) {
            selectedCase = state.cases[0];
            state.selectedCaseNumber = selectedCase.caseNumber;
        }

        // Initialize active mobile view tab if not set
        if (!state.judgeActiveMobileTab) {
            state.judgeActiveMobileTab = 'listings'; // 'listings' or 'details'
        }

        // Render Sidebar and Detail Layout
        container.innerHTML = `
            <!-- Responsive Mobile Tab Switcher (Visible only on mobile via CSS) -->
            <div class="judge-mobile-tabs" style="display: none; margin-bottom: 16px; background-color: var(--color-card-dark); border: 1px solid var(--color-border); border-radius: 8px; padding: 6px; gap: 8px;">
                <button class="btn mobile-tab-btn" id="judge-m-tab-listings" style="flex: 1; padding: 10px; font-size: 13px; text-align: center; border: 1px solid ${state.judgeActiveMobileTab === 'listings' ? 'var(--color-gold)' : 'var(--color-border)'}; background: ${state.judgeActiveMobileTab === 'listings' ? 'rgba(201, 168, 76, 0.1)' : 'transparent'}; color: ${state.judgeActiveMobileTab === 'listings' ? 'var(--color-gold-light)' : 'var(--color-text-muted)'}; font-weight: 700;">
                    ${state.translate("Hearings List", "सुनवाई सूची")}
                </button>
                <button class="btn mobile-tab-btn" id="judge-m-tab-details" style="flex: 1; padding: 10px; font-size: 13px; text-align: center; border: 1px solid ${state.judgeActiveMobileTab === 'details' ? 'var(--color-gold)' : 'var(--color-border)'}; background: ${state.judgeActiveMobileTab === 'details' ? 'rgba(201, 168, 76, 0.1)' : 'transparent'}; color: ${state.judgeActiveMobileTab === 'details' ? 'var(--color-gold-light)' : 'var(--color-text-muted)'}; font-weight: 700;">
                    ${state.translate("Case Assessment", "मामला मूल्यांकन")}
                </button>
            </div>

            <div class="judge-container ${state.judgeActiveMobileTab}">
                <!-- LEFT SIDEBAR: HEARING LIST -->
                <div class="hearing-list-sidebar">
                    <div class="sidebar-title" style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="display:flex; align-items:center; gap:6px;">
                            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            <span>${state.translate("Today's Hear Listings", "आज की सुनवाई सूची")}</span>
                        </span>
                        <span class="badge" style="background-color: var(--color-gold-dim); color: #ffffff; font-family: var(--font-mono); white-space: nowrap; padding: 3px 8px; border-radius: 4px; display: inline-block;">${state.cases.length} Listings</span>
                    </div>
                    <div class="hearing-list" id="judge-hearing-list"></div>
                </div>

                <!-- RIGHT MAIN: DETAIL PANELS -->
                <div class="hearing-detail-view" id="judge-hearing-detail"></div>
            </div>
        `;

        // Bind Mobile Tab Click Events
        const tabListings = container.querySelector('#judge-m-tab-listings');
        const tabDetails = container.querySelector('#judge-m-tab-details');
        
        if (tabListings && tabDetails) {
            tabListings.addEventListener('click', () => {
                state.judgeActiveMobileTab = 'listings';
                onUpdate();
            });
            tabDetails.addEventListener('click', () => {
                state.judgeActiveMobileTab = 'details';
                onUpdate();
            });
        }

        this.renderHearingList(container.querySelector('#judge-hearing-list'), state, onUpdate);
        this.renderCaseDetail(container.querySelector('#judge-hearing-detail'), selectedCase, state, onUpdate);
    },

    renderHearingList(sidebarList, state, onUpdate) {
        let itemsHtml = '';
        
        if (state.cases.length === 0) {
            itemsHtml = `
                <div style="padding:20px; text-align:center; color:#888; font-size:13px;">
                    No pending hearing listings today.
                </div>
            `;
            sidebarList.innerHTML = itemsHtml;
            return;
        }

        // Separate pending and completed cases
        const pendingCases = state.cases.filter(c => c.orderStatus === 'PENDING');
        const completedCases = state.cases.filter(c => c.orderStatus !== 'PENDING');

        const renderCaseItem = (c) => {
            const isSelected = c.caseNumber === state.selectedCaseNumber;
            
            // Determine color dot based on recommendation / risk
            let dotColor = 'var(--color-success)'; // Low Risk
            if (c.checks.identity.status === 'RED' || c.checks.risk.score > 60 || c.checks.suretyLoad.status === 'DISQUALIFIED' || c.checks.property.status === 'BLOCKED') {
                dotColor = 'var(--color-danger)'; // High Risk / Alerts
            } else if (c.checks.risk.riskLevel === 'MEDIUM' || c.checks.finance.status === 'BORDERLINE' || c.checks.suretyLoad.status === 'OVERLOADED') {
                dotColor = 'var(--color-warning)'; // Conditions Needed
            }

            const isSubmitted = c.orderStatus !== 'PENDING';
            const statusLabel = isSubmitted 
                ? `<span style="font-size: 9px; font-weight:800; color:var(--color-success); border:1px solid var(--color-success); padding:1px 6px; border-radius:10px; background:var(--color-success-bg); white-space:nowrap; text-transform:uppercase;">✓ Signed</span>` 
                : `<span style="height: 10px; width: 10px; background-color: ${dotColor}; border-radius: 50%; display: inline-block;"></span>`;

            return `
                <div class="hearing-item ${isSelected ? 'active' : ''} ${isSubmitted ? 'hearing-item-submitted' : ''}" data-case="${c.caseNumber}" style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
                    <div class="hearing-meta" style="flex:1;">
                        <h4 style="${isSubmitted ? 'text-decoration:none; opacity: 0.85;' : ''}">${c.accused.fullName}</h4>
                        <p>${c.caseNumber} • ${c.bailType}</p>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px;">
                        ${statusLabel}
                    </div>
                </div>
            `;
        };

        if (pendingCases.length > 0) {
            itemsHtml += `
                <div class="sidebar-group-header" style="font-size: 10px; text-transform: uppercase; font-weight: 800; color: var(--color-gold); letter-spacing: 1px; padding: 12px 14px 6px 14px; border-bottom: 1px dashed var(--color-border); background-color: rgba(201, 168, 76, 0.03);">
                    ${state.translate('Active Trial Registry', 'सक्रिय सुनवाई सूची')} (${pendingCases.length})
                </div>
            `;
            pendingCases.forEach(c => {
                itemsHtml += renderCaseItem(c);
            });
        }

        if (completedCases.length > 0) {
            itemsHtml += `
                <div class="sidebar-group-header" style="font-size: 10px; text-transform: uppercase; font-weight: 800; color: var(--color-text-muted); letter-spacing: 1px; padding: 16px 14px 6px 14px; border-bottom: 1px dashed var(--color-border); background-color: rgba(255, 255, 255, 0.01); margin-top:10px;">
                    ${state.translate('Adjudicated / Submitted', 'निर्णित / प्रस्तुत मामले')} (${completedCases.length})
                </div>
            `;
            completedCases.forEach(c => {
                itemsHtml += renderCaseItem(c);
            });
        }

        sidebarList.innerHTML = itemsHtml;

        // Bind Sidebar Selection Click Events
        sidebarList.querySelectorAll('.hearing-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const caseNo = e.currentTarget.getAttribute('data-case');
                state.selectedCaseNumber = caseNo;
                // Automatically switch active mobile view to details
                state.judgeActiveMobileTab = 'details';
                onUpdate();
            });
        });
    },

    renderCaseDetail(detailContainer, c, state, onUpdate) {
        if (!c) {
            detailContainer.innerHTML = `
                <div class="card" style="padding: 40px; text-align: center;">
                    <h3 style="font-family: var(--font-headings); font-size: 24px; color:#555;">No Bail Application Active</h3>
                    <p style="color:#888; font-size:14px; margin-top:10px;">Please register an application inside the Court Staff portal first.</p>
                </div>
            `;
            return;
        }

        // Define Conic Gauge Color and Percent for Checked Risk
        const riskScore = c.checks.risk.score;
        let riskColor = 'var(--color-success)';
        if (riskScore > 60) riskColor = 'var(--color-danger)';
        else if (riskScore > 30) riskColor = 'var(--color-warning)';

        const avgItr = c.checks.finance.metrics.avgItr || 0;
        const avgBalance = c.checks.finance.metrics.liquidAssets || 0;
        const proposedBail = parseFloat(c.proposedBailAmount || 50000);

        detailContainer.innerHTML = `
            <!-- Top Summary Card -->
            <div class="card" style="margin-bottom: 20px; border-top: 3px solid var(--color-gold);">
                <div class="card-body" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
                    <div>
                        <h3 style="font-size:22px; color:var(--color-navy); font-family: var(--font-headings);">${state.translate('Accused', 'आरोपी')}: ${c.accused.fullName}</h3>
                        <p style="font-size:13px; color:#666; font-family:var(--font-mono); margin-top:2px;">
                            CASE NO: ${c.caseNumber} | FIR NO: ${c.firNumber} | CHARGES: ${c.ipcSections}
                        </p>
                    </div>
                    <div style="display:flex; gap:12px; align-items:center;">
                        <span class="badge ${c.checks.identity.status === 'GREEN' ? 'badge-green' : 'badge-red'}">
                            ID: ${c.checks.identity.status === 'GREEN' ? 'Verified' : 'Flagged Warning'}
                        </span>
                        <span class="badge ${c.checks.risk.riskLevel === 'LOW' ? 'badge-green' : c.checks.risk.riskLevel === 'MEDIUM' ? 'badge-yellow' : 'badge-red'}">
                            Risk: ${c.checks.risk.riskLevel}
                        </span>
                        <button class="btn btn-primary" id="btn-view-docket-reports" style="padding:6px 12px; font-size:12px; display:flex; align-items:center; gap:6px;">
                            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                            <span>Case Docket Reports</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- THREE PANELS SECTION -->
            <div class="case-panels-layout">
                <!-- PANEL 1: ACCUSED INFORMATION -->
                <div class="panel-col">
                    <div class="panel-inner">
                        <div class="panel-header" style="display:flex; align-items:center; gap:6px;">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            <span>Accused Verification</span>
                        </div>
                        <div class="panel-body">
                            <div class="info-item">
                                <label>${state.translate("Father's Name", 'पिता का नाम')}</label>
                                <div class="val">${c.accused.fathersName}</div>
                            </div>
                            <div class="info-item">
                                <label>${state.translate('Aadhaar / PAN Numbers', 'आधार / पैन विवरण')}</label>
                                <div class="val code">${c.accused.aadhaarNumber.substring(0,4)}-XXXX-XXXX | ${c.accused.panNumber}</div>
                            </div>
                            <div class="info-item">
                                <label>${state.translate('Residential Ties', 'आवासीय संबंध')}</label>
                                <div class="val" style="font-size:12.5px;">${c.accused.address}</div>
                            </div>
                            <div class="info-item">
                                <label>eCourts Litigation Archive</label>
                                <div class="val" style="color:var(--color-navy-light); font-size:13px; display:flex; align-items:center; gap:4px;">
                                    <span>Active trials in ${c.accused.ncrbCount} registered court(s).</span>
                                </div>
                            </div>
                            <div class="info-item no-border">
                                <label>Immigration Flight Watch</label>
                                <div class="val">
                                    ${c.accused.travelRestricted 
                                        ? '<span style="color:var(--color-danger); font-weight:700;">FLIGHT RISK ACTIVE</span>' 
                                        : '<span style="color:var(--color-success);">✓ No active passport flags</span>'
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- PANEL 2: SURETY DETAILS -->
                <div class="panel-col">
                    <div class="panel-inner">
                        <div class="panel-header" style="display:flex; align-items:center; gap:6px;">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                            <span>Surety & Property Credentials</span>
                        </div>
                        <div class="panel-body">
                            <div class="info-item">
                                <label>Surety Person Name & Relation</label>
                                <div class="val">${c.surety.fullName} (${c.surety.relationToAccused})</div>
                            </div>
                            <div class="info-item">
                                <label>Verified ITR & Income</label>
                                <div class="val" style="font-family:var(--font-mono);">Average Annual ITR: ₹${avgItr.toLocaleString('en-IN')}</div>
                            </div>
                            <div class="info-item">
                                <label>Cross-Court Guarantees Active</label>
                                <div class="val">
                                    ${c.surety.activeBailCount} Active Guarantees 
                                    <span style="font-size:11px; font-weight:normal; color:#666;">(Limit: 2)</span>
                                </div>
                            </div>
                            <div class="info-item">
                                <label>Pledged Property Title (Webland API)</label>
                                <div class="val" style="font-size:12.5px;">
                                    Survey No: ${c.surety.surveyNumber || 'RS-104/12-C'}<br/>
                                    Valuation: <strong style="font-family:var(--font-mono);">₹${parseFloat(c.surety.propertyValuation || 0).toLocaleString('en-IN')}</strong>
                                </div>
                            </div>
                            <div class="info-item no-border">
                                <label>Property Mutation Status</label>
                                <div class="val">
                                    ${c.surety.mutationStatus === 'COMPLETED' 
                                        ? '<span class="badge badge-green">✓ ACTIVE BAIL ENCUMBRANCE MUTATED</span>' 
                                        : '<span class="badge badge-yellow"> AWAITING ENCUMBRANCE MUTATION</span>'
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- PANEL 3: RISK SCORE & RECOMMENDATION -->
                <div class="panel-col">
                    <div class="panel-inner" style="border: 2px solid var(--color-gold);">
                        <div class="panel-header" style="background-color: var(--color-navy); color: var(--color-gold-light); display:flex; align-items:center; gap:6px;">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line></svg>
                            <span>Quantex Smart Decision Advice</span>
                        </div>
                        <div class="panel-body">
                            <!-- Circular Conic Gauge -->
                            <div class="gauge-container" style="--gauge-color: ${riskColor}; --gauge-percent: ${riskScore}%;">
                                <div class="gauge-circle">
                                    <div class="gauge-inner-white">
                                        <span class="gauge-value">${riskScore}</span>
                                        <span class="gauge-label">Risk Profile</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Risk details -->
                            <div class="risk-reasons-list">
                                <ul style="margin: 0; padding: 0;">
                                    ${c.checks.risk.reasons.map(r => `<li>${r}</li>`).join('')}
                                </ul>
                            </div>
                            
                            <!-- Bilingual recommendation output -->
                            <div style="margin-top:14px; border-top: 1px dashed #ccc; padding-top: 12px;">
                                <label style="font-size:11px; text-transform:uppercase; font-weight:700; color:#666;">System Recommendation</label>
                                <div style="font-size:16px; font-weight:700; color:${riskColor}; margin-top:4px; font-family: var(--font-headings);">
                                    ${c.checks.recommendation.verdict.replace(/_/g, ' ')}
                                </div>
                                <div style="font-size:12.5px; line-height:1.4; color:var(--color-text-main); margin-top:6px; font-style:italic; background:rgba(201, 168, 76, 0.08); padding:8px; border-radius:4px; border: 1px solid rgba(201, 168, 76, 0.15); border-left: 3px solid var(--color-gold);">
                                    ${state.translate(c.checks.recommendation.reasoningEn, c.checks.recommendation.reasoningHi)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- LEGAL ARGUMENTS PANEL -->
            <div class="arguments-box">
                <div class="arg-side arg-prosecution">
                    <h4>Prosecution Objections</h4>
                    <p style="font-style: italic;">"${c.arguments.prosecution || 'No objections filed by the State.'}"</p>
                </div>
                <div class="arg-side arg-defence">
                    <h4>Defence Lawyer Arguments</h4>
                    <p style="font-style: italic;">"${c.arguments.defence || 'No defence plea submitted.'}"</p>
                </div>
            </div>

            <!-- COMPARABLE PAST CASES REFERENCE -->
            <div class="card" style="margin-bottom: 20px;">
                <div class="card-header" style="background-color: var(--color-navy-light); cursor:pointer; display:flex; justify-content:space-between; align-items:center;" id="toggle-past-cases">
                    <h3 style="display:flex; align-items:center; gap:8px;">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                        <span>Comparable Judicial Past Precedents (AP High Court / Supreme Court Reference)</span>
                    </h3>
                    <span>▼ Expand Reference Registry</span>
                </div>
                <div class="card-body" id="past-cases-panel" style="display:none;">
                    <div class="comparable-cases-list">
                        <div class="comp-case-item">
                            <div class="comp-case-header">
                                <span>SC/142/2024 - State of AP vs. Venkatesulu G.</span>
                                <span style="color:var(--color-success);">GRANTED WITH WEEKLY POLICE REPORTING</span>
                            </div>
                            <div class="comp-case-body">
                                <strong>Held:</strong> The accused had recovery completed, steady community roots, and verified individual surety. Granted bail on a ₹40,000 bond subject to surrendering travel certificates and biometric counter verification.
                            </div>
                        </div>
                        <div class="comp-case-item">
                            <div class="comp-case-header">
                                <span>SC/98/2025 - State vs. R. K. Naidu (Rajamundry Mandal)</span>
                                <span style="color:var(--color-danger);">DENIED (IMMEDIATE REMAND)</span>
                            </div>
                            <div class="comp-case-body">
                                <strong>Held:</strong> High severity of IPC charges (411/379) with prior absconding records flagged by local police intelligence. The court held that pretrial detention was necessary to prevent tampering and flight.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ADJUDICATION ACTIONS BAR -->
            <div class="adjudication-bar">
                <div class="adjudication-header">
                    <h3 style="display:flex; align-items:center; gap:8px;">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><line x1="12" y1="2" x2="12" y2="22"></line><line x1="5" y1="7" x2="19" y2="7"></line><path d="M5 7l3 6h6l3-6"></path><path d="M15 13a3 3 0 0 1-6 0"></path></svg>
                        <span>Judicial Adjudication Portal</span>
                    </h3>
                    <p class="encrypted-auth-label" style="font-size:12px; font-family: var(--font-mono); font-weight:700;">PRECEDING JUDGE ENCRYPTED AUTHORIZATION</p>
                </div>
                
                <div class="adjudication-options">
                    <button class="adjudication-btn adj-grant ${c.orderStatus === 'GRANTED' ? 'selected' : ''}" data-decision="GRANTED" style="display:flex; align-items:center; justify-content:center;">
                        <span style="display:inline-block; width:8px; height:8px; background-color:var(--color-success); border-radius:50%; margin-right:8px; vertical-align:middle;"></span>
                        <span>${state.translate('GRANT BAIL', 'ज़मानत मंज़ूर करें')}</span>
                    </button>
                    <button class="adjudication-btn adj-grant-cond ${c.orderStatus === 'GRANTED_WITH_CONDITIONS' ? 'selected' : ''}" data-decision="GRANTED_WITH_CONDITIONS" style="display:flex; align-items:center; justify-content:center;">
                        <span style="display:inline-block; width:8px; height:8px; background-color:var(--color-warning); border-radius:50%; margin-right:8px; vertical-align:middle;"></span>
                        <span>${state.translate('GRANT WITH CONDITIONS', 'शर्तों के साथ ज़मानत मंज़ूर')}</span>
                    </button>
                    <button class="adjudication-btn adj-deny ${c.orderStatus === 'DENIED' ? 'selected' : ''}" data-decision="DENIED" style="display:flex; align-items:center; justify-content:center;">
                        <span style="display:inline-block; width:8px; height:8px; background-color:var(--color-danger); border-radius:50%; margin-right:8px; vertical-align:middle;"></span>
                        <span>${state.translate('DENY BAIL', 'ज़मानत खारिज करें')}</span>
                    </button>
                    <button class="adjudication-btn adj-adjourn ${c.orderStatus === 'ADJOURNED' ? 'selected' : ''}" data-decision="ADJOURNED" style="display:flex; align-items:center; justify-content:center;">
                        <span style="display:inline-block; width:8px; height:8px; background-color:var(--color-text-muted); border-radius:50%; margin-right:8px; vertical-align:middle;"></span>
                        <span>${state.translate('ADJOURN HEARING', 'सुनवाई स्थगित करें')}</span>
                    </button>
                </div>
                
                <div class="form-group" style="margin-top:10px;">
                    <label style="color:var(--color-text-muted); font-size:12px; margin-bottom:8px; display:block;">Custom Reporting Conditions & Judicial Remarks</label>
                    <textarea class="form-input" id="judge-decision-remarks" rows="3" style="border-color:var(--color-gold); resize:vertical;" placeholder="Write custom conditions here. Example: Accused to appear at Rajamundry Urban Police Station every Monday. Passport to be deposited inside Court registry locker.">${c.judgeRemarks || ''}</textarea>
                </div>
                
                <div class="signature-section">
                    <div class="signature-box ${c.digitalSignature ? 'signed' : ''}" id="judge-signature-pad">
                        <span class="signature-text" id="judge-sig-font">${state.translate('J. Kameswara Rao', 'जे. कामेश्वर राव')}</span>
                    </div>
                    <div style="flex:1;">
                        <h4 style="color:var(--color-gold-light); font-size:14px; font-family: var(--font-headings);">Encrypted Digital e-Sign Panel</h4>
                        <p style="font-size:11.5px; color:#aaa; margin-top:4px;">
                            ${state.translate('Click on the signature box above to affix your digital e-Sign.', 'अपना डिजिटल ई-हस्ताक्षर लगाने के लिए ऊपर दिए गए हस्ताक्षर बॉक्स पर क्लिक करें।')}
                        </p>
                        <!-- High Visibility e-Sign Reminder -->
                        <p id="judge-esign-reminder" style="font-size:11px; color:${c.digitalSignature ? 'var(--color-success)' : 'var(--color-warning)'}; font-weight:700; margin-top:6px; display:flex; align-items:center; gap:4px;">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:middle; color:var(--color-danger); margin-right:2px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                            <span>${c.digitalSignature 
                                ? state.translate('✓ Digital e-Sign affixed. Ready for submission.', '✓ डिजिटल ई-हस्ताक्षर लगाया गया। प्रस्तुत करने के लिए तैयार।') 
                                : state.translate('Reminder: You must click the signature box to e-Sign before submitting the verdict.', 'अनुस्मारक: निर्णय प्रस्तुत करने से पहले आपको ई-हस्ताक्षर के लिए हस्ताक्षर बॉक्स पर क्लिक करना होगा।')
                            }</span>
                        </p>
                    </div>
                </div>

                <!-- Submit Verdict Button -->
                <div style="margin-top: 14px;">
                    <button class="btn btn-success" id="btn-submit-verdict" style="padding: 12px; font-size: 14px; font-weight: 700; width:100%; display:flex; align-items:center; justify-content:center; gap:8px; transition:all 0.2s ease; ${c.digitalSignature ? 'background-color: var(--color-success); cursor:pointer;' : 'background-color: rgba(255,255,255,0.05); color:#666; border-color:var(--color-border); cursor:not-allowed;'}" ${c.digitalSignature ? '' : 'disabled'}>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle; margin-right:4px;"><path d="M12 2v20M5 7h14M5 7L3 13h4L5 7zm14 0l-2 6h4l-2-6zM12 22h6M12 22H6"/></svg>
                        <span>${state.translate('SUBMIT FINAL COURT VERDICT', 'न्यायालय का अंतिम निर्णय प्रस्तुत करें')}</span>
                    </button>
                </div>
            </div>
        `;

        // Interactive Past Cases Toggle
        const toggleBtn = detailContainer.querySelector('#toggle-past-cases');
        const pastCasesPanel = detailContainer.querySelector('#past-cases-panel');
        toggleBtn.addEventListener('click', () => {
            if (pastCasesPanel.style.display === 'none') {
                pastCasesPanel.style.display = 'block';
                toggleBtn.querySelector('span').innerText = '▲ Collapse Reference Registry';
            } else {
                pastCasesPanel.style.display = 'none';
                toggleBtn.querySelector('span').innerText = '▼ Expand Reference Registry';
            }
        });

        // Decision Option Selection
        let selectedDecision = c.orderStatus !== 'PENDING' ? c.orderStatus : '';
        detailContainer.querySelectorAll('.adjudication-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                detailContainer.querySelectorAll('.adjudication-btn').forEach(b => b.classList.remove('selected'));
                e.currentTarget.classList.add('selected');
                selectedDecision = e.currentTarget.getAttribute('data-decision');
            });
        });

        // Interactive e-Sign Activation & Adjudication confirmation
        const sigPad = detailContainer.querySelector('#judge-signature-pad');
        const remarksBox = detailContainer.querySelector('#judge-decision-remarks');
        const submitBtn = detailContainer.querySelector('#btn-submit-verdict');
        const esignReminder = detailContainer.querySelector('#judge-esign-reminder');
        
        let hasEsign = c.digitalSignature ? true : false;

        sigPad.addEventListener('click', () => {
            if (!selectedDecision) {
                alert('Please select an adjudication directive (Grant Bail, Grant with Conditions, or Deny) before signing the order.');
                return;
            }

            if (hasEsign || sigPad.classList.contains('signed')) {
                alert('Digital signature is already affixed.');
                return;
            }

            sigPad.classList.add('signed');
            hasEsign = true;

            // Update UI elements to show e-Sign is active and ready for submission
            esignReminder.style.color = 'var(--color-success)';
            esignReminder.innerHTML = `
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" style="vertical-align:middle; color:var(--color-success); margin-right:4px;"><polyline points="20 6 9 17 4 12"/></svg>
                <span>${state.translate('✓ Digital e-Sign affixed. Ready for submission.', '✓ डिजिटल ई-हस्ताक्षर लगाया गया। प्रस्तुत करने के लिए तैयार।')}</span>
            `;

            submitBtn.disabled = false;
            submitBtn.style.backgroundColor = 'var(--color-success)';
            submitBtn.style.color = '#ffffff';
            submitBtn.style.cursor = 'pointer';

            // Custom secure reminder alert
            alert(state.translate(
                "Encrypted Digital e-Sign affixed successfully!\n\n⚠️ IMPORTANT REMINDER: The verdict is NOT submitted yet. You must now click the 'SUBMIT FINAL COURT VERDICT' button below to finalize and transmit the judicial decree.",
                "एन्क्रिप्टेड डिजिटल ई-हस्ताक्षर सफलतापूर्वक लगाया गया!\n\n⚠️ महत्वपूर्ण अनुस्मारक: निर्णय अभी तक प्रस्तुत नहीं किया गया है। न्यायिक डिक्री को अंतिम रूप देने और प्रेषित करने के लिए अब आपको नीचे दिए गए 'न्यायालय का अंतिम निर्णय प्रस्तुत करें' बटन पर क्लिक करना होगा।"
            ));
        });

        submitBtn.addEventListener('click', () => {
            if (!selectedDecision) {
                alert('Please select an adjudication directive first.');
                return;
            }

            if (!hasEsign) {
                alert(state.translate(
                    'Access Denied: You must affix your digital e-Sign by clicking the signature box before submitting the final verdict.',
                    'पहुंच अस्वीकृत: अंतिम निर्णय प्रस्तुत करने से पहले आपको हस्ताक्षर बॉक्स पर क्लिक करके अपना डिजिटल ई-हस्ताक्षर लगाना होगा।'
                ));
                return;
            }

            // Execute final submission
            c.orderStatus = selectedDecision;
            c.judgeRemarks = remarksBox.value;
            const signatureHash = `SHA-256/${Math.floor(100000 + Math.random() * 900000)}/ENC-J-KAMESWARA`;
            c.digitalSignature = signatureHash;
            
            if (selectedDecision === 'GRANTED' || selectedDecision === 'GRANTED_WITH_CONDITIONS') {
                c.currentStatus = 'Completed';
                c.surety.mutationStatus = 'COMPLETED'; // Land mutated instantly
            } else {
                c.currentStatus = 'Completed';
            }
            
            state.saveDatabase();
            
            // Create a gorgeous custom submission confirmation modal
            const confModal = document.createElement('div');
            confModal.className = 'modal-overlay';
            confModal.style.zIndex = '1000';
            
            const directiveTextEn = selectedDecision.replace(/_/g, ' ');
            const directiveTextHi = selectedDecision === 'GRANTED' ? 'ज़मानत मंज़ूर की गई'
                : selectedDecision === 'GRANTED_WITH_CONDITIONS' ? 'शर्तों के साथ ज़मानत मंज़ूर'
                : selectedDecision === 'DENIED' ? 'ज़मानत खारिज की गई' : 'सुनवाई स्थगित की गई';

            confModal.innerHTML = `
                <div class="modal-content-container" style="max-width: 550px; border-top: 4px solid var(--color-success); border-radius:12px; overflow:hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
                    <div style="padding: 24px; text-align: center; background-color: var(--color-header-dark);">
                        <div class="gov-emblem-badge" style="width: 56px; height: 56px; margin: 0 auto 14px auto; background: radial-gradient(circle, rgba(74, 222, 128, 0.15) 0%, rgba(74, 222, 128, 0.02) 100%); border-color:var(--color-success); display:inline-flex; align-items:center; justify-content:center;">
                            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--color-success)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        <h3 style="font-size:20px; font-weight:700; color:#ffffff; font-family: var(--font-headings);">${state.translate('COURT VERDICT SECURELY TRANSMITTED', 'न्यायालय का निर्णय सुरक्षित रूप से प्रेषित')}</h3>
                        <p style="font-size:12px; color:var(--color-success); font-family: var(--font-mono); margin-top:4px; font-weight:700;">CRYPTOGRAPHIC DISPATCH CONFIRMED</p>
                    </div>
                    
                    <div style="padding: 24px; background-color: var(--color-bg-dark); text-align: left;">
                        <div style="display:flex; flex-direction:column; gap:12px; font-size:13.5px; border-bottom: 1px dashed var(--color-border); padding-bottom: 16px; margin-bottom: 16px;">
                            <div style="display:flex; justify-content:space-between;"><span style="color:var(--color-text-muted);">Case Number:</span><strong style="font-family:var(--font-mono); color:var(--color-text-main);">${c.caseNumber}</strong></div>
                            <div style="display:flex; justify-content:space-between;"><span style="color:var(--color-text-muted);">Accused Name:</span><strong style="color:var(--color-text-main);">${c.accused.fullName}</strong></div>
                            <div style="display:flex; justify-content:space-between;"><span style="color:var(--color-text-muted);">Judicial Order:</span><strong style="color:var(--color-success); text-transform:uppercase;">${state.translate(directiveTextEn, directiveTextHi)}</strong></div>
                            <div style="display:flex; justify-content:space-between; align-items:center;"><span style="color:var(--color-text-muted);">Secure Signature Hash:</span><span style="font-family:var(--font-mono); font-size:11px; background:rgba(255,255,255,0.05); padding:2px 6px; border-radius:4px; color:var(--color-gold-light);">${signatureHash}</span></div>
                        </div>

                        <h4 style="font-size:12.5px; font-weight:700; color:var(--color-gold-light); margin-bottom:10px; text-transform:uppercase; letter-spacing:0.5px;">Executed Instant Directives:</h4>
                        <div style="display:flex; flex-direction:column; gap:10px; font-size:12px; background:rgba(255,255,255,0.02); padding:12px; border-radius:6px; border:1px solid var(--color-border);">
                            <div style="display:flex; align-items:center; gap:8px;"><span style="color:var(--color-success); font-weight:bold;">✓</span><span style="color:var(--color-text-main);"><strong>Rajamundry Central Jail API:</strong> secure remand release dispatch compiled & transmitted.</span></div>
                            <div style="display:flex; align-items:center; gap:8px;"><span style="color:var(--color-success); font-weight:bold;">✓</span><span style="color:var(--color-text-main);"><strong>AP Police Crimes Network:</strong> local station bail reporting schedule created automatically.</span></div>
                            <div style="display:flex; align-items:center; gap:8px;"><span style="color:var(--color-success); font-weight:bold;">✓</span><span style="color:var(--color-text-main);"><strong>Webland Revenue Mandal Registry:</strong> surety land encumbrance mutated instantly and locked.</span></div>
                        </div>

                        <button id="btn-close-verdict-modal" class="btn btn-success" style="width:100%; margin-top:20px; padding:12px; font-size:14px; font-weight:700; color:#ffffff; cursor:pointer;">
                            ${state.translate('Close & Return to Hearings Board', 'बंद करें और सुनवाई बोर्ड पर वापस जाएं')}
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(confModal);
            
            confModal.querySelector('#btn-close-verdict-modal').addEventListener('click', () => {
                confModal.remove();
                // Select the next pending case if available, else stay on current
                const nextPending = state.cases.find(caseItem => caseItem.orderStatus === 'PENDING');
                if (nextPending) {
                    state.selectedCaseNumber = nextPending.caseNumber;
                }
                // Switch mobile tab back to listings so they can pick another case
                state.judgeActiveMobileTab = 'listings';
                onUpdate();
            });
        });

        // Dock View Report selector Modal
        detailContainer.querySelector('#btn-view-docket-reports').addEventListener('click', () => {
            state.openReportViewer(c);
        });
    }
};
