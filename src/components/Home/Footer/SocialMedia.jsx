import React from "react";
import { FaEnvelope, FaTelegramPlane } from "react-icons/fa";
import { Phone } from "lucide-react";
import {
  FaFacebook,
  FaXTwitter,
  FaLinkedin,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa6";

function SocialMedia() {
  return (
    <div className="bg-[#EDE8D0] w-screen min-h-[85vh] relative flex flex-col px-4 py-7">
      {/* 
        1. Logo + "Build your dreams..." 
        -- Mobile: Appears at the top 
        -- Laptop: Absolutely positioned top-left
      */}
      <div
        className="
          flex flex-col sm:flex-row sm:items-center 
          space-y-2 sm:space-y-0 sm:space-x-2
          lg:absolute lg:top-2 lg:left-2
        "
      >
        <img
          src="logo-removebg-preview.png"
          alt="logo"
          className="w-24 h-auto"
        />
        <h2 className="!hidden text-sm font-primary font-secondary text-gray-900">
          Build your dreams in real estate
        </h2>
      </div>

      {/* 2. Small break before Quick Navigation */}
      <div className="my-4 lg:hidden" />

      {/* 
        3. Quick Navigation 
        -- Mobile: Next in normal flow 
        -- Laptop: Absolutely centered near top 
      */}
      <div
        className="
          w-full flex flex-col items-center text-center
          lg:absolute lg:top-10 lg:left-1/2 lg:-translate-x-1/2
        "
      >
        <h2 className="font-primary font-secondary text-xl text-gray-500 font-medium tracking-wide">
          Quick Navigation
        </h2>
        <div className="mt-4 space-y-3">
          <p className="font-primary font-secondary text-xl text-black transition-transform duration-200 hover:scale-110 cursor-pointer">
            Home
          </p>
          <p className="text-xl font-primary font-secondary text-black transition-transform duration-200 hover:scale-110 cursor-pointer">
            Our Properties
          </p>
          <p className="text-xl font-primary font-secondary text-black transition-transform duration-200 hover:scale-110 cursor-pointer">
            Our Advantages
          </p>
          <p className="text-xl font-primary font-secondary text-black transition-transform duration-200 hover:scale-110 cursor-pointer">
            Our Services
          </p>
        </div>
      </div>

      
      {/* 
        8. Our Location + Map 
        -- Mobile: Next in normal flow 
        -- Laptop: Absolutely near bottom center (or full width)
      */}
      <div
        className="
          flex flex-col items-center mt-6
          lg:absolute lg:bottom-0 lg:left-1/2 lg:-translate-x-1/2 lg:mb-4
        "
      >
   <p className="text-lg font-primary font-secondary text-black-8000 dark:text-black-8000">Our Location</p>

        <div class="mb-5"/>
        <div className="w-[300px] h-[180px] mt-2 shadow-lg rounded-lg overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.6313977313675!2d76.8973565!3d28.6707535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d0c12f1a4aac5%3A0x40901c1b30199cb5!2sHL%20City!5e0!3m2!1sen!2sin!4v1739420610003!5m2!1sen!2sin"
            className="w-full h-full"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
        <div class="mb-10"/>
        <h2 className="text-sm mt-2 text-center">
          HL City, Bahadurgarh Bypass, Sector 37,<br />
          Bahadurgarh, Haryana 124507
        </h2>
      </div>
     


      {/* 4. Another break before "Change your future..." */}
    

      {/* 
        5. "Change your Future with us" 
        -- Mobile: Normal flow 
        -- Laptop: Absolutely at top-right 
      */}
      <div
        className="
          flex flex-col items-left p-4 text-left
          lg:absolute lg:top-20 lg:right-[6.25rem]  /* 'right-25' in Tailwind ~ 6.25rem */
        "
      >
        <h2 className="text-lg font-primary font-secondary text-gray-900">
          Change your Future
          <br /> with us
        </h2>
        <div class="mb-5"/>
        <div className="mt-2 flex items-center space-x-3">
          <button className="bg-black h-8 w-24 text-white text-sm rounded-full p-1 flex items-center justify-center">
            Contact Us
          </button>
          <FaTelegramPlane className="text-black text-lg" />
        </div>
       
      </div>

      {/* 
        6. Phone & Email 
        -- Mobile: Next in normal flow 
        -- Laptop: Absolutely below "Change your Future..."
      */}
      <div
        className="
          flex flex-col items-left space-y-2 mt-4 p-4
          lg:absolute lg:top-[190px] lg:right-[45px] 
        "
      >
        {/* Phone */}
        <div className="flex items-center space-x-2">
          <Phone className="text-black w-4 h-4" />
          <p className="text-xs whitespace-nowrap">
            +91-8813888101, +91-9466675666
          </p>
        </div>
        {/* Email */}
        <div className="flex items-center space-x-2">
          <FaEnvelope className="text-black text-sm" />
          <p className="text-xs whitespace-nowrap">info@hlcity.in</p>
        </div>
      </div>

      {/* 
        7. Get to know us (Social Media + Subscription)
        -- Mobile: Normal flow
        -- Laptop: Absolutely bottom-left
      */}
      <div
        className="
          bg-[#EDE8D0] w-full max-w-sm p-4 rounded-lg mt-6
          lg:absolute lg:bottom-4 lg:left-4
        "
      >
        <h2 className="text-lg font-primary font-secondary">
          Get to know us now!
        </h2>
        <p className="text-sm mt-1">Follow us on our social handles.</p>

        <div className="mt-3 flex space-x-3">
          {[
            {
              href: "https://www.facebook.com/hlagh99999/",
              icon: (
                <FaFacebook className="text-blue-600 text-xl hover:scale-105 transition-transform" />
              ),
            },
            {
              href: "https://x.com/i/flow/login?redirect_after_login=%2Fcity_hl",
              icon: (
                <FaXTwitter className="text-black text-xl hover:scale-105 transition-transform" />
              ),
            },
            {
              href: "https://www.linkedin.com/company/hl-residency-private-limited/",
              icon: (
                <FaLinkedin className="text-blue-700 text-xl hover:scale-105 transition-transform" />
              ),
            },
            {
              href: "https://www.youtube.com/channel/UCuQrGWknXrkI5MYJq8O8S3A?view_as=subscriber",
              icon: (
                <FaYoutube className="text-red-600 text-xl hover:scale-105 transition-transform" />
              ),
            },
            {
              href: "https://www.instagram.com/hl.city/",
              icon: (
                <FaInstagram className="text-pink-500 text-xl hover:scale-105 transition-transform" />
              ),
            },
          ].map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Email field */}
        <div className="mt-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-1 border-b border-gray-400 outline-none bg-transparent text-sm"
          />
        </div>

        {/* Phone field */}
        <div className="mt-3 flex items-center space-x-2">
          <select className="p-1 border-b border-gray-400 bg-transparent text-sm">
            <option value="+1">+1</option>
            <option value="+44">+44</option>
            <option value="+91">+91</option>
            <option value="+61">+61</option>
            <option value="+81">+81</option>
          </select>
          <input
            type="tel"
            placeholder="Phone"
            className="w-full p-1 border-b border-gray-400 outline-none bg-transparent text-sm"
            maxLength="10"
          />
        </div>

        <button className="mt-6 bg-black text-white px-5 py-2 rounded-full w-full font-semibold shadow-lg hover:bg-gray-100 hover:text-black">
          Subscribe
        </button>
      </div>
      {/* 
        9. Footer disclaimers 
        -- Mobile: Normal flow at bottom
        -- Laptop: Absolutely bottom-right
      */}
      <div
        className="
          mt-6 lg:absolute lg:bottom-0 lg:right-4 lg:p-4
          flex flex-col items-center lg:items-end
        "
      >
        <div className="flex flex-col items-center lg:items-end space-y-1 text-sm">
          <div className="flex items-center space-x-1 ">
          
            <p className="font-semibold text-black">© HL CITY.</p>
            <p className="text-gray-600">All rights reserved.</p>

          </div>
          <div className="flex items-center space-x-4 text-xs">
            <p className="font-semibold text-black transition-transform duration-200 hover:scale-105 cursor-pointer">
              Terms Of Service
            </p>
            <p className="font-semibold text-black transition-transform duration-200 hover:scale-105 cursor-pointer">
              &
            </p>
            <p className="font-semibold text-black transition-transform duration-200 hover:scale-105 cursor-pointer">
              Privacy Policy
            </p>
          </div>
          
        </div>
        
      </div>
      <div class="mb-20">
</div>
    </div>
  );
}

export default SocialMedia;
