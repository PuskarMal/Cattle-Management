import React, { useState, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b'];

const Dashboard = () => {
  // Fallback to a default district if localStorage is empty
  const dis = (localStorage.getItem('district')).toUpperCase();

  const [view, setView] = useState('Total');
  const [dbData, setDbData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Correct way to use async in useEffect
    const fetchDistrictData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/district-analysis/${dis}`, {
          
          headers: { type: view } 
        });
        const data = await res.json();
        setDbData(data); // 2. Save data to state
      } catch (error) {
        console.error('Error fetching district data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDistrictData();
  }, [dis, view]);

  // Helper to calculate totals from Rural + Urban dynamically
const stats = useMemo(() => {
    if (!dbData) return null;

    // Helper to sum fields if view is "Total" (which returns an array from the backend)
    const getVal = (field) => {
      if (Array.isArray(dbData)) {
        return dbData.reduce((sum, item) => sum + (item[field] || 0), 0);
      }
      return dbData[field] || 0;
    };

    // Transform flat Schema fields into grouped objects for the charts
    return {
      
      indigenous: {
        male: getVal('IndigMale'),
        female: getVal('IndigFemale'),
        inMilk: getVal('IndigInMilk'),
        total: getVal('IndigMale') + getVal('IndigFemale')
      },
      exotic: {
        male: getVal('EXCBMale'),
        female: getVal('EXCBFemale'),
        inMilk: getVal('EXCBInMilk'),
        total: getVal('EXCBMale') + getVal('EXCBFemale')
      },
      buffalo: {
        male: getVal('BuffaloMale'),
        female: getVal('BuffaloFemale'),
        inMilk: getVal('BuffaloInMilk'),
        total: getVal('BuffaloMale') + getVal('BuffaloFemale')
      }
    };
  }, [dbData]);

  // If stats is null, show loading
  if (!stats) return <div className="p-10 text-center">Loading District Data...</div>;
  
  const populationData = [
    { name: 'Exotic/Crossbreed', value: stats.exotic.total },
    { name: 'Indigenous', value: stats.indigenous.total },
    { name: 'Buffalo', value: stats.buffalo.total },
  ];

  const productivityData = [
    { name: 'Exotic/Crossbreed', inMilk: stats.exotic.inMilk },
    { name: 'Indigenous', inMilk: stats.indigenous.inMilk },
    { name: 'Buffalo', inMilk: stats.buffalo.inMilk },
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 uppercase">{dis} Analytics</h1>
          <p className="text-slate-500 text-sm font-medium">District Livestock Overview</p>
        </div>

        {/* View Toggles */}
        <div className="flex bg-white border rounded-xl p-1 shadow-sm">
          {['Total', 'Rural', 'Urban'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                view === v ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {v.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Population Share */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-slate-400 text-sm font-bold uppercase mb-6">Population Share</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={populationData} 
                  innerRadius={60} 
                  outerRadius={85} 
                  paddingAngle={10} 
                  dataKey="value"
                >
                  {populationData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip cornerRadius={10} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Productivity Bar */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-slate-400 text-sm font-bold uppercase mb-6">Milk Production Units (In-Milk)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productivityData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="inMilk" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Dynamic Detailed Stats Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(stats).map(([breed, data], i) => {
          // Safety Math Check to prevent NaN%
          const femalePop = data.female || 0;
          const malePop = data.male || 0;
          const milkPop = data.inMilk || 0;
          const milkPercentage = femalePop > 0 ? ((milkPop / femalePop) * 100).toFixed(1) : 0;

          return (
            <div key={breed} className="bg-white p-6 rounded-2xl border-b-4 shadow-sm transition-transform hover:scale-105" style={{borderColor: COLORS[i % COLORS.length]}}>
              <h4 className="capitalize font-bold text-slate-800 text-lg mb-4">{breed === "exotic" ? "Exotic/Crossbreed" : breed} Breakdown</h4>
              <div className="flex justify-between text-sm py-2 border-b border-slate-50">
                <span className="text-slate-500">Milk Production</span>
                <span className="font-mono font-bold text-indigo-600">
                  {milkPop.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-slate-50">
                <span className="text-slate-500">Milk Population (in %)</span>
                <span className="font-mono font-bold text-indigo-600">
                  {milkPercentage}%
                </span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-slate-50">
                <span className="text-slate-500">Female Population</span>
                <span className="font-mono font-bold text-indigo-600">
                  {femalePop.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-slate-50">
                <span className="text-slate-500">Male Population</span>
                <span className="font-mono font-bold text-indigo-600">
                  {malePop.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm py-2">
                <span className="text-slate-500">Total Population</span>
                <span className="font-mono font-bold text-indigo-600">
                  {(femalePop+malePop || 0).toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;