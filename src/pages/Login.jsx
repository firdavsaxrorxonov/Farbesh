import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import EyesOpen from "../assets/eyesOpen.svg";
import EyesClosed from "../assets/eyesClosed.svg";
import SecondHeader from "../components/SecondHeader";

function Login() {
  const [username, setUsername] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(true);
  const navigate = useNavigate();

  const normalizePhone = (input) => {
    const value = input.replace(/\D/g, ""); // faqat raqamlar

    if (value.length === 12 && value.startsWith("998")) return value;
    if (value.length === 9 && value.startsWith("9")) return "998" + value;
    if (value.length === 10 && value.startsWith("8")) return "998" + value.slice(1);

    return value;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrMsg("");

    const phoneStr = normalizePhone(username);
    const phone = phoneStr.length <= 15 ? Number(phoneStr) : null;

    if (!phone) {
      setErrMsg("Telefon raqam noto‘g‘ri");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        "https://api.aniverse.uz/auth/token/",
        {
          phone: phone,
          password: pwd,
        },
        {
          headers: { "Content-Type": "application/json" },
          // withCredentials: true ← bu qatorni olib tashlang!
        }
      );


      const accessToken = data?.access || data?.key;
      const refreshToken = data?.refresh;

      if (accessToken) Cookies.set("access_token", accessToken);
      if (refreshToken) Cookies.set("refresh_token", refreshToken);

      navigate("/home");
    } catch (err) {
      if (err.response?.data?.detail) {
        setErrMsg(err.response.data.detail);
      } else {
        setErrMsg("Telefon raqam yoki parol noto‘g‘ri");
      }
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="relative flex flex-col items-center bg-[#fff] px-6 py-10 min-h-screen overflow-hidden font-display">
      <SecondHeader />
      <div className="flex flex-col justify-center items-center mt-[20px] mr-[40px] ml-[40px] w-full">
        <h1 className="mb-[20px] font-bold text-xl text-center">Tizimga kirish</h1>
        <p className={`${errMsg ? "text-red-500" : "hidden"}`}>{errMsg}</p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-[12px] mt-5 w-full max-w-md select-none"
        >
          <label className="relative flex flex-col gap-[7px] text-[14px]">
            Telefon raqamingiz:
            <input
              type="tel"
              inputMode="numeric"
              maxLength={12}
              className="bg-white shadow-sm px-3 py-2 border focus:border-[#FCE000] rounded-md outline-none focus:ring-0 w-full font-medium text-[#0C0E16] placeholder:text-[#4a4b4e9f] text-sm transition-all[0.4s]"
              placeholder="998901234567"
              value={username}
              onChange={(e) => {
                const formatted = e.target.value.replace(/[^\d]/g, ""); // faqat raqam
                setUsername(formatted);
                setErrMsg("");
              }}
              required
            />
          </label>

          <label className="relative flex flex-col gap-[7px] text-[14px]">
            Parolni kiriting:
            <input
              className="bg-white shadow-sm px-3 py-2 border focus:border-[#FCE000] rounded-md outline-none focus:ring-0 w-full font-medium text-[#0C0E16] placeholder:text-[#4a4b4e9f] text-sm transition-all[0.4s]"
              placeholder="Parol"
              type={show ? "password" : "text"}
              value={pwd}
              onChange={(e) => {
                setPwd(e.target.value);
                setErrMsg("");
              }}
              required
            />
            <img
              onClick={() => setShow(!show)}
              className="right-[14px] bottom-2 z-10 absolute w-[20px] cursor-pointer"
              src={show ? EyesOpen : EyesClosed}
              alt="toggle"
            />
          </label>

          <button
            type="submit"
            className="bg-[#FCE000] mt-[10px] px-3 py-2 rounded-md w-full font-medium active:scale-95 transition-[0.3s] cursor-pointer"
            disabled={loading}
          >
            {loading ? "Yuklanmoqda..." : "Jo'natish"}
          </button>

          <p className="font-medium text-[12px] text-center">
            Hisobingiz yo'qmi?{" "}
            <Link to={"/register"} className="text-[#FCE000] underline">
              Roʻyxatdan oʻtish
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default React.memo(Login);
