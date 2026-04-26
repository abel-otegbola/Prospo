import Topbar from "../../../components/topbar/topbar";
import Footer from "../../../components/footer/Footer";

function Terms() {
  return (
    <div className="min-h-screen bg-background ">
      <Topbar />
      
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-16 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">Terms of Service</h1>
        <p className="opacity-[0.6] dark:text-gray/ mb-12">
          Last updated: November 20, 2025
        </p>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
            <p className="opacity-[0.6] dark:text-gray-300 leading-relaxed">
              By accessing or using Prospo (&quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you disagree with any part of these terms, you may not access the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
            <p className="opacity-[0.6] dark:text-gray-300 leading-relaxed mb-3">
              Prospo grants you a personal, non-transferable, non-exclusive license to use the Service. You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2 opacity-[0.6] dark:text-gray-300">
              <li>Modify or copy the materials</li>
              <li>Use the materials for commercial purposes without authorization</li>
              <li>Attempt to reverse engineer any software</li>
              <li>Remove copyright or proprietary notations</li>
              <li>Transfer materials to another person or mirror on another server</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
            <p className="opacity-[0.6] dark:text-gray-300 leading-relaxed">
              When you create an account, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Acceptable Use</h2>
            <p className="opacity-[0.6] dark:text-gray-300 mb-3">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 opacity-[0.6] dark:text-gray-300">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit malware or malicious code</li>
              <li>Engage in spamming or unsolicited communications</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Impersonate any person or entity</li>
              <li>Interfere with the Service&apos;s operation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Subscription and Payments</h2>
            <h3 className="text-xl font-semibold mb-3">5.1 Billing</h3>
            <p className="opacity-[0.6] dark:text-gray-300 leading-relaxed mb-4">
              Paid subscriptions are billed in advance on a recurring basis (monthly or annually). You authorize us to charge the payment method on file.
            </p>
            <h3 className="text-xl font-semibold mb-3">5.2 Refunds</h3>
            <p className="opacity-[0.6] dark:text-gray-300 leading-relaxed mb-4">
              We offer a 14-day money-back guarantee for new subscriptions. After this period, payments are non-refundable except as required by law.
            </p>
            <h3 className="text-xl font-semibold mb-3">5.3 Cancellation</h3>
            <p className="opacity-[0.6] dark:text-gray-300 leading-relaxed">
              You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Intellectual Property</h2>
            <p className="opacity-[0.6] dark:text-gray-300 leading-relaxed">
              The Service and its original content, features, and functionality are owned by Prospo and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. User Content</h2>
            <p className="opacity-[0.6] dark:text-gray-300 leading-relaxed mb-3">
              You retain ownership of content you submit to the Service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display that content in connection with the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Termination</h2>
            <p className="opacity-[0.6] dark:text-gray-300 leading-relaxed">
              We may terminate or suspend your account immediately, without prior notice, for any breach of these Terms. Upon termination, your right to use the Service will cease immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Disclaimer of Warranties</h2>
            <p className="opacity-[0.6] dark:text-gray-300 leading-relaxed">
              The Service is provided &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, secure, or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Limitation of Liability</h2>
            <p className="opacity-[0.6] dark:text-gray-300 leading-relaxed">
              Prospo shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Indemnification</h2>
            <p className="opacity-[0.6] dark:text-gray-300 leading-relaxed">
              You agree to indemnify and hold Prospo harmless from any claims, damages, or expenses arising from your use of the Service or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">12. Governing Law</h2>
            <p className="opacity-[0.6] dark:text-gray-300 leading-relaxed">
              These Terms shall be governed by the laws of California, United States, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">13. Changes to Terms</h2>
            <p className="opacity-[0.6] dark:text-gray-300 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of material changes. Continued use of the Service constitutes acceptance of modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">14. Contact Information</h2>
            <div className="mt-4 p-6 bg-gray-50  rounded-lg">
              <p className="opacity-[0.6] dark:text-gray-300">
                <strong>Email:</strong> legal@Prospo.com<br />
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

export default Terms;
