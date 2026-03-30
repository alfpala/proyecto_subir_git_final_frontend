import React from "react";
import { Navigate } from "react-router-dom";
import { isAdmin } from "../context/adminAuth";

export default function RequireAdmin({ children }) {
  if (!isAdmin()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
