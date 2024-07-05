import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faKey } from "@fortawesome/free-solid-svg-icons";
import "../globals.css";
import "./style.css";

export default function MyApp() {
  return (
    <>
      <div className="logo">
        <h1>
          Sun<span>Storage</span>
        </h1>
      </div>
      <div className="login-container">
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
    </>
  );
}
