// src/exercise1/UserList.js

import UserCard from './UserCard';

function UserList({ users, viewMode }) {
  if (!users.length) {
    return <p>No users found.</p>;
  }

  const containerClass = viewMode === 'list' ? 'user-list' : 'user-grid';

  return (
    <div className={containerClass}>
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

export default UserList;