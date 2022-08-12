import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Private({ componentToHide: Component }) {
  // const { currentUser, checkSessionValidity, logout } = useAuth();
  const { currentUser, checkSessionValidity, logout } = useAuth();
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkSession() {
      setAuthenticated(false);

      if (!currentUser) {
        if (localStorage.getItem("x-access-token") !== null) {
          localStorage.removeItem("x-access-token");
        }

        navigate("/login", { replace: true });
      }

      let token = localStorage.getItem("x-access-token");

      if (token !== null) {
        try {
          let valid = await checkSessionValidity(token);

          if (!valid) {
            localStorage.removeItem("x-access-token");
            logout();
            navigate("/login", { replace: true });
          } else {
            setAuthenticated(true);
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        logout();
        navigate("/login", { replace: true });
      }
    }

    checkSession();
  }, [logout, navigate, currentUser, checkSessionValidity]);

  return authenticated ? (
    <Component />
  ) : (
    <div className="h-screen w-full bg-slate-200">
      {/* A loading Animation spinner */}
      <div className="absolute top-1/2 left-1/2 origin-center bg-blue-700 w-12 h-12 rounded-full"></div>
      <div className="absolute top-1/2 left-1/2 origin-center bg-blue-700 w-12 h-12 rounded-full animate-ping"></div>
    </div>
  );
}
