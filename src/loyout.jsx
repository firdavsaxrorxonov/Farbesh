import { Outlet, Navigate, } from "react-router-dom";
import Cookies from "js-cookie";

const Layouts = () => {
  const token = Cookies.get("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    <Outlet />
  );
};
// Layout jsx loginni tekshirish maqsadida nimaga deb o'ylab yurmaylar!!
export default Layouts;
