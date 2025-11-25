import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Mail, Lock } from 'lucide-react';
import { Button, Input, Card } from '../../components/ui';
import './Auth.css';

const LoginNew = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'developer'
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      login(formData.email, formData.password, formData.role);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="auth-container-new">
      <div className="auth-content">
        <Card className="auth-card-new" noPadding>
          <div className="auth-card-inner">
            {/* Header */}
            <div className="auth-header-new">
              <div className="auth-logo-new">Zyndrx</div>
              <h1 className="auth-title-new">Welcome back</h1>
              <p className="auth-subtitle-new">Sign in to your account to continue</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="auth-error-new">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="auth-form-new">
              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                icon={<Mail size={16} />}
                required
                fullWidth
              />

              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                icon={<Lock size={16} />}
                required
                fullWidth
              />

              <div className="auth-form-group">
                <label className="auth-label-new">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="auth-select-new"
                  required
                >
                  <option value="developer">Developer</option>
                  <option value="pm">Product Manager</option>
                  <option value="product-owner">Product Owner</option>
                  <option value="qa">QA Engineer</option>
                  <option value="devops">DevOps Engineer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                size="lg"
                fullWidth
                icon={<LogIn size={18} />}
              >
                Sign In
              </Button>
            </form>

            {/* Footer */}
            <div className="auth-footer-new">
              <p className="auth-footer-text">
                Don't have an account?{' '}
                <Link to="/register" className="auth-link-new">
                  Sign up
                </Link>
              </p>
            </div>

            {/* Demo Info */}
            <div className="auth-demo-new">
              <p className="auth-demo-title">Demo Credentials</p>
              <div className="auth-demo-content">
                <p><strong>Email:</strong> demo@zyndrx.com</p>
                <p><strong>Password:</strong> any password</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginNew;
