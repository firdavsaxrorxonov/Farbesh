import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Layouts = () => {
  const navigate = useNavigate();
  const token = Cookies.get("access_token");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token]);

  return <Outlet />;
};

export default Layouts;
