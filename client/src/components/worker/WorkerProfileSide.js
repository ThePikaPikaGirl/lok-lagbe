import React, { useState, useRef, useEffect } from "react";
import {
  solid,
  regular,
  brands,
} from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function WorkerProfileSide() {
  const { currentUser, logout } = useAuth();

  return (
    <div className="h-full w-2/12 border-l-2 flex flex-col justify-between">
      <div className="w-full h-[20rem]">
        <figure className="w-full h-full flex flex-col items-center justify-center">
          <div className="h-24 w-24 rounded-full overflow-hidden mb-4">
            <img
              src={
                currentUser.photoURL
                  ? currentUser.photoURL
                  : "https://img.freepik.com/free-vector/illustration-user-avatar-icon_53876-5907.jpg?t=st=1658422712~exp=1658423312~hmac=31ac28379a7d356b43a14e42eb3b3ae8b61eaca34f8baaeea6afaa2e5aff18a5&w=900"
              }
              alt="profile"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold mb-1">{currentUser.displayName}</p>
            <figcaption className="text-sm mb-2">
              {currentUser.email}
            </figcaption>
            <p className="text-sm text-gray-400 font-bold">Worker</p>
          </div>
        </figure>
      </div>

      <div className="w-full h-[8rem] flex justify-center items-center">
        <button
          type="button"
          className="bg-red-700 text-white text-2xl flex overflow-hidden rounded-xl w-9/12 h-3/6 hover:bg-red-800 transition-all"
          onClick={() => logout()}
        >
          <div className="w-4/12 h-full flex items-center justify-center">
            <FontAwesomeIcon icon={solid("sign-out-alt")} />
          </div>
          <p className="w-8/12 h-full flex items-center justify-start">
            Logout
          </p>
        </button>
      </div>
    </div>
  );
}

export default WorkerProfileSide;
