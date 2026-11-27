import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { generateOtp, verifyOtp } from '../services/redisService';
import { validateEmail } from '../utils/validators';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = enter email, 2 = enter otp
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    if (emailErr) {
      setError(emailErr);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await generateOtp(email.trim());
      setSuccess(`An OTP has been sent to ${email.trim()}. Please check your inbox.`);
      setStep(2);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        'Failed to generate OTP';
      setError(typeof msg === 'string' ? msg : 'Error generating OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Please enter the OTP received in your email');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await verifyOtp(email.trim(), otp.trim());
      setSuccess('OTP verified successfully! You can now sign in.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        'Invalid or expired OTP';
      setError(typeof msg === 'string' ? msg : 'Invalid OTP. Try again.');
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
          <h2>{step === 1 ? 'Find your email' : 'Verify OTP'}</h2>
          <p className="auth-subtext">
            {step === 1
              ? 'Enter your registered email to receive an OTP'
              : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

        {error && <div className="alert-banner alert-error">{error}</div>}
        {success && <div className="alert-banner alert-success">{success}</div>}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="user@example.com"
                disabled={loading}
                autoFocus
              />
            </div>

            <div className="auth-actions">
              <Link to="/login" className="auth-link-secondary">
                Back to Sign in
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="otp">Enter 6-digit OTP</label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setError('');
                }}
                placeholder="e.g. 123456"
                maxLength={6}
                disabled={loading}
                autoFocus
              />
            </div>

            <div className="auth-actions">
              <button
                type="button"
                className="auth-link-secondary btn-link"
                onClick={() => {
                  setStep(1);
                  setError('');
                  setSuccess('');
                }}
                disabled={loading}
              >
                Resend OTP
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
