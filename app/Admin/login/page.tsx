"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      router.push("/Admin");
    } catch {
      setError("E-mail ou senha inválidos. Tente novamente.");
    }
  };

  return (
    <main style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <div style={{ background: "#fff", padding: "2rem", borderRadius: "8px", boxShadow: "0 2px 16px rgba(0,0,0,0.1)", minWidth: "320px" }}>
        <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>Acesso ADM</h2>
        <form onSubmit={submit}>
          <div style={{ marginBottom: "1rem" }}>
            <label>E-mail</label><br />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Senha</label><br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>
          {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
          <button
            type="submit"
            style={{ width: "100%", padding: "0.75rem", background: "#7c3aed", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}