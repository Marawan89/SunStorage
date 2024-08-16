"use client";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Menu from "../../../parts/menu";
import Navbar from "../../../parts/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../globals.css";
import "./style.css";

interface Department {
  id: number;
  name: string;
}

export default function AssignDevice() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  // to get all departments
  useEffect(() => {
    async function fetchDepartments() {
      try {
        const res = await fetch("http://localhost:4000/api/departments");
        if (!res.ok) {
          throw new Error("Failed to fetch departments");
        }
        const data: Department[] = await res.json();
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching department:", error);
      }
    }

    fetchDepartments();
  }, []);

  // check if the department is selected
//   if (!selectedDepartment) {
//     alert("Please select a department");
//     return;
//   }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <Menu />
          <div className="col-12 col-md-8 nav-container mt-3 mt-md-0">
            <div className="col-12 bg-content p-5">
              <p>Assign Device</p>
              <div className="spacer"></div>
              <div className="add-device-data">
                <p>Fill the fields with the new owner data</p>
                <p>Name</p>
                <input type="text" />
                <p>Surname</p>
                <input type="text" />
                <p>Email</p>
                <input type="text" />
                <p>Department</p>
                <div className="input-group">
                  <select
                    className="custom-select"
                    id="inputGroupSelect01"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    required
                  >
                    <option>Choose an option...</option>
                    {departments.map((type) => (
                      <option key={type.id} value={type.id.toString()}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-btns d-flex flex-md-row justify-content-end align-items-center">
                  <button className="cl-btn" type="reset">
                    Cancel
                    <FontAwesomeIcon
                      className="btn-icon"
                      icon={faCancel}
                    ></FontAwesomeIcon>
                  </button>
                  <button className="sbmt-btn" type="button">
                    Save and assign device
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
      </div>
    </>
  );
}
