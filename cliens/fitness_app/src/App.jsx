import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import ProtectedRoute from "./ProtectedRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Weightlog from "./Weightlog";
import Feedback from "./Feedback";
import Redirect from "./Redirector";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Redirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/progress/weight" element={<Weightlog />} />
        <Route path="/plan/feedback" element={<Feedback />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
