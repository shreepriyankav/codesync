import React from "react";

export default function UserList({ users, currentUser }) {
  return (
    <div className="user-list">
      <div className="user-list-header">👥 Users ({users.length})</div>
      <div className="user-list-body">
        {users.map((user, i) => (
          <div key={i} className="user-item">
            <span className="user-avatar">{user[0].toUpperCase()}</span>
            <span className="user-name">
              {user} {user === currentUser && "(You)"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
