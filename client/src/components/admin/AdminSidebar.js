import React, { useState, useRef, useEffect } from "react";
import {
  solid,
  regular,
  brands,
} from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function AdminSidebar() {
  const [page, setPage] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    let isMounted = true;

    if (window.location.pathname === "/admin/dashboard") {
      setPage("dashboard");
    } else if (window.location.pathname === "/admin/approvals") {
      setPage("approvals");
    } else if (window.location.pathname === "/admin/support") {
      setPage("support");
    } else if (window.location.pathname === "/admin/settings") {
      setPage("settings");
    } else {
      setPage("");
    }

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="h-full w-2/12 border-r-2">
      <div className="w-full h-[6rem] flex items-center justify-center">
        <img
          className="w-[15rem] rounded-lg select-none"
          src={require("../../assets/full_logo.png")}
          alt="logo"
          draggable="false"
        />
      </div>

      <div className="w-full h-3/6 flex flex-col items-center justify-center">
        <div
          className={`h-[5rem] w-full flex items-center cursor-pointer transition-all ${
            page === "dashboard"
              ? "bg-slate-50 border-y-2"
              : "rounded-xl hover:bg-slate-400 hover:text-white"
          }`}
          onClick={() => nav("/admin/dashboard")}
        >
          <div className="h-full w-4/12 flex justify-center items-center text-2xl">
            <FontAwesomeIcon icon={solid("home")} />
          </div>
          <p className="h-full w-8/12 flex items-center justify-start text-xl">
            Dashboard
          </p>
        </div>
        <div
          className={`h-[5rem] w-full flex items-center cursor-pointer transition-all ${
            page === "approvals"
              ? "bg-slate-50 border-y-2"
              : "rounded-xl hover:bg-slate-400 hover:text-white"
          }`}
          onClick={() => nav("/admin/approvals")}
        >
          <div className="h-full w-4/12 flex justify-center items-center text-2xl">
            <FontAwesomeIcon icon={solid("clipboard-check")} />
          </div>
          <p className="h-full w-8/12 flex items-center justify-start text-xl">
            Approvals
          </p>
        </div>
        <div
          className={`h-[5rem] w-full flex items-center cursor-pointer transition-all ${
            page === "support"
              ? "bg-slate-50 border-y-2"
              : "rounded-xl hover:bg-slate-400 hover:text-white"
          }`}
          // onClick={() => nav("/admin/support")}
        >
          <div className="h-full w-4/12 flex justify-center items-center text-2xl">
            <FontAwesomeIcon icon={solid("ticket")} />
          </div>
          <p className="h-full w-8/12 flex items-center justify-start text-xl">
            Support Centre
          </p>
        </div>
        <div
          className={`h-[5rem] w-full flex items-center cursor-pointer transition-all ${
            page === "settings"
              ? "bg-slate-50 border-y-2"
              : "rounded-xl hover:bg-slate-400 hover:text-white"
          }`}
          // onClick={() => nav("/admin/settings")}
        >
          <div className="h-full w-4/12 flex justify-center items-center text-2xl">
            <FontAwesomeIcon icon={solid("gear")} />
          </div>
          <p className="h-full w-8/12 flex items-center justify-start text-xl">
            Settings
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminSidebar;
