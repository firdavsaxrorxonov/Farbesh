import React, { useState, useEffect, useRef } from "react";
import MapComponent from "../components/MapComponent";
import Location from "../assets/location.png";
import navBurger from "../assets/burger.svg";
import { AiOutlineClose } from "react-icons/ai";
import LogOut from "../assets/logout.png";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { IoTime } from "react-icons/io5";

function Home() {
  const [userLocation, setUserLocation] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenUl, setOpenUl] = useState(false);
  const [phone, setPhone] = useState("");
  const [route, setRoute] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passengerCount, setPassengerCount] = useState("");
  const [gender, setGender] = useState("");
  const phoneRef = useRef("");
  const [isOrderButtonDisabled, setIsOrderButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const token = Cookies.get("access_token");

  useEffect(() => {
    if (gender === "other") {
      setPassengerCount(0);
    }
  }, [gender]);

  const orderData = {
    phone: `998${phone.replace(/\s|-/g, "")}`,
    location: {
      name: route,
      lat: userLocation ? userLocation[0] : null,
      long: userLocation ? userLocation[1] : null,
    },
    gender: gender === "male" ? "male" : gender === "female" ? "female" : "other",
    ...(gender !== "other" && {
      count:
        passengerCount === "1" ? "one" :
          passengerCount === "2" ? "two" :
            passengerCount === "3" ? "there" :
              passengerCount === "4" ? "four" : "",
    }),
  };


  async function handleOrderClick() {
    if (!userLocation) {
      alert("Lokatsiya aniqlanmadi. Iltimos, lokatsiyangizni tekshiring.");
      return;
    }

    if (phoneRef.current.value.length < 14) {
      alert("Telefon raqamni kiriting");
      return;
    }

    if (!route) {
      alert("Iltimos, yo'nalishni tanlang.");
      return;
    }

    if (gender !== "other" && !passengerCount) {
      alert("Iltimos, yo'lovchi sonini tanlang.");
      return;
    }


    if (!gender) {
      alert("Iltimos, jinsni tanlang.");
      return;
    }

    setIsOrderButtonDisabled(true);
    setIsLoading(true);



    await axios
      .post("https://api.aniverse.uz/order/", orderData, {
        headers: {
          Authorization: `Token ${Cookies.get("access_token")}`,
        },
      })
      .then((response) => {
        alert(
          "Sizning so'rovingiz muvaffaqiyatli yuborildi. Tez orada siz bilan bog'lanishadi! ✅"
        );
        setIsModalOpen(false);
        setRoute("");
        setPassengerCount("");
        setGender("");
        setPhone("");
        startCountdown(300);
      })
      .catch((error) => {
        alert("Xatolik yuz berdi. Qayta urinib ko‘ring.");
        setIsOrderButtonDisabled(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    const savedTime = localStorage.getItem("orderDisabledTime");

    if (savedTime) {
      const remainingTime = parseInt(savedTime, 10) - Date.now();
      if (remainingTime > 0) {
        setIsOrderButtonDisabled(true);
        setCountdown(Math.ceil(remainingTime / 1000)); // countdownni yangilash
        startCountdown(Math.ceil(remainingTime / 1000)); // countdownni davom ettirish
      } else {
        localStorage.removeItem("orderDisabledTime");
        setIsOrderButtonDisabled(false);
        setCountdown(0); // countdownni 0 ga o'rnating
      }
    }
  }, []);

  const startCountdown = (duration) => {
    let timeRemaining = duration;

    localStorage.setItem(
      "orderDisabledTime",
      Date.now() + timeRemaining * 1000
    );

    const interval = setInterval(() => {
      if (timeRemaining <= 0) {
        clearInterval(interval);
        setIsOrderButtonDisabled(false);
        setCountdown(0);
        localStorage.removeItem("orderDisabledTime");
      } else {
        setCountdown(timeRemaining);
        localStorage.setItem(
          "orderDisabledTime",
          Date.now() + timeRemaining * 1000
        );
        timeRemaining--;
      }
    }, 1000);
  };


  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => setAlertMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setAlertMessage({
            text: "Iltimos, lokatsiya funksiyasini yoqing.",
            type: "error",
          });
        } else {
          setAlertMessage({
            text: "Lokatsiya aniqlanmadi, qaytadan urinib ko‘ring.",
            type: "error",
          });
        }
      }
    );
  }, []);

  const handleLocation = () => {
    if (!navigator.geolocation) {
      setAlertMessage({
        text: "Geolokatsiya funksiyasi qo‘llab-quvvatlanmaydi.",
        type: "error",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setAlertMessage({
            text: "Iltimos, lokatsiya funksiyasini yoqing.",
            type: "error",
          });
        } else {
          setAlertMessage({
            text: "Lokatsiya aniqlanmadi, qaytadan urinib ko‘ring.",
            type: "error",
          });
        }
      }
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpenUl && !event.target.closest(".menu-container")) {
        setOpenUl(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpenUl]);

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.startsWith("998")) {
      value = value.slice(3);
    }

    value = value.slice(0, 9);

    let formatted = "";
    if (value.length > 7) {
      formatted = `${value.slice(0, 2)} ${value.slice(2, 5)}-${value.slice(
        5,
        7
      )}-${value.slice(7)}`;
    } else if (value.length > 5) {
      formatted = `${value.slice(0, 2)} ${value.slice(2, 5)}-${value.slice(5)}`;
    } else if (value.length > 2) {
      formatted = `${value.slice(0, 2)} ${value.slice(2)}`;
    } else {
      formatted = value;
    }

    setPhone(formatted);
  };

  return (
    <div className="relative flex flex-col bg-gray-100 mx-auto max-w-md h-dvh font-display">
      <div
        className={`transition ${isModalOpen ? "blur-sm pointer-events-none" : ""
          }`}
      >
        <button
          onClick={(event) => {
            event.stopPropagation();
            setOpenUl(!isOpenUl);
          }}
          className="top-8 left-6 z-1 absolute bg-white shadow-md p-3 rounded-full active:scale-95 transition-all duration-300 cursor-pointer select-none"
        >
          <img src={navBurger} alt="" className="w-6 h-6" />
        </button>
        <div>
          <MapComponent userLocation={userLocation} />
        </div>
        <div className="bottom-0 z-20 absolute bg-white shadow-xl px-4 py-6 rounded-tl-3xl rounded-tr-3xl w-full h-full max-h-[220px] transition-transform duration-300 ease-in-out">
          <div className="flex justify-center items-center">
            <button
              className="bottom-28 absolute flex items-center gap-2 bg-white px-20 py-3 border-2 border-black rounded-[12px] font-semibold text-black active:scale-95 transition-[0.3s] cursor-pointer"
              onClick={handleLocation}
            >
              <img src={Location} alt="" width={20} />
              Joylashuv
            </button>
          </div>
          <div className="flex justify-center items-center">
            {isOrderButtonDisabled && (
              <div className="text-white mb-10 flex gap-3 items-center justify-center absolute bg-black py-2 w-[120px] rounded-[20px] text-sm ">
                <IoTime size={24} />
                <p className="w-[38px]">
                  {`0${Math.floor(countdown / 60)}:${(countdown % 60)
                    .toString()
                    .padStart(2, "0")}`}
                </p>
              </div>
            )}
            <button
              disabled={isOrderButtonDisabled}
              className={`bottom-3 absolute bg-[#151513] px-24 py-4 mb-2 rounded-[12px] font-semibold text-white active:scale-95 transition-opacity duration-300 cursor-pointer ${isOrderButtonDisabled
                ? "opacity-50 cursor-not-allowed"
                : "opacity-100"
                }`}
              onClick={() => setIsModalOpen(true)}
            >
              Buyurtma berish
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white shadow-2xl p-6 rounded-xl w-[340px] h-auto">
            <h3 className="mb-4 font-semibold text-2xl text-center">
              Buyurtma berish
            </h3>
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <select
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                className="bg-white p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDC71] w-full text-gray-800 text-sm"
              >
                <option value="" disabled>
                  🚖 Qayerdan? - Qayerga?
                </option>
                <option value="Beshariq-Farg'ona">
                  📍 Beshariqdan - Farg‘onaga
                </option>
                <option value="Farg'ona-Beshariq">
                  📍 Farg‘onadan - Beshariqga
                </option>
              </select>

              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="bg-white p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDC71] w-full text-gray-800 text-sm"
              >
                <option value="" disabled>
                  🚻 Erkak yoki Ayol?
                </option>
                <option value="male">👨 Erkak</option>
                <option value="female">👩 Ayol</option>
                <option value="other">📦 Po'chta</option>
              </select>

              {(gender === "" || gender === "male" || gender === "female") && (
                <select
                  value={passengerCount}
                  onChange={(e) => setPassengerCount(e.target.value)}
                  className="bg-white p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDC71] w-full text-gray-800 text-sm"
                >
                  <option value="" disabled>
                    🔢 Yo‘lovchi tanlash
                  </option>
                  <option value="1">🧍 1 kishi</option>
                  <option value="2">🧑‍🤝‍🧑 2 kishi</option>
                  <option value="3">👨‍👩‍👦 3 kishi</option>
                  <option value="4">👨‍👩‍👧‍👦 4 kishi</option>
                </select>
              )}

              <input
                ref={phoneRef}
                type="text"
                value={phone ? `+998 ${phone}` : ""}
                onChange={handlePhoneChange}
                placeholder="+998 00 000-00-00"
                className="bg-white p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDC71] w-full text-gray-800 text-sm"
                maxLength={17}
              />
              <button
                onClick={handleOrderClick}
                disabled={isOrderButtonDisabled}
                className={`bg-[#151513] shadow-md py-3 rounded-[12px] w-full font-semibold text-white active:scale-95 transition-all duration-300 cursor-pointer
    ${isLoading ? "opacity-50" : "opacity-100"}`}
              >
                {isLoading ? "Yuborilmoqda..." : "Buyurtma berish"}
              </button>
            </form>
            <button
              className="top-4 right-4 absolute text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => {
                setIsModalOpen(false),
                  setRoute(""),
                  setPassengerCount(""),
                  setGender(""),
                  setPhone("");
              }}
            >
              <AiOutlineClose className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
      {isOpenUl && (
        <div className="z-60 fixed flex justify-center items-center opacity-100 mt-[50px] ml-[80px] scale-100 transition-all duration-300">
          <ul className="flex flex-col gap-[5px] bg-white px-[15px] py-[10px] rounded-md menu-container">
            <button
              onClick={() => {
                Cookies.remove("access_token");
                navigate("/");
              }}
              className="flex text-red-500 items-center gap-[12px] cursor-pointer"
            >
              <img className="ml-[5px] w-[15px]" src={LogOut} alt="" />
              Chiqish
            </button>
          </ul>
        </div>
      )}
      {alertMessage && (
        <div className={`alert ${alertMessage.type}`}>{alertMessage.text}</div>
      )}
    </div>
  );
}

export default React.memo(Home);
