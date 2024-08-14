"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Menu from "../../../parts/menu";
import Navbar from "../../../parts/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../globals.css";
import "./style.css";

interface DeviceType {
  id: number;
  name: string;
}

export default function EditDevice() {
  const params = useParams();
  // const [device, setDevice] = useState<DeviceDetails | null>(null);

  const [selectedDeviceType, setSelectedDeviceType] = useState<string>("");
  const [deviceData, setDeviceData] = useState([]);
  const [deviceWarrantyData, setDeviceWarrantyData] = useState([]);
  const [hasWarranty, setHasWarranty] = useState<boolean>(false);
  const [deviceSpecificsData, setDeviceSpecificsData] = useState([]);
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
  const [deviceTypeInputs, setDeviceTypeInputs] = useState([]);

  // Fetch the device details on component mount
  useEffect(() => {
    const idDevice = params.id;
    console.log("Device ID retrieved:", idDevice);

    //recupero devicetypes
    fetch(`http://localhost:4000/api/devicetypes`)
      .then((response) => response.json())
      .then((data) => {
        setDeviceTypes(data);
      })
      .catch((error) => console.error("Error fetching device details:", error));

    //prendo dati del device
    fetch(`http://localhost:4000/api/devices/${idDevice}`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setDeviceData(data);

          fetch(
            `http://localhost:4000/api/devicespecificsinputs/${data.device_type_id}`
          )
            .then((response) => response.json())
            .then((data) => {
              if (data) {
                //const data: DeviceType[] = response.json();
                setDeviceTypeInputs(data);
                console.log(data);
              } else {
                console.error(
                  "DeviceTypeInputs -> No device inputs with the provided ID:",
                  data.device_type_id
                );
              }
            })
            .catch((error) =>
              console.error("Error fetching device specifics details:", error)
            );
        } else {
          console.error(
            "Device -> No device found with the provided ID:",
            idDevice
          );
        }
      })
      .catch((error) => console.error("Error fetching device details:", error));

    // prendo dati del device warranty
    fetch(`http://localhost:4000/api/devices/${idDevice}/devicewarranty`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setDeviceWarrantyData(data);
        } else {
          console.error(
            "DeviceWarranty -> No device found with the provided ID:",
            idDevice
          );
        }
      })
      .catch((error) =>
        console.error("Error fetching device warranty details:", error)
      );

    //prendo dati del device specifics
    fetch(`http://localhost:4000/api/devices/${idDevice}/devicespecifics`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setDeviceSpecificsData(data);
        } else {
          console.error(
            "DeviceWarranty -> No device found with the provided ID:",
            idDevice
          );
        }
      })
      .catch((error) =>
        console.error("Error fetching device specifics details:", error)
      );
  }, []);

  useEffect(() => {
    async function fetchDeviceTypeInputs() {
      if (selectedDeviceType) {
        try {
          console.log("download = " + selectedDeviceType);
          const res = await fetch(
            "http://localhost:4000/api/devicespecificsinputs/" +
              selectedDeviceType
          );
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

  async function submit() {
    // regEx to allow only letters and numbers
    const serialNumberPattern = /^[A-Za-z0-9]+$/;
    const serialNumber = document.getElementById("sn");
    // check if the serial number field is blank, less than 10 characters or contains special characters
    if (
      !serialNumber ||
      serialNumber.length < 10 ||
      !serialNumberPattern.test(serialNumber)
    ) {
      alert(
        "Serial Number must be at least 10 characters long and contain only letters and numbers."
      );
      return;
    }

    return; // perchè un return qua?
    // check if the device type is selected
    if (!selectedDeviceType) {
      alert("Please select a device type.");
      return;
    }

    try {
      for (const field of deviceTypeInputs) {
        if (
          document.getElementById(field.input_name).value ==
            "Choose an option..." ||
          document.getElementById(field.input_name).value == null ||
          document.getElementById(field.input_name).value == ""
        ) {
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
  // // Helper function to format the date
  // const formatDate = (dateString: string | null): string | null => {
  //   if (!dateString) return null;
  //   const date = new Date(dateString);
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, "0");
  //   const day = String(date.getDate()).padStart(2, "0");
  //   return `${year}-${month}-${day}`;
  // };

  // // Handle the update process
  // const handleUpdate = () => {
  //   if (!id || !device) {
  //     console.error("Device ID or details are missing.");
  //     return;
  //   }

  //   console.log("Updating device with ID:", id);
  //   console.log("Device data being sent:", device);

  //   fetch(`http://localhost:4000/api/devices/${id}`, {
  //     method: "PATCH",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       device_type_id: device.device_type, // assuming `device_type` is actually the device_type_id
  //       sn: device.serial_number,
  //       qr_code_string: device.qr_code,
  //       specifics: device.specifics.join(", "),
  //       warranty_start: device.warranty_start,
  //       warranty_end: device.warranty_end,
  //     }),
  //   })
  //     .then((res) => {
  //       if (!res.ok) {
  //         return res.json().then((err) => {
  //           throw new Error(err.error || "Unknown error");
  //         });
  //       }
  //       return res.json();
  //     })
  //     .then((data) => {
  //       if (data.error) {
  //         console.error("Error updating device:", data.error);
  //         alert("Errore durante l'aggiornamento del dispositivo.");
  //       } else {
  //         window.location.href = "/devices";
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Errore durante la richiesta PATCH:", error);
  //       alert("Errore durante l'aggiornamento del dispositivo.");
  //     });
  // };

  // // Handle changes in the specifics array
  // const handleSpecificChange = (index: number, value: string) => {
  //   if (device) {
  //     const updatedSpecifics = [...device.specifics];
  //     updatedSpecifics[index] = value;
  //     setDevice({
  //       ...device,
  //       specifics: updatedSpecifics,
  //     });
  //   }
  // };

  // // Handle changes in the input fields
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (device) {
  //     const updatedDevice = {
  //       ...device,
  //       [e.target.name]: e.target.value,
  //     };
  //     console.log("Updated device data:", updatedDevice);
  //     setDevice(updatedDevice);
  //   }
  // };

  if (!deviceData && !deviceSpecificsData && !deviceWarrantyData) {
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
              <h3>Edit Device</h3>
              <div className="row">
                <div className="col-12 mb-3">
                  <label>Serial Number</label>
                  <input
                    type="text"
                    name="serial_number"
                    className="form-control"
                    value={deviceData.sn}
                    // onChange={handleChange}
                  />
                </div>
                <div className="col-12 mb-3">
                  <label>Device Type</label>
                  <select
                    className="form-control"
                    id="inputGroupSelect01"
                    onChange={(e) => {
                      setSelectedDeviceType(e.target.value);
                    }}
                    required
                  >
                    <option>Choose an option...</option>
                    {deviceTypes.map((type) => {
                      if (type.id == deviceData.device_type_id) {
                        return (
                          <option key={type.id} value={type.id} selected>
                            {type.name}
                          </option>
                        );
                      } else {
                        return (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        );
                      }
                    })}
                  </select>
                </div>
                <div>
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
                </div>
                <div>
                {hasWarranty && (
                  <>
                     <label>Warranty Start</label>
                  <input
                    type="date"
                    name="warranty_start"
                    className="form-control"
                    value={
                      String(deviceWarrantyData.start_date).substr(0, 10) || ""
                    }
                    // onChange={handleChange}
                  />
                  <label>Warranty End</label>
                  <input
                    type="date"
                    name="warranty_end"
                    className="form-control"
                    value={
                      String(deviceWarrantyData.end_date).substr(0, 10) || ""
                    }
                    // onChange={handleChange}
                  />
                  </>
                )}
                </div>
                {/* <div className="col-12 mb-3">
                  <label>Warranty Start</label>
                  <input
                    type="date"
                    name="warranty_start"
                    className="form-control"
                    value={
                      String(deviceWarrantyData.start_date).substr(0, 10) || ""
                    }
                    // onChange={handleChange}
                  />
                </div> */}
                {/* <div className="col-12 mb-3">
                  <label>Warranty End</label>
                  <input
                    type="date"
                    name="warranty_end"
                    className="form-control"
                    value={
                      String(deviceWarrantyData.end_date).substr(0, 10) || ""
                    }
                    // onChange={handleChange}
                  />
                </div> */}

                <div>
                  {deviceTypeInputs.map((input) => {
                    if (input.input_type == "select") {
                      const options = JSON.parse(input.input_values);
                      const foundItem = deviceSpecificsData.find(
                        (item) => item.name === input.input_name
                      );
                      const value = foundItem ? foundItem.value : null;
                      return (
                        <>
                          <p>{input.input_label}:</p>
                          <select
                            id={input.input_name}
                            name={input.input_name}
                            className="form-control"
                            value={value}
                            required
                          >
                            <option>Choose an option...</option>
                            {options.map((option) => (
                              <option value={option}>{option}</option>
                            ))}
                          </select>
                        </>
                      );
                    }

                    if (input.input_type == "text") {
                      const foundItem = deviceSpecificsData.find(
                        (item) => item.name === input.input_name
                      );
                      const value = foundItem ? foundItem.value : null;
                      return (
                        <>
                          <p>{input.input_label}:</p>
                          <input
                            type="text"
                            className="form-control"
                            id={input.input_name}
                            name={input.input_name}
                            placeholder={input.input_placeholder}
                            value={value}
                            required
                          />
                        </>
                      );
                    }
                  })}
                </div>

                <div className="col-12 mt-3">
                  <button
                    type="submit"
                    className="btn btn-success"
                    onClick={submit}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
