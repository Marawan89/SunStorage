'use client';
import React, { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
// usePathname is a Client Component hook that lets you read the current URL's pathname.
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLaptop,
  faUsers,
  faComputer,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";
import {} from "@fortawesome/free-regular-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "../globals.css";
import "./style.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import axios from "axios";
import apiendpoint from "../../../apiendpoint";
config.autoAddCss = false;

export default function Menu() {
   const pathname = usePathname();
   const isActive = (path: string) => pathname === path;
   const [admin, setAdmin] = useState({ role: "" });
  // fetch per ottenere i dati dell'admin loggato
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(`${apiendpoint}api/auth/admin-details`, {
          withCredentials: true,
        });
        setAdmin({ role: response.data.role });
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <div className="col-12 col-md-4 justify-content-center">
      <div className="col-12 col-md-11 bg-side-bar">
        <div className="d-flex flex-column align-items-start p-2">
          <button className="nav-item btn p-0 mb-2">
            <a href="/" className={`d-flex align-items-center ${isActive("/") ? "active-link": "" } ` }>
              <FontAwesomeIcon icon={faHouse} className="menuIcons mr-2" />
              <p className="mb-0">Dashboard</p>
            </a>
          </button>
          <div className="spacer"></div>
          <button className="nav-item btn p-0 mb-2">
            <a href="/devices" className={`d-flex align-items-center ${isActive("/devices") ? "active-link": "" } ` }>
              <FontAwesomeIcon icon={faLaptop} className="menuIcons mr-2" />
              <p className="mb-0">Dispositivi</p>
            </a>
          </button>
          <div className="spacer"></div>
          <button className="nav-item btn p-0 mb-2">
            <a href="/departments" className={`d-flex align-items-center ${isActive("/departments") ? "active-link": "" } ` }>
              <FontAwesomeIcon icon={faUsers} className="menuIcons mr-2" />
              <p className="mb-0">Reparti</p>
            </a>
          </button>
          {admin.role === "ADMIN_FULL" && (
            <>
              <div className="spacer"></div>

              <button className="nav-item btn p-0 mb-2">
                <a href="/device-types" className={`d-flex align-items-center ${isActive("/device-types") ? "active-link": "" } ` }>
                  <FontAwesomeIcon
                    icon={faComputer}
                    className="menuIcons mr-2"
                  />
                  <p className="mb-0">Tipi di dispositivi</p>
                </a>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
