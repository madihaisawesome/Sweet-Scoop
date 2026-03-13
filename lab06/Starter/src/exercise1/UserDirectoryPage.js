import Controls from './Controls';
import sampleUsers from './sampleUsers';
import UserList from './UserList';

function UserDirectoryPage() {
  // TODO: add users, sortBy, and viewMode state in this component.
  // TODO: fetch the initial users with useEffect.

  function handleDeleteClick(userId) {
    console.log('TODO: delete the user with id', userId);
  }

  function handleSortByGroupClick() {
    console.log('TODO: sort users by user_group');
  }

  function handleSortByIdClick() {
    console.log('TODO: sort users by id');
  }

  function handleViewToggleClick() {
    console.log('TODO: switch between grid and list layouts');
  }

  return (
    <>
      <section className="panel">
        <h1>User Directory</h1>
      </section>

      <section className="panel">
        <h2>Controls</h2>
        <Controls />
      </section>

      <section className="panel">
        <h2>All Users</h2>
        <UserList users={sampleUsers} viewMode="grid" />
      </section>
    </>
  );
}

export default UserDirectoryPage;
