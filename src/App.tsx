import React from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const App = () => {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      
      <div className="card">
        <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>🌟 SwiftPay</h1>
        <p style={{ marginBottom: "30px" }}>
          Fast and secure dues payment system.
        </p>

        <Link to="/pay">
          <button className="btn">Pay Dues</button>
        </Link>

        <br /><br />

        <Link to="/login">
          <button className="btn">Login</button>
        </Link>
      </div>
    </div>
  );
};

export default App;
