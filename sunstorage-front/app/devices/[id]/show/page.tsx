"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Menu from "../../../parts/menu";
import Navbar from "../../../parts/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import "../../../globals.css";
import apiendpoint from "../../../../../apiendpoint";
const formatDate = require("../../../../dateFormatter");
import { withAuth } from "../../../../../src/server/middleware/withAuth";

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

function ViewDevice() {
  const params = useParams(); //parametro get della route
  const [device, setDevice] = useState<Device | null>(null);

  useEffect(() => {
    const deviceId = params.id;
    fetch(`${apiendpoint}api/devices/${deviceId}/details`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setDevice(data);
      });
  }, []);

  // stampare solo il codice QR
  const printQRCode = () => {
    const qrCodeElement = document.getElementById("qr-code"); // prendi l'elemento del codice QR
    const originalContents = document.body.innerHTML; // salvo il contenuto originale della pagina
    const qrCodeContents = qrCodeElement?.outerHTML; // prendi l'HTML del codice QR

    if (qrCodeContents) {
      // sostituisci il body con solo il codice QR e avvia la stampa
      document.body.innerHTML = qrCodeContents;
      window.print();
      // ripristina il contenuto originale della pagina dopo la stampa
      document.body.innerHTML = originalContents;
    }
  };

  if (!device) {
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
              <h2 style={{ fontSize: "2em" }}>S/N: {device.sn}</h2>
              <ul className="list-group">
                <li className="list-group-item disabled">
                  <strong>
                    Scheda del dispositivo di tipo: {device.device_type_name}
                  </strong>
                </li>
                <li className="list-group-item">
                  <strong>Stato:</strong> {device.status}
                </li>
                {device.devicespecifics?.map((devicespecific, index) => (
                  <li key={index} className="list-group-item">
                    <strong>{devicespecific.input_label}: </strong>
                    {devicespecific.value}
                  </li>
                ))}
                {device.devicewarranty &&
                device.devicewarranty.start_date &&
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
                  <li className="list-group-item">
                    <strong>Garanzia non disponibile</strong>
                  </li>
                )}
                <li className="list-group-item" id="qr-code">
                  <img
                    src={`https://quickchart.io/qr?text=http://192.168.16.119:3000/devices/qr/${device.qr_code_string}/&size=200px&dark=000000&light=FFFFFF&ecLevel=M&margin=4`}
                  />
                </li>
                {device.status === "assigned" && (
                  <>
                    <li className="list-group-item">
                      <strong> Nome proprietario:</strong>
                      {device.deviceassignments[0].name}
                      {device.deviceassignments[0].surname}
                    </li>
                    <li className="list-group-item">
                      <strong>Email proprietario:</strong>
                      {device.deviceassignments[0].email}
                    </li>
                    <li className="list-group-item">
                      <strong>Reparto proprietario:</strong>
                      {device.deviceassignments[0].department_name}
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
              <button
                className="btn btn-outline-dark mt-4"
                onClick={printQRCode}
              >
                Stampa codice QR
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default withAuth(ViewDevice);
