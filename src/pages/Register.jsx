import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import EyesOpen from "../assets/eyesOpen.svg";
import EyesClosed from "../assets/eyesClosed.svg";
import SecondHeader from "../components/SecondHeader";


function Register() {
  const [show1, setShow1] = useState(true);
  const [show2, setShow2] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Passwordni tekshirish 8 ta belgidan kam bo'lmasligi kerak
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[0-9]).{8,24}$/;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== repassword) {
      setError("Parollar mos kelmayapti!");
      return;
    }
    if (!PWD_REGEX.test(password)) {
      setError(
        "Parol kamida 8 ta belgidan iborat bo‘lishi, kichik harf va raqamlarni o‘z ichiga olishi kerak."
      );
      return;
    }

    setLoading(true);
    axios
      .post("https://farbesh.up.railway.app/api/auth/registration/", {
        username,
        email,
        password1: password,
        password2: repassword,
      })
      .then((response) => {
        console.log(response);

        Cookies.remove("token");
        Cookies.set("token", response?.data.key);
        navigate("/home");
        setUsername("");
        setEmail("");
        setPassword("");
        setRepassword("");
        setError("");
        setLoading(false);
      })
      .catch((error) => {
        if (error.response?.data.username) {
          setError(
            "Ushbu foydalanuvchi nomiga ega foydalanuvchi allaqachon mavjud."
          );
        } else if (error.response?.data.email) {
          setError("Yaroqli elektron pochta manzilini kiriting.");
        } else {
          setError("Tizimda xatolik");
        }
        setLoading(false);
      });
  };

  return (
    <div className="relative flex flex-col items-center bg-[#fff] px-6 py-10 min-h-screen overflow-hidden font-display">
      <SecondHeader />
      <div className="flex flex-col justify-center items-center mt-5 w-full max-w-md">
        <h1 className="mb-5 font-bold text-xl text-center">
          Roʻyxatdan oʻtish
        </h1>
        <form
          className="flex flex-col gap-[12px] mt-5 w-full max-w-md select-none"
          onSubmit={handleSubmit}
        >
          <label className="relative flex flex-col gap-[7px] text-[14px]">
            Ismingizni kiriting:
            <input
              type="text"
              placeholder="Ism"
              className="bg-white shadow-sm px-3 py-2 border focus:border-[#FCE000] rounded-md outline-none focus:ring-0 w-full font-medium text-[#0C0E16] placeholder:text-[#0C0E16] text-sm transition-all[0.4s]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label className="relative flex flex-col gap-[7px] text-[14px]">
            Email pochtangizni kiriting:
            <input
              type="email"
              placeholder="Email"
              className="bg-white shadow-sm px-3 py-2 border focus:border-[#FCE000] rounded-md outline-none focus:ring-0 w-full font-medium text-[#0C0E16] placeholder:text-[#0C0E16] text-sm transition-all[0.4s]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="relative flex flex-col gap-[7px] text-[14px]">
            Parolni kiriting:
            <input
              type={!show1 ? "text" : "password"}
              placeholder="Parol"
              className="bg-white shadow-sm px-3 py-2 border focus:border-[#FCE000] rounded-md outline-none focus:ring-0 w-full font-medium text-[#0C0E16] placeholder:text-[#0C0E16] text-sm transition-all[0.4s]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <img
              onClick={() => {
                setShow1(!show1);
              }}
              className="right-[14px] bottom-2 z-10 absolute w-[20px] cursor-pointer"
              src={show1 ? EyesOpen : EyesClosed}
            />
          </label>
          <label className="relative flex flex-col gap-[7px] text-[14px]">
            Parolni qayta kiriting:
            <input
              type={!show2 ? "text" : "password"}
              placeholder="Parolni tasdiqlash"
              className="bg-white shadow-sm px-3 py-2 border focus:border-[#FCE000] rounded-md outline-none focus:ring-0 w-full font-medium text-[#0C0E16] placeholder:text-[#0C0E16] text-sm transition-all[0.4s]"
              value={repassword}
              onChange={(e) => setRepassword(e.target.value)}
              required
            />
            <img
              onClick={() => {
                setShow2(!show2);
              }}
              className="right-[14px] bottom-2 z-10 absolute w-[20px] cursor-pointer"
              src={show2 ? EyesOpen : EyesClosed}
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
            <Link to="/login" className="text-[#FCE000] underline">
              Tizimga kirish
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default React.memo(Register);
