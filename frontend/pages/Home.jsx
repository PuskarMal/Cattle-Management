import React from 'react'
import Sidebar from '../components/Sidebar/Sidebar'
import Dashboard from '../components/Dashboard/Dashboard'
import HelpPage from '../components/Dashboard/Help'
import FAQ from '../components/Dashboard/FAQ'
import InfoSections from '../components/Dashboard/InfoSections'
const Home = () => {
  return (
    <div className='bg-linear-to-b from-[#0B1220] via-[#0E1628] to-[#0B1220] text-white'>
      <div className="w-full h-full flex flex-col lg:flex-row mb-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-lg">
        <Sidebar />
        <Dashboard />
      </div>
      <div className='max-w-5xl mx-auto p-6 md:p-10 space-y-10 shadow-amber-400'>
        <InfoSections />
        <div>
          <section className=''>
            <h1 className="text-3xl font-bold  mb-2">
              Help & Support
            </h1>
            <p className="text-gray-200 pb-5">
              Guidance, safety information, and ways to get assistance.
            </p>
          </section>
          <HelpPage />
        </div>
        <FAQ />
      </div>
    </div>
  )
}

export default Home