/**
 * VERDIQO: COURT STAFF DASHBOARD
 * Quantex Intelligence Systems (P) Ltd.
 * Replicates the mockup design specifications exactly.
 */

import { VerificationEngine } from '../utils/verificationEngine.js';

export const DashboardStaff = {
    render(container, state, onUpdate) {
        let activeTab = state.staffActiveTab || 'status'; // Replicating mockup: default to status board tab
        
        container.innerHTML = `
            <div id="staff-tab-content"></div>
        `;

        if (activeTab === 'register') {
            this.renderRegisterForm(container.querySelector('#staff-tab-content'), state, onUpdate);
        } else {
            this.renderStatusBoard(container.querySelector('#staff-tab-content'), state, onUpdate);
        }
    },

    renderRegisterForm(tabContent, state, onUpdate) {
        const caseNoDemo = `BMS/2026/00${Math.floor(43 + Math.random() * 50)}`;
        const firNoDemo = `FIR/${Math.floor(100 + Math.random() * 900)}/2026-RJM`;
        const todayDate = new Date().toISOString().split('T')[0];
        
        tabContent.innerHTML = `
            <div class="dashboard-header-block" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <div class="dashboard-title">
                    <h2 style="display:flex; align-items:center; gap:8px;">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                        <span>${state.translate('New Bail Application Registration', 'नई ज़मानत याचिका पंजीकरण')}</span>
                    </h2>
                    <p>Enter comprehensive case, accused, and surety records securely in the e-Courts ledger</p>
                </div>
                <button class="btn btn-secondary" id="btn-back-to-status">Back to Applications Board</button>
            </div>

            <form id="new-bail-form">
                <!-- SECTION 1: BAIL APPLICATION & CASE DETAILS -->
                <div class="card" style="border-top: 3px solid var(--color-gold);">
                    <div class="card-header">
                        <h3 style="display:flex; align-items:center; gap:6px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                            <span>1. Bail Application & Case Details</span>
                        </h3>
                    </div>
                    <div class="card-body">
                        <div class="form-grid-3">
                            <div class="form-group">
                                <label>Case Number</label>
                                <input type="text" class="form-input code-font" id="case-no" required value="${caseNoDemo}">
                            </div>
                            <div class="form-group">
                                <label>FIR Number</label>
                                <input type="text" class="form-input code-font" id="fir-no" required value="${firNoDemo}">
                            </div>
                            <div class="form-group">
                                <label>Charged IPC/BNS Sections</label>
                                <input type="text" class="form-input" id="case-sections" required value="IPC 420, 468">
                            </div>
                            <div class="form-group">
                                <label>Arrest Date</label>
                                <input type="date" class="form-input" id="case-arrest-date" required value="2026-05-24">
                            </div>
                            <div class="form-group">
                                <label>Investigating Agency / PS Officer</label>
                                <input type="text" class="form-input" id="case-officer" required value="Rajamundry Urban PS, Inspector S. Kumar">
                            </div>
                            <div class="form-group">
                                <label>Application Filing Date</label>
                                <input type="date" class="form-input" id="case-filing-date" required value="${todayDate}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Supporting Documents Submitted</label>
                            <div style="display: flex; gap: 20px; flex-wrap: wrap; margin-top: 8px;">
                                <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; text-transform: none; font-weight: normal; cursor: pointer;">
                                    <input type="checkbox" id="doc-character" checked style="width: 16px; height: 16px; margin: 0;"> Character Certificates (चरित्र प्रमाण पत्र)
                                </label>
                                <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; text-transform: none; font-weight: normal; cursor: pointer;">
                                    <input type="checkbox" id="doc-employment" checked style="width: 16px; height: 16px; margin: 0;"> Employment Letters (रोजगार पत्र)
                                </label>
                                <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; text-transform: none; font-weight: normal; cursor: pointer;">
                                    <input type="checkbox" id="doc-community" checked style="width: 16px; height: 16px; margin: 0;"> Community Ties Evidence (सामुदायिक संबंध साक्ष्य)
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SECTION 2: ACCUSED PERSONAL INFORMATION -->
                <div class="card" style="border-top: 3px solid var(--color-gold);">
                    <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
                        <h3 style="display:flex; align-items:center; gap:6px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            <span>2. Accused Person Details</span>
                        </h3>
                        <button type="button" class="btn btn-primary" id="fill-demo-accused" style="font-size: 11px; padding: 4px 8px;">
                            Autofill Demo Accused Details
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="form-grid-3">
                            <div class="form-group">
                                <label>Full Name</label>
                                <input type="text" class="form-input" id="accused-name" required value="Srinivas Rao Vemuri">
                            </div>
                            <div class="form-group">
                                <label>Father's Name</label>
                                <input type="text" class="form-input" id="accused-father" required value="Satyanarayana Vemuri">
                            </div>
                            <div class="form-group">
                                <label>Date of Birth</label>
                                <input type="date" class="form-input" id="accused-dob" required value="1984-08-15">
                            </div>
                            <div class="form-group">
                                <label>Aadhaar Number</label>
                                <input type="text" class="form-input code-font" id="accused-aadhaar" maxlength="12" required value="123456789012">
                            </div>
                            <div class="form-group">
                                <label>PAN Number</label>
                                <input type="text" class="form-input code-font" id="accused-pan" maxlength="10" required value="VEMUR1984S">
                            </div>
                            <div class="form-group">
                                <label>Mobile Number</label>
                                <input type="text" class="form-input code-font" id="accused-mobile" maxlength="10" required value="9876543210">
                            </div>
                            <div class="form-group">
                                <label>Driving License (DL) Number</label>
                                <input type="text" class="form-input code-font" id="accused-dl" required value="AP05-2026-0042841">
                            </div>
                            <div class="form-group">
                                <label>Passport Number</label>
                                <input type="text" class="form-input code-font" id="accused-passport" required value="U8374928">
                            </div>
                            <div class="form-group">
                                <label>Employment details</label>
                                <input type="text" class="form-input" id="accused-employment" required value="Account Manager, TechSolutions Ltd">
                            </div>
                            <div class="form-group">
                                <label>Monthly Income (₹)</label>
                                <input type="number" class="form-input code-font" id="accused-income" required value="45000">
                            </div>
                            <div class="form-group">
                                <label>Bank Account Information</label>
                                <input type="text" class="form-input code-font" id="accused-bank-account" required value="SBI A/c 38472948274">
                            </div>
                            <div class="form-group">
                                <label>Credit History (CIBIL Score)</label>
                                <input type="number" class="form-input code-font" id="accused-cibil" min="300" max="900" required value="740">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Residential Address</label>
                            <input type="text" class="form-input" id="accused-address" required value="Flat 402, Sai Balaji Residency, Rajamundry, AP">
                        </div>
                        <div class="form-group">
                            <label>Previous Criminal History (NCRB registers)</label>
                            <textarea class="form-input" id="accused-criminal-history" rows="2" placeholder="Detail any prior FIR filings or court convictions...">No active convictions. Zero flight defaults. Cooperative with investigations.</textarea>
                        </div>
                        
                        <div class="form-section-title">Accused Biometric Counter-Capture</div>
                        <div class="biometric-capture-zone">
                            <div class="biometric-box" id="accused-finger-box">
                                <div class="scan-pulse-line"></div>
                                <i class="scanner-icon" style="display:flex; justify-content:center; align-items:center; margin-bottom:8px;">
                                    <svg viewBox="0 0 16 16" width="30" height="30" fill="currentColor" style="color:var(--color-gold);"><path d="M8.06 6.5a.5.5 0 0 1 .5.5v.776a11.5 11.5 0 0 1-.552 3.519l-1.331 4.14a.5.5 0 0 1-.952-.305l1.33-4.141a10.5 10.5 0 0 0 .504-3.213V7a.5.5 0 0 1 .5-.5Z"/><path d="M6.06 7a2 2 0 1 1 4 0 .5.5 0 1 1-1 0 1 1 0 1 0-2 0v.332q0 .613-.066 1.221A.5.5 0 0 1 6 8.447q.06-.555.06-1.115zm3.509 1a.5.5 0 0 1 .487.513 11.5 11.5 0 0 1-.587 3.339l-1.266 3.8a.5.5 0 0 1-.949-.317l1.267-3.8a10.5 10.5 0 0 0 .535-3.048A.5.5 0 0 1 9.569 8m-3.356 2.115a.5.5 0 0 1 .33.626L5.24 14.939a.5.5 0 1 1-.955-.296l1.303-4.199a.5.5 0 0 1 .625-.329"/><path d="M4.759 5.833A3.501 3.501 0 0 1 11.559 7a.5.5 0 0 1-1 0 2.5 2.5 0 0 0-4.857-.833.5.5 0 1 1-.943-.334m.3 1.67a.5.5 0 0 1 .449.546 10.7 10.7 0 0 1-.4 2.031l-1.222 4.072a.5.5 0 1 1-.958-.287L4.15 9.793a9.7 9.7 0 0 0 .363-1.842.5.5 0 0 1 .546-.449Z"/></svg>
                                </i>
                                <span>Scan 10 Fingerprints</span>
                                <div class="scan-status-indicator" id="accused-finger-indicator" style="color:var(--color-danger);">Awaiting Scan</div>
                                <button type="button" class="btn btn-primary" id="btn-scan-accused-finger" style="margin-top:10px; font-size:11px; padding: 4px 10px;">Execute Scan</button>
                            </div>
                            <div class="biometric-box" id="accused-iris-box">
                                <div class="scan-pulse-line"></div>
                                <i class="scanner-icon" style="display:flex; justify-content:center; align-items:center; margin-bottom:8px;">
                                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                </i>
                                <span>Scan Retina (Iris)</span>
                                <div class="scan-status-indicator" id="accused-iris-indicator" style="color:var(--color-danger);">Awaiting Scan</div>
                                <button type="button" class="btn btn-primary" id="btn-scan-accused-iris" style="margin-top:10px; font-size:11px; padding: 4px 10px;">Execute Scan</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SECTION 3: SURETY INFORMATION -->
                <div class="card" style="border-top: 3px solid var(--color-gold);">
                    <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
                        <h3 style="display:flex; align-items:center; gap:6px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                            <span>3. Surety / Solvent Guarantor Details</span>
                        </h3>
                        <button type="button" class="btn btn-primary" id="fill-demo-surety" style="font-size: 11px; padding: 4px 8px;">
                            Autofill Demo Surety Details
                        </button>
                    </div>
                    <div class="card-body">
                        <!-- Switcher for Surety Type -->
                        <div class="form-group" style="margin-bottom: 24px; max-width: 400px;">
                            <label>Solvency Surety Type</label>
                            <select class="form-input" id="surety-type-select" style="font-weight: 700; border-color: var(--color-gold);">
                                <option value="PROPERTY">Property Surety (Revenue/Land Asset Backed)</option>
                                <option value="INDIVIDUAL">Individual Surety (Solvent Guarantor Backed)</option>
                            </select>
                        </div>

                        <!-- SUB-SECTION A: INDIVIDUAL SURETY -->
                        <div id="surety-individual-section" style="display: none;">
                            <div class="form-grid-3">
                                <div class="form-group">
                                    <label>Surety Full Name</label>
                                    <input type="text" class="form-input" id="surety-name-i" value="Madhava Rao Vemuri">
                                </div>
                                <div class="form-group">
                                    <label>Relation to Accused</label>
                                    <select class="form-input" id="surety-relation-i">
                                        <option value="Brother">Brother</option>
                                        <option value="Father">Father</option>
                                        <option value="Friend">Friend</option>
                                        <option value="Other">Other Relative</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Surety Mobile Number</label>
                                    <input type="text" class="form-input code-font" id="surety-mobile-i" maxlength="10" value="8765432109">
                                </div>
                                <div class="form-group">
                                    <label>Surety Aadhaar Number</label>
                                    <input type="text" class="form-input code-font" id="surety-aadhaar-i" maxlength="12" value="876543210987">
                                </div>
                                <div class="form-group">
                                    <label>Surety PAN Number</label>
                                    <input type="text" class="form-input code-font" id="surety-pan-i" maxlength="10" value="LKJHG6789F">
                                </div>
                                <div class="form-group">
                                    <label>Employment / Financial Details</label>
                                    <input type="text" class="form-input" id="surety-employment-i" value="Retired Government Clerk, Pension ₹35,000">
                                </div>
                                <div class="form-group">
                                    <label>Declared Monthly Income (₹)</label>
                                    <input type="number" class="form-input code-font" id="surety-income-i" value="35000">
                                </div>
                            </div>
                        </div>

                        <!-- SUB-SECTION B: PROPERTY SURETY -->
                        <div id="surety-property-section">
                            <div class="form-grid-3">
                                <div class="form-group">
                                    <label>Pledged Property Address</label>
                                    <input type="text" class="form-input" id="property-address" value="Ward No 8, Subhash Road, Rajamundry">
                                </div>
                                <div class="form-group">
                                    <label>Revenue Survey Number</label>
                                    <input type="text" class="form-input code-font" id="property-survey" value="RS-104/12-C">
                                </div>
                                <div class="form-group">
                                    <label>Revenue Record Patta/Khata No.</label>
                                    <input type="text" class="form-input code-font" id="property-patta" value="P-8472-RJM">
                                </div>
                                <div class="form-group">
                                    <label>Market Asset Valuation (₹)</label>
                                    <input type="number" class="form-input code-font" id="property-valuation" value="650000">
                                </div>
                                <div class="form-group">
                                    <label>Ownership Verification Title Deed ID</label>
                                    <input type="text" class="form-input code-font" id="property-ownership-id" value="TD-2026-RJM-482">
                                </div>
                                <div class="form-group">
                                    <label>Revenue mutation Encumbrance Status</label>
                                    <select class="form-input" id="property-encumbered">
                                        <option value="clean">Clean / Unencumbered</option>
                                        <option value="mortgaged">Encumbered / Mortgaged</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-section-title">Surety Biometric Counter-Capture</div>
                        <div class="biometric-capture-zone">
                            <div class="biometric-box" id="surety-finger-box">
                                <div class="scan-pulse-line"></div>
                                <i class="scanner-icon" style="display:flex; justify-content:center; align-items:center; margin-bottom:8px;">
                                    <svg viewBox="0 0 16 16" width="30" height="30" fill="currentColor" style="color:var(--color-gold);"><path d="M8.06 6.5a.5.5 0 0 1 .5.5v.776a11.5 11.5 0 0 1-.552 3.519l-1.331 4.14a.5.5 0 0 1-.952-.305l1.33-4.141a10.5 10.5 0 0 0 .504-3.213V7a.5.5 0 0 1 .5-.5Z"/><path d="M6.06 7a2 2 0 1 1 4 0 .5.5 0 1 1-1 0 1 1 0 1 0-2 0v.332q0 .613-.066 1.221A.5.5 0 0 1 6 8.447q.06-.555.06-1.115zm3.509 1a.5.5 0 0 1 .487.513 11.5 11.5 0 0 1-.587 3.339l-1.266 3.8a.5.5 0 0 1-.949-.317l1.267-3.8a10.5 10.5 0 0 0 .535-3.048A.5.5 0 0 1 9.569 8m-3.356 2.115a.5.5 0 0 1 .33.626L5.24 14.939a.5.5 0 1 1-.955-.296l1.303-4.199a.5.5 0 0 1 .625-.329"/><path d="M4.759 5.833A3.501 3.501 0 0 1 11.559 7a.5.5 0 0 1-1 0 2.5 2.5 0 0 0-4.857-.833.5.5 0 1 1-.943-.334m.3 1.67a.5.5 0 0 1 .449.546 10.7 10.7 0 0 1-.4 2.031l-1.222 4.072a.5.5 0 1 1-.958-.287L4.15 9.793a9.7 9.7 0 0 0 .363-1.842.5.5 0 0 1 .546-.449Z"/></svg>
                                </i>
                                <span>Scan 10 Fingerprints</span>
                                <div class="scan-status-indicator" id="surety-finger-indicator" style="color:var(--color-danger);">Awaiting Scan</div>
                                <button type="button" class="btn btn-primary" id="btn-scan-surety-finger" style="margin-top:10px; font-size:11px; padding: 4px 10px;">Execute Scan</button>
                            </div>
                            <div class="biometric-box" id="surety-iris-box">
                                <div class="scan-pulse-line"></div>
                                <i class="scanner-icon" style="display:flex; justify-content:center; align-items:center; margin-bottom:8px;">
                                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                </i>
                                <span>Scan Retina (Iris)</span>
                                <div class="scan-status-indicator" id="surety-iris-indicator" style="color:var(--color-danger);">Awaiting Scan</div>
                                <button type="button" class="btn btn-primary" id="btn-scan-surety-iris" style="margin-top:10px; font-size:11px; padding: 4px 10px;">Execute Scan</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SECTION 4: LEGAL ARGUMENTS & COURT DETAILS -->
                <div class="card" style="border-top: 3px solid var(--color-gold);">
                    <div class="card-header">
                        <h3 style="display:flex; align-items:center; gap:6px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><path d="M12 2v20M5 7h14M5 7L3 13h4L5 7zm14 0l-2 6h4l-2-6zM12 22h6M12 22H6"/></svg>
                            <span>4. Legal Arguments & Court Information</span>
                        </h3>
                    </div>
                    <div class="card-body">
                        <div class="form-grid-3">
                            <div class="form-group">
                                <label>Presiding Judge Name</label>
                                <input type="text" class="form-input" id="case-judge" required value="Hon'ble J. Kameswara Rao">
                            </div>
                            <div class="form-group">
                                <label>Presiding Judge ID</label>
                                <input type="text" class="form-input code-font" id="case-judge-id" required value="JUDGE-KAMESWARA-2026">
                            </div>
                            <div class="form-group">
                                <label>Court Name & Location</label>
                                <input type="text" class="form-input" id="case-court-location" required value="Sessions Court Room 2, Rajamundry">
                            </div>
                            <div class="form-group">
                                <label>Bail Application Type</label>
                                <select class="form-input" id="case-bail-type">
                                    <option value="First Bail">First Bail</option>
                                    <option value="Second Bail">Second Bail</option>
                                    <option value="Anticipatory">Anticipatory</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Proposed Bail Amount (₹)</label>
                                <input type="number" class="form-input code-font" id="proposed-bail-amount" required value="50000">
                            </div>
                            <div class="form-group">
                                <label>Hearing Date & Time</label>
                                <input type="datetime-local" class="form-input" id="case-hearing" required value="2026-05-29T10:30">
                            </div>
                            <div class="form-group">
                                <label>Bail Case Status</label>
                                <select class="form-input" id="case-status-select">
                                    <option value="Ready for Judge">Ready for Judge</option>
                                    <option value="Checking">Under Registry Scrutiny</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Proposed Judicial Release Conditions</label>
                            <div style="display: flex; gap: 20px; flex-wrap: wrap; margin-top: 8px;">
                                <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; text-transform: none; font-weight: normal; cursor: pointer;">
                                    <input type="checkbox" id="cond-weekly" checked style="width: 16px; height: 16px; margin: 0;"> Weekly Reporting to Precinct
                                </label>
                                <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; text-transform: none; font-weight: normal; cursor: pointer;">
                                    <input type="checkbox" id="cond-passport" checked style="width: 16px; height: 16px; margin: 0;"> Passport Surrender/Travel Lock
                                </label>
                                <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; text-transform: none; font-weight: normal; cursor: pointer;">
                                    <input type="checkbox" id="cond-witness" checked style="width: 16px; height: 16px; margin: 0;"> No Contact with Prosecution Witnesses
                                </label>
                                <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; text-transform: none; font-weight: normal; cursor: pointer;">
                                    <input type="checkbox" id="cond-geofence" checked style="width: 16px; height: 16px; margin: 0;"> Geofencing Movement Restricts
                                </label>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Public Prosecutor's Arguments (Against Bail)</label>
                            <textarea class="form-input" id="prosecution-arg" rows="2">Objections: Possibility of tampering with witnesses.</textarea>
                        </div>
                        <div class="form-group">
                            <label>Defence Counsel's Arguments (Supporting Bail)</label>
                            <textarea class="form-input" id="defence-arg" rows="2">Accused is cooperative. Items recovered. No flight risk.</textarea>
                        </div>
                        <div class="form-group">
                            <label>Previous Court Orders Relevant to Bail</label>
                            <textarea class="form-input" id="previous-court-orders" rows="2">First bail application rejected on 2026-05-18 by Magistrate Court due to jurisdictional limitations.</textarea>
                        </div>
                        
                        <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:20px;">
                            <button type="button" class="btn btn-secondary" id="btn-reset-form">Reset Form</button>
                            <button type="submit" class="btn btn-success" id="btn-submit-app">✓ Submit & Compile System Checks</button>
                        </div>
                    </div>
                </div>
            </form>
        `;

        // Interactive Surety Type Toggle
        const typeSelect = tabContent.querySelector('#surety-type-select');
        const sectionProp = tabContent.querySelector('#surety-property-section');
        const sectionInd = tabContent.querySelector('#surety-individual-section');
        
        typeSelect.addEventListener('change', (e) => {
            if (e.target.value === 'PROPERTY') {
                sectionProp.style.display = 'block';
                sectionInd.style.display = 'none';
            } else {
                sectionProp.style.display = 'none';
                sectionInd.style.display = 'block';
            }
        });

        // Biometric scanning state variables
        let accFinger = false, accIris = false, surFinger = false, surIris = false;

        const executeScanner = (boxId, textId, indicatorId, callback) => {
            const box = tabContent.querySelector(`#${boxId}`);
            const indicator = tabContent.querySelector(`#${indicatorId}`);
            
            box.classList.add('scanning');
            indicator.style.color = 'var(--color-warning)';
            indicator.innerText = 'Scanning Biometrics...';

            setTimeout(() => {
                box.classList.remove('scanning');
                box.classList.add('scanned-green');
                indicator.style.color = 'var(--color-success)';
                indicator.innerText = '✓ CONFIRMED (Aadhaar Match)';
                callback(true);
            }, 1500);
        };

        tabContent.querySelector('#btn-scan-accused-finger').addEventListener('click', () => {
            executeScanner('accused-finger-box', 'accused-finger-txt', 'accused-finger-indicator', (v) => { accFinger = v; });
        });
        tabContent.querySelector('#btn-scan-accused-iris').addEventListener('click', () => {
            executeScanner('accused-iris-box', 'accused-iris-txt', 'accused-iris-indicator', (v) => { accIris = v; });
        });
        tabContent.querySelector('#btn-scan-surety-finger').addEventListener('click', () => {
            executeScanner('surety-finger-box', 'surety-finger-txt', 'surety-finger-indicator', (v) => { surFinger = v; });
        });
        tabContent.querySelector('#btn-scan-surety-iris').addEventListener('click', () => {
            executeScanner('surety-iris-box', 'surety-iris-txt', 'surety-iris-indicator', (v) => { surIris = v; });
        });

        // Autofill Demo Shortcut (Accused)
        tabContent.querySelector('#fill-demo-accused').addEventListener('click', () => {
            tabContent.querySelector('#accused-name').value = "Vijay Kumar Ganti";
            tabContent.querySelector('#accused-father').value = "Laxman Kumar Ganti";
            tabContent.querySelector('#accused-dob').value = "1978-11-22";
            tabContent.querySelector('#accused-aadhaar').value = "456789012345";
            tabContent.querySelector('#accused-pan').value = "MNBVC9876P";
            tabContent.querySelector('#accused-mobile').value = "9440123456";
            tabContent.querySelector('#accused-address').value = "D.No 4-12, Danavaipeta, Rajamundry, Andhra Pradesh";
            tabContent.querySelector('#accused-dl').value = "AP05-2023-9847291";
            tabContent.querySelector('#accused-passport').value = "V2948194";
            tabContent.querySelector('#accused-employment').value = "Private Sector Account Executive";
            tabContent.querySelector('#accused-income').value = "35000";
            tabContent.querySelector('#accused-bank-account').value = "HDFC Bank A/c 93847294827";
            tabContent.querySelector('#accused-cibil').value = "520";
            tabContent.querySelector('#accused-criminal-history').value = "3 prior arrests pending trial under NDPS registers. 1 absconding flag in 2024.";
            
            tabContent.querySelector('#accused-finger-box').className = "biometric-box scanned-green";
            tabContent.querySelector('#accused-finger-indicator').innerText = "✓ CONFIRMED (Aadhaar Match)";
            tabContent.querySelector('#accused-finger-indicator').style.color = "var(--color-success)";
            tabContent.querySelector('#accused-iris-box').className = "biometric-box scanned-green";
            tabContent.querySelector('#accused-iris-indicator').innerText = "✓ CONFIRMED (Aadhaar Match)";
            tabContent.querySelector('#accused-iris-indicator').style.color = "var(--color-success)";
            accFinger = true; accIris = true;
        });

        // Autofill Demo Shortcut (Surety)
        tabContent.querySelector('#fill-demo-surety').addEventListener('click', () => {
            const isProperty = typeSelect.value === 'PROPERTY';
            
            if (isProperty) {
                tabContent.querySelector('#property-address').value = "Survey RS-241/8-A, Danavaipeta, Rajamundry";
                tabContent.querySelector('#property-survey').value = "RS-241/8-A";
                tabContent.querySelector('#property-patta').value = "P-8472-RJM";
                tabContent.querySelector('#property-valuation').value = "80000";
                tabContent.querySelector('#property-ownership-id').value = "TD-2018-RJM-104";
                tabContent.querySelector('#property-encumbered').value = "mortgaged";
            } else {
                tabContent.querySelector('#surety-name-i').value = "Ramakrishna Prasad Rao";
                tabContent.querySelector('#surety-mobile-i').value = "7702456789";
                tabContent.querySelector('#surety-aadhaar-i').value = "901234567890";
                tabContent.querySelector('#surety-pan-i').value = "QWERTY6543K";
                tabContent.querySelector('#surety-employment-i').value = "Contractor";
                tabContent.querySelector('#surety-income-i').value = "30000";
            }
            
            tabContent.querySelector('#surety-finger-box').className = "biometric-box scanned-green";
            tabContent.querySelector('#surety-finger-indicator').innerText = "✓ CONFIRMED (Aadhaar Match)";
            tabContent.querySelector('#surety-finger-indicator').style.color = "var(--color-success)";
            tabContent.querySelector('#surety-iris-box').className = "biometric-box scanned-green";
            tabContent.querySelector('#surety-iris-indicator').innerText = "✓ CONFIRMED (Aadhaar Match)";
            tabContent.querySelector('#surety-iris-indicator').style.color = "var(--color-success)";
            surFinger = true; surIris = true;
        });

        tabContent.querySelector('#btn-back-to-status').addEventListener('click', () => {
            state.staffActiveTab = 'status';
            onUpdate();
        });

        tabContent.querySelector('#btn-reset-form').addEventListener('click', () => {
            tabContent.querySelector('#new-bail-form').reset();
            accFinger = false; accIris = false; surFinger = false; surIris = false;
            onUpdate();
        });

        tabContent.querySelector('#new-bail-form').addEventListener('submit', (e) => {
            e.preventDefault();

            if (!accFinger || !accIris || !surFinger || !surIris) {
                alert('CRITICAL ERROR: Aadhaar biometric verification (fingerprint + iris matching) must be successfully executed at the counter before filing.');
                return;
            }

            const caseNumber = tabContent.querySelector('#case-no').value;
            const firNumber = tabContent.querySelector('#fir-no').value;
            const sections = tabContent.querySelector('#case-sections').value;
            const arrestDate = tabContent.querySelector('#case-arrest-date').value;
            const officer = tabContent.querySelector('#case-officer').value;
            const filingDate = tabContent.querySelector('#case-filing-date').value;
            
            // Checkboxes
            const supportingDocs = [];
            if (tabContent.querySelector('#doc-character').checked) supportingDocs.push('Character Certificate');
            if (tabContent.querySelector('#doc-employment').checked) supportingDocs.push('Employment Letter');
            if (tabContent.querySelector('#doc-community').checked) supportingDocs.push('Community Ties Evidence');

            const accusedName = tabContent.querySelector('#accused-name').value;
            const accusedFather = tabContent.querySelector('#accused-father').value;
            const accusedDob = tabContent.querySelector('#accused-dob').value;
            const accusedAadhaar = tabContent.querySelector('#accused-aadhaar').value;
            const accusedPan = tabContent.querySelector('#accused-pan').value;
            const accusedMobile = tabContent.querySelector('#accused-mobile').value;
            const accusedDl = tabContent.querySelector('#accused-dl').value;
            const accusedPassport = tabContent.querySelector('#accused-passport').value;
            const accusedAddress = tabContent.querySelector('#accused-address').value;
            const accusedEmployment = tabContent.querySelector('#accused-employment').value;
            const accusedIncome = parseFloat(tabContent.querySelector('#accused-income').value || 0);
            const bankAccount = tabContent.querySelector('#accused-bank-account').value;
            const cibilScore = parseInt(tabContent.querySelector('#accused-cibil').value || 700);
            const criminalHistory = tabContent.querySelector('#accused-criminal-history').value;

            // Surety Switcher values
            const suretyType = typeSelect.value;
            let suretyName = '', suretyRelation = '', suretyMobile = '', suretyAadhaar = '', suretyPan = '', suretyEmployment = '', suretyIncome = 0;
            let propertyAddress = '', propertySurvey = '', propertyPatta = '', propertyValuation = 0, propertyOwnershipDoc = '', encumbState = 'CLEAN';

            if (suretyType === 'INDIVIDUAL') {
                suretyName = tabContent.querySelector('#surety-name-i').value;
                suretyRelation = tabContent.querySelector('#surety-relation-i').value;
                suretyMobile = tabContent.querySelector('#surety-mobile-i').value;
                suretyAadhaar = tabContent.querySelector('#surety-aadhaar-i').value;
                suretyPan = tabContent.querySelector('#surety-pan-i').value;
                suretyEmployment = tabContent.querySelector('#surety-employment-i').value;
                suretyIncome = parseFloat(tabContent.querySelector('#surety-income-i').value || 0);
            } else {
                propertyAddress = tabContent.querySelector('#property-address').value;
                propertySurvey = tabContent.querySelector('#property-survey').value;
                propertyPatta = tabContent.querySelector('#property-patta').value;
                propertyValuation = parseFloat(tabContent.querySelector('#property-valuation').value || 0);
                propertyOwnershipDoc = tabContent.querySelector('#property-ownership-id').value;
                encumbState = tabContent.querySelector('#property-encumbered').value === 'mortgaged' ? 'ENCUMBERED' : 'CLEAN';
                
                // Set default individual name mapping for property owners
                suretyName = accusedFather; // Typically father pledges property in sandbox
                suretyRelation = 'Father';
            }

            // Legal Arguments & Court
            const presidingJudge = tabContent.querySelector('#case-judge').value;
            const judgeId = tabContent.querySelector('#case-judge-id').value;
            const courtLocation = tabContent.querySelector('#case-court-location').value;
            const bailType = tabContent.querySelector('#case-bail-type').value;
            const bailAmt = parseFloat(tabContent.querySelector('#proposed-bail-amount').value || 50000);
            const hearingDate = tabContent.querySelector('#case-hearing').value;
            const caseStatus = tabContent.querySelector('#case-status-select').value;
            
            const proposedConditions = [];
            if (tabContent.querySelector('#cond-weekly').checked) proposedConditions.push('Weekly Reporting');
            if (tabContent.querySelector('#cond-passport').checked) proposedConditions.push('Passport Deposit');
            if (tabContent.querySelector('#cond-witness').checked) proposedConditions.push('No Contact with Witnesses');
            if (tabContent.querySelector('#cond-geofence').checked) proposedConditions.push('Geofence Restrictions');

            const prosecutionArg = tabContent.querySelector('#prosecution-arg').value;
            const defenceArg = tabContent.querySelector('#defence-arg').value;
            const previousCourtOrders = tabContent.querySelector('#previous-court-orders').value;

            // Mock profile configurations based on names for verification engine
            let ncrbCount = 0, prevBails = 0, prevHonored = 0, absconding = 0, travelWatch = false;
            let suretyBails = 0;

            if (accusedName.toLowerCase().includes('vijay') || accusedName.toLowerCase().includes('ganti')) {
                ncrbCount = 3; prevBails = 2; prevHonored = 1; absconding = 1; travelWatch = true; suretyBails = 3;
            }

            // Execute Verification Engine
            const idCheck = VerificationEngine.verifyIdentity(accusedAadhaar, accFinger, accIris);
            const finCheck = VerificationEngine.verifyFinancialCapacity(suretyPan || 'DUMMYPAN12', [30000, 31000, 32000], 12000, cibilScore, bailAmt);
            const riskCheck = VerificationEngine.calculateRiskScore(ncrbCount, prevBails, prevHonored, absconding, travelWatch);
            const suretyCheck = VerificationEngine.verifySuretyLoad(suretyBails, 0);
            const propCheck = VerificationEngine.verifyProperty(suretyType === 'PROPERTY', suretyName, suretyName, encumbState === 'ENCUMBERED', propertyValuation || 500000, bailAmt);
            const recCheck = VerificationEngine.compileRecommendation(idCheck, finCheck, riskCheck, suretyCheck, propCheck);

            const newCase = {
                caseNumber,
                firNumber,
                ipcSections: sections,
                dateOfArrest: arrestDate,
                policeStation: officer,
                presidingJudge,
                judgeId,
                courtLocation,
                bailType,
                proposedBailAmount: bailAmt,
                proposedConditions,
                hearingDate,
                currentStatus: caseStatus,
                orderStatus: 'PENDING',
                judgeRemarks: '',
                digitalSignature: '',
                filingDate,
                supportingDocs,
                previousCourtOrders,
                accused: {
                    fullName: accusedName,
                    dob: accusedDob,
                    fathersName: accusedFather,
                    address: accusedAddress,
                    mobileNumber: accusedMobile,
                    aadhaarNumber: accusedAadhaar,
                    panNumber: accusedPan,
                    drivingLicense: accusedDl,
                    passportNumber: accusedPassport,
                    employmentDetails: accusedEmployment,
                    monthlyIncome: accusedIncome,
                    bankAccount,
                    cibilScore,
                    criminalHistory,
                    ncrbCount,
                    prevBailsGranted: prevBails,
                    prevBailsHonored: prevHonored,
                    abscondingCount: absconding,
                    travelRestricted: travelWatch,
                    bankBalance6m: 22000
                },
                surety: {
                    suretyType,
                    fullName: suretyName,
                    relationToAccused: suretyRelation,
                    mobileNumber: suretyMobile || accusedMobile,
                    aadhaarNumber: suretyAadhaar || accusedAadhaar,
                    panNumber: suretyPan || accusedPan,
                    employmentDetails: suretyEmployment || 'Guarantor',
                    monthlyIncome: suretyIncome || 25000,
                    activeBailCount: suretyBails,
                    propertyAddress,
                    surveyNumber: propertySurvey,
                    propertyValuation,
                    propertyOwnershipDoc,
                    propertyRevenueRecord: propertyPatta,
                    encumbranceStatus: encumbState,
                    mutationStatus: 'PENDING'
                },
                arguments: {
                    prosecution: prosecutionArg,
                    defence: defenceArg
                },
                checks: {
                    identity: idCheck,
                    finance: finCheck,
                    risk: riskCheck,
                    suretyLoad: suretyCheck,
                    property: propCheck,
                    recommendation: recCheck
                }
            };

            state.cases.unshift(newCase);
            state.saveDatabase();
            
            alert('Application successfully created and compiled!');
            state.staffActiveTab = 'status';
            onUpdate();
        });
    },

    renderStatusBoard(tabContent, state, onUpdate) {
        // Calculate statistical numbers exactly matching mockup
        const totalCases = state.cases.length;
        // Cases that have order status Granted or Granted with Conditions or simple low-risk pending
        const readyCases = state.cases.filter(c => c.checks.risk.riskLevel === 'LOW' && c.checks.identity.status === 'GREEN' && c.checks.property.status !== 'BLOCKED').length;
        const checkingCases = state.cases.filter(c => c.currentStatus === 'Checking').length;
        const alertCases = state.cases.filter(c => c.checks.identity.status === 'RED' || c.checks.risk.score > 60 || c.checks.suretyLoad.status === 'DISQUALIFIED' || c.checks.property.status === 'BLOCKED').length;

        let tableRowsHtml = '';
        
        state.cases.forEach((c) => {
            // Charges badge colors replicating reference mockup
            let chargeClass = 'charge-gold';
            if (c.ipcSections.includes('302')) chargeClass = 'charge-red';
            else if (c.ipcSections.includes('NDPS') || c.ipcSections.includes('PC Act')) chargeClass = 'charge-pink';

            // Status label dot badges
            let statusBadge = '';
            if (c.checks.identity.status === 'RED' || c.checks.risk.score > 60 || c.checks.suretyLoad.status === 'DISQUALIFIED' || c.checks.property.status === 'BLOCKED') {
                statusBadge = `<span class="status-indicator-mock alert">Alert</span>`;
            } else if (c.currentStatus === 'Checking') {
                statusBadge = `<span class="status-indicator-mock checking">Checking</span>`;
            } else {
                statusBadge = `<span class="status-indicator-mock ready">Ready</span>`;
            }

            // Hearing Time
            let hearingTimeText = '10:30 AM · Court 3';
            if (c.hearingDate) {
                const hd = new Date(c.hearingDate);
                const timeStr = hd.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                const courtNo = c.caseNumber.endsWith('5') || c.caseNumber.endsWith('7') ? 'Court 2' : c.caseNumber.endsWith('6') || c.caseNumber.endsWith('8') ? 'Court 4' : 'Court 3';
                hearingTimeText = `${timeStr} · ${courtNo}`;
            }

            tableRowsHtml += `
                <tr class="case-mockup-row" data-case="${c.caseNumber}">
                    <td class="case-no-cell">${c.caseNumber}</td>
                    <td>
                        <div class="accused-info-name">${c.accused.fullName}</div>
                        <div class="accused-info-sub">S/o ${c.accused.fathersName} · Age ${c.caseNumber.endsWith('2') ? '34' : c.caseNumber.endsWith('1') ? '28' : c.caseNumber.endsWith('0') ? '41' : c.caseNumber.endsWith('9') ? '22' : c.caseNumber.endsWith('8') ? '36' : c.caseNumber.endsWith('7') ? '55' : c.caseNumber.endsWith('6') ? '29' : '47'}</div>
                    </td>
                    <td>
                        <span class="charge-capsule ${chargeClass}">${c.ipcSections}</span>
                    </td>
                    <td>${c.bailType}</td>
                    <td style="font-weight: 500;">${hearingTimeText}</td>
                    <td>${statusBadge}</td>
                </tr>
            `;
        });

        tabContent.innerHTML = `
            <!-- SUBHEADER SECTION -->
            <div class="dashboard-header-block" style="margin-bottom: 24px; display:flex; justify-content:space-between; align-items:center;">
                <div class="dashboard-title">
                    <h2 style="font-size:26px; font-weight:700;">Court Staff Dashboard — Today's Applications</h2>
                    <p style="font-size:13px; color:var(--color-text-muted); margin-top:4px;">May 29, 2026 · Rajamundry District Court · Staff: K. Lakshmi</p>
                </div>
                <div>
                    <button class="btn btn-success" id="btn-create-new-bail-app" style="font-weight: 700; display:inline-flex; align-items:center; justify-content:center; gap:6px;">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" style="vertical-align:middle;"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        <span>File New Application</span>
                    </button>
                </div>
            </div>

            <!-- STATISTICS BOXES ROW -->
            <div class="stats-grid-container">
                <div class="stat-box-mock total">
                    <h4>Total Today</h4>
                    <div class="number-val">${totalCases}</div>
                </div>
                <div class="stat-box-mock verified">
                    <h4>Verified & Ready</h4>
                    <div class="number-val">${readyCases}</div>
                </div>
                <div class="stat-box-mock checking">
                    <h4>Checking</h4>
                    <div class="number-val">${checkingCases}</div>
                </div>
                <div class="stat-box-mock alerts">
                    <h4>Alerts Raised</h4>
                    <div class="number-val">${alertCases}</div>
                </div>
            </div>

            <!-- CASE LIST TABLE CARD -->
            <p style="text-align: left; color: var(--color-text-muted); font-size: 12.5px; font-style: italic; margin-top: 20px; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:middle; opacity:0.8; color: var(--color-gold);"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><circle cx="12" cy="8" r="1" fill="currentColor"/></svg>
                <span>Click any row below to view full case details, adjudicate, or print official legal reports.</span>
            </p>
            <div class="table-card-mock">
                <div class="data-table-wrapper">
                    <table class="mock-table">
                        <thead>
                            <tr>
                                <th>Application No.</th>
                                <th>Accused</th>
                                <th>Charges</th>
                                <th>Bail Type</th>
                                <th>Hearing</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRowsHtml}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Bind table row clicks -> Securely triggers report viewer to print documents
        tabContent.querySelectorAll('.case-mockup-row').forEach(row => {
            row.addEventListener('click', (e) => {
                const caseNo = e.currentTarget.getAttribute('data-case');
                const caseRecord = state.cases.find(c => c.caseNumber === caseNo);
                if (caseRecord) {
                    state.openReportViewer(caseRecord);
                }
            });
        });

        // Bind File New Application button to switch tab
        const createNewBtn = tabContent.querySelector('#btn-create-new-bail-app');
        if (createNewBtn) {
            createNewBtn.addEventListener('click', () => {
                state.staffActiveTab = 'register';
                onUpdate();
            });
        }
    }
};
