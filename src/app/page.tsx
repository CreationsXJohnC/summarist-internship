import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import StatisticsSection from '@/components/home/StatisticsSection';
import ReviewsSection from '@/components/home/ReviewsSection';
import NumbersSection from '@/components/home/NumbersSection';
import Footer from '@/components/home/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <StatisticsSection />
      <ReviewsSection />
      <NumbersSection />
      <Footer />
    </div>
  );
}
