import HeroBanner from '@/app/components/home/HeroBanner';
import FeaturedProducts from '@/app/components/home/FeatureProducts';
import TrustSection from '@/app/components/home/TrustSection';
import DealsSection from '@/app/components/home/DealsSection';

export default function Home() {
    return (
        <div className="space-y-20">
            <HeroBanner/>
            <FeaturedProducts/>
            <DealsSection/>
            <TrustSection/>
        </div>
    );
}
