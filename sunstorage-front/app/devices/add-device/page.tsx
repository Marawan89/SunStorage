"use client";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Menu from "../../parts/menu";
import Navbar from "../../parts/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../globals.css";
import "./style.css";

interface DeviceType {
  id: number;
  name: string;
}

interface DeviceSpecifics {
  DISK_TYPE?: string;
  DISK_SIZE?: string;
  RAM_SIZE?: string;
  PROCESSOR_TYPE?: string;
}

export default function AddDevice() {
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
  const [serialNumber, setSerialNumber] = useState("");
  const [selectedDeviceType, setSelectedDeviceType] = useState<string>("");
  const [warrantyStart, setWarrantyStart] = useState<string>("");
  const [warrantyEnd, setWarrantyEnd] = useState<string>("");
  const [hasWarranty, setHasWarranty] = useState<boolean>(false);
  const [deviceSpecifics, setDeviceSpecifics] = useState<DeviceSpecifics>({});

  // to get all device types
  useEffect(() => {
    async function fetchDeviceTypes() {
      try {
        const res = await fetch("http://localhost:4000/api/devicetypes");
        if (!res.ok) {
          throw new Error("Failed to fetch device types");
        }
        const data: DeviceType[] = await res.json();
        setDeviceTypes(data);
      } catch (error) {
        console.error("Error fetching device types:", error);
      }
    }

    fetchDeviceTypes();
  }, []);

  // function that start when the submit button is clicked
  async function activateLasers() {
    // check if the field is blank
    if (!serialNumber || !selectedDeviceType) {
      alert("Please fill in all fields.");
      return;
    }

    const diskSize = deviceSpecifics.DISK_SIZE
      ? parseInt(deviceSpecifics.DISK_SIZE)
      : null;
    const ramSize = deviceSpecifics.RAM_SIZE
      ? parseInt(deviceSpecifics.RAM_SIZE)
      : null;

    if (
      (diskSize !== null && (diskSize < 100 || diskSize > 1000)) ||
      (ramSize !== null && (ramSize < 4 || ramSize > 64))
    ) {
      alert(
        "Please provide valid values for disk size(100-1000) and RAM size (4-64)"
      );
      return;
    }

    try {
      // insert new device
      const deviceRes = await fetch("http://localhost:4000/api/devices", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          device_type_id: parseInt(selectedDeviceType),
          sn: serialNumber,
          qr_code_string: `CIAO_QR_CAZZ_${Math.floor(Math.random() * 1000000)}`,
        }),
      });

      if (!deviceRes.ok) {
        const errorData = await deviceRes.json();
        throw new Error(errorData.error || "Failed to create device");
      }

      const deviceData = await deviceRes.json();

      // insert new device warranty or NULL if no warranty
      const warrantyRes = await fetch(
        "http://localhost:4000/api/devicewarranties",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            device_id: deviceData.id,
            start_date: hasWarranty ? warrantyStart : null,
            end_date: hasWarranty ? warrantyEnd : null,
          }),
        }
      );

      if (!warrantyRes.ok) {
        const errorData = await warrantyRes.json();
        throw new Error(errorData.error || "Failed to create device warranty");
      }

      // insert of device specifics
      for (const [key, value] of Object.entries(deviceSpecifics)) {
        const insertSpecific = await fetch(
          "http://localhost:4000/api/devicespecifics",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              device_id: deviceData.id,
              name: key,
              value: value || null,
            }),
          }
        );
        if (!insertSpecific.ok) {
          const errorData = await insertSpecific.json();
          throw new Error(
            errorData.error || "Failed to create device specific"
          );
        }
      }

      // after successful inserion redirect to devices page
      alert("Device added successfully!");
      window.location.href = "/devices";
    } catch (error) {
      if (error instanceof Error) {
        alert("Error adding device: " + error.message);
      } else {
        alert("Unknown error adding device");
      }
    }
  }

  // handle changes in select and input fields
  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const valueReal = e.target.value;
    const { name, value } = e.target;
    const key = name.split("[")[1].split("]")[0]; // extracts the key from the input name attribute
    setDeviceSpecifics((prevState) => ({
      ...prevState,
      [key]: valueReal || null,
    }));
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <Menu />
          <div className="col-12 col-md-8 nav-container mt-3 mt-md-0">
            <div className="col-12 bg-content p-5">
              <p>Add Device</p>
              <div className="spacer"></div>
              <div className="add-device-data">
                <p>Serial number</p>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="Enter serial number"
                />
                <p>Device Type</p>
                <div className="input-group">
                  <select
                    className="custom-select"
                    id="inputGroupSelect01"
                    value={selectedDeviceType}
                    onChange={(e) => setSelectedDeviceType(e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled hidden>
                      Choose...
                    </option>
                    {deviceTypes.map((type) => (
                      <option key={type.id} value={type.id.toString()}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Conditionally render device specifics based on selected device type */}
                {selectedDeviceType === "2" && (
                  <>
                    <p>Laptop Specifics:</p>
                    <p>Disk type</p>
                    <select
                      name="devicespecifics[DISK_TYPE]"
                      onChange={handleChange}
                      defaultValue=""
                    >
                      <option value="" disabled hidden>
                        Choose Disk type
                      </option>
                      <option value="SSD">SSD</option>
                      <option value="HDD">HDD</option>
                    </select>
                    <p>Disk Size(GB)</p>
                    <input
                      type="number"
                      min="100"
                      max="1000"
                      name="devicespecifics[DISK_SIZE]"
                      onChange={handleChange}
                      placeholder="Enter Disk size"
                    />
                    <p>RAM(GB)</p>
                    <input
                      type="number"
                      min="4"
                      max="64"
                      name="devicespecifics[RAM_SIZE]"
                      onChange={handleChange}
                      placeholder="Enter ram size"
                    />
                    <p>Processor type</p>
                    <input
                      type="text"
                      name="devicespecifics[PROCESSOR_TYPE]"
                      onChange={handleChange}
                      placeholder="Enter processor type"
                    />
                  </>
                )}
                {selectedDeviceType === "3" && (
                  <>
                    <p>Phone Specifics:</p>
                    <p>Model</p>
                    <input
                      type="text"
                      name="devicespecifics[MODEL]"
                      onChange={handleChange}
                      placeholder="Enter model"
                    />
                  </>
                )}
                {selectedDeviceType === "10" && ( 
                  <>
                    <p>Desktop-PC Specifics:</p>
                    <p>Disk type</p>
                    <select
                      name="devicespecifics[DISK_TYPE]"
                      onChange={handleChange}
                      defaultValue=""
                    >
                      <option value="" disabled hidden>
                        Choose Disk type
                      </option>
                      <option value="SSD">SSD</option>
                      <option value="HDD">HDD</option>
                    </select>
                    <p>Disk Size(GB)</p>
                    <input
                      type="number"
                      min="100"
                      max="1000"
                      name="devicespecifics[DISK_SIZE]"
                      onChange={handleChange}
                      placeholder="Enter Disk size"
                    />
                    <p>RAM(GB)</p>
                    <input
                      type="number"
                      min="4"
                      max="64"
                      name="devicespecifics[RAM_SIZE]"
                      onChange={handleChange}
                      placeholder="Enter ram size"
                    />
                    <p>Processor type</p>
                    <input
                      type="text"
                      name="devicespecifics[PROCESSOR_TYPE]"
                      onChange={handleChange}
                      placeholder="Enter processor type"
                    />
                  </>
                )}

                <p>Ha la garanzia?</p>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckDefault"
                    checked={hasWarranty}
                    onChange={(e) => setHasWarranty(e.target.checked)}
                  />
                </div>
                {hasWarranty && (
                  <>
                    <p>Warranty Start</p>
                    <input
                      type="date"
                      value={warrantyStart}
                      onChange={(e) => setWarrantyStart(e.target.value)}
                    />
                    <p>Warranty End</p>
                    <input
                      type="date"
                      value={warrantyEnd}
                      onChange={(e) => setWarrantyEnd(e.target.value)}
                    />
                  </>
                )}
              </div>
              <div className="form-btns d-flex flex-md-row justify-content-end align-items-center">
                <button className="cl-btn" type="reset">
                  Cancel
                  <FontAwesomeIcon
                    className="btn-icon"
                    icon={faCancel}
                  ></FontAwesomeIcon>
                </button>
                <button
                  className="sbmt-btn"
                  type="button"
                  onClick={activateLasers}
                >
                  Save and Generate Qr code
                  <FontAwesomeIcon
                    className="btn-icon"
                    icon={faArrowRight}
                  ></FontAwesomeIcon>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


/* Da mettere a posto:
- aggiunge al db anche se non si scrive niente nelle specifiche
   - é meglio fargli aggiungere al db un valore NULL quando l'utente non scrive nulla oppure come sta facendo adesso che non aggiunge niente
- se attiva lo switch della garanzia e l'utente non scrive nessuna garanzia deve dirgli scrivi le date di garanzia
- il serial number deve avere una lunghezza specifica
- quando c'è un errore voglio che si evidenzi in rosso solo l'input con l'errore basta sti alert per tutto (per adesso teniamoli)


Da migliorare
- fare che se si sceglie Laptop fa vedere il pannello specifiche se no no (per adesso funziona ma è molto blando e manuale)
*/