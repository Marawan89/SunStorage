import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faRightFromBracket,
  faTableList,
  faCirclePlus,
  faCancel,
  faArrowRight
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
                  <a href="/" className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faCirclePlus} className="mr-2" />
                    <p className="mb-0">Add device</p>
                  </a>
                </button>
                <div className="spacer"></div>
                <button className="nav-item btn p-0 mb-2">
                  <a href="/" className="d-flex align-items-center">
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
          <div className="col-12 col-md-8 nav-container mt-3 mt-md-0">
            <form className="col-12 bg-content p-5">
              <p>Add Device</p>
              <div className="spacer"></div>
              <div className="add-device-data">
                <p>Serial number (91815613)</p>
                <input type="text" />
                <p>Qr Code</p>
                <input type="text" />
                <p>Name</p>
                <input type="text" />
                <p>Surname</p>
                <input type="text" />
                <p>Department</p>
                <div className="input-group">
                  <select className="custom-select" id="inputGroupSelect01">
                    <option selected>Choose...</option>
                    <option value="1">Booking</option>
                    <option value="2">IT</option>
                    <option value="3">Managment</option>
                  </select>
                </div>
                <p>Device Type</p>
                <div className="input-group">
                  <select className="custom-select" id="inputGroupSelect01">
                    <option selected>Choose...</option>
                    <option value="1">Laptop</option>
                    <option value="2">Yealink</option>
                    <option value="3">SmartPhone</option>
                  </select>
                </div>
                <p>Warranty Start</p>
                <input type="date" />
                <p>Warranty End</p>
                <input type="date" />
                <p>Assignment DateTime</p>
                <input type="datetime-local" />
                <p>Description</p>
                <textarea className="description"/>
              </div>
              <div className="form-btns d-flex flex-md-row justify-content-end align-items-center">
                <button className="cl-btn" type="reset">
                  Cancel
                  <FontAwesomeIcon className="btn-icon" icon={faCancel}></FontAwesomeIcon>
                </button>
                <button className="sbmt-btn" type="submit">
                  Save product
                  <FontAwesomeIcon className="btn-icon" icon={faArrowRight}></FontAwesomeIcon>
               </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
