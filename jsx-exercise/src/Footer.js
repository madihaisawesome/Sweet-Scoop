import React from 'react';

export default function Footer() {
  const currentDate = new Date().toLocaleDateString();

  const groupMembers = ['Sharar', 'Madiha'];

  return (
    <footer className="footer">
      <p>
        {currentDate} — {groupMembers.join(', ')}
      </p>
    </footer>
  );
}