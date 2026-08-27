import { Footer } from "@/components/layout/footer";
import { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = {
  title: "Privacy Policy | Nuravya AI",
  description: "Privacy Policy for Nuravya AI. Learn how we collect, use, and protect your data.",
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
      <PageHero eyebrow="Legal" title={<>Privacy, in <span className="text-[#F2811D]">plain language.</span></>} description="What Nuravya collects, why it is needed, the services involved, and the controls available to you." />
      <div className="flex-grow py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl glass-panel hairline-glow rounded-[2rem] p-8 md:p-12">
          <p className="text-stone-500 mb-12">Last updated: August 27, 2026</p>

          <div className="prose prose-stone max-w-none text-stone-700 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">1. Introduction</h2>
              <p>
                Welcome to Nuravya AI ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us.
              </p>
              <p className="mt-4">
                This Privacy Policy applies to all information collected through our website, mobile application, and any related services, sales, marketing or events (we refer to them collectively in this Privacy Policy as the "Services").
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">2. Information We Collect</h2>
              <h3 className="text-lg font-medium text-stone-800 mb-2">Personal Information You Disclose to Us</h3>
              <p className="mb-4">
                We collect personal information that you voluntarily provide to us when you register for the Services, express an interest in obtaining information about us or our products, participate in activities on the Services, or otherwise contact us.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Account Data:</strong> We receive account identifiers, display name, email address, and profile image from the authentication provider you choose.</li>
                <li><strong>Voice and Interaction Data:</strong> When you use voice features, audio is sent to speech-processing providers to transcribe or synthesize the requested conversation. We store conversation text and usage records; the application does not currently claim to derive biometric identity or medical indicators.</li>
                <li><strong>Memory and Context:</strong> To provide continuity, we may store preferences, relationships, routines, goals, and other facts you choose to share during conversations.</li>
                <li><strong>Integration Data (Future Services):</strong> If you connect third-party accounts (e.g., calendars, health apps), we collect relevant data from those services to enhance the companion's awareness.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">3. How We Use Your Information</h2>
              <p className="mb-4">
                We use personal information collected via our Services for a variety of business purposes described below:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>To provide and manage the Services:</strong> We use your information to facilitate account creation, authentication, and to deliver the real-time AI companion experience you request.</li>
                <li><strong>To personalize the experience:</strong> We use memory graphs and interaction logs to tailor the AI's personality, responses, and proactive reminders to your specific needs.</li>
                <li><strong>To operate and improve the product:</strong> We use service and usage information to debug failures, protect the platform, and improve product behavior. We do not claim a blanket right to train public models on private conversations.</li>
                <li><strong>To process payments:</strong> Subscription checkout and billing are handled through Razorpay; Nuravya does not store full payment-card details.</li>
                <li><strong>To communicate with you:</strong> To send administrative information to you, such as updates to our terms, conditions, and policies.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">4. Data Sharing and Disclosure</h2>
              <p>
                We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may share your data with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf and require access to such information to do that work (e.g., email delivery via Nodemailer/SMTP, hosting services on Vercel).
              </p>
              <p className="mt-4 font-semibold">
                We do NOT sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">5. Data Security</h2>
              <p>
                We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">6. Your Privacy Rights</h2>
              <p className="mb-4">
                Depending on your location, you may have certain rights regarding your personal information, including the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Request access and obtain a copy of your personal information.</li>
                <li>Request rectification or erasure of your data, including wiping specific AI "memories" or conversation logs.</li>
                <li>Restrict the processing of your personal information.</li>
                <li>If applicable, to data portability.</li>
              </ul>
              <p className="mt-4">
                To exercise any of these rights, please use the settings available within your Nuravya AI account dashboard, or contact us. You can easily opt-out of promotional communications or request account deletion at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">7. Children's Privacy</h2>
              <p>
                We do not knowingly solicit data from or market to children under 13 years of age. By using the Services, you represent that you are at least 13 or that you are the parent or guardian of such a minor and consent to such minor dependent's use of the Services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">8. Updates to this Policy</h2>
              <p>
                We may update this privacy notice from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">9. Contact Us</h2>
              <p>
                If you have questions or comments about this notice, you may email us at:
              </p>
              <p className="mt-2 font-semibold">
                privacy@nuravya.com
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
