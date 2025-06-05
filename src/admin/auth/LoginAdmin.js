import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Swal from 'sweetalert2'; // Import SweetAlert2
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/login/fonts/icomoon/style.css";
import "../../assets/login/css/owl.carousel.min.css";
import "../../assets/login/css/bootstrap.min.css";
import "../../assets/login/css/style.css";
import logo from "../../assets/img/Logo_MRLC.png"

const LoginAdmin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const loadScript = (src, id) => {
      return new Promise((resolve, reject) => {
        if (document.getElementById(id)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.id = id;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    const loadScripts = async () => {
      const scripts = [
        { src: "/assets/login/js/jquery-3.3.1.min.js", id: "jquery-js" },
        { src: "/assets/login/js/popper.min.js", id: "popper-js" },
        { src: "/assets/login/js/bootstrap.min.js", id: "bootstrap-js" },
        { src: "/assets/login/js/main.js", id: "main-js" },
      ];

      try {
        for (const script of scripts) {
          await loadScript(process.env.PUBLIC_URL + script.src, script.id);
        }
      } catch (error) {
        console.error("Error loading scripts:", error);
      }
    };

    loadScripts();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Show loading alert using SweetAlert2
    Swal.fire({
      title: 'Logging in...',
      text: 'Please wait while we log you in.',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(); // Display loading spinner
      }
    });

    try {
      const success = await login(credentials.email, credentials.password);
      if (success) {
        if (user?.role_id === 3) {
          navigate("/admin/main-dashboard");
        } else if (user?.role_id === 4) {
          navigate("/admin/dashboard-lcm");
        } else if (user?.role_id === 6) {
          navigate("/admin/dashboard-ldcm");
        } else if (user?.role_id === 7) {
          navigate("/admin/dashboard-bcm");
        } else if (user?.role_id === 5) {
          navigate("/admin/payment-lcm");
        } else {
          navigate("/admin");
        }

        // Close the loading SweetAlert after successful login
        Swal.close();
      } else {
        setError("Login failed. Please check your username and password.");
        Swal.close(); // Close the SweetAlert if login fails
      }
    } catch (err) {
      setError("Login failed. Please try again later.");
      Swal.close(); // Close the SweetAlert if an error occurs
    }
  };

  return (
    <div className="content">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-6">
            <img src={logo} alt="Image" className="img-fluid" />
          </div>
          <div className="col-12 col-md-6 contents">
            <div className="row justify-content-center">
              <div className="col-10 col-md-8">
                <div className="mb-4">
                  <h3>Sign In</h3>
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="form-group first">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={credentials.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group last mb-4">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={credentials.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="d-flex mb-5 align-items-center">
                    <label className="control control--checkbox mb-0">
                      <span className="caption">Remember me</span>
                      <input type="checkbox" defaultChecked />
                      <div className="control__indicator"></div>
                    </label>
                    <span className="ml-auto">
                      <a href="#" className="forgot-pass">
                        Forgot Password
                      </a>
                    </span>
                  </div>
                  <input
                    type="submit"
                    value="Log In"
                    className="btn btn-block btn-primary"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
