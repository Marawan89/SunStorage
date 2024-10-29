"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Menu from "../../../parts/menu";
import Navbar from "../../../parts/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../globals.css";
import "./style.css";
import apiendpoint from "../../../../../apiendpoint";
import { withAuth } from "../../../../../src/server/middleware/withAuth";

interface DeviceType {
  id: number;
  name: string;
}

interface Device {
  id: number;
  sn: string;
  device_type_id: string;
  qr_code_string: string;
}

interface DeviceWarranty {
  start_date: string;
  end_date: string;
}

interface DeviceSpecific {
  id: number;
  devicespecific_input_id: number;
  value: string | null;
}

interface DeviceSpecificInput {
  id: number;
  input_label: string;
  input_name: string;
  input_type: string;
  input_values?: string;
  input_placeholder?: string;
}

function EditDevice() {
  const { id: idDevice } = useParams();
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
  const [serialNumber, setSerialNumber] = useState<string>("");
  const [selectedDeviceType, setSelectedDeviceType] = useState<string>("");
  const [warrantyStart, setWarrantyStart] = useState<string>("");
  const [warrantyEnd, setWarrantyEnd] = useState<string>("");
  const [hasWarranty, setHasWarranty] = useState<boolean>(false);
  const [deviceTypeInputs, setDeviceTypeInputs] = useState<
    DeviceSpecificInput[]
  >([]);

  const [deviceData, setDeviceData] = useState<Device | null>(null);
  const [deviceWarranty, setDeviceWarranty] = useState<DeviceWarranty | null>(
    null
  );
  const [deviceSpecifics, setDeviceSpecifics] = useState<DeviceSpecific[]>([]);
  const [deviceSpecificsOriginal, setDeviceSpecificsOriginal] = useState<
    DeviceSpecific[]
  >([]);

  const fetchData = async (url: string, callback: (data: any) => void) => {
    try {
      const res = await fetch(url, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        callback(data);
      } else {
        console.error(`Failed to fetch data from ${url}`);
      }
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
    }
  };

  useEffect(() => {
    fetchData(`${apiendpoint}api/devicetypes`, setDeviceTypes);
  }, []);

  useEffect(() => {
    fetchData(`${apiendpoint}api/devices/${idDevice}`, (data: Device) => {
      setDeviceData(data);
      setSerialNumber(data.sn);
      setSelectedDeviceType(data.device_type_id);

      fetchData(
        `${apiendpoint}api/devices/${idDevice}/devicespecifics`,
        (data: DeviceSpecific[]) => {
          setDeviceSpecifics(data);
          setDeviceSpecificsOriginal(data);
        }
      );

      fetchData(
        `${apiendpoint}api/devices/${idDevice}/devicewarranty`,
        (data: DeviceWarranty) => {
          if (!data.error) {
            setHasWarranty(true);
            setWarrantyStart(data.start_date.substr(0, 10));
            setWarrantyEnd(data.end_date.substr(0, 10));
          } else {
            setHasWarranty(false);
          }
          setDeviceWarranty(data);
        }
      );
    });
  }, [idDevice]);

  useEffect(() => {
    if (selectedDeviceType) {
      fetchData(
        `${apiendpoint}api/devicespecificsinputs/${selectedDeviceType}`,
        (data: DeviceSpecificInput[]) => {
          setDeviceTypeInputs(data);

          if (selectedDeviceType === deviceData?.device_type_id) {
            setDeviceSpecifics(deviceSpecificsOriginal);
          } else {
            const newDeviceSpecifics = data.map((input) => ({
              devicespecific_input_id: input.id,
              input_label: input.input_label,
              name: input.input_name,
              value: "",
            }));
            setDeviceSpecifics(newDeviceSpecifics);
          }
        }
      );
    }
  }, [selectedDeviceType, deviceData, deviceSpecificsOriginal]);

  const handleChangeDeviceSpecifics = (id: number, value: string) => {
    setDeviceSpecifics((prevSpecifics) =>
      prevSpecifics.map((spec) =>
        spec.devicespecific_input_id === id ? { ...spec, value } : spec
      )
    );
  };

  const validateForm = () => {
    const serialNumberPattern = /^[A-Za-z0-9]+$/;
    if (
      !serialNumber ||
      serialNumber.length < 10 ||
      !serialNumberPattern.test(serialNumber)
    ) {
      alert(
        "Serial Number must be at least 10 characters long and contain only letters and numbers."
      );
      return false;
    }

    if (!selectedDeviceType) {
      alert("Please select a device type.");
      return false;
    }

    return true;
  };

  const submit = async () => {
    if (!validateForm()) return;

    try {
      await fetch(`${apiendpoint}api/devices/${idDevice}`, {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        method: "PATCH",
        body: JSON.stringify({
          device_type_id: selectedDeviceType,
          sn: serialNumber,
          qr_code_string: deviceData?.qr_code_string,
        }),
      });

      if (selectedDeviceType === deviceData?.device_type_id) {
        deviceSpecifics.forEach((spec) => {
          fetch(`${apiendpoint}api/devicespecifics/${spec.id}`, {
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            method: "PATCH",
            body: JSON.stringify({
              device_id: idDevice,
              devicespecific_input_id: spec.devicespecific_input_id,
              value: spec.value,
            }),
          });
        });
      } else {
        deviceSpecificsOriginal.forEach((spec) =>
          fetch(`${apiendpoint}api/devicespecifics/${spec.id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          })
        );

        deviceSpecifics.forEach((spec) =>
          fetch(`${apiendpoint}api/devicespecifics`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              device_id: idDevice,
              devicespecific_input_id: spec.devicespecific_input_id,
              value: spec.value,
            }),
          })
        );
      }

      if (hasWarranty) {
        if (deviceWarranty?.start_date) {
          fetch(`${apiendpoint}api/devicewarranties/${deviceWarranty.id}`, {
            method: "PATCH",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              device_id: idDevice,
              start_date: warrantyStart,
              end_date: warrantyEnd,
            }),
          });
        } else {
          fetch(`${apiendpoint}api/devicewarranties`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              device_id: idDevice,
              start_date: warrantyStart,
              end_date: warrantyEnd,
            }),
          });
        }
      } else if (!hasWarranty && deviceWarranty?.id) {
        fetch(`${apiendpoint}api/devicewarranties/${deviceWarranty.id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
      }

      alert("Device updated successfully!");
      window.location.href = "/devices";
    } catch (error) {
      alert(`Error editing device: ${error.message}`);
    }
  };

  if (!serialNumber || !deviceData || deviceSpecifics.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <Menu />
          <div className="col-12 col-md-8 nav-container mt-3 mt-md-0">
            <div className="col-12 bg-content p-5">
              <h2>Modifica Dispositivo</h2>
              <div className="spacer"></div>
              <div className="edit-device-data">
                <p>Serial number</p>
                <input
                  className="form-control"
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="Enter serial number"
                  required
                />
                <p>Tipo del dispositivo</p>
                <select
                  className="form-select"
                  onChange={(e) => setSelectedDeviceType(e.target.value)}
                  defaultValue={deviceData.device_type_id}
                  required
                >
                  {deviceTypes.map((type) => (
                    <option key={type.id} value={type.id.toString()}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {deviceTypeInputs.map((input) => (
                  <div key={input.id}>
                    <p>{input.input_label}:</p>
                    {input.input_type === "select" ? (
                      <select
                        className="form-select"
                        value={
                          deviceSpecifics.find(
                            (spec) => spec.devicespecific_input_id === input.id
                          )?.value || ""
                        }
                        onChange={(e) =>
                          handleChangeDeviceSpecifics(input.id, e.target.value)
                        }
                      >
                        {input.input_values &&
                          JSON.parse(input.input_values).map((value, index) => (
                            <option key={index} value={value}>
                              {value}
                            </option>
                          ))}
                      </select>
                    ) : (
                      <input
                        className="form-control"
                        type={input.input_type}
                        placeholder={input.input_placeholder || ""}
                        value={
                          deviceSpecifics.find(
                            (spec) => spec.devicespecific_input_id === input.id
                          )?.value || ""
                        }
                        onChange={(e) =>
                          handleChangeDeviceSpecifics(input.id, e.target.value)
                        }
                      />
                    )}
                  </div>
                ))}
                <div>
                  <label>
                    <p>Ha la garanzia</p>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="flexSwitchCheckDefault"
                        checked={hasWarranty}
                        onChange={(e) => setHasWarranty(e.target.checked)}
                      />
                    </div>
                  </label>
                </div>
                {hasWarranty && (
                  <div className="form-group">
                    <p>Data inizio</p>
                    <input
                      className="form-control"
                      type="date"
                      value={warrantyStart}
                      onChange={(e) => setWarrantyStart(e.target.value)}
                    />
                    <p>Data fine</p>
                    <input
                      className="form-control"
                      type="date"
                      min={warrantyStart}
                      value={warrantyEnd}
                      onChange={(e) => setWarrantyEnd(e.target.value)}
                    />
                  </div>
                )}
              </div>
              <div className="form-btns d-flex flex-md-row justify-content-end align-items-center">
                <button className="cl-btn" type="reset">
                  Cancella
                  <FontAwesomeIcon
                    className="btn-icon"
                    icon={faCancel}
                  ></FontAwesomeIcon>
                </button>
                <button className="sbmt-btn" type="button" onClick={submit}>
                  Aggiorna Dati
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

export default withAuth(EditDevice);
