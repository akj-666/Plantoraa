import Navbar from './Navbar';
import HomePage from './HomePage';
import FeaturesPage from './FeaturesPage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import Footer from './Footer';

type Page = 'home' | 'features' | 'about' | 'contact' | 'login';

interface Props {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function MarketingLayout({ currentPage, onNavigate }: Props) {
  const renderPage = () => {
    switch (currentPage) {
      case 'features': return <FeaturesPage onNavigate={onNavigate} />;
      case 'about': return <AboutPage onNavigate={onNavigate} />;
      case 'contact': return <ContactPage />;
      default: return <HomePage onNavigate={onNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f2a1e] text-white">
      <Navbar currentPage={currentPage} onNavigate={onNavigate} />
      {renderPage()}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
