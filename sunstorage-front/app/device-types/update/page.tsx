"use client";

import React, { useState, useEffect } from "react";
import Menu from "../../parts/menu";
import Navbar from "../../parts/navbar";
import "../../globals.css";
import "./style.css";
import apiendpoint from "../../../../apiendpoint";
import { withAuth } from '../../../../src/server/middleware/withAuth';

interface InputField {
  name: string;
  label: string;
  type: string;
  values: string[];
  placeholder: string;
}

function UpdateDeviceType() {
   const [name, setName] = useState("");
   const [id, setId] = useState<string | null>(null);
   const [inputs, setInputs] = useState<InputField[]>([]);

   useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const devicetypesId = urlParams.get('id');
      setId(devicetypesId);
  
      if (devicetypesId) {
        fetch(`${apiendpoint}api/devicetypes/${devicetypesId}`, {
          credentials: 'include',
        })
          .then((res) => res.json())
          .then((data) => {
            setName(data.name);
            setInputs(data.inputs || []);
          });
      }
    }, []);

    const handleInputChange = (index: number, field: keyof InputField, value: string) => {
      const updatedInputs = [...inputs];
      updatedInputs[index][field] = value;
      setInputs(updatedInputs);
    };

    const handleValueChange = (index: number, valueIndex: number, value: string) => {
      const updatedInputs = [...inputs];
      // Aggiorna solo se il valore non è vuoto
      if (value.trim() !== "") {
        updatedInputs[index].values[valueIndex] = value;
      }
      setInputs(updatedInputs);
    };

    const handleAddValue = (index: number) => {
      // Aggiungi solo se l'ultimo valore non è vuoto
      const updatedInputs = [...inputs];
      const lastValue = updatedInputs[index].values[updatedInputs[index].values.length - 1];
      if (lastValue?.trim() !== "") {
        updatedInputs[index].values.push("");
        setInputs(updatedInputs);
      } else {
        alert("Non puoi aggiungere un valore vuoto.");
      }
    };

    const handleRemoveValue = (index: number, valueIndex: number) => {
      const updatedInputs = [...inputs];
      updatedInputs[index].values = updatedInputs[index].values.filter((_, i) => i !== valueIndex);
      setInputs(updatedInputs);
    };

    const handleAddInput = () => {
      setInputs([
        ...inputs,
        { name: "", label: "", type: "text", values: [], placeholder: "" }
      ]);
    };

    const handleRemoveInput = (index: number) => {
      setInputs(inputs.filter((_, i) => i !== index));
    };

    const handleUpdate = () => {
      // Controllo che il nome non sia vuoto e non contenga caratteri speciali
      const regex = /^[a-zA-Z0-9\s]+$/;
      if (!name || !regex.test(name)) {
        alert("Il nome del tipo di device non può essere vuoto o contenere caratteri speciali.");
        return;
      }

      // Controllo che ci sia almeno un input
      if (inputs.length === 0) {
        alert("Devi aggiungere almeno un input per il tipo di device.");
        return;
      }

      // Controlli sugli input
      for (let input of inputs) {
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
         if (input.type === "select" && input.values.some(v => v.trim() === "")) {
           alert("I valori per il tipo di input 'select' non possono essere vuoti.");
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
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, inputs }),
          credentials: 'include',
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              alert("Errore durante l'aggiornamento del tipo di device.");
            } else {
              alert("Device type aggiornato con successo");
              window.location.href = '/device-types';
            }
          })
          .catch((error) => {
            console.error("Errore:", error);
            alert("Errore durante l'aggiornamento del tipo di device.");
          });
      }
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
                  <h3>Edit Device Type</h3>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    id="name_devicetypes"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <button
                    className="btn btn-light mt-3"
                    type="button"
                    onClick={handleAddInput}
                  >
                    Add Input
                  </button>

                  {inputs.map((input, index) => (
                    <div key={index} className="mt-4 border p-3">
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Input Name"
                        value={input.name}
                        onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                      />
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Input Label"
                        value={input.label}
                        onChange={(e) => handleInputChange(index, 'label', e.target.value)}
                      />
                      <select
                        className="form-control mb-2"
                        value={input.type}
                        onChange={(e) => handleInputChange(index, 'type', e.target.value)}
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="select">Select</option>
                      </select>

                      {(input.type === "text" || input.type === "number") && (
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Placeholder"
                          value={input.placeholder}
                          onChange={(e) => handleInputChange(index, 'placeholder', e.target.value)}
                        />
                      )}

                      {input.type === "select" && input.values.map((value, valueIndex) => (
                        <div key={valueIndex} className="input-group mb-2">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Value"
                            value={value}
                            onChange={(e) => handleValueChange(index, valueIndex, e.target.value)}
                          />
                          <div className="input-group-append">
                            <button
                              className="btn btn-danger"
                              type="button"
                              onClick={() => handleRemoveValue(index, valueIndex)}
                            >
                              Delete
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
                          Add Value
                        </button>
                      )}
                      <div>
                        <button
                          className="btn btn-danger mt-2"
                          type="button"
                          onClick={() => handleRemoveInput(index)}
                        >
                          Delete Input
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="col-12 mt-3">
                  <button
                    type="submit"
                    className="btn btn-success"
                    onClick={handleUpdate}
                  >
                    Save
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
