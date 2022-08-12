import React, { useState, useRef, useEffect } from "react";
import {
  solid,
  regular,
  brands,
} from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AdminSidebar from "./../../components/admin/AdminSidebar";
import AdminProfileSide from "./../../components/admin/AdminProfileSide";
import "./../../styles/AdminApprovals.css";

function Approval({ data, onCVBtnClick, onApproveBtnClick, onRejectBtnClick }) {
  return (
    <div className="bg-slate-100 w-full h-[6rem] rounded-xl flex justify-between items-center shadow-md border-2 px-8 my-2 flex-shrink-0">
      <figure className="flex flex-col h-full justify-center">
        <p className="text-lg font-bold mb-1">
          {data.firstName} {data.lastName} |{" "}
          {data.hiringOccupation.toUpperCase()}
        </p>
        <figcaption className="text-sm">
          {data.email} | {data.phoneNumber}
        </figcaption>
      </figure>

      <div className="flex justify-evenly items-center h-full w-48">
        <button
          className="bg-sky-500 rounded-xl w-12 h-12 flex items-center justify-center transition-all hover:bg-sky-600"
          onClick={(e) => onCVBtnClick(e, data.cvURL, data.email)}
        >
          <FontAwesomeIcon
            icon={solid("file-circle-check")}
            className="text-center text-white text-2xl"
          />
        </button>
        <button
          className="bg-green-500 rounded-xl w-12 h-12 flex items-center justify-center transition-all hover:bg-green-600"
          onClick={(e) => onApproveBtnClick(e, data.email)}
        >
          <FontAwesomeIcon
            icon={solid("check")}
            className="text-center text-white text-2xl"
          />
        </button>
        <button
          className="bg-red-700 rounded-xl w-12 h-12 flex items-center justify-center transition-all hover:bg-red-800"
          onClick={(e) => onRejectBtnClick(e, data.email)}
        >
          <FontAwesomeIcon
            icon={solid("times")}
            className="text-center text-white text-2xl"
          />
        </button>
      </div>
    </div>
  );
}

function AdminApprovals() {
  const {
    currentUser,
    logout,
    getUnapprovedWorkersData,
    approveWorker,
    rejectWorker,
  } = useAuth();
  const [approvals, setApprovals] = useState([]);
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [cvURL, setCvURL] = useState(null);
  const [cvId, setCvId] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    let isMounted = true;

    async function getApprovals() {
      try {
        const data = await getUnapprovedWorkersData();

        setApprovals(data);
      } catch (error) {
        console.log(error);
      }
    }

    getApprovals();

    return () => {
      isMounted = false;
    };
  }, [getUnapprovedWorkersData]);

  return (
    <div className="h-[85%] w-[90%] flex items-center justify-center sm:bg-slate-100 overflow-hidden shadow-xl rounded-3xl">
      <div
        className={
          !cvModalOpen
            ? "hidden"
            : "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0007] h-full w-full flex items-center justify-center"
        }
      >
        <div className="bg-slate-100 h-5/6 w-4/6 opacity-100 rounded-3xl shadow-2xl flex flex-col items items-center justify-center">
          <div className="w-8/12 h-1/6 flex items-center justify-evenly">
            <p className="text-2xl font-bold">Viewing CV of {cvId}</p>

            <button className="bg-red-700 rounded-xl w-12 h-12 flex items-center justify-center transition-all hover:bg-red-800" onClick={() => {
              setCvModalOpen(false);
              setCvURL(null);
              setCvId(null);
            }}>
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

      <AdminSidebar />

      <div className="h-full w-8/12 flex flex-col items-center bg-slate-50">
        <div className="h-[12rem] w-11/12 flex items-center">
          <p className="text-[2.5rem] font-bold">Worker Approvals</p>
        </div>

        <div
          className="h-[40rem] w-11/12 flex flex-col items-center overflow-x-hidden overflow-y-scroll scroll-smooth"
          id="approvals-panel"
        >
          {approvals.length > 0 ? (
            approvals.map((approval) => (
              <Approval
                key={approval.id}
                data={approval.data}
                onCVBtnClick={(e, url, id) => {
                  e.preventDefault();

                  setCvURL(process.env.REACT_APP_API_BASE_URL + url);
                  setCvModalOpen(true);
                  setCvId(id);
                }}
                onApproveBtnClick={async (e, id) => {
                  e.preventDefault();

                  try {
                    await approveWorker(id);
                    alert("Worker approved successfully...");
                    window.location.reload();
                  } catch (error) {
                    console.log(error);
                  }
                }}
                onRejectBtnClick={async (e, id) => {
                  e.preventDefault();

                  try {
                    await rejectWorker(id);
                    alert("Worker rejected successfully...");
                    window.location.reload();
                  } catch (error) {
                    console.log(error);
                  }
                }}
              />
            ))
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-4xl text-center text-gray-400 flex flex-col">
                <FontAwesomeIcon
                  icon={solid("bolt")}
                  className="text-center text-gray-400 text-6xl my-8"
                />
                You are all caught up!
              </p>
            </div>
          )}
        </div>
      </div>

      <AdminProfileSide />
    </div>
  );
}

export default AdminApprovals;
