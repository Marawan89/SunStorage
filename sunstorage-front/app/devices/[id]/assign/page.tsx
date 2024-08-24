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
import { withAuth } from '../../../../../src/server/middleware/withAuth';


interface Department {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
}

function AssignDevice() {
   const params = useParams();

  const idDevice = params.id;
   
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");

  const [newUserName, setNewUserName] = useState("");
  const [newUserSurname, setNewUserSurname] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");

  // to get all departments
  useEffect(() => {
    async function fetchDepartments() {
      try {
        const res = await fetch(`${apiendpoint}api/departments`, {
         credentials: 'include',
        });
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

  useEffect(() => {
    async function fetchUser() {
      console.log(selectedDepartment);
      try {
        const res = await fetch(
          `${apiendpoint}api/departments/` +
            selectedDepartment +
            "/users", {
               credentials: 'include',
             }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }
        const data: User[] = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchUser();
  }, [selectedDepartment]);

  const assignDevice = async (userid: number ) => {
   fetch(`${apiendpoint}api/deviceassignments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        device_id: idDevice,
        user_id: userid,
      }),
      credentials:'include',
    }).then((res) => {
      if (!res.ok) {
        throw new Error("Failed to crearte user");
      }
      console.log("device assigned successfuly")
    })
  }

  const submit = async () => {
    if (selectedDepartment == "" || selectedUser == "") {
      alert("pls select a department and a user");
      return;
    }

    var user_id = null;

    if (selectedUser == "-1") {
      console.log("aggiungo utente");
      console.log(newUserName, newUserSurname, newUserEmail);
      if (newUserName != "" && newUserSurname != "" && newUserEmail != "") {
        console.log(newUserName, newUserSurname, newUserEmail);
        fetch(`${apiendpoint}api/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            department_id: selectedDepartment,
            name: newUserName,
            surname: newUserSurname,
            email: newUserEmail,
          }),
          credentials: 'include',
        }).then((res) => {
          if (!res.ok) {
            throw new Error("Failed to crearte user");
          }
          return res.json();
        }).then((data) => {
         if (data.error) {
            alert("errore durante creazione utente")
         } else{
            assignDevice(data.id)
         }
        }) ;
      } else {
        alert("pls fill name, surname and email");
        return;
      }
    } else {
      assignDevice(selectedUser)
    }

    alert("Device assigned successfully")
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
              <p>Assign Device</p>
              <div className="spacer"></div>
              <div className="add-device-data">
                <p>Fill the fields with the new owner data</p>
                <form>
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
                  {selectedDepartment && (
                    <>
                      <p>Users </p>
                      <div className="input-group">
                        <select
                          className="custom-select"
                          id="inputGroupSelect01"
                          value={selectedUser}
                          onChange={(e) => setSelectedUser(e.target.value)}
                          required
                        >
                          <option>Choose an option...</option>
                          {users.map((type) => (
                            <option key={type.id} value={type.id.toString()}>
                              {type.name}
                            </option>
                          ))}
                          <option value="-1">Add new user....</option>
                        </select>
                      </div>
                    </>
                  )}
                  {selectedUser == "-1" && (
                    <>
                    <form>
                      <p>Name</p>
                      <input
                        type="text"
                        onChange={(e) => setNewUserName(e.target.value)}
                      />
                      <p>Surname</p>
                      <input
                        type="text"
                        onChange={(e) => setNewUserSurname(e.target.value)}
                      />
                      <p>Email</p>
                      <input
                        type="email"
                        onChange={(e) => setNewUserEmail(e.target.value)}
                      />
                      </form>
                    </>
                  )}
                </form>
                <div className="form-btns d-flex flex-md-row justify-content-end align-items-center">
                  <button className="cl-btn" type="reset">
                    Cancel
                    <FontAwesomeIcon
                      className="btn-icon"
                      icon={faCancel}
                    ></FontAwesomeIcon>
                  </button>
                  <button className="sbmt-btn" type="button" onClick={submit}>
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

export default withAuth(AssignDevice);
