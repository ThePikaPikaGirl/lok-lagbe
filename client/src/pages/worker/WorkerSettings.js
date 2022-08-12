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

function WorkerSettings() {
  const { currentUser, logout } = useAuth();
  const [userData, setUserData] = useState({});
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [newBio, setNewBio] = useState("");

  const handleNewBio = async () => {
    const userRef = firebaseFirestore.doc(
      firebaseDB,
      `users/${currentUser.email}`
    );

    await firebaseFirestore.updateDoc(userRef, {
      bio: newBio,
    });

    setIsEditingBio(false);
  };

  useEffect(() => {
    const q = firebaseFirestore.query(
      firebaseFirestore.collection(firebaseDB, "users"),
      firebaseFirestore.where("email", "==", currentUser.email)
    );

    const unsubscribe = firebaseFirestore.onSnapshot(q, (querySnapshot) => {
      const users = [];

      querySnapshot.forEach((doc) => {
        users.push({
          ...doc.data(),
        });
      });

      setUserData(users[0]);
    });

    return unsubscribe;
  }, [currentUser.email]);

  return (
    <div className="h-[85%] w-[90%] flex items-center justify-center sm:bg-slate-100 overflow-hidden shadow-xl rounded-3xl">
      {isEditingBio && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0007] h-full w-full flex items-center justify-center z-50">
          <div className="bg-slate-100 h-4/6 w-3/6 opacity-100 rounded-3xl shadow-2xl flex flex-col items items-center overflow-hidden">
            <div className="w-full h-1/6 flex items-center justify-between px-16 bg-slate-200 border-b-[1px] border-gray-300">
              <p className="text-3xl font-bold text-blue-800 mr-8">
                Edit your bio
              </p>

              <button
                className="border-red-700 border-4 text-red-700 rounded-full w-12 h-12 flex items-center justify-center transition-all hover:bg-red-700 hover:text-white"
                onClick={() => {
                  setIsEditingBio(false);
                }}
              >
                <FontAwesomeIcon
                  icon={solid("times")}
                  className="text-center text-2xl"
                />
              </button>
            </div>

            <div className="w-full h-5/6 flex flex-col">
              <textarea
                className="w-full h-5/6 text-xl px-6 py-8 bg-slate-300"
                placeholder={`Write a new bio, ${currentUser.displayName}...`}
                id="panel"
                value={newBio}
                onChange={(e) => {
                  setNewBio(e.target.value);
                }}
              ></textarea>

              <div className="w-full h-1/6 flex items-center justify-center">
                <button
                  className={
                    "bg-blue-700 rounded-xl w-11/12 h-4/6 flex items-center justify-center transition-all" +
                    (newBio.trim().length > 0
                      ? " hover:bg-blue-800"
                      : " cursor-not-allowed grayscale-[0.8]")
                  }
                  disabled={newBio.trim().length < 1}
                  onClick={() => {
                    handleNewBio();
                  }}
                >
                  <FontAwesomeIcon
                    icon={solid("paper-plane")}
                    className="text-white text-2xl mr-4"
                  />
                  <p className="text-white text-2xl">Update Bio</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <WorkerSidebar />

      <div className="h-full w-8/12 flex flex-col items-center bg-slate-50">
        <div className="h-[12rem] w-11/12 flex items-center">
          <p className="text-[2rem] font-bold">Settings</p>
        </div>

        <div className="min-h-[15rem] w-11/12 flex justify-center">
          <div className="w-full h-full flex flex-col">
            <div className="w-full h-[4rem] flex justify-between">
              <p className="font-semibold text-[1.5rem] mb-4">Your Bio</p>

              <button
                type="button"
                className="text-[1.5rem] font-medium text-blue-700 h-10 w-24 transition-all hover:text-blue-900"
                onClick={() => {
                  setIsEditingBio(true);
                  setNewBio(userData.bio);
                }}
              >
                <FontAwesomeIcon icon={solid("pen")} />
                &nbsp;&nbsp;Edit
              </button>
            </div>

            <div className="w-full flex flex-1 flex-col bg-slate-200 mb-4 flex-shrink-0 rounded-xl px-8 py-6">
              {userData.bio ? (
                userData.bio.split("\n\n").map((linenn, indexnn) => (
                  <p key={indexnn} className="text-xl mb-4">
                    {linenn.split("\n").map((line, index) => (
                      <span key={index}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                ))
              ) : (
                <p className="text-xl">You haven&#39;t set your bio yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <WorkerProfileSide />
    </div>
  );
}

export default WorkerSettings;
