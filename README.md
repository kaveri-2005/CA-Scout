# ScoutCA: AI Advisory, Notification, & Circular Scout

An AI-driven portal designed for Chartered Accountant (CA) firms to monitor, capture, and analyze regulatory updates, circulars, notifications, and advisories across key Indian legal and tax authorities.

---

## 🎨 Theme & Aesthetics

Following your CA field guidelines, the platform is styled with a premium, professional color palette:
*   **Regal Navy Blue (`#0A192F` / `#172A45`)**: Symbolizing authority, trust, compliance, and structure.
*   **Metallic Warm Gold (`#D4AF37` / `#C5A880`)**: Representing wealth management, expertise, and high-quality advisory.
*   **Crisp Slate Background (`#F8FAFC`)**: Ensuring high readability and modern clean layouts.

---

## 🚀 Key Features

1.  **Dashboard Overview**: Check recent circular volumes, pending actions, and active crawler status widgets at a glance.
2.  **Live-Simulated AI Crawler**: Click **"Scan Now"** or **"Run Manual Scout Scan"** to view a visual terminal logging step-by-step crawler access across the client-provided URLs:
    *   **Income Tax (CBDT)**: [https://share.google/p4n9hLqpLICytWs5Z](https://share.google/p4n9hLqpLICytWs5Z)
    *   **SEBI Regulations**: [https://share.google/DfiottCoKaChms4XW](https://share.google/DfiottCoKaChms4XW)
    *   **GST Portal (CBIC)**: [https://share.google/jZKDmVNFgOB5XeDfH](https://share.google/jZKDmVNFgOB5XeDfH)
    *   **Ministry of Corporate Affairs (MCA)**: [https://share.google/nxZQOUeE5rUeLK9Ki](https://share.google/nxZQOUeE5rUeLK9Ki)
3.  **Active Feeds Filter**: Search and filter captured updates by Authority, Date (24h / 48h / 7d), or Priority levels (Critical, Advisory, Info).
4.  **AI Summary & Action Item Mandates**: Every circular is pre-parsed with:
    *   *AI Summary Takeaways*: A 3-bullet core legal update translation.
    *   *CA Action Required*: Direct instructions specifying deadlines and compliance operations for clients.
5.  **Scout Configurations**: Toggle active crawlers, configure daily automated run times (default 6:00 PM), choose AI models, and customize templates.
6.  **6:00 PM Compiled Archive**: Browse daily aggregated PDF/email logs sent to client registers.
7.  **AI Advisory Chatbot**: Speak to an AI compliance bot indexed with the latest circular updates. Type queries like:
    *   *"What are the new rules for GSTR-1?"*
    *   *"Any updates on Income Tax AY 26-27 filing?"*
    *   *"Are there updates from SEBI regarding mutual funds?"*

---

## 💻 How to Run Locally

You can launch a local static web server to test the interface dynamically:

1.  Open your terminal inside this project directory (`e:\CA Scout`).
2.  Start the dev server by running:
    ```bash
    npm start
    ```
    *This runs a lightweight local HTTP server without requiring any global packages.*
3.  Open your browser and navigate to:
    [http://localhost:3000](http://localhost:3000)
