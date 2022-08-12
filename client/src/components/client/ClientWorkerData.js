import React, { useState, useRef, useEffect } from "react";
import {
  solid,
  regular,
  brands,
} from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, Link, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./../../styles/scroller.css";
import { firebaseFirestore, firebaseDB } from "./../../firebase";
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

function Review({ author, timestamp, message, avatar }) {
  return (
    <div className="flex w-full mb-4 flex-shrink-0">
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
          <p className="text-sm text-gray-600">
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

function ClientWorkerData({ data }) {
  const { currentUser, encodeServiceAgreementData } = useAuth();
  const [displayOccupation, setDisplayOccupation] = useState("");
  const [displayWork, setDisplayWork] = useState("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isCVViewerModalOpen, setIsCVViewerModalOpen] = useState(false);
  const [isRequirementModalOpen, setIsRequirementModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [cvURL, setCvURL] = useState(null);

  const [userData, setUserData] = useState({});
  const [sessionData, setSessionData] = useState({});
  const [newReview, setNewReview] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [info, setInfo] = useState("");

  const [completeAddress, setCompleteAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [hourlyDurationFrom, setHourlyDurationFrom] = useState("");
  const [hourlyDurationTo, setHourlyDurationTo] = useState("");
  const [startingDate, setStartingDate] = useState("");
  const [endingDate, setEndingDate] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [negotiatedServiceFee, setNegotiatedServiceFee] = useState("");

  const textareaRef = useRef();

  const nav = useNavigate();

  const clickToCopy = () => {
    const textarea = textareaRef.current;
    textarea.select();
    document.execCommand("Copy");
    alert("Copied to clipboard");
    textarea.unselect();
  };

  const handleReview = async () => {
    const docRef = firebaseFirestore.doc(firebaseDB, `users/${data.email}`);

    await firebaseFirestore.updateDoc(docRef, {
      reviews: [
        ...userData.reviews,
        {
          id: Math.random().toString(),
          author: currentUser.displayName,
          avatar: currentUser.photoURL,
          message: newReview,
          timestamp: firebaseFirestore.Timestamp.fromDate(new Date()),
        },
      ],
    });

    setNewReview("");
  };

  const handleNewAppointment = async () => {
    const docRef = firebaseFirestore.doc(firebaseDB, `users/${data.email}`);

    await firebaseFirestore.updateDoc(docRef, {
      appointments: [
        ...userData.appointments,
        {
          id: Math.random().toString(),
          author: currentUser.displayName,
          email: currentUser.email,
          avatar: currentUser.photoURL,
          message: info,
          timestamp: firebaseFirestore.Timestamp.fromDate(new Date()),
        },
      ],
    });

    setInfo("");

    alert("Request sent");

    setIsAppointmentModalOpen(false);
  };

  const handleNewMessage = async (id) => {
    const docRef = firebaseFirestore.doc(firebaseDB, `users/${data.email}`);

    try {
      await firebaseFirestore.updateDoc(docRef, {
        appointments: [
          ...userData.appointments.filter(
            (appointment) => appointment.id !== id
          ),
          {
            ...userData.appointments.filter(
              (appointment) => appointment.id === id
            )[0],
            thread: [
              ...userData.appointments.filter(
                (appointment) => appointment.id === id
              )[0].thread,
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

  const handleStartSession = async () => {
    try {
      const docRef = firebaseFirestore.doc(
        firebaseDB,
        `users/${currentUser.email}`
      );

      let snap = await firebaseFirestore.getDoc(docRef);

      let client_data = snap.data();

      let payload = {
        clientName: client_data.firstName + " " + client_data.lastName,
        clientEmail: client_data.email,
        clientGender: client_data.gender,
        clientPhoneNumber:
          phoneNumber.length > 0
            ? phoneNumber.startsWith("+")
              ? phoneNumber
              : phoneNumber.startsWith("0")
              ? `+88${phoneNumber}`
              : `+880${phoneNumber}`
            : client_data.phoneNumber,
        workerName: data.firstName + " " + data.lastName,
        workerEmail: data.email,
        workerGender: data.gender,
        workerPhoneNumber: data.phoneNumber,
        serviceName: displayWork,
        startingDate,
        endingDate,
        hourlyDurationFrom,
        hourlyDurationTo,
        completeAddress,
        jobDescription,
        negotiatedServiceFee: parseFloat(negotiatedServiceFee).toFixed(2),
        totalServiceFee: parseFloat(
          parseFloat(negotiatedServiceFee) +
            parseFloat(negotiatedServiceFee) * (5 / 100)
        ).toFixed(2),
        createdAt: Date(),
      };

      const token = await encodeServiceAgreementData(payload);

      nav(`/service-agreement?token=${token}`);
    } catch (error) {
      console.log(error);
    }

    // if (willSessionStart) {
    //   let sessionsRef = firebaseFirestore.collection(firebaseDB, "sessions");
    //   await firebaseFirestore.addDoc(sessionsRef, {
    //     clientName: currentUser.displayName,
    //     clientEmail: currentUser.email,
    //     clientPhoneNumber: phoneNumber,
    //     clientAvatar: currentUser.photoURL,
    //     workerName: userData.firstName + " " + userData.lastName,
    //     workerEmail: userData.email,
    //     workerPhoneNumber: userData.phoneNumber,
    //     timestamp: firebaseFirestore.Timestamp.fromDate(new Date()),
    //     status: "pendingPayment",
    //   });
    // } else {
    //   alert("Session cancelled!");
    // }
  };

  useEffect(() => {
    if (data.hiringOccupation === "nurse") {
      setDisplayOccupation("Nurse");
      setDisplayWork("Nursing");
    } else if (data.hiringOccupation === "patient-attendant") {
      setDisplayOccupation("Patient Attendant");
      setDisplayWork("Patient Attendant");
    } else if (data.hiringOccupation === "driver") {
      setDisplayOccupation("Driver");
      setDisplayWork("Driving");
    } else if (data.hiringOccupation === "homemaker") {
      setDisplayOccupation("Homemaker");
      setDisplayWork("Housekeeping");
    } else if (data.hiringOccupation === "babysitter") {
      setDisplayOccupation("Babysitter");
      setDisplayWork("Babysitting");
    } else if (data.hiringOccupation === "security-guard") {
      setDisplayOccupation("Security Guard");
      setDisplayWork("Guarding");
    } else if (data.hiringOccupation === "caretaker") {
      setDisplayOccupation("Caretaker");
      setDisplayWork("Caretaking");
    } else {
      setDisplayOccupation("");
      setDisplayWork("Others");
    }

    const getSessionDetails = () => {
      const sessionsRef = firebaseFirestore.collection(firebaseDB, "sessions");

      firebaseFirestore
        .getDocs(
          firebaseFirestore.query(
            sessionsRef,
            firebaseFirestore.where("workerEmail", "==", data.email)
          )
        )
        .then((snapshot) => {
          if (snapshot.empty) {
            setSessionData({});
          } else {
            setSessionData({
              ...snapshot.docs[0].data(),
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    getSessionDetails();

    const q = firebaseFirestore.query(
      firebaseFirestore.collection(firebaseDB, "users"),
      firebaseFirestore.where("email", "==", data.email)
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
  }, [data.email, data.hiringOccupation, sessionData, userData.email]);

  return (
    <div className="bg-slate-100 w-11/12 h-[6rem] rounded-xl flex justify-between items-center shadow-md border-2 px-8 my-2 flex-shrink-0">
      {isProfileModalOpen && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0007] h-full w-full flex items-center justify-center z-50">
          <div className="bg-slate-100 h-5/6 w-5/6 opacity-100 rounded-3xl shadow-2xl flex flex-col items items-center overflow-hidden">
            <div className="w-full h-1/6 flex items-center justify-between px-16 bg-slate-200 border-b-[1px] border-gray-300">
              <div className="flex items-center">
                <p className="text-3xl font-bold text-blue-800 mr-8">
                  Viewing {data.firstName} {data.lastName}&#39;s Profile
                </p>
              </div>

              <button
                className="border-red-700 border-4 text-red-700 rounded-full w-12 h-12 flex items-center justify-center transition-all hover:bg-red-700 hover:text-white"
                onClick={() => {
                  setIsProfileModalOpen(false);
                }}
              >
                <FontAwesomeIcon
                  icon={solid("times")}
                  className="text-center text-2xl"
                />
              </button>
            </div>

            <div className="w-full h-5/6 flex items-center">
              <div
                className="w-1/2 h-full overflow-scroll border-r-[1px] border-gray-200 py-6 px-8"
                id="panel"
              >
                <div className="w-full h-[4rem] flex items-center mb-4">
                  <p className="text-3xl font-semibold">About:</p>
                </div>

                <div className="w-full min-h-[2rem] flex flex-col justify-center">
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
                    <p className="text-xl">
                      {userData.firstName} haven&#39;t set your bio yet.
                    </p>
                  )}
                </div>
              </div>

              <div className="w-1/2 h-full overflow-hidden border-l-[1px] border-gray-200">
                <div className="w-full h-1/6 flex items-center py-6 px-8 bg-slate-200 border-b-[1px] border-gray-200">
                  <p className="text-3xl font-semibold">Reviews:</p>
                </div>

                <div
                  className="w-full h-4/6 flex flex-col items-center overflow-y-scroll py-6 px-8"
                  id="scrollview"
                >
                  {userData.reviews.map((review) => (
                    <Review
                      key={review.id}
                      author={review.author}
                      timestamp={review.timestamp}
                      message={review.message}
                      avatar={review.avatar}
                    />
                  ))}
                </div>

                <div className="w-full h-1/6 flex items-center py-6 px-8 bg-slate-200 border-t-[1px] border-gray-200">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className="rounded-lg w-10/12 h-12 mr-8"
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                  />

                  <button
                    type="button"
                    className="text-white rounded-lg w-20 h-12 flex items-center justify-center transition-all bg-blue-700 hover:bg-blue-800"
                    onClick={() => {
                      handleReview();
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
          </div>
        </div>
      )}

      {isAppointmentModalOpen && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0007] h-full w-full flex items-center justify-center z-50">
          <div className="bg-slate-100 h-5/6 w-5/6 opacity-100 rounded-3xl shadow-2xl flex flex-col items items-center overflow-hidden">
            <div className="w-full h-1/6 flex items-center justify-between px-16 bg-slate-200 border-b-[1px] border-gray-300">
              <p className="text-3xl font-bold text-blue-800 mr-8">
                Request {data.firstName} for&nbsp;
                {data.gender === "male" ? "him" : "her"} CV
              </p>

              <button
                className="border-red-700 border-4 text-red-700 rounded-full w-12 h-12 flex items-center justify-center transition-all hover:bg-red-700 hover:text-white"
                onClick={() => {
                  setIsAppointmentModalOpen(false);
                }}
              >
                <FontAwesomeIcon
                  icon={solid("times")}
                  className="text-center text-2xl"
                />
              </button>
            </div>

            <div className="w-full h-5/6 flex flex-col">
              <div className="w-full h-5/6 flex">
                <textarea
                  className="w-8/12 h-full text-xl px-6 py-8 bg-slate-300 resize-none"
                  placeholder="Please specify..."
                  id="panel"
                  ref={textareaRef}
                  value={info}
                  onChange={(e) => {
                    setInfo(e.target.value);
                  }}
                ></textarea>

                <div className="w-4/12 h-full px-6 py-8">
                  <p className="text-2xl font-semibold mb-8">
                    Recommended Method to follow:
                  </p>

                  <p className="text-lg mb-4">
                    {`Write some information to ${
                      data.firstName
                    } to request CV from ${
                      data.gender === "male" ? "him" : "her"
                    }.`}
                  </p>

                  <p className="text-lg mb-4 font-medium">
                    The information should be clear enough and must contain the
                    following info:
                  </p>

                  <ol className="mb-10">
                    <li className="text-md mb-2 list-decimal">
                      Time setting (Mention the hourly duration and timing,
                      starting date, how many days, etc.)
                    </li>

                    <li className="text-md list-decimal">
                      Your Address (not the complete address, just the name of
                      the area, e.g. "Asad Avenue, Mohammadpur")
                    </li>
                  </ol>

                  <p className="text-sm font-bold text-blue-600 mb-2">
                    N.B: If you also want to apply for another worker, it is
                    recommended to keep a copy of the text you wrote on the
                    textbox and later paste that for the next worker you send
                    request to.
                  </p>

                  <button
                    type="button"
                    className="text-lg font-medium text-indigo-800 hover:text-blue-900 transition-all"
                    onClick={() => {
                      clickToCopy();
                    }}
                  >
                    <FontAwesomeIcon icon={solid("copy")} />
                    &nbsp;&nbsp;Click to copy the text
                  </button>
                </div>
              </div>

              <div className="w-full h-1/6 flex items-center justify-center">
                <button
                  className={
                    "bg-blue-700 rounded-xl w-11/12 h-4/6 flex items-center justify-center transition-all" +
                    (info.trim().length > 0
                      ? " hover:bg-blue-800"
                      : " cursor-not-allowed grayscale-[0.8]")
                  }
                  disabled={info.trim().length < 1}
                  onClick={() => {
                    handleNewAppointment();
                  }}
                >
                  <FontAwesomeIcon
                    icon={solid("paper-plane")}
                    className="text-white text-2xl mr-4"
                  />
                  <p className="text-white text-2xl">Send</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCVViewerModalOpen && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0007] h-full w-full flex items-center justify-center z-50">
          <div className="bg-slate-100 h-5/6 w-4/6 opacity-100 rounded-3xl shadow-2xl flex flex-col items items-center justify-center">
            <div className="w-8/12 h-1/6 flex items-center justify-between">
              <p className="text-2xl font-bold">
                Viewing CV of {data.firstName}
              </p>

              <button
                className="bg-red-700 rounded-xl w-12 h-12 flex items-center justify-center transition-all hover:bg-red-800"
                onClick={() => {
                  setIsCVViewerModalOpen(false);
                  setCvURL(null);
                }}
              >
                <FontAwesomeIcon
                  icon={solid("times")}
                  className="text-center text-white text-2xl"
                />
              </button>
            </div>

            <div className="w-8/12 h-4/6 bg-slate-900">
              <iframe src={cvURL} className="w-full h-full" title="CV Viewer" />
            </div>
          </div>
        </div>
      )}

      {isRequirementModalOpen && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0007] h-full w-full flex items-center justify-center z-50">
          <div className="bg-slate-100 h-5/6 w-5/6 opacity-100 rounded-3xl shadow-2xl flex flex-col items items-center overflow-hidden">
            <div className="w-full h-1/6 flex items-center justify-between px-16 bg-slate-200 border-b-[1px] border-gray-300">
              <p className="text-3xl font-bold text-blue-800 mr-8">
                Complete your requirement details{" "}
                <span className="text-gray-400 font-semibold text-lg">
                  This will create a legal service agreement contract
                </span>
              </p>

              <button
                className="border-red-700 border-4 text-red-700 rounded-full w-12 h-12 flex items-center justify-center transition-all hover:bg-red-700 hover:text-white"
                onClick={() => {
                  setIsRequirementModalOpen(false);
                }}
              >
                <FontAwesomeIcon
                  icon={solid("times")}
                  className="text-center text-2xl"
                />
              </button>
            </div>

            <div className="w-full h-5/6 flex flex-col">
              <div className="w-full h-5/6 flex">
                <div className="w-1/2 h-full border-r-[1px] border-b-2 border-gray-200">
                  <div className="w-full h-[9rem] flex flex-col items-center justify-center">
                    <label className="w-11/12 mb-2 text-lg font-semibold">
                      Complete Address (must include road no., house no., etc.
                      too if any; it must be well-precised)
                    </label>
                    <input
                      type="text"
                      className="w-11/12 h-12 px-4 py-2 border-2 border-gray-300 rounded-lg"
                      placeholder="House#12, Road#3, Sector#4, Some Avenue, Some Place etc."
                      value={completeAddress}
                      onChange={(e) => {
                        setCompleteAddress(e.target.value);
                      }}
                    />
                  </div>

                  <div className="w-full h-[9rem] flex flex-col items-center justify-center">
                    <label className="w-11/12 mb-2 text-lg font-semibold">
                      Phone number to expose to the worker (leave it blank if
                      you want to send your account&#39;s phone number)
                    </label>

                    <input
                      type="text"
                      className="w-11/12 h-12 px-4 py-2 border-2 border-gray-300 rounded-lg"
                      placeholder="+8801XXXXXXXXX"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                      }}
                    />
                  </div>

                  <div className="w-full h-[9rem] flex items-center justify-center">
                    <div className="w-6/12 h-full flex flex-col justify-center items-center">
                      <label className="w-10/12 mb-2 text-lg font-semibold">
                        Hourly duration (from)
                      </label>
                      <input
                        type="time"
                        className="w-10/12 h-12 px-4 py-2 border-2 border-gray-300 rounded-lg"
                        value={hourlyDurationFrom}
                        onChange={(e) => {
                          setHourlyDurationFrom(e.target.value);
                        }}
                      />
                    </div>
                    <div className="w-6/12 h-full flex flex-col justify-center items-center">
                      <label className="w-10/12 mb-2 text-lg font-semibold">
                        Hourly duration (to)
                      </label>
                      <input
                        type="time"
                        className="w-10/12 h-12 px-4 py-2 border-2 border-gray-300 rounded-lg"
                        value={hourlyDurationTo}
                        onChange={(e) => {
                          setHourlyDurationTo(e.target.value);
                        }}
                      />
                    </div>
                  </div>

                  <div className="w-full h-[9rem] flex items-center justify-center">
                    <div className="w-6/12 h-full flex flex-col justify-center items-center">
                      <label className="w-10/12 mb-2 text-lg font-semibold">
                        Starting Date
                      </label>
                      <input
                        type="date"
                        className="w-10/12 h-12 px-4 py-2 border-2 border-gray-300 rounded-lg"
                        value={startingDate}
                        onChange={(e) => {
                          setStartingDate(e.target.value);
                        }}
                      />
                    </div>
                    <div className="w-6/12 h-full flex flex-col justify-center items-center">
                      <label className="w-10/12 mb-2 text-lg font-semibold">
                        Ending Date
                      </label>
                      <input
                        type="date"
                        className="w-10/12 h-12 px-4 py-2 border-2 border-gray-300 rounded-lg"
                        value={endingDate}
                        onChange={(e) => {
                          setEndingDate(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="w-1/2 h-full border-l-[1px] border-b-2 border-gray-200">
                  <div className="w-full h-5/6 flex flex-col items-center justify-center">
                    <label className="w-11/12 mb-2 text-lg font-semibold">
                      Job Description
                    </label>
                    <textarea
                      className="w-11/12 h-5/6 px-4 py-4 border-2 border-gray-300 rounded-xl resize-none overflow-scroll"
                      id="panel"
                      placeholder="Describe your worker's job in detail and clearly..."
                      value={jobDescription}
                      onChange={(e) => {
                        setJobDescription(e.target.value);
                      }}
                    ></textarea>
                  </div>
                  <div className="w-full h-1/6 flex-col items-center justify-center">
                    <div className="w-full h-1/2 flex items-center justify-center">
                      <label className="text-lg font-semibold mr-4">
                        Negotiated Service Fee:
                      </label>
                      <input
                        type="text"
                        className="w-3/12 h-12 px-4 py-2 border-2 border-gray-300 rounded-lg"
                        placeholder="10000.00"
                        value={negotiatedServiceFee}
                        onChange={(e) => {
                          setNegotiatedServiceFee(e.target.value);
                        }}
                      />
                      <p className="text-lg font-semibold ml-2">BDT(৳)</p>
                    </div>

                    {negotiatedServiceFee &&
                      !isNaN(parseInt(negotiatedServiceFee)) && (
                        <div className="w-full h-1/2 flex items-center justify-center">
                          <p className="text-md font-medium mr-4 text-blue-500">
                            Total Fee:{" "}
                            {parseFloat(
                              parseFloat(negotiatedServiceFee) +
                                parseFloat(negotiatedServiceFee) * (5 / 100)
                            ).toFixed(2)}{" "}
                            BDT(৳) (5% charge included)
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              </div>

              <div className="w-full h-1/6 flex items-center justify-center">
                <button
                  type="button"
                  className={
                    "bg-blue-700 rounded-xl w-11/12 h-4/6 flex items-center justify-center transition-all" +
                    (completeAddress.trim().length > 0 &&
                    hourlyDurationFrom.trim().length > 0 &&
                    hourlyDurationTo.trim().length > 0 &&
                    startingDate.trim().length > 0 &&
                    endingDate.trim().length > 0 &&
                    jobDescription.trim().length > 0 &&
                    negotiatedServiceFee.trim().length > 0 &&
                    !isNaN(parseInt(negotiatedServiceFee))
                      ? " hover:bg-blue-800"
                      : " cursor-not-allowed grayscale-[0.8]")
                  }
                  disabled={
                    completeAddress.trim().length > 0 &&
                    hourlyDurationFrom.trim().length > 0 &&
                    hourlyDurationTo.trim().length > 0 &&
                    startingDate.trim().length > 0 &&
                    endingDate.trim().length > 0 &&
                    jobDescription.trim().length > 0 &&
                    negotiatedServiceFee.trim().length > 0 &&
                    !isNaN(parseInt(negotiatedServiceFee))
                      ? false
                      : true
                  }
                  onClick={() => {
                    handleStartSession();
                  }}
                >
                  <FontAwesomeIcon
                    icon={solid("play")}
                    className="text-white text-2xl mr-4"
                  />
                  <p className="text-white text-2xl">
                    Place Contract and Start Session
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              {userData.appointments
                .filter(
                  (appointment) => appointment.email === currentUser.email
                )[0]
                .thread.map((comment) => (
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
                  handleNewMessage(
                    userData.appointments.filter(
                      (appointment) => appointment.email === currentUser.email
                    )[0].id
                  );
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

      <figure className="flex flex-col h-full justify-center">
        <p className="text-lg font-bold mb-1">
          {data.firstName} {data.lastName} &bull; {displayOccupation} &bull;{" "}
          {data.gender === "male" ? (
            <FontAwesomeIcon
              icon={solid("person")}
              className="text-2xl text-blue-700"
              title="Male"
            />
          ) : (
            <FontAwesomeIcon
              icon={solid("person-dress")}
              className="text-2xl text-pink-600"
              title="Female"
            />
          )}
        </p>
        <figcaption className="text-sm">
          {data.email}
          {userData.appointments &&
            userData.appointments.filter(
              (appointment) => appointment.email === currentUser.email
            )[0] &&
            userData.appointments.filter(
              (appointment) => appointment.email === currentUser.email
            )[0].status === "rejected" && (
              <span className="text-sm font-medium ml-4 text-red-700">
                {data.firstName} rejected your request. Maybe&nbsp;
                {data.gender === "male" ? "he" : "she"} is busy.
              </span>
            )}
        </figcaption>
      </figure>

      <div className="flex justify-evenly items-center h-full w-[16rem]">
        {Object.entries(sessionData).length === 0 ? (
          <>
            <button
              className="bg-sky-500 rounded-xl w-12 h-12 flex items-center justify-center transition-all hover:bg-sky-600"
              onClick={() => {
                setIsProfileModalOpen(true);
              }}
            >
              <FontAwesomeIcon
                icon={solid("address-card")}
                className="text-center text-white text-2xl"
              />
            </button>

            {userData.appointments &&
              userData.appointments.filter(
                (appointment) => appointment.email === currentUser.email
              )[0] &&
              userData.appointments.filter(
                (appointment) => appointment.email === currentUser.email
              )[0].status === "accepted" && (
                <button
                  type="button"
                  className="bg-purple-500 rounded-xl w-12 h-12 flex items-center justify-center transition-all hover:bg-purple-600"
                  onClick={() => {
                    setCvURL(
                      process.env.REACT_APP_API_BASE_URL + userData.cvURL
                    );
                    setIsCVViewerModalOpen(true);
                  }}
                >
                  <FontAwesomeIcon
                    icon={solid("file-circle-check")}
                    className="text-center text-white text-2xl"
                  />
                </button>
              )}

            {userData.appointments &&
              (userData.appointments.filter(
                (appointment) => appointment.email === currentUser.email
              ).length < 1 ? (
                <button
                  type="button"
                  className="bg-green-500 rounded-xl w-12 h-12 flex items-center justify-center transition-all hover:bg-green-600"
                  onClick={() => {
                    setIsAppointmentModalOpen(true);
                  }}
                >
                  <FontAwesomeIcon
                    icon={solid("handshake")}
                    className="text-center text-white text-2xl"
                  />
                </button>
              ) : userData.appointments.filter(
                  (appointment) => appointment.email === currentUser.email
                )[0] &&
                userData.appointments.filter(
                  (appointment) => appointment.email === currentUser.email
                )[0].status === "accepted" ? (
                <>
                  <button
                    type="button"
                    className="bg-emerald-500 rounded-xl w-12 h-12 flex items-center justify-center transition-all hover:bg-emerald-600"
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
                    className="bg-green-500 rounded-xl w-12 h-12 flex items-center justify-center transition-all hover:bg-green-600"
                    onClick={() => {
                      // handleStartSession();
                      setIsRequirementModalOpen(true);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={solid("thumbs-up")}
                      className="text-center text-white text-2xl"
                    />
                  </button>

                  <button
                    type="button"
                    className="bg-red-600 rounded-xl w-12 h-12 flex items-center justify-center transition-all hover:bg-red-800"
                  >
                    <FontAwesomeIcon
                      icon={solid("thumbs-down")}
                      className="text-center text-white text-2xl"
                    />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="bg-green-500 rounded-xl w-12 h-12 flex items-center justify-center transition-all grayscale-[0.9] cursor-not-allowed"
                  title="Sent a request to this worker."
                  disabled
                >
                  <FontAwesomeIcon
                    icon={solid("handshake")}
                    className="text-center text-white text-2xl"
                  />
                </button>
              ))}
          </>
        ) : (
          <p className="text-lg font-semibold text-green-500">
            Currently in use
          </p>
        )}
      </div>
    </div>
  );
}

export default ClientWorkerData;
