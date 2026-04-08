import React from "react";
import Register from "@/components/Register";
import Login from "@/components/Login";
import Dashboard from "@/components/Dashboard";

const Home: React.FC = () => {
  return (
    <div>
      <Register />
      <Login />
      <Dashboard />
    </div>
  );
};

export default Home;
