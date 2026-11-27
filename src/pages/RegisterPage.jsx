import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { validateEmail, validatePassword, validateName } from '../utils/validators';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nameErr = validateName(formData.firstName, 'First Name');
    const emailErr = validateEmail(formData.email);
    const passErr = validatePassword(formData.password);
    let confirmErr = '';

    if (formData.password !== formData.confirmPassword) {
      confirmErr = 'Passwords do not match';
    }

    if (nameErr || emailErr || passErr || confirmErr) {
      setErrors({
        firstName: nameErr,
        email: emailErr,
        password: passErr,
        confirmPassword: confirmErr,
      });
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      await registerUser({
        firstName: formData.firstName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      setApiSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        'Registration failed. Please try again.';
      setApiError(typeof msg === 'string' ? msg : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="brand-title">
            <span className="brand-f">F</span>
            <span className="brand-u">u</span>
            <span className="brand-n">n</span>
            <span className="brand-d">d</span>
            <span className="brand-o">o</span>
            <span className="brand-o2">o</span>
            <span className="brand-sub"> Notes</span>
          </h1>
          <h2>Create your Account</h2>
          <p className="auth-subtext">to manage your personal Fundoo Notes</p>
        </div>

        {apiError && <div className="alert-banner alert-error">{apiError}</div>}
        {apiSuccess && <div className="alert-banner alert-success">{apiSuccess}</div>}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="e.g. Asher"
              className={errors.firstName ? 'input-error' : ''}
              disabled={loading}
            />
            {errors.firstName && (
              <span className="field-error">{errors.firstName}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@example.com"
              className={errors.email ? 'input-error' : ''}
              autoComplete="email"
              disabled={loading}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className={errors.password ? 'input-error' : ''}
                disabled={loading}
              />
              <button
                type="button"
                className="btn-toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={errors.confirmPassword ? 'input-error' : ''}
              disabled={loading}
            />
            {errors.confirmPassword && (
              <span className="field-error">{errors.confirmPassword}</span>
            )}
          </div>

          <div className="auth-actions">
            <Link to="/login" className="auth-link-secondary">
              Sign in instead
            </Link>
            <button
              type="submit"
              className="btn btn-primary btn-submit"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
