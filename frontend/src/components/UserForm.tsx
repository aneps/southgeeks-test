import React, { useState, useEffect } from 'react';
import { User } from '../types/User';

interface UserFormProps {
  user?: User | null;
  onSubmit: (userData: { name: string; zipCode: string }) => void;
  onCancel: () => void;
  loading: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    zipCode: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    zipCode: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        zipCode: user.zipCode
      });
    } else {
      setFormData({
        name: '',
        zipCode: ''
      });
    }
    setErrors({ name: '', zipCode: '' });
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors = { name: '', zipCode: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'Zip code is required';
      isValid = false;
    } else if (!/^\d{5}$/.test(formData.zipCode.trim())) {
      newErrors.zipCode = 'Zip code must be 5 digits';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit({
      name: formData.name.trim(),
      zipCode: formData.zipCode.trim()
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="user-form-overlay">
      <div className="user-form">
        <h2>{user ? 'Edit User' : 'Add New User'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? 'error' : ''}
              disabled={loading}
              placeholder="Enter user's full name"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="zipCode">Zip Code *</label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              className={errors.zipCode ? 'error' : ''}
              disabled={loading}
              placeholder="Enter 5-digit zip code"
              maxLength={5}
            />
            {errors.zipCode && <span className="error-text">{errors.zipCode}</span>}
          </div>

          {user && (
            <div className="current-location">
              <h3>Current Location Data:</h3>
              <p><strong>Latitude:</strong> {user.latitude.toFixed(4)}</p>
              <p><strong>Longitude:</strong> {user.longitude.toFixed(4)}</p>
              <p><strong>Timezone:</strong> {user.timezone}</p>
              <small>Location data will be updated if you change the zip code.</small>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : (user ? 'Update User' : 'Create User')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
