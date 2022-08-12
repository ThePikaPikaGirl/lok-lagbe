import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { useAuth } from "./../contexts/AuthContext";

function Navbar() {
  const nav = useNavigate();
  const { redirectIfLoggedIn } = useAuth();

  const handleDashboardBtn = () => {
    async function ahem() {
      try {
        await redirectIfLoggedIn(nav, true);
      } catch (error) {
        console.log(error);
      }
    }

    ahem();
  };

  return (
    <nav className="w-full h-20 bg-gray-900 flex fixed z-50">
      <div className="flex justify-between items-center h-full w-1/2 px-8">
        <p className="text-2xl font-bold text-blue-100">Lok Lagbe</p>
      </div>

      <div className="flex items-center h-full w-1/2">
        <ul className="flex items-center justify-end h-full w-full text-white">
          <li className="text-lg px-6">
            <Link to="/">Home</Link>
          </li>
          <li className="text-lg px-6">
            <Link to="/">Services</Link>
          </li>
          <li className="text-lg px-6">
            <Link to="/">Pricing</Link>
          </li>
          <li className="text-lg px-6">
            <Link to="/">Support</Link>
          </li>
          <li className="text-lg px-6">
            <button
              type="button"
              className="flex justify-center items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all"
              onClick={handleDashboardBtn}
            >
              Go to Dashboard&nbsp;&nbsp;&nbsp;
              <FontAwesomeIcon icon={solid("sign-in-alt")} />
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
