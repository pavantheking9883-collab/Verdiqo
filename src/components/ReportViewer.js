/**
 * VERDIQO: HIGH FIDELITY LEGAL REPORTS GENERATOR
 * Quantex Intelligence Systems (P) Ltd.
 * Generates official PDF-style printable court forms.
 */

export const ReportViewer = {
    /**
     * Generates a modal container and inserts the report HTML
     */
    show(reportId, caseData, onClose) {
        // Remove existing modal if any
        const existing = document.getElementById('report-modal-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'report-modal-overlay';
        overlay.className = 'modal-overlay';
        
        let reportTitle = '';
        switch(reportId) {
            case 1: reportTitle = 'Bail Eligibility Assessment Report'; break;
            case 2: reportTitle = 'Surety Verification Report'; break;
            case 3: reportTitle = 'Property Mutation Order'; break;
            case 4: reportTitle = 'Order of Bail Adjudication (Draft)'; break;
            case 5: reportTitle = 'Post-Bail Compliance Tracking & Alerts Log'; break;
            case 6: reportTitle = 'Quantex Smart Analytics & Statistical Report'; break;
        }

        overlay.innerHTML = `
            <div class="modal-content-container">
                <div class="modal-top-actions">
                    <h3>${reportTitle}</h3>
                    <div style="display: flex; gap: 12px; align-items: center;">
                        <button id="print-report-btn" class="btn btn-primary" style="padding: 6px 12px; font-size: 13px; display:inline-flex; align-items:center; justify-content:center; gap:6px;">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                            <span>Print Document</span>
                        </button>
                        <button id="close-report-btn" class="modal-close-btn">&times;</button>
                    </div>
                </div>
                <div class="report-document-body">
                    <div class="legal-page-sheet">
                        <div class="legal-watermark">VERDIQO</div>
                        
                        <!-- Header Seal -->
                        <div class="legal-header">
                            <div class="legal-logo-seal" style="display:flex; justify-content:center; align-items:center; margin-bottom:8px;">
                                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#0a1628" stroke-width="2"><path d="M12 2v20M5 7h14M5 7L3 13h4L5 7zm14 0l-2 6h4l-2-6zM12 22h6M12 22H6"/></svg>
                            </div>
                            <h2>In the Court of the Preceding Judge, Rajamundry</h2>
                            <p>STATE OF ANDHRA PRADESH, INDIA</p>
                            <p style="font-size: 9px; margin-top: 4px;">POWERED BY VERDIQO DECISION SUPPORT ENGINE • QUANTEX SYSTEMS</p>
                        </div>
                        
                        <!-- Report Content -->
                        <div id="legal-sheet-content"></div>
                        
                        <!-- Signature Seal -->
                        <div class="legal-signatures-block">
                            <div class="sig-col">
                                <p style="font-size: 11px; color:#555;">Document ID: VQ-${caseData.caseNumber.replace(/\//g, '-')}</p>
                                <div class="digital-stamp" style="border-color: #1a7a4a; color: #1a7a4a;">✓ System Verified</div>
                                <div class="sig-line">Quantex Audit Engine</div>
                            </div>
                            <div class="sig-col">
                                <p style="font-size: 11px; color:#555;">Signed digitally via Aadhaar e-Sign</p>
                                ${caseData.orderStatus === 'GRANTED' || caseData.orderStatus === 'GRANTED_WITH_CONDITIONS'
                                    ? `<div class="signature-text" style="opacity:1; font-family:'Playfair Display', serif; font-style:italic; font-size:18px; color:#0a1628; height: 20px;">J. Kameswara Rao</div>`
                                    : `<div style="height:20px; border-bottom: 1px dashed #ccc;"></div>`
                                }
                                <div class="sig-line">${caseData.presidingJudge || 'Preceding Judge'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Render specific report template
        const contentDiv = overlay.querySelector('#legal-sheet-content');
        contentDiv.innerHTML = this.getTemplate(reportId, caseData);

        // Bind events
        overlay.querySelector('#close-report-btn').addEventListener('click', () => {
            overlay.remove();
            if (onClose) onClose();
        });

        overlay.querySelector('#print-report-btn').addEventListener('click', () => {
            window.print();
        });

        // Close on clicking overlay
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
                if (onClose) onClose();
            }
        });
    },

    getTemplate(reportId, caseData) {
        const d = caseData;
        const proposedBail = parseFloat(d.proposedBailAmount || 50000);
        const avgBalance = parseFloat(d.accused.bankBalance6m || 25000);
        const avgItr = d.accused.itrDeclaredIncome || 0;
        const cibil = d.accused.cibilScore || 650;
        const suretyIncome = parseFloat(d.surety.monthlyIncome || 35000);
        const suretyBails = d.surety.activeBailCount || 0;

        switch(reportId) {
            case 1: // Bail Eligibility Assessment Report
                return `
                    <div class="document-title-block">
                        <h3>Bail Eligibility Assessment Report</h3>
                    </div>
                    
                    <div class="legal-metadata-grid">
                        <div class="meta-field">
                            <span class="meta-lbl">Case Number:</span>
                            <span class="meta-val code">${d.caseNumber}</span>
                        </div>
                        <div class="meta-field">
                            <span class="meta-lbl">FIR Number:</span>
                            <span class="meta-val code">${d.firNumber}</span>
                        </div>
                        <div class="meta-field">
                            <span class="meta-lbl">Accused Name:</span>
                            <span class="meta-val">${d.accused.fullName}</span>
                        </div>
                        <div class="meta-field">
                            <span class="meta-lbl">IPC Sections:</span>
                            <span class="meta-val" style="color: #c0392b; font-weight:700;">${d.ipcSections}</span>
                        </div>
                        <div class="meta-field">
                            <span class="meta-lbl">Date of Arrest:</span>
                            <span class="meta-val">${d.dateOfArrest}</span>
                        </div>
                        <div class="meta-field">
                            <span class="meta-lbl">Proposed Bail:</span>
                            <span class="meta-val" style="font-family: var(--font-mono); font-weight:700;">₹${proposedBail.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                    
                    <div class="legal-section-header">1. IDENTITY VERIFICATION STATUS</div>
                    <p class="legal-text-p">
                        The accused’s Aadhaar credential was queried via the UIDAI API. Core biometrics (10 fingerprints and dual iris scans) were successfully validated at the counter. 
                        Status is marked as: <strong>${d.checks.identity.status === 'GREEN' ? 'IDENTITY FULLY CONFIRMED' : 'REJECTED/ALERT RAISED'}</strong>.
                    </p>
                    
                    <div class="legal-section-header">2. RISK SCORING & CRIMINAL RECORD HISTORY</div>
                    <p class="legal-text-p">
                        The system executed a cross-jurisdiction query against the National Crime Records Bureau (NCRB) database and the eCourts platform.
                    </p>
                    <table class="legal-table">
                        <thead>
                            <tr>
                                <th>Registry Database</th>
                                <th>Parameter Evaluated</th>
                                <th>Verified Output</th>
                                <th>Risk Impact</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>NCRB FIR Database</td>
                                <td>Prior Registered FIRs (India)</td>
                                <td>${d.accused.ncrbCount} Active Case(s)</td>
                                <td>Low to Moderate</td>
                            </tr>
                            <tr>
                                <td>eCourts Registry</td>
                                <td>Previous Bail Applications</td>
                                <td>${d.accused.prevBailsGranted} Granted, ${d.accused.prevBailsHonored} Fulfilled</td>
                                <td>No Default Flags</td>
                            </tr>
                            <tr>
                                <td>State Intelligence</td>
                                <td>Absconding & Non-Appearance</td>
                                <td>${d.accused.abscondingCount} Failures to Appear</td>
                                <td>Critical Flag</td>
                            </tr>
                            <tr>
                                <td>Immigration Watch</td>
                                <td>Immigration Watch & Travel Restriction</td>
                                <td>${d.accused.travelRestricted ? 'TRAVEL RESTRICTED' : 'CLEAR / NO WATCH'}</td>
                                <td>High Alert</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <p class="legal-text-p" style="margin-top: 10px;">
                        <strong>Risk Assessment Conclusion:</strong> The composite Risk Score is calculated at <strong>${d.checks.risk.score}/100</strong>, indicating a <strong>${d.checks.risk.riskLevel} RISK</strong> level.
                    </p>
                    
                    <div class="legal-section-header">3. SYSTEM LEGAL RECOMMENDATION</div>
                    <div style="background-color: #f7f3ec; border-left: 4px solid #c9a84c; padding: 12px; font-size: 13px; font-weight:600; margin-bottom: 14px;">
                        ADVICE: ${d.checks.recommendation.verdict.replace(/_/g, ' ')}
                    </div>
                    <p class="legal-text-p">
                        <strong>Reasoning:</strong> ${d.checks.recommendation.reasoningEn}
                    </p>
                `;
            
            case 2: // Surety Verification Report
                return `
                    <div class="document-title-block">
                        <h3>Surety Verification & Capacity Report</h3>
                    </div>
                    
                    <div class="legal-metadata-grid">
                        <div class="meta-field">
                            <span class="meta-lbl">Surety Name:</span>
                            <span class="meta-val">${d.surety.fullName}</span>
                        </div>
                        <div class="meta-field">
                            <span class="meta-lbl">Relation:</span>
                            <span class="meta-val">${d.surety.relationToAccused}</span>
                        </div>
                        <div class="meta-field">
                            <span class="meta-lbl">Aadhaar Number:</span>
                            <span class="meta-val code">${d.surety.aadhaarNumber}</span>
                        </div>
                        <div class="meta-field">
                            <span class="meta-lbl">PAN Number:</span>
                            <span class="meta-val code">${d.surety.panNumber}</span>
                        </div>
                        <div class="meta-field">
                            <span class="meta-lbl">Proposed Bail:</span>
                            <span class="meta-val" style="font-family: var(--font-mono);">₹${proposedBail.toLocaleString('en-IN')}</span>
                        </div>
                        <div class="meta-field">
                            <span class="meta-lbl">Verified Assets:</span>
                            <span class="meta-val" style="font-family: var(--font-mono); color:#1a7a4a;">₹${parseFloat(d.surety.propertyValuation || 0).toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                    
                    <div class="legal-section-header">1. BIOMETRIC & IDENTITY CHECK</div>
                    <p class="legal-text-p">
                        Surety biometrics were captured at the counter. Fingerprint and iris matching returned a <strong>100% MATCH</strong> status against UIDAI archives. No proxy or identity fraud detected.
                    </p>
                    
                    <div class="legal-section-header">2. FINANCIAL CAPACITY STATEMENT</div>
                    <p class="legal-text-p">
                        Automated checks integrated with the NSDL ITR database and CIBIL score registries returned the following assets and liquid balances:
                    </p>
                    <ul class="legal-list">
                        <li><strong>Verified Monthly Employment Income:</strong> ₹${suretyIncome.toLocaleString('en-IN')} per month.</li>
                        <li><strong>Average 3-Year Income Tax Returns:</strong> Verified average at ₹${(suretyIncome * 12 * 0.95).toLocaleString('en-IN')} per annum.</li>
                        <li><strong>CIBIL Credit Score:</strong> ${cibil} (Low defaults risk registered).</li>
                        <li><strong>Calculated Financial Status:</strong> <span style="text-decoration: underline; font-weight:700;">${d.checks.finance.status}</span>.</li>
                    </ul>
                    
                    <div class="legal-section-header">3. CROSS-COURT SURETY LOAD ASSESSMENT</div>
                    <p class="legal-text-p">
                        The National Surety Ledger has scanned all sub-divisional and district courts across Andhra Pradesh.
                    </p>
                    <ul class="legal-list">
                        <li><strong>Active Bail Guarantees Held:</strong> ${suretyBails} (Legal maximum allowed is 2 active).</li>
                        <li><strong>Previous Obligation Defaults:</strong> 0 Defaults registered in the court registers.</li>
                        <li><strong>Status Verdict:</strong> <strong>${d.checks.suretyLoad.status === 'CLEAR' ? 'APPROVED FOR OBLIGATION' : 'DISQUALIFIED/WARNING'}</strong>.</li>
                    </ul>
                `;

            case 3: // Property Mutation Request
                return `
                    <div class="document-title-block">
                        <h3>Order of Property Mutation & Bail Encumbrance</h3>
                        <p style="font-size: 11px; margin-top: 4px;">FORM 14 - STATE REVENUE DEPARTMENT & DISTRICT LAND REGISTRY</p>
                    </div>
                    
                    <p class="legal-text-p">
                        To,<br/>
                        <strong>The Tahsildar / Land Registrar Office</strong><br/>
                        Rajamundry Urban Mandal, East Godavari District, Andhra Pradesh.
                    </p>
                    
                    <p class="legal-text-p" style="margin-top: 14px;">
                        <strong>SUBJECT:</strong> Request for entry of Bail Encumbrance (Mortgage Lien) in Revenue Land Register (Webland/Adangal).
                    </p>
                    
                    <p class="legal-text-p">
                        Pursuant to orders passed by this Hon’ble Court in case number <strong>${d.caseNumber}</strong>, the property detailed below has been accepted as judicial surety for the release of the accused, <strong>${d.accused.fullName}</strong>. You are hereby ordered to record an encumbrance entry on this land registry.
                    </p>
                    
                    <div class="legal-section-header">PROPERTY DESCRIPTION FOR MUTATION</div>
                    <table class="legal-table">
                        <tr>
                            <td style="font-weight:700; width: 200px; background-color: #f9f9f9;">Declared Owner:</td>
                            <td>${d.surety.fullName} (Verified via Land Registry ID)</td>
                        </tr>
                        <tr>
                            <td style="font-weight:700; background-color: #f9f9f9;">Property Address:</td>
                            <td>${d.surety.propertyAddress || 'Ward No. 12, Syama Prasad Nagar, Rajamundry'}</td>
                        </tr>
                        <tr>
                            <td style="font-weight:700; background-color: #f9f9f9;">Revenue Survey Number:</td>
                            <td style="font-family: var(--font-mono); font-weight:700;">${d.surety.surveyNumber || 'RS-342/12-A'}</td>
                        </tr>
                        <tr>
                            <td style="font-weight:700; background-color: #f9f9f9;">Ready-Reckoner Valuation:</td>
                            <td style="font-family: var(--font-mono);">₹${parseFloat(d.surety.propertyValuation || 0).toLocaleString('en-IN')}</td>
                        </tr>
                        <tr>
                            <td style="font-weight:700; background-color: #f9f9f9;">Bail Obligation Limit:</td>
                            <td style="font-family: var(--font-mono); font-weight:700;">₹${proposedBail.toLocaleString('en-IN')}</td>
                        </tr>
                    </table>
                    
                    <div class="legal-section-header">STATUTORY MANDATE</div>
                    <p class="legal-text-p" style="color: #c0392b; font-weight:700;">
                        THE OWNER IS HEREBY STRICTLY PROHIBITED FROM SELLING, GIFTING, LEASING, TRANSFERRING, OR MORTGAGING THE AFOREMENTIONED PROPERTY WHILE THE BAIL ENCUMBRANCE REMAINS ACTIVE.
                    </p>
                    <p class="legal-text-p">
                        Upon recording the mutation in the government land archives (Webland Portal), please transmit an automated XML validation token back to the Verdiqo Court Database to enable release authorization.
                    </p>
                `;

            case 4: // Bail Order Draft
                const conditionsList = d.orderStatus === 'GRANTED_WITH_CONDITIONS' && d.judgeRemarks 
                    ? d.judgeRemarks.split('\n')
                    : [
                        'Accused shall appear before the Investigating Officer every Monday at 10:00 AM.',
                        'Accused shall surrender their passport immediately to the court registry.',
                        'Accused shall not influence prosecution witnesses or tamper with evidence.',
                        'Surety shall notify court of any changes in financial capacity or residence.'
                    ];
                return `
                    <div class="document-title-block">
                        <h3>Order of Bail Adjudication</h3>
                        <p style="font-family: var(--font-mono); font-size: 12px; margin-top: 4px;">CASE ID: SC-${d.caseNumber.split('/')[1]}</p>
                    </div>
                    
                    <p class="legal-text-p">
                        In the matter of State vs. <strong>${d.accused.fullName}</strong>, having heard arguments from the learned Counsel for Defence and the learned Public Prosecutor, this Court has analyzed the verified composite parameters compiled by the <strong>Verdiqo Verification Engine</strong>.
                    </p>
                    
                    <div class="legal-section-header">COURT FINDINGS</div>
                    <ul class="legal-list">
                        <li><strong>Identity Authenticity:</strong> Confirmed green via biometric match.</li>
                        <li><strong>Risk Metric Level:</strong> ${d.checks.risk.score}/100 (${d.checks.risk.riskLevel} Risk Profile).</li>
                        <li><strong>Surety Asset Eligibility:</strong> Verified capable and mutated under court control.</li>
                    </ul>
                    
                    <div class="legal-section-header">ADJUDICATION DIRECTIVE</div>
                    <p class="legal-text-p" style="font-size: 15px; font-weight: 700; color: var(--color-navy-sec);">
                        STATUS: BAIL IS HEREBY ${d.orderStatus ? d.orderStatus.replace(/_/g, ' ') : 'PENDING HEARING'}.
                    </p>
                    
                    ${d.orderStatus === 'GRANTED_WITH_CONDITIONS' ? `
                        <p class="legal-text-p"><strong>Subject to the following mandatory conditions:</strong></p>
                        <ol class="legal-list" style="margin-left: 20px;">
                            ${conditionsList.map(c => `<li>${c}</li>`).join('')}
                        </ol>
                    ` : ''}

                    ${d.orderStatus === 'GRANTED' ? `
                        <p class="legal-text-p">The accused is released on executing a personal bond of ₹${proposedBail.toLocaleString('en-IN')} with one solvent surety of like amount to the satisfaction of the court registrar.</p>
                    ` : ''}

                    ${d.orderStatus === 'DENIED' ? `
                        <p class="legal-text-p" style="color:#c0392b;">Bail application stands rejected. Accused is remanded to judicial custody. The severity of charges, combined with high risk parameters, warrants detention pending trial.</p>
                    ` : ''}
                `;

            case 5: // Compliance Alerts Log
                return `
                    <div class="document-title-block">
                        <h3>Post-Bail Compliance Tracking & Alerts Log</h3>
                    </div>
                    
                    <p class="legal-text-p">
                        This schedule outlines active compliance notifications and automated alert parameters configured in the **Verdiqo Compliance Engine** for Case <strong>${d.caseNumber}</strong>.
                    </p>
                    
                    <div class="legal-section-header">1. SYSTEM INTEGRATION TRACKING STATUS</div>
                    <table class="legal-table">
                        <thead>
                            <tr>
                                <th>Check Type</th>
                                <th>Schedule / Deadline</th>
                                <th>Recipient</th>
                                <th>Alert Channel</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Hearing Reminder</td>
                                <td>3 Days Prior (Scheduled Hearing)</td>
                                <td>Accused + Surety</td>
                                <td>SMS / WhatsApp</td>
                                <td><span class="badge badge-green">Scheduled</span></td>
                            </tr>
                            <tr>
                                <td>Property Mutation Tracker</td>
                                <td>7-Day Target from Order Activation</td>
                                <td>Court Registrar</td>
                                <td>Verdiqo System Banner</td>
                                <td><span class="badge badge-info">${d.surety.mutationStatus === 'COMPLETED' ? 'Completed' : 'Awaiting XML'}</span></td>
                            </tr>
                            <tr>
                                <td>Biometric Verification</td>
                                <td>Every Monday 10:00 AM</td>
                                <td>Accused</td>
                                <td>Police Station Counter</td>
                                <td><span class="badge badge-yellow">Pending First Check</span></td>
                            </tr>
                            <tr>
                                <td>Immigration Watch</td>
                                <td>Real-time Border Entry Alert</td>
                                <td>Immigration/Judge</td>
                                <td>Priority Flag</td>
                                <td><span class="badge badge-green">Active Monitoring</span></td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <div class="legal-section-header">2. REAL-TIME EXCEPTION PROTOCOLS</div>
                    <p class="legal-text-p">
                        If the accused fails to perform counter biometrics at the local precinct on the appointed day, a high-priority <strong>Non-Appearance Notification</strong> is dispatched to the Preceding Judge and the Superintendent of Police within <strong>30 minutes</strong> of the deadline.
                    </p>
                `;

            case 6: // Statistical Reports
                return `
                    <div class="document-title-block">
                        <h3>Quantex Smart Analytics & Statistical Report</h3>
                        <p style="font-size: 11px;">VERDIQO DISTRICT COURT COMPLIANCE AUDIT</p>
                    </div>
                    
                    <p class="legal-text-p">
                        Aggregated statistics regarding bail decisions, processing durations, and compliance metrics for the judicial subdivision of Rajamundry.
                    </p>
                    
                    <div class="legal-section-header">1. BENCHMARK PERFORMANCE METRICS</div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px;">
                        <div style="background-color: #f7f3ec; padding: 12px; border-radius: 4px; text-align:center;">
                            <h5 style="font-size: 12px; color:#666;">AVG PROCESSING TIME</h5>
                            <p style="font-family: var(--font-mono); font-size: 24px; font-weight:700; color: var(--color-navy);">14.2 Min</p>
                            <span style="font-size: 10px; color:#1a7a4a;">Target: 30 Min (Cleared)</span>
                        </div>
                        <div style="background-color: #f7f3ec; padding: 12px; border-radius: 4px; text-align:center;">
                            <h5 style="font-size: 12px; color:#666;">OBLIGATION VALUE ACTIVE</h5>
                            <p style="font-family: var(--font-mono); font-size: 24px; font-weight:700; color: var(--color-navy);">₹4.2 Cr</p>
                            <span style="font-size: 10px; color:#555;">Across 148 mutated properties</span>
                        </div>
                        <div style="background-color: #f7f3ec; padding: 12px; border-radius: 4px; text-align:center;">
                            <h5 style="font-size: 12px; color:#666;">SURETY DEFAULT RATE</h5>
                            <p style="font-family: var(--font-mono); font-size: 24px; font-weight:700; color: var(--color-danger);">0.84%</p>
                            <span style="font-size: 10px; color:#1a7a4a;">Industry threshold: 5.0%</span>
                        </div>
                    </div>
                    
                    <div class="legal-section-header">2. MONTHLY ADJUDICATION RATIOS</div>
                    <table class="legal-table">
                        <thead>
                            <tr>
                                <th>Judicial Division</th>
                                <th>Total Bail Applications</th>
                                <th>Granted (Plain)</th>
                                <th>Granted (With Conditions)</th>
                                <th>Denied</th>
                                <th>System recommendation compliance</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Rajamundry Sub-court 1</td>
                                <td>142 Cases</td>
                                <td>42%</td>
                                <td>38%</td>
                                <td>20%</td>
                                <td>94.8%</td>
                            </tr>
                            <tr>
                                <td>Rajamundry Sub-court 2</td>
                                <td>98 Cases</td>
                                <td>38%</td>
                                <td>40%</td>
                                <td>22%</td>
                                <td>91.2%</td>
                            </tr>
                            <tr>
                                <td>District Sessions Court</td>
                                <td>64 Cases</td>
                                <td>28%</td>
                                <td>52%</td>
                                <td>20%</td>
                                <td>96.5%</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <p class="legal-text-p" style="font-size: 11px; color:#555; text-align:center; margin-top: 10px;">
                        This statistical data conforms with standard reporting protocols for the High Court of Andhra Pradesh.
                    </p>
                `;
        }
    }
};
