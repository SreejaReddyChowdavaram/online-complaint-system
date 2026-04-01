import Login from "./Login";
import { useTranslation } from "react-i18next";

const UserLogin = () => {
  const { t } = useTranslation();

  if (!t) return null;

  return <Login title={t("auth.citizen_login")} role="Citizen" />;
};

export default UserLogin;
