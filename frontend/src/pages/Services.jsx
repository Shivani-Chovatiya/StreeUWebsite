import React from "react";
import { useTranslation } from "react-i18next";

const Services = () => {
  const { t } = useTranslation();

  return <div>{t("header.services")}</div>;
};

export default Services;
