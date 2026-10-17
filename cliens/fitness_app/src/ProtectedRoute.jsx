import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "./API/axios";

const ProtectedRoute = ({ children }) => {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    const checkAuth = async () => {
      try {
        await axios.get("/api/auth/me");

        if (active) {
          setStatus("authenticated");
        }
      } catch (error) {
        if (active) {
          setStatus("unauthenticated");
        }
      }
    };

    checkAuth();

    return () => {
      active = false;
    };
  }, []);

  if (status === "loading") {
    return <p>Betöltés...</p>;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;