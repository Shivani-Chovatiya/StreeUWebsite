import React from "react";
import { useTranslation } from "react-i18next";

const ContactUs = () => {
  const { t } = useTranslation();

  return <div>{t("header.contact")}</div>;
};

export default ContactUs;
