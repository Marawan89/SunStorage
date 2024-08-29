import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import "./../globals.css";


export default function BentoMenu() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="grid h-full w-full grid-cols-3 grid-rows-2 gap-3 p-10 xl:m-64 l:m-32 md:m-16">
        <div className="col-span-1 row-span-1 rounded-xl bg-gradient-to-b from-yellow-300 via-white-200 to-orange-500 flex items-center justify-center">
          <div className="text-center p-4">
            <p className="font-bold text-4xl mb-2">TOTAL DEVICES</p>
            <p className="text-6xl">25</p>
          </div>
        </div>

        {/* <!-- LAPTOP, TELEFONI, DESKTOP-PC --> */}
        <div className="col-span-2 row-span-1 rounded-xl bg-gradient-to-b from-yellow-300 via-white-200 to-orange-500 p-4 flex flex-col justify-center">
          <div className="flex justify-between">
            <div className="flex flex-col items-center flex-1 text-center">
              <p className="font-bold text-3xl mb-1">LAPTOP</p>
              <p className="text-6xl">10</p>
            </div>
            <div className="flex flex-col items-center flex-1 text-center">
              <p className="font-bold text-3xl mb-1">TELEFONI</p>
              <p className="text-6xl">7</p>
            </div>
            <div className="flex flex-col items-center flex-1 text-center">
              <p className="font-bold text-3xl mb-1">DESKTOP-PC</p>
              <p className="text-6xl">8</p>
            </div>
          </div>
        </div>

        {/* <!-- DEVICE TYPES, DEPARTMENTS --> */}
        <div className="col-span-1 row-span-1 rounded-xl bg-gradient-to-t from-yellow-300 via-white-200 to-orange-500 p-5 flex flex-col justify-center">
          <div className="flex justify-between">
            <div className="flex flex-col items-center flex-1 text-center">
              <p className="font-bold mb-1">DEVICE TYPES</p>
              <p className="text-4xl">7</p>
            </div>
            <div className="flex flex-col items-center flex-1 text-center">
              <p className="font-bold mb-1">DEPARTMENTS</p>
              <p className="text-4xl">4</p>
            </div>
          </div>
        </div>

        {/* <!-- SCAN QRCODE --> */}
        <div className="col-span-1 row-span-1 rounded-xl bg-gradient-to-t from-yellow-300 via-white-200 to-orange-500 flex items-center justify-center">
          <div className="text-center p-4">
            <p className="font-bold text-2xl mb-2">SCAN QRCODE</p>
            <FontAwesomeIcon
                className="qr-icon text-8xl"
                icon={faQrcode}
              />
          </div>
        </div>

        {/* <!-- VALID WARRANTY --> */}
        <div className="col-span-1 row-span-1 rounded-xl bg-gradient-to-t from-yellow-300 via-white-200 to-orange-500 flex items-center justify-center">
          <div className="text-center p-4">
            <p className="font-bold text-3xl mb-2">VALID WARRANTY</p>
            <p className="text-6xl mb-0">4</p>
          </div>
        </div>
      </div>
    </div>
  );
}
