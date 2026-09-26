import { useState } from "react";
import axios from "./API/axios";
import { useNavigate } from "react-router-dom";
import "./All-pages.css";

export default function Register() {
  const [formData, setformData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (E) => {
    setformData({
      ...formData,
      [E.target.name]: E.target.value,
    });
  };

  const handleRegister = async (R) => {
    R.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/auth/register", formData);
      alert("Sikeres regisztráció! \n Jelentkezz be!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Sikertelen regisztráció!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Regisztráció:</h2>

        <form onSubmit={handleRegister}>
          <input
            name="name"
            placeholder="Név"
            value={formData.name}
            onChange={handleChange}
          />

          <br />
          <br />

          <input
            name="email"
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />

          <br />
          <br />

          <input
            name="password"
            placeholder="Jelszó"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />

          <br />
          <br />

          <button type="submit" disabled={loading}>
            {loading ? "Betöltés..." : "Regisztráció"}
          </button>
        </form>
        <div>
          <h4>
            Már van fiókod? <a href="/login">Jelentkezz be!</a>
          </h4>
        </div>
      </div>
    </div>
  );
}
