import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function App() {
  const [salary, setSalary] = useState("");
  const [experience, setExperience] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  // Load history from browser
useEffect(() => {
  const savedHistory = localStorage.getItem("predictionHistory");

  if (savedHistory) {
    setHistory(JSON.parse(savedHistory));
  }
}, []);

  const handleSubmit = async () => {
    // ✅ validation
    if (!salary || !experience) {
      alert("Please enter all fields");
      return;
    }

    if (salary <= 0 || experience < 0) {
      alert("Enter valid values");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          salary: Number(salary),
          experience: Number(experience)
        })
      });

      const data = await response.json();
      setResult(data);
      
const updatedHistory = [
  {
    salary,
    experience,
    success: (data.success_probability * 100).toFixed(2),
    risk: (data.risk_score * 100).toFixed(2),
  },
  ...history,
];

setHistory(updatedHistory);

localStorage.setItem(
  "predictionHistory",
  JSON.stringify(updatedHistory)
);

    } catch (error) {
      alert("Error connecting to backend");
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
  const savedHistory = localStorage.getItem("predictionHistory");

  if (savedHistory) {
    setHistory(JSON.parse(savedHistory));
}
}, []);
  // 🔥 Decision Logic
  const getDecision = () => {
    if (!result) return "";
    if (result.success_probability > 0.7) return "High Success 🚀";
    if (result.success_probability > 0.4) return "Moderate ⚖️";
    return "High Risk ⚠️";
  };
  const getConfidence = () => {
  if (!result) return "";

  const confidence = (
    Math.max(
      result.success_probability,
      result.risk_score
    ) * 100
  ).toFixed(2);

  return confidence + "%";
};

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#f4f6f8"
    }}>
      <div style={{
        background: "white",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        textAlign: "center",
        width: "350px"
      }}>
        <h2>🚀 AI Decision Platform</h2>

        {/* INPUTS */}
        <input
          type="number"
          placeholder="Salary"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          style={{
            padding: "10px",
            margin: "10px 0",
            width: "100%",
            borderRadius: "5px",
            border: "1px solid #ccc"
          }}
        />

        <input
          type="number"
          placeholder="Experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          style={{
            padding: "10px",
            margin: "10px 0",
            width: "100%",
            borderRadius: "5px",
            border: "1px solid #ccc"
          }}
        />

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          style={{
            padding: "12px",
            width: "100%",
            background: loading ? "#999" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            marginTop: "10px"
          }}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>

        {/* RESULT */}
        {result && (
          <div style={{
            marginTop: "20px",
            padding: "15px",
            borderRadius: "8px",
            background: "#eaf4ff"
          }}>
            <h3>📊 Result</h3>

            <p>
              ✅ <b>Success:</b>{" "}
              {(result.success_probability * 100).toFixed(2)}%
            </p>

            <p>
              ⚠ <b>Risk:</b>{" "}
              {(result.risk_score * 100).toFixed(2)}%
            </p>

            {/* 🔥 Decision */}
            <p>
              💡 <b>Decision:</b> {getDecision()}
            </p>
            <p>
  🎯 <b>Model Confidence:</b> {getConfidence()}
</p>

            {/* 🔥 GRAPH */}
            <div style={{ marginTop: "20px" }}>
              <Bar
                data={{
                  labels: ["Success", "Risk"],
                  datasets: [
                    {
                      label: "Prediction (%)",
                      data: [
                        result.success_probability * 100,
                        result.risk_score * 100
                      ],
                      backgroundColor: ["#28a745", "#dc3545"],
                      borderRadius: 10,
                      barThickness: 40
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return context.raw.toFixed(2) + "%";
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100
                    }
                  }
                }}
              />
              {/* Prediction History */}
<div style={{ marginTop: "25px" }}>
  <h3>📜 Prediction History</h3>

  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "10px",
      fontSize: "14px"
    }}
  >
    <thead>
      <tr style={{ background: "#007bff", color: "white" }}>
        <th style={{ padding: "8px" }}>Salary</th>
        <th style={{ padding: "8px" }}>Exp</th>
        <th style={{ padding: "8px" }}>Success</th>
      </tr>
    </thead>

    <tbody>
      {history.map((item, index) => (
        <tr key={index}>
          <td style={{ padding: "8px", border: "1px solid #ddd" }}>
            {item.salary}
          </td>

          <td style={{ padding: "8px", border: "1px solid #ddd" }}>
            {item.experience}
          </td>

          <td style={{ padding: "8px", border: "1px solid #ddd" }}>
            {item.success}%
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
            </div>

          </div>
        )}
        {history.length > 0 && (
  <div
    style={{
      marginTop: "20px",
      background: "#ffffff",
      padding: "15px",
      borderRadius: "10px",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    }}
  >
    <h3>📜 Prediction History</h3>
    <button
  onClick={() => setHistory([])}
  style={{
    marginBottom: "15px",
    padding: "8px 15px",
    background: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }}
>
  🗑 Clear History
</button>

    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
      }}
    >
      <thead>
        <tr>
          <th>Salary</th>
          <th>Exp</th>
          <th>Success</th>
          <th>Risk</th>
        </tr>
      </thead>

      <tbody>
        {history.map((item, index) => (
          <tr key={index}>
            <td>{item.salary}</td>
            <td>{item.experience}</td>
            <td style={{ color: "green" }}>
              {item.success}%
            </td>
            <td style={{ color: "red" }}>
              {item.risk}%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
      </div>
    </div>
  );
}

export default App;