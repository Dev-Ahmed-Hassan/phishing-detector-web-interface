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
        "Digiinn360.jpeg": "digiinn360.jpeg",
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
    severity: "safe",
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
    id: "case-digiinn360",
    title: "Digiinn360 - Red Team & Offensive Security Recruitment",
    category: "job",
    severity: "safe",
    target_entity: "Digiinn360",
    verdict_line: "Official recruitment flyer for Red Team Operators & Offensive Security Specialists at Digiinn360.",
    input_text: "WE'RE HIRING: RED TEAM OPERATORS & OFFENSIVE SECURITY SPECIALISTS. Digiinn360 is building an elite Red Team and seeking passionate offensive security professionals to join us! Company Description: Digiinn360 is a technology-focused organization dedicated to providing innovative and secure digital solutions. Open Positions: Network Operations, Offensive Capabilities & AI Research, Penetration Testers / Red Team Operators.",
    input_urls: ["https://digiinn360.com"],
    input_files: [
      { name: "Digiinn360.jpeg", type: "IMG", size: "225 KB" }
    ],
    ad_image: "/images/digiinn360.jpeg",
    report_data: {
      status: "success",
      message: "Investigation complete",
      report: {
        metadata: {
          input_language: "english",
          target_entity: "Digiinn360",
          model: "gemini-2.5-flash",
          temperature: 0,
          total_facts: 3,
          total_red_flags: 0,
          total_links_of_interest: 1,
          total_discarded: 0
        },
        executive_summary: {
          verdict: "legitimate",
          confidence_score: 91,
          primary_threat_vector: "Verified Cybersecurity Entity",
          one_sentence_takeaway: {
            en: "Digiinn360 is an active technology & cybersecurity organization recruiting offensive security specialists with standard corporate channels.",
            ur: "ڈجی ان ۳۶۰ سائبر سیکیورٹی کا ایک تصدیق شدہ ادارہ ہے جو ریڈ ٹیم آپریٹرز کی بھرتی کر رہا ہے۔"
          }
        },
        user_facing_report: {
          title: "Verified Authentic Cybersecurity Recruitment",
          summary_paragraph: "Verification indicates a legitimate recruitment drive for cybersecurity specialists with standard corporate recruitment practices.",
          what_we_checked: [
            "Domain Infrastructure & Technical Footprint",
            "Corporate Presence & Technology Operations",
            "Job Posting Integrity & Payment Policy"
          ],
          what_you_should_do: [
            "Apply directly via official Digiinn360 contact channels.",
            "Verify official domain credentials when submitting sensitive CV details."
          ]
        },
        verified_facts: [
          {
            fact: "Digiinn360 is a technology-focused cybersecurity organization",
            source: "Corporate Registry & Domain Footprint",
            confidence: 95,
            notes: "Active cybersecurity firm."
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
