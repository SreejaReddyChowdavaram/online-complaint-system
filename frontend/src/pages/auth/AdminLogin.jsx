import Login from "./Login";
import { useTranslation } from "react-i18next";

const AdminLogin = () => {
  const { t } = useTranslation();

  if (!t) return null;

  return <Login title={t("auth.admin_login")} role="Admin" />;
};



export default AdminLogin;
