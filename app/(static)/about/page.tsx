import Topbar from "../../../components/topbar/topbar";
import Footer from "../../../components/footer/Footer";
import Button from "../../../components/button/Button";

function About() {

  const values = [
    {
      icon: "🎯",
      title: "Customer First",
      description: "We build products that solve real problems for real people"
    },
    {
      icon: "🚀",
      title: "Innovation",
      description: "We constantly push boundaries to deliver cutting-edge solutions"
    },
    {
      icon: "🤝",
      title: "Transparency",
      description: "We believe in honest communication and clear pricing"
    },
    {
      icon: "💪",
      title: "Excellence",
      description: "We strive for quality in everything we do"
    }
  ];

  return (
    <div className="min-h-screen">
      <Topbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            We&apos;re on a Mission to Transform Sales
          </h1>
          <p className="text-lg">
            Prospo was born from the frustration of spending countless hours on manual lead generation. We believe sales teams should focus on selling, not searching.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: "50K+", label: "Active Users" },
            { number: "120+", label: "Countries" },
            { number: "5M+", label: "Leads Generated" },
            { number: "98%", label: "Customer Satisfaction" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="opacity-[0.6] dark:text-gray/">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="opacity-[0.6] dark:text-gray/ text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto py-20">
        <div className="flex flex-col items-center bg-gradient-to-r from-primary to-fuchsia-500 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Join Us on This Journey</h2>
          <p className="text-lg mb-8 opacity-90">
            Be part of the future of sales. Start your free trial today.
          </p>
          <Button variant="secondary" className="bg-background text-primary hover:bg-gray-100">
            Get Started Free
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default About;
