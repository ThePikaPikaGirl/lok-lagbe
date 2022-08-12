import React, { useState, useRef, useEffect } from "react";
import {
  solid,
  regular,
  brands,
} from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function GetStartedWorker() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDOB] = useState("");
  const [gender, setGender] = useState("male");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nid, setNID] = useState("");
  const [hiringOccupation, setHiringOccupation] = useState("");
  const [cv, setCV] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    currentUser,
    addWorkerToDatabase,
    verifyPhoneWithCode,
    mailUser,
    uploadCV,
  } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    let isMounted = true;

    localStorage.setItem("role", "worker");

    return () => {
      isMounted = false;
    };
    // console.log(hiringOccupation);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log(cv);

    try {
      setError("");
      setLoading(true);
      const credential = await verifyPhoneWithCode(phoneNumber);

      if (credential !== null) {
        const cvRes = await uploadCV(cv);

        await addWorkerToDatabase(
          "worker",
          firstName.trim(),
          lastName.trim(),
          dob,
          gender,
          address,
          phoneNumber,
          nid,
          hiringOccupation,
          cvRes.url,
          false,
          credential
        );

        const subject = 'Welcome to "Lok Lagbe"!';
        const message = `# Hi ${currentUser.displayName}, welcome to Lok Lagbe!\nYour registration was successful. Your CV will be approved by our Admins. It may take upto 7-8 days for your CVs to get approved. You will be getting a confirmation mail if our Admins approve you. Thank you for your patience. If you have any question, please contact us at this email: **loklagbe.team@gmail.com**!\n\n### Thank you for choosing **Lok Lagbe**!\n\nLokLagbe Team 💪`;

        await mailUser(subject, message);

        nav("/get-started/2fa-setup");
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="bg-sky-100 sm:h-[59rem] lg:w-4/12 md:w-6/12 sm:w-8/12 h-full w-full sm:rounded-3xl sm:shadow-2xl flex items-center flex-col sm:overflow-hidden overflow-scroll">
      <div className="flex flex-col items-center justify-center w-9/12 h-[8rem]">
        <p className="font-bold text-3xl text-center text-blue-600">
          Welcome {firstName ? firstName.trim() : "Worker"}! 👋
        </p>
        <p className="text-xl text-center text-slate-600">
          Let&#39;s get introduced, shall we?
        </p>
      </div>

      <div className="w-10/12 h-[48rem]">
        <form
          className="flex flex-col items-center w-full h-full"
          onSubmit={handleSubmit}
        >
          <div className="flex h-[7rem] w-full">
            <div className=" h-full w-1/2 flex flex-col justify-center items-start">
              <label
                htmlFor="firstname"
                className="text-lg font-bold text-blue-700 w-[95%] mb-2"
              >
                First Name:
              </label>
              <input
                type="text"
                id="firstname"
                className=" h-10 w-[95%] rounded-lg transition-all"
                placeholder="Zubair"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className=" h-full w-1/2 flex flex-col justify-center items-end">
              <label
                htmlFor="lastname"
                className="text-lg font-bold text-blue-700 w-[95%] mb-2"
              >
                Last Name:
              </label>
              <input
                type="text"
                id="lastname"
                className=" h-10 w-[95%] rounded-lg transition-all"
                placeholder="Ferdous"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex h-[7rem] w-full flex-col">
            <label
              htmlFor="dob"
              className="text-lg font-bold text-blue-700 w-full mb-2"
            >
              Date of Birth:
            </label>

            <input
              type="date"
              id="dob"
              className="h-10 w-full rounded-lg transition-all"
              value={dob}
              onChange={(e) => setDOB(e.target.value)}
              required
            />
          </div>

          <div className="flex h-[7rem] w-full flex-col">
            <label
              htmlFor="nil"
              className="text-lg font-bold text-blue-700 w-full mb-2"
            >
              Gender:
            </label>

            <div className="flex h-1/2 w-full overflow-hidden rounded-lg">
              <label
                htmlFor="male"
                className={`w-4/12 ${
                  gender === "male" ? "bg-sky-500 text-white" : "bg-sky-300"
                } h-full flex items-center justify-center cursor-pointer transition-all`}
              >
                <FontAwesomeIcon icon={solid("mars")} />
                &nbsp;&nbsp;Male
              </label>

              <input
                type="radio"
                className="hidden"
                id="male"
                name="gender"
                checked={gender === "male" ? true : false}
                onClick={() => {
                  setGender("male");
                }}
              />

              <label
                htmlFor="female"
                className={`w-4/12 ${
                  gender === "female" ? "bg-pink-500 text-white" : "bg-pink-300"
                } h-full flex items-center justify-center cursor-pointer transition-all`}
              >
                <FontAwesomeIcon icon={solid("venus")} />
                &nbsp;&nbsp;Female
              </label>

              <input
                type="radio"
                className="hidden"
                id="female"
                name="gender"
                checked={gender === "female" ? true : false}
                onClick={() => {
                  setGender("female");
                }}
              />

              <label
                htmlFor="others"
                className={`w-4/12 ${
                  gender === "others"
                    ? "bg-emerald-500 text-white"
                    : "bg-emerald-300"
                } h-full flex items-center justify-center cursor-pointer transition-all`}
              >
                <FontAwesomeIcon icon={solid("transgender")} />
                &nbsp;&nbsp;Others
              </label>

              <input
                type="radio"
                className="hidden"
                id="others"
                name="gender"
                checked={gender === "others" ? true : false}
                onClick={() => {
                  setGender("others");
                }}
              />
            </div>
          </div>

          <div className="flex h-[7rem] w-full flex-col">
            <label
              htmlFor="address"
              className="text-lg font-bold text-blue-700 w-full mb-2"
            >
              Address:
            </label>

            <input
              type="text"
              id="address"
              className="h-10 w-full rounded-lg transition-all"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Some Avenue, Some Place, Some City, Some Zip Code"
              required
            />
          </div>

          <div className="flex h-[7rem] w-full flex-col">
            <label
              htmlFor="phone"
              className="text-lg font-bold text-blue-700 w-full mb-2"
            >
              Phone Number:
            </label>

            <input
              type="text"
              id="phone"
              className="h-10 w-full rounded-lg transition-all"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+8801234567890"
              required
            />
          </div>

          <div className="flex h-[7rem] w-full flex-col">
            <label
              htmlFor="nid"
              className="text-lg font-bold text-blue-700 w-full mb-2"
            >
              National ID:
            </label>

            <input
              type="text"
              id="nid"
              className="h-10 w-full rounded-lg transition-all"
              value={nid}
              onChange={(e) => setNID(e.target.value)}
              placeholder="012-345-6789"
              required
            />
          </div>

          <div className="flex h-[7rem] w-full flex-col">
            <label
              htmlFor="hiringOccupation"
              className="text-lg font-bold text-blue-700 w-full mb-2"
            >
              What type of worker are you?
            </label>

            <select
              id="hiringOccupation"
              className="h-10 w-full rounded-lg transition-all"
              value={hiringOccupation}
              onChange={(e) => setHiringOccupation(e.target.value)}
              required
            >
              <option value=""> -- Select -- </option>
              <option value="nurse">👨‍⚕️👩‍⚕️🧑‍⚕️ Nurse</option>
              <option value="patient-attendant">
                💆‍♀️💆‍♂️💆 Patient Attendant
              </option>
              <option value="driver">🚗🚗🚗 Driver</option>
              <option value="homemaker">👩‍🍳👨‍🍳🧑‍🍳 Homemaker</option>
              <option value="babysitter">👩‍🍼👨‍🍼🧑‍🍼 Babysitter</option>
              <option value="security-guard">💂‍♀️💂‍♂️💂 Security Guard</option>
              <option value="caretaker">👩‍🔧👨‍🔧🧑‍🔧 Caretaker</option>
            </select>
          </div>

          <div className="flex h-[7rem] w-full flex-col">
            <label
              htmlFor="cv"
              className="text-lg font-bold text-blue-700 w-full mb-2"
            >
              Upload your CV (one PDF file only):
            </label>

            <input
              type="file"
              accept="application/pdf"
              id="cv"
              className="h-10 w-full rounded-lg transition-all"
              onChange={(e) => setCV(e.target.files[0])}
              required
            />
          </div>

          <div className="flex h-[7rem] w-full justify-center items-center">
            <button
              className="bg-blue-600 text-white text-xl rounded-lg h-12 w-40 flex items-center justify-center"
              type="submit"
            >
              Next
              <FontAwesomeIcon icon={solid("arrow-right")} className="ml-4" />
            </button>
          </div>
        </form>
      </div>

      <div id="recaptcha"></div>
    </div>
  );
}

export default GetStartedWorker;
