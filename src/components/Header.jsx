import React from "react";
import Logo from "../assets/F5-logo.png";
import InfoIcon from "../assets/infoIcon.svg";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="flex justify-between items-center mx-auto pb-6 border-[#737371] border-b w-full max-w-md select-none">
      <Link to={"/home"} className="flex items-center gap-2 text-[#FCE000] text-xl">
        <img src={Logo} className="rounded-full w-12 h-12" alt="FarBesh Logo" />
        <h1 className="font-bold">Farbesh Go</h1>
      </Link>
      <img src={InfoIcon} className="w-5 h-5" alt="Information" />
    </header>
  );
}

export default Header;
