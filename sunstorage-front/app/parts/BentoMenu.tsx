import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import "./../globals.css";
import apiendpoint from "../../../apiendpoint";

export default function BentoMenu() {
  const [totalDevices, setTotalDevices] = useState(0);
  const [deviceCounts, setDeviceCounts] = useState([]);
  const [totalDeviceTypes, setTotalDeviceTypes] = useState(0);
  const [totalDepartments, setTotalDepartments] = useState(0);
  const [validWarrantyDevices, setValidWarrantyDevices] = useState(0);

  useEffect(() => {
    // Fetch totale dispositivi
    fetch(`${apiendpoint}api/devices/dashboard`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Errore nel recupero del totale dei dispositivi");
        }
        return res.json();
      })
      .then((data) => setTotalDevices(data.totalDevices))
      .catch((error) => console.error("Errore:", error.message));

    // Fetch conteggio per tipo di dispositivo
    fetch(`${apiendpoint}api/devices/dashboard/countByType`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            "Errore nel recupero del conteggio per tipo di dispositivo"
          );
        }
        return res.json();
      })
      .then((data) => setDeviceCounts(data))
      .catch((error) => console.error("Errore:", error.message));

    // Fetch totale tipi di dispositivo
    fetch(`${apiendpoint}api/devices/dashboard/totalDeviceTypes`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Errore nel recupero del totale tipi di dispositivo");
        }
        return res.json();
      })
      .then((data) => setTotalDeviceTypes(data.totalDeviceTypes))
      .catch((error) => console.error("Errore:", error.message));

    // Fetch totale dipartimenti
    fetch(`${apiendpoint}api/devices/dashboard/totalDepartments`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Errore nel recupero del totale dipartimenti");
        }
        return res.json();
      })
      .then((data) => setTotalDepartments(data.totalDepartments))
      .catch((error) => console.error("Errore:", error.message));

    // Fetch dispositivi con garanzia valida
    fetch(`${apiendpoint}api/devices/dashboard/validWarranties`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            "Errore nel recupero dei dispositivi con garanzia valida"
          );
        }
        return res.json();
      })
      .then((data) => setValidWarrantyDevices(data.validWarrantyDevices))
      .catch((error) => console.error("Errore:", error.message));
  }, []);

  return (
    <div className="bento-box-large h-screen w-full flex items-center justify-center">
      <div className="grid h-full w-full grid-cols-3 grid-rows-2 gap-2 p-4 xl:m-64 lg:m-32 md:m-16">
        <div className="bento-box col-span-1 row-span-1 rounded-xl bg-gradient-to-b from-yellow-300 via-white-200 to-orange-500 flex items-center justify-center">
          <div className="text-center p-2">
            <p className="bento-title font-bold text-2xl sm:text-4xl mb-1 sm:mb-2">
              TOTAL DEVICES
            </p>
            <p className="bento-number text-4xl sm:text-6xl">{totalDevices}</p>
          </div>
        </div>

        <div className="bento-box col-span-2 row-span-1 rounded-xl bg-gradient-to-b from-yellow-300 via-white-200 to-orange-500 p-2 sm:p-4 flex flex-col justify-center">
          <div className="flex justify-between">
            <div className="flex flex-col items-center justify-center flex-1 text-center">
              <p className="bento-title font-bold">
                DEVICE TYPES
              </p>
              <p className="bento-number sm:text-4xl">
                {totalDeviceTypes}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center flex-1 text-center">
              <p className="bento-title font-bold">
                DEPARTMENTS
              </p>
              <p className="bento-number sm:text-4xl">
                {totalDepartments}
              </p>
            </div>
          </div>
        </div>

        <div className="bento-box col-span-3 lg:col-span-2 row-span-1 rounded-xl bg-gradient-to-t from-yellow-300 via-white-200 to-orange-500 p-2 sm:p-5 flex flex-col justify-center">
          <div className="flex justify-around">
            {deviceCounts.map((device, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center text-center"
              >
                <p className="bento-title font-bold sm:text-xl mb-1">
                  {device.deviceType.toUpperCase()}
                </p>
                <p className="bento-number sm:text-4xl">
                  {device.count}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* lg:hidden per nascondere il quadrato in versione desktop */}
        <div className="bento-box col-span-1 row-span-1 rounded-xl bg-gradient-to-t from-yellow-300 via-white-200 to-orange-500 flex items-center justify-center lg:hidden">
          <div className="text-center p-2 sm:p-4">
            <p className="bento-title font-bold">SCAN QRCODE</p>
            <FontAwesomeIcon className="qr-icon text-6xl" icon={faQrcode} />
          </div>
        </div>

        <div className="bento-box col-span-1 lg:col-span-1 row-span-1 rounded-xl bg-gradient-to-t from-yellow-300 via-white-200 to-orange-500 flex items-center justify-center">
          <div className="text-center p-2 sm:p-4">
            <p className="bento-title font-bold text-3xl">VALID WARRANTY</p>
            <p className="bento-number text-4xl sm:text-6xl">{validWarrantyDevices}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
