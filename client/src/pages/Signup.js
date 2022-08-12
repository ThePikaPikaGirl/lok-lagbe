import React, { useState, useRef, useEffect } from "react";
import {
  solid,
  regular,
  brands,
} from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./../contexts/AuthContext";

function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const agreementRef = useRef();
  const {
    signupWithMail,
    createUserSession,
    loginWithGoogle,
    loginWithFacebook,
    totpVerify,
    fetchUserData,
    redirectIfLoggedIn,
  } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passVisibility, setPassVisibility] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    let isMounted = true;
    document.title = "Lok Lagbe | Sign Up";

    async function ahem() {
      try {
        await redirectIfLoggedIn(nav);
      } catch (error) {
        console.log(error);
      }
    }

    ahem();

    return () => {
      isMounted = false;
    };
  }, [nav, redirectIfLoggedIn]);

  const askForToken = async (userData) => {
    try {
      const token = prompt(
        "Type the One-time Code that gets visible in Google Authenticator App:"
      );

      const isVerified = await totpVerify(userData.locator, token);

      if (isVerified) {
        alert("You are verified! Logging you in...");

        return true;
      } else {
        alert("For some reason, you are not verified. Please try again.");

        return false;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const password = passwordRef.current.value;
    const passwordConfirmation = passwordConfirmationRef.current.value;
    const agreement = agreementRef.current.checked;

    if (password !== passwordConfirmation) {
      return setError("Passwords do not match");
    }

    // if (password.length < 8) {
    //   return setError("Password must be at least 8 characters");
    // }

    // if (password.search(/[a-z]/i) < 0) {
    //   return setError("Password must contain at least one letter");
    // }

    // if (password.search(/[0-9]/) < 0) {
    //   return setError("Password must contain at least one digit");
    // }

    // if (password.search(/[A-Z]/) < 0) {
    //   return setError("Password must contain at least one uppercase letter");
    // }

    // if (password.search(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/) < 0) {
    //   return setError(
    //     "Password must contain at least one special character:\n!@#$%^&*()_+-=[]{};':\"\\|,.<>/?"
    //   );
    // }

    if (!agreement) {
      return setError("You must agree to the terms and conditions");
    }

    try {
      setError("");
      setLoading(true);
      await signupWithMail(emailRef.current.value, passwordRef.current.value);
      await createUserSession();
      nav("/get-started/type");
    } catch (error) {
      console.log(error);

      setError(error.message);
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");
      setLoading(true);
      await loginWithGoogle();

      const userData = await fetchUserData();

      if (userData) {
        setError("Looks like you are registered already!");
        alert(
          "Looks like you are registered already! However, we can walk you through the process of logging in..."
        );

        const canLogin = await askForToken(userData);

        if (canLogin) {
          await createUserSession();
          nav(`/${userData.role}/dashboard`);
        }
      } else {
        await createUserSession();
        nav("/get-started/type");
      }
    } catch (error) {
      setError(error.message);
      console.log(error);
    }

    setLoading(false);
  };

  const handleFacebookLogin = async () => {
    try {
      setError("");
      setLoading(true);
      await loginWithFacebook();

      const userData = await fetchUserData();

      if (userData) {
        setError("Looks like you are registered already!");
        alert(
          "Looks like you are registered already! However, we can walk you through the process of logging in..."
        );

        const canLogin = await askForToken(userData);

        if (canLogin) {
          await createUserSession();
          nav(`/${userData.role}/dashboard`);
        }
      } else {
        await createUserSession();
        nav("/get-started/type");
      }
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

      <div className="bg-sky-100 sm:h-[62rem] lg:w-4/12 md:w-6/12 sm:w-8/12 h-full w-full sm:rounded-3xl sm:shadow-2xl flex items-center flex-col sm:overflow-hidden overflow-scroll">
        <div className="w-11/12 h-[9rem] flex items-center justify-center">
          <p className="sm:text-3xl text-2xl text-sky-500 font-bold text-center">
            Register for <span className="text-blue-600">Lok Lagbe</span> App
          </p>
        </div>

        <div className="w-11/12 h-[50rem]">
          <form
            className="h-full w-full flex flex-col items-center"
            onSubmit={handleSubmit}
          >
            {/* Email */}
            <div className="w-11/12 h-[9rem] flex flex-col justify-center my-2">
              <label
                htmlFor="email"
                className="font-bold text-blue-600 sm:text-xl my-2"
              >
                <FontAwesomeIcon icon={solid("at")} /> Email&#58;
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

            {/* Passwords */}
            <div className="w-11/12 h-[15rem] flex flex-col justify-center my-2">
              <label
                htmlFor="password"
                className="font-bold text-blue-600 sm:text-xl my-2"
              >
                <FontAwesomeIcon icon={solid("lock")} /> Password&#58;
              </label>

              <input
                type={passVisibility ? "text" : "password"}
                id="password"
                className="w-full h-10 rounded-md px-3 border border-gray-400 outline-none focus:border-sky-500 focus:border-2 transition-all mb-4"
                placeholder="**********"
                ref={passwordRef}
                required
              />

              <label
                htmlFor="confpassword"
                className="font-bold text-blue-600 sm:text-xl my-2"
              >
                <FontAwesomeIcon icon={solid("square-check")} /> Confirm
                Password&#58;
              </label>

              <input
                type={passVisibility ? "text" : "password"}
                id="confpassword"
                className="w-full h-10 rounded-md px-3 border border-gray-400 outline-none focus:border-sky-500 focus:border-2 transition-all"
                placeholder="**********"
                ref={passwordConfirmationRef}
                required
              />

              <div className="flex flex-row items-center w-full h-14">
                <input
                  type="checkbox"
                  id="showpass"
                  className="sm:p-3 sm:rounded-md rounded-sm mx-2 text-blue-600 hidden"
                  onClick={() => setPassVisibility(!passVisibility)}
                />
                <label
                  htmlFor="showpass"
                  className="text-blue-600 sm:text-xl my-2 cursor-pointer select-none"
                >
                  <FontAwesomeIcon
                    icon={
                      passVisibility ? regular("eye") : regular("eye-slash")
                    }
                  />{" "}
                  {passVisibility ? "Hide" : "Show"} Passwords
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="w-11/12 h-1/6 flex flex-col justify-center my-2">
              <p className="text-blue-500 sm:text-md flex items-center">
                <input
                  type="checkbox"
                  id="agree"
                  className="sm:p-2 rounded-sm mx-2 text-blue-600"
                  ref={agreementRef}
                />
                <label htmlFor="agree">
                  I agree to the&nbsp;
                  <span className="font-bold">Terms and Conditions</span>
                </label>
              </p>

              <button
                type="submit"
                className="w-full h-12 rounded-md bg-blue-500 font-bold text-white outline-none my-2 hover:bg-blue-600 transition-all"
              >
                <FontAwesomeIcon icon={solid("sign-in-alt")} /> Register
              </button>

              <Link className="text-blue-500 sm:text-lg" to="/login">
                Already have an account yet?{" "}
                <span className="font-bold">Login</span>
              </Link>
            </div>

            {/* Other Login Methods */}
            <div className="w-11/12 h-2/6 flex flex-col justify-center my-2">
              <div className="w-full h-1 flex flex-col justify-center bg-gray-300 my-4"></div>

              <p className="text-blue-500 sm:text-lg">
                Alternatively, you can register with&#46;&#46;&#46;
              </p>
              <button
                type="button"
                className="w-full h-12 rounded-md bg-sky-500 font-bold text-white outline-none my-2 hover:bg-sky-600 transition-all"
                onClick={() => handleGoogleLogin()}
              >
                <FontAwesomeIcon icon={brands("google")} /> Sign Up with Google
              </button>
              <p className="text-blue-500 sm:text-lg text-center">
                or&#46;&#46;&#46;
              </p>
              <button
                type="button"
                className="w-full h-12 rounded-md bg-blue-500 font-bold text-white outline-none my-2 hover:bg-blue-600 transition-all"
                onClick={() => handleFacebookLogin()}
              >
                <FontAwesomeIcon icon={brands("facebook")} /> Sign Up with
                Facebook
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
