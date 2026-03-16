// import React from "react";
// import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
// import { useTranslation } from "react-i18next";
// import { NavLink } from "react-router-dom";

// const Footer = () => {
//   const { t } = useTranslation();

//   const services = t("footer.services", { returnObjects: true });
//   const links = t("footer.links", { returnObjects: true });

//   return (
//     <footer className="font-poppins border-t mt-16">
//       <div className="max-w-7xl mx-auto px-6 py-12">
//         {/* Top Section */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
//           {/* ABOUT */}
//           <div>
//             <h2 className="text-xl font-bold mb-4">{t("footer.aboutTitle")}</h2>
//             <p className="text-gray-600 text-sm">{t("footer.aboutDesc")}</p>
//           </div>

//           {/* SERVICES */}
//           <div>
//             <h2 className="text-xl font-bold mb-4">
//               {t("footer.servicesTitle")}
//             </h2>
//             <ul className="space-y-2 text-gray-600 text-sm">
//               {services.map((item, index) => (
//                 <li key={index}>
//                   <NavLink
//                     to={item.path}
//                     className="hover:text-primary transition duration-200"
//                   >
//                     {item.label}
//                   </NavLink>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* LINKS */}
//           <div>
//             <h2 className="text-xl font-bold mb-4">{t("footer.linkTitle")}</h2>
//             <ul className="space-y-2 text-gray-600 text-sm">
//               {links.map((item, index) => (
//                 <li key={index}>
//                   <NavLink
//                     to={item.path}
//                     className="hover:text-primary transition duration-200"
//                   >
//                     {item.label}
//                   </NavLink>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* CONTACT */}
//           <div>
//             <h2 className="text-xl font-bold mb-4">
//               {t("footer.contactTitle")}
//             </h2>
//             <ul className="space-y-3 text-gray-600 text-sm">
//               <li className="flex items-center gap-2">
//                 <FaPhoneAlt className="text-sm" />
//                 {t("footer.contactPhone")}
//               </li>
//               <li className="flex items-center gap-2">
//                 <FaEnvelope className="text-sm" />
//                 {t("footer.contactEmail")}
//               </li>
//               <li className="flex items-center gap-2">
//                 <FaMapMarkerAlt className="text-sm" />
//                 {t("footer.contactAddress")}
//               </li>
//             </ul>
//           </div>

//           {/* LOCATION */}
//           {/* <div>
//             <h2 className="text-xl font-bold mb-4">
//               {t("footer.locationTitle")}
//             </h2>
//             <div className="w-full h-32 bg-gray-200 rounded-md overflow-hidden">
//               <img
//                 src="https://maps.googleapis.com/maps/api/staticmap?center=Washington&zoom=13&size=300x200&key=YOUR_API_KEY"
//                 alt={t("footer.mapAlt")}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </div> */}
//         </div>

//         {/* Divider */}
//         <div className="border-t my-8"></div>

//         {/* Bottom Section */}
//         <div className="text-center text-sm text-gray-600">
//           {t("footer.copyright")}
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
import React from "react";
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import {
  FaXTwitter,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const { t } = useTranslation();

  const services = t("footer.services", { returnObjects: true });
  const links = t("footer.links", { returnObjects: true });

  const socialLinks = [
    { icon: FaFacebookF, href: "#", color: "hover:bg-blue-600" },
    { icon: FaXTwitter, href: "#", color: "hover:bg-gray-800" },
    { icon: FaInstagram, href: "#", color: "hover:bg-pink-600" },
    { icon: FaLinkedinIn, href: "#", color: "hover:bg-blue-700" },
  ];

  return (
    <footer className="font-poppins relative bg-gradient-to-br from-gray-50 via-white to-orange-50 border-t mt-16 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300/5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* ABOUT - Slide from left */}
          <div className="animate-slide-in-left">
            <h2 className="text-xl font-bold mb-4 relative inline-block">
              {t("footer.aboutTitle")}
              {/* <span className="absolute -bottom-1 left-0 w-12 h-1 bg-primary rounded-full"></span> */}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {t("footer.aboutDesc")}
            </p>

            {/* Social Media Icons */}
            {/* <div className="flex gap-3 mt-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 transition-all duration-300 hover:text-white transform hover:scale-110 hover:-translate-y-1 ${social.color}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <social.icon className="text-sm" />
                </a>
              ))}
            </div> */}
          </div>

          {/* SERVICES - Slide up */}
          <div className="animate-slide-up">
            <h2 className="text-xl font-bold mb-4 relative inline-block">
              {t("footer.servicesTitle")}
              {/* <span className="absolute -bottom-1 left-0 w-12 h-1 bg-primary rounded-full"></span> */}
            </h2>
            <ul className="space-y-3 text-gray-600 text-sm">
              {services.map((item, index) => (
                <li key={index} className="group">
                  <NavLink
                    to={item.path}
                    className="flex items-center gap-2 hover:text-primary transition-all duration-300 hover:translate-x-2"
                  >
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full group-hover:bg-primary transition-colors duration-300"></span>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* LINKS - Slide up delayed */}
          <div className="animate-slide-up-delay">
            <h2 className="text-xl font-bold mb-4 relative inline-block">
              {t("footer.linkTitle")}
              {/* <span className="absolute -bottom-1 left-0 w-12 h-1 bg-primary rounded-full"></span> */}
            </h2>
            <ul className="space-y-3 text-gray-600 text-sm">
              {links.map((item, index) => (
                <li key={index} className="group">
                  <NavLink
                    to={item.path}
                    className="flex items-center gap-2 hover:text-primary transition-all duration-300 hover:translate-x-2"
                  >
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full group-hover:bg-primary transition-colors duration-300"></span>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT - Slide from right */}
          <div className="animate-slide-in-right">
            <h2 className="text-xl font-bold mb-4 relative inline-block">
              {t("footer.contactTitle")}
              {/* <span className="absolute -bottom-1 left-0 w-12 h-1 bg-primary rounded-full"></span> */}
            </h2>
            <ul className="space-y-4 text-gray-600 text-sm">
              {/* <li className="flex items-start gap-3 group hover:text-primary transition-colors duration-300">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <FaPhoneAlt className="text-xs" />
                </div>
                <span className="mt-1">{t("footer.contactPhone")}</span>
              </li> */}
              <li className="flex items-start gap-3 group hover:text-primary transition-colors duration-300">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <FaEnvelope className="text-xs" />
                </div>
                <span className="mt-1">steeryourhappiness@gmail.com</span>
              </li>
              {/* <li className="flex items-start gap-3 group hover:text-primary transition-colors duration-300">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <FaMapMarkerAlt className="text-xs" />
                </div>
                <span className="mt-1">{t("footer.contactAddress")}</span>
              </li> */}
            </ul>
          </div>
        </div>

        {/* Divider with animation */}
        <div className="relative my-8">
          <div className="border-t"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse"></div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600 animate-fade-in">
          <p className="text-center md:text-left">{t("footer.copyright")}</p>

          {/* Back to Top Button */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-2 text-primary hover:text-primary/80 transition-all duration-300"
          >
            <span>Back to Top</span>
            <svg
              className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
