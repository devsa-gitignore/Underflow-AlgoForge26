import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, ArrowRight, Building2, CheckCircle2, AlertTriangle, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [role, setRole] = useState('asha'); // 'asha' or 'admin'
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState('left');

  const handleRoleChange = (newRole) => {
    if (role === newRole) return;
    setSlideDirection(newRole === 'admin' ? 'left' : 'right');
    setIsAnimating(true);
    setTimeout(() => {
      setRole(newRole);
      setIsAnimating(false);
    }, 200); 
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row w-full font-inter text-slate-900">
      
      {/* LEFT PANE - Clean Contextual Imagery */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-14 relative overflow-hidden bg-slate-900">
        
        {/* Soft Background */}
        <div 
          className="absolute inset-0 transition-opacity duration-1000 opacity-20"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2000&auto=format&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />

        {/* Elegant overlay to maintain contrast without harshness */}
        <div 
          className={`absolute inset-0 transition-colors duration-700 ${role === 'asha' ? 'bg-teal-900/90' : 'bg-slate-900/95'}`}
        />

        <div className="relative z-10 flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${role === 'asha' ? 'bg-teal-500' : 'bg-indigo-500'}`}>
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-5A1.5 1.5 0 0112.5 10h1a1.5 1.5 0 011.5 1.5v5a1.5 1.5 0 01-1.5 1.5h-1a1.5 1.5 0 01-1.5-1.5zm1-8.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Swasthya<span className="font-normal opacity-80">Sathi</span>
            </h1>
          </div>

          <div className="mt-auto mb-20 max-w-lg">
            <h2 className="text-3xl font-semibold text-white leading-tight mb-4 transition-all duration-300">
              {role === 'asha' 
                ? "Connect with families. Improve local health." 
                : "Manage resources effectively."}
            </h2>
            <p className="text-base text-slate-300 font-normal leading-relaxed">
              {role === 'asha'
                ? "Access patient records, track infant care, and stay connected with local health clusters directly from your device."
                : "A centralized dashboard to monitor health data, oversee field operations, and respond to regional needs."}
            </p>

            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-3 text-slate-300 text-sm">
                <CheckCircle2 size={18} className={role === 'asha' ? 'text-teal-400' : 'text-indigo-400'} />
                <span>Secure patient records</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300 text-sm">
                <CheckCircle2 size={18} className={role === 'asha' ? 'text-teal-400' : 'text-indigo-400'} />
                <span>{role === 'asha' ? 'Works offline for remote visits' : 'Regional analytic insights'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANE - Clean Login Form */}
      <div className="flex-1 flex flex-col justify-center p-8 lg:p-16 relative bg-white">
        
        <div className="w-full max-w-sm mx-auto">
          
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="lg:hidden flex items-center gap-2 mb-10 border-b border-slate-100 pb-5">
            <div className={`w-8 h-8 rounded-md flex items-center justify-center ${role === 'asha' ? 'bg-teal-600' : 'bg-slate-800'}`}>
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-5A1.5 1.5 0 0112.5 10h1a1.5 1.5 0 011.5 1.5v5a1.5 1.5 0 01-1.5 1.5h-1a1.5 1.5 0 01-1.5-1.5zm1-8.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Swasthya<span className="font-normal text-slate-500">Sathi</span>
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Welcome back</h2>
            <p className="text-sm text-slate-500">Sign in to your account</p>
          </div>

          {/* Role Toggle */}
          <div className="bg-slate-100/80 p-1 rounded-xl flex relative mb-8 border border-slate-200/60 shadow-inner">
            <div 
              className="absolute inset-y-1 bg-white rounded-lg shadow-sm transition-transform duration-300 ease-out border border-slate-200/50"
              style={{ 
                width: 'calc(50% - 4px)', 
                transform: role === 'asha' ? 'translateX(0)' : 'translateX(100%)',
                left: '4px'
              }}
            />
            <button 
              onClick={() => handleRoleChange('asha')}
              className={`relative z-10 flex-1 py-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${role === 'asha' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <User size={16} /> Field Worker
            </button>
            <button 
              onClick={() => handleRoleChange('admin')}
              className={`relative z-10 flex-1 py-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${role === 'admin' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <Building2 size={16} /> Coordinator
            </button>
          </div>

          {/* Form Container */}
          <div className="relative overflow-hidden min-h-[300px]">
            <div 
              className={`absolute w-full transition-all duration-300 ease-out ${
                isAnimating 
                  ? `opacity-0 ${slideDirection === 'left' ? '-translate-x-4' : 'translate-x-4'}` 
                  : 'opacity-100 translate-x-0'
              }`}
            >
              {role === 'asha' ? <AshaLogin /> : <AdminLogin />}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function AshaLogin() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: phone, 2: otp
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!phone) return setError('Please enter a phone number');
    
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await fetch('http://localhost:5000/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep(2);
        setSuccessMsg(`OTP sent to your number`);
      } else {
        setError(data.message || 'Failed to send OTP.');
      }
    } catch (err) {
      setError('Connection to backend failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('swasthya_token', data.token);
        localStorage.setItem('swasthya_user', JSON.stringify(data));
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid OTP.');
      }
    } catch (err) {
      setError('Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Visual Header */}
      <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex items-center gap-4">
        <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 shadow-inner">
          <User size={24} />
        </div>
        <div>
           <p className="font-black text-slate-900 leading-none mb-1">ASHA Access</p>
           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Village Field Worker Portal</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-black rounded-xl flex items-center gap-3">
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-black rounded-xl flex items-center gap-3">
          <CheckCircle2 size={16} /> {successMsg}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleSendOTP} className="space-y-6">
          <div>
            <label className="block text-sm font-black text-slate-700 mb-2">Authenticated Phone Number</label>
            <div className="relative group">
              <span className="absolute left-4 top-4 text-slate-400 font-black text-sm group-focus-within:text-teal-500 transition-colors">+91</span>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="00000-00000"
                className="w-full bg-slate-50 border border-slate-200 pl-14 pr-4 py-4 rounded-2xl focus:outline-none focus:border-teal-500 focus:bg-white focus:ring-8 focus:ring-teal-500/5 transition-all text-slate-900 text-sm font-bold tracking-widest"
                required
                autoFocus
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading || phone.length < 10}
            className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all bg-teal-600 text-white hover:bg-teal-700 disabled:bg-slate-100 disabled:text-slate-400 shadow-[0_10px_30px_rgba(20,184,166,0.3)] hover:shadow-[0_15px_40px_rgba(20,184,166,0.4)] hover:-translate-y-1"
          >
            {loading ? 'Sending Request...' : 'Get Login OTP'} <ArrowRight size={20} />
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          <div>
            <label className="block text-sm font-black text-slate-700 mb-2">Verification Code</label>
            <div className="relative">
              <Lock className="absolute left-4 top-4.5 text-slate-300" size={20} />
              <input 
                type="text" 
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-8 focus:ring-emerald-500/5 transition-all text-slate-900 text-2xl tracking-[0.8em] font-black placeholder:tracking-normal placeholder:font-normal"
                required
                autoFocus
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading || otp.length < 6}
            className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 shadow-[0_10px_30px_rgba(16,185,129,0.3)]"
          >
            {loading ? 'Verifying...' : 'Verify & Continue'} <ArrowRight size={20} />
          </button>

          <button 
            type="button" 
            onClick={() => setStep(1)}
            className="w-full text-[10px] font-black text-slate-400 hover:text-teal-600 transition-colors py-2 uppercase tracking-widest"
          >
            Change Number
          </button>
        </form>
      )}
    </div>
  );
}

function AdminLogin() {
  const navigate = useNavigate();
  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/admin');
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Work Email</label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-3 text-slate-400" size={18} />
          <input 
            type="email" 
            placeholder="coordinator@health.gov.in"
            className="w-full bg-white border border-slate-300 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-900 text-sm placeholder-slate-400"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-3 text-slate-400" size={18} />
          <input 
            type="password" 
            placeholder="••••••••"
            className="w-full bg-white border border-slate-300 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-900 text-sm placeholder-slate-400"
            required
          />
        </div>
      </div>

      <div className="flex justify-between items-center mt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
          <span className="text-xs font-medium text-slate-600">Remember me</span>
        </label>
        <button type="button" className="text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors">
          Reset Password
        </button>
      </div>

      <button 
        type="submit"
        className="w-full py-3 mt-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all bg-slate-900 text-white hover:bg-slate-800"
      >
        Sign In <ArrowRight size={16} />
      </button>
    </form>
  );
}
