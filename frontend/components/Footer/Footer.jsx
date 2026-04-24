import React from 'react'
import { Link } from 'react-router-dom'
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';
import { useTranslation } from "react-i18next";

const Footer = () => {
    const { t, i18n } = useTranslation();
    return (
        <footer className="bg-slate-100 text-gray-700 p-10 px-4 md:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                <div>
                    <h2 className="text-2xl font-bold text-yellow-900">SAMRIDHI</h2>
                    <p className="mt-2 text-sm leading-relaxed">
                        {t("footer.desc")}
                    </p>
                </div>
                <div>
                    <h3 className="font-semibold text-yellow-800 mb-3">{t("footer.quicklinks")}</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-yellow-400 transition">{t("footer.home")}</Link></li>
                        <li><Link to="/explore" className="hover:text-yellow-400 transition">{t("footer.explore")}</Link></li>
                        <li><Link to="/login" className="hover:text-yellow-400 transition">{t("footer.login")}</Link></li>
                        <li><Link to="/signup" className="hover:text-yellow-400 transition">{t("footer.signup")}</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-yellow-800 mb-3">{t("footer.support")}</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/contact" className="hover:text-yellow-400 transition">{t("footer.contactus")}</Link></li>
                        <li><Link to="/faq" className="hover:text-yellow-400 transition">{t("footer.faqs")}</Link></li>
                        <li><Link to="/privacy" className="hover:text-yellow-400 transition">{t("footer.privacypolicy")}</Link></li>
                        <li><Link to="/terms" className="hover:text-yellow-400 transition">{t("footer.termsandconditions")}</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-yellow-800 mb-3">{t("footer.stayconnected")}</h3>

                    <div className="flex items-center gap-4 text-xl mb-4">
                        <a href="mailto:info@bookventure.com" className="hover:text-yellow-400" aria-label="Email">
                            <FaEnvelope />
                        </a>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400" aria-label="GitHub">
                            <FaGithub />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400" aria-label="LinkedIn">
                            <FaLinkedin />
                        </a>
                    </div>
                    <form className="flex border border-slate-500 rounded flex-col bg-white sm:flex-row items-stretch gap-2 sm:gap-0">
                        <input
                            type="email"
                            placeholder={t("footer.email")}
                            className="px-3 py-2 rounded-md sm:rounded-l-md sm:rounded-r-none text-sm text-black focus:outline-none w-full"
                        />
                        <button className="bg-yellow-400 text-black px-4 py-2 rounded-md sm:rounded-l-none sm:rounded-r-md text-sm font-semibold hover:bg-yellow-300 transition">
                            {t("footer.subscribe")}
                        </button>
                    </form>

                </div>
                <div className="text-center text-sm text-gray-500">
                    &copy; 2026 SAMRIDHI. {t("footer.allrightsreserved")}
                </div>
            </div>
        </footer>
    )
}

export default Footer