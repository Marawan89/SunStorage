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

export default function AddDevice() {
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
  const [serialNumber, setSerialNumber] = useState("");
  const [selectedDeviceType, setSelectedDeviceType] = useState<string>("");
  const [warrantyStart, setWarrantyStart] = useState<string>("");
  const [warrantyEnd, setWarrantyEnd] = useState<string>("");
  const [hasWarranty, setHasWarranty] = useState<boolean>(false);
  const [deviceTypeInputs, setDeviceTypeInputs] = useState([]);

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

  useEffect(() => {
    async function fetchDeviceTypeInputs() {
      if (selectedDeviceType){
        try {
          console.log('download = '+selectedDeviceType);
          const res = await fetch("http://localhost:4000/api/devicespecificsinputs/"+selectedDeviceType);
          if (!res.ok) {
            throw new Error("Failed to fetch device types");
          }
          const data: DeviceType[] = await res.json();
          setDeviceTypeInputs(data);
          console.log(data);
        } catch (error) {
          console.error("Error fetching device types:", error);
        }
      }
    }
    fetchDeviceTypeInputs();
  }, [selectedDeviceType]);

  // set dates for the warranty check
  useEffect(() => {
    const today = new Date();
    const warrantyStartDefault = new Date(today);
    warrantyStartDefault.setDate(today.getDate() - 10);

    const warrantyEndDefault = new Date(warrantyStartDefault);
    warrantyEndDefault.setFullYear(warrantyStartDefault.getFullYear() + 4);

    setWarrantyStart(warrantyStartDefault.toISOString().split('T')[0]);
    setWarrantyEnd(warrantyEndDefault.toISOString().split('T')[0]);
  }, []);

  // function that start when the submit button is clicked
  async function submit() {
   // regEx to allow only letters and numbers
   const serialNumberPattern = /^[A-Za-z0-9]+$/;

   // check if the serial number field is blank, less than 10 characters or contains special characters
   if (!serialNumber || serialNumber.length < 10 || !serialNumberPattern.test(serialNumber)) {
     alert("Serial Number must be at least 10 characters long and contain only letters and numbers.");
     return;
   }

    // check if the device type is selected
    if (!selectedDeviceType) {
      alert("Please select a device type.");
      return;
    }

    try {
      for (const field of deviceTypeInputs) {
        if (document.getElementById(field.input_name).value == 'Choose an option...' || document.getElementById(field.input_name).value == null || document.getElementById(field.input_name).value == '') {
          alert("Please fill " + field.input_name + " field");
          return;
        }
      }

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
      for (const field of deviceTypeInputs) {
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
              name: field.input_name,
              value: document.getElementById(field.input_name).value || null,
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

      // after successful insertion redirect to devices page
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
                  required
                />
                <p>Device Type</p>
                <div className="input-group">
                  <select
                    className="custom-select"
                    id="inputGroupSelect01"
                    value={selectedDeviceType}
                    onChange={(e) => setSelectedDeviceType(e.target.value)}
                    required
                  >
                    <option>
                      Choose an option...
                    </option>
                    {deviceTypes.map((type) => (
                      <option key={type.id} value={type.id.toString()}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  {deviceTypeInputs.map((input) => {
                    if (input.input_type == 'select'){
                      const options = JSON.parse(input.input_values);
                      return (
                        <>
                        <p>{input.input_label}:</p>
                        <select
                          id={input.input_name}
                          name={input.input_name}
                          required
                        >
                          <option>
                            Choose an option...
                          </option>
                          {options.map((option) => (<option value={option}>{option}</option>))}
                        </select>
                        </>
                      )
                    }

                    if (input.input_type == 'text'){
                      return (
                        <>
                        <p>{input.input_label}:</p>
                        <input
                          type="text"
                          id={input.input_name}
                          name={input.input_name}
                          placeholder={input.input_placeholder}
                          required
                        />
                        </>
                      )
                    }
                  }
                  )}
                </div>
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
                      // disable dates before Warranty Start
                      min={warrantyStart}
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
                  onClick={submit}
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
- fare che se si sceglie Laptop fa vedere il pannello specifiche se no no (per adesso funziona ma è molto blando e manuale )
*/
