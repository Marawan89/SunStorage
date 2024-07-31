"use client"

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Menu  from "../parts/menu";
import Navbar from "../parts/navbar";
import "../globals.css";
import "./style.css";

interface Department {
   name: string;
 }

export default function Home() {
  // se si chiama departments sarà sempre il setter come set"nome" quindi --> setDepartments
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
     fetch('http://localhost:4000/api/departments')
      .then((res) => res.json())
      .then((data) => {
        setDepartments(data)
      })
  }, []);

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
                {
                  departments.map(department =>
                    <tr>
                      <td scope="row">{department.name}</td>
                      <td>
                        <button className="btn btn-primary">Edit</button>
                        <button className="btn btn-danger">Delete</button>
                      </td>
                    </tr>
                  )
                }
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
