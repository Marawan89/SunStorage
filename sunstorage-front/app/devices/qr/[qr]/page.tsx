"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../../parts/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../globals.css";
import apiendpoint from "../../../../../apiendpoint";
import { withAuth } from "../../../../../src/server/middleware/withAuth";
const formatDate = require("../../../../dateFormatter");
import "./style.css";

interface Device {
  sn: string;
  device_type_name: string;
  status: string;
  qr_code_string: string;
  devicespecifics: DeviceSpecific[];
  devicewarranty: DeviceWarranty;
  devicelogs: DeviceLog[];
  deviceassignments: DeviceAssignment[];
}

interface DeviceAssignment {
  name: string;
  surname: string;
  department_name: string;
  email: string;
}

interface DeviceSpecific {
  name: string;
  value: string;
  input_label: string;
}

interface DeviceWarranty {
  start_date: string;
  end_date: string;
}

interface DeviceLog {
  log_type: string;
  additional_notes: string;
  event_datetime: string;
}

function QrCodePage() {
  const params = useParams();
  const qrCode = params.qr;
  const [device, setDevice] = useState<Device | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        // Fetch device details using the QR code
        const response = await fetch(
          `${apiendpoint}api/devices/overview/qr/${qrCode}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch device data");
        }

        const data = await response.json();

        if (!data || !data.devicespecifics) {
          throw new Error("Invalid device data structure");
        }

        setDevice(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeviceData();
  }, [qrCode]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!device) {
    return <div>No device data available</div>;
  }

  const dismissDevice = async () => {
    try {
      const response = await fetch(
        `${apiendpoint}api/devices/qr/${qrCode}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "dismissed" }),
          credentials: "include",
        }
      );

      if (response.ok) {
        const confirmDelete = window.confirm(
          "Are you sure you want to dismiss this device?"
        );
        if (!confirmDelete) return;
        alert("Device dismissed successfully");
        window.location.reload();
      } else {
        console.error("Error dismissing the device");
      }
    } catch (error) {
      console.error("Error dismissing the device:", error);
    }
  };

  // Function to change device status to "free"
  const freeDevice = async () => {
    try {
      const response = await fetch(
        `${apiendpoint}api/devices/qr/${qrCode}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "free" }),
          credentials: "include",
        }
      );

      if (response.ok) {
        alert("Device is now free!");
        window.location.reload();
      } else {
        console.error("Error setting device to free");
      }
    } catch (error) {
      console.error("Error setting device to free:", error);
    }
  };

  const repairDevice = async () => {
    try {
      const response = await fetch(
        `${apiendpoint}api/devices/qr/${qrCode}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "under repair" }),
          credentials: "include",
        }
      );

      if (response.ok) {
        alert("Device sent to repair successfully!");
        window.location.reload();
      } else {
        console.error("Error sending device to repair");
      }
    } catch (error) {
      console.error("Error sending device to repair:", error);
    }
  };

  // Function to assign the device
  const assignDevice = async () => {
    window.location.href = `/devices/${qrCode}/assign`;
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="col-12 d-flex justify-content-center align-items-center">
          <div className="col-12 bg-content p-md-5">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <h3 className="sn">S/N: {device.sn}</h3>
            </div>
            <ul className="list-group">
              <li className="list-group-item disabled">
                <strong>
                  Scheda del dispositivo di tipo: {device.device_type_name}
                </strong>
              </li>
              <li className="list-group-item"><strong>Stato:</strong> {device.status}</li>
              {device.devicespecifics.map((devicespecific, index) => (
                <li key={index} className="list-group-item">
                  <strong>{devicespecific.input_label}</strong> : {devicespecific.value}
                </li>
              ))}
              {device.devicewarranty.start_date &&
              device.devicewarranty.end_date ? (
                <>
                  <li className="list-group-item">
                    <strong>Data inizio garanzia: </strong>
                    {new Date(
                      device.devicewarranty.start_date
                    ).toLocaleDateString()}
                  </li>
                  <li className="list-group-item">
                  <strong>Data fine garanzia: </strong>
                    {new Date(
                      device.devicewarranty.end_date
                    ).toLocaleDateString()}
                  </li>
                </>
              ) : (
                <li className="list-group-item"><strong>Garanzia non disponibile</strong></li>
              )}
              {device.status === "assigned" && (
                <>
                  <li className="list-group-item">
                    Name owner: {device.deviceassignments[0]?.name}{" "}
                    {device.deviceassignments[0]?.surname}
                  </li>
                  <li className="list-group-item">
                    Email owner: {device.deviceassignments[0]?.email}
                  </li>
                  <li className="list-group-item">
                    Owner department:{" "}
                    {device.deviceassignments[0]?.department_name}
                  </li>
                </>
              )}
              <li className="list-group-item">
                <h5>Device Logs:</h5>
                <ul className="list-group scrollable-logs">
                  {device.devicelogs.map((devicelog, index) => (
                    <li key={index} className="list-group-item">
                      [{formatDate(devicelog.event_datetime)}]{" "}
                      {devicelog.log_type}: {devicelog.additional_notes}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
            <div className="d-flex justify-content-between align-items-center mt-3">
              {device.status === "free" && (
                <>
                  <button
                    className="p-3 btn btn-secondary"
                    onClick={assignDevice}
                  >
                    Assegna (status: assigned)
                  </button>
                  <button
                    className="p-3 btn btn-secondary"
                    onClick={repairDevice}
                  >
                    Manda in riparazione (status: under repair)
                  </button>
                  <button
                    className="p-3 btn btn-danger"
                    onClick={dismissDevice}
                  >
                    Dismetti (status: dismissed)
                  </button>
                </>
              )}
              {device.status === "assigned" && (
                <>
                  <button
                    className="p-3 btn btn-secondary"
                    onClick={freeDevice}
                  >
                    Rientra (status: free)
                  </button>
                  <button
                    className="p-3 btn btn-secondary"
                    onClick={repairDevice}
                  >
                    Manda in riparazione (status: under repair)
                  </button>
                  <button
                    className="p-3 btn btn-danger"
                    onClick={dismissDevice}
                  >
                    Dismetti (status: dismissed)
                  </button>
                </>
              )}
              {device.status === "under repair" && (
                <>
                  <button
                    className="p-3 btn btn-secondary"
                    onClick={assignDevice}
                  >
                    Assegna (status: assigned)
                  </button>
                  <button
                    className="p-3 btn btn-secondary"
                    onClick={freeDevice}
                  >
                    Rientra (status: free)
                  </button>
                  <button
                    className="p-3 btn btn-danger"
                    onClick={dismissDevice}
                  >
                    Dismetti (status: dismissed)
                  </button>
                </>
              )}
              {device.status === "dismissed" && (
                <>
                  <button
                    className="p-3 btn btn-secondary"
                    onClick={repairDevice}
                  >
                    Manda in riparazione (status: under repair)
                  </button>
                  <button
                    className="p-3 btn btn-secondary"
                    onClick={freeDevice}
                  >
                    Rientra (status: free)
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default withAuth(QrCodePage);
