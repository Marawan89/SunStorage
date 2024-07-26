import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faRightFromBracket,
  faTableList,
  faCirclePlus,
  faCancel,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import {} from "@fortawesome/free-regular-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "../globals.css";
import "./style.css";

export default function Home() {
  return (
    <>
      <nav className="navbar navbar-expand-lg p-4">
        <div className="container">
          <a href="/">
            <h1>
              Sun<span>Storage</span>
            </h1>
          </a>
          <div className="d-flex justify-content-end align-items-center">
            <div className="userText d-flex align-items-center">
              <p className="mb-0 me-2">Ciao, Marawan</p>
              <FontAwesomeIcon className="user_icon" icon={faCircleUser} />
            </div>
          </div>
        </div>
      </nav>
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-4 justify-content-center">
            <div className="col-12 col-md-11 bg-side-bar">
              <div className="d-flex flex-column  align-items-start p-2">
                <button className="nav-item btn p-0 mb-2">
                  <a href="/add-device" className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faCirclePlus} className="mr-2" />
                    <p className="mb-0">Add device</p>
                  </a>
                </button>
                <div className="spacer"></div>
                <button className="nav-item btn p-0 mb-2">
                  <a href="/view-all\" className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faTableList} className="mr-2" />
                    <p className="mb-0">View all</p>
                  </a>
                </button>
                <div className="spacer"></div>
                <button className="logout-btn nav-item btn p-0">
                  <a href="/login" className="d-flex align-items-center">
                    <FontAwesomeIcon
                      icon={faRightFromBracket}
                      className="mr-2"
                    />
                    <p className="mb-0">Logout</p>
                  </a>
                </button>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-8 nav-container mt-3 mt-md-0 p-0">
            <div className="col-12 bg-content p-3 p-md-5">
              <div className="d-flex mb-3">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                />
                <button className="btn btn-primary" type="submit">
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
                      <span className="status-dot"></span> in progress
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
                      <span className="status-dot"></span> in progress
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
                      <span className="status-dot"></span> in progress
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
                      <span className="status-dot"></span> in progress
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
                      <span className="status-dot"></span> in progress
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
                      <span className="status-dot"></span> in progress
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
                      <span className="status-dot"></span> in progress
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
                      <span className="status-dot"></span> in progress
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
                      <span className="status-dot"></span> in progress
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
                      <span className="status-dot"></span> in progress
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
