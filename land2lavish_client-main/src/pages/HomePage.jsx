import React from "react";
import ProjectsSection from "../components/Home/ProjectSection";
import StatsSection from "../components/Home/StatsSection";
import TopSection from "../components/Home/TopSection";
import RealEstateComponent from "../components/Home/RealEstateComponent";
import MovingTextVideo from "../components/Home/Video";
import PropertyGrid from "../components/Home/PropertyGrid";
import PartnersCarousel from "../components/Home/Partners";
import FAQSection from "../components/Home/Faq";
import CircleVedio from "../components/Home/PartnershipComp";
import ScalingImageComponent from "../components/Home/ImagePop";
import SocailMedia from "../components/Home/Footer/SocialMedia";
import CardsList from "../components/Home/TopComp/CardsList";


const HomePage = () => {
  return (
    <div>
    
      <TopSection />
      <MovingTextVideo />
      <div class="mb-5"/>
      <ProjectsSection />
      <StatsSection />
      <RealEstateComponent />
      {/* <CircleVedio /> */}
      {/* <Footer /> */}
      
      <PropertyGrid />
      <CardsList />
      <PartnersCarousel />
      <FAQSection />
      <ScalingImageComponent />
      <SocailMedia />

      {/* Add any other sections/footer here */}
    </div>
  );
};

export default HomePage;
