import Topbar from "../../../components/topbar/topbar";
import Footer from "../../../components/footer/Footer";
import FaqSection from "../../../components/faqSection/FaqSection";

function FaqsPage() {
  return (
    <div className="min-h-screen">
      <Topbar />

      <FaqSection sectionClassName="pb-20 mt-14" />

      <Footer />
    </div>
  );
}

export default FaqsPage;
