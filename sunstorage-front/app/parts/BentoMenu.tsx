import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import "./../globals.css";
import apiendpoint from "../../../apiendpoint";

// Definisci il tipo per deviceCounts
type DeviceCount = {
  deviceType: string;
  count: number;
};

export default function BentoMenu() {
  const [totalUnderRepairDevices, setTotalUnderRepairDevices] = useState(0);
  const [deviceCounts, setDeviceCounts] = useState<DeviceCount[]>([]);
  const [totalDeviceTypes, setTotalDeviceTypes] = useState(0);
  const [validWarrantyDevices, setvalidWarrantyDevices] = useState(0);
  const [expiredWarrantyDevices, setExpiredWarrantyDevices] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);          

  useEffect(() => {
    // Fetch dati dashboard (come prima)
    fetch(`${apiendpoint}api/devices/dashboard/totalUnderRepair`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Errore nel recupero del totale dei dispositivi");
        }
        return res.json();
      })
      .then((data) => setTotalUnderRepairDevices(data.totalUnderRepair))
      .catch((error) => console.error("Errore:", error.message));

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

    fetch(`${apiendpoint}api/devices/dashboard/validWarrantyDevices`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Errore nel recupero del totale dipartimenti");
        }
        return res.json();
      })
      .then((data) => setvalidWarrantyDevices(data.validWarrantyDevices))
      .catch((error) => console.error("Errore:", error.message));

    fetch(`${apiendpoint}api/devices/dashboard/expiredWarrantyDevices`, {
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
      .then((data) => setExpiredWarrantyDevices(data.expiredWarrantyDevices))
      .catch((error) => console.error("Errore:", error.message));
  }, []);

  const handleCameraOpen = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream; 
          video.play();
          setCameraActive(true);
        }
      })
      .catch((err) => {
        console.error("Errore nell'accesso alla fotocamera:", err);
      });
  };

  const redirectToDevices = () => {
    window.location.href = "/devices";
  };

  return (
    <div className="bento-box-large h-screen w-full flex items-center justify-center">
      <div className="grid h-full w-full grid-cols-3 grid-rows-2 gap-2 p-4 xl:m-64 lg:m-32 md:m-16">
        <div
          className="bento-box col-span-1 row-span-1 rounded-xl bg-gradient-to-b from-yellow-300 via-white-200 to-orange-500 flex items-center justify-center"
          onClick={redirectToDevices}
        >
          <div className="text-center p-2">
            <p className="bento-title font-bold sm:text-2xl">
              DEVICES UNDER REPAIR
            </p>
            <p className="bento-number text-4xl sm:text-6xl">{totalUnderRepairDevices}</p>
          </div>
        </div>

        <div className="bento-box col-span-2 row-span-1 rounded-xl bg-gradient-to-b from-yellow-300 via-white-200 to-orange-500 p-2 sm:p-4 flex flex-col justify-center">
          <div className="flex justify-between">
            <div className="flex flex-col items-center justify-center flex-1 text-center">
              <p className="bento-title font-bold">Total Device Types</p>
              <p className="bento-number sm:text-4xl">{totalDeviceTypes}</p>
            </div>
            <div className="flex flex-col items-center justify-center flex-1 text-center">
              <p className="bento-title font-bold">Devices with valid warranty not assigned</p>
              <p className="bento-number sm:text-4xl">{validWarrantyDevices}</p>
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
                <p className="bento-number sm:text-4xl">{device.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* lg:hidden per nascondere il quadrato in versione desktop */}
        <div
          className="bento-box col-span-1 row-span-1 rounded-xl bg-gradient-to-t from-yellow-300 via-white-200 to-orange-500 flex items-center justify-center lg:hidden"
          onClick={handleCameraOpen}
        >
          <div className="text-center p-2 sm:p-4">
            <p className="bento-title font-bold">SCAN QRCODE</p>
            <FontAwesomeIcon className="qr-icon text-6xl" icon={faQrcode} />
          </div>
        </div>

        <div
          className="bento-box col-span-1 lg:col-span-1 row-span-1 rounded-xl bg-gradient-to-t from-yellow-300 via-white-200 to-orange-500 flex items-center justify-center"
          onClick={redirectToDevices}
        >
          <div className="text-center p-2 sm:p-4">
            <p className="bento-title font-bold sm:text-2xl">DEVICES WITH EXPIRED WARRANTY NOT DISMISSED</p>
            <p className="bento-number text-4xl sm:text-6xl">
              {expiredWarrantyDevices}
            </p>
          </div>
        </div>
      </div>
      {cameraActive && (
        <div className="camera-view">
          <video ref={videoRef} style={{ width: "100%", height: "auto" }} />
        </div>
      )}
    </div>
  );
}
