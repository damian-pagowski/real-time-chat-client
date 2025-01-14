import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { token } = await loginUser(username, password);
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Invalid credentials. Please try again.");
    }
  };
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="signup-container p-4 p-md-5 rounded-3">
            {/* <!-- Header --> */}
            <div className="text-center mb-4">
              <h1 className="h3 mb-2">Sign In</h1>
              <p className="">Welcome Back</p>
            </div>
            {/* <!-- Signup Form --> */}
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleLogin}>
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
                  placeholder="Enter your username" />
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
                  placeholder="Enter your password"
                  autoComplete="new-password"
                />
          
              </div>

          

              {/* <!-- Submit Button --> */}
              <button type="submit" className="btn btn-primary w-100 py-2 mb-4">
                Log In
              </button>

              {/* <!-- Sign In Link --> */}
              <div className="text-center">
                Need an account?
                {/* <a href="#" className="text-primary text-decoration-none ms-1">Sign in</a> */}
                <Link to="/signup" className="text-primary text-decoration-none ms-1">Sign up</Link>

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;