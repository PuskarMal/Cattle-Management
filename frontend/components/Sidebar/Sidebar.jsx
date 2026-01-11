import React from 'react'

const Sidebar = () => {
  return (
    <aside id="sidebar" className="w-full lg:w-1/4 p-6 bg-sidebar-bg border-r border-gray-200 space-y-8">

            
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800" data-i18n="reminders">
                        Quick Reminders
                    </h2>
                    <button className="text-xl opacity-70 hover:opacity-100" 
                        title="Listen">🔊</button>
                </div>

                <div className="space-y-4 border-b border-gray-200 pb-4">

                    
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500" data-i18n="register1">
                                Total Animals Registered
                            </p>
                            <p className="text-3xl font-bold text-gray-900">1</p>
                        </div>
                        <button className="text-xl opacity-70 hover:opacity-100" 
                            title="Listen">🔊</button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500" data-i18n="register3">
                                Elite Dams Registered
                            </p>
                            <p className="text-3xl font-bold text-gray-900">1</p>
                        </div>
                        <button className="text-xl opacity-70 hover:opacity-100" 
                            title="Listen">🔊</button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500" data-i18n="vaccination">
                                Vaccinations Due
                            </p>
                            <p className="text-3xl font-bold text-red-600">0</p>
                        </div>
                        <button className="text-xl opacity-70 hover:opacity-100" 
                            title="Listen">🔊</button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500" data-i18n="register4">
                                Breeding Requests
                            </p>
                            <p className="text-3xl font-bold text-gray-900">1</p>
                        </div>
                        <button className="text-xl opacity-70 hover:opacity-100" 
                            title="Listen">🔊</button>
                    </div>

                </div>
            </section>

           
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800" data-i18n="action">
                        Quick Actions
                    </h2>
                    <button className="text-xl opacity-70 hover:opacity-100" 
                        title="Listen">🔊</button>
                </div>

                
                <div className="flex items-center gap-2">
                    <button className="flex-1 py-3 px-4 flex items-center justify-center rounded-lg
              text-white bg-cyan-900 hover:bg-cyan-700 border-2 border-sky-600
               font-medium shadow-md transition" >
                        <span data-i18n="register2">Register Animal</span>
                    </button>
                    <button className="text-xl opacity-70 hover:opacity-100" 
                        title="Listen">🔊</button>
                </div>

                
                <div className="flex items-center gap-2">
                    <button className="flex-1 py-3 px-4 flex items-center justify-center rounded-lg
               text-white bg-cyan-900 hover:bg-cyan-700 border-2 border-sky-600
               font-medium shadow-md transition" >
                        <span data-i18n="reminder">Identify / Scan Animal</span>
                    </button>
                    <button className="text-xl opacity-70 hover:opacity-100" 
                        title="Listen">🔊</button>
                </div>
            </section>

            
            <section className="pt-4 border-t border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-600" data-i18n="about">
                        About
                    </h3>
                    <button className="text-xl opacity-70 hover:opacity-100" 
                        title="Listen">🔊</button>
                </div>

                <div className="flex items-start justify-between gap-2">
                    <p className="text-xs text-gray-500" data-i18n="about_desc">
                        This tool is optimized for fast field identification and tracking using minimal data
                        connectivity.
                    </p>
                    <button className="text-xl opacity-70 hover:opacity-100" 
                        title="Listen">🔊</button>
                </div>
            </section>

        </aside>

  )
}

export default Sidebar