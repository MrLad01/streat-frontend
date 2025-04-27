// src/libs/api/auth.ts

import { API_BASE_URL } from "@/libs/constants";


interface LoginResponse {
  access_token: string;
  token_type: string;
}

export async function getAccessToken(username: string, password: string): Promise<LoginResponse> {
  const body = new URLSearchParams();
  body.append("username", username);
  body.append("password", password);

  const res = await fetch(`${API_BASE_URL}/login/access-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(), // form-encoded
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Login failed");
  }

  const data = await res.json();

  return { ...await loginUser(data.access_token), ...data }
}

export async function loginUser(token: string) {
  const res = await fetch(`${API_BASE_URL}/login/test-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Login failed");
  }

  return res.json();
}



export async function signup(email: string, password: string, username: string) {
  const res = await fetch(`${API_BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, username }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Signup failed");
  }

  return res.json();
}
