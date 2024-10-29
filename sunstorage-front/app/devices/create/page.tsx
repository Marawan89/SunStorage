"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCancel,
  faArrowRight,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Menu from "../../parts/menu";
import Navbar from "../../parts/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../globals.css";
import "./style.css";
import apiendpoint from "../../../../apiendpoint";
import { withAuth } from "../../../../src/server/middleware/withAuth";

interface DeviceType {
  id: number;
  name: string;
}

interface DeviceSpecificInput {
  id: string;
  input_name: string;
  input_type: string;
  input_label: string;
  input_placeholder: string;
  input_values: string;
}

function AddDevice() {
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
  const [serialNumber, setSerialNumber] = useState("");
  const [multipleSerialNumbers, setMultipleSerialNumbers] = useState<string[]>([
    "",
  ]);
  const [selectedDeviceType, setSelectedDeviceType] = useState<string>("");
  const [warrantyStart, setWarrantyStart] = useState<string>("");
  const [warrantyEnd, setWarrantyEnd] = useState<string>("");
  const [hasWarranty, setHasWarranty] = useState<boolean>(false);
  const [deviceTypeInputs, setDeviceTypeInputs] = useState<
    DeviceSpecificInput[]
  >([]);
  const [isMultipleDevices, setIsMultipleDevices] = useState<boolean>(false);

  // aggiunge un nuovo campo seriale
  const addSerialNumberField = () => {
    setMultipleSerialNumbers([...multipleSerialNumbers, ""]);
  };

  // rimuove un campo seriale
  const removeSerialNumberField = (index: number) => {
    const updatedSerialNumbers = multipleSerialNumbers.filter(
      (_, i) => i !== index
    );
    setMultipleSerialNumbers(updatedSerialNumbers);
  };

  // aggiorna il valore dei serial number dinamici
  const updateSerialNumber = (index: number, value: string) => {
    const updatedSerialNumbers = multipleSerialNumbers.map((serial, i) =>
      i === index ? value : serial
    );
    setMultipleSerialNumbers(updatedSerialNumbers);
  };

  // to get all device types
  useEffect(() => {
    async function fetchDeviceTypes() {
      try {
        const res = await fetch(`${apiendpoint}api/devicetypes`, {
          credentials: "include",
        });
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

  // to get all device specific inputs
  useEffect(() => {
    async function fetchDeviceTypeInputs() {
      if (selectedDeviceType) {
        try {
          const res = await fetch(
            `${apiendpoint}api/devicespecificsinputs/${selectedDeviceType}`,
            {
              credentials: "include",
            }
          );
          if (!res.ok) {
            throw new Error("Failed to fetch device specific inputs");
          }
          const data: DeviceSpecificInput[] = await res.json();
          setDeviceTypeInputs(data);
          console.log(data);
        } catch (error) {
          console.error("Error fetching device specific inputs:", error);
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

    setWarrantyStart(warrantyStartDefault.toISOString().split("T")[0]);
    setWarrantyEnd(warrantyEndDefault.toISOString().split("T")[0]);
  }, []);

  // function that starts when the submit button is clicked
  async function submit() {
    // regEx to allow only letters and numbers
    const serialNumberPattern = /^[A-Za-z0-9]+$/;

    if (isMultipleDevices && multipleSerialNumbers.length < 2) {
      alert("Devi inserire almeno due numeri seriali.");
      return;
    }

    const serialNumbersToValidate = isMultipleDevices
      ? multipleSerialNumbers
      : [serialNumber];

    // controllo duplicati
    const serialsSet = new Set(serialNumbersToValidate);
    if (serialsSet.size !== serialNumbersToValidate.length) {
      alert("Non ci possono essere numeri seriali uguali.");
      return;
    }

    // check if the serial number field is blank, less than 10 characters, or contains special characters
    for (const sn of serialNumbersToValidate) {
      if (!sn || sn.length < 10 || !serialNumberPattern.test(sn)) {
        alert(
          "Il Serial number deve essere lungo almeno 10 caratteri e contenere solo lettere e numeri."
        );
        return;
      }
    }

    // check if the device type is selected
    if (!selectedDeviceType) {
      alert("Please select a device type.");
      return;
    }

    try {
      for (const field of deviceTypeInputs) {
        const fieldValue = (
          document.getElementById(field.id) as HTMLInputElement
        )?.value;
        if (!fieldValue || fieldValue === "Choose an option...") {
          alert(`Perfavore completa il campo ${field.input_label}`);
          return;
        }
      }

      // insert new device or devices
      for (const sn of serialNumbersToValidate) {
        // Inserimento di ogni dispositivo nel database
        const deviceRes = await fetch(`${apiendpoint}api/devices`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            device_type_id: parseInt(selectedDeviceType),
            sn: sn,
            qr_code_string: `SunStorage_DeviceNumber${Math.floor(
              Math.random() * 1000000
            )}`,
          }),
          credentials: "include",
        });

        if (!deviceRes.ok) {
          const errorData = await deviceRes.json();
          throw new Error(errorData.error || "Failed to create device");
        }

        const deviceData = await deviceRes.json();

        // insert new device warranty or NULL if no warranty
        const warrantyRes = await fetch(`${apiendpoint}api/devicewarranties`, {
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
          credentials: "include",
        });

        if (!warrantyRes.ok) {
          const errorData = await warrantyRes.json();
          throw new Error(
            errorData.error || "Failed to create device warranty"
          );
        }

        // insert of device specifics
        for (const field of deviceTypeInputs) {
          const insertSpecific = await fetch(
            `${apiendpoint}api/devicespecifics`,
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                device_id: deviceData.id,
                devicespecific_input_id: field.id,
                value:
                  (document.getElementById(field.id) as HTMLInputElement)
                    ?.value || null,
              }),
              credentials: "include",
            }
          );
          if (!insertSpecific.ok) {
            const errorData = await insertSpecific.json();
            throw new Error(
              errorData.error || "Failed to create device specific"
            );
          }
        }
      }
      // after successful insertion redirect to devices page
      alert("Dispositivo aggiunto!");
      window.location.href = "/devices";
    } catch (error) {
      if (error instanceof Error) {
        alert("Error adding device: " + error.message);
      } else {
        alert("Unknown error adding device");
      }
    }
  }

  const redirectDevices = async () => {
    window.location.href = "/devices";
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <Menu />
          <div className="col-12 col-md-8 nav-container mt-3 mt-md-0">
            <div className="col-12 bg-content p-5">
              <h2>Aggiungi Dispositivo</h2>
              <div className="spacer"></div>
              <div className="add-device-data">
                {!isMultipleDevices && (
                  <>
                    <p>Serial number</p>
                    <input
                      type="text"
                      value={serialNumber}
                      onChange={(e) => setSerialNumber(e.target.value)}
                      required
                    />
                  </>
                )}

                <p>
                  Dispositivi multipli?
                </p>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckDefault"
                    checked={isMultipleDevices}
                    onChange={(e) => setIsMultipleDevices(e.target.checked)}
                  />
                </div>
                {isMultipleDevices && (
                  <>
                    {multipleSerialNumbers.map((serial, index) => (
                      <>
                        <p>Serial number</p>
                        <div className="input-group mb-2" key={index}>
                          <input
                            type="text"
                            className="form-control"
                            value={serial}
                            onChange={(e) =>
                              updateSerialNumber(index, e.target.value)
                            }
                            required
                          />
                          <div className="input-group-append">
                            <button
                              className="btn btn-danger"
                              type="button"
                              onClick={() => removeSerialNumberField(index)}
                            >
                              Elimina
                            </button>
                          </div>
                        </div>
                      </>
                    ))}
                    <button
                      className="btn btn-light mb-2"
                      type="button"
                      onClick={addSerialNumberField}
                    >
                      Aggiungi un'altro dispositivo
                    </button>
                  </>
                )}

                <p>Tipo del dispositivo</p>
                <div className="input-group">
                  <select
                    className="custom-select"
                    id="inputGroupSelect01"
                    value={selectedDeviceType}
                    onChange={(e) => setSelectedDeviceType(e.target.value)}
                    required
                  >
                    <option>Scegli una opzione...</option>
                    {deviceTypes.map((type) => (
                      <option key={type.id} value={type.id.toString()}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  {deviceTypeInputs.map((input) => {
                    if (input.input_type == "select") {
                      const options = JSON.parse(input.input_values);
                      return (
                        <>
                          <p>{input.input_label}:</p>
                          <select id={input.id} name={input.id} required>
                            <option>Choose an option...</option>
                            {options.map((option: string) => (
                              <option value={option}>{option}</option>
                            ))}
                          </select>
                        </>
                      );
                    }

                    if (input.input_type == "text") {
                      return (
                        <>
                          <p>{input.input_label}:</p>
                          <input
                            type="text"
                            id={input.id}
                            name={input.id}
                            placeholder={input.input_placeholder}
                            required
                          />
                        </>
                      );
                    } else if (input.input_type === "number") {
                      return (
                        <div key={input.id}>
                          <p>{input.input_label}:</p>
                          <input
                            type="number"
                            id={input.id}
                            name={input.id}
                            min={10}
                            placeholder={input.input_label}
                            required
                          />
                        </div>
                      );
                    }
                  })}
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
                    <p>Data nizio</p>
                    <input
                      type="date"
                      value={warrantyStart}
                      onChange={(e) => setWarrantyStart(e.target.value)}
                    />
                    <p>Data Fine</p>
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
                <button
                  className="cl-btn"
                  type="reset"
                  onClick={redirectDevices}
                >
                  Cancella
                  <FontAwesomeIcon
                    className="btn-icon"
                    icon={faCancel}
                  ></FontAwesomeIcon>
                </button>
                <button className="sbmt-btn" type="button" onClick={submit}>
                  Salva Dispositvo
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

export default withAuth(AddDevice);
