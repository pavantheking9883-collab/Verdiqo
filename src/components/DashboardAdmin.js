/**
 * VERDIQO: DISTRICT JUDGE / ADMIN COMPLIANCE DASHBOARD
 * Quantex Intelligence Systems (P) Ltd.
 * Displays structural metrics, SVG graphs, and fraud sentinels.
 */

export const DashboardAdmin = {
    render(container, state, onUpdate) {
        // Calculate statistical numbers
        const totalCases = state.cases.length;
        const grantedCount = state.cases.filter(c => c.orderStatus === 'GRANTED' || c.orderStatus === 'GRANTED_WITH_CONDITIONS').length;
        const deniedCount = state.cases.filter(c => c.orderStatus === 'DENIED').length;
        const pendingCount = state.cases.filter(c => c.orderStatus === 'PENDING').length;
        
        container.innerHTML = `
            <div class="dashboard-header-block">
                <div class="dashboard-title">
                    <h2>${state.translate('District Judge / Admin Sentinel', 'जिला न्यायाधीश / एडमिन सेंटिनल')}</h2>
                    <p>${state.translate('Monitor court-wide performance registers and surety fraud alerts', 'न्यायालय-व्यापी प्रदर्शन रजिस्टरों और ज़मानत धोखाधड़ी अलर्ट की निगरानी करें')}</p>
                </div>
                <div>
                    <button class="btn btn-primary" id="btn-admin-view-stats-report" style="display:flex; align-items:center; gap:6px; font-weight:700;">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:middle; color:var(--color-gold);"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        <span>${state.translate('Generate High Court Report', 'उच्च न्यायालय रिपोर्ट तैयार करें')}</span>
                    </button>
                </div>
            </div>

            <!-- ANALYTICS CARDS GRID -->
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
                <div class="card-header" style="background-color: var(--color-navy); border-bottom: 2px solid var(--color-danger);">
                    <h3 style="color:var(--color-white); display:flex; align-items:center; gap:8px;">
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
