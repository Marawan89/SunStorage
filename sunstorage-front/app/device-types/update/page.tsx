"use client";

import React, { useState, useEffect } from "react";
import Menu from "../../parts/menu";
import Navbar from "../../parts/navbar";
import "../../globals.css";
import "./style.css";
import apiendpoint from "../../../../apiendpoint";
import { withAuth } from "../../../../src/server/middleware/withAuth";
import BackButton from "@/app/parts/BackButton";

interface InputField {
  name: string;
  label: string;
  type: string;
  values: string[];
  placeholder: string;
}

function UpdateDeviceType() {
  const [id, setId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [inputs, setInputs] = useState<InputField[]>([]);

  const [editedName, setEditedName] = useState("");
  const [editedInputs, setEditedInputs] = useState<InputField[]>([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const devicetypesId = urlParams.get("id");
    setId(devicetypesId);

    if (devicetypesId) {
      fetch(`${apiendpoint}api/devicetypes/${devicetypesId}`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          setName(data.name);
          setInputs(data.inputs || []);
          setEditedName(data.name);
          setEditedInputs(data.inputs || []);
        });
    }
  }, []);

  const handleInputChange = (
    index: number,
    field: keyof InputField,
    value: string
  ) => {
    const updatedInputs = [...editedInputs];

    if (field === "type" && value === "select") {
      updatedInputs[index].values = updatedInputs[index].values || [];
    }

    if (field === "name") {
      updatedInputs[index][field] = value.toUpperCase().replace(/\s+/g, "_");
    } else {
      updatedInputs[index][field] = value;
    }

    setEditedInputs(updatedInputs);
  };

  const handleValueChange = (
    index: number,
    valueIndex: number,
    value: string
  ) => {
    const updatedInputs = [...editedInputs];
    if (value.trim() !== "") {
      updatedInputs[index].values[valueIndex] = value;
    }
    setEditedInputs(updatedInputs);
  };

  const handleAddValue = (index: number) => {
    const updatedInputs = [...editedInputs];
    const lastValue =
      updatedInputs[index].values[updatedInputs[index].values.length - 1];
    if (lastValue?.trim() !== "") {
      updatedInputs[index].values.push("");
      setEditedInputs(updatedInputs);
    } else {
      alert("Hai lasciato il valore prima vuoto");
    }
  };

  const handleRemoveValue = (index: number, valueIndex: number) => {
    const updatedInputs = [...editedInputs];
    updatedInputs[index].values = updatedInputs[index].values.filter(
      (_, i) => i !== valueIndex
    );
    setEditedInputs(updatedInputs);
  };

  const handleAddInput = () => {
    setEditedInputs([
      ...editedInputs,
      { name: "", label: "", type: "text", values: [], placeholder: "" },
    ]);
  };

  const handleRemoveInput = (index: number) => {
    if (window.confirm("Sei sicuro di cancellare l'input?")) {
      setEditedInputs(editedInputs.filter((_, i) => i !== index));
    }
  };

  const submit = () => {
    const regex = /^[a-zA-Z0-9\s]+$/;
    if (!editedName || !regex.test(editedName)) {
      alert(
        "Il nome del tipo di device non può essere vuoto o contenere caratteri speciali."
      );
      return;
    }

    if (editedInputs.length === 0) {
      alert("Devi aggiungere almeno un input per il tipo di device.");
      return;
    }

    for (let input of editedInputs) {
      if (!input.name.startsWith(editedName.toUpperCase() + "_")) {
        alert(
          `Il nome dell'input deve essere composto da "${editedName.toUpperCase()}" seguito dal nome dell'input separato da "_"`
        );
        return;
      }

      if (!input.name || !input.label) {
        alert("Ogni input deve avere un nome e un'etichetta.");
        return;
      }

      if (input.type === "choose") {
        alert("Devi scegliere un tipo di input valido (text, number, select).");
        return;
      }

      if (input.type === "select" && input.values.length < 2) {
        alert(
          "Se il tipo di input è 'select', devi aggiungere almeno due valori."
        );
        return;
      }

      if (
        input.type === "select" &&
        input.values.some((v) => v.trim() === "")
      ) {
        alert(
          "I valori per il tipo di input 'select' non possono essere vuoti."
        );
        return;
      }

      if (
        (input.type === "text" || input.type === "number") &&
        !input.placeholder
      ) {
        alert(
          "I campi di tipo 'text' e 'number' non possono essere lasciati vuoti."
        );
        return;
      }
    }

    if (id) {
      fetch(`${apiendpoint}api/devicetypes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editedName, inputs: editedInputs }),
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            alert("Errore durante l'aggiornamento del tipo di device.");
          } else {
            alert("Device type aggiornato con successo");
            window.location.href = "/device-types";
          }
        })
        .catch((error) => {
          console.error("Errore:", error);
          alert("Errore durante l'aggiornamento del tipo di device.");
        });
    }
  };

  const resetPage = () => {
    window.location.href = "/device-types";
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <Menu />
          <div className="col-12 col-md-8 nav-container mt-3 mt-md-0 p-0">
            <div className="col-12 bg-content p-3 p-md-5">
              <div className="row">
                <div className="col-12">
                  <BackButton />
                  <h2>Modifica tipo di dispositivo</h2>
                  <div className="spacer"></div>
                  Nome del tipo di device
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    id="name_devicetypes"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                  {editedInputs.map((input, index) => (
                    <div
                      key={index}
                      className="mt-4 border border-3 border-white p-3"
                    >
                      Nome dell'input che sarà visibile nel db (es.
                      LAPTOP_DISK_TYPE)
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Nome dell'input"
                        value={input.name}
                        onChange={(e) =>
                          handleInputChange(index, "name", e.target.value)
                        }
                      />
                      Label dell'input che sarà visibile nella pagina
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Label dell'input"
                        value={input.label}
                        onChange={(e) =>
                          handleInputChange(index, "label", e.target.value)
                        }
                      />
                      Tipo dell'input
                      <select
                        className="form-control mb-2"
                        value={input.type}
                        onChange={(e) =>
                          handleInputChange(index, "type", e.target.value)
                        }
                      >
                        <option value="text">Testo</option>
                        <option value="number">Numero</option>
                        <option value="select">Select</option>
                      </select>
                      {(input.type === "text" || input.type === "number") && (
                        <>
                          Placeholder
                          <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Placeholder"
                            value={input.placeholder}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "placeholder",
                                e.target.value
                              )
                            }
                          />
                        </>
                      )}
                      {input.type === "select" &&
                        input.values.map((value, valueIndex) => (
                          <div key={valueIndex} className="input-group mb-2">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Add value of select"
                              value={value}
                              onChange={(e) =>
                                handleValueChange(
                                  index,
                                  valueIndex,
                                  e.target.value
                                )
                              }
                            />
                            <div className="input-group-append">
                              <button
                                className="btn btn-danger"
                                type="button"
                                onClick={() =>
                                  handleRemoveValue(index, valueIndex)
                                }
                              >
                                Elimina
                              </button>
                            </div>
                          </div>
                        ))}
                      {input.type === "select" && (
                        <button
                          className="btn btn-light"
                          type="button"
                          onClick={() => handleAddValue(index)}
                        >
                          Aggiungi valore
                        </button>
                      )}
                      <div>
                        <button
                          className="btn btn-danger mt-2"
                          type="button"
                          onClick={() => handleRemoveInput(index)}
                        >
                          Elimina input
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="col-12 mt-3">
                  <button
                    className="btn btn-light"
                    type="button"
                    onClick={handleAddInput}
                  >
                    Aggiungi input
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success m-2"
                    onClick={submit}
                  >
                    Salva dati
                  </button>
                  <button
                    type="reset"
                    className="btn btn-secondary"
                    onClick={resetPage}
                  >
                    Cancella
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default withAuth(UpdateDeviceType);
