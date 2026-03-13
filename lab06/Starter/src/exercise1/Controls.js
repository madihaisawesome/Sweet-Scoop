// src/exercise1/Controls.js
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
          onChange={(e) => setDeleteId(e.target.value)}
        />
        <button
          className="btn btn-danger"
          onClick={() => onDeleteClick(deleteId)}
        >
          Delete
        </button>
      </div>

      <div className="other-controls">
        <button className="btn" onClick={onSortByGroupClick}>
          Sort by Group
        </button>
        <button className="btn" onClick={onSortByIdClick}>
          Sort by ID
        </button>
        <button className="btn" onClick={onViewToggleClick}>
          Grid / List View
        </button>
      </div>
    </div>
  );
}

export default Controls;