// src/exercise1/UserDirectoryPage.js
import { useEffect, useState } from 'react';
import Controls from './Controls';
import UserList from './UserList';

function UserDirectoryPage() {
  const [users, setUsers] = useState([]);
  const [sortBy, setSortBy] = useState('id'); // "id" or "group"
  const [viewMode, setViewMode] = useState('grid'); // "grid" or "list"

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/users_api/users');
        if (!res.ok) throw new Error(`Failed to fetch users (${res.status})`);
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setUsers([]);
      }
    }

    fetchUsers();
  }, []);

  async function handleDeleteClick(userId) {
    const id = Number(userId);

    if (!Number.isFinite(id)) return;

    try {
      const res = await fetch(`/users_api/users/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error(`Failed to delete user (${res.status})`);

      // update state after successful delete
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  function handleSortByGroupClick() {
    setSortBy('group');
    setUsers((prev) => {
      const sorted = [...prev].sort((a, b) => {
        const ag = (a.user_group ?? '').toString();
        const bg = (b.user_group ?? '').toString();
        const cmp = ag.localeCompare(bg);
        if (cmp !== 0) return cmp;
        return (a.id ?? 0) - (b.id ?? 0);
      });
      return sorted;
    });
  }

  function handleSortByIdClick() {
    setSortBy('id');
    setUsers((prev) => {
      const sorted = [...prev].sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
      return sorted;
    });
  }

  function handleViewToggleClick() {
    setViewMode((prev) => (prev === 'grid' ? 'list' : 'grid'));
  }

  return (
    <>
      <section className="panel">
        <h1>User Directory</h1>
      </section>

      <section className="panel">
        <h2>Controls</h2>
        <Controls
          onDeleteClick={handleDeleteClick}
          onSortByGroupClick={handleSortByGroupClick}
          onSortByIdClick={handleSortByIdClick}
          onViewToggleClick={handleViewToggleClick}
        />
        {/* optional: show current state */}
        <p style={{ marginTop: '0.75rem' }}>
          Sort: <strong>{sortBy}</strong> · View: <strong>{viewMode}</strong>
        </p>
      </section>

      <section className="panel">
        <h2>All Users</h2>
        <UserList users={users} viewMode={viewMode} />
      </section>
    </>
  );
}

export default UserDirectoryPage;