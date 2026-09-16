import { useState } from "react";
import axios from "./API/axios";
import { useNavigate } from "react-router-dom";

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
       await axios.post(
        "/api/auth/register",
        formData,
      );
      alert("Sikeres regisztráció! \n Jelentkezz be!")
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Sikertelen regisztráció!");
    }
    finally{
        setLoading(false);
    }
  };
  return(
    <div style={{ padding: "20px" }}>
      <h2>Register</h2>

      <form onSubmit={handleRegister}>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />

        <br /><br />

        <input
          name="email"
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />

        <br /><br />

        <input
          name="password"
          placeholder="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Register"}
        </button>
      </form>
      <div>
        <h4>
          Already have an account? <a href="/login">Log in</a>
        </h4>
      </div>
    </div>
  );
}
