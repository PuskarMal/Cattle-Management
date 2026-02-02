import React from "react";
import logo from "../Navbar/logo.jpeg";
import { useTranslation } from "react-i18next";

const Navbar = ({ isAdmin }) => {
  const { t, i18n } = useTranslation();

  return (
    <nav className="w-full sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="SAMRIDHI Logo" className="h-9 w-auto" />
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-700">
          <a href="/" className="text-cyan-900 hover:text-pink-600 transition">{t("nav.home")}</a>
          <a href="/register-cattle" className="text-cyan-900 hover:text-pink-600 transition">{t("nav.register")}</a>
          <a href="/my-cattle" className="text-cyan-900 hover:text-pink-600 transition">{t("nav.myCattle")}</a>
          <a href="/identify" className="text-cyan-900 hover:text-pink-600 transition">{t("nav.identify")}</a>
          <a href="/marketplace" className="text-cyan-900 hover:text-pink-600 transition">{t("nav.marketplace")}</a>
          <a href="/reports" className="text-cyan-900 hover:text-pink-600 transition">{t("nav.reports")}</a>
          <a href="/voice" className="text-cyan-900 hover:text-pink-600 transition">{t("nav.voice")}</a>
          <a href="/help" className="text-cyan-900 hover:text-pink-600 transition">{t("nav.help")}</a>
        </div>

        

        {/* Right Controls */}
        <div className="flex items-center gap-4">

          {/* Language Selector */}
          <select
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            aria-label="Select language"
            className="appearance-none border border-gray-300 rounded-md px-3 py-1.5 text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary-green bg-white cursor-pointer"
          >
            <option value="en">English</option> 
            <option value="hi">हिंदी (Hindi)</option> 
            <option value="bn">বাংলা (Bengali)</option> 
            <option value="te">తెలుగు (Telugu)</option> 
            <option value="mr">मराठी (Marathi)</option> 
            <option value="ta">தமிழ் (Tamil)</option> 
            <option value="ur">اردو (Urdu)</option> 
            <option value="gu">ગુજરાતી (Gujarati)</option> 
            <option value="kn">ಕನ್ನಡ (Kannada)</option> 
            <option value="ml">മലയാളം (Malayalam)</option> 
            <option value="or">ଓଡ଼ିଆ (Odia)</option> 
            <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option> 
            <option value="as">অসমীয়া (Assamese)</option> 
            <option value="ma">मैथिली (Maithili)</option> 
            <option value="sa">संस्कृत (Sanskrit)</option> 
            <option value="ks">کٲشُر (Kashmiri)</option> 
            <option value="ne">नेपाली (Nepali)</option> 
            <option value="sd">سنڌي (Sindhi)</option> 
            <option value="kok">कोंकणी (Konkani)</option> 
            <option value="doi">डोगरी (Dogri)</option> 
            <option value="mni">মৈতৈলোন্ (Manipuri)</option> 
            <option value="sat">ᱥᱟᱱᱛᱟᱲᱤ (Santali)</option>
          </select>

          {/* Profile Icon */}
          <button
            className="hidden md:flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 transition"
            aria-label="User profile"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M12 12c2.7 0 4.5-2.1 4.5-4.5S14.7 3 12 3
                7.5 5.1 7.5 7.5 9.3 12 12 12zm0 2
                c-3.3 0-9 1.7-9 5v2h18v-2c0-3.3-5.7-5-9-5z" />
            </svg>
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
