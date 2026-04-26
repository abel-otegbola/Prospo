import Topbar from "../../../components/topbar/topbar";
import Footer from "../../../components/footer/Footer";

function Security() {
  const features = [
    {
      icon: "🔒",
      title: "End-to-End Encryption",
      description: "All data is encrypted in transit and at rest using industry-standard AES-256 encryption"
    },
    {
      icon: "🛡️",
      title: "SOC 2 Type II Certified",
      description: "Independently audited and certified for security, availability, and confidentiality"
    },
    {
      icon: "🔐",
      title: "SSO & SAML",
      description: "Enterprise-grade single sign-on with support for all major identity providers"
    },
    {
      icon: "👁️",
      title: "Regular Security Audits",
      description: "Quarterly penetration testing and vulnerability assessments by third parties"
    },
    {
      icon: "🔑",
      title: "Role-Based Access Control",
      description: "Granular permissions to control who can access what data in your organization"
    },
    {
      icon: "📊",
      title: "Activity Logging",
      description: "Comprehensive audit trails of all user actions and system events"
    },
    {
      icon: "🚨",
      title: "24/7 Monitoring",
      description: "Real-time threat detection and automated incident response"
    },
    {
      icon: "💾",
      title: "Daily Backups",
      description: "Automated daily backups with point-in-time recovery capabilities"
    },
    {
      icon: "🌐",
      title: "DDoS Protection",
      description: "Enterprise-level protection against distributed denial-of-service attacks"
    }
  ];

  const certifications = [
    { name: "SOC 2 Type II", logo: "🏆" },
    { name: "ISO 27001", logo: "🥇" },
    { name: "GDPR Compliant", logo: "🇪🇺" },
    { name: "CCPA Compliant", logo: "🇺🇸" },
    { name: "HIPAA Compliant", logo: "🏥" },
    { name: "PCI DSS", logo: "💳" }
  ];

  return (
    <div className="min-h-screen bg-background ">
      <Topbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-medium text-sm mb-6">
            Enterprise-Grade Security
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Your Data Security is Our Top Priority
          </h1>
          <p className="text-lg opacity-[0.6] dark:text-gray">
            We employ industry-leading security practices to protect your sensitive business data at every level.
          </p>
        </div>
      </section>

      {/* Security Features Grid */}
      <section className="px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all bg-background "
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm opacity-[0.6] dark:text-gray/">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications Section */}
      <section className="bg-gray-500/[0.05] py-20">
        <div className="px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Certifications & Compliance</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="bg-background dark:bg-gray-700 p-6 rounded-xl text-center hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-3">{cert.logo}</div>
                <div className="font-semibold text-sm">{cert.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure Section */}
      <section className="px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Secure Infrastructure</h2>
            <div className="space-y-4 opacity-[0.6] dark:text-gray/">
              <p>
                Prospo is hosted on AWS and Google Cloud Platform, leveraging their enterprise-grade infrastructure and security controls.
              </p>
              <p>
                Our data centers are ISO 27001 certified and feature multiple layers of physical and digital security, including biometric access controls and 24/7 surveillance.
              </p>
              <p>
                We maintain geographically distributed redundancy to ensure high availability and disaster recovery capabilities.
              </p>
            </div>
            <div className="mt-6 flex gap-4">
              <div className="px-4 py-2 bg-gray-500/[0.09] rounded-lg font-medium">
                99.9% Uptime SLA
              </div>
              <div className="px-4 py-2 bg-gray-500/[0.09] rounded-lg font-medium">
                1s Response Time
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🏰</div>
            <div className="text-2xl font-bold">Military-Grade Protection</div>
          </div>
        </div>
      </section>

      {/* Security Practices Section */}
      <section className="bg-gray-500/[0.05] py-20">
        <div className="px-4 sm:px-6 lg:px-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Security Practices</h2>
          <div className="space-y-6">
            {[
              {
                title: "Data Encryption",
                desc: "All data is encrypted using AES-256 in transit (TLS 1.3) and at rest. Encryption keys are rotated regularly and stored in secure key management systems."
              },
              {
                title: "Access Controls",
                desc: "Multi-factor authentication is required for all accounts. We implement least-privilege access principles and regular access reviews."
              },
              {
                title: "Vulnerability Management",
                desc: "Automated vulnerability scanning, quarterly penetration testing, and a responsible disclosure program for security researchers."
              },
              {
                title: "Incident Response",
                desc: "24/7 security operations center with documented incident response procedures and regular disaster recovery drills."
              },
              {
                title: "Employee Security",
                desc: "Background checks for all employees, mandatory security training, and strict policies for handling sensitive data."
              }
            ].map((practice, index) => (
              <div key={index} className="bg-background dark:bg-gray-700 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-2">{practice.title}</h3>
                <p className="opacity-[0.6] dark:text-gray/">{practice.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bug Bounty Section */}
      <section className="px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto py-20">
        <div className="bg-gradient-to-r from-primary to-fuchsia-500 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Security Researcher? We Want to Hear From You</h2>
          <p className="text-lg mb-8 opacity-90">
            We offer a bug bounty program for responsible disclosure of security vulnerabilities
          </p>
          <button className="bg-background text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all">
            Report a Vulnerability
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Security;
