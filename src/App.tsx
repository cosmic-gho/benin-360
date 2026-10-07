import { useRouter } from '@/lib/router';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { EventsPage } from '@/pages/EventsPage';
import { EventDetailPage } from '@/pages/EventDetailPage';
import { AttractionsPage } from '@/pages/AttractionsPage';
import { AttractionDetailPage } from '@/pages/AttractionDetailPage';
import { BusinessDirectoryPage } from '@/pages/BusinessDirectoryPage';
import { FoodGuidePage } from '@/pages/FoodGuidePage';
import { GuidesPage } from '@/pages/GuidesPage';
import { GuideDetailPage } from '@/pages/GuideDetailPage';
import { MapPage } from '@/pages/MapPage';
import { TransportPage } from '@/pages/TransportPage';
import { MarketplacePage } from '@/pages/MarketplacePage';
import { PassportPage } from '@/pages/PassportPage';
import { AIAssistantPage } from '@/pages/AIAssistantPage';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage';
import { QRLaunchPage } from '@/pages/QRLaunchPage';
import { DashboardHub } from '@/pages/DashboardHub';
import { ArtisanDashboardPage } from '@/pages/ArtisanDashboardPage';
import { BusinessDashboardPage } from '@/pages/BusinessDashboardPage';
import { GuideDashboardPage } from '@/pages/GuideDashboardPage';
import { VisitorDashboardPage } from '@/pages/VisitorDashboardPage';

export default function App() {
  const { route } = useRouter();

  const renderContent = () => {
    switch (route.name) {
      case 'home':
        return <HomePage />;
      case 'events':
        return <EventsPage />;
      case 'event':
        return <EventDetailPage slug={route.slug} />;
      case 'attractions':
        return <AttractionsPage />;
      case 'attraction':
        return <AttractionDetailPage slug={route.slug} />;
      case 'hotels':
        return <BusinessDirectoryPage businessType="hotel" />;
      case 'restaurants':
        return <BusinessDirectoryPage businessType="restaurant" />;
      case 'food':
        return <FoodGuidePage />;
      case 'guides':
        return <GuidesPage />;
      case 'guide':
        return <GuideDetailPage slug={route.slug} />;
      case 'experiences':
        return <GuidesPage />;
      case 'map':
        return <MapPage />;
      case 'transport':
        return <TransportPage />;
      case 'marketplace':
        return <MarketplacePage />;
      case 'passport':
        return <PassportPage />;
      case 'assistant':
        return <AIAssistantPage />;
      case 'admin':
        return <AdminDashboardPage />;
      case 'dashboard':
        return <DashboardHub initialRole={route.role as any} />;
      case 'artisan-dashboard':
        return <ArtisanDashboardPage />;
      case 'business-dashboard':
        return <BusinessDashboardPage />;
      case 'guide-dashboard':
        return <GuideDashboardPage />;
      case 'visitor-dashboard':
        return <VisitorDashboardPage />;
      case 'qr':
        return <QRLaunchPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900 selection:bg-primary-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}
