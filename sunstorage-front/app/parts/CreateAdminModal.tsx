"use client";

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import apiendpoint from "../../../apiendpoint";

interface CreateAdminModalProps {
  showModal: boolean;
  onClose: () => void;
}

export default function CreateAdminModal({ showModal, onClose }: CreateAdminModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // controlli
    if (!formData.name || !formData.surname || !formData.email || !formData.password || !formData.role) {
      alert("Tutti i campi devono essere compilati");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Inserisci un'email valida (esempio marawan@clubdelsole.com)");
      return;
    }

    if (formData.password.length < 6) {
      alert("La password deve essere di almeno 6 caratteri");
      return;
    }

    try {
      await axios.post(`${apiendpoint}api/auth/register`, formData);
      onClose();
      alert("Admin registrato con successo");
    } catch (error) {
      console.error("Errore durante la registrazione dell'admin:", error);
      alert("Errore durante la registrazione");
    }
  };

  if (!showModal) return null;

  return (
    <>
      <div className={`modal-backdrop fade ${showModal ? "show" : ""}`}></div>
      <div className={`modal fade ${showModal ? "show d-block" : ""}`} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Registra Nuovo Admin</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nome</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Cognome</label>
                  <input
                    type="text"
                    className="form-control"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Ruolo</label>
                  <select
                    className="form-control"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="">Seleziona Ruolo</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="ADMIN_FULL">ADMIN_FULL</option>
                  </select>
                </div>
                <div className="text-end">
                  <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
                    Chiudi
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Aggiungi
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
