import React from 'react'
import Sidebar from '../components/Sidebar/Sidebar'
import Dashboard from '../components/Dashboard/Dashboard'
const Home = () => {
  return (
    <div>
        <div className="w-full h-full flex flex-col lg:flex-row rounded-xl shadow-2xl overflow-hidden bg-white mb-8 flex-grow">
            <Sidebar/>
            <Dashboard/>
        </div>
    </div>
  )
}

export default Home