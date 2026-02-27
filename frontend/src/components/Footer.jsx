import React from "react";
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const { t } = useTranslation();

  const services = t("footer.services", { returnObjects: true });
  const links = t("footer.links", { returnObjects: true });

  return (
    <footer className="font-poppins border-t mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* ABOUT */}
          <div>
            <h2 className="text-xl font-bold mb-4">{t("footer.aboutTitle")}</h2>
            <p className="text-gray-600 text-sm">{t("footer.aboutDesc")}</p>
          </div>

          {/* SERVICES */}
          <div>
            <h2 className="text-xl font-bold mb-4">
              {t("footer.servicesTitle")}
            </h2>
            <ul className="space-y-2 text-gray-600 text-sm">
              {services.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    className="hover:text-primary transition duration-200"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* LINKS */}
          <div>
            <h2 className="text-xl font-bold mb-4">{t("footer.linkTitle")}</h2>
            <ul className="space-y-2 text-gray-600 text-sm">
              {links.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    className="hover:text-primary transition duration-200"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h2 className="text-xl font-bold mb-4">
              {t("footer.contactTitle")}
            </h2>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li className="flex items-center gap-2">
                <FaPhoneAlt className="text-sm" />
                {t("footer.contactPhone")}
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-sm" />
                {t("footer.contactEmail")}
              </li>
              <li className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-sm" />
                {t("footer.contactAddress")}
              </li>
            </ul>
          </div>

          {/* LOCATION */}
          <div>
            <h2 className="text-xl font-bold mb-4">
              {t("footer.locationTitle")}
            </h2>
            <div className="w-full h-32 bg-gray-200 rounded-md overflow-hidden">
              <img
                src="https://maps.googleapis.com/maps/api/staticmap?center=Washington&zoom=13&size=300x200&key=YOUR_API_KEY"
                alt={t("footer.mapAlt")}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t my-8"></div>

        {/* Bottom Section */}
        <div className="text-center text-sm text-gray-600">
          {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
