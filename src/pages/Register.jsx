import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import EyesOpen from "../assets/eyesOpen.svg";
import EyesClosed from "../assets/eyesClosed.svg";
import SecondHeader from "../components/SecondHeader";

function Register() {
  const [show1, setShow1] = useState(true);
  const [phone, setPhone] = useState("+998");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Token borligini tekshirish
  useEffect(() => {
    const accessToken = Cookies.get("access_token");
    if (accessToken) {
      navigate("/home");
    }
  }, [navigate]);

  const PHONE_REGEX = /^\+998\d{9}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[0-9]).{8,24}$/;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!PHONE_REGEX.test(phone)) {
      setError("Telefon raqami +998 bilan boshlanib, jami 13 ta belgidan iborat bo‘lishi kerak.");
      return;
    }

    if (!PWD_REGEX.test(password)) {
      setError("Parol kamida 8 ta belgidan iborat bo‘lishi, kichik harf va raqamlarni o‘z ichiga olishi kerak.");
      return;
    }

    setLoading(true);
    axios
      .post("https://api.aniverse.uz/auth/register/", {
        phone: phone.replace("+", ""),
        password: password,
      })
      .then((response) => {
        const accessToken = response?.data?.data?.token?.access;
        const refreshToken = response?.data?.data?.token?.refresh;

        if (accessToken) {
          Cookies.set("access_token", accessToken);
        }
        if (refreshToken) {
          Cookies.set("refresh_token", refreshToken);
        }

        navigate("/home");
        setPhone("+998");
        setPassword("");
        setError("");
        setLoading(false);
      })
      .catch((error) => {
        const status = error.response?.status;
        const errData = error.response?.data;
        let firstError = " Bu foydalanuvchi allaqachon royhatdan o'tgan";

        if (status === 400 && errData) {
          if (typeof errData === "string") {
            firstError = errData;
          } else if (errData.detail) {
            firstError = errData.detail;
          } else if (typeof Object.values(errData)[0] === "string") {
            firstError = Object.values(errData)[0];
          } else if (Array.isArray(Object.values(errData)[0])) {
            firstError = Object.values(errData)[0][0];
          }
        }

        setError(firstError);
        setLoading(false);
      });

  };

  return (
    <div className="relative flex flex-col items-center bg-[#fff] px-6 py-10 min-h-screen overflow-hidden font-display">
      <SecondHeader />
      <div className="flex flex-col justify-center items-center mt-5 w-full max-w-md">
        <h1 className="mb-5 font-bold text-xl text-center">Roʻyxatdan oʻtish</h1>
        <form
          className="flex flex-col gap-[12px] mt-5 w-full max-w-md select-none"
          onSubmit={handleSubmit}
        >
          <label className="relative flex flex-col gap-[7px] text-[14px]">
            Telefon raqamingizni kiriting:
            <input
              type="text"
              placeholder="+998901234567"
              className="bg-white shadow-sm px-3 py-2 border focus:border-[#FCE000] rounded-md outline-none focus:ring-0 w-full font-medium text-[#0C0E16] placeholder:text-[#4a4b4e9f] text-sm transition-all[0.4s]"
              value={phone}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\+998\d{0,9}$/.test(val)) {
                  setPhone(val);
                }
              }}
              required
            />
          </label>

          <label className="relative flex flex-col gap-[7px] text-[14px]">
            Parolni kiriting:
            <input
              type={!show1 ? "text" : "password"}
              placeholder="Parol"
              className="bg-white shadow-sm px-3 py-2 border focus:border-[#FCE000] rounded-md outline-none focus:ring-0 w-full font-medium text-[#0C0E16] placeholder:text-[#4a4b4e9f] text-sm transition-all[0.4s]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <img
              onClick={() => setShow1(!show1)}
              className="right-[14px] bottom-2 z-10 absolute w-[20px] cursor-pointer"
              src={show1 ? EyesOpen : EyesClosed}
              alt="Toggle password visibility"
            />
          </label>

          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="bg-[#FCE000] mt-[10px] px-3 py-2 rounded-md w-full font-medium active:scale-95 transition-[0.3s] cursor-pointer"
          >
            {loading ? "Yuborilmoqda..." : "Jo'natish"}
          </button>
          <p className="font-medium text-[12px] text-center">
            Allaqachon hisobingiz bormi?{" "}
            <Link to="/login" className="text-[#FCE000] underline">Tizimga kirish</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default React.memo(Register);
