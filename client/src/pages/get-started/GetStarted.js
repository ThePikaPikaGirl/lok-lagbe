import React, { useState, useRef, useEffect } from "react";
import {
  solid,
  regular,
  brands,
} from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, Link, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function GetStarted() {
  const nav = useNavigate();

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    let isMounted = true;

    if (window.location.pathname === "/get-started") {
      nav("/get-started/type", { replace: true });
    }

    return () => {
      isMounted = false;
    };
  }, [nav]);

  return (
    <div className="h-screen w-screen flex items-center justify-center sm:bg-blue-800 overflow-hidden">
      <button
        className="absolute sm:text-white sm:top-8 sm:left-8 top-2 left-2 text-xl text-blue-800"
        onClick={() => nav("/")}
      >
        <FontAwesomeIcon icon={solid("chevron-left")} />{" "}
        <FontAwesomeIcon icon={solid("home-alt")} />
      </button>

      <Outlet />
    </div>
  );
}

export default GetStarted;
