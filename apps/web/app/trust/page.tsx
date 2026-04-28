"use client";

import { useState } from "react";
import Link from "next/link";

const C = {
  canvas: "#FAFAF6", card: "#FFFFFF", text: "#0E0E0E", textMuted: "#5A5A57",
  textFaint: "#8A8A85", teal: "#1F6F66", amber: "#BA7517",
  border: "rgba(15,23,42,0.10)", borderSubtle: "rgba(15,23,42,0.07)",
  ctaBg: "#0E0E0E", ctaText: "#FAFAF6",
};

const inter = "'Inter', system-ui, -apple-system, sans-serif";

const TRUST_BADGES = [
  "Passed a Tier 1 Australian aged care provider cybersecurity review, February 2026",
  "Australian data residency, Sydney, AWS ap-southeast-2",
  "Privacy Act 1988 compliant, APPs, NDB",
  "SOC 2 Type 2 certified infrastructure stack",
  "MFA enforced on every data-access account",
];

interface QASection {
  id: string;
  title: string;
  questions: { q: string; a: string }[];
}

const SECTIONS: QASection[] = [
  {
    id: "architecture", title: "Architecture and design",
    questions: [
      { q: "How is Chris built?", a: "Cloud-native SaaS. Four-layer defence in depth. Edge (Vercel WAF and DDoS protection), Application (Next.js with server-side rendering, Zod input validation, CSRF protection, CSP headers), Database (Supabase PostgreSQL with Row Level Security on every table, SSL enforced, automated daily backups, point-in-time recovery), Authentication (Supabase Auth with bcrypt password hashing, JWT tokens, MFA via TOTP enforced for all data-access accounts)." },
      { q: "How is data encrypted?", a: "TLS 1.3 in transit on every connection. AES-256 at rest in the database, in backups, and in file storage. API keys and secrets stored in Vercel encrypted environment variables, never in source code. Keys rotated annually or on detection of compromise." },
      { q: "What integration with our systems is needed?", a: "None during pilot. Chris runs standalone. No VPN. No on-premises components. No inbound connections to your network. Staff access via web browser and SMS links. APIs and MCP server connectors are scoped for Q3 2026 across the twelve named aged care source systems." },
    ],
  },
  {
    id: "data", title: "Data and what we collect",
    questions: [
      { q: "What data does Chris collect?", a: "Names, work email addresses, mobile phone numbers (for SMS pulse delivery), role and team assignment, pulse survey responses (anonymous at the team level, aggregated for reporting), AI-generated coaching insights (visible to the individual leader only)." },
      { q: "What does Chris explicitly not collect?", a: "Financial or payroll data. Health or medical records. Government identifiers (Medicare, TFN, etc). Resident or client data. Passwords (handled entirely by the authentication provider, never seen by Chris). Biometric data." },
      { q: "Where is data stored?", a: "All personally identifiable information is stored in Sydney, Australia on AWS ap-southeast-2 via Supabase. Database, authentication store, and file storage all in Sydney. Email delivery (Resend) is transient processing only with no PII stored. AI processing (Anthropic) receives aggregated team patterns only, no individual responses, no names, no contact details." },
    ],
  },
  {
    id: "identity", title: "Identity and access",
    questions: [
      { q: "How do users authenticate?", a: "Leaders, Org Admins, and Culture Crunch staff authenticate via email and password with MFA via TOTP enforced. Frontline team members access through single-use, time-limited SMS token links and do not hold persistent accounts or credentials." },
      { q: "How is access controlled?", a: "Row Level Security policies at the database level mean each user can only access the rows authorised for their role, even if application-level checks were bypassed. Role-based access control adds a second layer at the application middleware. Four roles: Team Member, Leader, Org Admin, Culture Crunch Super Admin. Each role's data scope is documented and tested." },
      { q: "How are admin accounts managed?", a: "Admin roles are distinct from standard user roles. All admin accounts have MFA enforced. Service role keys are restricted to server-side use only, following least privilege. No shared admin credentials. Each admin has their own account. Supabase audit logs capture admin actions. Admin access is reviewed quarterly." },
    ],
  },
  {
    id: "risk", title: "Risk management",
    questions: [
      { q: "What threat model has been assessed?", a: "A risk assessment was completed as part of the review in February 2026. The main threat vectors identified: external attacks against web application endpoints (covered by WAF, input validation, RLS), authentication attacks such as brute force and credential stuffing (covered by MFA, rate limiting, account lockout), third-party vendor breach (covered by SOC 2 Type 2 certified vendors and minimal PII storage outside the primary database), AI model data leakage (covered by sending only aggregated, de-identified patterns to the AI engine)." },
      { q: "What was the assigned risk rating?", a: "MEDIUM. The reviewing provider noted explicitly that the actual risk sits below a typical MEDIUM-rated integration because of three factors: narrow data scope (names, phones, emails only), standalone architecture (no network touchpoints with the client), and SOC 2 Type 2 certified infrastructure throughout." },
      { q: "What threat modelling work is in progress?", a: "A formal STRIDE threat model is scheduled for Q2 2026, alongside the first third-party penetration test. Findings from both will be shared with clients on request." },
    ],
  },
  {
    id: "incident", title: "Incident response",
    questions: [
      { q: "What happens if there is a security incident?", a: "Eight-phase response framework. Detection (immediate). Triage and severity classification (under one hour). Containment (under four hours). Client notification including affected clients (within twenty-four hours of confirmed breach). OAIC notification under the Notifiable Data Breaches scheme (within seventy-two hours). Eradication (as required). Recovery (as required). Post-incident review and root cause analysis (within two weeks)." },
      { q: "How are security events monitored?", a: "Authentication events, API access logs, database audit logs, and application errors are captured by Supabase and Vercel. Anomaly detection runs on Supabase. Security alerts run on Vercel." },
      { q: "What centralised tooling is planned?", a: "SIEM tooling and centralised logging are planned for H2 2026 as we scale beyond pilot." },
    ],
  },
  {
    id: "vulnerability", title: "Vulnerability management",
    questions: [
      { q: "How are vulnerabilities tracked?", a: "Continuous dependency scanning via GitHub Dependabot with automated pull requests. npm audit on every build with deployment blocked on critical issues. Security-focused code review on every pull request. Static analysis via TypeScript and ESLint security rules." },
      { q: "What patching SLAs apply?", a: "Critical and actively exploited: patched and deployed within four hours. High severity: within twenty-four hours. Medium: within seven days. Low: next release cycle. Vercel enables instant deployment and instant rollback, so a critical patch can move from code to production in under five minutes." },
      { q: "When is the first formal penetration test?", a: "Q2 2026, with a named third-party. Coverage includes the OWASP Top 10, API endpoint security, and authentication and authorisation testing. Results will be shared with clients on request." },
    ],
  },
  {
    id: "vendors", title: "Third-party vendors",
    questions: [
      { q: "Who are the third-party vendors?", a: "Vercel (hosting and edge, SOC 2 Type 2). Supabase (database, auth, storage, SOC 2 Type 2). Twilio (SMS delivery, SOC 2 Type 2 + ISO 27001 + PCI DSS). Anthropic (AI processing, SOC 2 Type 2 with zero-retention API policy). Resend (email delivery, SOC 2 Type 2 in progress, transient processing only with no PII stored)." },
      { q: "How is vendor security verified?", a: "SOC 2 Type 2 certification is a hard requirement for any vendor that handles data. Australian data residency required for PII storage. Data Processing Agreements in place where applicable. Breach notification obligations and data handling and deletion terms in every vendor contract." },
      { q: "What about Resend's in-progress SOC 2 status?", a: "Resend handles transient email delivery only. Nothing is stored or persisted. Email bodies contain only notification text and links back to the platform, no survey responses or coaching content. If full SOC 2 Type 2 certification across all vendors is a procurement requirement, we can move to a certified alternative within pilot timelines." },
    ],
  },
  {
    id: "compliance", title: "Compliance",
    questions: [
      { q: "What regulations does Chris comply with?", a: "Privacy Act 1988 (Cth) compliant. All thirteen Australian Privacy Principles addressed. Notifiable Data Breaches scheme breach notification process established. Aligned with Aged Care Quality Standards, specifically Standard 7 (Human Resources) and Standard 8 (Organisational Governance). PCI-DSS, HIPAA, and GDPR are not applicable (no payment card data, no US health data, no EU data subjects anticipated)." },
      { q: "How is data retained and disposed of?", a: "Pulse responses retained for the duration of the contract plus twelve months. User accounts retained for the contract plus thirty days, then deleted and anonymised. Audit and access logs retained for twelve months. Database backups rolling seven days. Secure deletion on contract end with deletion confirmation provided on request." },
      { q: "How are user rights handled?", a: "Privacy policy published at culturecrunch.io. Data collection notice provided at account creation. Access requests honoured. Deletion requests processed within thirty days." },
    ],
  },
  {
    id: "continuity", title: "Business continuity",
    questions: [
      { q: "What are the recovery objectives?", a: "Application compromise: redeploy from Git in under five minutes, zero data loss. Database breach or corruption: restore from backup or point-in-time recovery in under one hour, data loss bounded by twenty-four hours at worst (minutes via PITR). Credential compromise: rotate keys and redeploy in under one hour, zero data loss. Complete infrastructure loss: redeploy to new provider and restore from database backup in under four hours." },
      { q: "How is the recovery plan tested?", a: "Database restore test scheduled for 28 February 2026. Redeployment is tested regularly through normal release cycles. Formal Business Continuity Plan document targeted for completion 31 March 2026." },
      { q: "What backup coverage is in place?", a: "Daily automated database backups with seven-day rolling retention. Continuous WAL-based point-in-time recovery with seven-day window. Application code in Git version control, indefinite retention. Configuration in Vercel environment snapshots, indefinite retention." },
    ],
  },
];

function QABlock({ section, defaultOpen }: { section: QASection; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div id={section.id} className="rounded-[8px] overflow-hidden" style={{ backgroundColor: C.card, border: `0.5px solid ${C.border}` }}>
      <button onClick={() => setOpen(!open)} className="w-full text-left px-6 lg:px-7 py-5 flex items-center justify-between">
        <h2 className="text-[18px] font-medium" style={{ color: C.text }}>{section.title}</h2>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
          <path d="M4 6l4 4 4-4" stroke={C.textFaint} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-400 ${open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-6 lg:px-7 pb-6 space-y-6">
          {section.questions.map((qa) => (
            <div key={qa.q}>
              <p className="text-[15px] font-medium mb-2" style={{ color: C.text }}>{qa.q}</p>
              <p className="text-[14px] leading-[1.6]" style={{ color: C.textMuted }}>{qa.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TrustPage() {
  return (
    <div style={{ fontFamily: inter, backgroundColor: C.canvas }}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" />

      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-sm" style={{ backgroundColor: "rgba(250,250,246,0.92)", borderBottom: `0.5px solid ${C.borderSubtle}` }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 lg:px-16 py-3">
          <Link href="/v2" className="text-[15px] font-medium tracking-tight" style={{ color: C.text }}>Chris<span style={{ color: C.teal }}>·</span>OS</Link>
          <a href="/v2#book" className="text-[14px] font-medium px-[20px] py-[12px] rounded-[4px]" style={{ backgroundColor: C.ctaBg, color: C.ctaText }}>Book a conversation</a>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 lg:px-16 pt-14 lg:pt-20 pb-10">
        <div className="max-w-[600px]">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] mb-4" style={{ color: C.teal }}>Security and privacy</p>
          <h1 className="text-[clamp(1.8rem,4vw,34px)] font-medium leading-[1.08] tracking-[-0.025em] mb-4" style={{ color: C.text }}>How Chris is built and reviewed.</h1>
          <p className="text-[15px] leading-[1.6]" style={{ color: C.textMuted }}>
            This page summarises Chris OS's security posture, the February 2026 cybersecurity review by a Tier 1 Australian aged care provider, and the controls in place across data, infrastructure, identity, and incident response. Maintained by Ivan Sanchez (CTO) and Campbell McGlynn (CEO).
          </p>
        </div>
      </div>

      {/* Trust strip */}
      <div className="max-w-6xl mx-auto px-6 lg:px-16 pb-10">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {TRUST_BADGES.map((badge) => (
            <span key={badge} className="flex items-center gap-1.5 text-[12px]" style={{ color: C.textMuted }}>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: C.teal }} />
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Q&A sections */}
      <div className="max-w-6xl mx-auto px-6 lg:px-16 pb-14 lg:pb-20 space-y-3">
        {SECTIONS.map((section) => (
          <QABlock key={section.id} section={section} defaultOpen={typeof window !== "undefined" && window.innerWidth >= 1024} />
        ))}
      </div>

      {/* Procurement contact */}
      <div className="max-w-6xl mx-auto px-6 lg:px-16 pb-14 lg:pb-20">
        <div className="rounded-[8px] p-6 lg:p-7" style={{ backgroundColor: C.card, border: `0.5px solid ${C.border}` }}>
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] mb-2" style={{ color: C.teal }}>Working with procurement</p>
          <p className="text-[14px] leading-[1.6] mb-4" style={{ color: C.textMuted }}>
            If your procurement function needs the source assessment from the reviewing provider, the controls register, the Data Processing Agreement, or anything else in this domain, email <a href="mailto:hello@culturecrunch.io" className="font-medium hover:underline" style={{ color: C.teal }}>hello@culturecrunch.io</a>. We respond within one business day.
          </p>
          <p className="text-[12px]" style={{ color: C.textFaint }}>Last updated April 2026. Maintained by Ivan Sanchez (CTO) and Campbell McGlynn (CEO).</p>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: C.canvas, borderTop: `0.5px solid ${C.border}` }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-16 py-8 flex items-center justify-between">
          <Link href="/v2" className="text-[13px]" style={{ color: C.textFaint }}>Chris<span style={{ color: C.teal }}>·</span>OS</Link>
          <p className="text-[11px]" style={{ color: C.textFaint }}>© 2026 Culture Crunch Pty Ltd</p>
        </div>
      </footer>
    </div>
  );
}
