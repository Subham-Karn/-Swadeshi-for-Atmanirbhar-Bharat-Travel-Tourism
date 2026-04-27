import React from 'react'
import PopularDestinations from '../components/PopularDestinations'
import { dummyRegions } from '../assets/assets';
import Hero from '../components/Hero';
import Trips from '../components/Trips';
import Testimonials from '../components/Testimonials';
import WhyChooseUs from '../components/WhyChooseUs';

const HomeRoute = () => {
  return (
      <div className="flex flex-col">
        <Hero />
        <PopularDestinations regions={dummyRegions} />
        <WhyChooseUs/>
        <Trips />
        <Testimonials />
      </div>
  )
}

export default HomeRoute