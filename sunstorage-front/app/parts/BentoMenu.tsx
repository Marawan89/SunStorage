"use client";

import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./../globals.css";
import "./styleBento.css";
import apiendpoint from "../../../apiendpoint";

type DeviceCount = {
  deviceType: string;
  count: number;
};

const COLORS = ["#FFA500", "#FFD700", "#FFFFFF", "#FF8C00"];

const CustomTooltip = ({ active, payload, label }: any) => {
   if (active && payload && payload.length) {
     return (
       <div className="custom-tooltip bg-white p-3 border border-gray-200 rounded shadow-lg">
         <p className="label font-bold">{`${label}`}</p>
         <p className="value text-orange-600">{`Count: ${payload[0].value}`}</p>
       </div>
     );
   }
   return null;
 };

export default function BentoMenu() {
  const [totalDevices, settotalDevices] = useState(0);
  const [totalUnderRepairDevices, setTotalUnderRepairDevices] = useState(0);
  const [deviceCounts, setDeviceCounts] = useState<DeviceCount[]>([]);
  const [totalDeviceTypes, setTotalDeviceTypes] = useState(0);
  const [validWarrantyDevices, setvalidWarrantyDevices] = useState(0);
  const [expiredWarrantyDevices, setExpiredWarrantyDevices] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchData = async (
      endpoint: string,
      setter: (data: any) => void,
      errorMsg: string
    ) => {
      try {
        const res = await fetch(`${apiendpoint}${endpoint}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error(errorMsg);
        const data = await res.json();
        setter(data);
      } catch (error) {
        console.error("Errore:", error.message);
      }
    };

    fetchData(
      "api/devices/dashboard/totalDevices",
      (data) => settotalDevices(data.totalDevices),
      "Errore totale dispositivi"
    );
    fetchData(
      "api/devices/dashboard/totalUnderRepair",
      (data) => setTotalUnderRepairDevices(data.totalUnderRepair),
      "Errore dispositivi riparazione"
    );
    fetchData(
      "api/devices/dashboard/countByType",
      (data) => setDeviceCounts(data),
      "Errore conteggio tipi"
    );
    fetchData(
      "api/devices/dashboard/totalDeviceTypes",
      (data) => setTotalDeviceTypes(data.totalDeviceTypes),
      "Errore tipi dispositivi"
    );
    fetchData(
      "api/devices/dashboard/validWarrantyDevices",
      (data) => setvalidWarrantyDevices(data.validWarrantyDevices),
      "Errore garanzie valide"
    );
    fetchData(
      "api/devices/dashboard/expiredWarrantyDevices",
      (data) => setExpiredWarrantyDevices(data.expiredWarrantyDevices),
      "Errore garanzie scadute"
    );
  }, []);

  const repairData = [
    { name: "In riparazione", value: totalUnderRepairDevices },
    { name: "Altri", value: totalDevices - totalUnderRepairDevices },
  ];

  const warrantyData = [
    { name: "Valid", value: validWarrantyDevices },
    { name: "Expired", value: expiredWarrantyDevices },
  ];

  const handleCameraOpen = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setCameraActive(true);
        }
      })
      .catch(console.error);
  };

  const redirectToDevices = () => (window.location.href = "/devices");
  const renderDonutChart = (title: string, value: number, colors: string[]) => (
    <div className="h-full flex flex-col justify-center items-center">
      <p className="bento-title font-bold text-xl mb-4 text-center">{title}</p>
      <div className="w-48 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={[{ value: 100 }]}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              animationDuration={500}
            >
              <Cell fill={colors[0]} />
              <Cell fill={colors[1]} />
            </Pie>
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-3xl font-bold text-orange-600"
            >
              {value}
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="bento-box-large h-screen w-full flex items-center justify-center">
      <div className="grid h-full w-full grid-cols-3 grid-rows-2 gap-2 p-4 xl:m-64 lg:m-32 md:m-16">
        {/* Prima riga */}
        <div
          className="bento-box col-span-1 row-span-1 rounded-xl bg-gradient-to-b from-yellow-300 via-white-200 to-orange-500"
          onClick={redirectToDevices}
        >
          <div className="h-full p-2 flex flex-col justify-end">
            <p className="bento-title font-bold text-xl mb-4 mt-8 text-center">
              Dispositivi in riparazione
            </p>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={repairData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={500}
                >
                  {repairData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-3xl font-bold text-orange-600"
                >
                  {totalUnderRepairDevices}
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bento-box col-span-2 row-span-1 rounded-xl bg-gradient-to-b from-yellow-300 via-white-200 to-orange-500 p-2">
          <div className="flex h-full gap-4">
            <div className="w-1/2 flex flex-col items-center justify-center">
              <p className="bento-title font-bold text-center mb-4">
                Tipi dispositivi
              </p>
              <div className="w-full h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[{ value: totalDeviceTypes }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={70}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    >
                      <Cell fill={COLORS[1]} />
                    </Pie>
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-3xl font-bold text-orange-600"
                    >
                      {totalDeviceTypes}
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="w-1/2 flex flex-col items-center justify-center">
              <p className="bento-title font-bold text-center mb-4">Garanzie</p>
              <div className="w-full h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={warrantyData}>
                    <XAxis dataKey="name" fontSize={10} />
                    <YAxis fontSize={10} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="value"
                      fill={COLORS[2]}
                      radius={[4, 4, 0, 0]}
                      animationDuration={500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Seconda riga */}
        <div className="bento-box col-span-3 lg:col-span-2 row-span-1 rounded-xl bg-gradient-to-t from-yellow-300 via-white-200 to-orange-500 p-2">
          <p className="bento-title font-bold text-center mb-4 mt-2">
            Distribuzione per tipo
          </p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deviceCounts}>
                <XAxis
                  dataKey="deviceType"
                  angle={-45}
                  textAnchor="end"
                  fontSize={10}
                  height={60}
                  interval={0}
                />
                <YAxis fontSize={10} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="count"
                  fill={COLORS[2]}
                  radius={[4, 4, 0, 0]}
                  animationDuration={500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className="bento-box col-span-1 row-span-1 rounded-xl bg-gradient-to-t from-yellow-300 via-white-200 to-orange-500 flex flex-col items-center justify-center lg:hidden"
          onClick={handleCameraOpen}
        >
          <p className="bento-title font-bold mb-2">SCAN QR</p>
          <FontAwesomeIcon
            icon={faQrcode}
            className="text-6xl text-orange-600"
          />
        </div>

        <div
          className="bento-box col-span-1 row-span-1 rounded-xl bg-gradient-to-t from-yellow-300 via-white-200 to-orange-500"
          onClick={redirectToDevices}
        >
          <div className="h-full flex flex-col justify-center">
            <p className="bento-title font-bold mt-8 text-center">
              Totale dispositivi
            </p>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Totale", value: totalDevices },
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  startAngle={90}
                  paddingAngle={5}
                  endAngle={-270}
                  dataKey="value"
                  animationDuration={1000}
                >
                  <Cell fill={COLORS[1]} />
                </Pie>
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-3xl font-bold text-orange-600"
                >
                  {totalDevices}
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {cameraActive && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <video ref={videoRef} className="max-w-full max-h-full" />
        </div>
      )}
    </div>
  );
}
