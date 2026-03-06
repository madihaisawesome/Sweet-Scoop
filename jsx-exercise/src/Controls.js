import React from 'react';

function Delete() {
  return (
    <div className="delete-controls">
      <input type="text" placeholder="Enter ID to delete" />
      <button type="button">Delete</button>
    </div>
  );
}

function Controls() {
  return (
    <div className="controls">
      <Delete />
      <div className="buttons">
        <button type="button">Sort by Group</button>
        <button type="button">Sort by ID</button>
        <button type="button">Grid / List</button>
      </div>
    </div>
  );
}

export default Controls;