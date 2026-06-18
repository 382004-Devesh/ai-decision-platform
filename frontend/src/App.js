import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function App() {
  const [salary, setSalary] = useState("");
  const [experience, setExperience] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

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

    } catch (error) {
      alert("Error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Decision Logic
  const getDecision = () => {
    if (!result) return "";
    if (result.success_probability > 0.7) return "High Success 🚀";
    if (result.success_probability > 0.4) return "Moderate ⚖️";
    return "High Risk ⚠️";
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
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;