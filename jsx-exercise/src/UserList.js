import React from 'react';
import users from './users';

export default function UserList() {
  return (
    <div className="user-list">
      {users.map((user) => (
        <article key={user.id} className="user-card">
          <h3>{user.first_name}</h3>
          <p>User Group: {user.user_group}</p>
          <p>ID: {user.id}</p>
        </article>
      ))}
    </div>
  );
}