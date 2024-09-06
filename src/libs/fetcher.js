const api = import.meta.env.VITE_API;

export async function postUser(data) {
  const res = await fetch(`${api}/users`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.ok) {
    return res.json();
  }
  throw new Error("Error: Check Network Log");
}

export async function postLogin(username, password) {
  const res = await fetch(`${api}/login`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.ok) {
    return res.json();
  }
  throw new Error("Incorrect username or password");
}

export async function fetchUser(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${api}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

export async function fetchVerify() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${api}/verify`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.ok) {
    return res.json();
  }
  return false;
}
export async function postPost(content) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${api}/content/posts`, {
    method: "POST",
    body: JSON.stringify({ content }),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (res.ok) {
    return res.json();
  }
  throw new Error("Error: Check Network Log");
}

export async function postComment(content, postId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${api}/content/comments`, {
    method: "POST",
    body: JSON.stringify({ content, postId }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.ok) {
    return res.json();
  }
  throw new Error("Error: Check Network Log");
}

export async function postDelete(postId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${api}/content/posts/${postId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error: ${errorText}`);
  }

  return res.status;
}
