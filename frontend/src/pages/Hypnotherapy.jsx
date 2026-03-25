import React from "react";
import { useTranslation } from "react-i18next";

const Hypnotherapy = () => {
  const { t } = useTranslation();

  return <div>{t("header.hypnotherapy")}</div>;
};

export default Hypnotherapy;
