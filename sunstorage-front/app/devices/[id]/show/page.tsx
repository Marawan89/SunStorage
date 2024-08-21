"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Menu from "../../../parts/menu";
import Navbar from "../../../parts/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../globals.css";
import "./style.css";
const formatDate = require('../../../../dateFormatter');

interface Device {
   sn: string;
   device_type_name: string;
   status: string;
   qr_code_string: string;
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

export default function ViewDevice() {
  const params = useParams(); //parametro get della route
  
  const [device, setDevice] = useState<Device|null>(null);
  const [deviceSpecifics, setDeviceSpecifics] = useState<DeviceSpecific[]>([]);
  const [deviceAssignments, setDeviceAssignments] = useState<DeviceAssignment[]>([]);
  const [deviceLogs, setDeviceLogs] = useState<DeviceLog[]>([]);
  const [deviceWarranty, setDeviceWarranty] = useState<DeviceWarranty | null>(null);

  useEffect(() => {
    const deviceId = params.id;

    fetch(`http://localhost:4000/api/devices/${deviceId}`)
      .then((response) => response.json())
      .then((data) => {
        setDevice(data);
      });

    fetch(`http://localhost:4000/api/devices/${deviceId}/devicespecifics`)
      .then((response) => response.json())
      .then((data) => {
        setDeviceSpecifics(data);
      });

    fetch(`http://localhost:4000/api/devices/${deviceId}/assignments`)
      .then((response) => response.json())
      .then((data) => {
        setDeviceAssignments(data);
      });

    fetch(`http://localhost:4000/api/devices/${deviceId}/logs`)
      .then((response) => response.json())
      .then((data) => {
        setDeviceLogs(data);
      });

    fetch(`http://localhost:4000/api/devices/${deviceId}/devicewarranty`)
      .then((response) => response.json())
      .then((data) => {
         setDeviceWarranty(data);
      });
  }, []);

    if (!device || deviceAssignments.length == 0 || deviceSpecifics.length == 0 || !deviceWarranty || deviceLogs.length == 0) {
      return <div>Loading...</div>;
    }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <Menu />
          <div className="col-12 col-md-8 nav-container mt-3 mt-md-0 p-0">
            <div className="col-12 bg-content p-3 p-md-5">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="sn">S/N: {device.sn}</h3>
              </div>
              <ul className="list-group">
                <li className="list-group-item disabled">
                  {device.device_type_name} specifics:
                </li>
                <li className="list-group-item"> Status: {device.status}</li>
                {deviceSpecifics.map((devicespecific, index) => (
                    <li key={index} className="list-group-item">
                    {devicespecific.input_label} : {devicespecific.value} 
                  </li>
                  ))}
                {deviceWarranty.start_date && deviceWarranty.end_date ? (
                  <>
                    <li className="list-group-item">
                      Warranty Start Date:{" "}
                      {new Date(deviceWarranty.start_date).toLocaleDateString()}
                    </li>
                    <li className="list-group-item">
                      Warranty End Date:{" "}
                      {new Date(deviceWarranty.end_date).toLocaleDateString()}
                    </li>
                  </>
                ) : (
                  <li className="list-group-item">Warranty not available</li>
                )}
                <li className="list-group-item">
                  <img
                    src={`https://quickchart.io/qr?text=http://192.168.16.119:3000/devices/qr/${device.qr_code_string}/&size=200px&dark=000000&light=FFFFFF&ecLevel=M&margin=4`}
                  />
                </li>
                {device.status === "assigned" && (
                  <>
                    <li className="list-group-item">
                      Name owner: {deviceAssignments[0].name} {deviceAssignments[0].surname}
                    </li>
                    <li className="list-group-item">
                      Email owner: {deviceAssignments[0].email}
                    </li>
                    <li className="list-group-item">
                      Owner department: {deviceAssignments[0].department_name}
                    </li>
                  </>
                )}
              <li className="list-group-item">
                <h5>Device Logs:</h5>
                {deviceLogs.map((devicelog, index) => {
                  return (
                  <li key={index} className="list-group-item">
                    [{formatDate(devicelog.event_datetime)}] {devicelog.log_type}: {devicelog.additional_notes} 
                  </li>
                  );
                })}
              </li>
              </ul>  
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
