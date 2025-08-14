import React, { useState, useEffect } from 'react';
import './App.css';
import { User } from './types/User';
import { userApi } from './services/userApi';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import SearchForm from './components/SearchForm';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const fetchedUsers = await userApi.getAllUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (userData: { name: string; zipCode: string }) => {
    try {
      setLoading(true);
      setError('');
      const newUser = await userApi.createUser(userData);
      setUsers([...users, newUser]);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (id: number, userData: { name?: string; zipCode?: string }) => {
    try {
      setLoading(true);
      setError('');
      const updatedUser = await userApi.updateUser(id, userData);
      setUsers(users.map(user => user.id === id ? updatedUser : user));
      setEditingUser(null);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      await userApi.deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (zipCode: string) => {
    if (!zipCode.trim()) {
      loadUsers();
      return;
    }

    try {
      setLoading(true);
      setError('');
      const searchResults = await userApi.searchUsersByZip(zipCode);
      setUsers(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setShowForm(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>User Management System</h1>
        <p>Manage users with location-based features</p>
      </header>

      <main className="App-main">
        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="controls">
          <button 
            onClick={() => setShowForm(true)} 
            className="btn btn-primary"
            disabled={loading}
          >
            Add New User
          </button>
          
          <button 
            onClick={loadUsers} 
            className="btn btn-secondary"
            disabled={loading}
          >
            Refresh Users
          </button>
        </div>

        <SearchForm onSearch={handleSearch} loading={loading} />

        {showForm && (
          <UserForm
            user={editingUser}
            onSubmit={editingUser ? 
              (userData) => handleUpdateUser(editingUser.id, userData) : 
              handleCreateUser
            }
            onCancel={handleCancelEdit}
            loading={loading}
          />
        )}

        <UserList
          users={users}
          onEdit={handleEdit}
          onDelete={handleDeleteUser}
          loading={loading}
        />
      </main>
    </div>
  );
}

export default App;
