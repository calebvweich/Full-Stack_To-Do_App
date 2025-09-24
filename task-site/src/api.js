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
export async function newTask(title, group, steps, dueDate) {
  steps.forEach((step, index) => {
    step.order = index
  });
  const res = await fetch(`${API_URL}/tasks/newTask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ title, group, steps, dueDate })
  });
  const data = await res.json();

  return data;
}

// New Group
export async function newGroup(name) {
  const res = await fetch(`${API_URL}/tasks/newGroup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ name })
  });
  const data = await res.json();

  return data;
}

// Get Tasks
export async function getTasks() {
  const res = await fetch (`${API_URL}/tasks/getTasks`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  });
  if (res.ok) {
    const tasks = await res.json();
    return tasks
  }
}

// Get Groups
export async function getGroups() {
  const res = await fetch (`${API_URL}/tasks/getGroups`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  });
  if (res.ok) {
    const groups = await res.json();
    return groups
  }
}

// Delete Task
export async function deleteTask(id) {
  const res = await fetch (`${API_URL}/tasks/task/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  })
}

// Delete Group
export async function deleteGroup(id) {
  const res = await fetch (`${API_URL}/tasks/group/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  })
}

// Get protected data
export async function getProtected() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/protected`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
