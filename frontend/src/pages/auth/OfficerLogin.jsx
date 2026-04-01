import Login from "./Login";
import { useTranslation } from "react-i18next";

const OfficerLogin = () => {
  const { t } = useTranslation();

  if (!t) return null;

  return <Login title={t("auth.officer_login")} role="Officer" />;
};

export default OfficerLogin;