import React from "react";
import Register from "@/components/Register";
import Login from "@/components/Login";
import Dashboard from "@/components/Dashboard";

const Home: React.FC = () => {
  return (
    <div><h1>Welcome to the Home Page</h1>
      <Register />
      <Login />
      <Dashboard />
    </div>
  );
};

export default Home;
