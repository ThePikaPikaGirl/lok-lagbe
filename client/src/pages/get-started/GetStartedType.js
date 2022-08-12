import React, { useState, useRef, useEffect } from "react";
import {
  solid,
  regular,
  brands,
} from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function GetStartedType() {
  const [client, setClient] = useState(true);
  const [worker, setWorker] = useState(false);

  const nav = useNavigate();

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    let isMounted = true;

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (client) {
      nav("/get-started/client");
    } else if (worker) {
      nav("/get-started/worker");
    }
  };

  return (
    <div className="bg-sky-100 sm:h-[26rem] lg:w-4/12 md:w-6/12 sm:w-8/12 h-full w-full sm:rounded-3xl sm:shadow-2xl flex items-center flex-col sm:overflow-hidden overflow-scroll">
      <p className="font-bold text-3xl text-center flex items-center justify-center w-full h-2/6 text-blue-600">
        Which role are you applying for?
      </p>

      <div className="w-full h-2/6 flex items-center justify-center">
        <form className="h-12 w-60 flex rounded-lg overflow-hidden">
          <div
            className={
              client
                ? "bg-blue-600 h-full w-1/2 flex items-center justify-center"
                : "bg-slate-400 h-full w-1/2 flex items-center justify-center"
            }
          >
            <label
              className="text-white text-xl cursor-pointer"
              htmlFor="clientBtn"
            >
              Client
            </label>
            <input
              className="hidden"
              id="clientBtn"
              type="checkbox"
              checked={client}
              onClick={() => {
                setClient(true);
                setWorker(false);
              }}
            />
          </div>

          <div
            className={
              worker
                ? "bg-blue-600 h-full w-1/2 flex items-center justify-center"
                : "bg-slate-400 h-full w-1/2 flex items-center justify-center"
            }
          >
            <label
              className="text-white text-xl cursor-pointer"
              htmlFor="workerBtn"
            >
              Worker
            </label>
            <input
              className="hidden"
              id="workerBtn"
              type="checkbox"
              checked={worker}
              onClick={() => {
                setClient(false);
                setWorker(true);
              }}
            />
          </div>
        </form>
      </div>

      <div className="w-full h-2/6 flex items-center justify-center">
        <button
          className="bg-blue-600 text-white text-xl rounded-lg h-12 w-40 flex items-center justify-center"
          type="button"
          onClick={handleSubmit}
        >
          Next
          <FontAwesomeIcon icon={solid("arrow-right")} className="ml-4" />
        </button>
      </div>
    </div>
  );
}

export default GetStartedType;
