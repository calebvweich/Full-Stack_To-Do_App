import { toast } from "./Components/Toast/Toast";

const API_URL = process.env.REACT_APP_API_URL;


async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    localStorage.setItem("toastMessage", "Error: Login Timeout")
    localStorage.removeItem("token")
    window.location.href = "/login";
    return;
  }
  if (!res.ok) {
    const message = await res.text();
    toast.error(`Error: ${message}`);
    throw new Error(message);
  }

  return res;
}

// -----AUTH------
// Register
export async function register(username, name, password) {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, name, password }),
    });
    if (!res.ok) {
      const message = await res.json();
      toast.error(`Error: ${message.msg}`);
    } else {
      return res.json();
    }
  } catch (err) {
    toast.error(`Error: ${err}`)
    console.log(err)
  }
}

// Login
export async function login(username, password) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const message = await res.json();
      toast.error(`Error: ${message.msg}`);
    } else {
      return res.json();
    }
  } catch (err) {
    const message = await err.text();
    toast.error(`Error: ${message}`)
    console.log(err)
  }
}

// -----TASKS------
// New Task
export async function newTask(name, groupId, projectId, steps, dueDate) {
  try {
    steps.forEach((step, index) => {
      step.order = index
    });
    const res = await apiFetch(`${API_URL}/tasks/newTask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ name, groupId, projectId, steps, dueDate })
    });
    const data = await res.json();

    return data;
  } catch (err) {
    console.log(err)
  }
}

// New Group
export async function newGroup(name, projectId) {
  try {
    const res = await apiFetch(`${API_URL}/tasks/newGroup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ name, projectId })
    });
    const data = await res.json();

    return data;
  } catch (err) {
    console.log(err)
  }
}

// New Project
export async function newProject(name) {
  try {
    const res = await apiFetch(`${API_URL}/tasks/projects/new/${name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
    })
    const data = await res.json()
    return data
  } catch (err) {
    console.log(err)
  }
}

// Get Tasks
export async function getTasks() {
  try {
    const res = await apiFetch (`${API_URL}/tasks/getTasks`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });
    if (res.ok) {
      const tasks = await res.json();
      return tasks
    }
  } catch (err) {
    console.log(err)
  }
}

// Get Groups
export async function getGroups() {
  try {
    const res = await apiFetch (`${API_URL}/tasks/getGroups`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });
    if (res.ok) {
      const groups = await res.json();
      return groups
    }
  } catch (err) {
    console.log(err)
  }
}

// Get Projects
export async function getProjects() {
  try {
    const res = await apiFetch (`${API_URL}/tasks/projects/get`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });
    if (res.ok) {
      const projects = await res.json();
      return projects;
    }
  } catch (err) {
    console.log(err)
  }
}

// Delete Task
export async function deleteTask(id) {
  try {
    const res = await apiFetch (`${API_URL}/tasks/task/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
  } catch (err) {
    console.log(err)
  }
}

// Delete Group
export async function deleteGroup(id) {
  try {
    const res = await apiFetch (`${API_URL}/tasks/group/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
  } catch (err) {
    console.log(err)
  }
}

// Delete Project
export async function deleteProject(id) {
  try {
    const res = await apiFetch (`${API_URL}/tasks/project/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
    })
  } catch (err) {
    console.log(err)
  }
}

// Delete Step
export async function deleteStep(task, step) {
  try {
    const res = await apiFetch (`${API_URL}/tasks/${task}/deleteStep/${step}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
  } catch (err) {
    console.log(err)
  }
}

// Reorder Tasks
export async function reorderTasks(groupId, taskId) {
  try {
    const res = await apiFetch (`${API_URL}/tasks/${groupId}/reorder/${taskId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
    if (res.ok) {
      const newTask = await res.json()
      return newTask;
    }
  } catch (err) {
    console.log(err)
  }
}

// Reorder Steps
export async function reorderSteps(tasks, stepId) {
  try {
    const res = await apiFetch (`${API_URL}/tasks/steps/reorder`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tasks: tasks, stepId: stepId })
    })
    if (res.ok) {
      const newSteps = await res.json()
      return newSteps
    }
  } catch (err) {
    console.log(err)
  }
}

// Toggle Step Completion
export async function toggleStepCompletion(task, step) {
  try {
    const res = await apiFetch (`${API_URL}/tasks/${task}/steps/${step}`, {
      method: "PATCH"
    })
  } catch (err) {
    console.log(err)
  }
}

// Change task Status
export async function setTaskStatus(taskId, newStatus) {
  try {
    const res = await apiFetch (`${API_URL}/tasks/${taskId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ newStatus: newStatus})
    })
  } catch (err) {
    console.log(err)
  }
}

// New Step
export async function addStepToTask(task, step) {
  try {
    const res = await apiFetch (`${API_URL}/tasks/${task}/newStep`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ name: step })
    })
    if (res.ok) {
      const newStep = await res.json()
      return newStep;
    } else {
      console.log(res)
    }
  } catch (err) {
    console.log(err)
  }
}

// Get protected data
export async function getProtected() {
  try {
    const token = localStorage.getItem("token");
    const res = await apiFetch(`${API_URL}/protected`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  } catch (err) {
    console.log(err)
  }
}
