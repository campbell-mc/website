import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — CHRIS-OS",
  description: "Privacy Policy for Culture Crunch Pty Ltd and the CHRIS-OS platform.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#F5F2EB] min-h-screen" style={{ fontFamily: "var(--font-dm-sans, 'DM Sans'), system-ui, sans-serif" }}>
      {/* Nav */}
      <nav className="border-b border-[#1B4332]/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-6 lg:px-16 py-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#1B4332] rounded-lg flex items-center justify-center text-white text-sm font-medium tracking-tight">C</div>
            <span className="text-[#1B4332] text-[15px] font-medium tracking-tight">CHRIS-OS</span>
          </Link>
          <Link href="/" className="text-[13px] text-stone-400 hover:text-[#1B4332] transition-colors">
            Back to CHRIS-OS
          </Link>
        </div>
      </nav>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-6 lg:px-16 py-12 lg:py-16">
        <div className="mb-10">
          <p className="text-[11px] font-medium tracking-[0.08em] uppercase text-stone-400 mb-3">Legal</p>
          <h1 className="text-[clamp(28px,4vw,42px)] font-normal leading-[1.1] tracking-[-0.02em] text-[#1B4332] mb-3" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif" }}>
            Privacy Policy
          </h1>
          <p className="text-[14px] text-stone-400">Last Updated: December 8, 2025</p>
        </div>

        <div className="prose-chris space-y-8">
          <Section>
            <p>Culture Crunch Pty Ltd (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to protecting the privacy of individuals who use our leadership development platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.</p>
            <div className="bg-white border border-[#1B4332]/8 rounded-xl p-5 mt-4">
              <p className="text-[13px] font-medium text-[#1B4332] mb-1">Culture Crunch Pty Ltd</p>
              <p className="text-[12px] text-stone-500">ACN: 693 217 971 | ABN: 67 693 217 971</p>
              <p className="text-[12px] text-stone-500">Registered Address: 91C Shepherd Street, Bowral, NSW 2576, Australia</p>
            </div>
            <p>We comply with the Australian Privacy Principles (APPs) contained in the Privacy Act 1988 (Cth) and any applicable state privacy legislation.</p>
          </Section>

          <Section title="Our Privacy Philosophy: Privacy by Minimalism">
            <p>We believe in collecting only what we need to deliver value. Our approach is &ldquo;privacy by minimalism&rdquo; &mdash; we deliberately design our platform to work with team-level insights rather than individual performance tracking.</p>
          </Section>

          <Section title="What We DON'T Collect">
            <ul>
              <li>Individual performance scores or rankings</li>
              <li>Keystroke logging or screen monitoring</li>
              <li>Location tracking or GPS data</li>
              <li>Personal health information</li>
              <li>Biometric data</li>
              <li>Individual response attribution to managers</li>
            </ul>
          </Section>

          <Section title="Aged Care Industry Considerations">
            <p>Culture Crunch is designed specifically for the aged care sector in Australia. We understand the unique privacy requirements of this industry.</p>
            <h4>Aged Care Specific Protections</h4>
            <ul>
              <li><strong>No Resident Data:</strong> Culture Crunch focuses exclusively on workforce development. We do not collect, store, or process any information about aged care residents or their families.</li>
              <li><strong>Aged Care Quality Standards Alignment:</strong> Our platform supports compliance with Aged Care Quality Standard 7 (Human Resources) without compromising staff privacy.</li>
              <li><strong>Workforce Wellbeing Focus:</strong> Data collected is used solely to improve leadership capability and team culture &mdash; not for performance management or surveillance.</li>
              <li><strong>Separation from Care Records:</strong> Our systems are completely separate from clinical and care management systems. There is no integration with resident information systems.</li>
            </ul>
          </Section>

          <Section title="Information We Collect">
            <h4>Account Information</h4>
            <ul>
              <li>Name and email address</li>
              <li>Organisation name and role</li>
              <li>Contact preferences</li>
              <li>Payment information (processed securely by third-party providers)</li>
            </ul>
            <h4>Platform Usage Data</h4>
            <ul>
              <li>Team-level pulse survey responses (aggregated, not individual)</li>
              <li>Leader self-reflection inputs</li>
              <li>Program progress and completion data</li>
              <li>AI Support interaction logs (for service improvement)</li>
            </ul>
            <h4>Technical Information</h4>
            <ul>
              <li>Device type and browser information</li>
              <li>IP address (anonymised after 30 days)</li>
              <li>Cookies and similar technologies</li>
            </ul>
          </Section>

          <Section title="How We Use Your Information">
            <ul>
              <li><strong>Service Delivery:</strong> To provide team-level insights and personalised leadership recommendations</li>
              <li><strong>AI Support Companion:</strong> To generate evidence-based micro-actions for leaders</li>
              <li><strong>Platform Improvement:</strong> To enhance our algorithms and user experience</li>
              <li><strong>Communication:</strong> To send program updates, insights, and relevant information</li>
              <li><strong>Research:</strong> To contribute to peer-reviewed organisational science (de-identified only)</li>
            </ul>
          </Section>

          <Section title="AI-Powered Insights">
            <p>Our AI Support Companion (CHRIS) analyses team-level data to provide leadership recommendations. These insights are:</p>
            <ul>
              <li>Advisory only (not automated decisions affecting employment)</li>
              <li>Based on aggregated team signals, not individual metrics</li>
              <li>Designed to support leadership development, not replace human judgment</li>
              <li>Always subject to leadership context and discretion</li>
            </ul>
            <p>You have the right to understand how AI recommendations are generated and to request human review of any AI-generated insight.</p>
          </Section>

          <Section title="Workplace Privacy Notice">
            <p>Culture Crunch is designed for workplace use. If you are an employee whose organisation uses Culture Crunch:</p>
            <ul>
              <li><strong>Team-Level Only:</strong> Your team leader may access team-level insights that include aggregated signals from participation</li>
              <li><strong>Individual Privacy:</strong> We do NOT share individual responses, scores, or behavioural data with your employer</li>
              <li><strong>Not Surveillance:</strong> Culture Crunch is not a surveillance system and does not constitute workplace surveillance under NSW law</li>
              <li><strong>Complaints:</strong> You may raise concerns with us at privacy@culturecrunch.io or your organisation&apos;s privacy officer</li>
            </ul>
            <h4>Privacy Protection for Small Teams</h4>
            <p>For teams with fewer than 5 members, aggregated data may be reasonably identifiable to individuals. In these cases we apply additional privacy safeguards:</p>
            <ul>
              <li>Leaders receive summary insights only (no granular breakdowns)</li>
              <li>Sensitive signals are suppressed if identifiability risk is high</li>
              <li>We will notify you if your team size creates privacy considerations</li>
            </ul>
          </Section>

          <Section title="Who We Share Data With">
            <p>We only share data with trusted service providers who process data on our behalf:</p>
            <ul>
              <li><strong>Cloud Hosting:</strong> Secure Australian-based infrastructure</li>
              <li><strong>Payment Processing:</strong> PCI-compliant payment providers</li>
              <li><strong>Email Delivery:</strong> Transactional email services</li>
              <li><strong>Analytics:</strong> Privacy-focused analytics tools</li>
            </ul>
            <p>All processors are contractually bound to protect your data and comply with Australian privacy standards.</p>
          </Section>

          <Section title="Data Security">
            <p>We implement industry-standard security measures including:</p>
            <ul>
              <li>Encryption in transit and at rest</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
              <li>Employee security training</li>
            </ul>
            <p>While we take security seriously, no system is 100% secure. We encourage you to use strong passwords and protect your login credentials.</p>
          </Section>

          <Section title="Data Breach Notification">
            <p>If we experience a data breach likely to result in serious harm, we will:</p>
            <ul>
              <li>Notify affected individuals as soon as practicable</li>
              <li>Notify the Office of the Australian Information Commissioner (OAIC)</li>
              <li>Provide details of the breach, likely consequences, and steps being taken</li>
            </ul>
            <p>We maintain an incident response plan in accordance with the Privacy Act 1988.</p>
          </Section>

          <Section title="Data Retention">
            <p>We retain your data for as long as your account is active, plus 90 days for transition support. Upon account deletion:</p>
            <div className="bg-white border border-[#1B4332]/8 rounded-xl overflow-hidden mt-3">
              {[
                { period: "Active Data", detail: "Removed within 90 days to allow transition/export" },
                { period: "Backup Systems", detail: "Removed within 180 days (due to backup rotation)" },
                { period: "Legal Holds", detail: "Retained longer only if required by law or legitimate dispute" },
                { period: "Aggregated Analytics", detail: "De-identified data may be retained indefinitely for research (cannot be re-linked to you)" },
              ].map((row, i, arr) => (
                <div key={row.period} className={`flex items-start gap-4 px-5 py-3 ${i < arr.length - 1 ? "border-b border-[#1B4332]/5" : ""}`}>
                  <span className="text-[12px] font-medium text-[#1B4332] w-36 shrink-0">{row.period}</span>
                  <span className="text-[12px] text-stone-500">{row.detail}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Your Rights">
            <p>Under Australian Privacy Principles, you have the right to:</p>
            <ul>
              <li>Access personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your data (subject to legal requirements)</li>
              <li>Opt-out of marketing communications</li>
              <li>Complain to the OAIC if you believe we&apos;ve breached the APPs</li>
            </ul>
            <p>We will respond to access and correction requests within 30 days.</p>
          </Section>

          <Section title="International Data Transfers">
            <p>Some of our service providers may be located overseas. When we transfer data internationally, we ensure appropriate safeguards are in place to protect your information in accordance with APP 8.</p>
          </Section>

          <Section title="Cookies and Similar Technologies">
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>Keep you logged in</li>
              <li>Remember your preferences</li>
              <li>Understand how you use our platform</li>
              <li>Improve our services</li>
            </ul>
            <p>You can control cookies through your browser settings. Some features may not work properly if cookies are disabled.</p>
          </Section>

          <Section title="Contact Us">
            <p>For privacy-related questions or to exercise your rights:</p>
            <div className="bg-white border border-[#1B4332]/8 rounded-xl p-5 mt-3">
              <p className="text-[13px] text-stone-500 mb-1">Email: <a href="mailto:privacy@culturecrunch.io" className="text-[#2D7D73] hover:underline">privacy@culturecrunch.io</a></p>
              <p className="text-[13px] text-stone-500 mb-3">Response Time: Within 5 business days</p>
              <p className="text-[12px] text-stone-400">OAIC: If you&apos;re not satisfied with our response, you may contact the Office of the Australian Information Commissioner at <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer" className="text-[#2D7D73] hover:underline">www.oaic.gov.au</a></p>
            </div>
          </Section>

          <Section title="Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. Material changes will be communicated via email or platform notification. Continued use of our services after changes indicates acceptance.</p>
          </Section>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-[#1B4332]/10 bg-stone-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-16 py-6 flex items-center justify-between flex-wrap gap-3">
          <span className="text-[12px] text-stone-400">Culture Crunch Pty Ltd · ACN 693 217 971</span>
          <Link href="/" className="text-[12px] text-stone-400 hover:text-[#1B4332] transition-colors">Back to CHRIS-OS</Link>
        </div>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section>
      {title && (
        <h3 className="text-[18px] font-normal text-[#1B4332] mb-3 tracking-[-0.01em]" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif" }}>
          {title}
        </h3>
      )}
      <div className="text-[14px] text-stone-600 leading-[1.75] [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:my-3 [&_li]:text-[13px] [&_li]:text-stone-500 [&_li]:leading-relaxed [&_h4]:text-[14px] [&_h4]:font-medium [&_h4]:text-[#1B4332] [&_h4]:mt-4 [&_h4]:mb-2 [&_strong]:text-stone-700 [&_p]:mb-2">
        {children}
      </div>
    </section>
  );
}
