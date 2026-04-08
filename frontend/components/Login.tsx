"use client";

import React, { useState } from "react";

interface LoginResponse {
  token?: string;
  error?: string;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data: LoginResponse = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      alert("Connexion réussie !");
      window.location.href = "/dashboard"; // redirection vers le dashboard
    } else {
      alert(data.error || "Erreur de connexion");
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;
