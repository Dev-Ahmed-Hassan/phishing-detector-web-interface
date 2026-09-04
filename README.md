# ScamLess — Agentic AI Phishing & Fraud Detector

**Alibaba Cloud Hackathon Pakistan — Project ID: P02479**  
**Development:** Solo project built by **Ahmed Hassan** during the hackathon sprint.  

- **Live Web Application:** [https://scamless.vercel.app](https://scamless.vercel.app)
- **FastAPI Backend Server:** [https://phishing-detector-self-five.vercel.app](https://phishing-detector-self-five.vercel.app)
- **Frontend Repository:** [https://github.com/Dev-Ahmed-Hassan/phishing-detector-web-interface](https://github.com/Dev-Ahmed-Hassan/phishing-detector-web-interface)
- **Backend Repository:** [https://github.com/Dev-Ahmed-Hassan/phishing-detector](https://github.com/Dev-Ahmed-Hassan/phishing-detector)
- **Chrome Extension Repository:** [https://github.com/Dev-Ahmed-Hassan/web-extension-interface](https://github.com/Dev-Ahmed-Hassan/web-extension-interface)

---

## Executive Summary & Real-World Scam Problem

Every month, thousands of Pakistani students and job seekers fall victim to recruitment fraud over WhatsApp. Scammers issue instant offer letters without interviews, assign basic tasks, and then demand compulsory "certification or processing fees" (typically Rs 1,500 – Rs 5,000 or $25) before releasing completion certificates.

### Concrete Example:

**Incoming WhatsApp Scam Message:**
> *"Congratulations! You are selected for the Virtual Web Developer Internship at Vanguard Apex Solutions. Submit your acceptance form today. Note: A mandatory $25 processing fee is required upon task completion for signed certificate issuance."*

**What ScamLess Outputs:**
- **Verdict:** `SUSPICIOUS / HIGH RISK` (Score: 16 / 100)
- **Primary Threat Vector:** Certificate Fee Trap & Unvetted Offer Letters
- **Verbatim Red Flag Citation 1:** *"Upon completing assigned tasks, interns are instructed to pay a mandatory processing fee of $25 to receive their signed certificate."* (Sourced from public community complaint forums)
- **Verbatim Red Flag Citation 2:** *"Applicants receive instant PDF offer letters within 5 minutes of submitting a form with no interview or assessment."* (Sourced from community review threads)
- **Domain Check:** `vanguardapex.tech` registered 45 days ago in July 2026 (< 180 days old).

*(Note for Judges: Illustrative walkthrough of scoring logic based on active Python JudgeV2 math engine. You can test demo cases like these live on [scamless.vercel.app](https://scamless.vercel.app) using the "Demo Cases" button).*

---

## Architecture & Pipeline Execution

```
[ User Input: Text / Image / Screenshot / PDF ]
                       │
                       ▼
┌────────────────────────────────────────────────────────┐
│ PHASE 1: EXTRACTION (Regex + Gemini Multimodal OCR)    │
│ Parses raw text & images for company names, phone      │
│ numbers, emails, and links. Does NOT judge risk.       │
└──────────────────────┬─────────────────────────────────┘
                       │
                       ▼
┌────────────────────────────────────────────────────────┐
│ PHASE 2: EVIDENCE GATHERING (Python Parallel OSINT)    │
│ Runs 8 parallel searches for domain age (WHOIS),       │
│ official websites, LinkedIn pages, and scam reports.   │
└──────────────────────┬─────────────────────────────────┘
                       │
                       ▼
┌────────────────────────────────────────────────────────┐
│ PHASE 2.5: EVIDENCE CACHING (Supabase Database)        │
│ Reuses cached web snippets (~15ms local DB lookup) to  │
│ skip redundant scraping for previously checked links.  │
└──────────────────────┬─────────────────────────────────┘
                       │
                       ▼
┌────────────────────────────────────────────────────────┐
│ PHASE 3: AI FACT-CHECKER & SCORING ENGINE              │
│ Evaluates evidence with Gemini 3.5 Flash Lite. Forces  │
│ verbatim quotes. Score is computed deterministically.  │
└──────────────────────┬─────────────────────────────────┘
                       │
                       ▼
┌────────────────────────────────────────────────────────┐
│ PHASE 4: INSTANT UI RESPONSE & PRE-TRANSLATION         │
│ Returns results immediately to user. Saves dossier and │
│ generates Urdu & Roman Urdu translations in background.│
└────────────────────────────────────────────────────────┘
```

---

## Technical Features & Engineering Rationale

### 1. Verbatim Quote Citations (AI Trust Guard)
- **Mechanics:** Every red flag and verified fact in a report MUST include an exact quote copied directly from a real web snippet.
- **Why this matters:** Forces the AI to ground every verdict in verifiable evidence text instead of inventing accusations or hallucinating fake claims.

### 2. Deterministic Scoring Engine & Worked Example
To eliminate ungrounded AI risk guesses, the confidence score is calculated using fixed math rules in Python (`JudgeV2`). Weights were hand-tuned based on observed recruitment scam patterns in Pakistan:

- **Base Score:** 50 Points
- **Official Presence Signals:**
  - **+20 Points:** Strong official presence (LinkedIn company page AND official corporate website confirmed)
  - **+12 Points:** Partial official presence (LinkedIn OR official corporate website confirmed)
  - **-10 Points:** Penalty if no verifiable official presence can be found (neither website nor LinkedIn)
- **Domain Age Signals (WHOIS):**
  - **+10 Points:** Established website domain (> 1 year / 365 days old)
  - **-12 Points:** Very new website domain (< 6 months / 180 days old)
- **Red Flags Penalty:**
  - Applies penalties for top 2 red flags to prevent duplicate penalty inflation:
    - High-weight flag: -12 Points
    - Medium-weight flag: -6 Points
    - Low-weight flag: -2 Points
- **Threat Vectors Penalty:**
  - Single top threat vector penalty based on severity (High: -10 PTS, Medium: -5 PTS, Low: -2 PTS)
- **Score Bounds:** The final score is strictly clamped between **0 (Confirmed Scam)** and **100 (Verified Legitimate)**.

#### Illustrative Worked Math Example:
*(Representative walkthrough of scoring logic for a suspicious recruitment notice)*

```text
  Base Score:                                           50 PTS
  Partial Official Presence (Website found, no LinkedIn): +12 PTS
  New Domain Penalty (Registered 45 days ago in July 2026): -12 PTS
  Red Flag 1 Penalty (High-weight: Certificate fee demand):  -12 PTS
  Red Flag 2 Penalty (High-weight: Unvetted offer letter):  -12 PTS
  Top Threat Vector Penalty (High severity: Fee trap):      -10 PTS
  ─────────────────────────────────────────────────────────────────
  Calculated Final Score: 50 + 12 - 12 - 12 - 12 - 10  = 16 PTS (Suspicious / High Risk)
```

### 3. Resilient Content Fetching
- **8 Parallel Workers:** Runs domain lookups, official website searches, scam complaint checks, and phone directory searches simultaneously.
- **Provider Failover:** Automatically switches search engines if a search provider experiences rate-limiting or ISP blocks.
- **Resilient Web Reading:** Uses standard browser headers and reader proxies (`https://r.jina.ai/`) to read public web pages cleanly even when sites block standard scrapers.

### 4. Skip-Scrape Evidence Cache (~15ms Local Lookup)
- Verified web snippets are stored in a Supabase PostgreSQL database (`scraped_evidence_cache`).
- If a URL was checked previously, the engine reuses the saved snippet (~15ms local database lookup) to skip redundant web scraping and reduce latency. *(Timings measured during single-request local testing)*.

### 5. Instant UI Response & Multilingual Pre-Translation
- **Non-blocking Response:** Returns the investigation payload immediately to the user while database persistence and translation run asynchronously.
- **Urdu & Roman Urdu Support:** Pre-translates report summaries into Urdu Script (`ur`) and Roman Urdu (`roman_ur`) in the background, enabling 0ms UI language toggling.
- **API Key Security:** All Gemini API keys and database credentials are handled server-side via environment variables; no secrets are exposed to the client.

---

## Limitations & Honest Constraints

1. **Text & Document Scope:** Concentrated on text, flyer images, and PDF offer letters. Live audio voice call analysis is currently out of scope.
2. **Search Engine Dependency:** Requires active internet connectivity for real-time OSINT searches. If search providers block queries simultaneously, the system relies on cached community evidence.
3. **Regional Focus:** Language models and prompt structures are optimized for Pakistani recruitment contexts (English, Urdu, and Roman Urdu).

---

## Local Setup & Run Instructions

### Prerequisites:
- Node.js 18+ & npm
- Python 3.11+ & pip

### 1. Frontend Setup (`/web`):
```bash
cd web
npm install
npm run dev
# Frontend runs at http://localhost:3000
```

### 2. Backend Setup (`/phishing-detector`):
```bash
cd phishing-detector
pip install -r requirements.txt
export GEMINI_API_KEY="your_gemini_api_key"
uvicorn api.index:app --reload --port 8000
# Backend runs at http://localhost:8000
```

---

## Repository Structure

- `/web` — Next.js 14 Frontend Application ([phishing-detector-web-interface](https://github.com/Dev-Ahmed-Hassan/phishing-detector-web-interface))
- `/phishing-detector` — Python FastAPI Server & OSINT Engine ([phishing-detector](https://github.com/Dev-Ahmed-Hassan/phishing-detector))
- `/extension` — Manifest V3 Chrome Extension ([web-extension-interface](https://github.com/Dev-Ahmed-Hassan/web-extension-interface))

---

## Technical Stack

- **AI Models:** Google Gemini 3.5 / 2.0 via `google-genai` SDK
- **Backend:** Python 3.11, FastAPI, BeautifulSoup4, DuckDuckGo Search, Jina AI Reader API
- **Frontend:** Next.js 14, React, Tailwind CSS
- **Database & Telemetry:** Supabase PostgreSQL (`dossiers`, `entity_threat_index`, `scraped_evidence_cache`)
- **Hosting:** Vercel

---

## Quick Links

- **Live Web Application:** [https://scamless.vercel.app](https://scamless.vercel.app)
- **Report Scam Portal:** [https://scamless.vercel.app/report-scam](https://scamless.vercel.app/report-scam)
- **Developer Portfolio:** [https://ahmed-hassan-portfoliosite.vercel.app/](https://ahmed-hassan-portfoliosite.vercel.app/)
