import HeroBanner from '@/app/components/home/HeroBanner';
import FeaturedProducts from '@/app/components/home/FeatureProducts';
import TrustSection from '@/app/components/home/TrustSection';
import DealsSection from '@/app/components/home/DealsSection';
import {authOptions} from '@/app/config/auth_options.config';
import {getServerSession} from 'next-auth';
import {redirect} from "next/navigation";

export default async function Home() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect('/auth/login');
    }
    return (
        <div className="space-y-20">
            <HeroBanner/>
            <FeaturedProducts/>
            <DealsSection/>
            <TrustSection/>
        </div>
    );
}
