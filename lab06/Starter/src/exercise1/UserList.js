import UserCard from './UserCard';

function UserList({ users, viewMode }) {
  if (!users.length) {
    return <p>No users found.</p>;
  }

  return (
    <div
      // use viewMode to switch between the `user-grid` and `user-list` classes. 
      // When viewMode is "grid", the class should be "user-grid". 
      // When viewMode is "list", the class should be "user-list".
      className="user-grid"
    >
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

export default UserList;
