"use client"

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Menu  from "../parts/menu";
import Navbar from "../parts/navbar";
import "../globals.css";
import "./style.css";
import apiendpoint from "../../../apiendpoint";

interface Devicetypes {
   id: number;
   name: string;
 }

export default function Devicetypes() {
  const [devicetypes, setDeviceTypes] = useState<Devicetypes[]>([]);

  useEffect(() => {
     fetch(`${apiendpoint}api/devicetypes`)
      .then((res) => res.json())
      .then((data) => {
        setDeviceTypes(data)
      })
  }, []);

  if (!devicetypes) {
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
                <a className="btn btn-primary" href="/device-types/create">Add a Device Type</a>
              </div>
              <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Device type Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                    {devicetypes.map(devicetypes => (
                      <tr key={devicetypes.id}>
                        <td scope="row">{devicetypes.name}</td>
                        <td>
                          <a className="btn btn-primary m-1" href={`/device-types/update?id=${devicetypes.id}`}>Edit</a>
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
