import {
  PawPrint,
  ScanLine,
  Syringe,
  HeartPulse,
  Bell,
  LayoutDashboard
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
const Sidebar = () => {
  return (
    <aside className="w-full lg:w-72 h-[120] bg-slate-900 text-slate-100 p-6 flex flex-col justify-between hidden lg:block">

      {/* TOP */}
      <div className="space-y-8 shadow-xl">


        {/* STATS */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Animals" value="128" />
          <StatCard label="Elite Dams" value="14" />
          <StatCard label="Vaccines Due" value="3" danger />
          <StatCard label="Breeding" value="5" />
        </div>

        {/* ACTIONS */}
        <div className="space-y-2">
          <a href="/register-cattle" className="block">
            <ActionButton icon={<PawPrint />} text="Register Animal" />
          </a>

          <a href="/identify" className="block">
            <ActionButton icon={<ScanLine />} text="Scan / Identify" />
          </a>
        </div>


        {/* NAV */}
        <nav className="space-y-2 pt-6 border-t border-slate-700">
          <NavItem icon={<LayoutDashboard />} label="Dashboard" />
          <NavItem icon={<HeartPulse />} label="Health Records" />
          <Link to="/vaccination"><NavItem icon={<Syringe />} label="Vaccinations" /></Link>
          <NavItem icon={<Bell />} label="Alerts" />
        </nav>
      </div>

      {/* FOOTER */}
      <div className="text-xs text-slate-500">
        Offline‑ready • Low bandwidth
      </div>
    </aside>
  );
};

/* ---------- Components ---------- */

const StatCard = ({ label, value, danger }) => (
  <div className={`rounded-xl p-4 ${danger ? "bg-red-500/10 text-red-400" : "bg-slate-800"}`}>
    <p className="text-xs opacity-70">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const ActionButton = ({ icon, text }) => (
  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
    bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition">
    {icon}
    {text}
  </button>
);

const NavItem = ({ icon, label }) => (
  <div className="flex items-center gap-3 px-3 py-2 rounded-lg
    hover:bg-slate-800 cursor-pointer text-slate-300 hover:text-white">
    {icon}
    {label}
  </div>
);

export default Sidebar;
