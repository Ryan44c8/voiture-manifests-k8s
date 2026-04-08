"use client";

import React, { useEffect, useState } from "react";

interface UserInfo {
  username: string;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthorized(false);
      return;
    }

    // Vérification du token
    fetch("/api/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data: { valid: boolean }) => {
        if (data.valid) {
          setAuthorized(true);

          // Récupération des infos utilisateur
          fetch("/api/me", {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((res) => res.json())
            .then((info: UserInfo) => setUserInfo(info));
        } else {
          setAuthorized(false);
        }
      });
  }, []);

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    alert("Déconnexion réussie !");
    window.location.href = "/login";
  };

  if (!authorized) {
    return <h2>Accès refusé. Veuillez vous connecter.</h2>;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      {userInfo ? (
        <div>
          <p>
            Bienvenue, <strong>{userInfo.username}</strong> !
          </p>
          <p>
            Date de création du compte :{" "}
            {new Date(userInfo.created_at).toLocaleString()}
          </p>
        </div>
      ) : (
        <p>Chargement des informations...</p>
      )}
      <button onClick={handleLogout}>Se déconnecter</button>
    </div>
  );
};

export default Dashboard;
