"use client";
import React, { useEffect, useState } from "react";
import Menu from "../parts/menu";
import Navbar from "../parts/navbar";
import StatusModal from "./[id]/status/StatusModal";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "../globals.css";
import "./style.css";
const apiendpoint = require("../../../apiendpoint");
import { withAuth } from "../../../src/server/middleware/withAuth";
import axios from "axios";

interface Device {
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

function Devices() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<string>("");
  const [filterDeviceTypeOptions, setFilterDeviceTypeOptions] = useState<
    string[]
  >([]);
  const [deviceStatusFilter, setDeviceStatusFilter] = useState<string>("");
  const [filterDeviceStatusOption, setFilterDeviceStatusOption] = useState<
    string[]
  >([]);
  const [deviceWarrantyFilter, setDeviceWarrantyFilter] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number>(0);
  const [admin, setAdmin] = useState({ role: "" });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const devicesPerPage = 5;

  const handleOpenModal = (deviceId: number) => {
    setSelectedDeviceId(deviceId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDeviceId(0);
  };

  function uniqueValues<T>(array: Array<T>, key: keyof T): string[] {
    return Array.from(new Set(array.map((item) => item[key] as string)));
  }

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(
          `${apiendpoint}api/auth/admin-details`,
          {
            withCredentials: true,
          }
        );
        setAdmin({ role: response.data.role });
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, []);

  useEffect(() => {
    fetchDevices();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    allDevices,
    searchTerm,
    deviceTypeFilter,
    deviceStatusFilter,
    deviceWarrantyFilter,
  ]);

  function fetchDevices() {
    fetch(`${apiendpoint}api/devices/details`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setFilterDeviceTypeOptions(uniqueValues(data, "device_type_name"));
        setFilterDeviceStatusOption(uniqueValues(data, "status"));
        setAllDevices(data);
        setFilteredDevices(data);
      })
      .catch((error) => {
        console.error("Errore nel fetch dei dispositivi:", error);
      });
  }

  const applyFilters = () => {
    let result = allDevices;

    if (searchTerm) {
      result = result.filter((device) =>
        device.sn.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (deviceTypeFilter) {
      result = result.filter(
        (device) =>
          device.device_type_name.toLowerCase() ===
          deviceTypeFilter.toLowerCase()
      );
    }

    if (deviceStatusFilter) {
      result = result.filter(
        (device) =>
          device.status.toLowerCase() === deviceStatusFilter.toLowerCase()
      );
    }

    if (deviceWarrantyFilter) {
      result = result.filter(
        (device) =>
          isWarrantyActive(
            device.devicewarranty.start_date,
            device.devicewarranty.end_date
          ).toLowerCase() === deviceWarrantyFilter.toLowerCase()
      );
    }

    setFilteredDevices(result);
    setCurrentPage(1);
  };

  const isWarrantyActive = (
    start_date: string | null,
    end_date: string | null
  ) => {
    if (!start_date || !end_date) {
      return "Not available";
    }

    const currentDate = new Date();
    const warrantyEndDate = new Date(end_date);

    return warrantyEndDate >= currentDate ? "Valid" : "Expired";
  };

  const handleDelete = async (deviceId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this device?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${apiendpoint}api/devices/${deviceId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setAllDevices((prevDevices) =>
          prevDevices.filter((device) => device.id !== deviceId)
        );
        setFilteredDevices((prevDevices) =>
          prevDevices.filter((device) => device.id !== deviceId)
        );
      } else {
        console.error("Failed to delete device:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting device:", error);
    }
    alert("Device deleted successfully");
  };

  // pagination
  const indexOfLastDevice = currentPage * devicesPerPage;
  const indexOfFirstDevice = indexOfLastDevice - devicesPerPage;
  const currentDevices = filteredDevices.slice(
    indexOfFirstDevice,
    indexOfLastDevice
  );
  const totalPages = Math.ceil(filteredDevices.length / devicesPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      if (currentPage > 2) {
        pageNumbers.push("...");
      }
      if (currentPage > 1 && currentPage < totalPages) {
        pageNumbers.push(currentPage);
      }
      if (currentPage < totalPages - 1) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }
    return pageNumbers;
  };

  const resetFilters = () => {
    setSearchTerm("");
    setDeviceTypeFilter("");
    setDeviceStatusFilter("");
    setDeviceWarrantyFilter("");
    setFilteredDevices(allDevices);
    setCurrentPage(1);
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <Menu />
          <div className="col-12 col-md-8 nav-container mt-3 mt-md-0 p-0">
            <div className="col-12 bg-content p-md-5">
              <a href="devices/create" className="btn btn-dark mb-2">
                Add a device
              </a>
              <div className="filtering">
                <div className="d-flex mb-3">
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search for a Serial Number"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="row my-2">
                <div className="col-12">Filters:</div>
                <div className="col-4">
                  <select
                    className="form-control"
                    onChange={(e) => setDeviceTypeFilter(e.target.value)}
                  >
                    <option value="">Device Type...</option>
                    {filterDeviceTypeOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-4">
                  <select
                    className="form-control"
                    onChange={(e) => setDeviceStatusFilter(e.target.value)}
                  >
                    <option value="">Device Status...</option>
                    {filterDeviceStatusOption.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-4 d-flex align-items-center">
                  <select
                    className="form-control"
                    onChange={(e) => setDeviceWarrantyFilter(e.target.value)}
                  >
                    <option value="">Warranty Status...</option>
                    <option value="Valid">Valid</option>
                    <option value="Expired">Expired</option>
                    <option value="Not available">Not available</option>
                  </select>
                  <button 
                    className="btn btn-outline-danger ms-2" 
                    title="Reset Filters"
                    onClick={resetFilters}
                  >
                    ❌
                  </button>
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
                    {currentDevices.length > 0 ? (
                      currentDevices.map((device, index) => (
                        <tr key={index}>
                          <th scope="row">{device.sn}</th>
                          <td>{device.device_type_name}</td>
                          <td>
                            {device.devicewarranty
                              ? isWarrantyActive(
                                  device.devicewarranty.start_date,
                                  device.devicewarranty.end_date
                                )
                              : "Not available"}
                          </td>
                          <td>{device.status}</td>
                          <td>
                            <a
                              href={`devices/${device.id}/show`}
                              className="btn btn-outline-warning"
                            >
                              View
                            </a>
                          </td>
                          <td>
                            <div className="btn-group drop">
                              <button
                                type="button"
                                className="btn btn-outline-dark dropdown-toggle"
                                data-bs-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                              >
                                Actions
                              </button>
                              <div
                                className="dropdown-menu dropdown-menu-end position-absolute"
                                aria-labelledby="dropdownMenuButton"
                              >
                                <a
                                  href={`devices/${device.id}/edit`}
                                  className="dropdown-item"
                                >
                                  Edit Device Data
                                </a>
                                <hr className="dropdown-divider" />
                                <a
                                  className="dropdown-item"
                                  href="#"
                                  onClick={() => handleOpenModal(device.id)}
                                >
                                  Change Device Status
                                </a>
                                <hr className="dropdown-divider" />
                                {admin.role === "ADMIN_FULL" && (
                                  <a
                                    className="dropdown-item"
                                    href="#"
                                    onClick={() => handleDelete(device.id)}
                                  >
                                    Delete Device
                                  </a>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6}>No record found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <nav>
                <ul className="pagination justify-content-center">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <a
                      className="page-link"
                      href="#"
                      onClick={() => handlePageChange(currentPage - 1)}
                      tabIndex={currentPage === 1 ? -1 : 0}
                    >
                      Previous
                    </a>
                  </li>
                  {getPageNumbers().map((number, index) => (
                    <li
                      key={index}
                      className={`page-item ${
                        currentPage === number ? "active" : ""
                      } ${number === "..." ? "disabled" : ""}`}
                    >
                      {number === "..." ? (
                        <span className="page-link">...</span>
                      ) : (
                        <a
                          className="page-link"
                          href="#"
                          onClick={() => handlePageChange(number as number)}
                        >
                          {number}
                        </a>
                      )}
                    </li>
                  ))}
                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <a
                      className="page-link"
                      href="#"
                      onClick={() => handlePageChange(currentPage + 1)}
                      tabIndex={currentPage === totalPages ? -1 : 0}
                    >
                      Next
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <StatusModal
        showModal={isModalOpen}
        onClose={handleCloseModal}
        deviceId={selectedDeviceId}
      />
    </>
  );
}

export default withAuth(Devices);
