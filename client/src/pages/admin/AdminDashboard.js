import React, { useState, useRef, useEffect } from "react";
import {
  solid,
  regular,
  brands,
} from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AdminSidebar from "./../../components/admin/AdminSidebar";
import AdminProfileSide from "./../../components/admin/AdminProfileSide";

function AdminDashboard() {
  const [greeting, setGreeting] = useState("Hello");
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    let isMounted = true;

    const todayDate = new Date();
    let hours = todayDate.getHours();

    if (hours < 12) {
      setGreeting("Good Morning");
    } else if (hours >= 12 && hours < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="h-[85%] w-[90%] flex items-center justify-center sm:bg-slate-100 overflow-hidden shadow-xl rounded-3xl">
      <AdminSidebar />

      <div className="h-full w-8/12 flex flex-col items-center bg-slate-50">
        <div className="h-[12rem] w-11/12 flex items-center">
          <h1 className="text-[2.5rem] font-bold">
            {greeting}, {currentUser.displayName}!
          </h1>
        </div>

        <div className="h-[15rem] w-11/12 flex justify-center">
          <div className="h-full w-3/12 mx-6 bg-gradient-to-br from-sky-500 to-indigo-500 rounded-2xl">
            <figure className="h-full w-full flex flex-col text-center items-center justify-center">
              <FontAwesomeIcon
                icon={solid("users")}
                className="text-center text-white text-4xl"
              />
              <p className="text-white font-bold text-2xl mb-4">
                Number of Users
              </p>
              <figcaption className="text-white text-3xl">824</figcaption>
            </figure>
          </div>

          <div className="h-full w-3/12 mx-6 bg-gradient-to-tl from-violet-500 to-fuchsia-500 rounded-2xl">
            <figure className="h-full w-full flex flex-col text-center items-center justify-center">
              <FontAwesomeIcon
                icon={solid("hourglass")}
                className="text-center text-white text-4xl"
              />
              <p className="text-white font-bold text-2xl mb-4">
                Pending Approvals
              </p>
              <figcaption className="text-white text-3xl">27</figcaption>
            </figure>
          </div>

          <div className="h-full w-3/12 mx-6 bg-gradient-to-tl from-purple-500 to-pink-500 rounded-2xl">
            <figure className="h-full w-full flex flex-col text-center items-center justify-center">
              <FontAwesomeIcon
                icon={solid("life-ring")}
                className="text-center text-white text-4xl"
              />
              <p className="text-white font-bold text-2xl mb-4">
                Support Seekers
              </p>
              <figcaption className="text-white text-3xl">3</figcaption>
            </figure>
          </div>
        </div>
      </div>

      <AdminProfileSide />
    </div>
  );
}

export default AdminDashboard;
