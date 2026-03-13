// src/exercise1/UserDirectoryPage.js

import { useEffect, useState } from 'react';
import Controls from './Controls';
import UserList from './UserList';

function UserDirectoryPage() {
  const [users, setUsers] = useState([]);
  const [sortBy, setSortBy] = useState('id');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('https://69a1dad52e82ee536fa260fc.mockapi.io/users_api');
        if (!res.ok) {
          throw new Error(`Failed to fetch users (${res.status})`);
        }

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
      const res = await fetch(
        `https://69a1dad52e82ee536fa260fc.mockapi.io/users_api/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to delete user (${res.status})`);
      }

      setUsers((prev) => prev.filter((u) => Number(u.id) !== id));
    } catch (err) {
      console.error(err);
    }
  }

  function handleSortByGroupClick() {
    setSortBy('group');
    setUsers((prev) => {
      const sorted = [...prev].sort((a, b) => {
        const groupCompare = String(a.user_group).localeCompare(String(b.user_group));
        if (groupCompare !== 0) return groupCompare;
        return Number(a.id) - Number(b.id);
      });
      return sorted;
    });
  }

  function handleSortByIdClick() {
    setSortBy('id');
    setUsers((prev) => {
      const sorted = [...prev].sort((a, b) => Number(a.id) - Number(b.id));
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
      </section>

      <section className="panel">
        <h2>All Users</h2>
        <UserList users={users} viewMode={viewMode} />
      </section>
    </>
  );
}

export default UserDirectoryPage;