import type { AnalyzeV2Response } from "./report-types";

// Server-side helper to copy real-world ad flyer images to public/images folder
if (typeof window === "undefined") {
  try {
    const fs = require("fs");
    const path = require("path");
    const srcDir = path.join(process.cwd(), "images");
    const destDir = path.join(process.cwd(), "public", "images");
    if (fs.existsSync(srcDir)) {
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
      const map: Record<string, string> = {
        "Code Alpha.png": "code-alpha.png",
        "PCT Fielding Coach.png": "pct-fielding-coach.png",
        "Ubexis.jpeg": "ubexis.jpeg",
        "Screenshot 2026-09-12 160554.png": "ext-screenshot-1.png",
        "Screenshot 2026-09-12 160611.png": "ext-screenshot-2.png",
        "Screenshot 2026-09-12 160645.png": "ext-screenshot-3.png",
      };
      for (const [src, dest] of Object.entries(map)) {
        const s = path.join(srcDir, src);
        const d = path.join(destDir, dest);
        if (fs.existsSync(s) && (!fs.existsSync(d) || fs.statSync(s).mtimeMs > fs.statSync(d).mtimeMs)) {
          fs.copyFileSync(s, d);
        }
      }
    }
  } catch (e) {}
}

export interface DemoCaseFile {
  name: string;
  type: "IMG" | "PDF" | "AUDIO";
  size: string;
}

export interface DemoCaseItem {
  id: string;
  title: string;
  category: "job" | "whatsapp" | "phishing" | "payment" | "legitimate";
  severity: "high" | "suspicious" | "safe";
  target_entity: string;
  verdict_line: string;
  input_text: string;
  input_urls: string[];
  input_files: DemoCaseFile[];
  ad_image?: string;
  report_data: AnalyzeV2Response;
}

export const DEMO_CASES_LIST: DemoCaseItem[] = [
  {
    id: "case-codealpha",
    title: "CodeAlpha - Training & Internship Offer",
    category: "job",
    severity: "high",
    target_entity: "CodeAlpha",
    verdict_line: "Mass virtual internship program issuing automated acceptance letters & soliciting completion fees.",
    input_text: "Greetings from CodeAlpha!! CodeAlpha, in collaboration with IIT, is organizing a Training + Internship program with 3+ projects. Fill up the form and your Internship Offer Letter will be released within 24-48 hours. Program completion certificate issued upon deposit of administrative processing fees.",
    input_urls: ["https://codealpha.tech/register"],
    input_files: [
      { name: "Code Alpha.png", type: "IMG", size: "137 KB" }
    ],
    ad_image: "/images/code-alpha.png",
    report_data: {
      status: "success",
      message: "Investigation complete",
      report: {
        metadata: {
          input_language: "english",
          target_entity: "CodeAlpha",
          model: "gemini-2.5-flash",
          temperature: 0,
          total_facts: 2,
          total_red_flags: 2,
          total_links_of_interest: 2,
          total_discarded: 1
        },
        executive_summary: {
          verdict: "suspicious",
          confidence_score: 18,
          primary_threat_vector: "Virtual Certificate Fee Trap & Unvetted Acceptance",
          one_sentence_takeaway: {
            en: "CodeAlpha issues instant unvetted virtual internship offer letters and conditions completion certificates on candidate fee deposits.",
            ur: "کوڈ الفا بغیر کسی تفتیش کے انٹرنشپ آفر لیٹر جاری کرتا ہے اور سرٹیفکیٹ کی فیس وصول کرتا ہے۔"
          }
        },
        user_facing_report: {
          title: "High-Risk Virtual Internship & Fee Warning",
          summary_paragraph: "Investigation indicates an unvetted certificate monetization scheme. Candidates receive instant acceptance letters without technical interviews, followed by mandatory secondary fee demands.",
          what_we_checked: [
            "Official Domain Registry & Web Infrastructure",
            "Candidate Feedback & Public Community Warnings",
            "Corporate Registration Credentials"
          ],
          what_you_should_do: [
            "Do not transfer money to secure internship completion certificates.",
            "Verify company registration credentials on official business registries.",
            "Report fraudulent recruitment handles to cybersecurity portals."
          ]
        },
        verified_facts: [
          {
            fact: "Mass offer letter issuance without technical screening",
            source: "Candidate Feedback",
            confidence: 95,
            notes: "Identical template letters distributed across social channels."
          }
        ],
        red_flags: [
          {
            flag: "Advance certification fee demand",
            indicator: "Monetization trap requiring mandatory deposit prior to certificate release.",
            technical_basis: "Legitimate internship providers do not condition completion credentials on candidate deposits.",
            severity: "high"
          }
        ],
        threat_vectors: [
          {
            vector: "Certificate Mill & Fee Monetization",
            technical_grounding: "Conditions completion credentials on mandatory secondary payments.",
            contributing_evidence: ["CodeAlpha Flyer Payload"],
            severity: "high"
          }
        ],
        uncertainties: [],
        discarded_evidence: []
      }
    }
  },
  {
    id: "case-pcb",
    title: "Pakistan Cricket Board (PCB) Security Vacancy",
    category: "job",
    severity: "suspicious",
    target_entity: "Pakistan Cricket Board (PCB)",
    verdict_line: "Senior Manager Security vacancy notice requiring 20 years service in Army or Police.",
    input_text: "We're Hiring! Pakistan Cricket Board (PCB) is seeking Senior Manager Security & Anti-Corruption. Essential Functions: Ensure safety of PCB assets & venues, coordinate with LEAs. Minimum Bachelor's Degree from HEC university and 20 years service in Pakistan Army, Punjab Police, or Sindh Police. Interested candidates apply by 5 p.m. on 17 September 2026 on www.pcb.com.pk/jobs.",
    input_urls: ["https://www.pcb.com.pk/jobs"],
    input_files: [
      { name: "PCT Fielding Coach.png", type: "IMG", size: "731 KB" }
    ],
    ad_image: "/images/pct-fielding-coach.png",
    report_data: {
      status: "success",
      message: "Investigation complete",
      report: {
        metadata: {
          input_language: "english",
          target_entity: "Pakistan Cricket Board (PCB)",
          model: "gemini-2.5-flash",
          temperature: 0,
          total_facts: 3,
          total_red_flags: 0,
          total_links_of_interest: 1,
          total_discarded: 0
        },
        executive_summary: {
          verdict: "legitimate",
          confidence_score: 92,
          primary_threat_vector: "Official Domain Verification Match",
          one_sentence_takeaway: {
            en: "Official Pakistan Cricket Board vacancy circular directing applicants strictly to pcb.com.pk/jobs.",
            ur: "یہ پاکستان کرکٹ بورڈ کی سرکاری ملازمت کا اشتہار ہے جو pcb.com.pk کا استعمال کرتا ہے۔"
          }
        },
        user_facing_report: {
          title: "Official Government Board Vacancy Notice",
          summary_paragraph: "Verification matches official PCB public domain infrastructure (pcb.com.pk) with clean credentials.",
          what_we_checked: [
            "Official PCB Domain Security & SSL Hierarchy",
            "Public Circular Archives",
            "Application Endpoint Verification"
          ],
          what_you_should_do: [
            "Apply exclusively through the official portal at www.pcb.com.pk/jobs.",
            "Do not pay any third-party agent claiming guaranteed selection."
          ]
        },
        verified_facts: [
          {
            fact: "Domain pcb.com.pk is the official website of Pakistan Cricket Board",
            source: "PKNIC Registry",
            confidence: 99,
            notes: "Verified government sports governing body."
          }
        ],
        red_flags: [],
        threat_vectors: [],
        uncertainties: [],
        discarded_evidence: []
      }
    }
  },
  {
    id: "case-ubexis",
    title: "Ubexis - 2 Months Remote Internship Opportunity",
    category: "job",
    severity: "high",
    target_entity: "Ubexis",
    verdict_line: "Remote internship flyer for Web Dev & Business Dev soliciting resumes via hr@ubexis.com.",
    input_text: "Join Ubexis - 2 Months Remote Internship Opportunity. Learn. Grow. Build Your Future. Roles: Web Development, Business Development, Digital Content Creation. Send your resume to hr@ubexis.com. Apply till 10 July 2026.",
    input_urls: ["https://ubexis.com"],
    input_files: [
      { name: "Ubexis.jpeg", type: "IMG", size: "113 KB" }
    ],
    ad_image: "/images/ubexis.jpeg",
    report_data: {
      status: "success",
      message: "Investigation complete",
      report: {
        metadata: {
          input_language: "english",
          target_entity: "Ubexis",
          model: "gemini-2.5-flash",
          temperature: 0,
          total_facts: 2,
          total_red_flags: 2,
          total_links_of_interest: 1,
          total_discarded: 0
        },
        executive_summary: {
          verdict: "suspicious",
          confidence_score: 25,
          primary_threat_vector: "Unverified Entity & Free-Mail Recruitment",
          one_sentence_takeaway: {
            en: "Ubexis solicits remote internship applications with unverified corporate registration records.",
            ur: "یوبیکس کے نام سے ریموٹ انٹرنشپ کا غیر تصدیق شدہ اشتہار ہے۔"
          }
        },
        user_facing_report: {
          title: "Unverified Remote Internship Warning",
          summary_paragraph: "Investigation indicates an unverified entity operating remote recruitment via direct email without public tax registration filings.",
          what_we_checked: [
            "Domain Registration & Email Server Authentication",
            "SECP Corporate Filings",
            "Employee Footprint"
          ],
          what_you_should_do: [
            "Verify company registration credentials before accepting contracts.",
            "Do not pay security deposits or laptop shipping fees."
          ]
        },
        verified_facts: [],
        red_flags: [
          {
            flag: "Unregistered corporate entity",
            indicator: "No corporate registration filings found.",
            technical_basis: "Lack of public tax or business filings.",
            severity: "high"
          }
        ],
        threat_vectors: [],
        uncertainties: [],
        discarded_evidence: []
      }
    }
  },
  {
    id: "case-02",
    title: "WhatsApp Task Reward & EasyPaisa Escrow Scam",
    category: "whatsapp",
    severity: "high",
    target_entity: "Global Task Media",
    verdict_line: "WhatsApp task scheme promising daily YouTube rewards via EasyPaisa deposits.",
    input_text: "Earn Rs 5,000 daily by liking YouTube videos! Work 1 hour per day from home. Transfer Rs 1,500 security deposit to EasyPaisa Account 0300-9876543 to unlock VIP tasks.",
    input_urls: ["https://wa.me/923009876543"],
    input_files: [
      { name: "whatsapp_voice_recruiter.mp3", type: "AUDIO", size: "1.4 MB" }
    ],
    report_data: {
      status: "success",
      message: "Investigation complete",
      report: {
        metadata: {
          input_language: "english",
          target_entity: "Global Task Media",
          model: "gemini-2.5-flash",
          temperature: 0,
          total_facts: 2,
          total_red_flags: 2,
          total_links_of_interest: 1,
          total_discarded: 0
        },
        executive_summary: {
          verdict: "malicious",
          confidence_score: 8,
          primary_threat_vector: "Task Escrow Advance-Fee Wallet Drain",
          one_sentence_takeaway: {
            en: "Global Task Media uses fake YouTube task rewards to solicit EasyPaisa deposits before blocking candidate communications.",
            ur: "یہ ایک جعلی ٹاسک اسکیم ہے جو ایزی پیسہ کے ذریعے رقم وصول کرنے کے بعد مواصلات منقطع کر دیتی ہے۔"
          }
        },
        user_facing_report: {
          title: "High-Risk Task Escrow Fraud Warning",
          summary_paragraph: "Analysis confirms a task-based advance-fee fraud scheme operating over WhatsApp. Victims are promised high payouts for video likes but lose deposits sent to personal mobile wallets.",
          what_we_checked: [
            "WhatsApp Business Handle & Associated Reports",
            "EasyPaisa Account Transaction Complaints",
            "Known YouTube Task Fraud Templates"
          ],
          what_you_should_do: [
            "Do not send money to personal EasyPaisa or JazzCash accounts.",
            "Block the recruiter handle on WhatsApp immediately.",
            "File a complaint on the FIA Cybercrime portal."
          ]
        },
        verified_facts: [
          {
            fact: "Mobile wallet account registered to an individual, not a business",
            source: "Wallet Database Check",
            confidence: 98,
            notes: "Account is a personal wallet tier."
          }
        ],
        red_flags: [
          {
            flag: "Upfront deposit required to unlock earnings",
            indicator: "Demands Rs 1,500 security deposit.",
            technical_basis: "Classic advance-fee fraud signature.",
            severity: "high"
          }
        ],
        threat_vectors: [
          {
            vector: "Advance-Fee Mobile Wallet Drain",
            technical_grounding: "Solicits non-refundable mobile wallet deposits.",
            contributing_evidence: ["WhatsApp Message Logs"],
            severity: "high"
          }
        ],
        uncertainties: [],
        discarded_evidence: []
      }
    }
  },
  {
    id: "case-03",
    title: "HBL Banking Lookalike Phishing Portal",
    category: "phishing",
    severity: "high",
    target_entity: "Habib Bank Limited (HBL)",
    verdict_line: "Spoofed banking portal soliciting urgent account verification credentials.",
    input_text: "HBL Alert: Your account requires immediate verification to prevent suspension. Complete background review at http://hbl-careers-portal-verify.com/login before end of day.",
    input_urls: ["http://hbl-careers-portal-verify.com/login"],
    input_files: [
      { name: "account_verification_notice.pdf", type: "PDF", size: "320 KB" }
    ],
    report_data: {
      status: "success",
      message: "Investigation complete",
      report: {
        metadata: {
          input_language: "english",
          target_entity: "Habib Bank Limited (HBL)",
          model: "gemini-2.5-flash",
          temperature: 0,
          total_facts: 2,
          total_red_flags: 2,
          total_links_of_interest: 1,
          total_discarded: 0
        },
        executive_summary: {
          verdict: "suspicious",
          confidence_score: 22,
          primary_threat_vector: "Domain Typosquatting & Phishing Credential Harvest",
          one_sentence_takeaway: {
            en: "The URL hbl-careers-portal-verify.com is an unofficial lookalike domain impersonating Habib Bank Limited.",
            ur: "یہ لنک حبیب بینک کا سرکاری پورٹل نہیں ہے بلکہ ایک غیر تصدیق شدہ ویب سائٹ ہے۔"
          }
        },
        user_facing_report: {
          title: "Typosquatting & Phishing Risk Warning",
          summary_paragraph: "The provided recruitment link uses an unauthorized lookalike domain registered outside official HBL banking infrastructure.",
          what_we_checked: [
            "Official Bank Domain SSL & DNS Hierarchy",
            "WHOIS Registration & Registrar Details",
            "Authentication Redirect Targets"
          ],
          what_you_should_do: [
            "Do not enter passwords or personal credentials on this link.",
            "Navigate directly to the official bank careers page.",
            "Report suspicious links to the bank IT security team."
          ]
        },
        verified_facts: [
          {
            fact: "Domain hbl-careers-portal-verify.com is not owned by HBL",
            source: "DNS Infrastructure Lookup",
            confidence: 99,
            notes: "Official domain is hbl.com."
          }
        ],
        red_flags: [
          {
            flag: "Impersonation domain structure",
            indicator: "Uses bank brand name combined with hyphenated keywords.",
            technical_basis: "Signature typosquatting pattern.",
            severity: "high"
          }
        ],
        threat_vectors: [
          {
            vector: "Credential Harvesting",
            technical_grounding: "Impersonates legitimate corporate login forms.",
            contributing_evidence: ["Domain WHOIS Record"],
            severity: "high"
          }
        ],
        uncertainties: [],
        discarded_evidence: []
      }
    }
  },
  {
    id: "case-04",
    title: "DarazPK Logistics Refund Scheme",
    category: "payment",
    severity: "high",
    target_entity: "DarazPK Logistics",
    verdict_line: "Impersonated e-commerce refund portal requesting debit card PINs & SMS OTPs.",
    input_text: "Order #89212 status update: Payment failed. To process immediate refund of Rs 14,500, enter your debit card PIN and OTP on our refund portal.",
    input_urls: ["http://daraz-refunds-pakistan.net/otp"],
    input_files: [
      { name: "daraz_refund_receipt.jpg", type: "IMG", size: "650 KB" }
    ],
    report_data: {
      status: "success",
      message: "Investigation complete",
      report: {
        metadata: {
          input_language: "english",
          target_entity: "DarazPK Logistics",
          model: "gemini-2.5-flash",
          temperature: 0,
          total_facts: 2,
          total_red_flags: 2,
          total_links_of_interest: 1,
          total_discarded: 0
        },
        executive_summary: {
          verdict: "malicious",
          confidence_score: 10,
          primary_threat_vector: "OTP Harvesting & Debit Card Fraud",
          one_sentence_takeaway: {
            en: "Impersonates Daraz logistics to trick victims into sharing debit card PINs and bank SMS OTPs on a spoofed website.",
            ur: "یہ ایک جعلی دراز پورٹل ہے جو بینک کارڈ اور OTP حاصل کر کے فراڈ کرتا ہے۔"
          }
        },
        user_facing_report: {
          title: "High-Risk OTP Harvesting Warning",
          summary_paragraph: "Spoofed e-commerce refund portal requesting sensitive banking credentials and OTP tokens.",
          what_we_checked: [
            "Daraz Official Domain Security Advisory",
            "URL Registrar Information & Hosting Node",
            "SMS Sender Identity Protocols"
          ],
          what_you_should_do: [
            "Never share OTPs or banking PINs on external websites.",
            "Verify order refunds directly inside the official Daraz App."
          ]
        },
        verified_facts: [
          {
            fact: "Domain daraz-refunds-pakistan.net registered yesterday",
            source: "WHOIS Registry",
            confidence: 99,
            notes: "Recently registered fraud site."
          }
        ],
        red_flags: [
          {
            flag: "Debit card PIN & OTP request",
            indicator: "Requests confidential banking credentials.",
            technical_basis: "Legitimate e-commerce platforms never request PINs for refunds.",
            severity: "high"
          }
        ],
        threat_vectors: [],
        uncertainties: [],
        discarded_evidence: []
      }
    }
  },
  {
    id: "case-05",
    title: "Instant Microfinance Loan APK Trap",
    category: "payment",
    severity: "high",
    target_entity: "QuickCash MicroLoan",
    verdict_line: "Unlicensed loan application requesting contact book access for extortion.",
    input_text: "Instant Rs 50,000 personal loan approved without collateral! Download our official APK file and grant contacts permission to disburse funds to your wallet.",
    input_urls: ["https://quick-cash-loan-pak.apk/download"],
    input_files: [
      { name: "loan_contract_sample.pdf", type: "PDF", size: "410 KB" },
      { name: "app_permission_screen.png", type: "IMG", size: "920 KB" }
    ],
    report_data: {
      status: "success",
      message: "Investigation complete",
      report: {
        metadata: {
          input_language: "english",
          target_entity: "QuickCash MicroLoan",
          model: "gemini-2.5-flash",
          temperature: 0,
          total_facts: 2,
          total_red_flags: 2,
          total_links_of_interest: 1,
          total_discarded: 0
        },
        executive_summary: {
          verdict: "malicious",
          confidence_score: 5,
          primary_threat_vector: "Malicious APK Contact Scraping & Extortion",
          one_sentence_takeaway: {
            en: "QuickCash MicroLoan uses unvetted APK downloads to extract victim contact lists for harassment and illegal fee extortion.",
            ur: "یہ ایپلیکیشن فون کی فہرستیں چوری کر کے بلیک میلنگ اور غیر قانونی فیسیں وصول کرتی ہے۔"
          }
        },
        user_facing_report: {
          title: "High-Risk Malicious APK & Extortion Warning",
          summary_paragraph: "Unlicensed microfinance app soliciting excessive device permissions outside official app stores.",
          what_we_checked: [
            "SECP Microfinance License Verification",
            "Google Play Store / Official Store Filings",
            "APK Malware & Contact Extraction Signatures"
          ],
          what_you_should_do: [
            "Do not install APK files downloaded from direct web links.",
            "Never grant contact permissions to unverified loan apps."
          ]
        },
        verified_facts: [
          {
            fact: "App hosted on unverified third-party storage bucket",
            source: "APK Header Analysis",
            confidence: 99,
            notes: "Not present on official Google Play Store."
          }
        ],
        red_flags: [
          {
            flag: "Contact list permission requirement",
            indicator: "Demands full address book access for loan disbursal.",
            technical_basis: "Extortion loan app signature pattern.",
            severity: "high"
          }
        ],
        threat_vectors: [],
        uncertainties: [],
        discarded_evidence: []
      }
    }
  },
  {
    id: "case-06",
    title: "Verified Authentic Corporate Recruitment",
    category: "legitimate",
    severity: "safe",
    target_entity: "Systems Limited",
    verdict_line: "Verified publicly traded enterprise with official corporate career portal.",
    input_text: "Thank you for applying for the Associate Software Engineer position at Systems Limited. Please review the position details on our official portal at https://www.systemsltd.com/careers.",
    input_urls: ["https://www.systemsltd.com/careers"],
    input_files: [
      { name: "candidate_guide.pdf", type: "PDF", size: "1.1 MB" }
    ],
    report_data: {
      status: "success",
      message: "Investigation complete",
      report: {
        metadata: {
          input_language: "english",
          target_entity: "Systems Limited",
          model: "gemini-2.5-flash",
          temperature: 0,
          total_facts: 3,
          total_red_flags: 0,
          total_links_of_interest: 1,
          total_discarded: 0
        },
        executive_summary: {
          verdict: "legitimate",
          confidence_score: 94,
          primary_threat_vector: "None Identified",
          one_sentence_takeaway: {
            en: "Systems Limited is a verified publicly traded enterprise with an established corporate web infrastructure and zero fee demands.",
            ur: "سیسٹمز لمیٹڈ ایک تصدیق شدہ سرکاری ادارہ ہے جس کا ویب پورٹل اور ریکارڈ بالکل درست ہے۔"
          }
        },
        user_facing_report: {
          title: "Verified Authentic Enterprise Opportunity",
          summary_paragraph: "Investigation confirms that the opportunity originates from the official corporate domain of Systems Limited with clean security metrics.",
          what_we_checked: [
            "Official Corporate SSL Certificates & DNS Records",
            "SECP & Public Stock Exchange Listing Credentials",
            "Recruitment Communication Protocols"
          ],
          what_you_should_do: [
            "Proceed with the official application process on systemsltd.com.",
            "Keep all communications strictly within official email channels."
          ]
        },
        verified_facts: [
          {
            fact: "Domain systemsltd.com registered over 20 years ago",
            source: "WHOIS Registry",
            confidence: 99,
            notes: "Established corporate infrastructure."
          },
          {
            fact: "Publicly traded entity on Pakistan Stock Exchange",
            source: "Corporate Registry",
            confidence: 99,
            notes: "SECP filing confirmed."
          }
        ],
        red_flags: [],
        threat_vectors: [],
        uncertainties: [],
        discarded_evidence: []
      }
    }
  }
];
