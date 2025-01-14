import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, loginUser } from "../api/api";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await registerUser(username, password); // Register the user
      const { token } = await loginUser(username, password); // Login after registration
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Error registering user. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="signup-container p-4 p-md-5 rounded-3">
            {/* <!-- Header --> */}
            <div className="text-center mb-4">
              <h1 className="h3 mb-2">Sign Up</h1>
              <p className="">Create an account</p>
            </div>
            {/* <!-- Signup Form --> */}
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSignup}>
              {/* <!-- Username Field --> */}
              <div className="mb-3">
                <input
                  type="text"
                  id="username"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="Choose a username" />
              </div>
              {/* <!-- Password Field --> */}
              <div className="mb-4">
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Create a password"
                  autoComplete="new-password"
                />
              </div>
              {/* <!-- Submit Button --> */}
              <button type="submit" className="btn btn-primary w-100 py-2 mb-4">
                Sign Up
              </button>
              {/* <!-- Sign In Link --> */}
              <div className="text-center">
                Already have an account?
                {/* <a href="#" className="text-primary text-decoration-none ms-1">Sign in</a> */}
                <Link to="/login" className="text-primary text-decoration-none ms-1">Sign in</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;