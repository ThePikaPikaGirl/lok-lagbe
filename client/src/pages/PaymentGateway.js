import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import {
  solid,
  regular,
  brands,
} from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { firebaseDB, firebaseFirestore } from "./../firebase";

function BKashStage1({ decoded, number, setNumber, onConfirm }) {
  return (
    <div className="bg-slate-100 w-6/12 h-4/6 border-[0.2px] border-gray-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">
      <p className="absolute text-white top-2 right-2 text-xs select-none">
        It&#39;s 100% fake! It&#39;s just a demo...
      </p>

      <div className="flex justify-center items-center w-full h-1/6 bg-bkash-pattern select-none">
        <p className="font-semibold text-white text-3xl">bKash</p>
        <div className="h-20 w-20 overflow-hidden">
          <img
            src={require("../assets/bkash-logo.png")}
            alt="bkash logo"
            className="h-full w-full object-cover"
            draggable="false"
          />
        </div>
        <p className="font-semibold text-white text-3xl">Payment</p>
      </div>

      <div className="flex flex-col justify-center items-center w-full h-5/6">
        <div className="flex justify-between items-center w-11/12 h-1/6 select-none">
          <div className="flex items-center h-full w-5/12">
            <div className="h-14 w-14 rounded-full overflow-hidden mr-4 bg-bkash border border-gray-400">
              <img
                src={require("../assets/bkash-logo.png")}
                alt="profile"
                className="h-full w-full object-cover"
                draggable="false"
              />
            </div>

            <p className="font-semibold text-xl">LokLagbeAppMerchant</p>
          </div>

          <div className="flex items-center justify-end h-full w-2/12">
            <p className="font-semibold text-xl">
              <span className="text-3xl">৳</span> {decoded.totalServiceFee}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center w-full h-4/6">
          <div className="flex flex-col justify-center items-center w-11/12 h-5/6 bg-bkash-pattern">
            <p className="text-xl text-center text-white my-4">
              Your bKash Account number
            </p>
            <input
              type="text"
              placeholder="e.g 01XXXXXXXXX"
              className="w-9/12 h-14 text-xl text-center"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
            <p className="text-xl text-center text-white my-4">
              By clicking on <span className="font-semibold">Confirm</span>, you
              are agreeing to the&nbsp;
              <span className="font-semibold underline cursor-pointer">
                terms & conditions
              </span>
            </p>
          </div>
          <div className="flex justify-center items-center w-11/12 h-1/6">
            <button
              type="button"
              className="w-1/2 h-full bg-slate-300 text-white text-xl font-semibold border border-gray-400 transition-all hover:bg-slate-400"
            >
              CANCEL
            </button>
            <button
              type="button"
              className="w-1/2 h-full bg-slate-300 text-xl font-semibold border border-gray-400 transition-all hover:bg-slate-400"
              onClick={onConfirm}
            >
              CONFIRM
            </button>
          </div>
        </div>
        <div className="flex justify-center items-center w-full h-1/6 bg-slate-200">
          <div className="h-10 w-10 rounded-full overflow-hidden mr-4 bg-bkash flex justify-center items-center">
            <FontAwesomeIcon
              icon={solid("phone")}
              className="text-white text-lg"
            />
          </div>

          <p className="text-2xl font-semibold font-mono text-bkash">16247</p>
        </div>
      </div>
    </div>
  );
}

function BKashStage2({ decoded, number, code, setCode, onConfirm }) {
  return (
    <div className="bg-slate-100 w-6/12 h-4/6 border-[0.2px] border-gray-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">
      <p className="absolute text-white top-2 right-2 text-xs select-none">
        It&#39;s 100% fake! It&#39;s just a demo...
      </p>

      <div className="flex justify-center items-center w-full h-1/6 bg-bkash-pattern select-none">
        <p className="font-semibold text-white text-3xl">bKash</p>
        <div className="h-20 w-20 overflow-hidden">
          <img
            src={require("../assets/bkash-logo.png")}
            alt="bkash logo"
            className="h-full w-full object-cover"
            draggable="false"
          />
        </div>
        <p className="font-semibold text-white text-3xl">Payment</p>
      </div>

      <div className="flex flex-col justify-center items-center w-full h-5/6">
        <div className="flex justify-between items-center w-11/12 h-1/6 select-none">
          <div className="flex items-center h-full w-5/12">
            <div className="h-14 w-14 rounded-full overflow-hidden mr-4 bg-bkash border border-gray-400">
              <img
                src={require("../assets/bkash-logo.png")}
                alt="profile"
                className="h-full w-full object-cover"
                draggable="false"
              />
            </div>

            <p className="font-semibold text-xl">LokLagbeAppMerchant</p>
          </div>

          <div className="flex items-center justify-end h-full w-2/12">
            <p className="font-semibold text-xl">
              <span className="text-3xl">৳</span> {decoded.totalServiceFee}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center w-full h-4/6">
          <div className="flex flex-col justify-center items-center w-11/12 h-5/6 bg-bkash-pattern">
            <p className="text-xl text-center text-white my-4">
              Enter verification code sent to {number.substring(0, 3)} XX XXX{" "}
              {number.substring(8, 11)}
            </p>
            <input
              type="text"
              placeholder="bKash Verification Code"
              className="w-9/12 h-14 text-xl text-center"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <p className="text-xl text-center text-white my-4">
              Don&#39;t recieve code?&nbsp;
              <span className="font-semibold underline cursor-pointer">
                Resend code
              </span>
            </p>
          </div>
          <div className="flex justify-center items-center w-11/12 h-1/6">
            <button
              type="button"
              className="w-1/2 h-full bg-slate-300 text-white text-xl font-semibold border border-gray-400 transition-all hover:bg-slate-400"
            >
              CANCEL
            </button>
            <button
              type="button"
              className="w-1/2 h-full bg-slate-300 text-xl font-semibold border border-gray-400 transition-all hover:bg-slate-400"
              onClick={onConfirm}
            >
              CONFIRM
            </button>
          </div>
        </div>
        <div className="flex justify-center items-center w-full h-1/6 bg-slate-200">
          <div className="h-10 w-10 rounded-full overflow-hidden mr-4 bg-bkash flex justify-center items-center">
            <FontAwesomeIcon
              icon={solid("phone")}
              className="text-white text-lg"
            />
          </div>

          <p className="text-2xl font-semibold font-mono text-bkash">16247</p>
        </div>
      </div>
    </div>
  );
}

function BKashStage3({ decoded, number, pin, setPin, onConfirm }) {
  return (
    <div className="bg-slate-100 w-6/12 h-4/6 border-[0.2px] border-gray-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">
      <p className="absolute text-white top-2 right-2 text-xs select-none">
        It&#39;s 100% fake! It&#39;s just a demo...
      </p>

      <div className="flex justify-center items-center w-full h-1/6 bg-bkash-pattern select-none">
        <p className="font-semibold text-white text-3xl">bKash</p>
        <div className="h-20 w-20 overflow-hidden">
          <img
            src={require("../assets/bkash-logo.png")}
            alt="bkash logo"
            className="h-full w-full object-cover"
            draggable="false"
          />
        </div>
        <p className="font-semibold text-white text-3xl">Payment</p>
      </div>

      <div className="flex flex-col justify-center items-center w-full h-5/6">
        <div className="flex justify-between items-center w-11/12 h-1/6 select-none">
          <div className="flex items-center h-full w-5/12">
            <div className="h-14 w-14 rounded-full overflow-hidden mr-4 bg-bkash border border-gray-400">
              <img
                src={require("../assets/bkash-logo.png")}
                alt="profile"
                className="h-full w-full object-cover"
                draggable="false"
              />
            </div>

            <p className="font-semibold text-xl">LokLagbeAppMerchant</p>
          </div>

          <div className="flex items-center justify-end h-full w-2/12">
            <p className="font-semibold text-xl">
              <span className="text-3xl">৳</span> {decoded.totalServiceFee}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center w-full h-4/6">
          <div className="flex flex-col justify-center items-center w-11/12 h-5/6 bg-bkash-pattern">
            <p className="text-xl text-center text-white my-4">
              Enter PIN of your bKash Account number ({number.substring(0, 3)}{" "}
              XX XXX {number.substring(8, 11)})
            </p>
            <input
              type="password"
              placeholder="Enter PIN"
              className="w-9/12 h-14 text-xl text-center"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
          </div>
          <div className="flex justify-center items-center w-11/12 h-1/6">
            <button
              type="button"
              className="w-1/2 h-full bg-slate-300 text-white text-xl font-semibold border border-gray-400 transition-all hover:bg-slate-400"
            >
              CANCEL
            </button>
            <button
              type="button"
              className="w-1/2 h-full bg-slate-300 text-xl font-semibold border border-gray-400 transition-all hover:bg-slate-400"
              onClick={onConfirm}
            >
              CONFIRM
            </button>
          </div>
        </div>
        <div className="flex justify-center items-center w-full h-1/6 bg-slate-200">
          <div className="h-10 w-10 rounded-full overflow-hidden mr-4 bg-bkash flex justify-center items-center">
            <FontAwesomeIcon
              icon={solid("phone")}
              className="text-white text-lg"
            />
          </div>

          <p className="text-2xl font-semibold font-mono text-bkash">16247</p>
        </div>
      </div>
    </div>
  );
}

function PaymentGateway() {
  const location = useLocation();
  const { decodeServiceAgreementToken, mailUser } = useAuth();
  const [loaded, setLoaded] = useState(false);
  const [decoded, setDecoded] = useState({});
  const [stage, setStage] = useState(1);
  const [number, setNumber] = useState("");
  const [code, setCode] = useState("");
  const [pin, setPin] = useState("");

  const nav = useNavigate();

  const onPayment = async () => {
    try {
      let query = firebaseFirestore.query(
        firebaseFirestore.collection(firebaseDB, "sessions"),
        firebaseFirestore.where("clientEmail", "==", decoded.clientEmail)
      );

      let sessions = await firebaseFirestore.getDocs(query);

      let sessionId = sessions.docs[0].id;

      await firebaseFirestore.updateDoc(
        firebaseFirestore.doc(firebaseDB, `sessions/${sessionId}`),
        {
          status: "paid",
        }
      );

      let clientSubject = "Payment Successful";
      let clientMessage = `# Dear client ${decoded.clientName}, your payment was a success!\n### Recruitment Info:\n**Name:** ${decoded.workerName}\n\n**Working Catagory:** ${decoded.serviceName}\n\n**Fee:** ${decoded.totalServiceFee} BDT (5% media fee included)\n\n\nWish you a plesantful experience. If you have any further query/complain, please contact us at this email: **loklagbe.team@gmail.com**!\n\n### Thank you for choosing **Lok Lagbe**!\n\nLokLagbe Team 💪`;

      let workerSubject = `You are now officially recruited by ${decoded.clientName}`;
      let workerMessage = `# Hi ${decoded.workerName}, your client successfully made the payment through bKash!\n### Recruitment Info:\n**Recruited By:** ${decoded.clientName}\n\n**Working Catagory:** ${decoded.serviceName}\n\n**Your Fee:** ${decoded.negotiatedServiceFee} BDT\n\n\nNow you can start collaborating with your client safely. You will automatically get paid in **five** installments (e.g. in case of 10,000 BDT for 10 days, you will get paid with 2,000 BDT after every 2 days). If you have any further queries, please contact us at this email: **loklagbe.team@gmail.com**!\n\n### Thank you for choosing **Lok Lagbe**!\n\nLokLagbe Team 💪`;

      await mailUser(clientSubject, clientMessage, decoded.clientEmail);
      await mailUser(workerSubject, workerMessage, decoded.workerEmail);

      nav("/client/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");

    async function ahem() {
      try {
        if (token) {
          const decode = await decodeServiceAgreementToken(token);

          setDecoded(decode);
          setLoaded(true);
        }
      } catch (error) {
        console.log(error);
      }
    }

    ahem();
  }, [decodeServiceAgreementToken, location.search]);

  return loaded ? (
    <div className="h-screen w-full bg-slate-800 flex flex-col justify-center items-center">
      <div className="w-6/12 h-[6rem] flex items-center justify-center">
        <div className="w-10/12 h-4 rounded-full border border-bkash overflow-hidden flex items-center">
          {stage === 1 && (
            <>
              <div className="w-2/6 h-4 rounded-r-full bg-bkash"></div>
              <div className="w-2/6 h-4 rounded-r-full"></div>
              <div className="w-2/6 h-4 rounded-r-full"></div>
            </>
          )}
          {stage === 2 && (
            <>
              <div className="w-2/6 h-4 bg-bkash"></div>
              <div className="w-2/6 h-4 rounded-r-full bg-bkash border-l-2"></div>
              <div className="w-2/6 h-4 rounded-r-full"></div>
            </>
          )}
          {stage === 3 && (
            <>
              <div className="w-2/6 h-4 bg-bkash"></div>
              <div className="w-2/6 h-4 bg-bkash border-l-2"></div>
              <div className="w-2/6 h-4 bg-bkash rounded-r-full border-l-2"></div>
            </>
          )}
        </div>
      </div>

      {stage === 1 && (
        <BKashStage1
          decoded={decoded}
          number={number}
          setNumber={setNumber}
          onConfirm={(e) => {
            e.preventDefault();

            if (number.length !== 11) {
              alert("Number must be of 11 digits");
              setNumber("");
            } else {
              setStage(2);
            }
          }}
        />
      )}
      {stage === 2 && (
        <BKashStage2
          decoded={decoded}
          number={number}
          code={code}
          setCode={setCode}
          onConfirm={(e) => {
            e.preventDefault();

            if (code === "12345") {
              setStage(3);
            } else {
              alert("Something Went Wrong! Please Try Again!");
              window.location.reload();
            }
          }}
        />
      )}
      {stage === 3 && (
        <BKashStage3
          decoded={decoded}
          number={number}
          pin={pin}
          setPin={setPin}
          onConfirm={(e) => {
            e.preventDefault();

            if (pin === "1234") {
              alert("Payment was successful! Teleporting to Dashboard...");
              onPayment();
            } else {
              alert(
                "Something Went Wrong! Maybe your pin was incorrect! Please Try Again!"
              );
              window.location.reload();
            }
          }}
        />
      )}
    </div>
  ) : (
    <LoadingScreen />
  );
}

export default PaymentGateway;
