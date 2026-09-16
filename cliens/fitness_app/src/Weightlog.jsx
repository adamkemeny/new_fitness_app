import { useEffect, useState } from "react";
import axios from "./API/axios";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Weightlog() {
  const [userWeightHistory, setUserWeightHistory] = useState([]);
  const [formdata, setFormdata] = useState({
    weight: "",
  });
  const handleChange = (E) => {
    setFormdata({ ...formdata, [E.target.name]: E.target.value });
  };
  const handleSubmit = async (E) => {
    E.preventDefault();

    try {
      const res = await axios.post("/api/progress/weight", formdata);
      const formatted = res.data.weightHistory.map((entry) => ({
        date: new Date(entry.date),
        weight: entry.weight,
      }));
      setData(formatted);
      setUserWeightHistory(res.data.weightHistory);
    } catch (error) {
      console.error(error);
    }
  };

    const navigateToHome = useNavigate();
    const handleHomeRedirector = () =>{
      navigateToHome("/home");
    } 

  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get("/api/progress/weight").then((res) => {
      const formatted = res.data.weightHistory.map((entry) => ({
        date: new Date(entry.date),
        weight: entry.weight,
      }));
      setData(formatted);
    });
  }, []);
  return (
    <div style={{ width: 1000, height: 400 }}>
      <h3>Súly alakulása</h3>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            type="number"
            scale="time"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(date) => new Date(date).toLocaleDateString("hu-HU")}
          />
          <YAxis domain={["auto", "auto"]} unit=" kg" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#4CAF50"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <form onSubmit={handleSubmit}>
        <input
          name="weight"
          placeholder="Súly"
          onChange={handleChange}
          type="number"
          value={formdata.weight}
        />
        <button type="submit">Súly hozzáadása</button>
      </form>
      <button type="navigateToHome" onClick={handleHomeRedirector}>Vissza a főoldalra</button>
    </div>
  );
}
