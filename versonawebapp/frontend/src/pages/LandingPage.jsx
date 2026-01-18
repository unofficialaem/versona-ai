import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Technology from '../components/Technology/Technology'
import FAQ from '../components/FAQ/faq'
import Footer from '../components/Footer'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-jet-black">
      <Navbar />
      <Hero />
      <Features />
      <Technology />
      <FAQ />
      <Footer />
    </div>
  )
}

export default LandingPage
