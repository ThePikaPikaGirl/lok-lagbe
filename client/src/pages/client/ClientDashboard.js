import React, { useState, useRef, useEffect } from "react";
import {
  solid,
  regular,
  brands,
} from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, Link, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ClientSidebar from "./../../components/client/ClientSidebar";
import ClientProfileSide from "../../components/client/ClientProfileSide";
import "./../../styles/ClientDashboard.css";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { firebaseDB, firebaseFirestore } from "./../../firebase";

function ClientDashboard() {
  const [greeting, setGreeting] = useState("Hello");
  const { currentUser, logout } = useAuth();
  const [sessionData, setSessionData] = useState({});

  useEffect(() => {
    const todayDate = new Date();
    let hours = todayDate.getHours();

    if (hours < 12) {
      setGreeting("Good Morning");
    } else if (hours >= 12 && hours < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }

    const q = firebaseFirestore.query(
      firebaseFirestore.collection(firebaseDB, "sessions"),
      firebaseFirestore.where("clientEmail", "==", currentUser.email)
    );

    const unsubscribe = firebaseFirestore.onSnapshot(q, (querySnapshot) => {
      const sessions = [];

      querySnapshot.forEach((doc) => {
        sessions.push({
          ...doc.data(),
          id: doc.id,
        });
      });

      setSessionData(sessions[0]);
    });

    return unsubscribe;
  }, [currentUser.email]);

  return (
    <div className="h-[85%] w-[90%] flex items-center justify-center sm:bg-slate-100 overflow-hidden shadow-xl rounded-3xl">
      <ClientSidebar />

      <div
        className="h-full w-8/12 flex flex-col items-center bg-slate-50 overflow-scroll scroll-smooth"
        id="panel"
      >
        <div className="h-[12rem] w-11/12 flex items-center flex-shrink-0">
          <h1 className="text-[2.5rem] font-bold">
            {greeting}, {currentUser.displayName}!
          </h1>
        </div>

        <div className="h-[40rem] w-11/12 flex flex-col flex-shrink-0">
          <p className="font-bold text-2xl mb-8">
            Your Activity Chart For This Year
          </p>

          <Line
            data={{
              labels: [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ],
              datasets: [
                {
                  label: "Your Activeness Over Time",
                  data: [50, 57, 43, 70, 72, 69, 25, 0, 0, 0, 0, 0],
                  fill: true,
                  borderColor: "rgb(26, 86, 219)",
                  tension: 0.1,
                  backgroundColor: "rgba(26, 86, 219, 0.4)",
                },
                {
                  label: "Your Needs for Workers' Support Over Time",
                  data: [10, 20, 46, 57, 65, 46, 36, 0, 0, 0, 0, 0],
                  fill: true,
                  borderColor: "rgb(200, 0, 0)",
                  tension: 0.1,
                  backgroundColor: "rgba(200, 0, 0, 0.4)",
                },
                {
                  label: "Your Avg. Ratings (out of 100) by Workers Over Time",
                  data: [
                    94.6, 95.5, 97.4, 96.1, 94.8, 94.2, 98.2, 0, 0, 0, 0, 0,
                  ],
                  fill: true,
                  borderColor: "rgb(0, 180, 100)",
                  tension: 0.1,
                  backgroundColor: "rgba(0, 180, 100, 0.4)",
                },
              ],
            }}
          />
        </div>

        {sessionData && Object.entries(sessionData).length > 0 && (
          <div className="h-[20rem] w-11/12 flex justify-center flex-shrink-0">
            <div
              className={`h-full w-10/12 rounded-2xl bg-gradient-to-br ${
                sessionData.status === "pendingPayment"
                  ? "from-yellow-300 to-orange-400"
                  : "from-green-500 to-teal-500"
              }`}
            >
              <figure className="h-[8rem] w-full flex flex-col text-center items-center justify-center">
                <FontAwesomeIcon
                  icon={solid("user")}
                  className="text-center text-white text-4xl mb-2"
                />
                <p className="text-white font-bold text-xl">
                  Current worker details
                </p>
              </figure>

              <div className="h-3/6 w-full flex items-center justify-center">
                <div className="h-4/6 rounded-lg overflow-hidden mr-4">
                  <img
                    src={
                      sessionData.workerAvatar
                        ? sessionData.workerAvatar
                        : "https://img.freepik.com/free-vector/illustration-user-avatar-icon_53876-5907.jpg?t=st=1658422712~exp=1658423312~hmac=31ac28379a7d356b43a14e42eb3b3ae8b61eaca34f8baaeea6afaa2e5aff18a5&w=900"
                    }
                    alt="profile"
                    className="h-full w-full object-cover"
                  />
                </div>

                <figure className="h-full flex flex-col justify-center">
                  <p className="text-white font-medium text-lg">
                    Name: {sessionData.workerName},{" "}
                    {sessionData.workerGender.slice(0, 1).toUpperCase() +
                      sessionData.workerGender.slice(1)}
                  </p>
                  <p className="text-white font-medium text-lg">
                    Occupation: {sessionData.serviceName}
                  </p>
                  <p className="text-white font-medium text-lg">
                    Email: {sessionData.workerEmail}
                  </p>
                  <p className="text-white font-medium text-lg">
                    Phone Number: {sessionData.workerPhoneNumber}
                  </p>
                </figure>
              </div>
            </div>
          </div>
        )}
      </div>

      <ClientProfileSide />
    </div>
  );
}

export default ClientDashboard;
