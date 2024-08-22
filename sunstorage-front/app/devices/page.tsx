"use client";

import React, { useEffect, useState } from "react";
import Menu from "../parts/menu";
import Navbar from "../parts/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "../globals.css";
import "./style.css";
const apiendpoint = require('../../../apiendpoint');

interface Device{
   id: number;
   sn: string;
   device_type_name: string;
   status: string;
   qr_code_string: string;
   show: boolean;
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

export default function Devices() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [devices, setDevices] = useState<Device[]>();
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<string>("");
  const [filterDeviceTypeOptions, setFilterDeviceTypeOptions] = useState<string[]>([]);
  const [deviceStatusFilter, setDeviceStatusFilter] = useState<string>("");
  const [filterDeviceStatusOption, setFilterDeviceStatusOption] = useState<string[]>([]);
  const [deviceWarrantyFilter, setDeviceWarrantyFilter] = useState<string>("");
 
  function uniqueValues<T>(array: Array<T>, key: keyof T): string[] {
   return Array.from(new Set(array.map(item => item[key] as string)));
  }

  // Route per ottenere una panoramica di tutti i dispositivi
  function fetchDevices() {
   fetch(`${apiendpoint}api/devices/details`)
     .then((response) => response.json())
     .then((data) => {
      setFilterDeviceTypeOptions(uniqueValues(data, 'device_type_name'));
      setFilterDeviceStatusOption(uniqueValues(data, 'status'));
       const updatedDevices = data.map((item: Device) => ({
         ...item,
         show: true,
       }));
       setDevices(updatedDevices);
     });
 }

 useEffect(() => {
   if (!devices) {
     fetchDevices();
   } else {
      let updatedDevices = devices.map((item: Device) => ({
         ...item,
         show: true, 
       }));
   
       // Applica il filtro per deviceTypeFilter
       if (deviceTypeFilter !== "") {
         updatedDevices = updatedDevices.map((item: Device) => ({
           ...item,
           show: item.show && item.device_type_name.toLowerCase() === deviceTypeFilter.toLowerCase(),
         }));
       }
   
       // Applica il filtro per deviceStatusFilter
       if (deviceStatusFilter !== "") {
         updatedDevices = updatedDevices.map((item: Device) => ({
           ...item,
           show: item.show && item.status.toLowerCase() === deviceStatusFilter.toLowerCase(),
         }));
       }

       // Applica il filtro per deviceWarrantyFilter
       if (deviceWarrantyFilter !== "") {
         updatedDevices = updatedDevices.map((item: Device) => ({
           ...item,
           show: item.show && isWarrantyActive(item.devicewarranty.start_date, item.devicewarranty.end_date).toLowerCase() === deviceWarrantyFilter.toLowerCase(),
         }));
       }
       
       // Applica il filtro per deviceWarrantyFilter
      //  if (deviceWarrantyFilter !== "") {
      //    updatedDevices = updatedDevices.map((item: Device) => ({
      //      ...item,
      //      show: item.show && item.devicewarranty === deviceWarrantyFilter.toLowerCase(),
      //    }));
      //  }
   
       setDevices(updatedDevices);
   }
 }, [deviceTypeFilter, deviceStatusFilter, deviceWarrantyFilter]);

  if (!devices) {
   return <div>Loading...</div>;
  }

  // Function to check if warranty is active
  const isWarrantyActive = (start_date: string | null, end_date: string | null) => {
   if (!start_date || !end_date) {
     return "Not available";
   }

   const currentDate = new Date();
   const warrantyEndDate = new Date(end_date);

   return warrantyEndDate >= currentDate ? "Valid" : "Expired";
 };

  // Function to handle device deletion
  const handleDelete = async (deviceId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this device?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${apiendpoint}api/devices/${deviceId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setDevices((prevDevices) =>
          prevDevices?.filter((device) => device.id !== deviceId)
        );
      } else {
        console.error("Failed to delete device:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting device:", error);
    }
    alert("device deleted successfuly")
  };

 const filteredDevices = devices.filter((device) =>
   device.sn.toLowerCase().includes(searchTerm.toLowerCase())
 );

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <Menu />
          <div className="col-12 col-md-8 nav-container mt-3 mt-md-0 p-0">
            <div className="col-12 bg-content p-md-5">
              <a href="devices/create" className="btn btn-primary mb-2">
                Add a device
              </a>
              <div className="filtering">
                <div className="d-flex mb-3">
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search for a Serial Number "
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="row my-2">
               <div className="col-12">
                  Filters:
               </div>
               <div className="col-4">
                  <select className="form-control" onChange={(e) => setDeviceTypeFilter(e.target.value)}>
                     <option value="">Device Type...</option>
                     {filterDeviceTypeOptions.map((item) => (
                        <option value={item}>{item}</option>
                     ))}
                  </select>
               </div>
               <div className="col-4">
                  <select className="form-control" onChange={(e) => setDeviceStatusFilter(e.target.value)}>
                     <option value="">Device Status...</option>
                     {filterDeviceStatusOption.map((item) => (
                        <option value={item}>{item}</option>
                     ))}
                  </select>
               </div>
               <div className="col-4">
                  <select className="form-control" onChange={(e) => setDeviceWarrantyFilter(e.target.value)}>
                     <option value="">Warranty Status...</option>
                     <option value="Valid">Valid</option>
                     <option value="Expired">Expired</option>
                     <option value="Not available">Not available</option>
                  </select>
               </div>
              </div>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Serial Number</th>
                      <th scope="col">Device Type</th>
                      <th scope="col">Warranty</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                  {filteredDevices.filter((device) => device.show === true).length > 0 ? filteredDevices.filter((device) => device.show === true).map((device, index) => (
                      <tr key={index}>
                        <th scope="row">{device.sn}</th>
                        <td>{device.device_type_name}</td>
                        <td>
                          {device.devicewarranty ? isWarrantyActive(device.devicewarranty.start_date, device.devicewarranty.end_date) : 'Not available'}
                        </td>
                        <td>
                           {device.status}
                        </td>
                        <td>
                          <a
                            href={`devices/${device.id}/show`}
                            className="btn view-btn"
                          >
                            View
                          </a>
                        </td>
                        <td>
                          <div className="btn-group drop">
                            <button
                              type="button"
                              className="btn action-btn btn-secondary dropdown-toggle"
                              data-bs-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              Actions
                            </button>
                            <div
                              className="dropdown-menu"
                              aria-labelledby="dropdownMenuButton"
                            >
                              <a
                                href={`devices/${device.id}/edit`}
                                className="dropdown-item"
                              >
                                Edit
                              </a>
                              <a
                                className="dropdown-item"
                                href={`devices/${device.id}/status`}
                              >
                                Status
                              </a>
                              <a
                                className="dropdown-item"
                                href="#"
                                onClick={() => handleDelete(device.id)}
                              >
                                Delete
                              </a>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )) : (
                     <div>
                        <p >No record found</p>
                     </div>
                    )}
                  </tbody>
                </table> 
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}