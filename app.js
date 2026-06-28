// --- ScoutCA Application Logic ---

// Current date and time context (set to match USER Metadata: June 28, 2026)
const CURRENT_TIME = new Date("2026-06-28T10:00:00+05:30");

// Helper to format date strings relative to current time
function getRelativeDateString(hoursAgo) {
    const date = new Date(CURRENT_TIME.getTime() - hoursAgo * 60 * 60 * 1000);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }) + ', ' + date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// Monitored Portals Array (Dynamic State)
let monitoredPortals = [
    {
        id: "income-tax",
        name: "Income Tax Department (CBDT)",
        short: "IT",
        url: "https://share.google/p4n9hLqpLICytWs5Z",
        displayUrl: "efiling.incometax.gov.in",
        status: "Online",
        lastConnected: "Today, 06:00 AM",
        mode: "HTML Parser (Daily)"
    },
    {
        id: "gst",
        name: "GST Portal (CBIC)",
        short: "GST",
        url: "https://share.google/jZKDmVNFgOB5XeDfH",
        displayUrl: "gst.gov.in",
        status: "Online",
        lastConnected: "Today, 06:00 AM",
        mode: "Portal API / RSS Feed"
    },
    {
        id: "companies-act",
        name: "Ministry of Corporate Affairs (MCA)",
        short: "MCA",
        url: "https://share.google/nxZQOUeE5rUeLK9Ki",
        displayUrl: "mca.gov.in",
        status: "Online",
        lastConnected: "Today, 05:58 AM",
        mode: "DOM Scraping + AI Filter"
    },
    {
        id: "sebi",
        name: "Securities & Exchange Board of India",
        short: "SEBI",
        url: "https://share.google/DfiottCoKaChms4XW",
        displayUrl: "sebi.gov.in",
        status: "Online",
        lastConnected: "Today, 06:01 AM",
        mode: "Circular Feed Crawling"
    }
];

// Initial Database of Circulars (representing last 48h initial feed)
let circularsDatabase = [
    {
        id: "CIRC_001",
        authority: "income-tax",
        sourceName: "Income Tax Department (CBDT)",
        refNumber: "Notification No. 42/2026",
        title: "Extension of timeline for filing Income Tax Returns (ITR) for Assessment Year 2026-27",
        date: getRelativeDateString(4), // 4 hours ago
        timestamp: CURRENT_TIME.getTime() - 4 * 60 * 60 * 1000,
        severity: "critical",
        summaryPoints: [
            "The due date for filing ITR for AY 2026-27 is extended from July 31, 2026, to August 31, 2026, for individuals and HUF accounts whose accounts are not required to be audited.",
            "Extension is granted in response to representations regarding technical upgrades on the e-filing portal.",
            "Interest under Section 234A will still be applicable if taxes are unpaid beyond July 31."
        ],
        actionRequired: "Notify all non-audit individual and HUF clients regarding the new August 31 deadline. Schedule pending documentation collection accordingly."
    },
    {
        id: "CIRC_002",
        authority: "gst",
        sourceName: "GST Portal (CBIC)",
        refNumber: "Advisory GST-2026-089",
        title: "Introduction of automated GSTR-2B vs GSTR-3B Input Tax Credit (ITC) reconciliation tool",
        date: getRelativeDateString(10), // 10 hours ago
        timestamp: CURRENT_TIME.getTime() - 10 * 60 * 60 * 1000,
        severity: "advisory",
        summaryPoints: [
            "A new interactive ledger has been deployed on the GST portal to compare ITC claimed in GSTR-3B with ITC generated in GSTR-2B.",
            "Taxpayers will receive automated system alerts if the variance exceeds 10% or Rs. 50,000.",
            "Allows direct communication with suppliers regarding missing invoices through the portal interface."
        ],
        actionRequired: "Review ITC reconciliation ledgers for Q1 FY 26-27. Flag suppliers with mismatch notifications before filing July returns."
    },
    {
        id: "CIRC_003",
        authority: "companies-act",
        sourceName: "Ministry of Corporate Affairs (MCA)",
        refNumber: "Circular No. 05/2026",
        title: "Relaxation of additional fees for filing Form MGT-7 and Form AOC-4 for FY 2025-26",
        date: getRelativeDateString(18), // 18 hours ago
        timestamp: CURRENT_TIME.getTime() - 18 * 60 * 60 * 1000,
        severity: "info",
        summaryPoints: [
            "MCA has allowed companies to file Annual Returns (Form MGT-7) and Financial Statements (Form AOC-4) without additional late fees up to November 30, 2026.",
            "Applicable to all classes of companies including OPCs and Small Companies.",
            "Aims to ease filing bottlenecks arising from the migration of V2 portal components to V3."
        ],
        actionRequired: "Advise corporate clients that they have additional buffer time for filings, but recommend finishing by October to avoid last-minute portal crashes."
    },
    {
        id: "CIRC_004",
        authority: "sebi",
        sourceName: "Securities & Exchange Board of India",
        refNumber: "SEBI/HO/CFD/PoD-1/CIR/2026/054",
        title: "Streamlining of Rights Issue process and reduction in listing timelines",
        date: getRelativeDateString(26), // 26 hours ago
        timestamp: CURRENT_TIME.getTime() - 26 * 60 * 60 * 1000,
        severity: "advisory",
        summaryPoints: [
            "SEBI has reduced the timeline for completion of Rights Issues from T+15 days to T+7 days from the closure of the issue.",
            "Introduction of compulsory ASBA (Application Supported by Blocked Amount) for all retail investors participating in rights offerings.",
            "Intermediaries must update registrar panels daily to enable faster reconciliation."
        ],
        actionRequired: "Inform corporate clients planning capital raising about the compressed T+7 timeline. Audit bank integration compliance."
    },
    {
        id: "CIRC_005",
        authority: "income-tax",
        sourceName: "Income Tax Department (CBDT)",
        refNumber: "Circular No. 08/2026",
        title: "Clarification on TDS deductions under Section 194J on professional and technical fees",
        date: getRelativeDateString(32), // 32 hours ago
        timestamp: CURRENT_TIME.getTime() - 32 * 60 * 60 * 1000,
        severity: "advisory",
        summaryPoints: [
            "CBDT clarifies that professional services rendered by medical practitioners in hospitals attract 10% TDS under 194J, not 2% under 194C.",
            "Distinction between contracts for service (194J) and contracts of service (salary/192) has been detailed with case precedents.",
            "Penalty interest for wrong classification will apply retrospectively if audit flags it."
        ],
        actionRequired: "Perform a compliance audit for clients operating healthcare facilities or hiring professional contractors to ensure TDS is deducted under 194J."
    },
    {
        id: "CIRC_006",
        authority: "gst",
        sourceName: "GST Portal (CBIC)",
        refNumber: "Notification No. 18/2026-CT",
        title: "Extension of GSTR-1 monthly filing due date for June 2026 due to technical maintenance",
        date: getRelativeDateString(38), // 38 hours ago
        timestamp: CURRENT_TIME.getTime() - 38 * 60 * 60 * 1000,
        severity: "critical",
        summaryPoints: [
            "The due date for filing Form GSTR-1 (Outward Supplies) for the tax period of June 2026 is extended to July 15, 2026 (normally July 11).",
            "This extension is due to an scheduled emergency database upgrade on the GSTN core servers.",
            "The extension also applies to the Invoice Furnishing Facility (IFF) under the QRMP scheme."
        ],
        actionRequired: "Ensure clients filing monthly GSTR-1 are aware of the extended July 15 deadline. Use the extra days to resolve unmatched invoices."
    },
    {
        id: "CIRC_007",
        authority: "companies-act",
        sourceName: "Ministry of Corporate Affairs (MCA)",
        refNumber: "Notification G.S.R. 344(E)",
        title: "Amendments to the Companies (Adjudication of Penalties) Rules, 2026",
        date: getRelativeDateString(42), // 42 hours ago
        timestamp: CURRENT_TIME.getTime() - 42 * 60 * 60 * 1000,
        severity: "critical",
        summaryPoints: [
            "New rules introduce online adjudication proceedings through the e-adjudication portal.",
            "All responses to show-cause notices issued by Regional Directors or ROC must be filed within 15 days electronically.",
            "Physical hearings are replaced by virtual hearings through secure MCA video conferencing links."
        ],
        actionRequired: "Update ROC communications channels. Ensure active client email profiles on the MCA portal are correct to prevent missed show-cause notices."
    },
    {
        id: "CIRC_008",
        authority: "sebi",
        sourceName: "Securities & Exchange Board of India",
        refNumber: "Order SEBI/WTM/012/2026",
        title: "New disclosure requirements for Mutual Fund Asset Management Companies (AMCs)",
        date: getRelativeDateString(45), // 45 hours ago
        timestamp: CURRENT_TIME.getTime() - 45 * 60 * 60 * 1000,
        severity: "info",
        summaryPoints: [
            "AMCs are instructed to publish daily stress test results of small-cap and mid-cap equity mutual funds on their website.",
            "Disclosures must show the timeline required to liquidate 25% and 50% of the portfolio assets under adverse market conditions.",
            "Effective date of compliance: July 01, 2026."
        ],
        actionRequired: "Asset management advisory clients must deploy stress test automation models. Audit websites for the new daily compliance disclosures."
    },
    {
        id: "CIRC_009",
        authority: "companies-act",
        sourceName: "Ministry of Corporate Affairs (MCA)",
        refNumber: "Advisory MCA-2026-012",
        title: "Compulsory dematerialisation of shares for private companies",
        date: getRelativeDateString(47), // 47 hours ago
        timestamp: CURRENT_TIME.getTime() - 47 * 60 * 60 * 1000,
        severity: "critical",
        summaryPoints: [
            "All non-small private companies must facilitate dematerialisation of their securities by September 30, 2026.",
            "No transfer of physical shares or issuance of new shares in physical form will be permitted after this date.",
            "Requires selection of a depository participant (NSDL/CDSL) and tripartite agreements."
        ],
        actionRequired: "Identify private company clients exceeding small company thresholds (Paid-up capital > Rs. 4 Crore or Turnover > Rs. 40 Crore). Initiate NSDL/CDSL registration."
    }
];

// Seed data to be added ONLY when a "manual scan" is successfully run for the 4 core portals
const defaultScoutedCirculars = [
    {
        id: "CIRC_NEW_01",
        authority: "income-tax",
        sourceName: "Income Tax Department (CBDT)",
        refNumber: "Notification No. 45/2026",
        title: "New e-filing portal guidelines for reporting foreign asset investments under Schedule FA",
        date: getRelativeDateString(0.5), // 30 mins ago
        timestamp: CURRENT_TIME.getTime() - 30 * 60 * 1000,
        severity: "critical",
        summaryPoints: [
            "All taxpayers holding foreign bank accounts, shares, or property must submit detailed transactional statements, even if valuation is below Rs. 5 Lakhs.",
            "Failure to report in Schedule FA now attracts a flat penalty of Rs. 10 Lakhs under the Black Money Act, regardless of tax evasion intent.",
            "Automated linking introduced between overseas tax records (CRS/FATCA) and the Indian PAN portal."
        ],
        actionRequired: "Review high-net-worth individual (HNI) filing portfolios immediately. Check foreign equity vesting (ESOPs) or overseas funds."
    },
    {
        id: "CIRC_NEW_02",
        authority: "gst",
        sourceName: "GST Portal (CBIC)",
        refNumber: "Circular No. 204/2026-GST",
        title: "Clarification on taxation of corporate guarantees between group companies",
        date: getRelativeDateString(1), // 1 hour ago
        timestamp: CURRENT_TIME.getTime() - 60 * 60 * 1000,
        severity: "advisory",
        summaryPoints: [
            "Corporate guarantees provided by a parent company for its subsidiary will attract 18% GST on 1% of the guaranteed amount or consideration, whichever is higher.",
            "No GST is applicable if the guarantee is issued by a director of the company in their personal capacity without any consideration.",
            "Valuation rules apply retrospectively to all active guarantees from October 2023 onwards."
        ],
        actionRequired: "Audit group company client accounts. Review active bank guarantee agreements and assess GST liabilities under corporate guarantees."
    },
    {
        id: "CIRC_NEW_03",
        authority: "companies-act",
        sourceName: "Ministry of Corporate Affairs (MCA)",
        refNumber: "Notification G.S.R. 388(E)",
        title: "Amendments to the Companies (Significant Beneficial Owners) Rules, 2026",
        date: getRelativeDateString(1.5), // 1.5 hours ago
        timestamp: CURRENT_TIME.getTime() - 90 * 60 * 1000,
        severity: "critical",
        summaryPoints: [
            "Revises definition of Significant Beneficial Owner (SBO) to include trusts and partnership structures holding indirect rights.",
            "Companies must file Form BEN-2 within 30 days of any change in indirect ownership.",
            "Fines for non-filing increased to Rs. 50,000 per day for companies and directors."
        ],
        actionRequired: "Review corporate structures of clients involving partnership firms or trusts. Prepare SBO declarations and file BEN-2 to avoid heavy fines."
    },
    {
        id: "CIRC_NEW_04",
        authority: "sebi",
        sourceName: "Securities & Exchange Board of India",
        refNumber: "SEBI/HO/IMD/PoD-2/CIR/2026/092",
        title: "Framework for institutional client fund segregation and collateral reporting",
        date: getRelativeDateString(2), // 2 hours ago
        timestamp: CURRENT_TIME.getTime() - 120 * 60 * 1000,
        severity: "advisory",
        summaryPoints: [
            "Stockbrokers must segregate client funds at the clearing corporation level dynamically.",
            "Daily collateral allocation reporting mandated before market open.",
            "Brokerage accounts violating guidelines will be suspended from trading within 24 hours."
        ],
        actionRequired: "Ensure financial intermediary clients audit their clearing systems. Test daily API submissions to clearing corporations."
    },
    {
        id: "CIRC_NEW_05",
        authority: "income-tax",
        sourceName: "Income Tax Department (CBDT)",
        refNumber: "Advisory - ITD-2026-FA",
        title: "New AI-powered validation engine for tax deduction mismatches in Form 26AS",
        date: getRelativeDateString(2.5), // 2.5 hours ago
        timestamp: CURRENT_TIME.getTime() - 150 * 60 * 1000,
        severity: "info",
        summaryPoints: [
            "Income tax department rolls out an AI engine that scans and flags 26AS mismatch claims instantly upon ITR submission.",
            "Taxpayers will get an automated SMS to revise or verify within 7 days before ITR gets rejected.",
            "Aims to reduce backlog of rectifications under Section 154."
        ],
        actionRequired: "Tell team members to check client SMS/Email alerts immediately after filing returns. Cross-verify 26AS with AIS/TIS before ITR submission."
    }
];

// Archive Database (Reports compiled at 6 PM)
const archiveDatabase = [
    {
        id: "ARC_001",
        title: "Daily Scout Digest - June 27, 2026",
        date: "27 Jun 2026, 06:00 PM",
        circularsCount: 6,
        portalsScanned: 4,
        criticalCount: 2,
        notificationsSent: 18,
        downloadName: "ScoutCA_Digest_2026_06_27.pdf"
    },
    {
        id: "ARC_002",
        title: "Daily Scout Digest - June 26, 2026",
        date: "26 Jun 2026, 06:00 PM",
        circularsCount: 8,
        portalsScanned: 4,
        criticalCount: 4,
        notificationsSent: 22,
        downloadName: "ScoutCA_Digest_2026_06_26.pdf"
    },
    {
        id: "ARC_003",
        title: "Daily Scout Digest - June 25, 2026",
        date: "25 Jun 2026, 06:00 PM",
        circularsCount: 5,
        portalsScanned: 4,
        criticalCount: 1,
        notificationsSent: 15,
        downloadName: "ScoutCA_Digest_2026_06_25.pdf"
    },
    {
        id: "ARC_004",
        title: "Daily Scout Digest - June 24, 2026",
        date: "24 Jun 2026, 06:00 PM",
        circularsCount: 9,
        portalsScanned: 4,
        criticalCount: 3,
        notificationsSent: 25,
        downloadName: "ScoutCA_Digest_2026_06_24.pdf"
    }
];

// --- CORE APP CONTROLLER ---
document.addEventListener("DOMContentLoaded", () => {
    // Navigation / Tab elements
    const navItems = document.querySelectorAll(".nav-item");
    const tabPanes = document.querySelectorAll(".tab-pane");
    const pageTitle = document.getElementById("page-title");
    
    // Live date-time updates
    const liveTimeEl = document.getElementById("live-time");
    if (liveTimeEl) {
        liveTimeEl.textContent = getFormattedLiveTime();
        // Update time dynamically every 30 seconds
        setInterval(() => {
            liveTimeEl.textContent = getFormattedLiveTime();
        }, 30000);
    }

    // Tab Switching Routing
    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const tabId = item.getAttribute("data-tab");
            switchTab(tabId);
        });
    });

    // Handle dashboard View All link
    const viewAllLink = document.getElementById("view-all-circulars-link");
    if (viewAllLink) {
        viewAllLink.addEventListener("click", (e) => {
            e.preventDefault();
            switchTab("circulars");
        });
    }

    // Full Feed search & filter inputs
    const searchInput = document.getElementById("circulars-search-input");
    const authoritySelect = document.getElementById("authority-select");
    const severitySelect = document.getElementById("severity-select");
    const dateSelect = document.getElementById("date-select");

    const triggerFullFilters = () => {
        renderFullCircularsFeed({
            search: searchInput ? searchInput.value : "",
            authority: authoritySelect ? authoritySelect.value : "all",
            severity: severitySelect ? severitySelect.value : "all",
            dateRange: dateSelect ? dateSelect.value : "48h"
        });
    };

    if (searchInput) searchInput.addEventListener("keyup", triggerFullFilters);
    if (authoritySelect) authoritySelect.addEventListener("change", triggerFullFilters);
    if (severitySelect) severitySelect.addEventListener("change", triggerFullFilters);
    if (dateSelect) dateSelect.addEventListener("change", triggerFullFilters);

    // AI Scout Crawler manual triggering
    const runScoutBtn = document.getElementById("run-scout-btn");
    const runScoutTopBtn = document.getElementById("run-scout-top-btn");
    const crawlerModal = document.getElementById("crawler-modal");
    const closeModalX = document.getElementById("close-modal-x");
    const modalCancelBtn = document.getElementById("modal-cancel-btn");
    const modalCompleteBtn = document.getElementById("modal-complete-btn");

    if (runScoutBtn) runScoutBtn.addEventListener("click", triggerScoutCrawl);
    if (runScoutTopBtn) runScoutTopBtn.addEventListener("click", triggerScoutCrawl);
    if (closeModalX) closeModalX.addEventListener("click", hideModal);
    if (modalCancelBtn) modalCancelBtn.addEventListener("click", hideModal);
    if (modalCompleteBtn) modalCompleteBtn.addEventListener("click", completeScoutCrawl);

    // Add New Portal Form handler
    const addPortalBtn = document.getElementById("add-portal-btn");
    if (addPortalBtn) addPortalBtn.addEventListener("click", handleAddPortal);

    // AI Chatbot handlers
    const fullChatSend = document.getElementById("full-chat-send");
    const fullChatInput = document.getElementById("full-chat-input");
    const miniChatSend = document.getElementById("mini-chat-send");
    const miniChatInput = document.getElementById("mini-chat-input");
    const miniSuggestedBtns = document.querySelectorAll(".mini-chat-suggested button");

    if (fullChatSend && fullChatInput) {
        fullChatSend.addEventListener("click", () => handleChatSubmission("full"));
        fullChatInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") handleChatSubmission("full");
        });
    }

    if (miniChatSend && miniChatInput) {
        miniChatSend.addEventListener("click", () => handleChatSubmission("mini"));
        miniChatInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") handleChatSubmission("mini");
        });
    }

    miniSuggestedBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const query = btn.textContent;
            switchTab("chat-advisor");
            const fullChatIn = document.getElementById("full-chat-input");
            if (fullChatIn) {
                fullChatIn.value = query;
                handleChatSubmission("full");
            }
        });
    });

    // View Archive Modal Close actions
    const archiveModal = document.getElementById("view-archive-modal");
    const closeArchiveX = document.getElementById("close-archive-x");
    const closeArchiveBtn = document.getElementById("close-archive-btn");
    const copyArchiveBtn = document.getElementById("copy-archive-btn");
    
    const hideArchiveModal = () => {
        if (archiveModal) archiveModal.classList.remove("active");
    };
    
    if (closeArchiveX) closeArchiveX.addEventListener("click", hideArchiveModal);
    if (closeArchiveBtn) closeArchiveBtn.addEventListener("click", hideArchiveModal);
    if (copyArchiveBtn) {
        copyArchiveBtn.addEventListener("click", () => {
            const body = document.getElementById("view-archive-body");
            if (body) {
                navigator.clipboard.writeText(body.innerText).then(() => {
                    triggerToast("Digest copied to clipboard!", "success");
                    hideArchiveModal();
                });
            }
        });
    }

    // Initial page load rendering
    renderDynamicPortalStructures();
    updateBadges();
    renderDashboardCirculars("all");
    renderFullCircularsFeed();
    renderArchivesList();
});

// --- HELPER FUNCTIONS ---

// Tab Switcher Router
function switchTab(tabId) {
    const navItems = document.querySelectorAll(".nav-item");
    const tabPanes = document.querySelectorAll(".tab-pane");
    const pageTitle = document.getElementById("page-title");

    // Remove active state
    navItems.forEach(item => item.classList.remove("active"));
    tabPanes.forEach(pane => pane.classList.remove("active"));

    // Add active state to matching tab & sidebar item
    const targetItem = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
    const targetPane = document.getElementById(`tab-${tabId}`);

    if (targetItem && targetPane) {
        targetItem.classList.add("active");
        targetPane.classList.add("active");
        
        // Update header page title
        switch (tabId) {
            case "dashboard":
                pageTitle.textContent = "Dashboard Overview";
                break;
            case "circulars":
                pageTitle.textContent = "Regulatory Updates Feed";
                break;
            case "scout-config":
                pageTitle.textContent = "AI Scout Settings & Portals";
                break;
            case "archive":
                pageTitle.textContent = "Compiled 6:00 PM Digests";
                break;
            case "chat-advisor":
                pageTitle.textContent = "Scout AI Assistant Chat";
                break;
            default:
                pageTitle.textContent = "ScoutCA";
        }
    }
}

// Get formatted date time for header
function getFormattedLiveTime() {
    return CURRENT_TIME.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }) + ' | ' + CURRENT_TIME.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// Update UI Badge Counts
function updateBadges() {
    const totalCount = circularsDatabase.length;
    const urgentCount = circularsDatabase.filter(c => c.severity === "critical").length;

    const sidebarBadge = document.getElementById("sidebar-badge-count");
    const statsCirc = document.getElementById("stats-circulars-count");
    const statsUrgent = document.getElementById("stats-urgent-count");

    if (sidebarBadge) sidebarBadge.textContent = totalCount;
    if (statsCirc) statsCirc.textContent = totalCount;
    if (statsUrgent) statsUrgent.textContent = urgentCount;
}

// Render dynamic portal structures (Dashboard switches, Config Table, Filter options)
function renderDynamicPortalStructures() {
    // 1. Dashboard Control switches
    const dashboardSwitchesBox = document.getElementById("scout-sources-list");
    if (dashboardSwitchesBox) {
        dashboardSwitchesBox.innerHTML = monitoredPortals.map(p => `
            <div class="scout-source-item">
                <div class="source-info">
                    <span class="source-badge ${p.id}">${p.short}</span>
                    <div>
                        <p class="source-name">${p.name}</p>
                        <a href="${p.url}" target="_blank" class="source-url">${p.displayUrl}</a>
                    </div>
                </div>
                <label class="switch">
                    <input type="checkbox" checked id="scout-${p.id}-checkbox">
                    <span class="slider-toggle"></span>
                </label>
            </div>
        `).join('');
    }

    // 2. Config portal rows
    const configTableBody = document.getElementById("config-table-body");
    if (configTableBody) {
        configTableBody.innerHTML = monitoredPortals.map(p => `
            <tr>
                <td><strong>${p.name}</strong></td>
                <td><input type="text" class="table-input" value="${p.url}" readonly></td>
                <td><span class="badge-status online">${p.status}</span></td>
                <td>${p.lastConnected}</td>
                <td>${p.mode}</td>
            </tr>
        `).join('');
    }

    // 3. Dashboard Filter tab buttons
    const filterTabsContainer = document.querySelector(".dashboard-filters");
    if (filterTabsContainer) {
        const activeFilter = filterTabsContainer.querySelector(".filter-tab.active");
        const activeVal = activeFilter ? activeFilter.getAttribute("data-filter") : "all";

        let html = `<button class="filter-tab ${activeVal === 'all' ? 'active' : ''}" data-filter="all">All Acts</button>`;
        monitoredPortals.forEach(p => {
            let label = p.name.split('(')[0].trim();
            if (p.short === "IT") label = "Income Tax";
            else if (p.short === "MCA") label = "MCA / Companies";
            else if (p.short === "GST") label = "GST Act";
            
            html += `<button class="filter-tab ${activeVal === p.id ? 'active' : ''}" data-filter="${p.id}">${label}</button>`;
        });
        filterTabsContainer.innerHTML = html;

        // Rebind click listeners
        const dashboardFilterTabs = filterTabsContainer.querySelectorAll(".filter-tab");
        dashboardFilterTabs.forEach(tab => {
            tab.addEventListener("click", () => {
                dashboardFilterTabs.forEach(t => t.classList.remove("active"));
                tab.classList.add("active");
                const filterValue = tab.getAttribute("data-filter");
                renderDashboardCirculars(filterValue);
            });
        });
    }

    // 4. Circular feed authorities select dropdown
    const authoritySelect = document.getElementById("authority-select");
    if (authoritySelect) {
        const currentVal = authoritySelect.value || "all";
        let html = `<option value="all">All Authorities</option>`;
        monitoredPortals.forEach(p => {
            html += `<option value="${p.id}">${p.name}</option>`;
        });
        authoritySelect.innerHTML = html;
        authoritySelect.value = currentVal;
    }
}

// Handle Connect New Portal
function handleAddPortal(e) {
    e.preventDefault();
    const nameInput = document.getElementById("new-auth-name");
    const codeInput = document.getElementById("new-auth-code");
    const urlInput = document.getElementById("new-auth-url");

    if (!nameInput || !codeInput || !urlInput) return;

    const name = nameInput.value.trim();
    const code = codeInput.value.trim().toUpperCase();
    const url = urlInput.value.trim();

    if (name === "" || code === "" || url === "") {
        triggerToast("Please fill in all Connect Portal fields.", "info");
        return;
    }

    try {
        const hostname = new URL(url).hostname || url;
        const id = code.toLowerCase().replace(/[^a-z0-9]/g, '-');

        // Check duplicates
        if (monitoredPortals.some(p => p.id === id || p.url === url)) {
            triggerToast("A portal with this code or URL is already connected.", "info");
            return;
        }

        const newPortal = {
            id: id,
            name: name,
            short: code,
            url: url,
            displayUrl: hostname,
            status: "Online",
            lastConnected: "Connected just now",
            mode: "AI Smart Crawl (Daily)"
        };

        // Add to portal state
        monitoredPortals.push(newPortal);

        // Reset inputs
        nameInput.value = "";
        codeInput.value = "";
        urlInput.value = "";

        // Re-render
        renderDynamicPortalStructures();
        triggerToast(`Connected regulatory portal: ${code} successfully!`, "success");

    } catch (err) {
        triggerToast("Invalid URL. Please enter a valid webpage address.", "info");
    }
}

// Render circulars in the dashboard tab
function renderDashboardCirculars(filterType = "all") {
    const container = document.getElementById("dashboard-circulars-container");
    if (!container) return;

    let filtered = circularsDatabase;
    if (filterType !== "all") {
        filtered = circularsDatabase.filter(c => c.authority === filterType);
    }

    filtered.sort((a, b) => b.timestamp - a.timestamp);
    const list = filtered.slice(0, 4);

    if (list.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 2rem; color: var(--color-text-muted);">
                <p>No circulars found for this authority in the last 48 hours.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = list.map(c => createCircularCardHTML(c, true)).join('');
}

// Render circulars in the full circulars feed tab
function renderFullCircularsFeed(filters = { search: "", authority: "all", severity: "all", dateRange: "48h" }) {
    const container = document.getElementById("full-circulars-container");
    if (!container) return;

    let filtered = circularsDatabase;

    if (filters.authority && filters.authority !== "all") {
        filtered = filtered.filter(c => c.authority === filters.authority);
    }

    if (filters.severity && filters.severity !== "all") {
        filtered = filtered.filter(c => c.severity === filters.severity);
    }

    const now = CURRENT_TIME.getTime();
    if (filters.dateRange === "24h") {
        filtered = filtered.filter(c => (now - c.timestamp) <= 24 * 60 * 60 * 1000);
    } else if (filters.dateRange === "48h") {
        filtered = filtered.filter(c => (now - c.timestamp) <= 48 * 60 * 60 * 1000);
    } else if (filters.dateRange === "7d") {
        filtered = filtered.filter(c => (now - c.timestamp) <= 7 * 24 * 60 * 60 * 1000);
    }

    if (filters.search && filters.search.trim() !== "") {
        const query = filters.search.toLowerCase().trim();
        filtered = filtered.filter(c => 
            c.title.toLowerCase().includes(query) ||
            c.refNumber.toLowerCase().includes(query) ||
            c.sourceName.toLowerCase().includes(query) ||
            c.actionRequired.toLowerCase().includes(query) ||
            c.summaryPoints.some(p => p.toLowerCase().includes(query))
        );
    }

    filtered.sort((a, b) => b.timestamp - a.timestamp);

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state-full" style="grid-column: 1/-1; text-align: center; padding: 3rem; background: white; border-radius: 12px; border: 1px solid var(--color-border);">
                <svg viewBox="0 0 24 24" width="48" height="48" stroke="var(--color-text-muted)" stroke-width="1.5" fill="none" style="margin: 0 auto 1rem;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <h3>No Updates Found</h3>
                <p style="color: var(--color-text-muted); font-size: 0.9rem; margin-top: 0.5rem;">Try adjusting filters, keyword search, or click 'Scan Now' to run crawler updates.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(c => createCircularCardHTML(c, false)).join('');
}

// Generate HTML structure for a single circular card
function createCircularCardHTML(c, isQuickView = false) {
    const pointsList = c.summaryPoints.map(p => `<li>${p}</li>`).join('');
    
    // Fallback badge color if not core
    let badgeClass = c.authority;
    if (!["income-tax", "gst", "companies-act", "sebi"].includes(c.authority)) {
        badgeClass = "info-badge-fallback";
    }

    return `
        <div class="circular-card ${c.severity}" id="card-${c.id}">
            <div class="card-meta">
                <div class="meta-left">
                    <span class="source-badge ${badgeClass}" style="${!["income-tax", "gst", "companies-act", "sebi"].includes(c.authority) ? 'background-color: var(--color-navy-light);' : ''}">${getShortCodeForAuthority(c.authority)}</span>
                    <span class="ref-number">${c.refNumber}</span>
                </div>
                <span class="circular-date">${c.date}</span>
            </div>
            
            <h3 class="circular-title">${c.title}</h3>
            
            <div class="ai-summary-block">
                <h4>
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none" style="display:inline-block; vertical-align:middle; margin-top:-2px;"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
                    AI Summary Takeaways
                </h4>
                <ul>
                    ${pointsList}
                </ul>
            </div>
            
            <div class="ca-action-block">
                <h4>CA Action Required</h4>
                <p>${c.actionRequired}</p>
            </div>
            
            <div class="card-actions">
                <a href="${getSourceUrlForAuthority(c.authority)}" target="_blank" class="card-btn-link">View Source Page</a>
                <button onclick="shareCircularClient('${c.refNumber}', '${c.title.replace(/'/g, "\\'")}')" class="card-btn-link highlight">Share with Client</button>
            </div>
        </div>
    `;
}

// Map authority to short badge text
function getShortCodeForAuthority(authId) {
    const portal = monitoredPortals.find(p => p.id === authId);
    return portal ? portal.short : authId.substring(0, 3).toUpperCase();
}

// Map authority keys to user-provided source URLs
function getSourceUrlForAuthority(auth) {
    const portal = monitoredPortals.find(p => p.id === auth);
    return portal ? portal.url : "#";
}

// Render daily archives list
function renderArchivesList() {
    const container = document.getElementById("archives-container");
    if (!container) return;

    container.innerHTML = archiveDatabase.map(arc => `
        <div class="archive-card">
            <span class="archive-date-badge">${arc.date.split(',')[0]}</span>
            <h3 class="archive-title">${arc.title}</h3>
            
            <div class="archive-stats-strip">
                <span>Updates: <strong>${arc.circularsCount}</strong></span>
                <span>Critical: <strong style="color:var(--color-danger)">${arc.criticalCount}</strong></span>
                <span>Alerts Sent: <strong>${arc.notificationsSent}</strong></span>
            </div>
            
            <div class="archive-actions" style="display:flex; flex-direction:column; gap:0.4rem; margin-top: auto; border-top: 1px solid var(--color-border); padding-top: 0.8rem;">
                <div style="display:flex; gap:0.4rem;">
                    <button onclick="viewArchiveDigest('${arc.id}')" class="card-btn-link" style="flex:1; text-align:center;">View Summary</button>
                    <button onclick="downloadDigest('${arc.title}', '${arc.date}', ${arc.circularsCount}, ${arc.criticalCount}, '${arc.downloadName.replace('.pdf', '_Report.txt')}')" class="card-btn-link highlight" style="flex:1; text-align:center;">Download PDF</button>
                </div>
                <button onclick="resendEmail('${arc.title}')" class="card-btn-link" style="width:100%; text-align:center;">Share</button>
            </div>
        </div>
    `).join('');
}

// Share circular details with client (triggers native OS Share panel with fallback)
function shareCircularClient(ref, title) {
    const circ = circularsDatabase.find(c => c.refNumber === ref);
    const summary = circ ? circ.summaryPoints.map(p => `• ${p}`).join('\n') : "• Detailed analysis published on compliance portal.";
    const action = circ ? circ.actionRequired : "Compliance check required.";

    // Beautifully formatted, medium-length message with correct spacing and headers
    const shareText = `🏛️ SCOUT AI REGULATORY COMPLIANCE ALERT
--------------------------------------------------
Dear Client,

We have captured a new critical regulatory update that may impact your compliance status:

📌 UPDATE DETAILS
-----------------
• Authority: ${circ ? circ.sourceName : "Regulatory Authority"}
• Reference: ${ref}
• Title: ${title}
• Released: ${circ ? circ.date : "Within 48 hours"}

🔍 AI SUMMARY & KEY TAKEAWAYS
-----------------------------
${summary}

⚠️ CA COMPLIANCE MANDATE
-------------------------
${action}

--------------------------------------------------
This alert was compiled and analyzed by Scout AI.
For queries or filings, please reply directly.`;

    // Attempt to open the native OS Share Panel (Windows Share / Mobile Share)
    if (navigator.share) {
        navigator.share({
            title: `Regulatory Alert: ${ref}`,
            text: shareText
        })
        .then(() => triggerToast("Native share panel opened!", "success"))
        .catch((err) => {
            console.log("Native share dismissed or blocked:", err);
            // If the share sheet is closed or fails, execute prompt fallback
            if (err.name !== "AbortError") {
                fallbackShareFlow(shareText, ref);
            }
        });
    } else {
        fallbackShareFlow(shareText, ref);
    }
}

// Fallback share logic when native Web Share is unavailable
function fallbackShareFlow(shareText, ref) {
    const choice = prompt(`Select sharing channel:\nType:\n1 - WhatsApp\n2 - Email\n3 - Copy to Clipboard`);
    if (choice === null) return;
    
    const selected = choice.trim();
    if (selected === "1") {
        const phone = prompt(`Enter client's WhatsApp phone number (with country code, e.g. 919876543210):`, "91");
        if (phone === null) return;
        const cleanPhone = phone.replace(/[^0-9]/g, '');
        if (cleanPhone.length < 10) {
            triggerToast("Invalid phone number.", "info");
            return;
        }
        const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(shareText)}`;
        window.open(waUrl, '_blank');
    } 
    else if (selected === "2") {
        const email = prompt(`Enter client's email address:`);
        if (email === null) return;
        const cleanEmail = email.trim();
        if (cleanEmail === "" || !cleanEmail.includes("@")) {
            triggerToast("Invalid email address.", "info");
            return;
        }
        const subject = encodeURIComponent(`Regulatory Compliance Alert: ${ref}`);
        const body = encodeURIComponent(shareText);
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${cleanEmail}&su=${subject}&body=${body}`;
        window.open(gmailUrl, '_blank');
    } 
    else if (selected === "3") {
        navigator.clipboard.writeText(shareText).then(() => {
            triggerToast("Alert copied to clipboard successfully!", "success");
        });
    }
}

// View Archive Digest inside browser modal
function viewArchiveDigest(archiveId) {
    const arc = archiveDatabase.find(a => a.id === archiveId);
    if (!arc) return;

    const reportContent = getDigestReportBody(arc.title);
    const modal = document.getElementById("view-archive-modal");
    const titleEl = document.getElementById("view-archive-title");
    const bodyEl = document.getElementById("view-archive-body");

    if (modal && titleEl && bodyEl) {
        titleEl.textContent = `View Summary - ${arc.title.split('-')[1]?.trim() || arc.title}`;
        bodyEl.textContent = reportContent;
        modal.classList.add("active");
    }
}

// Reusable helper to generate beautiful medium-length report digest content
function getDigestReportBody(title) {
    return `🏛️ SCOUT AI REGULATORY COMPLIANCE DAILY DIGEST
--------------------------------------------------
Report: ${title}
Status: Successful AI Scout Scan
Portals Audited: 4 Active (IT, GST, MCA, SEBI)
--------------------------------------------------

Dear Professional,

Here is the compiled regulatory compliance summary generated by Scout AI for your reference:

📌 KEY COMPLIANCE NOTIFICATIONS & ALERTS
----------------------------------------

1️⃣ INCOME TAX (CBDT)
• Extension of ITR filing AY 2026-27: Extended to August 31, 2026, for non-audit individual/HUF groups.
• TDS under Section 194J: Clarified that medical practitioners at hospitals attract 10% TDS (professional fee), not 2% contractor fee.
• Foreign Asset Reporting: Schedule FA guidelines mandate foreign account reporting under flat Rs. 10 Lakhs non-disclosure penalty.

2️⃣ GOODS & SERVICES TAX (GST)
• Extension of GSTR-1 for June 2026: Extended to July 15, 2026, due to portal maintenance.
• Corporate Group Guarantees: Parent guarantees attract 18% GST on 1% of the value (retrospective applicability).

3️⃣ MINISTRY OF CORPORATE AFFAIRS (MCA)
• Share Dematerialisation: Compulsory demat account setup for medium/large private companies by September 30, 2026.
• SBO Rules Amendment: Trust/partnership holdings must file indirect ownership declarations in Form BEN-2 in 30 days.

4️⃣ SEBI REGULATIONS
• Listing Timelines: Rights Issue completion timeline compressed to T+7 days with compulsory ASBA.
• Mid/Small-Cap Stress Tests: AMC portfolios must disclose daily stress liquidity metrics by July 01, 2026.

==================================================
This report was compiled and vector-indexed by Scout AI.
For questions or drafting advisory letters, ask the Scout AI Assistant.
==================================================`;
}

// Download digest file to system
function downloadDigest(title, date, circularsCount, criticalCount, filename) {
    const content = getDigestReportBody(title);
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename || "ScoutCA_Digest.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    triggerToast("Downloaded digest to your Downloads folder!", "success");
}

// Re-send email to configured address (directly prompt or trigger native share)
function resendEmail(title) {
    const reportContent = getDigestReportBody(title);

    if (navigator.share) {
        navigator.share({
            title: `ScoutCA Daily Digest - ${title}`,
            text: reportContent
        })
        .then(() => triggerToast("Native share panel opened!", "success"))
        .catch((err) => {
            console.log("Native share dismissed or blocked:", err);
            if (err.name !== "AbortError") {
                fallbackResendEmail(reportContent, title);
            }
        });
    } else {
        fallbackResendEmail(reportContent, title);
    }
}

// Fallback email resend logic
function fallbackResendEmail(reportContent, title) {
    const email = prompt(`Enter recipient email address to send the daily digest report:`, "vamsikrishna.ca@gmail.com");
    if (email === null) return;
    
    const cleanEmail = email.trim();
    if (cleanEmail === "" || !cleanEmail.includes("@")) {
        triggerToast("Invalid email address.", "info");
        return;
    }

    const subject = encodeURIComponent(`[ScoutCA] Digest Report - ${title}`);
    const body = encodeURIComponent(reportContent);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${cleanEmail}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
    triggerToast(`Gmail compose opened for: ${cleanEmail}`, "success");
}

// --- AI CRAWLER SIMULATOR MODAL CONTROLLER ---

let crawlInProgress = false;
let logTimeoutId = null;

function triggerScoutCrawl() {
    if (crawlInProgress) return;
    
    crawlInProgress = true;
    const modal = document.getElementById("crawler-modal");
    const progressFill = document.getElementById("modal-progress-fill");
    const percentLabel = document.getElementById("modal-percent-label");
    const statusLabel = document.getElementById("modal-status-label");
    const logTerminal = document.getElementById("modal-terminal-logs");
    const completeBtn = document.getElementById("modal-complete-btn");

    if (!modal || !progressFill || !percentLabel || !statusLabel || !logTerminal || !completeBtn) return;

    // Reset modal UI states
    modal.classList.add("active");
    progressFill.style.width = "0%";
    percentLabel.textContent = "0%";
    statusLabel.textContent = "Initializing AI Scout Crawler...";
    logTerminal.innerHTML = "";
    completeBtn.disabled = true;

    // Determine active portals checked on dashboard
    const activePortals = monitoredPortals.filter(p => {
        const cb = document.getElementById(`scout-${p.id}-checkbox`);
        return cb ? cb.checked : true;
    });

    if (activePortals.length === 0) {
        statusLabel.textContent = "Scan Error";
        const p = document.createElement("p");
        p.className = "log-line warning";
        p.textContent = `[${new Date().toLocaleTimeString()}] ERROR: No active portal sources are selected in the control panel!`;
        logTerminal.appendChild(p);
        crawlInProgress = false;
        return;
    }

    // Build dynamic simulation steps
    const simulationSteps = [
        { progress: 5, label: "Initializing...", text: "AI Scout Crawler Engine v1.9 initialized on local core.", type: "system" },
        { progress: 10, label: "Parsing sources...", text: `Loaded ${activePortals.length} active crawler links from CA database configuration...`, type: "system" }
    ];

    let currentProgress = 10;
    const progressPerPortal = Math.floor(75 / activePortals.length);

    activePortals.forEach((p, idx) => {
        // Step 1: Connecting
        currentProgress += Math.floor(progressPerPortal * 0.4);
        simulationSteps.push({
            progress: currentProgress,
            label: `Scanning ${p.short}...`,
            text: `Accessing portal: <span class="log-line url">${p.url}</span>...`,
            type: "crawling"
        });

        // Step 2: Extracting
        currentProgress += Math.floor(progressPerPortal * 0.6);
        let foundText = `Connection established. Scraped DOM structure. Found no new circulars in last 48h.`;
        
        // Custom messages for core portals
        if (p.id === "income-tax") {
            foundText = `Connected. Scraped home updates. Found 2 new notifications in last 48 hours: foreign asset Schedule FA guidelines and dynamic 26AS mismatch checking.`;
        } else if (p.id === "gst") {
            foundText = `Connected. Port API active. Extracted Circular No. 204/2026 regarding corporate group guarantees.`;
        } else if (p.id === "companies-act") {
            foundText = `Connected. DOM Scraping completed. Found 1 new rule regarding SBO declaration amendments.`;
        } else if (p.id === "sebi") {
            foundText = `Connected. Scrape complete. Found 1 new circular for client dynamic fund segregation.`;
        } else {
            // Dynamic text for custom added portals
            foundText = `Connected successfully. AI crawler extracted 1 new compliance advisory published within the last 48 hours.`;
        }

        simulationSteps.push({
            progress: currentProgress,
            label: `Processing ${p.short}...`,
            text: foundText,
            type: "success"
        });
    });

    simulationSteps.push({
        progress: 95,
        label: "Compiling daily digest...",
        text: "Translating legal files into actionable bullet points. Generating CA action mandates...",
        type: "system"
    });

    simulationSteps.push({
        progress: 100,
        label: "Crawl complete!",
        text: `Scout complete! Crawled ${activePortals.length} portals. Re-indexed compliance database. Daily 6 PM digest compiler refreshed.`,
        type: "success"
    });

    let currentStep = 0;

    function runStep() {
        if (!crawlInProgress) return;
        if (currentStep >= simulationSteps.length) {
            statusLabel.textContent = "Finished! Click below to view.";
            completeBtn.disabled = false;
            return;
        }

        const step = simulationSteps[currentStep];
        
        progressFill.style.width = step.progress + "%";
        percentLabel.textContent = step.progress + "%";
        statusLabel.textContent = step.label;

        const p = document.createElement("p");
        p.className = `log-line ${step.type}`;
        p.innerHTML = `[${new Date().toLocaleTimeString()}] ${step.text}`;
        logTerminal.appendChild(p);
        logTerminal.scrollTop = logTerminal.scrollHeight;

        currentStep++;
        
        const delay = 500 + Math.random() * 600;
        logTimeoutId = setTimeout(runStep, delay);
    }

    logTimeoutId = setTimeout(runStep, 200);
}

function hideModal() {
    crawlInProgress = false;
    if (logTimeoutId) clearTimeout(logTimeoutId);
    
    const modal = document.getElementById("crawler-modal");
    if (modal) modal.classList.remove("active");
}

function completeScoutCrawl() {
    hideModal();

    // Check what active portals are checked and if they have updates
    const activePortals = monitoredPortals.filter(p => {
        const cb = document.getElementById(`scout-${p.id}-checkbox`);
        return cb ? cb.checked : true;
    });

    // Check if we already injected default updates
    const checkCoreExist = circularsDatabase.find(c => c.id === "CIRC_NEW_01");
    let addedCount = 0;

    // 1. Inject default scout data if checked
    if (!checkCoreExist) {
        const coreAdded = defaultScoutedCirculars.filter(c => 
            activePortals.some(ap => ap.id === c.authority)
        );
        circularsDatabase = [...coreAdded, ...circularsDatabase];
        addedCount += coreAdded.length;
    }

    // 2. Generate dynamic updates for custom portals that were added
    activePortals.forEach(ap => {
        // If it's a custom portal (not core), generate dynamic updates in the last 48 hours
        if (!["income-tax", "gst", "companies-act", "sebi"].includes(ap.id)) {
            // Prevent double injection for same custom portal in this session
            const checkCustomExist = circularsDatabase.find(c => c.authority === ap.id);
            if (!checkCustomExist) {
                const dynamicUpdate = generateMockUpdateForPortal(ap);
                circularsDatabase = [dynamicUpdate, ...circularsDatabase];
                addedCount++;
            }
        }
    });

    if (addedCount === 0) {
        triggerToast("Scout checked portals: No further updates released in the last 48 hours.", "info");
        return;
    }

    // Refresh UI
    updateBadges();
    renderDashboardCirculars("all");
    
    // Reset filters and render full page
    const searchInput = document.getElementById("circulars-search-input");
    const authoritySelect = document.getElementById("authority-select");
    const severitySelect = document.getElementById("severity-select");
    if (searchInput) searchInput.value = "";
    if (authoritySelect) authoritySelect.value = "all";
    if (severitySelect) severitySelect.value = "all";
    
    renderFullCircularsFeed();

    // Add a new entry to archive
    const todayStr = CURRENT_TIME.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const existArchive = archiveDatabase.find(a => a.title.includes(todayStr));
    if (!existArchive) {
        archiveDatabase.unshift({
            id: "ARC_TODAY",
            title: `Daily Scout Digest - ${todayStr} (Manual)`,
            date: `${todayStr}, 10:04 AM`,
            circularsCount: addedCount,
            portalsScanned: activePortals.length,
            criticalCount: Math.ceil(addedCount * 0.4),
            notificationsSent: Math.ceil(addedCount * 3),
            downloadName: `ScoutCA_Digest_Manual_${CURRENT_TIME.getFullYear()}.pdf`
        });
        renderArchivesList();
    }

    triggerToast(`Scout successfully captured ${addedCount} new regulatory updates!`, "success");
}

// Generate realistic mock circulars for custom-added portals
function generateMockUpdateForPortal(portal) {
    const now = CURRENT_TIME.getTime();
    const minsAgo = Math.floor(15 + Math.random() * 100);
    const timestamp = now - minsAgo * 60 * 1000;
    
    let title = `Regulatory Circular on Compliance Disclosures and Audit Filings`;
    let ref = `Circular No. ${Math.floor(10 + Math.random() * 90)}/2026`;
    let summary = [
        `Mandates strict digital audit trail verification for transactions processed through foreign intermediary channels.`,
        `Requires CA certified balance disclosures to be uploaded directly on the portal within 30 days.`,
        `Non-compliance will result in direct referral to enforcement directorates.`
    ];
    let action = `Identify clients engaging in foreign transaction clearing. Coordinate with their in-house teams to pull system audit reports.`;

    if (portal.short === "RBI") {
        ref = "RBI/2026-27/84";
        title = "Master Direction on Information Technology Governance and Information Security";
        summary = [
            "Requires NBFCs and commercial banks to establish a Board-level IT Strategy Committee and hire dedicated CISOs.",
            "Mandates reporting of all critical cyber security incidents within 6 hours of detection to RBI.",
            "A comprehensive compliance audit report must be submitted by September 30, 2026."
        ];
        action = "Check NBFC client rosters. Ensure IT governance parameters are compliant and incident response logs are configured.";
    } else if (portal.short === "FEMA" || portal.short === "ED") {
        ref = "FEMA Notification No. 412/2026";
        title = "Foreign Exchange Management (Non-debt Instruments) Amendment Rules, 2026";
        summary = [
            "Permits 100% FDI in space sector activities under automatic route for satellite manufacturing and space launch systems.",
            "Requires reporting of foreign equity inflow within 30 days of share allotment via Single Master Form (SMF) on FIRMS portal.",
            "Simplifies compliance declarations for overseas venture capital funds."
        ];
        action = "Review space/aerospace startup client capitalization. Ensure SMF reporting is filed for recent foreign investments.";
    } else {
        // Fallback for general name
        title = `New compliance framework published on the ${portal.name} portal`;
        ref = `${portal.short}/2026-27/CIR-${Math.floor(100 + Math.random()*900)}`;
    }

    return {
        id: `CIRC_NEW_DYNAMIC_${portal.id}`,
        authority: portal.id,
        sourceName: portal.name,
        refNumber: ref,
        title: title,
        date: getRelativeDateString(minsAgo / 60),
        timestamp: timestamp,
        severity: "critical",
        summaryPoints: summary,
        actionRequired: action
    };
}

// --- AI ADVISORY CHAT SYSTEM ---

function handleChatSubmission(chatType) {
    const inputEl = document.getElementById(chatType === "full" ? "full-chat-input" : "mini-chat-input");
    if (!inputEl || inputEl.value.trim() === "") return;

    const query = inputEl.value.trim();
    inputEl.value = "";

    if (chatType === "mini") {
        // Mini chat redirects to full chat page
        switchTab("chat-advisor");
        const fullChatIn = document.getElementById("full-chat-input");
        if (fullChatIn) {
            fullChatIn.value = query;
            handleChatSubmission("full");
        }
        return;
    }

    const chatBox = document.getElementById("chat-messages-box");
    if (!chatBox) return;

    // Render User Message
    const userMsgDiv = document.createElement("div");
    userMsgDiv.className = "message user-msg";
    userMsgDiv.innerHTML = `<p>${escapeHTML(query)}</p>`;
    chatBox.appendChild(userMsgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Render AI thinking state
    const aiMsgDiv = document.createElement("div");
    aiMsgDiv.className = "message ai-msg";
    aiMsgDiv.innerHTML = `<p><em>ScoutCA AI is searching compliance database...</em></p>`;
    chatBox.appendChild(aiMsgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    // AI response delay
    setTimeout(() => {
        const responseHTML = compileAIResponse(query);
        aiMsgDiv.innerHTML = responseHTML;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 1000);
}

// Compile AI Response based on keywords in query
function compileAIResponse(query) {
    const q = query.toLowerCase();
    
    // Check if database holds the manual crawl circulars
    const hasCrawledData = circularsDatabase.some(c => c.id === "CIRC_NEW_01");

    // Dynamic check if query references any custom portal added (e.g. RBI)
    let customResponse = "";
    monitoredPortals.forEach(p => {
        if (!["income-tax", "gst", "companies-act", "sebi"].includes(p.id)) {
            if (q.includes(p.id) || q.includes(p.short.toLowerCase()) || q.includes(p.name.toLowerCase())) {
                const hasCustomData = circularsDatabase.some(c => c.authority === p.id);
                if (hasCustomData) {
                    const matchedCirc = circularsDatabase.find(c => c.authority === p.id);
                    const points = matchedCirc.summaryPoints.map(pt => `<li>${pt}</li>`).join('');
                    customResponse = `
                        <p>I located updates regarding your newly connected portal <strong>${p.name}</strong>:</p>
                        <ul>
                            <li><strong>${matchedCirc.refNumber}</strong>: ${matchedCirc.title}</li>
                            ${points}
                        </ul>
                        <p><strong>Recommended CA Action:</strong> ${matchedCirc.actionRequired}</p>
                    `;
                } else {
                    customResponse = `
                        <p>I see you have connected the portal <strong>${p.name} (${p.short})</strong>.</p>
                        <p>No compliance notifications have been captured yet in the database. Please check the dashboard, ensure the portal checkbox is checked, and click <strong>"Scan Now"</strong> to run the crawler. Once complete, I will immediately index its updates.</p>
                    `;
                }
            }
        }
    });

    if (customResponse !== "") {
        return customResponse;
    }

    if (q.includes("gst") || q.includes("gstr") || q.includes("taxation") || q.includes("returns")) {
        let returnText = `
            <p>I found the following <strong>GST Portal (CBIC)</strong> compliance notifications in our last 48-hour database:</p>
            <ul>
                <li><strong>Advisory GST-2026-089</strong>: Automated GSTR-2B vs GSTR-3B ITC reconciliation tool. Helps flag supplier mismatches directly on the portal.</li>
                <li><strong>Notification No. 18/2026-CT</strong>: Due date for June 2026 monthly GSTR-1 extended to <strong>July 15, 2026</strong>.</li>
        `;
        if (hasCrawledData) {
            returnText += `
                <li><strong>Circular No. 204/2026-GST</strong>: Parent corporate guarantees for group companies attract <strong>18% GST</strong> on 1% of guarantee value (effective retrospectively).</li>
            `;
        }
        returnText += `
            </ul>
            <p><strong>Recommended CA Action:</strong> Inform clients filing monthly GSTR-1 about the July 15 extension. For clients with corporate guarantee arrangements, audit values to avoid retrospective penalty filings.</p>
        `;
        return returnText;
    }

    if (q.includes("income tax") || q.includes("itr") || q.includes("tds") || q.includes("tax")) {
        let returnText = `
            <p>Based on the <strong>Income Tax Department (CBDT)</strong> circulars for the last 48 hours, here is the assessment:</p>
            <ul>
                <li><strong>Notification No. 42/2026</strong>: ITR filing deadline for AY 2026-27 (non-audit individuals/HUFs) is extended to <strong>August 31, 2026</strong>.</li>
                <li><strong>Circular No. 08/2026</strong>: Retrospective TDS clarification. Medical practitioners at hospitals attract <strong>10% TDS under Section 194J</strong> (professional fee) instead of 2% contractor fee.</li>
        `;
        if (hasCrawledData) {
            returnText += `
                <li><strong>Schedule FA Guidelines</strong>: Compulsory asset disclosure of foreign accounts and ESOPs. Non-reporting attracts flat <strong>Rs. 10 Lakhs penalty</strong>.</li>
                <li><strong>Advisory - ITD-2026-FA</strong>: AI reconciliation tool automatically flags mismatch errors in Form 26AS vs ITR upon filing.</li>
            `;
        }
        returnText += `
            </ul>
            <p><strong>CA Advisory Tip:</strong> Ensure healthcare firm client agreements are audited for correct 194J TDS deductions. Make sure high-worth filing client folders have Schedule FA information cleared.</p>
        `;
        return returnText;
    }

    if (q.includes("sebi") || q.includes("stock") || q.includes("mutual fund") || q.includes("broker")) {
        let returnText = `
            <p>Here is the compliance brief for <strong>Securities & Exchange Board of India (SEBI)</strong> regulations:</p>
            <ul>
                <li><strong>Circular CFD/PoD-1/CIR/2026/054</strong>: Rights Issue listing compressed to <strong>T+7 days</strong> (previously T+15) with mandatory ASBA for retail applications.</li>
                <li><strong>Order SEBI/WTM/012/2026</strong>: Asset Management Companies (AMCs) must publish daily stress tests for mid/small-cap liquidity timelines by July 01, 2026.</li>
        `;
        if (hasCrawledData) {
            returnText += `
                <li><strong>Circular PoD-2/CIR/2026/092</strong>: Dynamic institutional client fund segregation and daily broker collateral allocation reporting.</li>
            `;
        }
        returnText += `
            </ul>
            <p><strong>Compliance Check:</strong> Broker clients must integrate daily collateral APIs. AMC clients must configure mid/small-cap stress calculation scripts before July 01.</p>
        `;
        return returnText;
    }

    if (q.includes("mca") || q.includes("companies act") || q.includes("roc") || q.includes("company") || q.includes("demat") || q.includes("sbo")) {
        let returnText = `
            <p>I located the following <strong>Ministry of Corporate Affairs (MCA)</strong> Companies Act compliance updates:</p>
            <ul>
                <li><strong>Circular No. 05/2026</strong>: Waiver of late filing fees for AOC-4 and MGT-7 annual forms till <strong>November 30, 2026</strong>.</li>
                <li><strong>Notification G.S.R. 344(E)</strong>: Compulsory virtual ROC hearings and online show-cause response submissions within 15 days.</li>
                <li><strong>Advisory MCA-2026-012</strong>: Compulsory dematerialisation of shares for medium & large private companies by <strong>September 30, 2026</strong>.</li>
        `;
        if (hasCrawledData) {
            returnText += `
                <li><strong>G.S.R. 388(E) - SBO Rules</strong>: Expanded Significant Beneficial Owner disclosure definitions to partnership/trust structures. Form BEN-2 must be updated in 30 days.</li>
            `;
        }
        returnText += `
            </ul>
            <p><strong>Action Point:</strong> Identify private companies in your client list with paid-up capital &gt; Rs. 4 Crore or Turnover &gt; Rs. 40 Crore and start the depository account setup for CDSL/NSDL.</p>
        `;
        return returnText;
    }

    // Default Fallback
    return `
        <p>I've analyzed the circulars database for <em>"${escapeHTML(query)}"</em>.</p>
        <p>Currently, there are <strong>${circularsDatabase.length} active updates</strong> in our database from the last 48 hours. You can ask me details about:</p>
        <ul>
            <li><strong>Income Tax filing deadlines</strong> and Section 194J TDS deductions.</li>
            <li><strong>GST GSTR-1 filing extensions</strong> and automated GSTR-2B ITC reconciliation.</li>
            <li><strong>MCA Companies Act</strong> updates, physical-to-virtual ROC hearings, and demat regulations.</li>
            <li><strong>SEBI stockbroker rules</strong> or mutual fund daily stress disclosures.</li>
            ${monitoredPortals.filter(p => !["income-tax", "gst", "companies-act", "sebi"].includes(p.id)).map(p => `<li><strong>${p.short} updates</strong> (custom portal connected).</li>`).join('')}
        </ul>
        <p>Would you like me to compile a draft advisory letter for any of these specific areas?</p>
    `;
}

// Simple HTML escaping helper to prevent XSS
function escapeHTML(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// --- TOAST SYSTEMS ---

function triggerToast(message, type = "success") {
    const box = document.getElementById("toast-box");
    if (!box) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    let icon = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
    `;
    if (type === "info") {
        icon = `
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        `;
    }

    toast.innerHTML = `
        ${icon}
        <span>${message}</span>
    `;

    box.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(100%)";
        toast.style.transition = "all 0.5s ease";
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 3500);
}
