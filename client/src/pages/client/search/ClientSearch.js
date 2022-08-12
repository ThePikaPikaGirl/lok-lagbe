import React, { useState, useRef, useEffect } from "react";
import {
  solid,
  regular,
  brands,
} from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, Link, Outlet } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import ClientSidebar from "./../../../components/client/ClientSidebar";
import ClientProfileSide from "../../../components/client/ClientProfileSide";
import "./../../../styles/scroller.css";

function ClientSearch() {
  const { currentUser, logout, getApprovedWorkersData } = useAuth();
  const [occupation, setOccupation] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    let isMounted = true;

    if (window.location.pathname === "/client/search/nurse") {
      setOccupation("nurse");
    } else if (
      window.location.pathname === "/client/search/patient-attendant"
    ) {
      setOccupation("patient-attendant");
    } else if (window.location.pathname === "/client/search/driver") {
      setOccupation("driver");
    } else if (window.location.pathname === "/client/search/homemaker") {
      setOccupation("homemaker");
    } else if (window.location.pathname === "/client/search/babysitter") {
      setOccupation("babysitter");
    } else if (window.location.pathname === "/client/search/security-guard") {
      setOccupation("security-guard");
    } else if (window.location.pathname === "/client/search/caretaker") {
      setOccupation("caretaker");
    } else {
      setOccupation("");
    }

    getApprovedWorkersData()
      .then((res) => {
        localStorage.setItem("approvedWorkers", JSON.stringify(res));

        if (
          window.location.pathname === "/client/search" ||
          window.location.pathname === "/client/search/"
        ) {
          nav("/client/search/nurse", { replace: true });
        }
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {
      isMounted = false;
    };
  }, [getApprovedWorkersData, nav, occupation]);

  return (
    <div className="h-[85%] w-[90%] flex items-center justify-center sm:bg-slate-100 overflow-hidden shadow-xl rounded-3xl">
      <ClientSidebar />

      <div className="h-full w-8/12 flex flex-col items-center bg-slate-50">
        <div className="h-[10rem] w-[95%] flex items-center justify-center">
          <FontAwesomeIcon
            icon={solid("magnifying-glass-chart")}
            className="text-center text-[2rem] text-blue-800"
          />
          <p className="text-[2rem] font-bold text-blue-800 ml-4">
            Search For Workers
          </p>
        </div>

        <div className="h-[2.5rem] w-[95%] flex-col items-center">
          <div className="flex w-full h-full items-center">
            <div
              className={`w-[14.29%] h-full flex justify-center items-center flex-shrink-0 transition-all rounded-t-xl border-x-[1px] border-white ${
                occupation === "nurse"
                  ? "bg-sky-200"
                  : "bg-sky-300 hover:-translate-y-1 hover:shadow-lg"
              }`}
            >
              <input
                type="radio"
                name="occupation"
                id="nurse"
                value="nurse"
                className="hidden"
                // checked={nurseSelected}
                // onChange={(e) => setNurseSelected(e.target.checked)}
                checked={occupation === "nurse"}
                onChange={(e) => setOccupation(e.target.value)}
                onClick={(e) => nav(e.target.value)}
              />
              <label
                htmlFor="nurse"
                className="text-md font-bold w-full h-full flex justify-center items-center cursor-pointer"
              >
                Nurse
              </label>
            </div>
            <div
              className={`w-[14.29%] h-full flex justify-center items-center flex-shrink-0 transition-all rounded-t-xl border-x-[1px] border-white ${
                occupation === "patient-attendant"
                  ? "bg-sky-200"
                  : "bg-sky-300 hover:-translate-y-1 hover:shadow-lg"
              }`}
            >
              <input
                type="radio"
                name="occupation"
                id="patient-attendant"
                value="patient-attendant"
                className="hidden"
                // checked={patientAttendantSelected}
                // onChange={(e) => setPatientAttendantSelected(e.target.checked)}
                checked={occupation === "patient-attendant"}
                onChange={(e) => setOccupation(e.target.value)}
                onClick={(e) => nav(e.target.value)}
              />
              <label
                htmlFor="patient-attendant"
                className="text-md font-bold w-full h-full flex justify-center items-center cursor-pointer"
              >
                Patient Attendant
              </label>
            </div>
            <div
              className={`w-[14.29%] h-full flex justify-center items-center flex-shrink-0 transition-all rounded-t-xl border-x-[1px] border-white ${
                occupation === "driver"
                  ? "bg-sky-200"
                  : "bg-sky-300 hover:-translate-y-1 hover:shadow-lg"
              }`}
            >
              <input
                type="radio"
                name="occupation"
                id="driver"
                value="driver"
                className="hidden"
                // checked={driverSelected}
                // onChange={(e) => setDriverSelected(e.target.checked)}
                checked={occupation === "driver"}
                onChange={(e) => setOccupation(e.target.value)}
                onClick={(e) => nav(e.target.value)}
              />
              <label
                htmlFor="driver"
                className="text-md font-bold w-full h-full flex justify-center items-center cursor-pointer"
              >
                Driver
              </label>
            </div>
            <div
              className={`w-[14.29%] h-full flex justify-center items-center flex-shrink-0 transition-all rounded-t-xl border-x-[1px] border-white ${
                occupation === "homemaker"
                  ? "bg-sky-200"
                  : "bg-sky-300 hover:-translate-y-1 hover:shadow-lg"
              }`}
            >
              <input
                type="radio"
                name="occupation"
                id="homemaker"
                value="homemaker"
                className="hidden"
                // checked={homemakerSelected}
                // onChange={(e) => setHomemakerSelected(e.target.checked)}
                checked={occupation === "homemaker"}
                onChange={(e) => setOccupation(e.target.value)}
                onClick={(e) => nav(e.target.value)}
              />
              <label
                htmlFor="homemaker"
                className="text-md font-bold w-full h-full flex justify-center items-center cursor-pointer"
              >
                Homemaker
              </label>
            </div>
            <div
              className={`w-[14.29%] h-full flex justify-center items-center flex-shrink-0 transition-all rounded-t-xl border-x-[1px] border-white ${
                occupation === "babysitter"
                  ? "bg-sky-200"
                  : "bg-sky-300 hover:-translate-y-1 hover:shadow-lg"
              }`}
            >
              <input
                type="radio"
                name="occupation"
                id="babysitter"
                value="babysitter"
                className="hidden"
                // checked={babysitterSelected}
                // onChange={(e) => setBabysitterSelected(e.target.checked)}
                checked={occupation === "babysitter"}
                onChange={(e) => setOccupation(e.target.value)}
                onClick={(e) => nav(e.target.value)}
              />
              <label
                htmlFor="babysitter"
                className="text-md font-bold w-full h-full flex justify-center items-center cursor-pointer"
              >
                Babysitter
              </label>
            </div>
            <div
              className={`w-[14.29%] h-full flex justify-center items-center flex-shrink-0 transition-all rounded-t-xl border-x-[1px] border-white ${
                occupation === "security-guard"
                  ? "bg-sky-200"
                  : "bg-sky-300 hover:-translate-y-1 hover:shadow-lg"
              }`}
            >
              <input
                type="radio"
                name="occupation"
                id="security-guard"
                value="security-guard"
                className="hidden"
                // checked={securityGuardSelected}
                // onChange={(e) => setSecurityGuardSelected(e.target.checked)}
                checked={occupation === "security-guard"}
                onChange={(e) => setOccupation(e.target.value)}
                onClick={(e) => nav(e.target.value)}
              />
              <label
                htmlFor="security-guard"
                className="text-md font-bold w-full h-full flex justify-center items-center cursor-pointer"
              >
                Security Guard
              </label>
            </div>
            <div
              className={`w-[14.29%] h-full flex justify-center items-center flex-shrink-0 transition-all rounded-t-xl border-x-[1px] border-white ${
                occupation === "caretaker"
                  ? "bg-sky-200"
                  : "bg-sky-300 hover:-translate-y-1 hover:shadow-lg"
              }`}
            >
              <input
                type="radio"
                name="occupation"
                id="caretaker"
                value="caretaker"
                className="hidden"
                // checked={caretakerSelected}
                // onChange={(e) => setCaretakerSelected(e.target.checked)}
                checked={occupation === "caretaker"}
                onChange={(e) => setOccupation(e.target.value)}
                onClick={(e) => nav(e.target.value)}
              />
              <label
                htmlFor="caretaker"
                className="text-md font-bold w-full h-full flex justify-center items-center cursor-pointer"
              >
                Caretaker
              </label>
            </div>
          </div>
        </div>

        <Outlet />
      </div>

      <ClientProfileSide />
    </div>
  );
}

export default ClientSearch;
