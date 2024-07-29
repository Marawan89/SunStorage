import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faRightFromBracket,
  faTableList,
  faCirclePlus
} from "@fortawesome/free-solid-svg-icons";
import {} from "@fortawesome/free-regular-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import "./style.css";
import Navbar from "./parts/navbar"
import Menu from "./parts/menu"

export default function Dashboard() {
  return (
    <>
      <Navbar/>
      <div className="container">
        <div className="row">
         <Menu/>
          <div className="col-12 col-md-8 nav-container mt-3 mt-md-0">
            <div className="col-12 bg-content p-3">
            Dashboard
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
