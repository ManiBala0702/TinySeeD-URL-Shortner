// PATCH: src/App.jsx
// ─────────────────────────────────────────────────────────────────────────────
// 1. Add this import at the top of App.jsx (or index.jsx / main.jsx):
//
//    import "./styles/global.css";
//
// 2. Add the /create route inside your <Routes>:
//
//    import CreateUrl from "./pages/CreateUrl";
//
//    <Route path="/create" element={<PrivateRoute><CreateUrl /></PrivateRoute>} />
//
// ─── FULL App.jsx EXAMPLE (adapt to your existing structure) ──────────────────

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/global.css";

// Pages (import your existing ones + new CreateUrl)
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";    // your existing analytics page
import CreateUrl from "./pages/CreateUrl";

// Your existing auth guard component
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
        <Route path="/create"    element={<PrivateRoute><CreateUrl /></PrivateRoute>} />
        <Route path="/"          element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
