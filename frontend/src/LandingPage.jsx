import React, { useState, useEffect } from 'react';
import { 
  Shield, Menu, X, ArrowRight, Activity, 
  Users, MapPin, WifiOff, Database, HeartPulse, Sparkles, ChevronRight, AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Handle navbar background change on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
          .font-inter { font-family: 'Inter', sans-serif; }
          html { scroll-behavior: smooth; }
          
          /* Custom blob animation */
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}
      </style>

      <div className="font-inter text-slate-900 overflow-x-hidden bg-slate-50 selection:bg-emerald-200 selection:text-emerald-900">
        
        {/* NAVBAR */}
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled || mobileMenuOpen ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-white/50 py-4' : 'bg-transparent py-6'
        }`}>
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
            
            {/* Logo */}
            <div className="flex items-center gap-2.5 cursor-pointer group hover:scale-105 transition-transform" onClick={() => window.scrollTo(0, 0)}>
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-400 blur-md opacity-50 group-hover:opacity-80 transition-opacity"></div>
                <div className="relative w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-700 shadow-md">
                  <Shield size={20} className="text-white" />
                </div>
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900">
                Swasthya<span className="text-slate-400 font-medium">Sathi</span>
              </span>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8 font-semibold text-sm text-slate-600">
              <a href="#features" className="hover:text-emerald-600 transition-colors">Platform</a>
              <a href="#impact" className="hover:text-emerald-600 transition-colors">Impact</a>
              <a href="#about" className="hover:text-emerald-600 transition-colors">Mission</a>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={() => navigate('/login')}
                className="group px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 shadow-md hover:shadow-xl hover:-translate-y-0.5"
              >
                Log In <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden relative z-50 p-2 rounded-xl text-slate-900 hover:bg-slate-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* MOBILE MENU DROPDOWN */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 z-40 bg-white/95 backdrop-blur-3xl flex flex-col pt-28 px-8 md:hidden"
            >
              <div className="flex flex-col gap-8 text-xl font-bold text-slate-800">
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="border-b border-slate-200/50 pb-5 hover:text-emerald-600 transition-colors">Platform Features</a>
                <a href="#impact" onClick={() => setMobileMenuOpen(false)} className="border-b border-slate-200/50 pb-5 hover:text-emerald-600 transition-colors">Our Impact</a>
                <a href="#about" onClick={() => setMobileMenuOpen(false)} className="border-b border-slate-200/50 pb-5 hover:text-emerald-600 transition-colors">The Mission</a>
                <div className="mt-8">
                  <button 
                    onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                    className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-xl"
                  >
                    Log In <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HERO SECTION */}
        <section className="relative min-h-screen w-full flex flex-col items-center justify-center text-center px-6 pt-24 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50 via-slate-50 to-white">
          
          {/* Animated Background Blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none w-full h-full flex justify-center items-center">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-1/3 -right-20 w-96 h-96 bg-blue-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-teal-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="relative z-10 max-w-5xl mx-auto flex flex-col items-center pb-32"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 text-slate-700 text-sm font-bold uppercase tracking-wider mb-8 shadow-sm hover:shadow-md transition-shadow cursor-default">
              <Sparkles size={16} className="text-amber-500" />
              Equipping Field Workers with AI
            </motion.div>
            
            <motion.h1 
              variants={fadeUp}
              className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[1.05] mb-8"
            >
              Healthcare for the <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-600 inline-block py-2">
                Last Mile.
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeUp}
              className="text-lg md:text-2xl text-slate-600 font-medium max-w-3xl leading-relaxed mb-12"
            >
              An offline-first, AI-driven registry enabling ASHA workers to seamlessly track patients, triage maternal care, and identify local epidemics in India's most remote villages.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
              <button 
                onClick={() => navigate('/login')}
                className="group w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all hover:scale-105 shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_40px_rgba(16,185,129,0.4)]"
              >
                Access Portal <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
              </button>
              <a 
                href="#features"
                className="group w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-all hover:scale-105 shadow-sm hover:shadow-md"
              >
                Explore Platform
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* FLOATING STATS DOCK - Replaces the fixed bottom one to flow naturally inside doc */}
        <section className="relative z-20 -mt-24 px-6 md:px-12 w-full max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-white/80 backdrop-blur-2xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-3xl p-8 flex flex-col justify-center items-start group hover:-translate-y-2 transition-transform duration-500">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 text-blue-600 shadow-inner group-hover:scale-110 transition-transform">
                <Users size={28} />
              </div>
              <p className="text-4xl font-black text-slate-900 tracking-tight">45k+</p>
              <p className="text-base text-slate-500 font-bold mt-1">Active ASHA Workers</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-2xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-3xl p-8 flex flex-col justify-center items-start group hover:-translate-y-2 transition-transform duration-500 delay-100">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 text-emerald-600 shadow-inner group-hover:scale-110 transition-transform">
                <Activity size={28} />
              </div>
              <p className="text-4xl font-black text-slate-900 tracking-tight">2.4M</p>
              <p className="text-base text-slate-500 font-bold mt-1">Digital Vitals Logged</p>
            </div>

            <div className="bg-white/80 backdrop-blur-2xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-3xl p-8 flex flex-col justify-center items-start group hover:-translate-y-2 transition-transform duration-500 delay-200">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-6 text-purple-600 shadow-inner group-hover:scale-110 transition-transform">
                <MapPin size={28} />
              </div>
              <p className="text-4xl font-black text-slate-900 tracking-tight">1,200+</p>
              <p className="text-base text-slate-500 font-bold mt-1">Villages Connected</p>
            </div>
          </motion.div>
        </section>

        {/* FEATURES BENTO GRID */}
        <section id="features" className="py-32 relative bg-slate-50 z-10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-20 max-w-2xl"
            >
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Built for the realities of rural healthcare.</h2>
              <p className="text-xl text-slate-600 font-medium leading-relaxed">
                We're replacing massive paper logbooks with an intelligent, resilient ecosystem. Swasthya Sathi works alongside field workers, predicting risks before they become emergencies.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Feature 1 - Large spanning col */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-2 bg-white rounded-3xl p-10 border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 w-full h-full flex flex-col justify-between">
                  <div>
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-8 border border-red-100 shadow-sm">
                      <WifiOff size={32} />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Resilience via <br/>Offline-First Architecture</h3>
                    <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-md">
                      No 4G? No problem. ASHA workers can log vitals and register patients entirely offline. The app securely queues the data incrementally and flawlessly auto-syncs the moment they return to the Primary Health Center's network.
                    </p>
                  </div>
                  <div className="mt-8 flex items-center text-red-600 font-bold gap-2">
                    Learn about Sync Engine <ChevronRight size={20} />
                  </div>
                </div>
              </motion.div>

              {/* Feature 2 - AI Triage */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-1 bg-slate-900 text-white rounded-3xl p-10 shadow-xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.2),transparent_50%)]"></div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-8 border border-emerald-500/30">
                      <HeartPulse size={32} />
                    </div>
                    <h3 className="text-3xl font-black mb-4 tracking-tight">AI Clinical Triage</h3>
                    <p className="text-slate-300 font-medium leading-relaxed text-lg">
                      Our embedded Gemini intelligence flags high-risk maternal cases in real-time, instantly scoring patients (Red/Yellow/Green) based on localized vitals logic, preventing emergencies.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Feature 3 - Admin Hub */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-3 bg-white rounded-3xl p-10 border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row items-center gap-12 group"
              >
                <div className="flex-1">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 border border-blue-100 shadow-sm">
                    <Database size={32} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Enterprise Admin Command Center</h3>
                  <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-2xl">
                    Give Medical Officers a live, aggregated geographic heatmap of their entire district. Track active disease clusters automatically through AI grouping, monitor fleed sync times, and deploy resources predictively.
                  </p>
                  <div className="mt-8 flex items-center text-blue-600 font-bold gap-2 cursor-pointer">
                    Explore Dashboard UI <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                {/* Visual Placeholder for Admin Dashboard snippet */}
                <div className="w-full md:w-1/2 h-64 bg-slate-100 rounded-2xl border border-slate-200/60 overflow-hidden relative shadow-inner">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #0f172a 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />
                  <div className="absolute top-12 left-12 w-32 h-32 bg-red-400/20 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-12 right-12 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/80 backdrop-blur-md px-6 py-4 rounded-xl border border-white shadow-lg font-bold text-slate-800 flex items-center gap-3">
                      <Activity className="text-purple-600" /> Epidemic Alert Tracking
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* IMPACT SECTION */}
        <section id="impact" className="py-32 relative bg-white z-10 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-20 max-w-2xl mx-auto text-center"
            >
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Real-World Impact</h2>
              <p className="text-xl text-slate-600 font-medium leading-relaxed">
                By digitizing the first mile of healthcare, we're not just saving time; we're saving lives.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { metric: "60%", label: "Reduction in maternal mortality risk through early AI flagging", icon: HeartPulse, color: "text-rose-500", bg: "bg-rose-50" },
                { metric: "2.5x", label: "Faster patient registration and vitals logging vs. paper logs", icon: Activity, color: "text-blue-500", bg: "bg-blue-50" },
                { metric: "100%", label: "Data retention even during complete network blackouts", icon: Database, color: "text-emerald-500", bg: "bg-emerald-50" },
                { metric: "24/7", label: "Automated epidemic monitoring for regional CMOs", icon: WifiOff, color: "text-purple-500", bg: "bg-purple-50" }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-slate-50 rounded-3xl p-8 border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"
                >
                  <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                    <item.icon size={28} />
                  </div>
                  <h4 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">{item.metric}</h4>
                  <p className="text-slate-600 font-medium leading-loose">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* MISSION SECTION */}
        <section id="about" className="py-32 relative bg-slate-900 text-white z-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-500/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-full bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-emerald-300 text-sm font-bold uppercase tracking-wider mb-8">
                  <Shield size={16} /> The Mission
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">Empowering those who care for the most vulnerable.</h2>
                <p className="text-xl text-slate-300 font-medium leading-relaxed mb-8">
                  ASHA workers are the backbone of India's rural healthcare system, yet they rely on bulky registers and manual calculations. 
                </p>
                <p className="text-xl text-slate-300 font-medium leading-relaxed mb-8">
                  Our mission is to arm them with enterprise-grade clinical tools that don't depend on perfect infrastructure, shifting the paradigm from reactive treatment to proactive prevention.
                </p>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => navigate('/login')}
                    className="px-8 py-4 bg-emerald-500 text-slate-900 rounded-2xl font-bold text-lg flex items-center gap-3 hover:bg-emerald-400 transition-all hover:scale-105 shadow-[0_8px_30px_rgba(16,185,129,0.3)]"
                  >
                    Join the Mission <ArrowRight size={20} />
                  </button>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Abstract visualization */}
                <div className="w-full h-[500px] bg-slate-800 rounded-[2rem] border border-slate-700/50 relative overflow-hidden flex items-center justify-center p-8 group shadow-2xl shadow-emerald-500/10">
                   <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
                   
                   <div className="relative z-10 w-full max-w-sm h-full flex flex-col justify-center gap-4">
                      {/* Simulating cards floating up */}
                      {[
                        { title: "Maternal Checkup Logged", time: "Just now", icon: HeartPulse, c: "text-rose-400" },
                        { title: "Epidemic Alert Handled", time: "2 mins ago", icon: AlertTriangle, c: "text-amber-400" },
                        { title: "Offline Sync Completed", time: "5 mins ago", icon: Database, c: "text-emerald-400" }
                      ].map((item, i) => (
                        <div key={i} className="w-full bg-slate-900/80 backdrop-blur-xl border border-slate-700 p-5 rounded-2xl flex items-center gap-4 shadow-xl translate-x-4 group-hover:translate-x-0 transition-transform duration-500" style={{ transitionDelay: `${i * 100}ms` }}>
                          <div className={`p-3 rounded-xl bg-slate-800 ${item.c}`}><item.icon size={20}/></div>
                          <div>
                            <p className="font-bold text-white">{item.title}</p>
                            <p className="text-xs text-slate-400 font-medium">{item.time}</p>
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FOOTER CTA */}
        <section className="py-24 bg-white border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-6 text-center">
             <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Ready to bridge the care gap?</h2>
             <p className="text-xl text-slate-600 font-medium leading-relaxed mb-10 max-w-2xl mx-auto">
               Join Swasthya Sathi today as an administrator or access your localized ASHA worker terminal.
             </p>
             <button 
                onClick={() => navigate('/login')}
                className="px-10 py-5 rounded-2xl text-lg font-bold transition-all flex items-center justify-center gap-3 mx-auto bg-slate-900 text-white hover:bg-slate-800 shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                Log In to SwasthyaSathi <ArrowRight size={20} />
              </button>
          </div>
        </section>
        
        {/* Simple Footer footer */}
        <footer className="bg-slate-50 py-10 border-t border-slate-200/60 text-center text-slate-500 font-medium text-sm">
           <p>© {new Date().getFullYear()} SwasthyaSathi. Built for India's ASHA workers.</p>
        </footer>

      </div>
    </>
  );
}
