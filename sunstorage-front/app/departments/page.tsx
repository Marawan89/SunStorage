"use client"

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Menu  from "../parts/menu";
import Navbar from "../parts/navbar";
import "../globals.css";
import "./style.css";

interface Department {
   id: number;
   name: string;
 }

export default function Departments() {
  // se si chiama departments sarà sempre il setter come set"nome" quindi --> setDepartments
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
     fetch('http://localhost:4000/api/departments')
      .then((res) => res.json())
      .then((data) => {
        setDepartments(data)
      })
  }, []);

  // method to handle the deletion of a department from the db
  const handleDelete = (id: number) => {
   if (window.confirm("Sei sicuro di eliminare il reparto?")) {
     fetch(`http://localhost:4000/api/departments/${id}`, {
       method: 'DELETE',
     })
       .then((res) => {
         if (res.status === 204) {
           setDepartments(departments.filter(department => department.id !== id));
         } else {
           alert("Errore durante l'eliminazione del reparto.");
         }
       })
       .catch((error) => {
         console.error("Errore:", error);
         alert("Errore durante l'eliminazione del reparto.");
       });
   }
 };

  if (!departments) {
    return "loading...";
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <Menu />
          <div className="col-12 col-md-8 nav-container mt-3 mt-md-0 p-0">
            <div className="col-12 bg-content p-3 p-md-5">
              <div className="d-flex mb-3">
                <a className="btn btn-primary" href="/departments/create">Add Department</a>
              </div>
              <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Department Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                    {departments.map(department => (
                      <tr key={department.id}>
                        <td scope="row">{department.name}</td>
                        <td>
                          <a className="btn btn-primary m-1" href={`/departments/update?id=${department.id}`}>Edit</a>
                          <button className="btn btn-danger m-1" onClick={() => handleDelete(department.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
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