import React, { useRef, useState, useEffect } from "react";
import {
  solid,
  regular,
  brands,
} from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "./../contexts/AuthContext";

function PasswordReset() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();

  const nav = useNavigate();

  const { resetPassword } = useAuth();

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    let isMounted = true;

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;

    try {
      setError("");
      setSuccess("");
      setLoading(true);
      await resetPassword(email);
      setSuccess("Password reset email sent! Please check your email.");
      alert("Password reset email sent! Please check your email.");
    } catch (error) {
      setError(error.message);
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center sm:bg-blue-800">
      <button
        className="absolute sm:text-white sm:top-8 sm:left-8 top-2 left-2 text-xl text-blue-800"
        onClick={() => nav("/")}
      >
        <FontAwesomeIcon icon={solid("chevron-left")} />{" "}
        <FontAwesomeIcon icon={solid("home-alt")} />
      </button>

      <div className="bg-sky-100 sm:h-3/6 lg:w-4/12 md:w-6/12 sm:w-8/12 h-full w-full sm:rounded-3xl sm:shadow-2xl flex items-center flex-col sm:overflow-hidden overflow-scroll">
        <div className="w-11/12 h-2/6 flex items-center justify-center">
          <p className="sm:text-3xl text-2xl text-sky-500 font-bold text-center">
            Reset Your Password for{" "}
            <span className="text-blue-600">Lok Lagbe</span>
          </p>
        </div>
        <div className="w-11/12 h-3/6">
          <form
            className="h-full w-full flex flex-col items-center"
            onSubmit={handleSubmit}
          >
            {/* Email */}
            <div className="w-11/12 h-3/6 flex flex-col justify-center my-2">
              <label
                htmlFor="email"
                className="font-bold text-blue-600 sm:text-xl my-2"
              >
                <FontAwesomeIcon icon={solid("at")} /> Your Registered
                Email&#58;
              </label>

              <input
                type="email"
                id="email"
                className="w-full h-10 rounded-md px-3 border border-gray-400 outline-none focus:border-sky-500 focus:border-2 transition-all"
                placeholder="someone@email.com"
                ref={emailRef}
                required
              />
            </div>

            {/* Submit */}
            <div className="w-11/12 h-3/6 flex flex-col justify-center my-2">
              <button
                type="submit"
                className="w-full h-12 rounded-md bg-blue-500 font-bold text-white outline-none my-2 hover:bg-blue-600 transition-all"
              >
                <FontAwesomeIcon icon={solid("envelope")} />
                &nbsp;&nbsp;Send Reset Mail
              </button>

              <Link to="/login" className="text-blue-500 sm:text-lg">
                Remembered your password?{" "}
                <span className="font-bold">Try Login Again</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PasswordReset;
