import React, { useEffect } from "react";
import PopularDestinations from "../components/PopularDestinations";
import { dummyRegions } from "../assets/assets";
import Hero from "../components/Hero";
import Trips from "../components/Trips";
import Testimonials from "../components/Testimonials";
import WhyChooseUs from "../components/WhyChooseUs";
import { useDestinationsStore } from "../store/useDestinationsStore";

const HomeRoute = () => {
  const { destinations, fetchDestinations, isLoading } = useDestinationsStore();
  useEffect(() => {
    fetchDestinations();
    document.title = "Bharat Darshan - Discover Your Destination";
  }, [fetchDestinations]);
  return (
    <div className="flex flex-col">
      <Hero />
      <PopularDestinations regions={destinations} isLoading={isLoading} />
      <WhyChooseUs />
      <Trips />
      <Testimonials />
    </div>
  );
};

export default HomeRoute;
