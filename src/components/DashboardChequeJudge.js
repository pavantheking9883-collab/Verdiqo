/**
 * VERDIQO: CHEQUE DISHONOUR SPECIAL MAGISTRATE DASHBOARD (SEC. 138 NI ACT)
 * Quantex Intelligence Systems (P) Ltd.
 * Special Judicial Magistrate (NI Act) — summary trials only.
 * Handles early compounding, summons service verification, post-cognizance questions (S.251 CrPC / S.274 BNSS), and S.143-A interim deposits.
 */

export const DashboardChequeJudge = {
    render(container, state, onUpdate) {
        if (!state.chequeJudgeActiveMobileTab) state.chequeJudgeActiveMobileTab = 'listings';

        const chequeCases = state.chequeCases || [];

        // Case selection
        let selectedCase = null;
        if (state.selectedChequeCaseId) {
            selectedCase = chequeCases.find(c => c.caseId === state.selectedChequeCaseId);
        }
        if (!selectedCase && chequeCases.length > 0) {
            selectedCase = chequeCases[0];
            state.selectedChequeCaseId = selectedCase.caseId;
        }

        // Docket statistics
        const totalCases = chequeCases.length;
        const pendingCases = chequeCases.filter(c => c.orderStatus === 'PENDING' || c.orderStatus === 'SUMMONS_ISSUED').length;
        const compoundedCases = chequeCases.filter(c => c.orderStatus === 'COMPOUNDED').length;
        const decreedCases = chequeCases.filter(c => c.orderStatus === 'DECREED' || c.orderStatus === 'DISMISSED').length;
        
        // Compound rate
        const compoundRate = totalCases > 0 ? Math.round((compoundedCases / totalCases) * 100) : 0;
        // Average pending days
        const avgPending = chequeCases.length > 0 
            ? Math.round(chequeCases.reduce((s, c) => s + (c.pendingDays || 0), 0) / chequeCases.length) 
            : 0;

        container.innerHTML = `
            <!-- PAGE HEADER -->
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
                <div>
                    <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">
                        <div style="width:40px; height:40px; background:linear-gradient(135deg, rgba(13,148,136,0.3), rgba(13,148,136,0.1)); border:2px solid #0d9488; border-radius:10px; display:flex; align-items:center; justify-content:center;">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0d9488" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><line x1="12" y1="4" x2="12" y2="20"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
                        </div>
                        <div>
                            <h2 style="font-size:18px; font-weight:800; color:var(--color-text-main); font-family:var(--font-headings);">Section 138 NI Act Magistrate Portal</h2>
                            <p style="font-size:12px; color:#0d9488; font-weight:700;">${state.currentUser?.designation || 'Special Magistrate'} &mdash; ${state.currentUser?.court || 'Special NI Court Room 1'}</p>
                        </div>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:11px; padding:4px 10px; background:rgba(13,148,136,0.12); border:1px solid rgba(13,148,136,0.3); border-radius:20px; color:#2dd4bf; font-weight:700;">&#9878; S.138 SUMMARY TRIAL DOCKET</span>
                </div>
            </div>

            <!-- ADJUDICATION STATS CARDS -->
            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px; margin-bottom:20px;">
                <div style="background:linear-gradient(135deg, rgba(13,148,136,0.14) 0%, rgba(13,148,136,0.04) 100%); border:1px solid rgba(13,148,136,0.3); border-radius:10px; padding:14px 16px;">
                    <div style="font-size:10px; font-weight:800; letter-spacing:1px; color:#0d9488; text-transform:uppercase; margin-bottom:8px;">Active Cheque Cases</div>
                    <div style="font-size:30px; font-weight:800; color:var(--color-text-main); font-family:var(--font-headings); line-height:1;">${pendingCases}</div>
                    <div style="font-size:11px; color:var(--color-text-muted); margin-top:6px;">Awaiting service or trial</div>
                </div>
                <div style="background:linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.04) 100%); border:1px solid rgba(16,185,129,0.25); border-radius:10px; padding:14px 16px;">
                    <div style="font-size:10px; font-weight:800; letter-spacing:1px; color:#10b981; text-transform:uppercase; margin-bottom:8px;">Settled / Compounded</div>
                    <div style="font-size:30px; font-weight:800; color:var(--color-text-main); font-family:var(--font-headings); line-height:1;">${compoundedCases}</div>
                    <div style="font-size:11px; color:var(--color-text-muted); margin-top:6px;">Compounding rate: ${compoundRate}%</div>
                </div>
                <div style="background:linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(245,158,11,0.04) 100%); border:1px solid rgba(245,158,11,0.25); border-radius:10px; padding:14px 16px;">
                    <div style="font-size:10px; font-weight:800; letter-spacing:1px; color:#f59e0b; text-transform:uppercase; margin-bottom:8px;">Avg Pendency (Days)</div>
                    <div style="font-size:30px; font-weight:800; color:var(--color-text-main); font-family:var(--font-headings); line-height:1;">${avgPending}</div>
                    <div style="font-size:11px; color:var(--color-text-muted); margin-top:6px;">Threshold speed focus</div>
                </div>
                <div style="background:linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(239,68,68,0.04) 100%); border:1px solid rgba(239,68,68,0.25); border-radius:10px; padding:14px 16px;">
                    <div style="font-size:10px; font-weight:800; letter-spacing:1px; color:var(--color-danger); text-transform:uppercase; margin-bottom:8px;">Disposed by Verdict</div>
                    <div style="font-size:30px; font-weight:800; color:var(--color-text-main); font-family:var(--font-headings); line-height:1;">${decreedCases}</div>
                    <div style="font-size:11px; color:var(--color-text-muted); margin-top:6px;">Judgments Passed</div>
                </div>
            </div>

            <!-- MOBILE TABS -->
            <div class="judge-mobile-tabs" style="display:none; margin-bottom:16px; background:var(--color-card-dark); border:1px solid var(--color-border); border-radius:8px; padding:6px; gap:8px;">
                <button id="cheque-m-tab-listings" style="flex:1; padding:10px; font-size:13px; text-align:center; border:1px solid ${state.chequeJudgeActiveMobileTab === 'listings' ? '#0d9488' : 'var(--color-border)'}; background:${state.chequeJudgeActiveMobileTab === 'listings' ? 'rgba(13,148,136,0.1)' : 'transparent'}; color:${state.chequeJudgeActiveMobileTab === 'listings' ? '#2dd4bf' : 'var(--color-text-muted)'}; font-weight:700; border-radius:6px; cursor:pointer;">NI Docket List</button>
                <button id="cheque-m-tab-details" style="flex:1; padding:10px; font-size:13px; text-align:center; border:1px solid ${state.chequeJudgeActiveMobileTab === 'details' ? '#0d9488' : 'var(--color-border)'}; background:${state.chequeJudgeActiveMobileTab === 'details' ? 'rgba(13,148,136,0.1)' : 'transparent'}; color:${state.chequeJudgeActiveMobileTab === 'details' ? '#2dd4bf' : 'var(--color-text-muted)'}; font-weight:700; border-radius:6px; cursor:pointer;">Hearing details</button>
            </div>

            <!-- MAIN DUAL-PANEL LAYOUT -->
            <div class="judge-container ${state.chequeJudgeActiveMobileTab}">
                <!-- LEFT SIDEBAR -->
                <div class="hearing-list-sidebar" style="border-top:3px solid #0d9488;">
                    <div class="sidebar-title" style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="display:flex; align-items:center; gap:6px;">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#0d9488" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            <span style="color:#2dd4bf;">Cheque Plaints Registry</span>
                        </span>
                        <span style="background:rgba(13,148,136,0.3); color:#2dd4bf; font-family:var(--font-mono); font-size:11px; padding:2px 8px; border-radius:4px; font-weight:700;">${totalCases} Cases</span>
                    </div>
                    <div class="hearing-list" id="cheque-judge-hearing-list"></div>
                </div>

                <!-- RIGHT DETAILS PANEL -->
                <div class="hearing-detail-view" id="cheque-judge-detail-panel"></div>
            </div>
        `;

        // Mobile tabs events
        const mTabList = container.querySelector('#cheque-m-tab-listings');
        const mTabDet = container.querySelector('#cheque-m-tab-details');
        if (mTabList) mTabList.addEventListener('click', () => { state.chequeJudgeActiveMobileTab = 'listings'; onUpdate(); });
        if (mTabDet) mTabDet.addEventListener('click', () => { state.chequeJudgeActiveMobileTab = 'details'; onUpdate(); });

        this.renderSidebar(container.querySelector('#cheque-judge-hearing-list'), state, onUpdate);
        this.renderDetail(container.querySelector('#cheque-judge-detail-panel'), selectedCase, state, onUpdate);
    },

    renderSidebar(list, state, onUpdate) {
        const chequeCases = state.chequeCases || [];
        if (chequeCases.length === 0) {
            list.innerHTML = `<div style="padding:20px; text-align:center; color:var(--color-text-muted); font-size:13px;">No cheque plaints on docket.</div>`;
            return;
        }

        const statusInfo = {
            'PENDING': { color: '#fb923c', dot: 'var(--color-warning)', label: 'Pending Summons' },
            'SUMMONS_ISSUED': { color: '#60a5fa', dot: '#3b82f6', label: 'Summons Issued' },
            'COMPOUNDED': { color: '#10b981', dot: '#10b981', label: 'Compounded (Settled)' },
            'DECREED': { color: '#10b981', dot: '#059669', label: 'Decree Passed' },
            'DISMISSED': { color: '#ef4444', dot: '#ef4444', label: 'Dismissed / Acquitted' }
        };

        const pending = chequeCases.filter(c => c.orderStatus === 'PENDING' || c.orderStatus === 'SUMMONS_ISSUED');
        const settled = chequeCases.filter(c => c.orderStatus === 'COMPOUNDED');
        const disposed = chequeCases.filter(c => c.orderStatus === 'DECREED' || c.orderStatus === 'DISMISSED');

        let html = '';

        const renderItem = (c) => {
            const isSelected = c.caseId === state.selectedChequeCaseId;
            const si = statusInfo[c.orderStatus] || statusInfo['PENDING'];
            return `
                <div class="hearing-item ${isSelected ? 'active' : ''}" data-cheque-id="${c.caseId}"
                     style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px; border-left:3px solid ${isSelected ? '#0d9488' : 'transparent'};">
                    <div class="hearing-meta" style="flex:1;">
                        <h4 style="font-size:12.5px; display:flex; align-items:center; gap:5px;">
                            <span style="font-size:14px;">🎫</span>
                            ${c.petitioner?.name ? c.petitioner.name.split(',')[0].trim() : 'SBI'}
                        </h4>
                        <p style="font-size:11px;">${c.caseId} &bull; ₹${c.chequeAmount.toLocaleString('en-IN')}</p>
                        <p style="font-size:10px; color:var(--color-text-muted); margin-top:2px;">${c.pendingDays} days pending</p>
                    </div>
                    <div style="display:flex; flex-direction:column; align-items:flex-end; gap:3px; flex-shrink:0;">
                        <span style="height:8px; width:8px; background:${si.dot}; border-radius:50%; display:inline-block;"></span>
                        <span style="font-size:8px; font-weight:800; color:${si.color}; border:1px solid ${si.color}; padding:1px 4px; border-radius:3px; text-transform:uppercase;">${si.label}</span>
                    </div>
                </div>`;
        };

        if (pending.length > 0) {
            html += `<div class="sidebar-group-header" style="font-size:10px; font-weight:800; color:#0d9488; letter-spacing:1px; padding:12px 14px 6px; border-bottom:1px dashed var(--color-border); background:rgba(13,148,136,0.03); text-transform:uppercase;">Active Trials (${pending.length})</div>`;
            pending.forEach(c => { html += renderItem(c); });
        }
        if (settled.length > 0) {
            html += `<div class="sidebar-group-header" style="font-size:10px; font-weight:800; color:#10b981; letter-spacing:1px; padding:16px 14px 6px; border-bottom:1px dashed var(--color-border); background:rgba(16,185,129,0.02); text-transform:uppercase;">Compounded (${settled.length})</div>`;
            settled.forEach(c => { html += renderItem(c); });
        }
        if (disposed.length > 0) {
            html += `<div class="sidebar-group-header" style="font-size:10px; font-weight:800; color:var(--color-text-muted); letter-spacing:1px; padding:16px 14px 6px; border-bottom:1px dashed var(--color-border); background:rgba(255,255,255,0.01); text-transform:uppercase;">Closed Verdicts (${disposed.length})</div>`;
            disposed.forEach(c => { html += renderItem(c); });
        }

        list.innerHTML = html;
        list.querySelectorAll('[data-cheque-id]').forEach(item => {
            item.addEventListener('click', (e) => {
                state.selectedChequeCaseId = e.currentTarget.getAttribute('data-cheque-id');
                state.chequeJudgeActiveMobileTab = 'details';
                onUpdate();
            });
        });
    },

    renderDetail(detailContainer, c, state, onUpdate) {
        if (!c) {
            detailContainer.innerHTML = `
                <div class="card" style="padding:50px; text-align:center; border-top:3px solid #0d9488;">
                    <div style="font-size:40px; margin-bottom:12px;">⚖️</div>
                    <h3 style="font-size:16px; color:var(--color-text-main); margin-bottom:6px;">No Case Selected</h3>
                    <p style="font-size:13px; color:var(--color-text-muted);">Please select a Section 138 case from the left docket sidebar.</p>
                </div>`;
            return;
        }

        const isClosed = c.orderStatus === 'COMPOUNDED' || c.orderStatus === 'DECREED' || c.orderStatus === 'DISMISSED';

        detailContainer.innerHTML = `
            <!-- CASE INFO CARD -->
            <div class="card" style="border-top: 3px solid #0d9488; padding:16px; margin-bottom:16px;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px;">
                    <div>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <h3 style="font-size:16px; font-weight:800; color:var(--color-text-main);">${c.caseId}</h3>
                            <span style="font-size:10px; font-weight:800; background:rgba(13,148,136,0.12); color:#2dd4bf; border:1px solid rgba(13,148,136,0.3); padding:2px 8px; border-radius:4px;">SEC 138 NI ACT</span>
                        </div>
                        <p style="font-size:13px; color:var(--color-text-muted); margin-top:4px;">
                            <strong>${c.petitioner?.name || 'Complainant'}</strong> &mdash;vs&mdash; <strong>${c.respondent?.name || 'Accused'}</strong>
                        </p>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:12px; color:var(--color-text-muted);">Cheque Amount</div>
                        <div style="font-size:22px; font-weight:900; color:#10b981; font-family:var(--font-mono);">₹${c.chequeAmount.toLocaleString('en-IN')}</div>
                    </div>
                </div>

                <div class="case-meta-grid" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; margin-top:16px; background:rgba(255,255,255,0.02); padding:10px; border-radius:6px; border:1px solid var(--color-border);">
                    <div>
                        <span style="font-size:10px; color:var(--color-text-muted); display:block; text-transform:uppercase;">Filing Date</span>
                        <strong style="font-size:12px; color:var(--color-text-main);">${c.filingDate}</strong>
                    </div>
                    <div>
                        <span style="font-size:10px; color:var(--color-text-muted); display:block; text-transform:uppercase;">Cheque No.</span>
                        <strong style="font-size:12px; color:var(--color-text-main); font-family:var(--font-mono);">${c.chequeNumber}</strong>
                    </div>
                    <div>
                        <span style="font-size:10px; color:var(--color-text-muted); display:block; text-transform:uppercase;">IFSC / Bank</span>
                        <strong style="font-size:12px; color:var(--color-text-main);">${c.bankName} (${c.ifscCode})</strong>
                    </div>
                </div>

                <!-- MANDATORY SYNOPSIS BOX (S.138 Supreme Court Rule) -->
                <div style="margin-top:16px; background:rgba(13,148,136,0.06); border:1px solid rgba(13,148,136,0.25); border-radius:8px; padding:12px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                        <strong style="font-size:11px; color:#2dd4bf; letter-spacing:0.8px; text-transform:uppercase;">⚖️ Mandated Legal Synopsis (Filed After Index)</strong>
                        <span style="font-size:9px; background:#0d9488; color:white; padding:2px 6px; border-radius:3px; font-weight:800;">TOP FILE</span>
                    </div>
                    <p style="font-size:12px; line-height:1.5; color:var(--color-text-main); font-style:italic;">
                        "${c.synopsisText || 'Synopsis text is not recorded.'}"
                    </p>
                    <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:8px; margin-top:8px; border-top:1px dashed rgba(13,148,136,0.2); padding-top:8px; font-size:11px;">
                        <div><span style="color:var(--color-text-muted);">Dishonour Date:</span> <strong>${c.dishonourDate}</strong></div>
                        <div><span style="color:var(--color-text-muted);">Return Reason:</span> <strong style="color:var(--color-danger);">${c.dishonourReason}</strong></div>
                    </div>
                </div>
            </div>

            <!-- SUMMONS AND EARLY PAYMENT SECTION -->
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:16px;">
                <!-- SUMMONS TRACKING PANEL -->
                <div class="card" style="padding:16px;">
                    <h4 style="font-size:13px; font-weight:800; color:#0d9488; margin-bottom:12px; text-transform:uppercase; letter-spacing:0.5px;">1. Summons Delivery Tracking</h4>
                    
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.02); padding:8px 10px; border-radius:6px; border:1px solid var(--color-border);">
                            <div>
                                <span style="font-size:11px; font-weight:bold; color:var(--color-text-main); display:block;">Dasti Summons (by Complainant)</span>
                                <span style="font-size:10px; color:var(--color-text-muted);">Affidavit of Service Upload</span>
                            </div>
                            <div>
                                <select id="cheque-dasti-status" ${isClosed ? 'disabled' : ''} style="background:var(--color-card-dark); color:var(--color-text-main); border:1px solid var(--color-border); padding:4px; font-size:11px; border-radius:4px;">
                                    <option value="PENDING" ${c.dastiStatus === 'PENDING' ? 'selected' : ''}>Pending Service</option>
                                    <option value="SENT" ${c.dastiStatus === 'SENT' ? 'selected' : ''}>Dispatched dasti</option>
                                    <option value="SERVED" ${c.dastiStatus === 'SERVED' ? 'selected' : ''}>Served upon Accused</option>
                                    <option value="FAILED" ${c.dastiStatus === 'FAILED' ? 'selected' : ''}>Service Failed</option>
                                </select>
                            </div>
                        </div>

                        <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.02); padding:8px 10px; border-radius:6px; border:1px solid var(--color-border);">
                            <div>
                                <span style="font-size:11px; font-weight:bold; color:var(--color-text-main); display:block;">Electronic Summons (SC Mandated)</span>
                                <span style="font-size:10px; color:var(--color-text-muted);">WA: ${c.electronicWhatsapp || 'N/A'} &bull; Email</span>
                            </div>
                            <div>
                                <select id="cheque-electronic-status" ${isClosed ? 'disabled' : ''} style="background:var(--color-card-dark); color:var(--color-text-main); border:1px solid var(--color-border); padding:4px; font-size:11px; border-radius:4px;">
                                    <option value="PENDING" ${c.electronicStatus === 'PENDING' ? 'selected' : ''}>Pending delivery</option>
                                    <option value="SENT" ${c.electronicStatus === 'SENT' ? 'selected' : ''}>Sent (Logs verified)</option>
                                    <option value="DELIVERED" ${c.electronicStatus === 'DELIVERED' ? 'selected' : ''}>Delivered & Read</option>
                                    <option value="FAILED" ${c.electronicStatus === 'FAILED' ? 'selected' : ''}>Bounced / Failed</option>
                                </select>
                            </div>
                        </div>

                        <!-- AFFIDAVIT OF SERVICE BLOCK -->
                        <div style="display:flex; justify-content:space-between; align-items:center; padding:4px 0;">
                            <span style="font-size:11px; color:var(--color-text-muted);">Complainant Affidavit of Service:</span>
                            <span style="font-size:11px; font-weight:bold; color:${c.affidavitUploaded ? '#10b981' : '#f59e0b'};">
                                ${c.affidavitUploaded ? '✅ FILED & VERIFIED' : '❌ PENDING UPLOAD'}
                            </span>
                        </div>

                        ${!isClosed ? `
                            <div style="display:flex; gap:8px; margin-top:4px;">
                                <button id="btn-toggle-affidavit" class="btn" style="flex:1; padding:8px; font-size:11px; font-weight:bold; border-color:#0d9488; background:transparent; color:#2dd4bf; border-radius:6px; cursor:pointer;">
                                    ${c.affidavitUploaded ? 'Toggle to Pending' : 'Mark Affidavit Uploaded'}
                                </button>
                                <button id="btn-save-summons" class="btn" style="flex:1; padding:8px; font-size:11px; font-weight:bold; background:#0d9488; color:white; border:none; border-radius:6px; cursor:pointer;">
                                    Save Summons Status
                                </button>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <!-- QUICK SETTLEMENT (UPI / QR CODE DISPOSAL) -->
                <div class="card" style="padding:16px; display:flex; flex-direction:column; justify-content:space-between;">
                    <div>
                        <h4 style="font-size:13px; font-weight:800; color:#0d9488; margin-bottom:8px; text-transform:uppercase; letter-spacing:0.5px;">2. Early Settlement & Compounding</h4>
                        <p style="font-size:11.5px; color:var(--color-text-muted); line-height:1.4; margin-bottom:10px;">
                            Supreme Court rules permit the accused to voluntarily pay the cheque sum to settle proceedings instantly under Sec 147 NI Act / Sec 278 BNSS.
                        </p>
                    </div>

                    ${c.orderStatus === 'COMPOUNDED' ? `
                        <div style="background:rgba(16,185,129,0.1); border:2px solid #10b981; border-radius:8px; padding:12px; text-align:center;">
                            <div style="font-size:24px; margin-bottom:4px;">✅</div>
                            <strong style="font-size:12px; color:#10b981; display:block;">PROCEEDINGS COMPOUNDED & CLOSED</strong>
                            <span style="font-size:10.5px; color:var(--color-text-muted); display:block; margin-top:2px;">Full payment received on: ${c.paymentDate || 'Today'}</span>
                        </div>
                    ` : `
                        <div style="display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.02); padding:10px; border-radius:8px; border:1px solid var(--color-border);">
                            <div style="background:white; padding:6px; border-radius:6px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                                <!-- MOCK QR Code representing pay link -->
                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=upi://pay?pa=court.intake.rjm@upi" width="70" height="70" alt="UPI Payment QR">
                            </div>
                            <div style="flex:1;">
                                <strong style="font-size:12px; color:var(--color-text-main); display:block;">Secure QR Settlement Code</strong>
                                <span style="font-size:10px; color:var(--color-text-muted); display:block; line-height:1.3; margin:4px 0;">Summons mentions this link to facilitate threshold compromise.</span>
                                
                                ${!isClosed ? `
                                    <button id="btn-simulate-accused-payment" class="btn" style="width:100%; padding:6px 10px; font-size:11px; font-weight:800; background:#10b981; color:white; border:none; border-radius:4px; cursor:pointer;">
                                        💸 Simulate Accused Payment
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    `}
                </div>
            </div>

            <!-- SECTION 251 QUESTIONS & INTERIM DEPOSIT -->
            <div style="display:grid; grid-template-columns: 1.3fr 0.7fr; gap:16px; margin-bottom:16px;">
                <!-- QUESTIONS CARD -->
                <div class="card" style="padding:16px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                        <h4 style="font-size:13px; font-weight:800; color:#0d9488; text-transform:uppercase; letter-spacing:0.5px; margin:0;">
                            3. Section 251 Cr.P.C. / Section 274 BNSS Accused Interrogator
                        </h4>
                        <span style="font-size:9.5px; background:${c.responsesRecorded ? '#10b981' : '#f59e0b'}; color:white; padding:2px 6px; border-radius:3px; font-weight:800;">
                            ${c.responsesRecorded ? 'RECORDED' : 'AWAITING RECORDING'}
                        </span>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:8px;">
                        <div class="question-row" style="display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.04);">
                            <span style="font-size:11.5px; color:var(--color-text-main); flex:1; padding-right:12px;">Q1. Do you admit that the cheque belongs to your account?</span>
                            <div style="display:flex; gap:8px;">
                                <label style="font-size:11px; display:inline-flex; align-items:center; gap:4px; color:var(--color-text-main);">
                                    <input type="radio" name="q1" value="YES" ${c.q1_belongs_to_accused === 'YES' ? 'checked' : ''} ${isClosed ? 'disabled' : ''}> Yes
                                </label>
                                <label style="font-size:11px; display:inline-flex; align-items:center; gap:4px; color:var(--color-text-main);">
                                    <input type="radio" name="q1" value="NO" ${c.q1_belongs_to_accused === 'NO' ? 'checked' : ''} ${isClosed ? 'disabled' : ''}> No
                                </label>
                            </div>
                        </div>

                        <div class="question-row" style="display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.04);">
                            <span style="font-size:11.5px; color:var(--color-text-main); flex:1; padding-right:12px;">Q2. Do you admit that the signature on the cheque is yours?</span>
                            <div style="display:flex; gap:8px;">
                                <label style="font-size:11px; display:inline-flex; align-items:center; gap:4px; color:var(--color-text-main);">
                                    <input type="radio" name="q2" value="YES" ${c.q2_signature_is_yours === 'YES' ? 'checked' : ''} ${isClosed ? 'disabled' : ''}> Yes
                                </label>
                                <label style="font-size:11px; display:inline-flex; align-items:center; gap:4px; color:var(--color-text-main);">
                                    <input type="radio" name="q2" value="NO" ${c.q2_signature_is_yours === 'NO' ? 'checked' : ''} ${isClosed ? 'disabled' : ''}> No
                                </label>
                            </div>
                        </div>

                        <div class="question-row" style="display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.04);">
                            <span style="font-size:11.5px; color:var(--color-text-main); flex:1; padding-right:12px;">Q3. Did you issue or deliver the cheque to the complainant?</span>
                            <div style="display:flex; gap:8px;">
                                <label style="font-size:11px; display:inline-flex; align-items:center; gap:4px; color:var(--color-text-main);">
                                    <input type="radio" name="q3" value="YES" ${c.q3_delivered_to_complainant === 'YES' ? 'checked' : ''} ${isClosed ? 'disabled' : ''}> Yes
                                </label>
                                <label style="font-size:11px; display:inline-flex; align-items:center; gap:4px; color:var(--color-text-main);">
                                    <input type="radio" name="q3" value="NO" ${c.q3_delivered_to_complainant === 'NO' ? 'checked' : ''} ${isClosed ? 'disabled' : ''}> No
                                </label>
                            </div>
                        </div>

                        <div class="question-row" style="display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.04);">
                            <span style="font-size:11.5px; color:var(--color-text-main); flex:1; padding-right:12px;">Q4. Do you admit that liability existed on the date of cheque issuance?</span>
                            <div style="display:flex; gap:8px;">
                                <label style="font-size:11px; display:inline-flex; align-items:center; gap:4px; color:var(--color-text-main);">
                                    <input type="radio" name="q4" value="YES" ${c.q4_owed_liability === 'YES' ? 'checked' : ''} ${isClosed ? 'disabled' : ''}> Yes
                                </label>
                                <label style="font-size:11px; display:inline-flex; align-items:center; gap:4px; color:var(--color-text-main);">
                                    <input type="radio" name="q4" value="NO" ${c.q4_owed_liability === 'NO' ? 'checked' : ''} ${isClosed ? 'disabled' : ''}> No
                                </label>
                            </div>
                        </div>

                        <!-- Q5: DEFENCE DETAILS -->
                        <div class="question-row" style="padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.04);">
                            <span style="font-size:11.5px; color:var(--color-text-main); display:block; margin-bottom:6px;">Q5. If liability is denied, specify the defense:</span>
                            <div style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:8px;">
                                <label style="font-size:11px; color:var(--color-text-main); display:inline-flex; align-items:center; gap:4px;">
                                    <input type="radio" name="q5-type" value="SECURITY" ${c.q5_defence_type === 'SECURITY' ? 'checked' : ''} ${isClosed ? 'disabled' : ''}> Security Cheque only
                                </label>
                                <label style="font-size:11px; color:var(--color-text-main); display:inline-flex; align-items:center; gap:4px;">
                                    <input type="radio" name="q5-type" value="REPAID" ${c.q5_defence_type === 'REPAID' ? 'checked' : ''} ${isClosed ? 'disabled' : ''}> Loan already repaid
                                </label>
                                <label style="font-size:11px; color:var(--color-text-main); display:inline-flex; align-items:center; gap:4px;">
                                    <input type="radio" name="q5-type" value="ALTERED" ${c.q5_defence_type === 'ALTERED' ? 'checked' : ''} ${isClosed ? 'disabled' : ''}> Cheque altered/misused
                                </label>
                                <label style="font-size:11px; color:var(--color-text-main); display:inline-flex; align-items:center; gap:4px;">
                                    <input type="radio" name="q5-type" value="OTHER" ${c.q5_defence_type === 'OTHER' ? 'checked' : ''} ${isClosed ? 'disabled' : ''}> Other (specify below)
                                </label>
                            </div>
                            <input type="text" class="form-input code-font" id="cheque-defence-details" ${isClosed ? 'disabled' : ''} placeholder="Enter specific defense arguments..." style="font-size:11.5px; padding:6px 8px; width:100%;" value="${c.q5_defence_details || ''}">
                        </div>

                        <div class="question-row" style="display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.04);">
                            <span style="font-size:11.5px; color:var(--color-text-main); flex:1; padding-right:12px;">Q6. Do you wish to compound (compromise) the case at this stage?</span>
                            <div style="display:flex; gap:8px;">
                                <label style="font-size:11px; display:inline-flex; align-items:center; gap:4px; color:var(--color-text-main);">
                                    <input type="radio" name="q6" value="YES" ${c.q6_wish_to_compound === 'YES' ? 'checked' : ''} ${isClosed ? 'disabled' : ''}> Yes
                                </label>
                                <label style="font-size:11px; display:inline-flex; align-items:center; gap:4px; color:var(--color-text-main);">
                                    <input type="radio" name="q6" value="NO" ${c.q6_wish_to_compound === 'NO' ? 'checked' : ''} ${isClosed ? 'disabled' : ''}> No
                                </label>
                            </div>
                        </div>

                        <!-- SUMMONS TRIAL CONVERSION -->
                        <div class="question-row" style="padding:6px 0;">
                            <span style="font-size:11px; color:var(--color-text-muted); display:block; margin-bottom:4px;">If converting summary trial to summons trial, record cogent & sufficient reasons:</span>
                            <textarea id="cheque-trial-reasons" ${isClosed ? 'disabled' : ''} placeholder="Required u/s 251 CrPC. Enter reasoning here..." style="font-size:11px; padding:6px; width:100%; background:var(--color-card-dark); border:1px solid var(--color-border); color:var(--color-text-main); border-radius:4px;" rows="2">${c.summaryTrialReasons || ''}</textarea>
                        </div>

                        ${!isClosed ? `
                            <button id="btn-save-questions" class="btn" style="width:100%; padding:10px; font-weight:800; background:#0d9488; color:white; border:none; border-radius:6px; cursor:pointer;">
                                ✍️ Record Accused Responses to Order Sheet
                            </button>
                        ` : ''}
                    </div>
                </div>

                <!-- SECTION 143-A INTERIM COMPENSATION -->
                <div class="card" style="padding:16px; display:flex; flex-direction:column; justify-content:space-between;">
                    <div>
                        <h4 style="font-size:13px; font-weight:800; color:#0d9488; margin-bottom:10px; text-transform:uppercase; letter-spacing:0.5px;">4. Interim Deposit (S. 143-A NI Act)</h4>
                        
                        <div style="background:rgba(255,255,255,0.01); border:1px solid var(--color-border); padding:10px; border-radius:6px; margin-bottom:10px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                                <span style="font-size:11.5px; color:var(--color-text-muted);">Interim Status:</span>
                                <strong style="font-size:12px; color:${c.interimStatus === 'DEPOSITED' ? '#10b981' : '#f59e0b'};">
                                    ${c.interimStatus.toUpperCase()}
                                </strong>
                            </div>
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span style="font-size:11.5px; color:var(--color-text-muted);">Amount Ordered (Max 20%):</span>
                                <strong style="font-size:12px; color:var(--color-text-main);">₹${(c.interimAmount || 0).toLocaleString('en-IN')}</strong>
                            </div>
                        </div>

                        ${!isClosed ? `
                            <div class="form-group" style="margin-bottom:12px;">
                                <label style="font-size:11px; margin-bottom:4px; display:block;">Issue Interim Deposit Order (₹)</label>
                                <input type="number" class="form-input code-font" id="cheque-interim-amount" placeholder="Up to ₹${(c.chequeAmount * 0.2).toFixed(0)} (20%)" value="${c.interimAmount || ''}" style="font-size:12px; padding:6px 8px;">
                            </div>
                            <div class="form-group">
                                <label style="font-size:11px; margin-bottom:4px; display:block;">Deposit Status</label>
                                <select id="cheque-interim-status" style="background:var(--color-card-dark); color:var(--color-text-main); border:1px solid var(--color-border); padding:6px; font-size:11px; border-radius:4px; width:100%;">
                                    <option value="N/A" ${c.interimStatus === 'N/A' ? 'selected' : ''}>Not Ordered</option>
                                    <option value="PENDING" ${c.interimStatus === 'PENDING' ? 'selected' : ''}>Pending (60 days limit)</option>
                                    <option value="DEPOSITED" ${c.interimStatus === 'DEPOSITED' ? 'selected' : ''}>Deposited to Court</option>
                                </select>
                            </div>
                        ` : ''}
                    </div>

                    ${!isClosed ? `
                        <button id="btn-save-interim" class="btn" style="width:100%; padding:8px 10px; font-size:11px; font-weight:800; border-color:#0d9488; background:transparent; color:#2dd4bf; border-radius:6px; cursor:pointer; margin-top:10px;">
                            Save Interim Compensation Order
                        </button>
                    ` : ''}
                </div>
            </div>

            <!-- FINAL JUDGMENT FORM -->
            <div class="card" style="padding:16px; margin-bottom:16px;">
                <h4 style="font-size:13px; font-weight:800; color:#0d9488; margin-bottom:12px; text-transform:uppercase; letter-spacing:0.5px;">5. Final Order / Pass Judgment</h4>
                
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
                    <div>
                        <div class="form-group" style="margin-bottom:10px;">
                            <label style="font-size:11px; margin-bottom:4px; display:block;">Final Verdict Status</label>
                            <select id="cheque-final-verdict" ${isClosed ? 'disabled' : ''} style="background:var(--color-card-dark); color:var(--color-text-main); border:1px solid var(--color-border); padding:6px; font-size:11px; border-radius:4px; width:100%;">
                                <option value="PENDING" ${c.orderStatus === 'PENDING' || c.orderStatus === 'SUMMONS_ISSUED' ? 'selected' : ''}>Awaiting Verdict</option>
                                <option value="DECREED" ${c.orderStatus === 'DECREED' ? 'selected' : ''}>Decreed (Convicted u/s 138)</option>
                                <option value="DISMISSED" ${c.orderStatus === 'DISMISSED' ? 'selected' : ''}>Dismissed (Acquitted)</option>
                                <option value="COMPOUNDED" ${c.orderStatus === 'COMPOUNDED' ? 'selected' : ''}>Compounded u/s 147 (Compromised)</option>
                            </select>
                        </div>
                        <div class="form-group" style="margin-bottom:10px;">
                            <label style="font-size:11px; margin-bottom:4px; display:block;">Sentence / Penalty details (If Convicted)</label>
                            <input type="text" class="form-input code-font" id="cheque-sentence-details" ${isClosed ? 'disabled' : ''} placeholder="e.g. Fine of ₹9,00,000 and 1 year prison" style="font-size:11.5px; padding:6px 8px;" value="${c.judgeRemarks || ''}">
                        </div>
                        <div class="form-group">
                            <label style="font-size:11px; margin-bottom:4px; display:block;">Digital Signature Hash Token</label>
                            <input type="text" class="form-input code-font" id="cheque-signature-token" ${isClosed ? 'disabled' : ''} placeholder="SHA-256 Auth Hash..." style="font-size:11.5px; padding:6px 8px;" value="${c.digitalSignature || ''}">
                        </div>
                    </div>

                    <div style="display:flex; flex-direction:column; justify-content:space-between;">
                        <div class="form-group" style="flex:1; display:flex; flex-direction:column;">
                            <label style="font-size:11px; margin-bottom:4px; display:block;">Final Order / Judgment Text</label>
                            <textarea id="cheque-decree-text" ${isClosed ? 'disabled' : ''} placeholder="Enter the final verdict decree text..." style="font-size:11px; padding:6px; flex:1; width:100%; background:var(--color-card-dark); border:1px solid var(--color-border); color:var(--color-text-main); border-radius:4px;" rows="4">${c.decreeText || ''}</textarea>
                        </div>

                        ${!isClosed ? `
                            <button id="btn-save-verdict" class="btn" style="width:100%; padding:10px; font-weight:800; background:#0d9488; color:white; border:none; border-radius:6px; cursor:pointer; margin-top:10px;">
                                📜 Pass Final Judgment & Close Case
                            </button>
                        ` : `
                            <div style="background:rgba(255,255,255,0.02); border:1px solid var(--color-border); padding:8px; border-radius:6px; font-size:11px; color:var(--color-text-muted); margin-top:10px; text-align:center;">
                                Case closed on verdict. Sign: <code>${c.digitalSignature || 'SECURE-DIG-SIG'}</code>
                            </div>
                        `}
                    </div>
                </div>
            </div>

            <!-- PROCEEDINGS HEARING HISTORY LOGS -->
            <div class="card" style="padding:16px;">
                <h4 style="font-size:13px; font-weight:800; color:#0d9488; margin-bottom:12px; text-transform:uppercase; letter-spacing:0.5px;">6. Case Timeline & Hearing History</h4>
                <div style="display:flex; flex-direction:column; gap:8px;">
                    ${c.hearingHistory.map(h => `
                        <div style="display:flex; gap:12px; border-bottom:1px solid rgba(255,255,255,0.03); padding-bottom:6px;">
                            <span style="font-size:11.5px; color:#2dd4bf; font-family:var(--font-mono); width:80px; flex-shrink:0;">${h.date}</span>
                            <span style="font-size:12px; color:var(--color-text-main);">${h.note}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Event wiring
        const btnToggleAffidavit = detailContainer.querySelector('#btn-toggle-affidavit');
        const btnSaveSummons = detailContainer.querySelector('#btn-save-summons');
        const btnSimulatePay = detailContainer.querySelector('#btn-simulate-accused-payment');
        const btnSaveQuestions = detailContainer.querySelector('#btn-save-questions');
        const btnSaveInterim = detailContainer.querySelector('#btn-save-interim');
        const btnSaveVerdict = detailContainer.querySelector('#btn-save-verdict');

        if (btnToggleAffidavit) {
            btnToggleAffidavit.addEventListener('click', () => {
                c.affidavitUploaded = !c.affidavitUploaded;
                onUpdate();
            });
        }

        if (btnSaveSummons) {
            btnSaveSummons.addEventListener('click', async () => {
                const dastiStatus = detailContainer.querySelector('#cheque-dasti-status').value;
                const electronicStatus = detailContainer.querySelector('#cheque-electronic-status').value;
                
                let nextHearingDate = c.nextHearingDate;
                let stageSummary = c.orderStatus;
                let note = '';

                if (dastiStatus === 'SERVED' || electronicStatus === 'DELIVERED') {
                    stageSummary = 'SUMMONS_ISSUED';
                    note = 'Summons service report verified. Accused served successfully.';
                } else {
                    note = `Summons status updated: Dasti: ${dastiStatus}, Electronic: ${electronicStatus}.`;
                }

                try {
                    const res = await fetch(`/api/cheque-cases/${c.caseId}/summons`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            dastiStatus,
                            electronicStatus,
                            affidavitUploaded: c.affidavitUploaded,
                            nextHearingDate,
                            stageSummary,
                            note
                        })
                    });
                    if (res.ok) {
                        alert('Summons status updated successfully!');
                        await state.syncWithCloudBackend();
                    }
                } catch (e) {
                    console.error(e);
                }
            });
        }

        if (btnSimulatePay) {
            btnSimulatePay.addEventListener('click', async () => {
                if (!confirm(`Simulate payment of the full cheque amount of ₹${c.chequeAmount.toLocaleString('en-IN')}?`)) return;
                try {
                    const res = await fetch(`/api/cheque-cases/${c.caseId}/pay`, {
                        method: 'POST'
                    });
                    if (res.ok) {
                        alert('Early payment received! Proceedings compounded u/s 147 NI Act.');
                        await state.syncWithCloudBackend();
                    }
                } catch (e) {
                    console.error(e);
                }
            });
        }

        if (btnSaveQuestions) {
            btnSaveQuestions.addEventListener('click', async () => {
                const q1Val = detailContainer.querySelector('input[name="q1"]:checked')?.value || 'PENDING';
                const q2Val = detailContainer.querySelector('input[name="q2"]:checked')?.value || 'PENDING';
                const q3Val = detailContainer.querySelector('input[name="q3"]:checked')?.value || 'PENDING';
                const q4Val = detailContainer.querySelector('input[name="q4"]:checked')?.value || 'PENDING';
                const q6Val = detailContainer.querySelector('input[name="q6"]:checked')?.value || 'PENDING';
                
                const q5Type = detailContainer.querySelector('input[name="q5-type"]:checked')?.value || 'N/A';
                const q5Details = detailContainer.querySelector('#cheque-defence-details').value;
                const trialReasons = detailContainer.querySelector('#cheque-trial-reasons').value;

                const hasAnswers = q1Val !== 'PENDING' && q2Val !== 'PENDING' && q3Val !== 'PENDING';
                
                let orderStatus = c.orderStatus;
                if (hasAnswers) {
                    orderStatus = 'PENDING'; // Remains pending for final trial or compromise
                }

                try {
                    const res = await fetch(`/api/cheque-cases/${c.caseId}/trial`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            summaryTrialReasons: trialReasons,
                            q1: q1Val,
                            q2: q2Val,
                            q3: q3Val,
                            q4: q4Val,
                            q5_type: q5Type,
                            q5_details: q5Details,
                            q6: q6Val,
                            responsesRecorded: hasAnswers,
                            orderStatus
                        })
                    });
                    if (res.ok) {
                        alert('Post-cognizance summary trial responses saved in order sheet!');
                        await state.syncWithCloudBackend();
                    }
                } catch (e) {
                    console.error(e);
                }
            });
        }

        if (btnSaveInterim) {
            btnSaveInterim.addEventListener('click', async () => {
                const amountVal = parseFloat(detailContainer.querySelector('#cheque-interim-amount').value || 0);
                const statusVal = detailContainer.querySelector('#cheque-interim-status').value;

                if (amountVal > c.chequeAmount * 0.2) {
                    alert('Section 143-A interim compensation cannot exceed 20% of the cheque amount.');
                    return;
                }

                try {
                    const res = await fetch(`/api/cheque-cases/${c.caseId}/interim`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            interimOrdered: amountVal > 0,
                            interimAmount: amountVal,
                            interimStatus: statusVal
                        })
                    });
                    if (res.ok) {
                        alert('Interim compensation order details updated.');
                        await state.syncWithCloudBackend();
                    }
                } catch (e) {
                    console.error(e);
                }
            });
        }

        if (btnSaveVerdict) {
            btnSaveVerdict.addEventListener('click', async () => {
                const verdict = detailContainer.querySelector('#cheque-final-verdict').value;
                const remarks = detailContainer.querySelector('#cheque-sentence-details').value;
                const signature = detailContainer.querySelector('#cheque-signature-token').value;
                const decreeText = detailContainer.querySelector('#cheque-decree-text').value;

                if (verdict === 'PENDING') {
                    alert('Please select a final verdict status (Decreed, Dismissed, or Compounded).');
                    return;
                }
                if (!signature) {
                    alert('Magistrate digital signature token is required to close the case.');
                    return;
                }

                try {
                    const res = await fetch(`/api/cheque-cases/${c.caseId}/verdict`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            verdict,
                            remarks,
                            signature,
                            decreeText
                        })
                    });
                    if (res.ok) {
                        alert('Final judgment passed. The case is now closed on verdict.');
                        await state.syncWithCloudBackend();
                    }
                } catch (e) {
                    console.error(e);
                }
            });
        }
    }
};
