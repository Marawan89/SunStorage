"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "../globals.css";
import "./style.css";
import apiendpoint from "../../../apiendpoint";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    const storedPath = sessionStorage.getItem("redirectAfterLogin");
    if (storedPath && storedPath !== "/login") {
      setRedirectPath(storedPath);
    }
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      await axios.post(
        `${apiendpoint}api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      alert("Login successo");

      // Fai redirect alla pagina precedentemente richiesta, se c'è
      if (redirectPath) {
        sessionStorage.removeItem("redirectAfterLogin");
        router.push(redirectPath);
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("Credenziali errate");
    }
  };

  return (
    <div className="container">
      <div className="col-12 d-flex justify-content-center align-items-center">
        <div className="col-12 col-md-6">
          <div className="logo text-center">
            <h1>
              Sun<span>Storage</span>
            </h1>
          </div>
          <div className="login-container p-4">
            <h2>Login</h2>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="text-end">
                <button type="submit" className="btn btn-dark m-2">
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
