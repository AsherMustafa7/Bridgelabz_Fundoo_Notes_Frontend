import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { validateEmail, validatePassword } from '../utils/validators';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
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
    const emailErr = validateEmail(formData.email);
    const passErr = validatePassword(formData.password);

    if (emailErr || passErr) {
      setErrors({
        email: emailErr,
        password: passErr,
      });
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });
      navigate('/dashboard');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        'Failed to log in. Please check your credentials.';
      setApiError(typeof msg === 'string' ? msg : 'Authentication failed.');
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
          <h2>Sign in</h2>
          <p className="auth-subtext">to continue to Fundoo Notes</p>
        </div>

        {apiError && <div className="alert-banner alert-error">{apiError}</div>}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
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
                placeholder="Enter your password"
                className={errors.password ? 'input-error' : ''}
                autoComplete="current-password"
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

          <div className="auth-links-row">
            <Link to="/forgot-password" className="auth-link">
              Forgot password?
            </Link>
          </div>

          <div className="auth-actions">
            <Link to="/register" className="auth-link-secondary">
              Create account
            </Link>
            <button
              type="submit"
              className="btn btn-primary btn-submit"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
