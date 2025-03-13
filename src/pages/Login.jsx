import React, { useState } from "react";
import Header from "../components/Header";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import EyesOpen from "../assets/eyesOpen.svg";
import EyesClosed from "../assets/eyesClosed.svg";

function Login() {
  const [username, setUsername] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(true);
  const riderict = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const isEmail = username.includes("@");
    const payload = {
      password: pwd,
      ...(isEmail ? { email: username } : { username: username }),
    };
    console.log(isEmail ? username: "username buu");


    try {
      const { data } = await axios.post(
        "https://farbesh.up.railway.app/api/auth/login",
        payload,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (data.key) {
        Cookies.set("token", data.key);
        riderict("/home");
      }
    } catch(err) {
      console.log(err.response?.data);

      setErrMsg("Foydalanuvchi nomi yoki parol notog'ri");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex flex-col items-center bg-[#fff] px-6 py-10 min-h-screen overflow-hidden font-display">
      <Header />

      <div className="flex flex-col justify-center items-center mt-[20px] mr-[40px] ml-[40px] w-full">
        <h1 className="mb-[20px] font-bold text-xl text-center">
          Tizimga kirish
        </h1>
        <p className={`${errMsg ? "text-red-500" : "hidden"}`}>{errMsg}</p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-[12px] mt-5 w-full max-w-md select-none"
        >
          <label className="relative flex flex-col gap-[7px] text-[14px]">
            Foydalanuvchi nomi yoki emailni kiriting:
            <input
              className="bg-white shadow-sm px-3 py-2 border focus:border-[#FCE000] rounded-md outline-none focus:ring-0 w-full font-medium text-[#0C0E16] placeholder:text-[#0C0E16] text-sm transition-all[0.4s]"
              placeholder="Foydalanuvchi nomi yoki email"
              type="text"
              required
              onChange={(e) => {
                setUsername(e.target.value);
                setErrMsg("");
              }}
            />
          </label>

          <label className="relative flex flex-col gap-[7px] text-[14px]">
            Parolni kiriting:
            <input
              className="bg-white shadow-sm px-3 py-2 border focus:border-[#FCE000] rounded-md outline-none focus:ring-0 w-full font-medium text-[#0C0E16] placeholder:text-[#0C0E16] text-sm transition-all[0.4s]"
              placeholder="Parol"
              type={show ? "password" : "text"}
              required
              onChange={(e) => {
                setPwd(e.target.value);
                setErrMsg("");
              }}
            />
            <img
              onClick={() => setShow(!show)}
              className="right-[14px] bottom-2 z-10 absolute w-[20px] cursor-pointer"
              src={show ? EyesOpen : EyesClosed}
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
