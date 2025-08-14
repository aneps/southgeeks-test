import React from 'react';
import { User } from '../types/User';

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

const UserList: React.FC<UserListProps> = ({ users, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="loading">
        <p>Loading users...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="no-users">
        <p>No users found. Add a new user to get started!</p>
      </div>
    );
  }

  return (
    <div className="user-list">
      <h2>Users ({users.length})</h2>
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Zip Code</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Timezone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.zipCode}</td>
                <td>{user.latitude.toFixed(4)}</td>
                <td>{user.longitude.toFixed(4)}</td>
                <td>{user.timezone}</td>
                <td className="actions">
                  <button
                    onClick={() => onEdit(user)}
                    className="btn btn-edit"
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(user.id)}
                    className="btn btn-delete"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
