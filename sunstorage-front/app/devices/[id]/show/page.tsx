"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Menu from "../../../parts/menu";
import Navbar from "../../../parts/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../globals.css";
import "./style.css";

interface DeviceDetails {
  id: number;
  serial_number: string;
  qr_code: string;
  device_type: string;
  warranty_start: string | null;
  warranty_end: string | null;
  status: string;
  specifics: string;
  user_name: string;
  surname: string;
  email: string;
  department_name: string;
}

export default function ViewDevice() {
  const params = useParams();
  const [device, setDevice] = useState<DeviceDetails | null>(null);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const deviceId = params.id;
    setId(params.id);

    if (deviceId) {
      const url = `http://localhost:4000/api/devices/overview?id=${deviceId}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            const deviceData = data[0];
            setDevice({
              id: deviceData.id,
              serial_number: deviceData.sn,
              qr_code: deviceData.qr_code_string,
              device_type: deviceData.device_type,
              warranty_start: deviceData.start_date,
              warranty_end: deviceData.end_date,
              specifics: deviceData.specifics,
              status: deviceData.status,
              name: deviceData.user_name,
              surname: deviceData.surname,
              email: deviceData.email,
              department_name: deviceData.department_name,
            });
          } else {
            console.error("No device found:", data);
          }
        })
        .catch((error) =>
          console.error("Error fetching device details:", error)
        );
    }
  }, []);

  if (!device) {
    return <div>Loading...</div>;
  }

  const specificsList = device.specifics.split(", ").map((spec, index) => (
    <li key={index} className="list-group-item">
      {spec}
    </li>
  ));

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <Menu />
          <div className="col-12 col-md-8 nav-container mt-3 mt-md-0 p-0">
            <div className="col-12 bg-content p-3 p-md-5">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="sn">S/N: {device.serial_number}</h3>
              </div>
              <ul className="list-group">
                <li className="list-group-item disabled">
                  {device.device_type} specifics:
                </li>
                <li className="list-group-item"> Status: {device.status}</li>
                {specificsList}
                {device.warranty_start && device.warranty_end ? (
                  <>
                    <li className="list-group-item">
                      Warranty Start Date:{" "}
                      {new Date(device.warranty_start).toLocaleDateString()}
                    </li>
                    <li className="list-group-item">
                      Warranty End Date:{" "}
                      {new Date(device.warranty_end).toLocaleDateString()}
                    </li>
                  </>
                ) : (
                  <li className="list-group-item">Warranty not available</li>
                )}
                <li className="list-group-item">
                  <img
                    src={`https://quickchart.io/qr?text=${device.qr_code}&size=200px&dark=000000&light=FFFFFF&ecLevel=M&margin=4`}
                  />
                </li>
                {device.status === "assigned" && (
                  <>
                    <li className="list-group-item">
                      Name owner: {device.user_name} {device.surname}
                    </li>
                    <li className="list-group-item">
                      Email owner: {device.email}
                    </li>
                    <li className="list-group-item">
                      Owner department: {device.department_name}
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
