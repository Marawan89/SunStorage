import React from "react";
import Menu from "../parts/menu";
import Navbar from "../parts/navbar";
import {} from "@fortawesome/free-regular-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "../globals.css";
import "./style.css";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <Menu />
          <div className="col-12 col-md-8 nav-container mt-3 mt-md-0 p-0">
            <div className="col-12 bg-content p-3 p-md-5">
              <div className="row">
                <a href="\add-device">
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
                      <th scope="col">Name</th>
                      <th scope="col">Department</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    <tr>
                      <th scope="row">f45fe5f4w6f4w</th>
                      <td>Marco Antonio</td>
                      <td>Marketing</td>
                      <td>
                        <span className="status-dot"></span> initialized
                      </td>
                      <td>
                        <button className="btn view-btn">View</button>
                      </td>
                      <td>
                        <button className="btn action-btn">Action</button>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">fa56449wwv84</th>
                      <td>Jonny sins</td>
                      <td>IT</td>
                      <td>
                        <span className="status-dot"></span> initialized
                      </td>
                      <td>
                        <button className="btn view-btn">View</button>
                      </td>
                      <td>
                        <button className="btn action-btn">Action</button>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">f4a89f4v65dv4w</th>
                      <td>Bruce Wayne</td>
                      <td>Customer Care</td>
                      <td>
                        <span className="status-dot"></span> initialized
                      </td>
                      <td>
                        <button className="btn view-btn">View</button>
                      </td>
                      <td>
                        <button className="btn action-btn">Action</button>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">f4a89f4v65dv4w</th>
                      <td>Bruce Wayne</td>
                      <td>Customer Care</td>
                      <td>
                        <span className="status-dot"></span> initialized
                      </td>
                      <td>
                        <button className="btn view-btn">View</button>
                      </td>
                      <td>
                        <button className="btn action-btn">Action</button>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">f4a89f4v65dv4w</th>
                      <td>Bruce Wayne</td>
                      <td>Customer Care</td>
                      <td>
                        <span className="status-dot"></span> initialized
                      </td>
                      <td>
                        <button className="btn view-btn">View</button>
                      </td>
                      <td>
                        <button className="btn action-btn">Action</button>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">f4a89f4v65dv4w</th>
                      <td>Bruce Wayne</td>
                      <td>Customer Care</td>
                      <td>
                        <span className="status-dot"></span> initialized
                      </td>
                      <td>
                        <button className="btn view-btn">View</button>
                      </td>
                      <td>
                        <button className="btn action-btn">Action</button>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">f4a89f4v65dv4w</th>
                      <td>Bruce Wayne</td>
                      <td>Customer Care</td>
                      <td>
                        <span className="status-dot"></span> initialized
                      </td>
                      <td>
                        <button className="btn view-btn">View</button>
                      </td>
                      <td>
                        <button className="btn action-btn">Action</button>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">f4a89f4v65dv4w</th>
                      <td>Bruce Wayne</td>
                      <td>Customer Care</td>
                      <td>
                        <span className="status-dot"></span> initialized
                      </td>
                      <td>
                        <button className="btn view-btn">View</button>
                      </td>
                      <td>
                        <button className="btn action-btn">Action</button>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">f4a89f4v65dv4w</th>
                      <td>Bruce Wayne</td>
                      <td>Customer Care</td>
                      <td>
                        <span className="status-dot"></span> initialized
                      </td>
                      <td>
                        <button className="btn view-btn">View</button>
                      </td>
                      <td>
                        <button className="btn action-btn">Action</button>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">f4a89f4v65dv4w</th>
                      <td>Bruce Wayne</td>
                      <td>Customer Care</td>
                      <td>
                        <span className="status-dot"></span> initialized
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
