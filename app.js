// --- ScoutCA Application Logic ---

// Current date and time context (set to match USER Metadata: July 6, 2026)
const CURRENT_TIME = new Date("2026-07-06T10:00:00+05:30");

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
        id: "income-tax-circulars",
        name: "Income Tax Circulars (CBDT)",
        short: "ITC",
        url: "https://www.incometaxindia.gov.in/circulars",
        displayUrl: "incometaxindia.gov.in/circulars",
        status: "Online",
        lastConnected: "Today, 06:00 AM",
        mode: "HTML Parser (Daily)"
    },
    {
        id: "income-tax-notifications",
        name: "Income Tax Notifications (CBDT)",
        short: "ITN",
        url: "https://www.incometaxindia.gov.in/notifications",
        displayUrl: "incometaxindia.gov.in/notifications",
        status: "Online",
        lastConnected: "Today, 06:00 AM",
        mode: "HTML Parser (Daily)"
    },
    {
        id: "income-tax-calendar",
        name: "Income Tax Calendar",
        short: "TAX-CAL",
        url: "https://www.incometaxindia.gov.in/tax-calendar",
        displayUrl: "incometaxindia.gov.in/tax-calendar",
        status: "Online",
        lastConnected: "Today, 06:00 AM",
        mode: "HTML Parser (Daily)"
    },
    {
        id: "gst-advisory",
        name: "GST Advisories & Releases (CBIC)",
        short: "GST",
        url: "https://services.gst.gov.in/services/advisory/advisoryandreleases",
        displayUrl: "services.gst.gov.in",
        status: "Online",
        lastConnected: "Today, 06:00 AM",
        mode: "Portal API / RSS Feed"
    },
    {
        id: "ibbi-updates",
        name: "Insolvency & Bankruptcy Board (IBBI)",
        short: "IBBI",
        url: "https://ibbi.gov.in/whats-new",
        displayUrl: "ibbi.gov.in",
        status: "Online",
        lastConnected: "Today, 06:01 AM",
        mode: "Circular Feed Crawling"
    },
    {
        id: "mca-updates",
        name: "Ministry of Corporate Affairs (MCA)",
        short: "MCA",
        url: "https://www.mca.gov.in/content/mca/global/en/notifications-tender/news-updates/updates.html",
        displayUrl: "mca.gov.in",
        status: "Online",
        lastConnected: "Today, 05:58 AM",
        mode: "DOM Scraping + AI Filter"
    }
];

// Initial Database of Circulars (representing last 48h initial feed)
let circularsDatabase = [
    {
        id: "CIRC_001",
        authority: "income-tax-calendar",
        sourceName: "Income Tax Calendar",
        refNumber: "Tax Calendar July 2026",
        title: "Income Tax Calendar: Deposit of TDS/TCS for the month of June 2026",
        date: getRelativeDateString(5), // 5 hours ago
        timestamp: CURRENT_TIME.getTime() - 5 * 60 * 60 * 1000,
        severity: "critical",
        officialText: "All tax deductors and collectors are required to deposit TDS/TCS deducted/collected during the month of June 2026 on or before July 7, 2026. The deposit must be made via challan-cum-statement on the e-filing portal.",
        actionRequired: "Ensure all TDS/TCS deductions/collections for June 2026 are verified and deposited by July 7, 2026, to avoid 1.5% per month interest under Section 201(1A).",
        sourceUrl: "https://www.incometaxindia.gov.in/tax-calendar"
    },
    {
        id: "CIRC_002",
        authority: "income-tax-notifications",
        sourceName: "Income Tax Notifications (CBDT)",
        refNumber: "Notification No. 58/2026",
        title: "Specification of Cost Inflation Index (CII) for FY 2026-27 under Section 48",
        date: getRelativeDateString(11), // 11 hours ago
        timestamp: CURRENT_TIME.getTime() - 11 * 60 * 60 * 1000,
        severity: "advisory",
        officialText: "In exercise of the powers conferred by clause (v) of the Explanation to Section 48 of the Income-tax Act, 1961, the Central Government hereby specifies the Cost Inflation Index for the Financial Year 2026-27 (Assessment Year 2027-28) as 384.",
        actionRequired: "Use Cost Inflation Index (CII) value of 384 for computing long-term capital gains (LTCG) with indexation benefits for sales in FY 2026-27.",
        sourceUrl: "https://www.incometaxindia.gov.in/communications/notification/notification-58-2026.pdf"
    },
    {
        id: "CIRC_003",
        authority: "income-tax-circulars",
        sourceName: "Income Tax Circulars (CBDT)",
        refNumber: "Circular No. 12/2026",
        title: "Revised Guidelines for Compounding of Offences under the Income-tax Act, 1961",
        date: getRelativeDateString(19), // 19 hours ago
        timestamp: CURRENT_TIME.getTime() - 19 * 60 * 60 * 1000,
        severity: "info",
        officialText: "This Circular consolidates guidelines for compounding of offences under the Act, superseding all earlier guidelines. Compounding applications must be filed before the Competent Authority within 12 months from the date of filing of complaint in court. The compounding fee for Section 276B (TDS default) is reduced to 2% per month.",
        actionRequired: "Identify clients facing prosecution for TDS or tax defaults. Review eligibility under Section 279(2) and file compounding application using the reduced 2% rate.",
        sourceUrl: "https://www.incometaxindia.gov.in/communications/circular/circular-12-2026.pdf"
    },
    {
        id: "CIRC_004",
        authority: "gst-advisory",
        sourceName: "GST Advisories & Releases (CBIC)",
        refNumber: "GST Advisory CBIC-DRC-01C",
        title: "Rollout of Automated Intimation for ITC Mismatches in Form DRC-01C on GST Portal",
        date: getRelativeDateString(25), // 25 hours ago
        timestamp: CURRENT_TIME.getTime() - 25 * 60 * 60 * 1000,
        severity: "advisory",
        officialText: "Taxpayers are informed that the system will now compare the Input Tax Credit (ITC) available in GSTR-2B with the ITC claimed in GSTR-3B. If the claimed ITC exceeds GSTR-2B by 20% or Rs. 1,00,000, an automated intimation in Form DRC-01C will be issued. The taxpayer must pay the excess amount or explain the difference in Form DRC-01C Part B within 7 days.",
        actionRequired: "Perform a weekly reconciliation of GSTR-2B and GSTR-3B. Ensure immediate action is taken if a DRC-01C alert is received on the portal to prevent suspension of GST registration.",
        sourceUrl: "https://services.gst.gov.in/services/advisory/advisoryandreleases/drc-01c-adv.pdf"
    },
    {
        id: "CIRC_005",
        authority: "ibbi-updates",
        sourceName: "Insolvency & Bankruptcy Board (IBBI)",
        refNumber: "IBBI/2026-27/GN/REG098",
        title: "Amendments to Corporate Insolvency Resolution Process (CIRP) Regulations",
        date: getRelativeDateString(31), // 31 hours ago
        timestamp: CURRENT_TIME.getTime() - 31 * 60 * 60 * 1000,
        severity: "advisory",
        officialText: "The Insolvency and Bankruptcy Board of India hereby amends the CIRP Regulations. The Resolution Professional (RP) shall appoint two registered valuers within 47 days of the insolvency commencement date. Any interim finance raised during the process must be registered on the central registry platform within 7 days.",
        actionRequired: "Resolution Professionals must update corporate insolvency logs to align valuer appointments on Day 47. Register all interim funding details on the central portal immediately.",
        sourceUrl: "https://ibbi.gov.in/uploads/whatsnew/cirp-amendment-regulations-2026.pdf"
    },
    {
        id: "CIRC_006",
        authority: "mca-updates",
        sourceName: "Ministry of Corporate Affairs (MCA)",
        refNumber: "Notification F.No. 1/12/2020-CL-V",
        title: "Compulsory Filing of Form BEN-2 under Companies Significant Beneficial Owners (SBO) Rules",
        date: getRelativeDateString(43), // 43 hours ago
        timestamp: CURRENT_TIME.getTime() - 43 * 60 * 60 * 1000,
        severity: "critical",
        officialText: "Every company must identify its Significant Beneficial Owners (SBO) and file Form BEN-2 with the Registrar of Companies within 30 days of receiving declarations in Form BEN-1. SBO includes any individual holding indirectly not less than 10% of shares or voting rights in the company through trust or partnership structures.",
        actionRequired: "Obtain BEN-1 declarations from shareholders who hold holdings through holding companies, trusts, or partnerships. Prepare and file BEN-2 to prevent daily penalties of Rs. 1,000.",
        sourceUrl: "https://www.mca.gov.in/content/mca/global/en/notifications-tender/news-updates/updates-ben-2.html"
    }
];

// Seed data to be added ONLY when a "manual scan" is successfully run
const defaultScoutedCirculars = [
    {
        id: "CIRC_NEW_01",
        authority: "gst-advisory",
        sourceName: "GST Advisories & Releases (CBIC)",
        refNumber: "GST Advisory BIO-REG-2026",
        title: "Integration of Biometric-based Aadhaar Authentication for GST Registration",
        date: getRelativeDateString(0.5), // 30 mins ago
        timestamp: CURRENT_TIME.getTime() - 30 * 60 * 1000,
        severity: "critical",
        officialText: "Biometric-based Aadhaar authentication for GST registration applications has been rolled out across all states. Applicants flagged by the system risk profile will receive an email containing a link to book an appointment at a designated GST Suvidha Kendra. Biometrics and documents must be uploaded within 10 days of booking.",
        actionRequired: "Advise new clients seeking GST registration to expect biometric verification. Help schedule slots at GST Suvidha Kendras within the 10-day window.",
        sourceUrl: "https://services.gst.gov.in/services/advisory/advisoryandreleases/biometric-auth-rules.pdf"
    },
    {
        id: "CIRC_NEW_02",
        authority: "income-tax-notifications",
        sourceName: "Income Tax Notifications (CBDT)",
        refNumber: "Notification No. 59/2026",
        title: "Extension of Time Limits for Filing Form 10-IB for Co-operative Societies",
        date: getRelativeDateString(1), // 1 hour ago
        timestamp: CURRENT_TIME.getTime() - 60 * 60 * 1000,
        severity: "advisory",
        officialText: "The Central Board of Direct Taxes hereby extends the due date for filing Form 10-IB (exercise of option under Section 115BAD) for co-operative societies for AY 2026-27 from July 31, 2026, to September 30, 2026.",
        actionRequired: "Identify co-operative society clients. Advise them of the extended September 30 filing timeline for option Form 10-IB.",
        sourceUrl: "https://www.incometaxindia.gov.in/communications/notification/notification-59-2026.pdf"
    },
    {
        id: "CIRC_NEW_03",
        authority: "ibbi-updates",
        sourceName: "Insolvency & Bankruptcy Board (IBBI)",
        refNumber: "Circular IBBI/IP/CMP-099",
        title: "Launch of Online Compliance Monitoring Portal (CMP) for Insolvency Professionals",
        date: getRelativeDateString(1.5), // 1.5 hours ago
        timestamp: CURRENT_TIME.getTime() - 90 * 60 * 1000,
        severity: "critical",
        officialText: "IBBI announces the launch of the new online Compliance Monitoring Portal (CMP). All Insolvency Professionals must submit their monthly disclosures and details of all active assignments on the new portal starting July 10, 2026. Submissions through email or legacy platforms will be discontinued.",
        actionRequired: "Ensure all team members managing insolvency cases are registered on the new CMP. Check that all active assignment details are updated for the July 10 migration.",
        sourceUrl: "https://ibbi.gov.in/uploads/whatsnew/cmp-portal-launch-circular.pdf"
    },
    {
        id: "CIRC_NEW_04",
        authority: "mca-updates",
        sourceName: "Ministry of Corporate Affairs (MCA)",
        refNumber: "LLP Circular No. 06/2026",
        title: "Extension of Due Date for Filing LLP Form 11 (Annual Return) for FY 2025-26",
        date: getRelativeDateString(2), // 2 hours ago
        timestamp: CURRENT_TIME.getTime() - 120 * 60 * 1000,
        severity: "advisory",
        officialText: "Representations have been received requesting extension of the due date for filing Form 11 (Annual Return of LLP) for the financial year ended March 31, 2026, due to technical issues on the V3 portal. It has been decided to allow LLPs to file Form 11 without additional fees up to July 15, 2026.",
        actionRequired: "Alert all LLP clients that the Form 11 filing deadline is extended to July 15, 2026. Finalize returns and upload on the V3 portal.",
        sourceUrl: "https://www.mca.gov.in/content/mca/global/en/notifications-tender/news-updates/updates-form11-extension.html"
    }
];

// Archive Database (Reports compiled at 6 PM)
const archiveDatabase = [
    {
        id: "ARC_001",
        title: "Daily Scout Digest - July 05, 2026",
        date: "05 Jul 2026, 06:00 PM",
        circularsCount: 6,
        portalsScanned: 6,
        criticalCount: 2,
        notificationsSent: 18,
        downloadName: "ScoutCA_Digest_2026_07_05.pdf"
    },
    {
        id: "ARC_002",
        title: "Daily Scout Digest - July 04, 2026",
        date: "04 Jul 2026, 06:00 PM",
        circularsCount: 8,
        portalsScanned: 6,
        criticalCount: 4,
        notificationsSent: 22,
        downloadName: "ScoutCA_Digest_2026_07_04.pdf"
    },
    {
        id: "ARC_003",
        title: "Daily Scout Digest - July 03, 2026",
        date: "03 Jul 2026, 06:00 PM",
        circularsCount: 5,
        portalsScanned: 6,
        criticalCount: 1,
        notificationsSent: 15,
        downloadName: "ScoutCA_Digest_2026_07_03.pdf"
    },
    {
        id: "ARC_004",
        title: "Daily Scout Digest - July 02, 2026",
        date: "02 Jul 2026, 06:00 PM",
        circularsCount: 9,
        portalsScanned: 6,
        criticalCount: 3,
        notificationsSent: 25,
        downloadName: "ScoutCA_Digest_2026_07_02.pdf"
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
            if (p.short === "ITC") label = "IT Circulars";
            else if (p.short === "ITN") label = "IT Notifications";
            else if (p.short === "TAX-CAL") label = "Tax Calendar";
            else if (p.short === "GST") label = "GST Advisory";
            else if (p.short === "IBBI") label = "IBBI Insolvency";
            else if (p.short === "MCA") label = "MCA Corporate";
            
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
            c.officialText.toLowerCase().includes(query)
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
    // Map authority to premium brand colors dynamically
    let badgeBg = "var(--color-navy-light)";
    if (c.authority === "income-tax-circulars") badgeBg = "#DE5B13";
    else if (c.authority === "income-tax-notifications") badgeBg = "#B22222";
    else if (c.authority === "income-tax-calendar") badgeBg = "#D4AF37";
    else if (c.authority === "gst-advisory") badgeBg = "#0A81D1";
    else if (c.authority === "ibbi-updates") badgeBg = "#8A2BE2";
    else if (c.authority === "mca-updates") badgeBg = "#048243";

    return `
        <div class="circular-card ${c.severity}" id="card-${c.id}">
            <div class="card-meta">
                <div class="meta-left">
                    <span class="source-badge" style="background-color: ${badgeBg};">${getShortCodeForAuthority(c.authority)}</span>
                    <span class="ref-number">${c.refNumber}</span>
                </div>
                <span class="circular-date">${c.date}</span>
            </div>
            
            <h3 class="circular-title">${c.title}</h3>
            
            <div class="ai-summary-block">
                <h4>
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none" style="display:inline-block; vertical-align:middle; margin-top:-2px;"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                    Official Notification / Exact Data
                </h4>
                <p class="official-text-para" style="font-size: 0.85rem; color: var(--color-text-dark); line-height: 1.5; font-style: italic; border-left: 2px solid var(--color-gold); padding-left: 0.8rem; margin-top: 0.4rem; margin-bottom: 0;">
                    "${c.officialText}"
                </p>
            </div>
            
            <div class="ca-action-block">
                <h4>CA Action Required</h4>
                <p>${c.actionRequired}</p>
            </div>
            
            <div class="card-actions">
                <a href="${c.sourceUrl || getSourceUrlForAuthority(c.authority)}" target="_blank" class="card-btn-link">View Source Document</a>
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
    const summary = circ ? circ.officialText : "Official announcement text published on compliance portal.";
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

🔍 OFFICIAL NOTIFICATION TEXT
-----------------------------
"${summary}"

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
Portals Audited: 6 Active (ITC, ITN, TAX-CAL, GST, IBBI, MCA)
--------------------------------------------------

Dear Professional,

Here is the compiled regulatory compliance summary generated by Scout AI for your reference:

📌 KEY COMPLIANCE NOTIFICATIONS & ALERTS
----------------------------------------

1️⃣ INCOME TAX (CBDT & CALENDAR)
• TDS/TCS Deposit: June 2026 deposits must be cleared on or before July 7, 2026.
• Cost Inflation Index (CII): Specified as 384 for FY 2026-27 under Notification No. 58/2026.
• Compounding Guidelines: Section 276B default fees reduced to 2% per month; 12-month filing limits.
• Co-operative Societies: Option Form 10-IB filing deadline extended to September 30, 2026.

2️⃣ GOODS & SERVICES TAX (GST)
• Form DRC-01C Mismatches: Automated reconciliation matching GSTR-2B and GSTR-3B ITC claims (7-day response).
• Biometric Registration: Aadhaar authentication integration active for risk-profiled applications.

3️⃣ MINISTRY OF CORPORATE AFFAIRS (MCA)
• SBO Declarations: SBO rules mandate indirect ownership reports in Form BEN-2 in 30 days.
• LLP Form 11: Annual Return filing deadline extended to July 15, 2026, without late fees.

4️⃣ INSOLVENCY & BANKRUPTCY (IBBI)
• CIRP Valuer Timeline: RP must appoint registered valuers by Day 47 and register funding in 7 days.
• Compliance Monitoring Portal (CMP): Launch of online portal; legacy email submissions cease July 10, 2026.

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
        if (p.id.startsWith("income-tax")) {
            foundText = `Connected. Scraped e-filing updates. Found new notification for co-operative societies Form 10-IB filing extension.`;
        } else if (p.id === "gst-advisory") {
            foundText = `Connected. Port API active. Extracted Advisory BIO-REG-2026 regarding Aadhaar biometric registration integration.`;
        } else if (p.id === "mca-updates") {
            foundText = `Connected. DOM Scraping completed. Found LLP Circular No. 06/2026 extending Form 11 due date.`;
        } else if (p.id === "ibbi-updates") {
            foundText = `Connected. Scrape complete. Found Circular CMP-099 regarding the new Compliance Monitoring Portal launch.`;
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
        if (!["income-tax-circulars", "income-tax-notifications", "income-tax-calendar", "gst-advisory", "ibbi-updates", "mca-updates"].includes(ap.id)) {
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
    let officialText = `All registered entities must enforce a strict digital audit trail for all transactional processing through designated intermediary networks. CA-certified balance disclosures must be uploaded electronically via portal systems within 30 days of the close of each reporting cycle. Failure to upload the required files will trigger direct review.`;
    let action = `Identify clients engaging in foreign transaction clearing. Coordinate with their in-house teams to pull system audit reports.`;

    if (portal.short === "RBI") {
        ref = "RBI/2026-27/84";
        title = "Master Direction on Information Technology Governance and Information Security";
        officialText = "In exercise of powers under Section 35A of the Banking Regulation Act, 1949, the Reserve Bank of India hereby directs all NBFCs and commercial banks to establish a Board-level IT Strategy Committee and appoint a CISO. All material cybersecurity incidents must be reported to the Bank within 6 hours. Compliance audits are to be completed by September 30, 2026.";
        action = "Check NBFC client rosters. Ensure IT governance parameters are compliant and incident response logs are configured.";
    } else if (portal.short === "FEMA" || portal.short === "ED") {
        ref = "FEMA Notification No. 412/2026";
        title = "Foreign Exchange Management (Non-debt Instruments) Amendment Rules, 2026";
        officialText = "The Central Government hereby amends the Foreign Exchange Management (Non-debt Instruments) Rules, 2019, to permit 100% foreign direct investment under the automatic route for satellite manufacturing and space launch systems. Companies receiving FDI must submit Form SMF on the FIRMS portal within 30 days of share allotment.";
        action = "Review space/aerospace startup client capitalization. Ensure SMF reporting is filed for recent foreign investments.";
    } else {
        // Fallback for general name
        title = `New compliance framework published on the ${portal.name} portal`;
        ref = `${portal.short}/2026-27/CIR-${Math.floor(100 + Math.random()*900)}`;
        officialText = `The authority hereby notifies all concerned stakeholders regarding the rollout of the updated regulatory framework and filing procedures. Compliance filings must be verified by a practicing CA and submitted on the online portal.`;
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
        officialText: officialText,
        actionRequired: action,
        sourceUrl: portal.url
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
        if (!["income-tax-circulars", "income-tax-notifications", "income-tax-calendar", "gst-advisory", "ibbi-updates", "mca-updates"].includes(p.id)) {
            if (q.includes(p.id) || q.includes(p.short.toLowerCase()) || q.includes(p.name.toLowerCase())) {
                const hasCustomData = circularsDatabase.some(c => c.authority === p.id);
                if (hasCustomData) {
                    const matchedCirc = circularsDatabase.find(c => c.authority === p.id);
                    customResponse = `
                        <p>I located updates regarding your newly connected portal <strong>${p.name}</strong>:</p>
                        <ul>
                            <li><strong>${matchedCirc.refNumber}</strong>: ${matchedCirc.title}</li>
                            <p style="font-style: italic; border-left: 2px solid var(--color-gold); padding-left: 0.8rem; margin: 0.5rem 0;">"${matchedCirc.officialText}"</p>
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
            <p>I found the following <strong>GST Advisories & Releases (CBIC)</strong> compliance notifications in our database:</p>
            <ul>
                <li><strong>GST Advisory CBIC-DRC-01C</strong>: Rollout of automated intimation for GSTR-2B vs GSTR-3B Input Tax Credit (ITC) mismatch (response required in 7 days).</li>
        `;
        if (hasCrawledData) {
            returnText += `
                <li><strong>GST Advisory BIO-REG-2026</strong>: Integration of biometric-based Aadhaar authentication for GST registration applications (requires booking Suvidha Kendra appointment in 10 days).</li>
            `;
        }
        returnText += `
            </ul>
            <p><strong>Recommended CA Action:</strong> Review reconciliation variances in DRC-01C on the portal. Guide new registration applicants to book slots at GST Suvidha Kendras immediately upon receipt of risk-flag notifications.</p>
        `;
        return returnText;
    }

    if (q.includes("income tax") || q.includes("itr") || q.includes("tds") || q.includes("tax") || q.includes("calendar")) {
        let returnText = `
            <p>Based on the <strong>Income Tax (CBDT)</strong> updates, here is the current assessment:</p>
            <ul>
                <li><strong>Tax Calendar July 2026</strong>: Deposit of TDS/TCS deducted/collected during June 2026 is due by <strong>July 7, 2026</strong>.</li>
                <li><strong>Notification No. 58/2026</strong>: Cost Inflation Index (CII) for FY 2026-27 is specified as <strong>384</strong>.</li>
                <li><strong>Circular No. 12/2026</strong>: Revised compounding guidelines (Section 276B TDS default fee reduced to 2% per month; 12-month limit for applications).</li>
        `;
        if (hasCrawledData) {
            returnText += `
                <li><strong>Notification No. 59/2026</strong>: Extension of due date for filing option Form 10-IB for co-operative societies to <strong>September 30, 2026</strong>.</li>
            `;
        }
        returnText += `
            </ul>
            <p><strong>CA Advisory Tip:</strong> Ensure June TDS/TCS deposits are cleared before the July 7 deadline. Apply the new 384 indexation multiplier for capital gains computations, and review active prosecution lists for reduced compounding interest rates.</p>
        `;
        return returnText;
    }

    if (q.includes("ibbi") || q.includes("insolvency") || q.includes("bankruptcy") || q.includes("valuer")) {
        let returnText = `
            <p>Here is the compliance brief for the <strong>Insolvency & Bankruptcy Board (IBBI)</strong> regulations:</p>
            <ul>
                <li><strong>IBBI/2026-27/GN/REG098</strong>: Amendment to CIRP rules requiring Resolution Professional to appoint registered valuers within 47 days and register interim finance within 7 days.</li>
        `;
        if (hasCrawledData) {
            returnText += `
                <li><strong>Circular IBBI/IP/CMP-099</strong>: Launch of the new online Compliance Monitoring Portal (CMP). Disclosures must be updated on this portal by July 10, 2026.</li>
            `;
        }
        returnText += `
            </ul>
            <p><strong>Compliance Check:</strong> Ensure valuer scheduling is aligned to Day 47 for CIRP cases, and prepare credentials for the July 10 CMP portal migration.</p>
        `;
        return returnText;
    }

    if (q.includes("mca") || q.includes("companies act") || q.includes("roc") || q.includes("company") || q.includes("llp") || q.includes("sbo") || q.includes("ben-2")) {
        let returnText = `
            <p>I located the following <strong>Ministry of Corporate Affairs (MCA)</strong> compliance updates:</p>
            <ul>
                <li><strong>Notification F.No. 1/12/2020-CL-V</strong>: Compulsory identification of Significant Beneficial Owners (SBO) and filing Form BEN-2 in 30 days.</li>
        `;
        if (hasCrawledData) {
            returnText += `
                <li><strong>LLP Circular No. 06/2026</strong>: Extension of due date for filing LLP Form 11 (Annual Return) for FY 2025-26 to <strong>July 15, 2026</strong> without late fees.</li>
            `;
        }
        returnText += `
            </ul>
            <p><strong>Action Point:</strong> Audit client profiles for trust/partnership shareholders to prepare BEN-2 filings. Finalize pending LLP Form 11 returns for upload on the V3 portal before the extended July 15 deadline.</p>
        `;
        return returnText;
    }

    // Default Fallback
    return `
        <p>I've analyzed the circulars database for <em>"${escapeHTML(query)}"</em>.</p>
        <p>Currently, there are <strong>${circularsDatabase.length} active updates</strong> in our database. You can ask me details about:</p>
        <ul>
            <li><strong>Income Tax notifications</strong> (CII rate, compounding rules, TDS calendar due dates).</li>
            <li><strong>GST advisories</strong> (Form DRC-01C mismatch, Aadhaar registration biometrics).</li>
            <li><strong>MCA Companies Act</strong> (Form BEN-2 SBO disclosures, LLP Form 11 extensions).</li>
            <li><strong>IBBI insolvency rules</strong> (CIRP valuer timelines, Compliance Monitoring Portal).</li>
            ${monitoredPortals.filter(p => !["income-tax-circulars", "income-tax-notifications", "income-tax-calendar", "gst-advisory", "ibbi-updates", "mca-updates"].includes(p.id)).map(p => `<li><strong>${p.short} updates</strong> (custom portal connected).</li>`).join('')}
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
