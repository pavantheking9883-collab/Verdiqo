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
        
        tabContent.innerHTML = `
            <div class="dashboard-header-block" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <div class="dashboard-title">
                    <h2 style="display:flex; align-items:center; gap:8px;">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                        <span>${state.translate('New Bail Application Registration', 'नई ज़मानत याचिका पंजीकरण')}</span>
                    </h2>
                    <p>Enter accused credentials and execute UIDAI biometric scanning</p>
                </div>
                <button class="btn btn-secondary" id="btn-back-to-status">Back to Applications Board</button>
            </div>

            <form id="new-bail-form">
                <!-- ACCUSED SECTION -->
                <div class="card">
                    <div class="card-header">
                        <h3 style="display:flex; align-items:center; gap:6px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            <span>Accused Person Details</span>
                        </h3>
                        <button type="button" class="btn btn-primary" id="fill-demo-accused" style="font-size: 11px; padding: 4px 8px;">
                            Autofill Demo Case (High Risk)
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
                                <input type="text" class="form-input code-font" id="accused-aadhaar" maxlength="12" required value="987654321098">
                            </div>
                            <div class="form-group">
                                <label>PAN Number</label>
                                <input type="text" class="form-input code-font" id="accused-pan" maxlength="10" required value="ASDFG1234H">
                            </div>
                            <div class="form-group">
                                <label>Mobile Number</label>
                                <input type="text" class="form-input code-font" id="accused-mobile" maxlength="10" required value="9876543210">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Residential Address</label>
                            <input type="text" class="form-input" id="accused-address" required value="Flat 402, Sai Balaji Residency, Rajamundry, AP">
                        </div>
                        
                        <div class="form-section-title">Accused Biometric Capture</div>
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

                <!-- SURETY SECTION -->
                <div class="card">
                    <div class="card-header">
                        <h3 style="display:flex; align-items:center; gap:6px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                            <span>Surety / Guarantor Details</span>
                        </h3>
                        <button type="button" class="btn btn-primary" id="fill-demo-surety" style="font-size: 11px; padding: 4px 8px;">
                            Autofill Demo Surety (Capable)
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="form-grid-3">
                            <div class="form-group">
                                <label>Surety Full Name</label>
                                <input type="text" class="form-input" id="surety-name" required value="Madhava Rao Vemuri">
                            </div>
                            <div class="form-group">
                                <label>Relation to Accused</label>
                                <select class="form-input" id="surety-relation" required>
                                    <option value="Brother">Brother</option>
                                    <option value="Father">Father</option>
                                    <option value="Friend">Friend</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Surety Mobile</label>
                                <input type="text" class="form-input code-font" id="surety-mobile" maxlength="10" required value="8765432109">
                            </div>
                            <div class="form-group">
                                <label>Surety Aadhaar</label>
                                <input type="text" class="form-input code-font" id="surety-aadhaar" maxlength="12" required value="876543210987">
                            </div>
                            <div class="form-group">
                                <label>Surety PAN</label>
                                <input type="text" class="form-input code-font" id="surety-pan" maxlength="10" required value="LKJHG6789F">
                            </div>
                            <div class="form-group">
                                <label>Employment / declared income</label>
                                <input type="text" class="form-input" id="surety-employment" required value="Retired Government Clerk, Pension ₹35,000">
                            </div>
                        </div>

                        <div class="form-section-title">Surety Property Asset Pledged</div>
                        <div class="form-grid-3">
                            <div class="form-group">
                                <label>Property Address & Survey No</label>
                                <input type="text" class="form-input" id="property-address" value="Ward No 8, Subhash Road, Rajamundry. RS-104/12-C">
                            </div>
                            <div class="form-group">
                                <label>Market Value (₹)</label>
                                <input type="number" class="form-input code-font" id="property-valuation" value="650000">
                            </div>
                            <div class="form-group">
                                <label>Revenue Record Mutation State</label>
                                <select class="form-input" id="property-encumbered">
                                    <option value="clean">Clean / Unencumbered</option>
                                    <option value="mortgaged">Encumbered / Mortgaged</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-section-title">Surety Biometric Capture</div>
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

                <!-- CASE DETAILS -->
                <div class="card">
                    <div class="card-header">
                        <h3 style="display:flex; align-items:center; gap:6px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--color-gold);"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                            <span>Case & Legal Reference</span>
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
                                <label>Charged IPC Sections</label>
                                <input type="text" class="form-input" id="case-sections" required value="IPC 420, 468">
                            </div>
                            <div class="form-group">
                                <label>Arrest Date</label>
                                <input type="date" class="form-input" id="case-arrest-date" required value="2026-05-24">
                            </div>
                            <div class="form-group">
                                <label>Investigating PS/Officer</label>
                                <input type="text" class="form-input" id="case-officer" required value="Rajamundry Urban PS, Inspector S. Kumar">
                            </div>
                            <div class="form-group">
                                <label>Preceding Judge</label>
                                <input type="text" class="form-input" id="case-judge" required value="Hon'ble J. Kameswara Rao">
                            </div>
                        </div>
                        <div class="form-grid-3">
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
                        </div>
                        
                        <div class="form-group">
                            <label>Prosecution Objections</label>
                            <textarea class="form-input" id="prosecution-arg" rows="2">Objections: Possibility of tampering with witnesses.</textarea>
                        </div>
                        <div class="form-group">
                            <label>Defence Lawyer Arguments</label>
                            <textarea class="form-input" id="defence-arg" rows="2">Accused is cooperative. Items recovered. No flight risk.</textarea>
                        </div>
                        
                        <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:20px;">
                            <button type="button" class="btn btn-secondary" id="btn-reset-form">Reset Form</button>
                            <button type="submit" class="btn btn-success" id="btn-submit-app">✓ Submit & Compile System Checks</button>
                        </div>
                    </div>
                </div>
            </form>
        `;

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

        // Autofill Demo Shortcut
        tabContent.querySelector('#fill-demo-accused').addEventListener('click', () => {
            tabContent.querySelector('#accused-name').value = "Vijay Kumar Ganti";
            tabContent.querySelector('#accused-father').value = "Laxman Kumar Ganti";
            tabContent.querySelector('#accused-dob').value = "1978-11-22";
            tabContent.querySelector('#accused-aadhaar').value = "456789012345";
            tabContent.querySelector('#accused-pan').value = "MNBVC9876P";
            tabContent.querySelector('#accused-mobile').value = "9440123456";
            tabContent.querySelector('#accused-address').value = "D.No 4-12, Danavaipeta, Rajamundry, Andhra Pradesh";
            
            tabContent.querySelector('#accused-finger-box').className = "biometric-box scanned-green";
            tabContent.querySelector('#accused-finger-indicator').innerText = "✓ CONFIRMED (Aadhaar Match)";
            tabContent.querySelector('#accused-finger-indicator').style.color = "var(--color-success)";
            tabContent.querySelector('#accused-iris-box').className = "biometric-box scanned-green";
            tabContent.querySelector('#accused-iris-indicator').innerText = "✓ CONFIRMED (Aadhaar Match)";
            tabContent.querySelector('#accused-iris-indicator').style.color = "var(--color-success)";
            accFinger = true; accIris = true;
        });

        tabContent.querySelector('#fill-demo-surety').addEventListener('click', () => {
            tabContent.querySelector('#surety-name').value = "Ramakrishna Prasad Rao";
            tabContent.querySelector('#surety-mobile').value = "7702456789";
            tabContent.querySelector('#surety-aadhaar').value = "901234567890";
            tabContent.querySelector('#surety-pan').value = "QWERTY6543K";
            tabContent.querySelector('#surety-employment').value = "Contractor";
            tabContent.querySelector('#property-address').value = "Survey RS-241/8-A, Danavaipeta, Rajamundry";
            tabContent.querySelector('#property-valuation').value = "80000";
            tabContent.querySelector('#property-encumbered').value = "mortgaged";
            
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

            const accusedName = tabContent.querySelector('#accused-name').value;
            const accusedAadhaar = tabContent.querySelector('#accused-aadhaar').value;
            const accusedPan = tabContent.querySelector('#accused-pan').value;
            const suretyName = tabContent.querySelector('#surety-name').value;
            const suretyAadhaar = tabContent.querySelector('#surety-aadhaar').value;
            const suretyPan = tabContent.querySelector('#surety-pan').value;
            const suretyValuation = parseFloat(tabContent.querySelector('#property-valuation').value || 0);
            const isEncumbered = tabContent.querySelector('#property-encumbered').value === 'mortgaged';
            const caseNumber = tabContent.querySelector('#case-no').value;
            const firNumber = tabContent.querySelector('#fir-no').value;
            const sections = tabContent.querySelector('#case-sections').value;
            const bailAmt = parseFloat(tabContent.querySelector('#proposed-bail-amount').value || 50000);

            // Mock profile configurations based on names
            let ncrbCount = 0, prevBails = 0, prevHonored = 0, absconding = 0, travelWatch = false;
            let suretyBails = 0, cibilScore = 720;

            if (accusedName.toLowerCase().includes('vijay') || accusedName.toLowerCase().includes('ganti')) {
                ncrbCount = 3; prevBails = 2; prevHonored = 1; absconding = 1; travelWatch = true; cibilScore = 520; suretyBails = 3;
            }

            // Execute Verification Engine
            const idCheck = VerificationEngine.verifyIdentity(accusedAadhaar, accFinger, accIris);
            const finCheck = VerificationEngine.verifyFinancialCapacity(suretyPan, [30000, 31000, 32000], 12000, cibilScore, bailAmt);
            const riskCheck = VerificationEngine.calculateRiskScore(ncrbCount, prevBails, prevHonored, absconding, travelWatch);
            const suretyCheck = VerificationEngine.verifySuretyLoad(suretyBails, 0);
            const propCheck = VerificationEngine.verifyProperty(true, suretyName, suretyName, isEncumbered, suretyValuation, bailAmt);
            const recCheck = VerificationEngine.compileRecommendation(idCheck, finCheck, riskCheck, suretyCheck, propCheck);

            const newCase = {
                caseNumber,
                firNumber,
                ipcSections: sections,
                dateOfArrest: tabContent.querySelector('#case-arrest-date').value,
                policeStation: tabContent.querySelector('#case-officer').value,
                presidingJudge: tabContent.querySelector('#case-judge').value,
                bailType: tabContent.querySelector('#case-bail-type').value,
                proposedBailAmount: bailAmt,
                hearingDate: tabContent.querySelector('#case-hearing').value,
                currentStatus: 'Ready for Judge',
                orderStatus: 'PENDING',
                judgeRemarks: '',
                digitalSignature: '',
                accused: {
                    fullName: accusedName,
                    dob: tabContent.querySelector('#accused-dob').value,
                    fathersName: tabContent.querySelector('#accused-father').value,
                    address: tabContent.querySelector('#accused-address').value,
                    mobileNumber: tabContent.querySelector('#accused-mobile').value,
                    aadhaarNumber: accusedAadhaar,
                    panNumber: accusedPan,
                    ncrbCount,
                    prevBailsGranted: prevBails,
                    prevBailsHonored: prevHonored,
                    abscondingCount: absconding,
                    travelRestricted: travelWatch,
                    bankBalance6m: 35000
                },
                surety: {
                    fullName: suretyName,
                    relationToAccused: tabContent.querySelector('#surety-relation').value,
                    mobileNumber: tabContent.querySelector('#surety-mobile').value,
                    aadhaarNumber: suretyAadhaar,
                    panNumber: suretyPan,
                    employmentDetails: tabContent.querySelector('#surety-employment').value,
                    monthlyIncome: 35000,
                    activeBailCount: suretyBails,
                    propertyAddress: tabContent.querySelector('#property-address').value,
                    surveyNumber: 'RS-104/12-C',
                    propertyValuation: suretyValuation,
                    encumbranceStatus: isEncumbered ? 'ENCUMBERED' : 'CLEAN',
                    mutationStatus: 'PENDING'
                },
                arguments: {
                    prosecution: tabContent.querySelector('#prosecution-arg').value,
                    defence: tabContent.querySelector('#defence-arg').value
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

            <p style="text-align: center; color: var(--color-text-muted); font-size: 13px; font-style: italic; margin-top: 10px; margin-bottom: 30px;">
                Click any row to view case details in Judge view
            </p>
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
