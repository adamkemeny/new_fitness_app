import { useState } from "react";
import axios from "./API/axios";
import { useNavigate } from "react-router-dom";
import "./All-pages.css";

export default function Login() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const handleChange = (E) => {
    setLoginData({
      ...loginData,
      [E.target.name]: E.target.value,
    });
  };
  const handleLogin = async (R) => {
    R.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", loginData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/home");
    } catch (error) {
      console.error(error);
      console.log(error.message);
      alert("Sikertelen bejelentkezés!");
    }
  };
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Bejelentkezés: </h2>
        <form onSubmit={handleLogin}>
          <input
            name="email"
            placeholder="Email"
            type="email"
            onChange={handleChange}
          />

          <br />
          <br />

          <input
            name="password"
            placeholder="Jelszó"
            type="password"
            onChange={handleChange}
          />

          <br />
          <br />

          <button type="submit">Bejelentkezés</button>
        </form>
        <div>
          <h4>
            Nincs még fiókod? <a href="/register">Regisztrálj!</a>{" "}
          </h4>
        </div>
      </div>
    </div>
  );
}
