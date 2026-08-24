import CTA from "../components/CTA";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import LatestListings from "../components/LatestListings";

const Home = () => {
    return (
        <div>
            <Hero />
            <LatestListings />
            <CTA />
            <Footer />
        </div>
    );
};

export default Home;
