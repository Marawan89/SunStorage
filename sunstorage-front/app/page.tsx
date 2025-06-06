"use client";
import React, { useState, useEffect } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import "./style.css";
import "./parts/styleBento.css";
import { withAuth } from "../../src/server/middleware/withAuth";
import apiendpoint from "../../apiendpoint";
import CreateAdminModal from "./parts/CreateAdminModal";
import AdminsListModal from "./parts/AdminListModal";
import BentoMenu from "./parts/BentoMenu";

interface Device {
  id: number;
  sn: string;
}

function Dashboard() {
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [showAdminsListModal, setShowAdminsListModal] = useState(false);
  const [admin, setAdmin] = useState({ name: "", role: "" });
  const [showActions, setShowActions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Device[]>([]);
  const [isSearchingSN, setIsSearchingSN] = useState(false);

  // per rendere maiuscola la prima lettera di una stringa
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  // recuperare i dati dell'admin loggato
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${apiendpoint}api/auth/admin-details`, {
          credentials: "include",
        });
        const data = await response.json();
        const capitalizedUser = {
          name: capitalizeFirstLetter(data.name),
          role: data.role,
        };
        setAdmin(capitalizedUser);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleShowCreateAdminModal = () => setShowCreateAdminModal(true);
  const handleCloseCreateAdminModal = () => setShowCreateAdminModal(false);

  const handleShowAdminsListModal = () => setShowAdminsListModal(true);
  const handleCloseAdminsListModal = () => setShowAdminsListModal(false);

  const handleLogout = async () => {
    try {
      await fetch(`${apiendpoint}api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      alert("Logout successfully");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleSearchClick = () => {
    setShowActions(true);
    setIsSearchingSN(false);
  };

  const handleCloseActions = () => {
    setShowActions(false);
    setIsSearchingSN(false);
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleSearchInputChange = async (event: {
    target: { value: string };
  }) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value) {
      // quando viene digitato qualcosa, avvia la ricerca
      try {
        const response = await fetch(
          `${apiendpoint}api/devices/search/${value}`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();

        if (Array.isArray(data)) {
          setSearchResults(data);
          setIsSearchingSN(true);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Errore durante la ricerca:", error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
      setIsSearchingSN(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-end align-items-center">
        <div className="userText-dashboard d-flex align-items-center m-4">
          <p className="mb-0 me-2">Ciao {admin.name}</p>
          <DropdownButton
            title={
              <FontAwesomeIcon
                className="user-icon-dashboard"
                icon={faCircleUser}
              />
            }
            id="dropdown-menu-align-end"
            className="dropdown-button"
          >
            {admin.role === "ADMIN_FULL" && (
              <>
                <Dropdown.Item onClick={handleShowCreateAdminModal}>
                  Crea nuovo Admin
                </Dropdown.Item>
                <Dropdown.Item onClick={handleShowAdminsListModal}>
                  Lista Admin
                </Dropdown.Item>
              </>
            )}

            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </DropdownButton>
        </div>
      </div>
      <div className="container d-flex flex-column align-items-center pt-3 position-relative">
        <div className="text-center">
          <h1 className="logo-dashboard">
            Sun<span>Storage</span>
          </h1>
          <p className="text-white">
            Cerca, aggiungi, modifica – ogni azione è a portata di mano.
          </p>
          <div className="input-group search-group p-3">
            <span className="input-group-text search-emoji">🔍</span>
            <input
              type="text"
              className="form-control search-input"
              placeholder={showActions ? "Choose or type a serial number" : ""}
              value={searchTerm}
              onClick={handleSearchClick}
              onChange={handleSearchInputChange}
            />
            <button className="search-button">cerca ✨</button>
          </div>
          {showActions && (
            <div className="actions-menu position-absolute start-50 translate-middle-x w-50 p-3 shadow-lg bg-light rounded">
              <div className="d-flex justify-content-between">
                <p className="top-text mb-0 p-1">
                  {isSearchingSN
                    ? "Results"
                    : admin.role === "ADMIN"
                    ? "TOP 3 ACTIONS"
                    : "TOP 4 ACTIONS"}
                </p>
                <button
                  className="btn-close"
                  onClick={handleCloseActions}
                ></button>
              </div>
              <ul className="list-group mt-2">
                {!isSearchingSN ? (
                  <>
                    <li className="list-group-item">
                      <a href="/devices/create">
                        ➕ Aggiungi nuovo dispositivo
                      </a>
                    </li>
                    <li className="list-group-item">
                      <a href="/devices">💻 Visualizza tutti i dispositivi</a>
                    </li>
                    <li className="list-group-item">
                      <a href="/departments">👥 Visualizza reparto</a>
                    </li>
                    {admin.role === "ADMIN_FULL" && (
                      <li className="list-group-item">
                        <a href="/device-types">
                          📱 Visualizza i tipi di dispositivi
                        </a>
                      </li>
                    )}
                  </>
                ) : searchResults.length > 0 ? (
                  searchResults.map((device) => (
                    <li key={device.id} className="list-group-item">
                      <a href={`/devices/${device.id}/show`}>
                        Device S/N: {device.sn} - Click to visit
                      </a>
                    </li>
                  ))
                ) : (
                  <li className="list-group-item">No results found</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
      <BentoMenu />

      <CreateAdminModal
        showModal={showCreateAdminModal}
        onClose={handleCloseCreateAdminModal}
      />
      <AdminsListModal
        showModal={showAdminsListModal}
        onClose={handleCloseAdminsListModal}
      />
    </>
  );
}

export default withAuth(Dashboard);
