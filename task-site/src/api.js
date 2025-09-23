const API_URL = "http://localhost:5000/api";

// -----AUTH------
// Register
export async function register(username, name, password) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, name, password }),
  });
  return res.json();
}

// Login
export async function login(username, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();

  // Store token in localStorage
  if (data.token) localStorage.setItem("token", data.token);

  return data;
}

// -----TASKS------
// New Task
export async function newTask(userId, title, status, group, steps, dueDate) {
  const res = await fetch(`${API_URL}/tasks/newTask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, title, status, group, steps, dueDate })
  });
  const data = await res.json();

  return data;
}





// Get protected data
export async function getProtected() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/protected`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
