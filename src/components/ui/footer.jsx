import React from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Twitter,
  Instagram,
  Users,
  ShieldCheck,
  Smile,
} from "lucide-react";
import { LANDING_THEME } from "../../constants/theme-landing";
import elephantLogo from "../../../public/elephant.jpg";

const Footer = () => {
  return (
    <footer
      className={`${LANDING_THEME.colors.background.transparent} pt-16 pb-8`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-16">
          {/* Brand & Description */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 group mb-4">
              <div
                className={`rounded-xl group-hover:scale-105 transition-transform duration-300 flex items-center justify-center`}
              >
                <img
                  src={elephantLogo}
                  alt="StoryAI Logo"
                  className="w-12 h-12 rounded-xl"
                />
              </div>
              <span
                className={`text-xl md:text-2xl ${LANDING_THEME.typography.weight.heading} ${LANDING_THEME.colors.text.heading} tracking-tight ${LANDING_THEME.typography.family.main}`}
              >
                Tara Story AI
              </span>
            </Link>
            <p
              className={`text-sm ${LANDING_THEME.colors.text.subtitle} leading-relaxed pr-4`}
            >
              Empowering the next generation of storytellers through the magic
              of artificial intelligence.
            </p>
            <div
              className={`flex gap-4 mt-6 ${LANDING_THEME.colors.text.subtitle}`}
            >
              <a
                href="#"
                className={`hover:${LANDING_THEME.colors.text.heading} transition-colors`}
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className={`hover:${LANDING_THEME.colors.text.heading} transition-colors`}
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4
              className={`${LANDING_THEME.typography.weight.bold} ${LANDING_THEME.colors.text.heading} mb-6`}
            >
              Product
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#features"
                  className={`text-sm ${LANDING_THEME.colors.text.subtitle} hover:${LANDING_THEME.colors.text.heading} transition-colors`}
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className={`text-sm ${LANDING_THEME.colors.text.subtitle} hover:${LANDING_THEME.colors.text.heading} transition-colors`}
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`text-sm ${LANDING_THEME.colors.text.subtitle} hover:${LANDING_THEME.colors.text.heading} transition-colors`}
                >
                  App Download
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`text-sm ${LANDING_THEME.colors.text.subtitle} hover:${LANDING_THEME.colors.text.heading} transition-colors`}
                >
                  Story Library
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4
              className={`${LANDING_THEME.typography.weight.bold} ${LANDING_THEME.colors.text.heading} mb-6`}
            >
              Company
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className={`text-sm ${LANDING_THEME.colors.text.subtitle} hover:${LANDING_THEME.colors.text.heading} transition-colors`}
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`text-sm ${LANDING_THEME.colors.text.subtitle} hover:${LANDING_THEME.colors.text.heading} transition-colors`}
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`text-sm ${LANDING_THEME.colors.text.subtitle} hover:${LANDING_THEME.colors.text.heading} transition-colors`}
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4
              className={`${LANDING_THEME.typography.weight.bold} ${LANDING_THEME.colors.text.heading} mb-6`}
            >
              Contact
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:hello@storyai.com"
                  className={`text-sm ${LANDING_THEME.colors.text.subtitle} hover:${LANDING_THEME.colors.text.heading} transition-colors`}
                >
                  hello@storyai.com
                </a>
              </li>
              <li>
                <span
                  className={`text-sm ${LANDING_THEME.colors.text.subtitle}`}
                >
                  1-800-MAGIC-STORY
                </span>
              </li>
              <li>
                <span
                  className={`text-sm ${LANDING_THEME.colors.text.subtitle}`}
                >
                  Based in Sunnyvale, CA
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className={`text-xs ${LANDING_THEME.colors.text.light}`}>
            © {new Date().getFullYear()} StoryAI. All rights reserved.
          </p>
          <div
            className={`flex items-center gap-4 ${LANDING_THEME.colors.text.light}`}
          >
            <Users size={18} aria-label="Family Friendly" />
            <ShieldCheck size={18} aria-label="Secure" />
            <Smile size={18} aria-label="Kid Safe" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
