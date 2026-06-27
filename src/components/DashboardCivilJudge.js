/**
 * VERDIQO: CIVIL COURT JUDGE DASHBOARD
 * Quantex Intelligence Systems (P) Ltd.
 * Principal Civil Judge (Junior Division) — Civil Plaint Suits Only.
 * Handles: Property Disputes, Money Recovery, Matrimonial, Contract Breach, etc.
 * Civil plaints are handled by DashboardCivilJudge.
 */

export const DashboardCivilJudge = {
    render(container, state, onUpdate) {
        // Initialize state
        if (!state.civilJudgeActiveMobileTab) state.civilJudgeActiveMobileTab = 'listings';

        const civilCases = state.civilCases || [];

        // Civil case selection
        let selectedCase = null;
        if (state.selectedCivilCaseId) {
            selectedCase = civilCases.find(c => c.caseId === state.selectedCivilCaseId);
        }
        if (!selectedCase && civilCases.length > 0) {
            selectedCase = civilCases[0];
            state.selectedCivilCaseId = selectedCase.caseId;
        }

        // Docket stats
        const totalCases    = civilCases.length;
        const pendingCases  = civilCases.filter(c => c.orderStatus === 'PENDING').length;
        const interimCases  = civilCases.filter(c => c.orderStatus === 'INTERIM_ORDER').length;
        const decreeCases   = civilCases.filter(c => c.orderStatus === 'FINAL_DECREE').length;
        const oldestPending = civilCases.filter(c => c.orderStatus === 'PENDING').reduce((max, c) => Math.max(max, c.pendingDays || 0), 0);
        const urgentCount   = civilCases.filter(c => c.pendingDays > 700 && c.orderStatus === 'PENDING').length;

        container.innerHTML = `
            <!-- PAGE HEADER -->
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
                <div>
                    <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">
                        <div style="width:40px; height:40px; background:linear-gradient(135deg, rgba(30,58,138,0.3), rgba(30,58,138,0.1)); border:2px solid #2563eb; border-radius:10px; display:flex; align-items:center; justify-content:center;">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#2563eb" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                        </div>
                        <div>
                            <h2 style="font-size:18px; font-weight:800; color:var(--color-text-main); font-family:var(--font-headings);">Civil Court Docket</h2>
                            <p style="font-size:12px; color:#2563eb; font-weight:700;">${state.currentUser?.designation || 'Civil Court Judge'} &mdash; ${state.currentUser?.court || 'Civil Court Room 1'}</p>
                        </div>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:11px; padding:4px 10px; background:rgba(30,58,138,0.12); border:1px solid rgba(30,58,138,0.3); border-radius:20px; color:#60a5fa; font-weight:700;">&#128275; CIVIL BENCH ONLY</span>
                    ${urgentCount > 0 ? `<span style="font-size:11px; padding:4px 10px; background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); border-radius:20px; color:var(--color-danger); font-weight:700;">&#9888; ${urgentCount} Case(s) Aged 700+ Days</span>` : ''}
                </div>
            </div>

            <!-- DOCKET SUMMARY CARDS -->
            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px; margin-bottom:20px;">
                <div style="background:linear-gradient(135deg, rgba(30,58,138,0.14) 0%, rgba(30,58,138,0.04) 100%); border:1px solid rgba(30,58,138,0.3); border-radius:10px; padding:14px 16px;">
                    <div style="font-size:10px; font-weight:800; letter-spacing:1px; color:#2563eb; text-transform:uppercase; margin-bottom:8px;">Total Civil Cases</div>
                    <div style="font-size:30px; font-weight:800; color:var(--color-text-main); font-family:var(--font-headings); line-height:1;">${totalCases}</div>
                    <div style="font-size:11px; color:var(--color-text-muted); margin-top:6px;">On Civil Docket</div>
                </div>
                <div style="background:linear-gradient(135deg, rgba(251,146,60,0.12) 0%, rgba(251,146,60,0.04) 100%); border:1px solid rgba(251,146,60,0.25); border-radius:10px; padding:14px 16px;">
                    <div style="font-size:10px; font-weight:800; letter-spacing:1px; color:#fb923c; text-transform:uppercase; margin-bottom:8px;">Pending Order</div>
                    <div style="font-size:30px; font-weight:800; color:var(--color-text-main); font-family:var(--font-headings); line-height:1;">${pendingCases}</div>
                    <div style="font-size:11px; color:var(--color-text-muted); margin-top:6px;">Oldest: ${oldestPending} days</div>
                </div>
                <div style="background:linear-gradient(135deg, rgba(96,165,250,0.12) 0%, rgba(96,165,250,0.04) 100%); border:1px solid rgba(96,165,250,0.25); border-radius:10px; padding:14px 16px;">
                    <div style="font-size:10px; font-weight:800; letter-spacing:1px; color:#60a5fa; text-transform:uppercase; margin-bottom:8px;">Interim Order</div>
                    <div style="font-size:30px; font-weight:800; color:var(--color-text-main); font-family:var(--font-headings); line-height:1;">${interimCases}</div>
                    <div style="font-size:11px; color:var(--color-text-muted); margin-top:6px;">Active interim orders</div>
                </div>
                <div style="background:linear-gradient(135deg, rgba(74,222,128,0.12) 0%, rgba(74,222,128,0.04) 100%); border:1px solid rgba(74,222,128,0.25); border-radius:10px; padding:14px 16px;">
                    <div style="font-size:10px; font-weight:800; letter-spacing:1px; color:var(--color-success); text-transform:uppercase; margin-bottom:8px;">Final Decree</div>
                    <div style="font-size:30px; font-weight:800; color:var(--color-text-main); font-family:var(--font-headings); line-height:1;">${decreeCases}</div>
                    <div style="font-size:11px; color:var(--color-text-muted); margin-top:6px;">Suits disposed</div>
                </div>
            </div>

            <!-- MOBILE TAB SWITCHER -->
            <div class="judge-mobile-tabs" style="display:none; margin-bottom:16px; background:var(--color-card-dark); border:1px solid var(--color-border); border-radius:8px; padding:6px; gap:8px;">
                <button id="civil-m-tab-listings" style="flex:1; padding:10px; font-size:13px; text-align:center; border:1px solid ${state.civilJudgeActiveMobileTab === 'listings' ? '#2563eb' : 'var(--color-border)'}; background:${state.civilJudgeActiveMobileTab === 'listings' ? 'rgba(30,58,138,0.1)' : 'transparent'}; color:${state.civilJudgeActiveMobileTab === 'listings' ? '#60a5fa' : 'var(--color-text-muted)'}; font-weight:700; border-radius:6px; cursor:pointer;">Civil Docket List</button>
                <button id="civil-m-tab-details" style="flex:1; padding:10px; font-size:13px; text-align:center; border:1px solid ${state.civilJudgeActiveMobileTab === 'details' ? '#2563eb' : 'var(--color-border)'}; background:${state.civilJudgeActiveMobileTab === 'details' ? 'rgba(30,58,138,0.1)' : 'transparent'}; color:${state.civilJudgeActiveMobileTab === 'details' ? '#60a5fa' : 'var(--color-text-muted)'}; font-weight:700; border-radius:6px; cursor:pointer;">Case Details</button>
            </div>

            <!-- MAIN LAYOUT -->
            <div class="judge-container ${state.civilJudgeActiveMobileTab}">
                <!-- LEFT SIDEBAR -->
                <div class="hearing-list-sidebar" style="border-top:3px solid #2563eb;">
                    <div class="sidebar-title" style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="display:flex; align-items:center; gap:6px;">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#2563eb" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            <span style="color:#60a5fa;">Civil Plaint Docket</span>
                        </span>
                        <span style="background:rgba(30,58,138,0.3); color:#60a5fa; font-family:var(--font-mono); font-size:11px; padding:2px 8px; border-radius:4px; font-weight:700;">${totalCases} Suits</span>
                    </div>
                    <div class="hearing-list" id="civil-judge-hearing-list"></div>
                </div>

                <!-- RIGHT DETAIL PANEL -->
                <div class="hearing-detail-view" id="civil-judge-detail-panel"></div>
            </div>
        `;

        // Mobile tab events
        const mTabList = container.querySelector('#civil-m-tab-listings');
        const mTabDet  = container.querySelector('#civil-m-tab-details');
        if (mTabList) mTabList.addEventListener('click', () => { state.civilJudgeActiveMobileTab = 'listings'; onUpdate(); });
        if (mTabDet)  mTabDet.addEventListener('click', () => { state.civilJudgeActiveMobileTab = 'details'; onUpdate(); });

        this.renderSidebar(container.querySelector('#civil-judge-hearing-list'), state, onUpdate);
        this.renderDetail(container.querySelector('#civil-judge-detail-panel'), selectedCase, state, onUpdate);
    },

    // ─────────────────────────────────────────────
    //  SIDEBAR — Civil Plaint List
    // ─────────────────────────────────────────────
    renderSidebar(list, state, onUpdate) {
        const civilCases = state.civilCases || [];
        if (civilCases.length === 0) {
            list.innerHTML = `<div style="padding:20px; text-align:center; color:var(--color-text-muted); font-size:13px;">No civil plaints on docket.</div>`;
            return;
        }

        const typeIcons = {
            'Property Dispute':   '&#127968;',
            'Money Recovery Suit': '&#128176;',
            'Matrimonial (Divorce)': '&#128141;',
            'Contract Breach':    '&#128196;'
        };

        const statusInfo = {
            'PENDING':       { color: '#fb923c', dot: 'var(--color-warning)',    label: 'Pending' },
            'INTERIM_ORDER': { color: '#60a5fa', dot: '#60a5fa',                 label: 'Interim Order' },
            'FINAL_DECREE':  { color: 'var(--color-success)', dot: 'var(--color-success)', label: 'Decree Passed' },
            'POSTPONED':     { color: 'var(--color-text-muted)', dot: 'var(--color-text-muted)', label: 'Postponed' }
        };

        const pending  = civilCases.filter(c => c.orderStatus === 'PENDING');
        const interim  = civilCases.filter(c => c.orderStatus === 'INTERIM_ORDER');
        const disposed = civilCases.filter(c => c.orderStatus === 'FINAL_DECREE' || c.orderStatus === 'POSTPONED');

        let html = '';

        const renderItem = (c) => {
            const isSelected = c.caseId === state.selectedCivilCaseId;
            const si = statusInfo[c.orderStatus] || statusInfo['PENDING'];
            const ageWarn = c.pendingDays > 700 && c.orderStatus === 'PENDING';
            const icon = typeIcons[c.civilType] || '&#9878;';

            return `
                <div class="hearing-item ${isSelected ? 'active' : ''}" data-civil-id="${c.caseId}"
                     style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px; border-left:3px solid ${isSelected ? '#2563eb' : 'transparent'};">
                    <div class="hearing-meta" style="flex:1;">
                        <h4 style="font-size:12.5px; display:flex; align-items:center; gap:5px;">
                            <span style="font-size:14px;">${icon}</span>
                            ${c.petitioner.name.split('(')[0].trim()}
                        </h4>
                        <p style="font-size:11px;">${c.caseId} &bull; ${c.civilType}</p>
                        ${ageWarn
                            ? `<p style="font-size:10px; color:var(--color-danger); font-weight:700; margin-top:2px;">&#9888; Aged ${c.pendingDays} days &mdash; URGENT</p>`
                            : `<p style="font-size:10px; color:var(--color-text-muted); margin-top:2px;">${c.pendingDays} days pending</p>`}
                    </div>
                    <div style="display:flex; flex-direction:column; align-items:flex-end; gap:3px; flex-shrink:0;">
                        <span style="height:8px; width:8px; background:${si.dot}; border-radius:50%; display:inline-block;"></span>
                        ${c.orderStatus !== 'PENDING' ? `<span style="font-size:8px; font-weight:800; color:${si.color}; border:1px solid ${si.color}; padding:1px 4px; border-radius:3px; text-transform:uppercase;">${si.label}</span>` : ''}
                    </div>
                </div>`;
        };

        if (pending.length > 0) {
            html += `<div class="sidebar-group-header" style="font-size:10px; font-weight:800; color:#2563eb; letter-spacing:1px; padding:12px 14px 6px; border-bottom:1px dashed var(--color-border); background:rgba(30,58,138,0.03); text-transform:uppercase;">Awaiting Order (${pending.length})</div>`;
            pending.forEach(c => { html += renderItem(c); });
        }

        if (interim.length > 0) {
            html += `<div class="sidebar-group-header" style="font-size:10px; font-weight:800; color:#60a5fa; letter-spacing:1px; padding:16px 14px 6px; border-bottom:1px dashed var(--color-border); background:rgba(96,165,250,0.02); text-transform:uppercase;">Interim Orders Active (${interim.length})</div>`;
            interim.forEach(c => { html += renderItem(c); });
        }

        if (disposed.length > 0) {
            html += `<div class="sidebar-group-header" style="font-size:10px; font-weight:800; color:var(--color-text-muted); letter-spacing:1px; padding:16px 14px 6px; border-bottom:1px dashed var(--color-border); background:rgba(255,255,255,0.01); text-transform:uppercase;">Disposed (${disposed.length})</div>`;
            disposed.forEach(c => { html += renderItem(c); });
        }

        list.innerHTML = html;
        list.querySelectorAll('[data-civil-id]').forEach(item => {
            item.addEventListener('click', (e) => {
                state.selectedCivilCaseId = e.currentTarget.getAttribute('data-civil-id');
                state.civilJudgeActiveMobileTab = 'details';
                onUpdate();
            });
        });
    },

    // ─────────────────────────────────────────────
    //  DETAIL PANEL — Selected Civil Case
    // ─────────────────────────────────────────────
    renderDetail(detailContainer, c, state, onUpdate) {
        if (!c) {
            detailContainer.innerHTML = `
                <div class="card" style="padding:50px; text-align:center; border-top:3px solid #2563eb;">
                    <div style="width:60px; height:60px; background:rgba(30,58,138,0.1); border:2px solid rgba(30,58,138,0.3); border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 16px;">
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#2563eb" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <h3 style="font-family:var(--font-headings); font-size:22px; color:var(--color-text-main);">No Civil Case Selected</h3>
                    <p style="color:var(--color-text-muted); font-size:14px; margin-top:8px;">Select a case from the civil docket on the left to begin adjudication.</p>
                </div>`;
            return;
        }

        const statusStyles = {
            'PENDING':       { bg: 'rgba(251,146,60,0.1)',  color: '#fb923c',            label: 'PENDING ORDER' },
            'INTERIM_ORDER': { bg: 'rgba(96,165,250,0.1)',  color: '#60a5fa',            label: 'INTERIM ORDER IN EFFECT' },
            'FINAL_DECREE':  { bg: 'rgba(74,222,128,0.1)', color: 'var(--color-success)', label: 'FINAL DECREE PASSED' },
            'POSTPONED':     { bg: 'rgba(156,163,175,0.1)', color: 'var(--color-text-muted)', label: 'POSTPONED' }
        };
        const ss = statusStyles[c.orderStatus] || statusStyles['PENDING'];

        const hearingTimelineHtml = (c.hearingHistory || []).map((h, i) => `
            <div style="display:flex; gap:12px; align-items:flex-start;">
                <div style="display:flex; flex-direction:column; align-items:center;">
                    <div style="width:10px; height:10px; border-radius:50%; background:${i === (c.hearingHistory.length - 1) ? '#2563eb' : 'var(--color-border)'}; border:2px solid ${i === (c.hearingHistory.length - 1) ? 'rgba(30,58,138,0.3)' : 'transparent'}; flex-shrink:0; margin-top:3px;"></div>
                    ${i < c.hearingHistory.length - 1 ? `<div style="width:1px; height:28px; background:var(--color-border); margin-top:2px;"></div>` : ''}
                </div>
                <div style="flex:1; padding-bottom:2px;">
                    <div style="font-size:10px; font-family:var(--font-mono); color:#2563eb; font-weight:700;">${h.date}</div>
                    <div style="font-size:12px; color:var(--color-text-main); margin-top:2px; line-height:1.4;">${h.note}</div>
                </div>
            </div>`).join('');

        const interimHtml = (c.interimOrders || []).map(o =>
            `<div style="background:rgba(96,165,250,0.07); border:1px solid rgba(96,165,250,0.2); border-radius:6px; padding:8px 12px; font-size:12px; color:var(--color-text-main); line-height:1.5; display:flex; gap:8px;">
                <span style="color:#60a5fa; font-weight:700;">&#9673;</span><span>${o}</span>
            </div>`).join('');

        detailContainer.innerHTML = `
            <!-- CASE HEADER CARD -->
            <div class="card" style="margin-bottom:18px; border-top:3px solid #2563eb;">
                <div class="card-body" style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:14px;">
                    <div style="flex:1;">
                        <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px; flex-wrap:wrap;">
                            <span style="font-size:10px; font-weight:800; padding:2px 8px; border-radius:4px; background:rgba(30,58,138,0.2); color:#60a5fa; text-transform:uppercase;">CIVIL &bull; ${c.civilType}</span>
                            <span style="font-size:10px; font-weight:800; padding:2px 8px; border-radius:4px; background:${ss.bg}; color:${ss.color}; text-transform:uppercase;">${ss.label}</span>
                        </div>
                        <h3 style="font-size:17px; color:var(--color-text-main); font-family:var(--font-headings);">${c.petitioner.name}</h3>
                        <p style="font-size:11.5px; color:var(--color-text-muted); font-family:var(--font-mono); margin-top:3px;">
                            ${c.caseId} &nbsp;|&nbsp; Filed: ${c.filingDate} &nbsp;|&nbsp; Pending: 
                            <strong style="color:${c.pendingDays > 700 ? 'var(--color-danger)' : c.pendingDays > 365 ? '#fb923c' : 'var(--color-text-main)'};">${c.pendingDays} days</strong>
                            ${c.pendingDays > 700 ? ' <span style="color:var(--color-danger); font-weight:800;">&#9888; AGED</span>' : ''}
                        </p>
                    </div>
                    <div style="display:flex; gap:10px; flex-wrap:wrap;">
                        <div style="text-align:center; padding:10px 16px; background:rgba(255,255,255,0.04); border-radius:8px; border:1px solid var(--color-border);">
                            <div style="font-size:10px; color:var(--color-text-muted); margin-bottom:3px;">Last Hearing</div>
                            <div style="font-size:13px; font-weight:700; color:var(--color-text-main); font-family:var(--font-mono);">${c.lastHearingDate}</div>
                        </div>
                        <div style="text-align:center; padding:10px 16px; background:rgba(30,58,138,0.08); border-radius:8px; border:1px solid rgba(30,58,138,0.2);">
                            <div style="font-size:10px; color:#2563eb; margin-bottom:3px;">Next Hearing</div>
                            <div style="font-size:13px; font-weight:700; color:#60a5fa; font-family:var(--font-mono);">${c.nextHearingDate}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- THREE PANEL LAYOUT -->
            <div class="case-panels-layout">
                <!-- PANEL 1: PARTIES -->
                <div class="panel-col">
                    <div class="panel-inner">
                        <div class="panel-header" style="display:flex; align-items:center; gap:6px;">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#2563eb" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                            <span>Parties &amp; Legal Representation</span>
                        </div>
                        <div class="panel-body" style="display:flex; flex-direction:column; gap:12px;">
                            <!-- Petitioner -->
                            <div style="background:rgba(30,58,138,0.07); border:1px solid rgba(30,58,138,0.2); border-radius:8px; padding:12px;">
                                <div style="font-size:10px; font-weight:800; letter-spacing:1px; color:#2563eb; text-transform:uppercase; margin-bottom:8px;">&#9654; Petitioner / Plaintiff</div>
                                <div style="font-size:13px; font-weight:700; color:var(--color-text-main); margin-bottom:4px;">${c.petitioner.name}</div>
                                <div style="font-size:11.5px; color:var(--color-text-muted); margin-bottom:3px;">&#128205; ${c.petitioner.address}</div>
                                <div style="font-size:11px; color:var(--color-text-muted); font-family:var(--font-mono); margin-bottom:6px;">&#128222; ${c.petitioner.mobileNumber}</div>
                                <div style="padding:6px 10px; background:rgba(201,168,76,0.08); border-radius:4px; font-size:11.5px; color:var(--color-gold-light);">
                                    <strong>Advocate:</strong> ${c.petitioner.advocate}
                                </div>
                            </div>

                            <!-- Respondent -->
                            <div style="background:rgba(239,68,68,0.05); border:1px solid rgba(239,68,68,0.15); border-radius:8px; padding:12px;">
                                <div style="font-size:10px; font-weight:800; letter-spacing:1px; color:#f87171; text-transform:uppercase; margin-bottom:8px;">&#9660; Respondent / Defendant</div>
                                <div style="font-size:13px; font-weight:700; color:var(--color-text-main); margin-bottom:4px;">${c.respondent.name}</div>
                                <div style="font-size:11.5px; color:var(--color-text-muted); margin-bottom:3px;">&#128205; ${c.respondent.address}</div>
                                <div style="font-size:11px; color:var(--color-text-muted); font-family:var(--font-mono); margin-bottom:6px;">&#128222; ${c.respondent.mobileNumber}</div>
                                <div style="padding:6px 10px; background:rgba(201,168,76,0.08); border-radius:4px; font-size:11.5px; color:var(--color-gold-light);">
                                    <strong>Advocate:</strong> ${c.respondent.advocate}
                                </div>
                            </div>

                            <!-- Relief Sought -->
                            <div style="background:rgba(255,255,255,0.03); border:1px solid var(--color-border); border-radius:8px; padding:12px;">
                                <div style="font-size:10px; font-weight:800; letter-spacing:1px; color:var(--color-gold); text-transform:uppercase; margin-bottom:6px;">Relief / Prayer Sought</div>
                                <div style="font-size:12px; color:var(--color-text-main); line-height:1.6;">${c.reliefSought}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- PANEL 2: CASE FACTS & ORDERS -->
                <div class="panel-col">
                    <div class="panel-inner">
                        <div class="panel-header" style="display:flex; align-items:center; gap:6px;">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--color-gold)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                            <span>Case Facts, Stage &amp; Orders</span>
                        </div>
                        <div class="panel-body" style="display:flex; flex-direction:column; gap:12px;">
                            <!-- Subject Matter -->
                            <div style="background:rgba(255,255,255,0.03); border:1px solid var(--color-border); border-radius:8px; padding:12px;">
                                <div style="font-size:10px; font-weight:800; letter-spacing:1px; color:var(--color-gold); text-transform:uppercase; margin-bottom:6px;">Subject Matter &amp; Facts</div>
                                <div style="font-size:12px; color:var(--color-text-main); line-height:1.7;">${c.propertyDetails}</div>
                            </div>

                            <!-- Current Stage -->
                            <div style="background:rgba(201,168,76,0.07); border:1px solid rgba(201,168,76,0.2); border-radius:8px; padding:12px; display:flex; gap:10px;">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--color-gold)" stroke-width="2.5" style="flex-shrink:0; margin-top:2px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                <div>
                                    <div style="font-size:10px; font-weight:800; letter-spacing:1px; color:var(--color-gold); text-transform:uppercase; margin-bottom:4px;">Current Stage</div>
                                    <div style="font-size:12.5px; color:var(--color-text-main); font-weight:600; line-height:1.5;">${c.stageSummary}</div>
                                </div>
                            </div>

                            <!-- Interim Orders -->
                            ${c.interimOrders && c.interimOrders.length > 0 ? `
                            <div>
                                <div style="font-size:10px; font-weight:800; letter-spacing:1px; color:#60a5fa; text-transform:uppercase; margin-bottom:8px;">Active Interim / Interlocutory Orders</div>
                                <div style="display:flex; flex-direction:column; gap:6px;">${interimHtml}</div>
                            </div>` : `
                            <div style="background:rgba(107,114,128,0.06); border:1px dashed var(--color-border); border-radius:8px; padding:12px; text-align:center;">
                                <div style="font-size:12px; color:var(--color-text-muted);">No interim orders issued yet.</div>
                            </div>`}

                            <!-- Last Judge Remarks -->
                            ${c.judgeRemarks ? `
                            <div style="background:rgba(74,222,128,0.05); border:1px solid rgba(74,222,128,0.2); border-radius:8px; padding:12px;">
                                <div style="font-size:10px; font-weight:800; letter-spacing:1px; color:var(--color-success); text-transform:uppercase; margin-bottom:6px;">Last Court Remarks / Order</div>
                                <div style="font-size:12px; color:var(--color-text-main); line-height:1.6;">${c.judgeRemarks}</div>
                            </div>` : ''}
                        </div>
                    </div>
                </div>

                <!-- PANEL 3: HEARING HISTORY -->
                <div class="panel-col">
                    <div class="panel-inner">
                        <div class="panel-header" style="display:flex; align-items:center; gap:6px;">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--color-gold)" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                            <span>Hearing History Timeline</span>
                        </div>
                        <div class="panel-body" style="display:flex; flex-direction:column; gap:10px; max-height:380px; overflow-y:auto;">
                            ${hearingTimelineHtml || '<div style="color:var(--color-text-muted); font-size:12px;">No hearing history recorded.</div>'}
                        </div>
                    </div>
                </div>
            </div>

            <!-- CIVIL ADJUDICATION BAR -->
            <div class="adjudication-bar" style="border-top:3px solid #2563eb;">
                <div class="adjudication-header">
                    <h3 style="display:flex; align-items:center; gap:8px;">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#2563eb" stroke-width="2"><line x1="12" y1="2" x2="12" y2="22"/><line x1="5" y1="7" x2="19" y2="7"/><path d="M5 7l3 6h6l3-6"/><path d="M15 13a3 3 0 0 1-6 0"/></svg>
                        <span>Civil Court Adjudication Panel</span>
                    </h3>
                    <p style="font-size:12px; font-family:var(--font-mono); font-weight:700; color:#2563eb; text-transform:uppercase; letter-spacing:0.5px;">
                        ${state.currentUser?.name || 'Civil Judge'} &mdash; Encrypted Judicial Authorization
                    </p>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:14px;">
                    <!-- Order Type Selection -->
                    <div>
                        <div style="font-size:11px; font-weight:700; color:var(--color-text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:10px;">Select Order Type</div>
                        <div style="display:flex; flex-direction:column; gap:8px;">
                            <button class="civil-order-btn" data-action="INTERIM_ORDER"
                                style="display:flex; align-items:center; gap:10px; padding:12px 14px; border:2px solid ${c.orderStatus === 'INTERIM_ORDER' ? '#60a5fa' : 'var(--color-border)'}; background:${c.orderStatus === 'INTERIM_ORDER' ? 'rgba(96,165,250,0.1)' : 'var(--color-card-dark)'}; color:${c.orderStatus === 'INTERIM_ORDER' ? '#93c5fd' : 'var(--color-text-main)'}; border-radius:8px; cursor:pointer; width:100%; text-align:left; font-size:13px; font-weight:700; transition:all 0.2s;">
                                <span style="display:inline-flex; align-items:center; justify-content:center; width:22px; height:22px; background:#60a5fa; border-radius:50%; font-size:11px; color:#fff; flex-shrink:0;">i</span>
                                <div>
                                    <div>Interim / Interlocutory Order</div>
                                    <div style="font-size:10px; font-weight:400; color:#93c5fd; margin-top:1px;">Injunctions, maintenance, attachment, stay</div>
                                </div>
                            </button>
                            <button class="civil-order-btn" data-action="FINAL_DECREE"
                                style="display:flex; align-items:center; gap:10px; padding:12px 14px; border:2px solid ${c.orderStatus === 'FINAL_DECREE' ? 'var(--color-success)' : 'var(--color-border)'}; background:${c.orderStatus === 'FINAL_DECREE' ? 'rgba(74,222,128,0.08)' : 'var(--color-card-dark)'}; color:${c.orderStatus === 'FINAL_DECREE' ? 'var(--color-success)' : 'var(--color-text-main)'}; border-radius:8px; cursor:pointer; width:100%; text-align:left; font-size:13px; font-weight:700; transition:all 0.2s;">
                                <span style="display:inline-flex; align-items:center; justify-content:center; width:22px; height:22px; background:var(--color-success); border-radius:50%; font-size:11px; color:#fff; flex-shrink:0;">&#10003;</span>
                                <div>
                                    <div>Final Judgment &amp; Decree</div>
                                    <div style="font-size:10px; font-weight:400; color:var(--color-success); margin-top:1px;">Conclusive ruling — suit disposed</div>
                                </div>
                            </button>
                            <button class="civil-order-btn" data-action="POSTPONED"
                                style="display:flex; align-items:center; gap:10px; padding:12px 14px; border:2px solid ${c.orderStatus === 'POSTPONED' ? 'var(--color-text-muted)' : 'var(--color-border)'}; background:${c.orderStatus === 'POSTPONED' ? 'rgba(156,163,175,0.08)' : 'var(--color-card-dark)'}; color:var(--color-text-main); border-radius:8px; cursor:pointer; width:100%; text-align:left; font-size:13px; font-weight:700; transition:all 0.2s;">
                                <span style="display:inline-flex; align-items:center; justify-content:center; width:22px; height:22px; background:var(--color-text-muted); border-radius:50%; font-size:11px; color:#fff; flex-shrink:0;">&#8649;</span>
                                <div>
                                    <div>Postpone to Next Hearing</div>
                                    <div style="font-size:10px; font-weight:400; color:var(--color-text-muted); margin-top:1px;">Adjourn with new hearing date</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- Order Text + Date -->
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        <div class="form-group" style="margin:0; flex:1;">
                            <label style="color:var(--color-text-muted); font-size:11px; margin-bottom:6px; display:block;">Order / Decree Text <span style="color:var(--color-danger);">*</span></label>
                            <textarea class="form-input" id="civil-order-text" rows="5" style="border-color:#2563eb; resize:vertical; font-size:12px; line-height:1.5;" placeholder="Write the order text, decree, or adjournment reason. Example: The court has heard both parties. The suit is disposed in favour of the petitioner. The respondent is directed to hand over possession of the disputed property within 30 days.">${c.decreeText || ''}</textarea>
                        </div>
                        <div class="form-group" id="postpone-date-row" style="margin:0; display:${c.orderStatus === 'POSTPONED' ? 'block' : 'none'};">
                            <label style="color:var(--color-text-muted); font-size:11px; margin-bottom:6px; display:block;">Next Hearing Date <span style="color:var(--color-danger);">*</span></label>
                            <input type="date" class="form-input" id="civil-next-date" value="${c.postponedTo || c.nextHearingDate}" style="border-color:var(--color-gold); font-family:var(--font-mono);">
                        </div>
                    </div>
                </div>

                <!-- e-Sign + Submit -->
                <div class="signature-section">
                    <div class="signature-box ${c.digitalSignature ? 'signed' : ''}" id="civil-sig-pad">
                        <span class="signature-text">${state.currentUser?.name?.replace('Hon\'ble ', '') || 'B. Surya Prakash Rao'}</span>
                    </div>
                    <div style="flex:1;">
                        <h4 style="color:#60a5fa; font-size:14px; font-family:var(--font-headings);">Encrypted Digital e-Sign Panel</h4>
                        <p style="font-size:11.5px; color:var(--color-text-muted); margin-top:4px;">Click the signature box to affix your judicial e-Sign. Required before submitting any civil court order.</p>
                        <p id="civil-esign-status" style="font-size:11px; color:${c.digitalSignature ? 'var(--color-success)' : '#fb923c'}; font-weight:700; margin-top:6px;">
                            ${c.digitalSignature ? '&#10003; Digital e-Sign affixed. Order ready for submission.' : '&#9888; e-Sign required — click signature box to proceed.'}
                        </p>
                    </div>
                </div>

                <div style="margin-top:14px;">
                    <button id="civil-submit-order" style="padding:13px; font-size:14px; font-weight:800; width:100%; display:flex; align-items:center; justify-content:center; gap:8px; transition:all 0.2s; border-radius:8px; letter-spacing:0.5px; border:2px solid ${c.digitalSignature ? 'var(--color-gold)' : 'var(--color-border)'}; background:${c.digitalSignature ? 'linear-gradient(135deg, rgba(201,168,76,0.25), rgba(201,168,76,0.1))' : 'rgba(255,255,255,0.04)'}; color:${c.digitalSignature ? 'var(--color-gold-light)' : '#666'}; cursor:${c.digitalSignature ? 'pointer' : 'not-allowed'};" ${c.digitalSignature ? '' : 'disabled'}>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M5 7h14M5 7L3 13h4L5 7zm14 0l-2 6h4l-2-6zM12 22h6M12 22H6"/></svg>
                        <span>SUBMIT CIVIL COURT ORDER / DECREE</span>
                    </button>
                </div>
            </div>
        `;

        // ─── Action button selection ───
        let selectedAction = (c.orderStatus !== 'PENDING') ? c.orderStatus : '';
        const postponeDateRow = detailContainer.querySelector('#postpone-date-row');

        detailContainer.querySelectorAll('.civil-order-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Reset styles
                detailContainer.querySelectorAll('.civil-order-btn').forEach(b => {
                    b.style.borderColor = 'var(--color-border)';
                    b.style.background = 'var(--color-card-dark)';
                    b.style.color = 'var(--color-text-main)';
                });
                selectedAction = e.currentTarget.getAttribute('data-action');
                if (selectedAction === 'INTERIM_ORDER') {
                    e.currentTarget.style.borderColor = '#60a5fa';
                    e.currentTarget.style.background = 'rgba(96,165,250,0.1)';
                    e.currentTarget.style.color = '#93c5fd';
                    postponeDateRow.style.display = 'none';
                } else if (selectedAction === 'FINAL_DECREE') {
                    e.currentTarget.style.borderColor = 'var(--color-success)';
                    e.currentTarget.style.background = 'rgba(74,222,128,0.08)';
                    e.currentTarget.style.color = 'var(--color-success)';
                    postponeDateRow.style.display = 'none';
                } else if (selectedAction === 'POSTPONED') {
                    e.currentTarget.style.borderColor = 'var(--color-text-muted)';
                    e.currentTarget.style.background = 'rgba(156,163,175,0.08)';
                    postponeDateRow.style.display = 'block';
                }
            });
        });

        // ─── e-Sign logic ───
        const sigPad      = detailContainer.querySelector('#civil-sig-pad');
        const submitBtn   = detailContainer.querySelector('#civil-submit-order');
        const esignStatus = detailContainer.querySelector('#civil-esign-status');
        const orderText   = detailContainer.querySelector('#civil-order-text');
        let hasEsign = !!c.digitalSignature;

        sigPad.addEventListener('click', () => {
            if (!selectedAction) {
                alert('Please select an order type (Interim Order, Final Decree, or Postpone) before signing.');
                return;
            }
            if (hasEsign || sigPad.classList.contains('signed')) {
                alert('Digital signature is already affixed.');
                return;
            }
            sigPad.classList.add('signed');
            hasEsign = true;
            esignStatus.style.color = 'var(--color-success)';
            esignStatus.innerHTML = '&#10003; Digital e-Sign affixed. Order ready for submission.';
            submitBtn.disabled = false;
            submitBtn.style.background = 'rgba(30,58,138,0.2)';
            submitBtn.style.color = '#60a5fa';
            submitBtn.style.borderColor = '#2563eb';
            submitBtn.style.cursor = 'pointer';
            alert('Encrypted Digital e-Sign affixed!\n\n\u26A0\uFE0F Click "SUBMIT CIVIL COURT ORDER / DECREE" below to finalize.');
        });

        // ─── Submit civil order ───
        submitBtn.addEventListener('click', () => {
            if (!selectedAction) { alert('Please select an order type first.'); return; }
            if (!hasEsign)        { alert('Please affix your digital e-Sign first.'); return; }
            const text = orderText.value.trim();
            if (!text)            { alert('Please write the order / decree text before submitting.'); return; }

            const today = new Date().toISOString().split('T')[0];
            const sigHash = `SHA-256/CIVIL-${c.caseId.replace(/[^A-Z0-9]/g,'')}-${Date.now()}/BSP-RAO`;

            c.orderStatus     = selectedAction;
            c.decreeText      = text;
            c.judgeRemarks    = text;
            c.digitalSignature = sigHash;
            c.lastHearingDate = today;

            if (selectedAction === 'POSTPONED') {
                const nextDate = detailContainer.querySelector('#civil-next-date')?.value || c.nextHearingDate;
                c.postponedTo = nextDate;
                c.nextHearingDate = nextDate;
                c.hearingHistory.push({ date: today, note: `Case postponed to ${nextDate}. Reason: ${text}` });
            } else if (selectedAction === 'INTERIM_ORDER') {
                c.interimOrders = c.interimOrders || [];
                c.interimOrders.push(`${text} (Order dt. ${today})`);
                c.hearingHistory.push({ date: today, note: `Interim order issued: ${text}` });
                // Reset orderStatus so more orders can be issued
                // Keep INTERIM_ORDER status, can re-open
            } else if (selectedAction === 'FINAL_DECREE') {
                c.hearingHistory.push({ date: today, note: `Final decree passed: ${text}` });
            }

            state.saveCivilDatabase();

            // ─── Confirmation Modal ───
            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.style.zIndex = '1000';

            const orderMeta = {
                'INTERIM_ORDER': { label: 'INTERIM ORDER ISSUED',   color: '#60a5fa',             bg: 'rgba(96,165,250,0.12)' },
                'FINAL_DECREE':  { label: 'FINAL DECREE PASSED',    color: 'var(--color-success)', bg: 'rgba(74,222,128,0.12)' },
                'POSTPONED':     { label: `POSTPONED TO ${c.nextHearingDate}`, color: '#9ca3af',  bg: 'rgba(156,163,175,0.12)' }
            };
            const om = orderMeta[selectedAction];

            modal.innerHTML = `
                <div class="modal-content-container" style="max-width:560px; border-top:4px solid #2563eb; border-radius:12px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.5);">
                    <div style="padding:24px; text-align:center; background:var(--color-header-dark);">
                        <div style="width:60px; height:60px; margin:0 auto 14px; background:rgba(30,58,138,0.15); border:2px solid #2563eb; border-radius:50%; display:inline-flex; align-items:center; justify-content:center;">
                            <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#2563eb" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        <h3 style="font-size:20px; font-weight:800; color:#fff; font-family:var(--font-headings);">CIVIL ORDER TRANSMITTED</h3>
                        <p style="font-size:12px; color:#2563eb; font-family:var(--font-mono); margin-top:4px; font-weight:700;">e-COURTS CRYPTOGRAPHIC DISPATCH CONFIRMED</p>
                    </div>
                    <div style="padding:24px; background:var(--color-bg-dark);">
                        <div style="display:flex; flex-direction:column; gap:12px; font-size:13px; border-bottom:1px dashed var(--color-border); padding-bottom:16px; margin-bottom:16px;">
                            <div style="display:flex; justify-content:space-between;"><span style="color:var(--color-text-muted);">Case No:</span><strong style="font-family:var(--font-mono);">${c.caseId}</strong></div>
                            <div style="display:flex; justify-content:space-between;"><span style="color:var(--color-text-muted);">Case Type:</span><strong>${c.civilType}</strong></div>
                            <div style="display:flex; justify-content:space-between;"><span style="color:var(--color-text-muted);">Petitioner:</span><strong>${c.petitioner.name}</strong></div>
                            <div style="display:flex; justify-content:space-between; align-items:center;"><span style="color:var(--color-text-muted);">Civil Order:</span><span style="padding:3px 10px; border-radius:4px; background:${om.bg}; color:${om.color}; font-weight:800; font-size:11px;">${om.label}</span></div>
                            <div style="display:flex; justify-content:space-between;"><span style="color:var(--color-text-muted);">Presiding Judge:</span><strong>${state.currentUser?.name || 'Civil Judge'}</strong></div>
                            <div style="display:flex; justify-content:space-between; align-items:center;"><span style="color:var(--color-text-muted);">e-Sign Hash:</span><span style="font-family:var(--font-mono); font-size:10px; background:rgba(255,255,255,0.05); padding:2px 6px; border-radius:4px; color:var(--color-gold-light);">${sigHash}</span></div>
                        </div>
                        <h4 style="font-size:12px; font-weight:700; color:#2563eb; margin-bottom:10px; text-transform:uppercase;">Executed Directives:</h4>
                        <div style="display:flex; flex-direction:column; gap:8px; font-size:12px; background:rgba(255,255,255,0.02); padding:12px; border-radius:6px; border:1px solid var(--color-border);">
                            <div style="display:flex; align-items:center; gap:8px;"><span style="color:var(--color-success); font-weight:bold;">&#10003;</span><span><strong>e-Courts Civil Registry:</strong> order digitally recorded and case status updated.</span></div>
                            <div style="display:flex; align-items:center; gap:8px;"><span style="color:var(--color-success); font-weight:bold;">&#10003;</span><span><strong>Advocate SMS/Portal Notification:</strong> both advocates notified of the order.</span></div>
                            ${selectedAction === 'POSTPONED' ? `<div style="display:flex; align-items:center; gap:8px;"><span style="color:var(--color-success); font-weight:bold;">&#10003;</span><span><strong>Cause List Updated:</strong> next hearing rescheduled to ${c.nextHearingDate}.</span></div>` : ''}
                            ${selectedAction === 'FINAL_DECREE' ? `<div style="display:flex; align-items:center; gap:8px;"><span style="color:var(--color-success); font-weight:bold;">&#10003;</span><span><strong>Execution Notice:</strong> decree copy prepared for parties for enforcement.</span></div>` : ''}
                        </div>
                        <button id="close-civil-modal" style="width:100%; margin-top:20px; padding:12px; font-size:14px; font-weight:700; background:rgba(30,58,138,0.2); color:#60a5fa; border:2px solid #2563eb; border-radius:8px; cursor:pointer;">Close &amp; Return to Civil Docket</button>
                    </div>
                </div>`;

            document.body.appendChild(modal);
            modal.querySelector('#close-civil-modal').addEventListener('click', () => {
                modal.remove();
                state.civilJudgeActiveMobileTab = 'listings';
                onUpdate();
            });
        });
    }
};
