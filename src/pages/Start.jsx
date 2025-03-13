import React, { useEffect } from "react";
import BgImage from "../assets/start-bg.png";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Cookies from "js-cookie";

function Start() {
  const navigate = useNavigate();
  const token = Cookies.get("token");

  useEffect(() => {
    if (token) {
      navigate("/home");
    } else {
      navigate("/");
    }
  }, [token]);

  return (
    <div className=" flex flex-col items-center min-h-dvh max-h-dvh bg-[#13161c] px-6 py-10  overflow-hidden font-display">
      <Header />

      <div className="relative flex flex-col flex-grow items-center gap-6 mt-[50px] pb-40 w-full max-w-sm text-center">
        <div>
          <h2 className="font-semibold text-white text-2xl">
            Sizning orzuingizdagi taksi
          </h2>
          <p className="opacity-70 mt-2 font-medium text-white text-base">
            Shaharlar bo'ylab qulay sayohatlar
          </p>
        </div>

        <div className="bottom-0 left-1/2 absolute flex justify-center items-center w-full max-w-xs -translate-x-1/2 transform">
          <img
            src={BgImage}
            alt="Background"
            className="-bottom-11 -z-10 absolute w-[250px] h-auto"
          />
        </div>

        <div className="flex flex-col gap-9 items-center w-full">
          <Link
            to="/login"
            type="button"
            className="bottom-11 z-10 absolute border-2 border-[#FCE000] bg-[#13161ccc] bg-gradient-to-r py-3 rounded-lg w-4/5 font-semibold text-[#FCE000] active:scale-95 transition-[0.3s] cursor-pointer"
          >
            Kirish
          </Link>
          <Link
            to="/register"
            className={
              "-bottom-3 z-10 absolute font-medium rounded-md  text-black py-3 bg-[#FCE000] w-4/5 text-base"
            }
          >
            Ro'yxatdan o'tish
          </Link>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Start);
