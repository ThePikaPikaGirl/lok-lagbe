import React, { useState, useRef, useEffect } from "react";
import {
  solid,
  regular,
  brands,
} from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, Link, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Client() {
  const nav = useNavigate();

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    let isMounted = true;

    if (
      window.location.pathname === "/client" ||
      window.location.pathname === "/client/"
    ) {
      nav("/client/dashboard", { replace: true });
    }

    return () => {
      isMounted = false;
    };
  }, [nav]);

  return (
    <div className="h-screen w-screen flex items-center justify-center sm:bg-slate-200">
      <Outlet />
    </div>
  );
}

export default Client;
