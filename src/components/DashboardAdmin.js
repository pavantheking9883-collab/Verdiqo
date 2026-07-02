/**
 * VERDIQO: DISTRICT JUDGE / ADMIN COMPLIANCE DASHBOARD
 * Quantex Intelligence Systems (P) Ltd.
 * Displays structural metrics, SVG graphs, and fraud sentinels.
 */

export const DashboardAdmin = {
    render(container, state, onUpdate) {
        // Criminal stats
        const totalCases = state.cases.length;
        const grantedCount = state.cases.filter(c => c.orderStatus === 'GRANTED' || c.orderStatus === 'GRANTED_WITH_CONDITIONS').length;
        const deniedCount = state.cases.filter(c => c.orderStatus === 'DENIED').length;
        const pendingCount = state.cases.filter(c => c.orderStatus === 'PENDING').length;

        // Civil stats
        const civilCases = state.civilCases || [];
        const civilTotal   = civilCases.length;
        const civilPending = civilCases.filter(c => c.orderStatus === 'PENDING').length;
        const civilInterim = civilCases.filter(c => c.orderStatus === 'INTERIM_ORDER').length;
        const civilDecree  = civilCases.filter(c => c.orderStatus === 'FINAL_DECREE').length;

        // Cheque stats
        const chequeCases = state.chequeCases || [];
        const chequeTotal = chequeCases.length;
        const chequePending = chequeCases.filter(c => c.orderStatus === 'PENDING' || c.orderStatus === 'SUMMONS_ISSUED').length;
        const chequeCompounded = chequeCases.filter(c => c.orderStatus === 'COMPOUNDED').length;
        const chequeDecreed = chequeCases.filter(c => c.orderStatus === 'DECREED' || c.orderStatus === 'DISMISSED').length;
        const chequeCompoundRate = chequeTotal > 0 ? Math.round((chequeCompounded / chequeTotal) * 100) : 0;

        // Build civil docket table rows
        const statusMap = {
            'PENDING':       { cls: 'badge-yellow', label: 'Pending' },
            'INTERIM_ORDER': { cls: 'badge-blue',   label: 'Interim Order' },
            'FINAL_DECREE':  { cls: 'badge-green',  label: 'Decree Passed' },
            'POSTPONED':     { cls: 'badge-grey',   label: 'Postponed' }
        };
        let civilTableRows = '';
        if (civilCases.length === 0) {
            civilTableRows = `<tr><td colspan="8" style="text-align:center; padding:24px; color:var(--color-text-muted); font-size:13px;">No civil plaints on district docket yet.</td></tr>`;
        } else {
            civilCases.forEach(cs => {
                const sid = statusMap[cs.orderStatus] || { cls: 'badge-yellow', label: cs.orderStatus || 'PENDING' };
                const petName = (cs.petitioner && cs.petitioner.name) || (cs.plaintiff && cs.plaintiff.name) || '-';
                const resName = (cs.respondent && cs.respondent.name) || (cs.defendant && cs.defendant.name) || '-';
                const caseId  = cs.caseId || cs.case_id || '-';
                const pendingDays = cs.pendingDays ? `<strong style="color:${cs.pendingDays > 700 ? 'var(--color-danger)' : 'var(--color-text-main)'};">${cs.pendingDays}</strong>${cs.pendingDays > 700 ? ' <span style="color:var(--color-danger); font-size:10px; font-weight:800;">&#9888; AGED</span>' : ''}` : '<span style="color:var(--color-text-muted);">-</span>';
                civilTableRows += `
                    <tr>
                        <td class="code" style="color:#60a5fa; font-weight:700;">${caseId}</td>
                        <td><span style="font-size:11px; background:rgba(37,99,235,0.12); color:#60a5fa; border:1px solid rgba(37,99,235,0.25); border-radius:4px; padding:2px 8px; font-weight:700; white-space:nowrap;">${cs.civilType || cs.case_type || 'Civil'}</span></td>
                        <td style="font-weight:600;">${petName}</td>
                        <td style="font-weight:600;">${resName}</td>
                        <td style="font-size:12px; color:var(--color-text-muted);">${cs.presidingJudge || '-'}</td>
                        <td class="code" style="font-size:12px;">${cs.filingDate || '-'}</td>
                        <td style="font-size:12px;">${pendingDays}</td>
                        <td><span class="badge ${sid.cls}" style="font-size:10px;">${sid.label}</span></td>
                    </tr>`;
            });
        }

        container.innerHTML = `
            <div class="dashboard-header-block">
                <div class="dashboard-title">
                    <h2>${state.translate('District Judge / Admin Sentinel', 'जिला न्यायाधीश / एडमिन सेंटिनल')}</h2>
                    <p>${state.translate('Monitor court-wide performance registers, civil plaints, and surety fraud alerts', 'न्यायालय-व्यापी प्रदर्शन रजिस्टरों की निगरानी करें')}</p>
                </div>
                <div>
                    <button class="btn btn-primary" id="btn-admin-view-stats-report" style="display:flex; align-items:center; gap:6px; font-weight:700;">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:middle; color:var(--color-gold);"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        <span>${state.translate('Generate High Court Report', 'उच्च न्यायालय रिपोर्ट तैयार करें')}</span>
                    </button>
                </div>
            </div>

            <!-- ═══════════════════════════════════════════════════════ -->
            <!-- SECTION 1: CRIMINAL BAIL — ANALYTICS CARDS             -->
            <!-- ═══════════════════════════════════════════════════════ -->
            <div style="margin-bottom:8px;">
                <h3 style="font-size:13px; font-weight:800; color:var(--color-gold); letter-spacing:1px; text-transform:uppercase; display:flex; align-items:center; gap:6px; margin-bottom:12px;">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" style="color:var(--color-gold);"><path d="M12 2v20M5 7h14M5 7L3 13h4L5 7zm14 0l-2 6h4l-2-6zM12 22h6M12 22H6"/></svg>
                    Criminal Bail Applications
                </h3>
            </div>
            <div class="grid-cols-4" style="margin-bottom: 24px;">
                <div class="stat-card">
                    <div class="stat-details">
                        <h4>Total Applications</h4>
                        <p>${totalCases}</p>
                    </div>
                    <div class="stat-icon navy">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M5 7h14M5 7L3 13h4L5 7zm14 0l-2 6h4l-2-6zM12 22h6M12 22H6"/></svg>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-details">
                        <h4>Bail Orders Granted</h4>
                        <p style="color:var(--color-success);">${grantedCount}</p>
                    </div>
                    <div class="stat-icon green">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-details">
                        <h4>Bail Applications Denied</h4>
                        <p style="color:var(--color-danger);">${deniedCount}</p>
                    </div>
                    <div class="stat-icon red">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-details">
                        <h4>Awaiting Hearing</h4>
                        <p style="color:var(--color-warning);">${pendingCount}</p>
                    </div>
                    <div class="stat-icon gold">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 2h14M5 22h14M19 2v6a7 7 0 0 1-2.24 5.24c-1.8 1.8-1.8 4.72 0 6.52A7 7 0 0 1 19 22M5 2v6a7 7 0 0 0 2.24 5.24c1.8 1.8 1.8 4.72 0 6.52A7 7 0 0 0 5 22"/></svg>
                    </div>
                </div>
            </div>

            <!-- ═══════════════════════════════════════════════════════ -->
            <!-- SECTION 2: CIVIL PLAINTS — STATS + DOCKET TABLE        -->
            <!-- ═══════════════════════════════════════════════════════ -->
            <div style="margin-bottom:8px; margin-top:8px;">
                <h3 style="font-size:13px; font-weight:800; color:#2563eb; letter-spacing:1px; text-transform:uppercase; display:flex; align-items:center; gap:6px; margin-bottom:12px;">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" style="color:#2563eb;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    Civil Plaints &mdash; District Docket
                </h3>
            </div>

            <!-- Civil Stats Row -->
            <div class="grid-cols-4" style="margin-bottom: 24px;">
                <div class="stat-card" style="border-left: 3px solid #2563eb;">
                    <div class="stat-details">
                        <h4>Total Civil Plaints</h4>
                        <p style="color:#60a5fa;">${civilTotal}</p>
                    </div>
                    <div class="stat-icon" style="background:rgba(30,58,138,0.25);">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#2563eb" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                </div>
                <div class="stat-card" style="border-left: 3px solid var(--color-warning);">
                    <div class="stat-details">
                        <h4>Pending Plaints</h4>
                        <p style="color:var(--color-warning);">${civilPending}</p>
                    </div>
                    <div class="stat-icon gold">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </div>
                </div>
                <div class="stat-card" style="border-left: 3px solid #60a5fa;">
                    <div class="stat-details">
                        <h4>Interim Orders</h4>
                        <p style="color:#60a5fa;">${civilInterim}</p>
                    </div>
                    <div class="stat-icon navy">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                    </div>
                </div>
                <div class="stat-card" style="border-left: 3px solid var(--color-success);">
                    <div class="stat-details">
                        <h4>Final Decrees Passed</h4>
                        <p style="color:var(--color-success);">${civilDecree}</p>
                    </div>
                    <div class="stat-icon green">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                </div>
            </div>

            <!-- Civil Docket Table -->
            <div class="card" style="margin-bottom:24px; border-top: 3px solid #2563eb;">
                <div class="card-header" style="background:rgba(30,58,138,0.12);">
                    <h3 style="display:flex; align-items:center; gap:8px; color:var(--color-text-main);">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#2563eb" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                        Civil Plaint Docket &mdash; Full District Register
                        <span style="font-size:11px; background:rgba(37,99,235,0.15); color:#60a5fa; border:1px solid rgba(37,99,235,0.3); border-radius:10px; padding:2px 10px; font-weight:700;">${civilTotal} Plaints</span>
                    </h3>
                </div>
                <div class="card-body" style="padding:0;">
                    <div class="data-table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Case ID</th>
                                    <th>Plaint Type</th>
                                    <th>Petitioner</th>
                                    <th>Respondent</th>
                                    <th>Presiding Judge</th>
                                    <th>Filing Date</th>
                                    <th>Pending Days</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${civilTableRows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- ═══════════════════════════════════════════════════════ -->
            <!-- SECTION 3: CHEQUE DISHONOUR (S.138) — DOCKET TABLE    -->
            <!-- ═══════════════════════════════════════════════════════ -->
            <div style="margin-bottom:8px; margin-top:24px;">
                <h3 style="font-size:13px; font-weight:800; color:#0d9488; letter-spacing:1px; text-transform:uppercase; display:flex; align-items:center; gap:6px; margin-bottom:12px;">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" style="color:#0d9488;"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><line x1="12" y1="4" x2="12" y2="20"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
                    Cheque Dishonour Cases (Section 138) &mdash; District Overview
                </h3>
            </div>

            <!-- Cheque Stats Row -->
            <div class="grid-cols-4" style="margin-bottom: 24px;">
                <div class="stat-card" style="border-left: 3px solid #0d9488; background: var(--color-card);">
                    <div class="stat-details">
                        <h4>Total S.138 Cases</h4>
                        <p style="color:#2dd4bf;">${chequeTotal}</p>
                    </div>
                    <div class="stat-icon" style="background:rgba(13,148,136,0.25);">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0d9488" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><line x1="12" y1="4" x2="12" y2="20"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
                    </div>
                </div>
                <div class="stat-card" style="border-left: 3px solid var(--color-warning);">
                    <div class="stat-details">
                        <h4>Pending Trial</h4>
                        <p style="color:var(--color-warning);">${chequePending}</p>
                    </div>
                    <div class="stat-icon gold">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </div>
                </div>
                <div class="stat-card" style="border-left: 3px solid #10b981;">
                    <div class="stat-details">
                        <h4>Compounding Rate</h4>
                        <p style="color:#10b981;">${chequeCompoundRate}%</p>
                    </div>
                    <div class="stat-icon green">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    </div>
                </div>
                <div class="stat-card" style="border-left: 3px solid var(--color-danger);">
                    <div class="stat-details">
                        <h4>Verdict Disposed</h4>
                        <p style="color:var(--color-danger);">${chequeDecreed}</p>
                    </div>
                    <div class="stat-icon red">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                </div>
            </div>

            <!-- Cheque Docket Table -->
            <div class="card" style="margin-bottom:24px; border-top: 3px solid #0d9488;">
                <div class="card-header" style="background:rgba(13,148,136,0.12);">
                    <h3 style="display:flex; align-items:center; gap:8px; color:var(--color-text-main);">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#0d9488" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><line x1="12" y1="4" x2="12" y2="20"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
                        Magistrate Performance &amp; Case Registers &mdash; S.138
                        <span style="font-size:11px; background:rgba(13,148,136,0.15); color:#2dd4bf; border:1px solid rgba(13,148,136,0.3); border-radius:10px; padding:2px 10px; font-weight:700;">${chequeTotal} Registered</span>
                    </h3>
                </div>
                <div class="card-body" style="padding:0;">
                    <div class="data-table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Case ID</th>
                                    <th>Cheque Sum</th>
                                    <th>Complainant</th>
                                    <th>Accused</th>
                                    <th>Presiding Magistrate</th>
                                    <th>Summons Delivery</th>
                                    <th>Compounding</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${chequeCases.length === 0 
                                    ? `<tr><td colspan="8" style="text-align:center; padding:24px; color:var(--color-text-muted); font-size:13px;">No Section 138 cases on district registry.</td></tr>`
                                    : chequeCases.map(cc => {
                                        const cStatusCls = cc.orderStatus === 'COMPOUNDED' ? 'badge-green' : cc.orderStatus === 'DECREED' ? 'badge-green' : cc.orderStatus === 'DISMISSED' ? 'badge-grey' : 'badge-yellow';
                                        return `
                                            <tr>
                                                <td class="code" style="color:#2dd4bf; font-weight:700;">${cc.caseId}</td>
                                                <td style="font-weight:700; color:#10b981; font-family:var(--font-mono);">₹${cc.chequeAmount.toLocaleString('en-IN')}</td>
                                                <td style="font-weight:600;">${cc.petitioner?.name || '-'}</td>
                                                <td style="font-weight:600;">${cc.respondent?.name || '-'}</td>
                                                <td style="font-size:12px; color:var(--color-text-muted);">${cc.presidingJudge || '-'}</td>
                                                <td style="font-size:11.5px;">
                                                    <div>Dasti: <strong>${cc.dastiStatus}</strong></div>
                                                    <div>Elec: <strong>${cc.electronicStatus}</strong></div>
                                                </td>
                                                <td style="font-size:11px; font-weight:bold; color:${cc.paymentConfirmed ? '#10b981' : '#f59e0b'};">
                                                    ${cc.paymentConfirmed ? '✓ PAID & CLOSED' : '⏳ UNPAID'}
                                                </td>
                                                <td><span class="badge ${cStatusCls}" style="font-size:10px;">${cc.orderStatus}</span></td>
                                            </tr>
                                        `;
                                    }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- CHARTS AND COMPLIANCE COLUMNS -->
            <div class="grid-cols-2">
                <!-- CHART: AVERAGING TIME -->
                <div class="card">
                    <div class="card-header">
                        <h3 style="display:flex; align-items:center; gap:6px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:middle; color:var(--color-gold);"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                            <span>Average Bail Verification Time (Minutes)</span>
                        </h3>
                    </div>
                    <div class="card-body">
                        <div class="chart-container">
                            <!-- Custom SVG Line Graph for rich visual wow factor -->
                            <svg width="100%" height="200" viewBox="0 0 400 200" style="background:#fafafa; border:1px solid #eee; border-radius:4px;">
                                <!-- Grid Lines -->
                                <line x1="40" y1="20" x2="380" y2="20" stroke="#eee" stroke-width="1" />
                                <line x1="40" y1="60" x2="380" y2="60" stroke="#eee" stroke-width="1" />
                                <line x1="40" y1="100" x2="380" y2="100" stroke="#eee" stroke-width="1" />
                                <line x1="40" y1="140" x2="380" y2="140" stroke="#eee" stroke-width="1" />
                                <line x1="40" y1="170" x2="380" y2="170" stroke="#ccc" stroke-width="1.5" />
                                
                                <!-- Axes Labels -->
                                <text x="15" y="24" font-size="9" fill="#888" font-family="var(--font-mono)">60m</text>
                                <text x="15" y="64" font-size="9" fill="#888" font-family="var(--font-mono)">40m</text>
                                <text x="15" y="104" font-size="9" fill="#888" font-family="var(--font-mono)">20m</text>
                                <text x="15" y="144" font-size="9" fill="#888" font-family="var(--font-mono)">10m</text>
                                
                                <text x="50" y="188" font-size="9" fill="#666">Dec</text>
                                <text x="110" y="188" font-size="9" fill="#666">Jan</text>
                                <text x="170" y="188" font-size="9" fill="#666">Feb</text>
                                <text x="230" y="188" font-size="9" fill="#666">Mar</text>
                                <text x="290" y="188" font-size="9" fill="#666">Apr</text>
                                <text x="350" y="188" font-size="9" fill="#666">May</text>
                                
                                <!-- Data Line (Last Year) -->
                                <path d="M 50 140 L 110 110 L 170 90 L 230 110 L 290 80 L 350 70" fill="none" stroke="#ddd" stroke-dasharray="3,3" stroke-width="2" />
                                
                                <!-- Data Line (Current Verdiqo Deployment - Golden Navy) -->
                                <path d="M 50 120 L 110 80 L 170 50 L 230 42 L 290 35 L 350 28" fill="none" stroke="var(--color-navy)" stroke-width="3" />
                                
                                <!-- Circles for data nodes -->
                                <circle cx="50" cy="120" r="4" fill="var(--color-gold)" />
                                <circle cx="110" cy="80" r="4" fill="var(--color-gold)" />
                                <circle cx="170" cy="50" r="4" fill="var(--color-gold)" />
                                <circle cx="230" cy="42" r="4" fill="var(--color-gold)" />
                                <circle cx="290" cy="35" r="4" fill="var(--color-gold)" />
                                <circle cx="350" cy="28" r="4" fill="var(--color-gold)" />
                                
                                <text x="310" y="20" font-size="9" fill="var(--color-success)" font-weight="700">Verdiqo: 14.2 Min</text>
                            </svg>
                        </div>
                        <p style="font-size:12px; color:#555; text-align:center; margin-top:8px;">
                            * Dotted line indicates paper records (2025 avg: 48 mins). Dark line shows **Verdiqo** real-time automated processing (2026 avg: 14.2 mins).
                        </p>
                    </div>
                </div>

                <!-- COMPLIANCE SENTINEL: HIGH COURT DELAYS -->
                <div class="card">
                    <div class="card-header">
                        <h3 style="display:flex; align-items:center; gap:6px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:middle; color:var(--color-gold);"><path d="M12 2v20M5 7h14M5 7L3 13h4L5 7zm14 0l-2 6h4l-2-6zM12 22h6M12 22H6"/></svg>
                            <span>High Court Compliance Alerts (Pendency Watch)</span>
                        </h3>
                    </div>
                    <div class="card-body">
                        <div class="alert-sentinel-list">
                            <div class="sentinel-item danger-alert">
                                <div class="sentinel-meta">
                                    <h5>Case SC/241/2026 - State vs. R. K. Raju</h5>
                                    <p>Accused has spent <strong>42 days in judicial custody</strong>. Statutory bail assessment timeline exceeded (30-day benchmark).</p>
                                </div>
                                <span class="badge badge-red" style="font-size:9px;">Exceeded</span>
                            </div>
                            <div class="sentinel-item warning-alert">
                                <div class="sentinel-meta">
                                    <h5>Case SC/194/2026 - State vs. P. Satyam</h5>
                                    <p>Hearing delayed 3 times. Next listing mandated for 24-hr priority slot.</p>
                                </div>
                                <span class="badge badge-yellow" style="font-size:9px;">Scrutiny</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- SURETY FRAUD SENTINEL -->
            <div class="card" style="margin-top: 24px;">
                <div class="card-header" style="background-color: #0c1a30 !important; border-bottom: 2px solid var(--color-danger);">
                    <h3 style="color:#ffffff !important; display:flex; align-items:center; gap:8px;">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle; color:var(--color-danger);"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        <span>Surety Fraud Sentinel & Identity Anomalies Detected</span>
                    </h3>
                </div>
                <div class="card-body">
                    <div class="data-table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Alert Timestamp</th>
                                    <th>Offence Case</th>
                                    <th>Pledged Surety Name</th>
                                    <th>Risk Parameter Triggered</th>
                                    <th>Flag Severity</th>
                                    <th>Action Required</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="alert-row">
                                    <td class="code">2026-05-28 11:24</td>
                                    <td class="code">SC/242/2026</td>
                                    <td>Subba Rao Ganti</td>
                                    <td><strong>Double-Pledging Attempt:</strong> Property Survey RS-104/12 pledged in both Sub-court 1 & Sessions Court.</td>
                                    <td><span class="badge badge-red">CRITICAL FRAUD</span></td>
                                    <td><button class="btn btn-danger" style="padding:4px 8px; font-size:11px;" id="btn-block-surety-1">Block Surety</button></td>
                                </tr>
                                <tr class="alert-row">
                                    <td class="code">2026-05-26 14:10</td>
                                    <td class="code">SC/118/2026</td>
                                    <td>V. Venkatesh</td>
                                    <td><strong>Identity Mismatch:</strong> Live Iris scan mismatch at counter vs. UIDAI Aadhaar registry.</td>
                                    <td><span class="badge badge-red">IDENTITY ALERT</span></td>
                                    <td><button class="btn btn-danger" style="padding:4px 8px; font-size:11px;" id="btn-block-surety-2">Remand Proxy</button></td>
                                </tr>
                                <tr>
                                    <td class="code">2026-05-24 09:30</td>
                                    <td class="code">SC/84/2026</td>
                                    <td>K. N. Murthy</td>
                                    <td><strong>Surety Load Alarm:</strong> Holds 3 active guarantees across multiple regional divisions.</td>
                                    <td><span class="badge badge-yellow">OVERCOMMIT</span></td>
                                    <td><button class="btn btn-secondary" style="padding:4px 8px; font-size:11px;" id="btn-block-surety-3">View Obligations</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        // Bind events
        container.querySelector('#btn-admin-view-stats-report').addEventListener('click', () => {
            if (state.cases.length > 0) {
                state.openReportViewer(state.cases[0], 6); // Renders stats report
            } else {
                alert('No active cases loaded in registers to audit.');
            }
        });

        container.querySelector('#btn-block-surety-1').addEventListener('click', () => {
            alert('Surety "Subba Rao Ganti" has been globally blacklisted. Title deed survey RS-104/12-C locked in the registry. Prosecution notified.');
        });
        container.querySelector('#btn-block-surety-2').addEventListener('click', () => {
            alert('Proxy alert sent to Police Station Counter. Accused and Surety detainer orders printed.');
        });
        container.querySelector('#btn-block-surety-3').addEventListener('click', () => {
            alert('Displaying obligation docket: SC/41/2025 (Sessions), SC/92/2026 (Sub-court). Outstanding commitment value: ₹1,50,000.');
        });
    }
};
