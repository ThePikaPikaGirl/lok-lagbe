import React, { useState, useRef, useEffect } from "react";
import {
  solid,
  regular,
  brands,
} from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, Link, Outlet } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import ClientWorkerData from "../../../components/client/ClientWorkerData";

function ClientSearchSecurityGuard() {
  const [data, setData] = useState([]);
  const [gender, setGender] = useState("all");

  const filterWorker = (occupation, gender) => {
    const workersData = JSON.parse(localStorage.getItem("approvedWorkers"));

    if (gender === "all") {
      let temp = workersData.filter((datum) => {
        return datum.data.hiringOccupation === occupation;
      });

      setData(temp);
    } else {
      let temp = workersData.filter((datum) => {
        return datum.data.hiringOccupation === occupation;
      });

      let temp2 = temp.filter((datum) => {
        return datum.data.gender === gender;
      });

      setData(temp2);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    let isMounted = true;

    filterWorker("security-guard", gender);

    return () => {
      isMounted = false;
    };
  }, [gender]);

  return (
    <>
      <div className="flex w-[95%] h-[4rem] items-center overflow-hidden px-4 bg-sky-200">
        <div className="flex w-full h-full items-center justify-center overflow-hidden">
          <div className="w-[6rem] h-1/2 flex justify-start items-center flex-shrink-0 transition-all">
            <p className="text-md font-bold">Search By:</p>
          </div>
          <div className="w-[6rem] h-1/2 flex justify-start items-center flex-shrink-0 transition-all">
            <input
              type="radio"
              name="gender"
              id="male"
              value="male"
              className=""
              // checked={maleSelected}
              // onChange={(e) => setMaleSelected(e.target.checked)}
              checked={gender === "male"}
              onChange={(e) => setGender(e.target.value)}
            />
            <label
              htmlFor="male"
              className="text-md font-bold ml-2 cursor-pointer"
            >
              Male
            </label>
          </div>
          <div className="w-[7rem] h-1/2 flex justify-start items-center flex-shrink-0 transition-all">
            <input
              type="radio"
              name="gender"
              id="female"
              value="female"
              className=""
              // checked={femaleSelected}
              // onChange={(e) => setFemaleSelected(e.target.checked)}
              checked={gender === "female"}
              onChange={(e) => setGender(e.target.value)}
            />
            <label
              htmlFor="female"
              className="text-md font-bold ml-2 cursor-pointer"
            >
              Female
            </label>
          </div>
          <div className="w-[6rem] h-1/2 flex justify-start items-center flex-shrink-0 transition-all">
            <input
              type="radio"
              name="gender"
              id="all"
              value="all"
              className=""
              checked={gender === "all"}
              onChange={(e) => setGender(e.target.value)}
            />
            <label
              htmlFor="all"
              className="text-md font-bold ml-2 cursor-pointer"
            >
              All
            </label>
          </div>
        </div>
      </div>

      <div
        className="h-[35rem] w-[95%] flex flex-col items-center overflow-x-hidden overflow-y-scroll scroll-smooth bg-sky-100 rounded-b-xl"
        id="scrollview"
      >
        {data.length > 0 ? (
          data.map((datum) => <ClientWorkerData key={datum.id} data={datum.data} />)
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <p className="text-4xl text-center text-gray-400 flex flex-col">
              <FontAwesomeIcon
                icon={solid("times")}
                className="text-center text-gray-400 text-6xl my-8"
              />
              Sorry, no workers found!
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default ClientSearchSecurityGuard;
