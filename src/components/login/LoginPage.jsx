import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Signin } from "../../commonServices";

export default function SignInPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("username");
    if (token) navigate("/imageUploader");
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const temp = await Signin({ username, password });
    if (temp.status === 200) {
			if (temp.error) setError(true);
			else {
				navigate("/ImageUploader");

				localStorage.setItem("username", temp.username);
			}
    } else {
      setError(true);
    }
  };
  return (
    <div className="flex">
      <div className="text-center m-5-auto">
        <h2>Sign in to continue</h2>
        <form className="form" action="/home">
          <p>
            <label>Username</label>
            <br />
            <input
              type="text"
              name="username"
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </p>
          <p>
            <label>Password</label>
            <br />
            <input
              type="password"
              name="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </p>
          <p>
            <button className="sub_btn" type="submit" onClick={handleSubmit}>
              Login
            </button>
          </p>
        </form>
        <footer>
          <p>
            {error && <p style={{ color: "red" }}>Invalid Email or Password</p>}
            First time? <Link to="/Signup">Create an account</Link>.
          </p>
        </footer>
      </div>
    </div>
  );
}
