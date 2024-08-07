import React from "react";
import Menu from "../parts/menu";
import Navbar from "../parts/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../globals.css";
import "./style.css";

export default function Devices() {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <Menu />
          <div className="col-12 col-md-8 nav-container mt-3 mt-md-0 p-0">
            <div className="col-12 bg-content p-3 p-md-5">
              <div className="row">
                <a href="devices\add-device">
                  <button className="btn btn-primary mb-2">Add a device</button>
                </a>
              </div>
              <div className="d-flex mb-3">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                />
                <button className="btn btn-success" type="submit">
                  Search
                </button>
              </div>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Serial Number</th>
                      <th scope="col">Qr Code</th>
                      <th scope="col">Device Type</th>
                      <th scope="col">Status</th>
                      <th scope="col">Warranty Start</th>
                      <th scope="col">Warranty End</th>
                      <th scope="col">Assigned (boolean)</th>
                      <th scope="col">Owner email</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    <tr>
                      <th scope="row">f45fe5f4w6f4w</th>
                      <td>32r89yhrion2g</td>
                      <td>Phone</td>
                      <td>
                        <span className="status-dot"></span> stock
                      </td>
                      <td>
                        <p>20/11/2023</p>
                      </td>
                      <td>
                        <p>20/11/2027</p>
                      </td>
                      <td>
                        <p>Si</p>
                      </td>
                      <td>
                        <p>ciao@gmail.com</p>
                      </td>
                      <td>
                        <button className="btn view-btn">View</button>
                      </td>
                      <td>
                        <button className="btn action-btn">Action</button>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">ffpwmfwgw</th>
                      <td>iewonf2nf2h22</td>
                      <td>PC</td>
                      <td>
                        <span className="status-dot"></span> initialized
                      </td>
                      <td>
                        <p>20/11/2023</p>
                      </td>
                      <td>
                        <p>20/11/2027</p>
                      </td>
                      <td>
                        <p>Si</p>
                      </td>
                      <td>
                        <p>ciao@gmail.com</p>
                      </td>
                      <td>
                        <button className="btn view-btn">View</button>
                      </td>
                      <td>
                        <button className="btn action-btn">Action</button>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">f45fe5f4w6f4w</th>
                      <td>vbnmòknjhgbnjc</td>
                      <td>Laptop</td>
                      <td>
                        <span className="status-dot"></span> initialized
                      </td>
                      <td>
                        <p>20/11/2023</p>
                      </td>
                      <td>
                        <p>20/11/2027</p>
                      </td>
                      <td>
                        <p>No</p>
                      </td>
                      <td>
                        <p>NULL</p>
                      </td>
                      <td>
                        <button className="btn view-btn">View</button>
                      </td>
                      <td>
                        <button className="btn action-btn">Action</button>
                      </td>
                    </tr>
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

/*
- Quando un valore è NULL tipo visualizzare sta informazione non è disponibile tipo oppure non è available
*/