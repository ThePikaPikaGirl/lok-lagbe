import React, { useState, useRef, useEffect } from "react";
import {
  solid,
  regular,
  brands,
} from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import authappgp from "../../assets/authappgp.jpg";

function GetStarted2fa() {
  const [qrcode, setQRCode] = useState("");
  const [locator, setLocator] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    totpGenerateSecret,
    currentUser,
    totpVerify,
    add2faLocatorToDatabase,
  } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    let isMounted = true;

    async function ahem() {
      try {
        const { dataUrlQR, asciiLocator } = await totpGenerateSecret();

        setQRCode(dataUrlQR);
        setLocator(asciiLocator);
      } catch (err) {
        console.log(err);
      }
    }

    ahem();

    return () => {
      isMounted = false;
    };
    // console.log(gender);
  }, [totpGenerateSecret]);

  const askForToken = async () => {
    const token = prompt(
      "Type the One-time Code that gets visible in Google Authenticator App:"
    );

    try {
      const isVerified = await totpVerify(locator, token);

      if (isVerified) {
        alert("You are verified!");

        await add2faLocatorToDatabase(locator);

        if (localStorage.getItem("role") === "user") {
          localStorage.removeItem("role");
          nav("/client/dashboard");
        } else {
          localStorage.removeItem("role");
          nav("/worker/dashboard");
        }
      } else {
        alert("For some reason, you are not verified. Please try again.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-sky-100 sm:h-[59rem] lg:w-4/12 md:w-6/12 sm:w-8/12 h-full w-full sm:rounded-3xl sm:shadow-2xl flex items-center flex-col sm:overflow-hidden overflow-scroll">
      <div className="flex flex-col items-center justify-center w-9/12 h-[10rem]">
        <p className="font-bold text-3xl text-center text-blue-600">
          2FA for Better Security! 👮‍♂️
        </p>
        <p className="text-xl text-center text-slate-600">
          Let&#39;s setup 2FA!
        </p>
      </div>

      <div className="flex items-center justify-center w-9/12 h-[15rem]">
        <p className="text-xl text-slate-600">
          <span className="font-bold text-blue-600 text-3xl">Step 1:</span>
          <br />
          Download Google Authenticator app from Google Play Store
        </p>

        <img src={authappgp} alt="authappgp" className="w-1/2" />
      </div>

      <div className="flex items-center justify-center w-9/12 h-[15rem]">
        <p className="text-xl text-slate-600">
          <span className="font-bold text-blue-600 text-3xl">Step 2:</span>
          <br />
          Scan the QR code with your Google Authenticator app
        </p>

        <img src={qrcode} alt="authappgp" className="w-1/2" />
      </div>

      <div className="flex items-center justify-center w-9/12 h-[15rem]">
        <button
          className="bg-blue-600 text-white text-xl font-bold rounded-lg shadow-lg px-10 py-3 hover:bg-blue-700"
          onClick={askForToken}
        >
          Click to continue
        </button>
      </div>
    </div>
  );
}

export default GetStarted2fa;
