import React from "react";
import { useTranslation } from "react-i18next";

const Loading = ({ message }) => {
  const { t } = useTranslation();
  return (
    <div className="loading">
      <p>{message || t("complaints.loading")}</p>
    </div>
  )
}

export default Loading;
