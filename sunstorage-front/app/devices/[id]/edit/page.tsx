"use client";

import React, { useState, useEffect, useCallback } from "react";
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

interface DeviceSpecific {
  name: string;
  value: string | null;
}

interface Device {
  id: number;
  sn: string;
  device_type_id: string;
}

interface DeviceWarranty {
  start_date: string;
  end_date: string;
}

export default function EditDevice() {
  const params = useParams();
  const [hasWarranty, setHasWarranty] = useState<boolean>(false);
  const [deviceData, setDeviceData] = useState<Device | null>(null);
  const [serialNumber, setSerialNumber] = useState<string>("");
  const [qrCode, setQrCode] = useState<string>("");
  const [selectedDeviceType, setSelectedDeviceType] = useState<string>("");
  const [deviceWarrantyStart, setDeviceWarrantyStart] = useState<string | null>(null);
  const [deviceWarrantyEnd, setDeviceWarrantyEnd] = useState<string | null>(null);
  const [deviceWarrantyData, setDeviceWarrantyData] = useState<DeviceWarranty | null>(null);
  const [deviceSpecificsData, setDeviceSpecificsData] = useState<DeviceSpecific[]>([]);
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
  const [deviceTypeInputs, setDeviceTypeInputs] = useState<any[]>([]);
  const [deviceTypeInputsValues, setDeviceTypeInputsValues] = useState<{ fieldName: string; fieldValue: string | null; fieldId: integer | null }[]>([]);
  const [deviceTypeInputsValuesInitial, setDeviceTypeInputsValuesInitial] = useState<{ fieldName: string; fieldValue: string | null; fieldId: integer | null }[]>([]);

  const idDevice = params.id;

  const fetchDeviceTypes = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:4000/api/devicetypes");
      const data = await response.json();
      setDeviceTypes(data);
    } catch (error) {
      console.error("Error fetching device types:", error);
    }
  }, []);

  const fetchDeviceData = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/devices/${idDevice}`);
      const data: Device = await response.json();
      setDeviceData(data);
      setSerialNumber(data.sn);
      setQrCode(data.qr_code_string)
      setSelectedDeviceType(data.device_type_id);
      fetchDeviceSpecifics(data.device_type_id, (deviceTypeInputsValuesInitial.length == 0 ? true : false));
    } catch (error) {
      console.error("Error fetching device details:", error);
    }
  }, [idDevice]);

  const fetchDeviceSpecifics = useCallback(async (deviceTypeId: string, updateInitial: boolean) => {
    try {
      const response = await fetch(`http://localhost:4000/api/devices/${idDevice}/devicespecifics`);
      const data = await response.json();
      setDeviceSpecificsData(data);

      const inputResponse = await fetch(`http://localhost:4000/api/devicespecificsinputs/${deviceTypeId}`);
      const inputs = await inputResponse.json();
      setDeviceTypeInputs(inputs);

      const fields = inputs.map((input: any) => {
        const foundItem = data.find((item: any) => item.name === input.input_name);
        return { fieldName: input.input_name, fieldValue: foundItem ? foundItem.value : null, fieldId: foundItem ? foundItem.id : null };
      });
      setDeviceTypeInputsValues(fields);
      if (updateInitial){
        setDeviceTypeInputsValuesInitial(fields);
      }
    } catch (error) {
      console.error("Error fetching device specifics or inputs:", error);
    }
  }, [idDevice]);

  const fetchDeviceWarranty = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/devices/${idDevice}/devicewarranty`);
      const data: DeviceWarranty = await response.json();
      setDeviceWarrantyData(data);
      setHasWarranty((data.error ? false : true));
      setDeviceWarrantyStart(data.start_date?.substr(0, 10) || null);
      setDeviceWarrantyEnd(data.end_date?.substr(0, 10) || null);
    } catch (error) {
      console.error("Error fetching device warranty:", error);
    }
  }, [idDevice]);

  useEffect(() => {
    fetchDeviceTypes();
    fetchDeviceData();
    fetchDeviceWarranty();
  }, [fetchDeviceTypes, fetchDeviceData, fetchDeviceWarranty]);

  useEffect(() => {
    if (selectedDeviceType) {
      fetchDeviceSpecifics(selectedDeviceType, (deviceTypeInputsValuesInitial.length == 0 ? true : false));
    }
  }, [selectedDeviceType, fetchDeviceSpecifics]);

  const handleInputChange = useCallback((inputName: string, value: string) => {
    setDeviceTypeInputsValues((prevValues) =>
      prevValues.map((item) => item.fieldName === inputName ? { ...item, fieldValue: value } : item)
    );
  }, []);

  const submit = useCallback(async () => {
    console.log('INIT SUBMIT', { serialNumber, selectedDeviceType, deviceWarrantyStart, deviceWarrantyEnd, deviceTypeInputsValues, deviceTypeInputsValuesInitial });

    // Validation
    if (!validateInput()) return;

    try {
      await updateDeviceData();
      await handleDeviceSpecifics();
      await handleWarranty();
      console.log('SUBMISSION COMPLETE');
    } catch (error) {
      console.error("Error during submit process:", error);
      alert("An error occurred during submission. Please try again. " + error);
    }
    alert("Device edited successfully")
    window.location.href = "/devices"; // redirecting to the /device-types page
  }, [serialNumber, hasWarranty, selectedDeviceType, deviceWarrantyStart, deviceWarrantyEnd, deviceTypeInputsValues, deviceTypeInputsValuesInitial, idDevice, qrCode]);

const validateInput = () => {
  const serialNumberPattern = /^[A-Za-z0-9]{10,}$/;
  if (!serialNumberPattern.test(serialNumber)) {
    alert("Serial Number must be at least 10 characters long and contain only letters and numbers.");
    return false;
  }
  if (!selectedDeviceType) {
    alert("Please select a device type.");
    return false;
  }
  return true;
};

const updateDeviceData = async () => {
  const res = await fetchWithErrorHandling(`http://localhost:4000/api/devices/${idDevice}`, {
    method: "PATCH",
    body: JSON.stringify({
      device_type_id: selectedDeviceType,
      sn: serialNumber,
      qr_code_string: qrCode,
    }),
  });
  console.log('Device update result:', res);
  setDeviceTypeInputsValuesInitial(deviceTypeInputsValues);
};

const updateDeviceSpecifics = async (deviceSpecificsId: number, deviceSpecificsName: string, deviceSpecificsValue: string) => {
  const res = await fetchWithErrorHandling(`http://localhost:4000/api/devicespecifics/${deviceSpecificsId}`, {
    method: "PATCH",
    body: JSON.stringify({
      device_id: idDevice,
      name: deviceSpecificsName,
      value: deviceSpecificsValue,
    }),
  });
  console.log(`Updated device specific: ${deviceSpecificsName}`, res);
  return res;
};

const createDeviceSpecifics = async (deviceSpecificsName: string, deviceSpecificsValue: string) => {
  const res = await fetchWithErrorHandling(`http://localhost:4000/api/devicespecifics`, {
    method: "POST",
    body: JSON.stringify({
      device_id: idDevice,
      name: deviceSpecificsName,
      value: deviceSpecificsValue,
    }),
  });
  console.log(`Created device specific: ${deviceSpecificsName}`, res);
  setDeviceTypeInputsValues((prevValues) =>
    prevValues.map((item) => item.fieldName === deviceSpecificsName ? { ...item, fieldId: res.id } : item)
  );
  setDeviceTypeInputsValuesInitial((prevValues) =>
    prevValues.map((item) => item.fieldName === deviceSpecificsName ? { ...item, fieldId: res.id } : item)
  );
  return res;
};

const deleteDeviceSpecifics = async (deviceSpecificsId: number) => {
  const res = await fetchWithErrorHandling(`http://localhost:4000/api/devicespecifics/${deviceSpecificsId}`, {
    method: "DELETE",
  });
  console.log(`Deleted device specific with ID: ${deviceSpecificsId}`, res);
  return res;
};

const handleDeviceSpecifics = async () => {
  const fieldsToMaintain = [];
  for (const field of deviceTypeInputsValues) {
    const existingField = deviceTypeInputsValuesInitial.find(item => item.fieldName === field.fieldName);
    if (existingField && field.fieldId != null) {
      await updateDeviceSpecifics(field.fieldId, field.fieldName, field.fieldValue);
    } else {
      await createDeviceSpecifics(field.fieldName, field.fieldValue);
    }
    fieldsToMaintain.push(field.fieldName);
  }

  for (const field of deviceTypeInputsValuesInitial) {
    if (!fieldsToMaintain.includes(field.fieldName)) {
      await deleteDeviceSpecifics(field.fieldId);
    }
  }
};

const handleWarranty = async () => {
  try {
    let warrantyRes;
    try {
      warrantyRes = await fetchWithErrorHandling(`http://localhost:4000/api/devices/${idDevice}/devicewarranty`);
    } catch (error) {
      if (error.message === "Device not found" || error.message.includes("404")) {
        console.log("No warranty found for this device");
        warrantyRes = null;
      } else {
        throw error; // Rethrow if it's a different error
      }
    }

    if (!warrantyRes) {
      // Non esiste una garanzia
      if (hasWarranty) {
        console.log("Creating new warranty");
        return createWarranty();
      } else {
        console.log("No warranty to create");
        return;
      }
    }

    // Esiste una garanzia
    if (hasWarranty) {
      console.log("Updating existing warranty");
      return updateWarranty(warrantyRes.id);
    } else {
      console.log("Deleting existing warranty");
      return deleteWarranty(warrantyRes.id);
    }
  } catch (error) {
    console.error("Error handling warranty:", error);
    throw error;
  }
};

const createWarranty = () => fetchWithErrorHandling(`http://localhost:4000/api/devicewarranties`, {
  method: "POST",
  body: JSON.stringify({
    device_id: idDevice,
    start_date: deviceWarrantyStart,
    end_date: deviceWarrantyEnd,
  }),
});

const updateWarranty = (id) => fetchWithErrorHandling(`http://localhost:4000/api/devicewarranties/${id}`, {
  method: "PATCH",
  body: JSON.stringify({
    device_id: idDevice,
    start_date: deviceWarrantyStart,
    end_date: deviceWarrantyEnd,
  }),
});

const deleteWarranty = (id) => fetchWithErrorHandling(`http://localhost:4000/api/devicewarranties/${id}`, {
  method: "DELETE",
});

const fetchWithErrorHandling = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const res = await fetch(url, { ...defaultOptions, ...options });
  if (!res.ok) {
    let errorMessage;
    try {
      const errorData = await res.json();
      errorMessage = errorData.error || "Unknown error";
    } catch (e) {
      errorMessage = `Failed to parse error response: ${res.statusText}`;
    }
    throw new Error(errorMessage);
  }
  const text = await res.text();
  if (!text) {
    return null; // Return null for empty responses
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    console.warn("Response is not JSON:", text);
    return text; // Return the raw text if it's not JSON
  }
};


  if (!deviceData || !deviceSpecificsData || !deviceWarrantyData || deviceTypeInputsValues.length === 0) {
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
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                  />
                </div>
                <div className="col-12 mb-3">
                  <label>Device Type</label>
                  <select
                    className="form-control"
                    id="inputGroupSelect01"
                    onChange={(e) => setSelectedDeviceType(e.target.value)}
                    value={selectedDeviceType}
                    required
                  >
                    <option value="">Choose an option...</option>
                    {deviceTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <p>Ha la garanzia?</p>
                <div className="col-12 mb-3">
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
                      name="warranty_start"
                      className="form-control"
                      value={deviceWarrantyStart || ""}
                      onChange={(e) => setDeviceWarrantyStart(e.target.value)}
                    />
                    <p>Warranty End</p>
                    <input
                      type="date"
                      name="warranty_end"
                      className="form-control"
                      value={deviceWarrantyEnd || ""}
                      onChange={(e) => setDeviceWarrantyEnd(e.target.value)}
                      min={deviceWarrantyStart || ""}
                    />
                  </>
                )}
                </div>
                <div>
                  {deviceTypeInputs.map((input) => {
                    const foundItem = deviceTypeInputsValues.find(item => item.fieldName === input.input_name);
                    const value = foundItem ? foundItem.fieldValue : "";

                    return input.input_type === 'select' ? (
                      <div key={input.input_name}>
                        <p>{input.input_label}:</p>
                        <select
                          name={input.input_name}
                          className="form-control"
                          value={value || ""}
                          onChange={(e) => handleInputChange(input.input_name, e.target.value)}
                          required
                        >
                          <option value="">Choose an option...</option>
                          {JSON.parse(input.input_values).map((option: string) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div key={input.input_name}>
                        <p>{input.input_label}:</p>
                        <input
                          type="text"
                          className="form-control"
                          id={input.input_name}
                          name={input.input_name}
                          placeholder={input.input_placeholder}
                          value={value || ""}
                          onChange={(e) => handleInputChange(input.input_name, e.target.value)}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="col-12 mt-4">
                  <button
                    type="button"
                    className="btn btn-primary"
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
