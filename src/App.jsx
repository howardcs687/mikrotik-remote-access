import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  addDoc, 
  deleteDoc,
  query,
  serverTimestamp,
  where
} from 'firebase/firestore';
import { 
  Server, 
  Shield, 
  Terminal, 
  Globe, 
  Plus, 
  LogOut, 
  ChevronRight, 
  Cpu, 
  Activity,
  Copy,
  CheckCircle2,
  Menu,
  X,
  Lock,
  Zap,
  User,
  ShieldCheck,
  LayoutDashboard,
  Users,
  Clock,
  Calendar,
  Star,
  Info
} from 'lucide-react';

// --- Firebase Configuration & Initialization ---
const firebaseConfig = {
  apiKey: "AIzaSyDQt9gg_X6_SyMEn8lYBc24VAm8ll3dkbw",
  authDomain: "mikrotik-remote-access-website.firebaseapp.com",
  projectId: "mikrotik-remote-access-website",
  storageBucket: "mikrotik-remote-access-website.firebasestorage.app",
  messagingSenderId: "870481074033",
  appId: "1:870481074033:web:638038b2d7bb438f5988d0",
  measurementId: "G-CEY46FC5QF"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'mikro-access-pro-v2';

// --- Utility: Copy to Clipboard ---
const copyToClipboard = (text) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Copy failed', err);
  }
  document.body.removeChild(textArea);
};

// --- Components ---

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential.user;
        await setDoc(doc(db, 'artifacts', appId, 'users', newUser.uid, 'profile', 'data'), {
          email: email,
          role: 'user', 
          createdAt: serverTimestamp()
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -mr-16 -mt-16"></div>
        
        <div className="flex flex-col items-center mb-8 relative">
          <div className="bg-blue-600/20 p-4 rounded-2xl mb-4">
            <Shield className="w-10 h-10 text-blue-500" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-400 mt-2 text-center text-sm">
            {isLogin 
              ? 'Secure MikroTik remote access management console.' 
              : 'Join the platform and start deploying secure tunnels.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm text-center">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Register Now'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-slate-400 text-sm hover:text-blue-400 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Navbar = ({ user, userProfile, setView, currentView }) => {
  const handleLogout = () => signOut(auth);

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setView('landing')}>
            <Server className="h-8 w-8 text-blue-500" />
            <span className="ml-2 text-xl font-bold text-white tracking-tight">MikroAccess</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <button onClick={() => setView('landing')} className={`text-sm font-medium ${currentView === 'landing' ? 'text-blue-400' : 'text-slate-300 hover:text-white'}`}>Home</button>
            {user && (
              <button 
                onClick={() => setView('dashboard')}
                className={`text-sm font-medium flex items-center gap-1 ${currentView === 'dashboard' ? 'text-blue-400' : 'text-slate-300 hover:text-white'}`}
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </button>
            )}
            {userProfile?.role === 'admin' && (
              <span className="bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest border border-indigo-500/30">
                Admin Mode
              </span>
            )}
            {user ? (
              <div className="flex items-center gap-4">
                <div className="h-4 w-[1px] bg-slate-800"></div>
                <button 
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-400 flex items-center gap-1 text-sm font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setView('auth')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const Dashboard = ({ user, userProfile, services, onAddService, onDeleteService }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [newService, setNewService] = useState({ name: '', targetIp: '', protocol: 'WinBox' });
  const isAdmin = userProfile?.role === 'admin';

  const stats = [
    { label: isAdmin ? 'Total Managed Tunnels' : 'My Active Tunnels', value: services.length, icon: <Globe className="w-5 h-5 text-blue-400" /> },
    { label: 'System Load', value: 'Optimal', icon: <Activity className="w-5 h-5 text-emerald-400" /> },
    { label: 'Role Level', value: userProfile?.role?.toUpperCase(), icon: <ShieldCheck className="w-5 h-5 text-purple-400" /> }
  ];

  const handleDeploy = async () => {
    await onAddService(newService);
    setIsAdding(false);
    setIsSuccessModalOpen(true);
    setNewService({ name: '', targetIp: '', protocol: 'WinBox' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              {isAdmin ? 'Admin Control Center' : 'User Console'}
            </h1>
            <p className="text-slate-500 text-sm mt-1">Logged in as: <span className="text-slate-300 font-mono">{user?.email}</span></p>
          </div>
          {!isAdmin && (
            <button 
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-5 h-5" /> Deploy Tunnel
            </button>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((s, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{s.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{s.value}</p>
              </div>
              <div className="p-3 bg-slate-800 rounded-xl">{s.icon}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
               <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-500" /> 
                {isAdmin ? 'Global Instance Monitor' : 'My Tunnels'}
              </h2>
              {isAdmin && <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Real-time data enabled</span>}
            </div>
            
            {services.length === 0 ? (
              <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl p-16 text-center">
                <Shield className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <h3 className="text-slate-300 font-bold">No active instances</h3>
                <p className="text-slate-500 text-sm mt-2">Provision a tunnel to start remote management.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {services.map((svc) => {
                  const isRecent = svc.createdAt && (Date.now() - (svc.createdAt.seconds * 1000) < 300000); // 5 mins
                  return (
                    <div key={svc.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all group relative overflow-hidden">
                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-slate-800 rounded-xl text-blue-400">
                            {svc.protocol.includes('SSH') ? <Terminal /> : <Zap />}
                          </div>
                          <div>
                            <h4 className="font-bold text-white">{svc.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              {isRecent ? (
                                <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border border-blue-500/20 flex items-center gap-1">
                                  <Clock className="w-3 h-3 animate-pulse" /> Provisioning
                                </span>
                              ) : (
                                <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border border-emerald-500/20">Active</span>
                              )}
                              {isAdmin && (
                                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                                  <User className="w-3 h-3" /> {svc.ownerEmail?.split('@')[0]}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => onDeleteService(svc.id, svc.ownerId)}
                          className="text-slate-600 hover:text-red-400 transition-colors p-2"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                        <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50 flex items-center justify-between">
                          <div className="overflow-hidden">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Endpoint</p>
                            <p className="text-sm text-blue-400 font-mono truncate">gw-01.mikro.net:{svc.publicPort}</p>
                          </div>
                          <button onClick={() => copyToClipboard(`gw-01.mikro.net:${svc.publicPort}`)} className="text-slate-600 hover:text-white ml-2">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Local Target</p>
                          <p className="text-sm text-slate-300 font-mono">{svc.targetIp}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {isAdmin && (
              <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-600/10">
                <h3 className="font-bold text-lg mb-2">Platform Overview</h3>
                <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                  Platform stability is currently 99.9%. You are managing {services.length} active global tunnels.
                </p>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                      <span>Server Capacity</span>
                      <span>12%</span>
                    </div>
                    <div className="h-2 bg-indigo-900/50 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-[12%]"></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                      <span>Bandwidth Used</span>
                      <span>42 GB</span>
                    </div>
                    <div className="h-2 bg-indigo-900/50 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-300 w-[30%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h3 className="font-bold text-white mb-4">Account Profile</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-blue-500 border border-slate-700">
                  <User className="w-6 h-6" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">{user?.email}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{userProfile?.role}</p>
                </div>
              </div>
              <div className="space-y-3">
                <button className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors">
                  Edit Profile
                </button>
                <button className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors">
                  Security Settings
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Deploy Modal */}
        {isAdding && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">Deploy New Instance</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Identity Name</label>
                  <input 
                    type="text" 
                    placeholder="MikroTik Router 1"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    value={newService.name}
                    onChange={(e) => setNewService({...newService, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Target IP</label>
                  <input 
                    type="text" 
                    placeholder="10.0.0.1"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    value={newService.targetIp}
                    onChange={(e) => setNewService({...newService, targetIp: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Service Protocol</label>
                  <select 
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    value={newService.protocol}
                    onChange={(e) => setNewService({...newService, protocol: e.target.value})}
                  >
                    <option>WinBox (8291)</option>
                    <option>SSH (22)</option>
                    <option>Web (80/443)</option>
                    <option>API (8728)</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button onClick={() => setIsAdding(false)} className="flex-1 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-colors">Cancel</button>
                <button 
                  onClick={handleDeploy}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                >
                  Deploy Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUCCESS MESSAGE MODAL (5 Minute Notice) */}
        {isSuccessModalOpen && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[110] flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-blue-500/30 rounded-3xl w-full max-w-md p-8 shadow-2xl text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Request Received!</h2>
              <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 mb-8">
                <p className="text-slate-300 text-sm leading-relaxed">
                  Your remote access tunnel is being provisioned. <br /><br />
                  <span className="text-blue-400 font-bold">The configuration script and setup steps will be available in your dashboard within 5 minutes.</span>
                </p>
              </div>
              <button 
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20"
              >
                Got it, thanks!
              </button>
              <p className="text-slate-600 text-[10px] mt-4 uppercase tracking-widest font-bold">
                Check back shortly for configuration details
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState('landing'); 
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Auth Listener (Rule 3)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Fetch profile (Rule 1)
        const profileRef = doc(db, 'artifacts', appId, 'users', u.uid, 'profile', 'data');
        const snap = await getDoc(profileRef);
        if (snap.exists()) {
          setUserProfile(snap.data());
          setView('dashboard');
        } else {
          // Fallback if profile missing
          setUserProfile({ role: 'user' });
          setView('dashboard');
        }
      } else {
        setUserProfile(null);
        if (view === 'dashboard') setView('landing');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [view]);

  // 2. Data Listener (Rule 1 & 2)
  useEffect(() => {
    if (!user || !userProfile) return;

    let q;
    if (userProfile.role === 'admin') {
      q = query(collection(db, 'artifacts', appId, 'public', 'registry'));
    } else {
      q = query(collection(db, 'artifacts', appId, 'users', user.uid, 'services'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setServices(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.error("Snapshot error:", err));

    return () => unsubscribe();
  }, [user, userProfile]);

  const handleAddService = async (data) => {
    if (!user) return;
    const publicPort = Math.floor(10000 + Math.random() * 50000);
    const serviceData = {
      ...data,
      publicPort,
      ownerId: user.uid,
      ownerEmail: user.email,
      createdAt: serverTimestamp(),
      provisioned: false
    };

    // User collection
    await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'services'), serviceData);
    // Public Registry for Admin
    await setDoc(doc(db, 'artifacts', appId, 'public', 'registry', `${user.uid}_${publicPort}`), serviceData);
  };

  const handleDeleteService = async (id, ownerId) => {
    if (!user) return;
    const targetUid = userProfile.role === 'admin' ? ownerId : user.uid;
    
    const snap = await getDoc(doc(db, 'artifacts', appId, 'users', targetUid, 'services', id));
    if (snap.exists()) {
      const data = snap.data();
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'registry', `${targetUid}_${data.publicPort}`));
    }
    
    await deleteDoc(doc(db, 'artifacts', appId, 'users', targetUid, 'services', id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-widest animate-pulse">Initializing Secure Tunnel...</p>
        </div>
      </div>
    );
  }

  const pricingPlans = [
    {
      name: "Lite",
      price: "7",
      duration: "7 Days",
      icon: <Clock className="w-6 h-6 text-blue-400" />,
      features: ["Single Tunnel Access", "WinBox Protocol Support", "7-Day Validity", "Basic Monitoring"],
      color: "blue"
    },
    {
      name: "Pro",
      price: "25",
      duration: "1 Month",
      icon: <Calendar className="w-6 h-6 text-indigo-400" />,
      features: ["Single Tunnel Access", "All Protocols (SSH, API)", "30-Day Validity", "Priority Connection", "Uptime History"],
      color: "indigo",
      popular: true
    },
    {
      name: "Elite",
      price: "250",
      duration: "1 Year",
      icon: <Star className="w-6 h-6 text-emerald-400" />,
      features: ["High-Speed Tunneling", "Unlimited Bandwidth", "365-Day Validity", "Dedicated Technical Support", "Auto-Renewal Option"],
      color: "emerald"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 selection:bg-blue-500/30">
      <Navbar user={user} userProfile={userProfile} setView={setView} currentView={view} />
      
      {view === 'auth' && <AuthPage />}
      
      {view === 'landing' && (
        <div className="relative overflow-hidden">
          {/* Hero Section */}
          <div className="pt-20 pb-20 px-6 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full pointer-events-none opacity-20">
               <div className="absolute top-[20%] left-[10%] w-[60%] h-[60%] bg-blue-600/30 blur-[120px] rounded-full"></div>
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-8">
                <Zap className="w-3 h-3" /> Enterprise Remote Access
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-8">
                Connect to MikroTik <br />
                <span className="text-blue-500 underline decoration-blue-500/20 underline-offset-8">Anywhere, Anytime.</span>
              </h1>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-12 leading-relaxed">
                The professional standard for WinBox, SSH, and API remote access. 
                Zero-config deployment secured by industry-grade encryption.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setView(user ? 'dashboard' : 'auth')}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
                >
                  Access Console <ChevronRight />
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="max-w-7xl mx-auto px-6 pb-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">Flexible Access Plans</h2>
              <p className="text-slate-500">Transparent pricing for network administrators and businesses.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, idx) => (
                <div key={idx} className={`relative bg-slate-900 border ${plan.popular ? 'border-blue-500' : 'border-slate-800'} rounded-3xl p-8 transition-all hover:border-blue-500/50 flex flex-col`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20">
                      Best Value
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <div className="p-3 bg-slate-800 w-fit rounded-2xl mb-4">
                      {plan.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-white">₱{plan.price}</span>
                      <span className="text-slate-500 text-sm font-medium">/ {plan.duration}</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-4 mb-8 flex-grow">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-3 text-sm text-slate-400">
                        <CheckCircle2 className={`w-4 h-4 ${plan.popular ? 'text-blue-500' : 'text-slate-600'}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    onClick={() => setView(user ? 'dashboard' : 'auth')}
                    className={`w-full py-4 rounded-2xl font-bold transition-all ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-600/10' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                  >
                    Select Plan
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-16 bg-blue-500/5 border border-blue-500/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600/20 rounded-2xl text-blue-500">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Need a custom enterprise solution?</h4>
                  <p className="text-slate-500 text-sm">We offer dedicated servers and custom port ranges for ISPs.</p>
                </div>
              </div>
              <button className="whitespace-nowrap px-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      )}

      {view === 'dashboard' && (
        <Dashboard 
          user={user} 
          userProfile={userProfile}
          services={services} 
          onAddService={handleAddService} 
          onDeleteService={handleDeleteService} 
        />
      )}
    </div>
  );
}