import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Menu, Bell, CloudOff, Plus, Languages,
  Search, LayoutDashboard, Users, Baby, RefreshCw, 
  Settings, LogOut, ShieldAlert, UploadCloud
} from 'lucide-react';
import { useLanguage } from './language-context';
import { getStoredToken } from './auth-utils';
import { getQueue, clearQueue } from './sync-utils';

export default function Layout() {
  const [isOffline, setIsOffline] = useState(false);
  const location = useLocation();
  const { language, toggleLanguage } = useLanguage();

  const isActive = (path) => {
    if (path === '/directory' && location.pathname.startsWith('/patient')) return true;
    return location.pathname === path;
  };
  const text = language === 'hi'
    ? {
        workspace: 'कार्यस्थान',
        dashboard: 'डैशबोर्ड',
        directory: 'रोगी सूची',
        addPatient: 'रोगी जोड़ें',
        maternalCare: 'मातृ देखभाल',
        system: 'सिस्टम',
        offlineMode: 'ऑफलाइन मोड',
        preferences: 'प्राथमिकताएं',
        alerts: 'अलर्ट',
        search: 'रजिस्ट्री खोजें...',
        offlineStatus: 'ऑफलाइन कार्यरत',
        syncedStatus: 'सिंक हो गया',
        newVisit: 'नई विजिट',
        switchToHindi: 'हिंदी',
        switchToEnglish: 'English',
      }
    : {
        workspace: 'Workspace',
        dashboard: 'Dashboard',
        directory: 'Patient Directory',
        addPatient: 'Add Patient',
        maternalCare: 'Maternal Care',
        system: 'System',
        offlineMode: 'Offline Mode',
        preferences: 'Preferences',
        alerts: 'Health Alerts',
        search: 'Search registry...',
        offlineStatus: 'Working Offline',
        syncedStatus: 'Synced',
        newVisit: 'New Visit',
        switchToHindi: 'हिंदी',
        switchToEnglish: 'English',
        syncNow: 'Sync Now',
        syncing: 'Syncing Data...',
      };

  const [queueLength, setQueueLength] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  // Hook to track real network status and queue items
  useEffect(() => {
    const handleNetworkChange = () => setIsOffline(!navigator.onLine);
    const updateQueueSize = () => {
      const q = getQueue();
      setQueueLength(q.length);
    };

    // Initial check
    handleNetworkChange();
    updateQueueSize();

    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);
    window.addEventListener('syncUpdate', updateQueueSize);

    // Initial listener for hackathon demo
    const interval = setInterval(updateQueueSize, 2000); 

    return () => {
      window.removeEventListener('online', handleNetworkChange);
      window.removeEventListener('offline', handleNetworkChange);
      window.removeEventListener('syncUpdate', updateQueueSize);
      clearInterval(interval);
    };
  }, []);

  const handleManualSync = async () => {
    const actions = getQueue();
    if (actions.length === 0) return;

    setIsSyncing(true);
    try {
      const token = await getStoredToken();
      // Assume AW-1029 is the local worker
      const payload = { ashaId: 'AW-1029', actions };

      const response = await fetch('http://localhost:5000/sync/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Sync failed. Check Server.");

      const result = await response.json();
      console.log("Sync Complete:", result);
      
      clearQueue();
      alert(`Sync successful! Processed ${result.processed} new records.`);
    } catch (err) {
      console.error(err);
      alert("Failed to sync. Please ensure you are online and the server is reachable.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="h-screen bg-slate-50/50 flex font-inter text-slate-900 overflow-hidden w-full">
      {/* SIDEBAR NAVIGATION (Desktop) */}
      <aside className="w-64 bg-slate-900 flex flex-col hidden md:flex shrink-0 z-20">
        <Link to="/dashboard" className="h-16 flex items-center px-6 border-b border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer">
          <div className="w-8 h-8 bg-emerald-500 rounded-md flex items-center justify-center mr-3">
            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-5A1.5 1.5 0 0112.5 10h1a1.5 1.5 0 011.5 1.5v5a1.5 1.5 0 01-1.5 1.5h-1a1.5 1.5 0 01-1.5-1.5zm1-8.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-white">
            Swasthya<span className="font-normal text-slate-400">Sathi</span>
          </h1>
        </Link>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="px-3 text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">{text.workspace}</p>
          
          <Link to="/dashboard" className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/dashboard') ? 'bg-emerald-900/40 text-emerald-400' : 'text-slate-400 hover:text-white'}`}>
            <LayoutDashboard size={18} /> {text.dashboard}
          </Link>
          <Link to="/directory" className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/directory') ? 'bg-emerald-900/40 text-emerald-400' : 'text-slate-400 hover:text-white'}`}>
            <Users size={18} /> {text.directory}
          </Link>
          <Link to="/add-patient" className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/add-patient') ? 'bg-emerald-900/40 text-emerald-400' : 'text-slate-400 hover:text-white'}`}>
            <Plus size={18} /> {text.addPatient}
          </Link>

          
          <p className="px-3 text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 mt-8">{text.system}</p>
          
          <div className="px-3 py-2">
            <div className="w-full flex items-center justify-between text-slate-400 rounded-md text-sm font-medium transition-colors cursor-default mb-2">
              <div className="flex items-center gap-3">
                <RefreshCw size={18} /> {text.offlineMode}
              </div>
              <div className={`w-2 h-2 rounded-full ${isOffline ? 'bg-red-400' : 'bg-teal-400'}`} />
            </div>
            
            {queueLength > 0 && (
              <button
                onClick={handleManualSync}
                disabled={isSyncing || isOffline}
                className={`w-full flex items-center justify-center gap-2 px-3 py-2 mt-2 rounded-md text-sm font-medium transition-colors ${
                  isOffline || isSyncing 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-900/20'
                }`}
              >
                <UploadCloud size={16} className={isSyncing ? "animate-bounce" : ""} />
                {isSyncing ? text.syncing : `${text.syncNow} (${queueLength})`}
              </button>
            )}
          </div>

        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link to="/" className="flex items-center gap-3 p-2 hover:bg-slate-800/50 rounded-lg cursor-pointer transition-colors text-white">
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-xs font-semibold">
              JN
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">Jash Nikombhe</p>
              <p className="text-xs text-slate-400 truncate">AW-1029</p>
            </div>
            <LogOut size={16} className="text-slate-500 hover:text-white" />
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* TOP HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 transition-all">
          <button className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-md transition-colors mr-3">
            <Menu size={20} />
          </button>

          <div className="flex-1 max-w-md flex items-center relative hidden sm:flex">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder={text.search}
              className="w-full bg-slate-50 focus:bg-white border border-transparent focus:border-slate-300 pl-9 pr-4 py-2 rounded-lg text-sm transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <button
              onClick={toggleLanguage}
              className="hidden sm:flex items-center gap-2 border border-slate-200 bg-slate-50 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Languages size={16} />
              {language === 'en' ? text.switchToHindi : text.switchToEnglish}
            </button>
            <div className="hidden lg:flex items-center gap-2">
              {queueLength > 0 ? (
                <button 
                  onClick={handleManualSync}
                  disabled={isSyncing || isOffline}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                    isOffline || isSyncing 
                      ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed' 
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
                  }`}
                >
                  <UploadCloud size={14} className={isSyncing ? "animate-bounce" : ""} />
                  {isSyncing ? text.syncing : `${text.syncNow} (${queueLength})`}
                </button>
              ) : (
                <div className="flex items-center gap-2 px-2">
                  <span className="text-xs font-medium text-slate-500">{isOffline ? text.offlineStatus : text.syncedStatus}</span>
                  <div className={`w-2 h-2 rounded-full ${isOffline ? 'bg-red-500' : 'bg-teal-500'}`} />
                </div>
              )}
            </div>
            
            <div className="h-6 w-px bg-slate-200 hidden lg:block mx-1"></div>
            
            <Link to="/alerts" className={`relative transition-colors p-1 ${isActive('/alerts') ? 'text-red-500' : 'text-slate-500 hover:text-slate-800'}`}>
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </Link>

            <Link to="/add-patient" className="hidden sm:flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors ml-2">
              <Plus size={16} /> {text.newVisit}
            </Link>
          </div>
        </header>

        {/* SCROLLABLE CONTENT RENDERED VIA OUTLET */}
        <main className="flex-1 overflow-y-auto w-full max-w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
