import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import clippath from "./../assets/clipper.png";

function Home() {
  return (
    <div className="w-screen">
      <Navbar />

      <header className="bg-gradient-to-r from-cyan-500 to-blue-500 h-screen relative flex items-center justify-start">
        <img
          src={clippath}
          alt=""
          className="h-full w-full absolute z-30"
          draggable="false"
        />

        <div className="m-20 z-40">
          <p className="text-4xl font-bold font-['Montserrat'] my-8 text-white">
            Need a person to help you?
          </p>

          <div className="flex items-center justify-start">
            <button
              type="button"
              className="text-xl text-white bg-blue-800 border-4 border-blue-800 py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-900 hover:border-blue-900 transition-all mr-8"
            >
              Get started
            </button>
            <button
              type="button"
              className="text-xl text-white border-4 py-2 px-4 rounded-lg cursor-pointer hover:border-blue-900 hover:text-blue-900 transition-all"
            >
              Learn more
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Home;
