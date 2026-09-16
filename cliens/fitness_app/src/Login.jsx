import { useState } from "react";
import axios from "./API/axios";
import { useNavigate } from "react-router-dom";

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
      const res = await axios.post(
        "/api/auth/login",
        loginData,
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user",JSON.stringify(res.data.user));
      navigate("/home");
    } catch (error) {
      console.error(error);
      console.log(error.message);
      alert("Sikertelen bejelentkezés!");
    }
  };
  return (
    <div style={{padding: "20px"}}>
      <h2>Login: </h2>
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
          placeholder="Password"
          type="password"
          onChange={handleChange}
        />

        <br />
        <br />

        <button type="submit">Login</button>
      </form>
      <div>
        <h4>
          You don&apos;t have an account yet?{" "}
          <a href="/register">Register</a>{" "}
        </h4>
      </div>
    </div>
  );

}
