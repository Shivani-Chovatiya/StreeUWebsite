// // import React from "react";
// // import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
// // import { useTranslation } from "react-i18next";
// // import { NavLink } from "react-router-dom";

// // const Footer = () => {
// //   const { t } = useTranslation();

// //   const services = t("footer.services", { returnObjects: true });
// //   const links = t("footer.links", { returnObjects: true });

// //   return (
// //     <footer className="font-poppins border-t mt-16">
// //       <div className="max-w-7xl mx-auto px-6 py-12">
// //         {/* Top Section */}
// //         <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
// //           {/* ABOUT */}
// //           <div>
// //             <h2 className="text-xl font-bold mb-4">{t("footer.aboutTitle")}</h2>
// //             <p className="text-gray-600 text-sm">{t("footer.aboutDesc")}</p>
// //           </div>

// //           {/* SERVICES */}
// //           <div>
// //             <h2 className="text-xl font-bold mb-4">
// //               {t("footer.servicesTitle")}
// //             </h2>
// //             <ul className="space-y-2 text-gray-600 text-sm">
// //               {services.map((item, index) => (
// //                 <li key={index}>
// //                   <NavLink
// //                     to={item.path}
// //                     className="hover:text-primary transition duration-200"
// //                   >
// //                     {item.label}
// //                   </NavLink>
// //                 </li>
// //               ))}
// //             </ul>
// //           </div>

// //           {/* LINKS */}
// //           <div>
// //             <h2 className="text-xl font-bold mb-4">{t("footer.linkTitle")}</h2>
// //             <ul className="space-y-2 text-gray-600 text-sm">
// //               {links.map((item, index) => (
// //                 <li key={index}>
// //                   <NavLink
// //                     to={item.path}
// //                     className="hover:text-primary transition duration-200"
// //                   >
// //                     {item.label}
// //                   </NavLink>
// //                 </li>
// //               ))}
// //             </ul>
// //           </div>

// //           {/* CONTACT */}
// //           <div>
// //             <h2 className="text-xl font-bold mb-4">
// //               {t("footer.contactTitle")}
// //             </h2>
// //             <ul className="space-y-3 text-gray-600 text-sm">
// //               <li className="flex items-center gap-2">
// //                 <FaPhoneAlt className="text-sm" />
// //                 {t("footer.contactPhone")}
// //               </li>
// //               <li className="flex items-center gap-2">
// //                 <FaEnvelope className="text-sm" />
// //                 {t("footer.contactEmail")}
// //               </li>
// //               <li className="flex items-center gap-2">
// //                 <FaMapMarkerAlt className="text-sm" />
// //                 {t("footer.contactAddress")}
// //               </li>
// //             </ul>
// //           </div>

// //           {/* LOCATION */}
// //           {/* <div>
// //             <h2 className="text-xl font-bold mb-4">
// //               {t("footer.locationTitle")}
// //             </h2>
// //             <div className="w-full h-32 bg-gray-200 rounded-md overflow-hidden">
// //               <img
// //                 src="https://maps.googleapis.com/maps/api/staticmap?center=Washington&zoom=13&size=300x200&key=YOUR_API_KEY"
// //                 alt={t("footer.mapAlt")}
// //                 className="w-full h-full object-cover"
// //               />
// //             </div>
// //           </div> */}
// //         </div>

// //         {/* Divider */}
// //         <div className="border-t my-8"></div>

// //         {/* Bottom Section */}
// //         <div className="text-center text-sm text-gray-600">
// //           {t("footer.copyright")}
// //         </div>
// //       </div>
// //     </footer>
// //   );
// // };

// // export default Footer;
// import React from "react";
// import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
// import {
//   FaXTwitter,
//   FaFacebookF,
//   FaInstagram,
//   FaLinkedinIn,
//   FaYoutube,
//   FaWhatsapp,
// } from "react-icons/fa6";
// import { useTranslation } from "react-i18next";
// import { NavLink } from "react-router-dom";

// const Footer = () => {
//   const { t } = useTranslation();

//   const services = t("footer.services", { returnObjects: true });
//   const links = t("footer.links", { returnObjects: true });

//   const socialLinks = [
//     {
//       icon: FaFacebookF,
//       href: "https://www.facebook.com/p/Steer-U-61582366083893/",
//       color: "hover:bg-blue-600",
//     },
//     {
//       icon: FaXTwitter,
//       href: "https://x.com/SteerU7",
//       color: "hover:bg-gray-800",
//     },
//     {
//       icon: FaInstagram,
//       href: "https://www.instagram.com/steer.your.happiness?igsh=M2NmODQ5MHR3OWx0",
//       color: "hover:bg-pink-600",
//     },
//     // { icon: FaLinkedinIn, href: "#", color: "hover:bg-blue-700" },
//     {
//       icon: FaYoutube,
//       href: "https://www.youtube.com/@steer-u?si=ZWCr143Y-qM8MrAC",
//       color: "hover:bg-red-700",
//     },
//     { icon: FaWhatsapp, href: "#", color: "hover:bg-green-700" },
//   ];

//   return (
//     <footer className="font-poppins relative bg-gradient-to-br from-gray-50 via-white to-orange-50 border-t mt-16 overflow-hidden">
//       {/* Decorative Background Elements */}
//       <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
//       <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300/5 rounded-full blur-3xl -z-10"></div>

//       <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
//         {/* Top Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
//           {/* ABOUT - Slide from left */}
//           <div className="animate-slide-in-left">
//             <h2 className="text-xl font-bold mb-4 relative inline-block">
//               {t("footer.aboutTitle")}
//               {/* <span className="absolute -bottom-1 left-0 w-12 h-1 bg-primary rounded-full"></span> */}
//             </h2>
//             <p className="text-gray-600 text-sm leading-relaxed">
//               {t("footer.aboutDesc")}
//             </p>
//           </div>

//           {/* SERVICES - Slide up */}
//           <div className="animate-slide-up">
//             <h2 className="text-xl font-bold mb-4 relative inline-block">
//               {t("footer.servicesTitle")}
//               {/* <span className="absolute -bottom-1 left-0 w-12 h-1 bg-primary rounded-full"></span> */}
//             </h2>
//             <ul className="space-y-3 text-gray-600 text-sm">
//               {services.map((item, index) => (
//                 <li key={index} className="group">
//                   <NavLink
//                     to={item.path}
//                     className="flex items-center gap-2 hover:text-primary transition-all duration-300 hover:translate-x-2"
//                   >
//                     <span className="w-1.5 h-1.5 bg-gray-400 rounded-full group-hover:bg-primary transition-colors duration-300"></span>
//                     {item.label}
//                   </NavLink>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* LINKS - Slide up delayed */}
//           <div className="animate-slide-up-delay">
//             <h2 className="text-xl font-bold mb-4 relative inline-block">
//               {t("footer.linkTitle")}
//               {/* <span className="absolute -bottom-1 left-0 w-12 h-1 bg-primary rounded-full"></span> */}
//             </h2>
//             <ul className="space-y-3 text-gray-600 text-sm">
//               {links.map((item, index) => (
//                 <li key={index} className="group">
//                   <NavLink
//                     to={item.path}
//                     className="flex items-center gap-2 hover:text-primary transition-all duration-300 hover:translate-x-2"
//                   >
//                     <span className="w-1.5 h-1.5 bg-gray-400 rounded-full group-hover:bg-primary transition-colors duration-300"></span>
//                     {item.label}
//                   </NavLink>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* CONTACT - Slide from right */}
//           <div className="animate-slide-in-right">
//             <h2 className="text-xl font-bold mb-4 relative inline-block">
//               {t("footer.contactTitle")}
//               {/* <span className="absolute -bottom-1 left-0 w-12 h-1 bg-primary rounded-full"></span> */}
//             </h2>
//             <ul className="space-y-4 text-gray-600 text-sm">
//               {/* <li className="flex items-start gap-3 group hover:text-primary transition-colors duration-300">
//                 <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
//                   <FaPhoneAlt className="text-xs" />
//                 </div>
//                 <span className="mt-1">{t("footer.contactPhone")}</span>
//               </li> */}
//               <li className="flex items-start gap-3 group hover:text-primary transition-colors duration-300">
//                 <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
//                   <FaEnvelope className="text-xs" />
//                 </div>
//                 <span className="mt-1">steeryourhappiness@gmail.com</span>
//               </li>
//               {/* <li className="flex items-start gap-3 group hover:text-primary transition-colors duration-300">
//                 <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
//                   <FaMapMarkerAlt className="text-xs" />
//                 </div>
//                 <span className="mt-1">{t("footer.contactAddress")}</span>
//               </li> */}
//             </ul>
//             {/* Social Media Icons */}
//             <div className="flex gap-3 mt-6">
//               {socialLinks.map((social, index) => (
//                 <a
//                   key={index}
//                   target="_blank"
//                   href={social.href}
//                   className={`w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 transition-all duration-300 hover:text-white transform hover:scale-110 hover:-translate-y-1 ${social.color}`}
//                   style={{ animationDelay: `${index * 0.1}s` }}
//                 >
//                   <social.icon className="text-sm" />
//                 </a>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Divider with animation */}
//         <div className="relative my-8">
//           <div className="border-t"></div>
//           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse"></div>
//         </div>

//         {/* Bottom Section */}
//         <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600 animate-fade-in">
//           <p className="text-center md:text-left">{t("footer.copyright")}</p>

//           {/* Back to Top Button */}
//           <button
//             onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//             className="group flex items-center gap-2 text-primary hover:text-primary/80 transition-all duration-300"
//           >
//             <span>Back to Top</span>
//             <svg
//               className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform duration-300"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M5 10l7-7m0 0l7 7m-7-7v18"
//               />
//             </svg>
//           </button>
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
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

/* ─── Keyframes injected once ──────────────────────────────────────────────── */
const FOOTER_STYLES = `
  @keyframes footer-slide-left {
    from { opacity: 0; transform: translateX(-48px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes footer-slide-right {
    from { opacity: 0; transform: translateX(48px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes footer-fade-up {
    from { opacity: 0; transform: translateY(36px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes footer-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes footer-draw-line {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
  @keyframes footer-orb-float {
    0%,100% { transform: translateY(0) scale(1); }
    50%     { transform: translateY(-20px) scale(1.05); }
  }
  @keyframes footer-pulse-glow {
    0%,100% { opacity: 0.5; box-shadow: 0 0 6px 1px rgba(249,115,22,0.4); }
    50%     { opacity: 1;   box-shadow: 0 0 12px 3px rgba(249,115,22,0.7); }
  }
  @keyframes footer-bounce-arrow {
    0%,100% { transform: translateY(0); }
    50%     { transform: translateY(-5px); }
  }
  @keyframes footer-dot-pop {
    0%  { transform: scale(1); }
    40% { transform: scale(1.8); }
    100%{ transform: scale(1); }
  }

  .f-col-1  { animation: footer-slide-left  0.75s cubic-bezier(.22,1,.36,1) both 0.10s; }
  .f-col-2  { animation: footer-fade-up     0.75s cubic-bezier(.22,1,.36,1) both 0.20s; }
  .f-col-3  { animation: footer-fade-up     0.75s cubic-bezier(.22,1,.36,1) both 0.32s; }
  .f-col-4  { animation: footer-slide-right 0.75s cubic-bezier(.22,1,.36,1) both 0.10s; }
  .f-bottom { animation: footer-fade-in     0.75s ease                      both 0.55s; }

  .f-orb-1 { animation: footer-orb-float 9s  ease-in-out infinite; }
  .f-orb-2 { animation: footer-orb-float 11s ease-in-out infinite reverse; animation-delay:2s; }

  .f-divider-line {
    transform-origin: left;
    animation: footer-draw-line 1s cubic-bezier(.22,1,.36,1) both 0.45s;
  }
  .f-diamond { animation: footer-pulse-glow 2.5s ease-in-out infinite; }

  .f-back-top:hover .f-arrow { animation: footer-bounce-arrow 0.6s ease infinite; }

  /* heading underline reveal on column hover */
  .f-heading { position: relative; display: inline-block; }
  .f-heading::after {
    content:'';
    position:absolute; left:0; bottom:-4px;
    height:2px; width:0; border-radius:99px;
    background: linear-gradient(90deg,#f97316,#fb923c);
    transition: width 0.4s cubic-bezier(.22,1,.36,1);
  }
  .f-col-1:hover .f-heading::after,
  .f-col-2:hover .f-heading::after,
  .f-col-3:hover .f-heading::after,
  .f-col-4:hover .f-heading::after { width: 100%; }

  /* nav link slide + dot pop */
  .f-nav-link { transition: color 0.25s, transform 0.25s; display:flex; align-items:center; gap:8px; }
  .f-nav-link:hover { color:#ea580c; transform:translateX(6px); }
  .f-link-dot { transition: background 0.25s; }
  .group:hover .f-link-dot { background:#f97316!important; animation: footer-dot-pop 0.4s ease; }

  /* contact icon spin-scale */
  .f-contact-icon { transition: background 0.3s, color 0.3s, transform 0.3s; }
  .f-contact-item:hover .f-contact-icon {
    background: #f97316 !important;
    color: #fff !important;
    transform: scale(1.12) rotate(-8deg);
  }



  /* dot-grid texture */
  .f-grid-bg {
    background-image: radial-gradient(circle, rgba(249,115,22,0.07) 1px, transparent 1px);
    background-size: 28px 28px;
  }

  /* ── Social icon animations ── */
  @keyframes footer-social-wiggle {
    0%,100% { transform: rotate(0deg) scale(1); }
    25%     { transform: rotate(-12deg) scale(1.2); }
    75%     { transform: rotate(12deg) scale(1.2); }
  }
  @keyframes footer-social-ripple {
    0%   { transform: scale(1);   opacity: 0.6; }
    100% { transform: scale(2.2); opacity: 0;   }
  }
  @keyframes footer-social-shine {
    0%   { left: -60%; }
    100% { left: 130%;  }
  }

  .f-social {
    position: relative;
    overflow: hidden;
    transition: transform 0.3s cubic-bezier(.22,1,.36,1), color 0.3s, box-shadow 0.3s;
  }
  /* shine sweep on hover */
  .f-social::before {
    content: '';
    position: absolute;
    top: -10%; left: -60%;
    width: 40%; height: 120%;
    background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%);
    transform: skewX(-15deg);
    transition: none;
    opacity: 0;
  }
  .f-social:hover::before {
    opacity: 1;
    animation: footer-social-shine 0.5s ease forwards;
  }
  /* ripple ring */
  .f-social::after {
    content: '';
    position: absolute; inset: 0;
    border-radius: 50%;
    border: 2px solid currentColor;
    opacity: 0;
    transform: scale(1);
  }
  .f-social:hover::after {
    animation: footer-social-ripple 0.55s ease-out forwards;
  }
  .f-social:hover {
    transform: translateY(-6px) scale(1.18);
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  }
  .f-social:active {
    animation: footer-social-wiggle 0.4s ease;
  }
`;

let _injected = false;
function injectFooterStyles() {
  if (_injected || typeof document === "undefined") return;
  _injected = true;
  const el = document.createElement("style");
  el.textContent = FOOTER_STYLES;
  document.head.appendChild(el);
}

/* ─── Component ────────────────────────────────────────────────────────────── */
const Footer = () => {
  injectFooterStyles();

  const { t } = useTranslation();
  const services = t("footer.services", { returnObjects: true });
  const links = t("footer.links", { returnObjects: true });

  const socialLinks = [
    {
      icon: FaFacebookF,
      href: "https://www.facebook.com/p/Steer-U-61582366083893/",
      color: "hover:bg-blue-600",
    },
    {
      icon: FaXTwitter,
      href: "https://x.com/SteerU7",
      color: "hover:bg-gray-800",
    },
    {
      icon: FaInstagram,
      href: "https://www.instagram.com/steer.your.happiness?igsh=M2NmODQ5MHR3OWx0",
      color: "hover:bg-pink-600",
    },
    {
      icon: FaYoutube,
      href: "https://www.youtube.com/@steer-u?si=ZWCr143Y-qM8MrAC",
      color: "hover:bg-red-700",
    },
    // { icon: FaWhatsapp, href: "#", color: "hover:bg-green-700" },
  ];

  return (
    <footer
      className="font-poppins relative border-t mt-16 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #fff7ed 0%, #fffbf7 25%, #ffffff 50%, #fff7ed 75%, #ffedd5 100%)",
      }}
    >
      {/* Dot-grid texture */}
      <div className="f-grid-bg absolute inset-0 pointer-events-none" />

      {/* Floating orbs */}
      <div
        className="f-orb-1 absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)",
        }}
      />
      <div
        className="f-orb-2 absolute bottom-0 left-0 w-96 h-96 rounded-full pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(251,146,60,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Top accent stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] z-20"
        style={{
          background:
            "linear-gradient(90deg,transparent,#f97316 25%,#fb923c 50%,#f97316 75%,transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* ── Top Section ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* ABOUT */}
          <div className="f-col-1">
            <h2 className="f-heading text-xl font-bold mb-4">
              {/* {t("footer.aboutTitle")} */}{" "}
              <span className="px-1 font-logo animate-pulse bg-gradient-to-r from-[#8B1E00] via-[#D04500] to-[#FF8A3D] bg-clip-text text-transparent drop-shadow-[0_2px_6px_rgba(208,69,0,0.35)]">
                Steer-U
              </span>
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {t("footer.aboutDesc")}
            </p>
          </div>

          {/* SERVICES */}
          <div className="f-col-2">
            <h2 className="f-heading text-xl font-bold mb-4">
              {t("footer.servicesTitle")}
            </h2>
            <ul className="space-y-3 text-gray-600 text-sm">
              {services.map((item, index) => (
                <li key={index} className="group">
                  <NavLink to={item.path} className="f-nav-link">
                    <span className="f-link-dot w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* LINKS */}
          <div className="f-col-3">
            <h2 className="f-heading text-xl font-bold mb-4">
              {t("footer.linkTitle")}
            </h2>
            <ul className="space-y-3 text-gray-600 text-sm">
              {links.map((item, index) => (
                <li key={index} className="group">
                  <NavLink to={item.path} className="f-nav-link">
                    <span className="f-link-dot w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div className="f-col-4">
            <h2 className="f-heading text-xl font-bold mb-4">
              {t("footer.contactTitle")}
            </h2>
            <ul className="space-y-4 text-gray-600 text-sm">
              {/* <li className="f-contact-item flex items-start gap-3 group hover:text-primary transition-colors duration-300">
                <div className="f-contact-icon w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaPhoneAlt className="text-xs" />
                </div>
                <span className="mt-1">{t("footer.contactPhone")}</span>
              </li> */}

              <li className="f-contact-item flex items-start gap-3 group hover:text-primary transition-colors duration-300">
                <div className="f-contact-icon w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="text-xs" />
                </div>
                <span className="mt-1">steeryourhappiness@gmail.com</span>
              </li>

              {/* <li className="f-contact-item flex items-start gap-3 group hover:text-primary transition-colors duration-300">
                <div className="f-contact-icon w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="text-xs" />
                </div>
                <span className="mt-1">{t("footer.contactAddress")}</span>
              </li> */}
            </ul>

            {/* Social Media Icons */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={social.href}
                  className={`f-social w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:text-white ${social.color}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <social.icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="relative my-8 h-px">
          <div className="absolute inset-0 bg-gray-200" />
          <div
            className="f-divider-line absolute inset-0 h-[2px] -top-px"
            style={{
              background:
                "linear-gradient(90deg,transparent,#f97316 30%,#fb923c 50%,#f97316 70%,transparent)",
            }}
          />
          <div
            className="f-diamond absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45"
            style={{ background: "#f97316" }}
          />
        </div>

        {/* ── Bottom Section ── */}
        <div className="f-bottom flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <p className="text-center md:text-left">{t("footer.copyright")}</p>

          {/* Back to Top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="f-back-top group flex items-center gap-2 px-4 py-1.5 rounded-full font-medium transition-all duration-300 hover:text-white hover:shadow-md"
            style={{
              color: "var(--color-primary, #f97316)",
              border: "1px solid rgba(249,115,22,0.3)",
              background: "rgba(249,115,22,0.06)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg,#f97316,#ea580c)";
              e.currentTarget.style.borderColor = "transparent";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(249,115,22,0.06)";
              e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)";
            }}
          >
            <span>Back to Top</span>
            <svg
              className="f-arrow w-4 h-4"
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
