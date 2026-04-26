import Topbar from "../../../components/topbar/topbar";
import Footer from "../../../components/footer/Footer";

function Privacy() {
  return (
    <div className="min-h-screen bg-background ">
      <Topbar />
      
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-16 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">Privacy Policy</h1>
        <p className="opacity-[0.6] dark:text-gray/ mb-12">
          Last updated: November 20, 2025
        </p>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="opacity-[0.6] dark:text-gray-300 leading-relaxed">
              Prospo (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold mb-3">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 space-y-2 opacity-[0.6] dark:text-gray-300">
              <li>Account information (name, email, company details)</li>
              <li>Payment information (processed securely through third-party providers)</li>
              <li>Profile data and preferences</li>
              <li>Communications with our support team</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Information We Collect Automatically</h3>
            <ul className="list-disc pl-6 space-y-2 opacity-[0.6] dark:text-gray-300">
              <li>Usage data and analytics</li>
              <li>Device information and IP addresses</li>
              <li>Cookies and similar tracking technologies</li>
              <li>Log data and performance metrics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
            <p className="opacity-[0.6] dark:text-gray-300 mb-3">We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2 opacity-[0.6] dark:text-gray-300">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send administrative messages and updates</li>
              <li>Respond to your requests and provide customer support</li>
              <li>Monitor and analyze usage patterns and trends</li>
              <li>Detect, prevent, and address security issues</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Data Sharing and Disclosure</h2>
            <p className="opacity-[0.6] dark:text-gray-300 leading-relaxed mb-3">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 space-y-2 opacity-[0.6] dark:text-gray-300">
              <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf</li>
              <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>With Your Consent:</strong> When you explicitly agree to share information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
            <p className="opacity-[0.6] dark:text-gray-300 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security audits.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
            <p className="opacity-[0.6] dark:text-gray-300 mb-3">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 opacity-[0.6] dark:text-gray-300">
              <li>Access and receive a copy of your personal data</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict processing</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Cookies and Tracking</h2>
            <p className="opacity-[0.6] dark:text-gray-300 leading-relaxed">
              We use cookies and similar technologies to improve your experience, analyze usage, and deliver personalized content. You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Data Retention</h2>
            <p className="opacity-[0.6] dark:text-gray-300 leading-relaxed">
              We retain your information for as long as necessary to provide our services and comply with legal obligations. When data is no longer needed, we securely delete or anonymize it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. International Data Transfers</h2>
            <p className="opacity-[0.6] dark:text-gray-300 leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Children&apos;s Privacy</h2>
            <p className="opacity-[0.6] dark:text-gray-300 leading-relaxed">
              Our services are not intended for children under 16. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Changes to This Policy</h2>
            <p className="opacity-[0.6] dark:text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">12. Contact Us</h2>
            <p className="opacity-[0.6] dark:text-gray-300 leading-relaxed">
              If you have questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="mt-4 p-6 bg-gray-50  rounded-lg">
              <p className="opacity-[0.6] dark:text-gray-300">
                <strong>Email:</strong> privacy@Prospo.com<br />
                <strong>Address:</strong> 123 Business Street, San Francisco, CA 94102, USA
              </p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Privacy;
