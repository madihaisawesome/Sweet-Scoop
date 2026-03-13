import { useState } from 'react';

function Controls({
  onDeleteClick,
  onSortByGroupClick,
  onSortByIdClick,
  onViewToggleClick,
}) {
  const [deleteId, setDeleteId] = useState('');

  return (
    <div className="controls-row">
      <div className="delete-controls">
        <label htmlFor="delete-id-input">Delete by ID</label>
        <input
          id="delete-id-input"
          type="number"
          value={deleteId}
          // add an onChange handler that updates deleteId with setDeleteId
        />
        <button
          className="btn btn-danger"
          // add an onClick handler that calls onDeleteClick(deleteId)
        >
          Delete
        </button>
      </div>

      <div className="other-controls">
        <button
          className="btn"
          // add an onClick handler that calls onSortByGroupClick
        >
          Sort by Group
        </button>
        <button
          className="btn"
          // add an onClick handler that calls onSortByIdClick
        >
          Sort by ID
        </button>
        <button
          className="btn"
          // add an onClick handler that calls onViewToggleClick
        >
          Grid / List View
        </button>
      </div>
    </div>
  );
}

export default Controls;
