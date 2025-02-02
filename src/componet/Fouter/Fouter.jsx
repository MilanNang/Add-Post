import React from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo";

function Footer() {
  return (
    <footer className="w-full bg-[#bc6c25] text-white py-10">
      <div className="container mx-auto px-6 flex flex-col items-center">
        
        {/* Content Wrapper */}
        <div className="w-full flex justify-between items-center mb-6">
          {/* Logo (Left Side) */}
          <div className="mr-auto">
            <Logo width="120px" />
          </div>

          {/* Centered Sections */}
          <div className="flex flex-wrap justify-center text-center gap-16 flex-1">
            
            {/* Company */}
            <div className="w-40 text-black">
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                <li><Link to="/" className="hover:text-gray-300">Features</Link></li>
                <li><Link to="/" className="hover:text-gray-300">Pricing</Link></li>
               
              </ul>
            </div>

            {/* Support */}
            <div className="w-40 text-black">
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-3">
                <li><Link to="/" className="hover:text-gray-300">Help Center</Link></li>
                <li><Link to="/" className="hover:text-gray-300">FAQs</Link></li>
               
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-500 mt-6 pt-6 text-center w-full text-black">
          <p className="text-sm  text-black">
            &copy; {new Date().getFullYear()} DevUI. All rights Milan.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
