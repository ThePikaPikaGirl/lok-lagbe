import React, { useState, useRef, useEffect } from "react";
import {
  solid,
  regular,
  brands,
} from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, Link, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import WorkerSidebar from "./../../components/worker/WorkerSidebar";
import WorkerProfileSide from "./../../components/worker/WorkerProfileSide";
import { firebaseDB, firebaseFirestore } from "./../../firebase";

function WorkerDashboard() {
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
      firebaseFirestore.where("workerEmail", "==", currentUser.email)
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
      <WorkerSidebar />

      <div className="h-full w-8/12 flex flex-col items-center bg-slate-50">
        <div className="h-[12rem] w-11/12 flex items-center">
          <h1 className="text-[2.5rem] font-bold">
            {greeting}, {currentUser.displayName}!
          </h1>
        </div>

        <div className="h-[15rem] w-11/12 flex justify-center mb-10">
          <div className="h-full w-3/12 mx-6 bg-gradient-to-br from-sky-500 to-indigo-500 rounded-2xl">
            <figure className="h-full w-full flex flex-col text-center items-center justify-center">
              <FontAwesomeIcon
                icon={solid("users")}
                className="text-center text-white text-4xl"
              />
              <p className="text-white font-bold text-xl mb-4">
                Appointment Requests
              </p>
              <figcaption className="text-white text-3xl">12</figcaption>
            </figure>
          </div>

          <div className="h-full w-3/12 mx-6 bg-gradient-to-tl from-violet-500 to-fuchsia-500 rounded-2xl">
            <figure className="h-full w-full flex flex-col text-center items-center justify-center">
              <FontAwesomeIcon
                icon={solid("star")}
                className="text-center text-white text-4xl"
              />
              <p className="text-white font-bold text-xl mb-4">
                Current Avg. Rating
              </p>
              <figcaption className="text-white text-3xl">4.5</figcaption>
            </figure>
          </div>

          <div className="h-full w-3/12 mx-6 bg-gradient-to-tl from-purple-500 to-pink-500 rounded-2xl">
            <figure className="h-full w-full flex flex-col text-center items-center justify-center">
              <FontAwesomeIcon
                icon={solid("handshake")}
                className="text-center text-white text-4xl"
              />
              <p className="text-white font-bold text-xl mb-4">
                Total Jobs Completed
              </p>
              <figcaption className="text-white text-3xl">3</figcaption>
            </figure>
          </div>
        </div>

        {sessionData && Object.entries(sessionData).length > 0 && (
          <div className="h-[18rem] w-11/12 flex justify-center">
            <div className={`h-full w-10/12 rounded-2xl bg-gradient-to-br ${sessionData.status === "pendingPayment" ? "from-yellow-300 to-orange-400" : "from-green-500 to-teal-500"}`}>
              <figure className="h-[8rem] w-full flex flex-col text-center items-center justify-center">
                <FontAwesomeIcon
                  icon={solid("user")}
                  className="text-center text-white text-4xl mb-2"
                />
                <p className="text-white font-bold text-xl">
                  Current client details
                </p>
              </figure>

              <div className="h-3/6 w-full flex items-center justify-center">
                <div className="h-4/6 rounded-lg overflow-hidden mr-4">
                  <img
                    src={
                      sessionData.clientAvatar
                        ? sessionData.clientAvatar
                        : "https://img.freepik.com/free-vector/illustration-user-avatar-icon_53876-5907.jpg?t=st=1658422712~exp=1658423312~hmac=31ac28379a7d356b43a14e42eb3b3ae8b61eaca34f8baaeea6afaa2e5aff18a5&w=900"
                    }
                    alt="profile"
                    className="h-full w-full object-cover"
                  />
                </div>

                <figure className="h-full flex flex-col justify-center">
                  <p className="text-white font-medium text-lg">
                    Name: {sessionData.clientName}
                  </p>
                  <p className="text-white font-medium text-lg">
                    Email: {sessionData.clientEmail}
                  </p>
                  <p className="text-white font-medium text-lg">
                    Phone Number: {sessionData.clientPhoneNumber}
                  </p>
                </figure>
              </div>
            </div>
          </div>
        )}
      </div>

      <WorkerProfileSide />
    </div>
  );
}

export default WorkerDashboard;
