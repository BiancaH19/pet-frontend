const API_BASE = 'https://pet-backend2.onrender.com';

export async function fetchPets({ page = 1, limit = 20, sort, name } = {}) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');

  let url = `${API_BASE}/pets`;
  const params = new URLSearchParams({ page, limit });

  if (!token) {
    params.append('status', 'Available');
  } else if (role === 'Regular' && userId) {
    params.append('userId', userId);
  }

  if (sort) params.append('sort', sort);
  if (name) params.append('name', name);

  const query = params.toString();
  if (query) {
    url += `?${query}`;
  }

  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) throw new Error('Failed to fetch pets');
  return await res.json();
}

export async function deletePet(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/pets/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error('Failed to delete pet');
}

export async function updatePet(id, data) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/pets/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error('Failed to update pet');
  return await res.json();
}

export async function addPet(data) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/pets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error('Failed to add pet');
  return await res.json();
}
