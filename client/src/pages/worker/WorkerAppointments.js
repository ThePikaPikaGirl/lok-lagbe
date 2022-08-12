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
import { formatRelative } from "date-fns";

function Comment({ author, timestamp, message, avatar }) {
  const commentRef = useRef();

  useEffect(() => {
    commentRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [commentRef]);

  return (
    <div className="flex w-full mb-4 flex-shrink-0" ref={commentRef}>
      <div className="h-14 w-14 rounded-full overflow-hidden mr-4 border-[1px] border-gray-400">
        <img
          src={
            avatar
              ? avatar
              : "https://img.freepik.com/free-vector/illustration-user-avatar-icon_53876-5907.jpg?t=st=1658422712~exp=1658423312~hmac=31ac28379a7d356b43a14e42eb3b3ae8b61eaca34f8baaeea6afaa2e5aff18a5&w=900"
          }
          alt="profile"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex-1 bg-slate-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <p className="text-lg font-bold mr-2">{author}</p>
          <p className="text-sm text-gray-500 font-semibold">
            {formatRelative(new Date(timestamp.seconds * 1000), new Date())
              .charAt(0)
              .toUpperCase() +
              formatRelative(
                new Date(timestamp.seconds * 1000),
                new Date()
              ).substring(1)}
          </p>
        </div>

        <p className="text-md">{message}</p>
      </div>
    </div>
  );
}

function Appointment({ data, userData, isOk, isNotOk }) {
  const { currentUser, logout } = useAuth();
  const [contracted, setContracted] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const handleAccept = async () => {
    const docRef = firebaseFirestore.doc(
      firebaseDB,
      `users/${currentUser.email}`
    );

    await firebaseFirestore.updateDoc(docRef, {
      appointments: [
        ...userData.appointments.filter(
          (appointment) => appointment.id !== data.id
        ),
        {
          ...data,
          status: "accepted",
          thread: [],
        },
      ],
    });
  };

  const handleReject = async () => {
    // eslint-disable-next-line no-restricted-globals
    let sure = confirm(
      "Are you sure you want to reject this appointment? This action is pretty serious. You will lose every message you have sent to this user. Continue?"
    );

    if (sure) {
      try {
        const docRef = firebaseFirestore.doc(
          firebaseDB,
          `users/${currentUser.email}`
        );

        await firebaseFirestore.updateDoc(docRef, {
          appointments: [
            ...userData.appointments.filter(
              (appointment) => appointment.id !== data.id
            ),
            {
              ...data,
              status: "rejected",
            },
          ],
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("You have cancelled the action.");
    }
  };

  const handleNewMessage = async () => {
    const docRef = firebaseFirestore.doc(
      firebaseDB,
      `users/${currentUser.email}`
    );

    try {
      await firebaseFirestore.updateDoc(docRef, {
        appointments: [
          ...userData.appointments.filter(
            (appointment) => appointment.id !== data.id
          ),
          {
            ...data,
            thread: [
              ...data.thread,
              {
                id: Math.random().toString(),
                author: currentUser.displayName,
                message: newMessage,
                timestamp: firebaseFirestore.Timestamp.fromDate(new Date()),
                avatar: currentUser.photoURL,
              },
            ],
          },
        ],
      });

      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isChatOpen && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0007] h-full w-full flex items-center justify-center z-50">
          <div className="bg-slate-100 h-5/6 w-3/6 opacity-100 rounded-3xl shadow-2xl flex flex-col items items-center overflow-hidden">
            <div className="w-full h-1/6 flex items-center justify-between px-16 bg-slate-200 border-b-[1px] border-gray-300">
              <div className="flex items-center">
                <p className="text-3xl font-bold text-blue-800 mr-8">Chats</p>
              </div>

              <button
                className="border-red-700 border-4 text-red-700 rounded-full w-12 h-12 flex items-center justify-center transition-all hover:bg-red-700 hover:text-white"
                onClick={() => {
                  setIsChatOpen(false);
                }}
              >
                <FontAwesomeIcon
                  icon={solid("times")}
                  className="text-center text-2xl"
                />
              </button>
            </div>

            <div
              className="w-full h-4/6 flex flex-col items-center px-8 py-6 overflow-scroll"
              id="panel"
            >
              {data.thread.map((comment) => (
                <Comment
                  key={comment.id}
                  author={comment.author}
                  timestamp={comment.timestamp}
                  message={comment.message}
                  avatar={comment.avatar}
                />
              ))}
            </div>

            <div className="bg-slate-200 border-t-[1px] border-gray-300 w-full h-1/6 flex items-center justify-center">
              <input
                type="text"
                placeholder="Write a message..."
                className="rounded-lg w-9/12 h-12 mr-8"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />

              <button
                type="button"
                className="text-white rounded-lg w-20 h-12 flex items-center justify-center transition-all bg-blue-700 hover:bg-blue-800"
                onClick={() => {
                  handleNewMessage();
                }}
              >
                <FontAwesomeIcon
                  icon={solid("paper-plane")}
                  className="text-center text-2xl"
                />
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`w-11/12 h-[6rem] rounded-xl flex justify-between items-center shadow-md border-2 px-8 my-2 flex-shrink-0 ${
          isOk ? "bg-green-100" : "bg-slate-100"
        } ${isNotOk ? "bg-red-200" : "bg-slate-100"}`}
      >
        <figure className="flex h-full justify-center items-center">
          <div className="h-14 w-14 rounded-full overflow-hidden mr-4 border-[1px] border-gray-400">
            <img
              src={
                data.avatar
                  ? data.avatar
                  : "https://img.freepik.com/free-vector/illustration-user-avatar-icon_53876-5907.jpg?t=st=1658422712~exp=1658423312~hmac=31ac28379a7d356b43a14e42eb3b3ae8b61eaca34f8baaeea6afaa2e5aff18a5&w=900"
              }
              alt="profile"
              className="h-full w-full object-cover"
            />
          </div>

          <p className="text-lg font-bold mr-2">{data.author}</p>

          <p className="text-sm text-gray-500 font-semibold">
            {formatRelative(new Date(data.timestamp.seconds * 1000), new Date())
              .charAt(0)
              .toUpperCase() +
              formatRelative(
                new Date(data.timestamp.seconds * 1000),
                new Date()
              ).substring(1)}
          </p>
        </figure>

        <div className="flex justify-evenly items-center h-full w-[12rem]">
          <button
            type="button"
            className={`rounded-xl w-12 h-12 flex items-center justify-center transition-all ${
              contracted
                ? "bg-red-600 hover:bg-red-800"
                : "bg-sky-500 hover:bg-sky-600"
            }`}
            onClick={() => setContracted(!contracted)}
          >
            {contracted ? (
              <FontAwesomeIcon
                icon={solid("times")}
                className="text-center text-white text-2xl"
              />
            ) : (
              <FontAwesomeIcon
                icon={solid("bars")}
                className="text-center text-white text-2xl"
              />
            )}
          </button>

          {!isOk && (
            <button
              type="button"
              className="bg-green-500 rounded-xl w-12 h-12 flex items-center justify-center transition-all hover:bg-green-600"
              onClick={() => handleAccept()}
            >
              <FontAwesomeIcon
                icon={solid("handshake")}
                className="text-center text-white text-2xl"
              />
            </button>
          )}

          {!isNotOk && (
            <>
              <button
                type="button"
                className="bg-emerald-600 rounded-xl w-12 h-12 flex items-center justify-center transition-all hover:bg-emerald-700"
                onClick={() => {
                  setIsChatOpen(true);
                }}
              >
                <FontAwesomeIcon
                  icon={solid("comment")}
                  className="text-center text-white text-2xl"
                />
              </button>

              <button
                type="button"
                className="bg-red-600 rounded-xl w-12 h-12 flex items-center justify-center transition-all hover:bg-red-800"
                onClick={() => handleReject()}
              >
                <FontAwesomeIcon
                  icon={solid("calendar-xmark")}
                  className="text-center text-white text-2xl"
                />
              </button>
            </>
          )}
        </div>
      </div>

      {contracted && (
        <div className="bg-slate-100 w-11/12 min-h-[3rem] rounded-xl flex flex-col shadow-md border-2 px-8 py-6 my-2 flex-shrink-0">
          {data.message ? (
            data.message.split("\n\n").map((linenn, indexnn) => (
              <p key={indexnn} className="text-lg font-semibold mb-4">
                {linenn.split("\n").map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            ))
          ) : (
            <p className="text-sm text-gray-500 font-semibold">
              No message provided.
            </p>
          )}
        </div>
      )}
    </>
  );
}

function WorkerAppointments() {
  const { currentUser, logout } = useAuth();
  const [userData, setUserData] = useState({});

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
      <WorkerSidebar />

      <div className="h-full w-8/12 flex flex-col items-center bg-slate-50">
        <div className="h-1/6 w-11/12 flex items-center">
          <p className="text-[2rem] font-bold">Appointments</p>
        </div>

        <div
          className="h-5/6 w-11/12 flex flex-col items-center overflow-scroll"
          id="panel"
        >
          {userData.appointments &&
            userData.appointments.map((appointment) => (
              <Appointment
                data={appointment}
                key={appointment.id}
                userData={userData}
                isOk={appointment.status === "accepted"}
                isNotOk={appointment.status === "rejected"}
              />
            ))}
        </div>
      </div>

      <WorkerProfileSide />
    </div>
  );
}

export default WorkerAppointments;
