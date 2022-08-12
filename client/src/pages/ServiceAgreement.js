import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import html2pdf from "html2pdf.js";
import {
  solid,
  regular,
  brands,
} from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { firebaseDB, firebaseFirestore } from "./../firebase";

function ServiceAgreement() {
  const location = useLocation();
  const { decodeServiceAgreementToken, mailUser, currentUser } = useAuth();
  const [loaded, setLoaded] = useState(false);
  const [decoded, setDecoded] = useState({});

  const nav = useNavigate();

  function savepdf() {
    let opt = {
      margin: 0,
      filename: "file.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 10 },
      jsPDF: {
        unit: "in",
        format: "letter",
        orientation: "portrait",
      },
    };

    html2pdf()
      .set(opt)
      .from(document.getElementById("pdf"))
      .save("loklagbe_service_agreement.pdf");
  }

  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");
    const noMail = new URLSearchParams(location.search).get("nomail");

    async function ahem() {
      try {
        if (token) {
          const decode = await decodeServiceAgreementToken(token);

          setDecoded(decode);
          setLoaded(true);

          if (decoded.clientEmail && decoded.workerEmail) {
            savepdf();
          }

          if (!noMail) {
            let clientSubject = "Recruitment Successful";
            let clientMessage = `# Dear client ${
              decoded.clientName
            }, your recruitment was a success!\n### Recruitment Info:\n**Name:** ${
              decoded.workerName
            }\n\n**Working Catagory:** ${decoded.serviceName}\n\n**Fee:** ${
              decoded.totalServiceFee
            } BDT (5% media fee included)\n\n\nIf you missed to collect the service agreement legal contract, [click here](${
              window.location.href + "&nomail=yes"
            }) to collect it.\n\nYou are highly requested to move on with payment as soon as possible. [Pay now](${
              window.location.protocol
            }//${
              window.location.host
            }/payment-gateway?token=${token})\nIf you have any further queries, please contact us at this email: **loklagbe.team@gmail.com**!\n\n### Thank you for choosing **Lok Lagbe**!\n\nLokLagbe Team 💪`;

            let workerSubject = `You are recruited by ${decoded.clientName}`;
            let workerMessage = `# Hi ${
              decoded.workerName
            }, you are recruited by ${
              decoded.clientName
            }!\n### Recruitment Info:\n**Recruited By:** ${
              decoded.clientName
            }\n\n**Working Catagory:** ${
              decoded.serviceName
            }\n\n**Your Fee:** ${
              decoded.negotiatedServiceFee
            } BDT\n\n\nYou are requested to collect the service agreement legal contract, [click here](${
              window.location.href + "&nomail=yes"
            }) to collect it.\n\nIf you have any further query, please contact us at this email: **loklagbe.team@gmail.com**!\n\n### Thank you for choosing **Lok Lagbe**!\n\nLokLagbe Team 💪`;

            if (decoded.clientEmail && decoded.workerEmail) {
              await mailUser(clientSubject, clientMessage, decoded.clientEmail);
              await mailUser(workerSubject, workerMessage, decoded.workerEmail);

              let sessionsRef = firebaseFirestore.collection(
                firebaseDB,
                "sessions"
              );
              await firebaseFirestore.addDoc(sessionsRef, {
                clientName: decoded.clientName,
                clientGender: decoded.clientGender,
                clientEmail: decoded.clientEmail,
                clientPhoneNumber: decoded.clientPhoneNumber,
                clientAvatar: currentUser.photoURL,
                address: decoded.completeAddress,
                jobDescription: decoded.jobDescription,
                workerName: decoded.workerName,
                workerGender: decoded.workerGender,
                workerEmail: decoded.workerEmail,
                workerPhoneNumber: decoded.workerPhoneNumber,
                serviceName: decoded.serviceName,
                negotiatedServiceFee: decoded.negotiatedServiceFee,
                totalServiceFee: decoded.totalServiceFee,
                startingDate: decoded.startingDate,
                endingDate: decoded.endingDate,
                hourlyDurationFrom: new Date(
                  "2007-10-04T" + decoded.hourlyDurationFrom + "Z"
                ).toLocaleTimeString("en-US", {
                  timeZone: "UTC",
                  hour12: true,
                  hour: "numeric",
                  minute: "numeric",
                }),
                hourlyDurationTo: new Date(
                  "2007-10-04T" + decoded.hourlyDurationTo + "Z"
                ).toLocaleTimeString("en-US", {
                  timeZone: "UTC",
                  hour12: true,
                  hour: "numeric",
                  minute: "numeric",
                }),
                timestamp: firebaseFirestore.Timestamp.fromDate(new Date()),
                contract: window.location.href + "&nomail=yes",
                status: "pendingPayment",
              });
            }

            setTimeout(() => {
              nav("/payment-gateway?token=" + token);
            }, 3000);
          }
        } else {
          return;
        }
      } catch (error) {
        console.log(error);
      }
    }

    ahem();
  }, [
    currentUser.photoURL,
    decodeServiceAgreementToken,
    decoded.clientEmail,
    decoded.clientGender,
    decoded.clientName,
    decoded.clientPhoneNumber,
    decoded.completeAddress,
    decoded.endingDate,
    decoded.hourlyDurationFrom,
    decoded.hourlyDurationTo,
    decoded.jobDescription,
    decoded.negotiatedServiceFee,
    decoded.serviceName,
    decoded.startingDate,
    decoded.totalServiceFee,
    decoded.workerEmail,
    decoded.workerGender,
    decoded.workerName,
    decoded.workerPhoneNumber,
    location.search,
    mailUser,
    nav,
  ]);

  return loaded ? (
    <div className="p-8 min-h-screen bg-[#14131a] flex flex-col justify-center items-center font-sans">
      <main
        className="p-8 bg-white w-[734px] min-h-[100px] flex flex-col items-center"
        id="pdf"
      >
        <img
          src={require("./../assets/full_logo.png")}
          alt="logo"
          className="w-[16rem] mb-8"
        />

        <section className="w-full h-[15rem] flex justify-center items-center mb-8">
          <div className="w-1/2 h-full flex flex-col justify-center items-center">
            <table className="w-[70%] border-collapse border-solid border border-black py-2 px-4 text-sm">
              <thead className="border-collapse border-solid border border-black py-2 px-4">
                <tr className="border-collapse border-solid border border-black py-2 px-4">
                  <th
                    colSpan="2"
                    className="border-collapse border-solid border border-black py-2 px-4"
                  >
                    Client Information
                  </th>
                </tr>
              </thead>
              <tbody className="border-collapse border-solid border border-black py-2 px-4">
                <tr className="border-collapse border-solid border border-black py-2 px-4">
                  <th className="border-collapse border-solid border border-black py-2 px-4">
                    Full Name
                  </th>
                  <td className="border-collapse border-solid border border-black py-2 px-4">
                    {decoded.clientName}
                  </td>
                </tr>
                <tr className="border-collapse border-solid border border-black py-2 px-4">
                  <th className="border-collapse border-solid border border-black py-2 px-4">
                    Gender
                  </th>
                  <td className="border-collapse border-solid border border-black py-2 px-4">
                    {decoded.clientGender[0].toUpperCase() +
                      decoded.clientGender.substring(1)}
                  </td>
                </tr>
                <tr className="border-collapse border-solid border border-black py-2 px-4">
                  <th className="border-collapse border-solid border border-black py-2 px-4">
                    E-mail
                  </th>
                  <td className="border-collapse border-solid border border-black py-2 px-4">
                    {decoded.clientEmail}
                  </td>
                </tr>
                <tr className="border-collapse border-solid border border-black py-2 px-4">
                  <th className="border-collapse border-solid border border-black py-2 px-4">
                    Phone No.
                  </th>
                  <td className="border-collapse border-solid border border-black py-2 px-4">
                    {decoded.clientPhoneNumber}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="w-1/2 h-full flex flex-col justify-center items-center">
            <table className="w-[70%] border-collapse border-solid border border-black py-2 px-4 text-sm">
              <thead className="border-collapse border-solid border border-black py-2 px-4">
                <tr className="border-collapse border-solid border border-black py-2 px-4">
                  <th
                    colSpan="2"
                    className="border-collapse border-solid border border-black py-2 px-4"
                  >
                    Worker Information
                  </th>
                </tr>
              </thead>
              <tbody className="border-collapse border-solid border border-black py-2 px-4">
                <tr className="border-collapse border-solid border border-black py-2 px-4">
                  <th className="border-collapse border-solid border border-black py-2 px-4">
                    Full Name
                  </th>
                  <td className="border-collapse border-solid border border-black py-2 px-4">
                    {decoded.workerName}
                  </td>
                </tr>
                <tr className="border-collapse border-solid border border-black py-2 px-4">
                  <th className="border-collapse border-solid border border-black py-2 px-4">
                    Gender
                  </th>
                  <td className="border-collapse border-solid border border-black py-2 px-4">
                    {decoded.workerGender[0].toUpperCase() +
                      decoded.workerGender.substring(1)}
                  </td>
                </tr>
                <tr className="border-collapse border-solid border border-black py-2 px-4">
                  <th className="border-collapse border-solid border border-black py-2 px-4">
                    E-mail
                  </th>
                  <td className="border-collapse border-solid border border-black py-2 px-4">
                    {decoded.workerEmail}
                  </td>
                </tr>
                <tr className="border-collapse border-solid border border-black py-2 px-4">
                  <th className="border-collapse border-solid border border-black py-2 px-4">
                    Phone No.
                  </th>
                  <td className="border-collapse border-solid border border-black py-2 px-4">
                    {decoded.workerPhoneNumber}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="w-full min-h-[25rem] flex flex-col justify-center items-center mb-8">
          <table className="w-[90%] border-collapse border-solid border border-black py-2 px-4 mb-4 text-sm">
            <thead className="border-collapse border-solid border border-black py-2 px-4">
              <tr className="border-collapse border-solid border border-black py-2 px-4">
                <th
                  colSpan="5"
                  className="border-collapse border-solid border border-black py-2 px-4"
                >
                  Service Information
                </th>
              </tr>
              <tr className="border-collapse border-solid border border-black py-2 px-4">
                <th className="border-collapse border-solid border border-black py-2 px-4">
                  Service Name
                </th>
                <th className="border-collapse border-solid border border-black py-2 px-4">
                  Start Date
                </th>
                <th className="border-collapse border-solid border border-black py-2 px-4">
                  End Date
                </th>
                <th className="border-collapse border-solid border border-black py-2 px-4">
                  Start Time
                </th>
                <th className="border-collapse border-solid border border-black py-2 px-4">
                  End Time
                </th>
              </tr>
            </thead>
            <tbody className="border-collapse border-solid border border-black py-2 px-4">
              <tr className="border-collapse border-solid border border-black py-2 px-4">
                <td className="border-collapse border-solid border border-black py-2 px-4">
                  {decoded.serviceName}
                </td>
                <td className="border-collapse border-solid border border-black py-2 px-4">
                  {decoded.startingDate}
                </td>
                <td className="border-collapse border-solid border border-black py-2 px-4">
                  {decoded.endingDate}
                </td>
                <td className="border-collapse border-solid border border-black py-2 px-4">
                  {new Date(
                    "2007-10-04T" + decoded.hourlyDurationFrom + "Z"
                  ).toLocaleTimeString("en-US", {
                    timeZone: "UTC",
                    hour12: true,
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </td>
                <td className="border-collapse border-solid border border-black py-2 px-4">
                  {new Date(
                    "2007-10-04T" + decoded.hourlyDurationTo + "Z"
                  ).toLocaleTimeString("en-US", {
                    timeZone: "UTC",
                    hour12: true,
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </td>
              </tr>
            </tbody>
          </table>

          <p className="w-[90%] my-2">
            <b>Address: </b>
            {decoded.completeAddress}
          </p>

          <p className="w-[90%] my-1">
            <b>Job Description: </b>
            <br />
            {decoded.jobDescription}
          </p>

          <p className="w-[90%] my-2 text-right">
            <b>Negotiated Service Fee: </b>
            {decoded.negotiatedServiceFee} BDT
            <br />
            <b>Total Service Fee: </b>
            {decoded.totalServiceFee} BDT (5% media fee included)
          </p>
        </section>

        <footer className="w-[90%] text-sm">
          <p className="my-2 font-bold">
            N.B: This is an automatically generated contract.
          </p>
          <p className="my-2">
            <span className="font-bold">&copy; Lok Lagbe, 2022</span>
            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;Created At:&nbsp;&nbsp;
            {new Date(decoded.createdAt).toLocaleTimeString("en-US", {
              hour12: true,
              hour: "numeric",
              minute: "numeric",
            })}
            &nbsp;&nbsp;
            {new Date(decoded.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </footer>
      </main>

      {/*
      <button
        type="button"
        onClick={() => savepdf()}
        className="absolute px-4 py-2 bg-blue-600 z-50 top-4 right-8 text-white font-semibold text-lg rounded-lg transition-all flex justify-center items-center hover:bg-blue-700"
      >
        <FontAwesomeIcon icon={solid("file-pdf")} />
        &nbsp;&nbsp;Download As PDF
      </button>

      <button
        type="button"
        onClick={() => print()}
        className="absolute px-4 py-2 bg-blue-600 z-50 top-20 right-8 text-white font-semibold text-lg rounded-lg transition-all flex justify-center items-center hover:bg-blue-700"
      >
        <FontAwesomeIcon icon={solid("print")} />
        &nbsp;&nbsp;Print
      </button>*/}
    </div>
  ) : (
    <LoadingScreen />
  );
}

export default ServiceAgreement;
