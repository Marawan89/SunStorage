import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faKey } from "@fortawesome/free-solid-svg-icons";
import "../globals.css";
import "./style.css";

export default function login() {
  return (
    <>
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
        <form>
          <div className="form-group">
            <FontAwesomeIcon className="user-icon" icon={faCircleUser} />
            <label>Username</label>
            <input type="email" className="form-control" />
          </div>
          <div className="form-group">
            <FontAwesomeIcon className="user-icon" icon={faKey} />
            <label>Password</label>
            <input type="password" className="form-control"/>
          </div>
          <div className="text-end">
            <button type="submit" className="btn btn-submit">
              Submit
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
