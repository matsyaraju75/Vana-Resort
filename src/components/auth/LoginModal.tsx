import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  AlertCircle,
  Check,
  KeyRound,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

type ManagementMode = 'signin' | 'forgot';

export const LoginModal: React.FC = () => {
  const {
    isLoginModalOpen,
    closeLoginModal,
    loginManagement,
    resetManagementPassword,
  } = useAuth();

  const navigate = useNavigate();

  const [mgmtMode, setMgmtMode] = useState<ManagementMode>('signin');

  // Management state
  const [mgmtUsername, setMgmtUsername] = useState('admin');
  const [mgmtPassword, setMgmtPassword] = useState('');
  const [mgmtRecoveryKey, setMgmtRecoveryKey] = useState('');
  const [mgmtNewPassword, setMgmtNewPassword] = useState('');

  // Feedback messages
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Reset states when modal opens
  useEffect(() => {
    if (isLoginModalOpen) {
      setMgmtMode('signin');
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [isLoginModalOpen]);

  const switchMgmtMode = (mode: ManagementMode) => {
    setMgmtMode(mode);
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Management Sign In
  const handleManagementSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const res = await loginManagement(mgmtPassword, mgmtUsername);
    if (res.success) {
      setSuccessMessage('Verified! Opening Admin Dashboard...');
      setTimeout(() => {
        closeLoginModal();
        navigate('/admin');
      }, 500);
    } else {
      setErrorMessage(res.message || 'Invalid management credentials.');
    }
  };

  // Management Forgot Password
  const handleManagementResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!mgmtRecoveryKey.trim()) {
      setErrorMessage('Please enter the master recovery key ("vana-admin" or "admin").');
      return;
    }
    if (!mgmtNewPassword || mgmtNewPassword.length < 4) {
      setErrorMessage('New password must be at least 4 characters.');
      return;
    }

    const res = await resetManagementPassword(mgmtRecoveryKey, mgmtNewPassword);
    if (res.success) {
      setSuccessMessage(res.message || 'Management password updated successfully!');
      setTimeout(() => {
        setMgmtPassword(mgmtNewPassword);
        switchMgmtMode('signin');
      }, 1200);
    } else {
      setErrorMessage(res.message || 'Failed to update management key.');
    }
  };

  // Quick Demo Management Fill
  const handleDemoManagement = () => {
    const activePass = localStorage.getItem('vana_resort_admin_password') || 'Admin@Vana2026!';
    setMgmtUsername('admin');
    setMgmtPassword(activePass);
    setErrorMessage('');
  };

  return (
    <Modal
      isOpen={isLoginModalOpen}
      onClose={closeLoginModal}
      maxWidth="sm"
      title="Staff & Management Sign In"
      subtitle="Restricted administration portal for Araku Valley resort desk"
    >
      <div className="space-y-5">
        {/* Global Notifications */}
        {errorMessage && (
          <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl animate-fadeIn">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 1. MANAGEMENT SIGN IN MODE */}
        {mgmtMode === 'signin' && (
          <form onSubmit={handleManagementSignIn} className="space-y-4">
            <div className="flex items-center justify-between pb-1">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Staff Authentication</span>
              </h4>
              <button
                type="button"
                onClick={() => switchMgmtMode('forgot')}
                className="text-xs font-semibold text-amber-800 hover:text-amber-950 hover:underline"
              >
                Forgot Key?
              </button>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl text-xs text-amber-900 leading-relaxed">
              <span className="font-semibold block mb-0.5">Staff & Operations Access</span>
              Sign in to manage reservations, review inquiries, and update room inventory.
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Staff Username
              </label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={mgmtUsername}
                  onChange={(e) => setMgmtUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Management Security Key
                </label>
                <button
                  type="button"
                  onClick={() => switchMgmtMode('forgot')}
                  className="text-[11px] text-amber-800 hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={mgmtPassword}
                  onChange={(e) => setMgmtPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full justify-center bg-amber-700 hover:bg-amber-800 text-white"
              >
                <Lock className="w-4 h-4" />
                <span>Unlock Admin Dashboard</span>
              </Button>

              <button
                type="button"
                onClick={handleDemoManagement}
                className="text-xs text-center font-medium text-amber-800 hover:text-amber-950 py-1 hover:underline"
              >
                Auto-fill Staff Credentials (admin / Admin@Vana2026!)
              </button>
            </div>
          </form>
        )}

        {/* 2. MANAGEMENT FORGOT / RECOVERY MODE */}
        {mgmtMode === 'forgot' && (
          <form onSubmit={handleManagementResetPassword} className="space-y-4">
            <div className="flex items-center justify-between pb-1">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-amber-600" />
                <span>Management Key Recovery</span>
              </h4>
              <button
                type="button"
                onClick={() => switchMgmtMode('signin')}
                className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Authorize with master recovery key (&quot;vana-admin&quot; or &quot;admin&quot;) to update the management password.
            </p>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Master Recovery Key
                </label>
                <button
                  type="button"
                  onClick={() => setMgmtRecoveryKey('vana-admin')}
                  className="text-[11px] text-amber-700 hover:underline"
                >
                  Fill Default ("vana-admin")
                </button>
              </div>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. vana-admin"
                  value={mgmtRecoveryKey}
                  onChange={(e) => setMgmtRecoveryKey(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                New Management Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={mgmtNewPassword}
                  onChange={(e) => setMgmtNewPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full justify-center bg-amber-700 hover:bg-amber-800 text-white"
              >
                <span>Update Management Password</span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
