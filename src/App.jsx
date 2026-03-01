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
  serverTimestamp
} from 'firebase/firestore';
import { 
  Server, Shield, Terminal, Globe, Plus, LogOut, ChevronRight, Cpu, 
  Activity, Copy, CheckCircle2, X, Zap, User, ShieldCheck, 
  LayoutDashboard, Clock, Calendar, Star
} from 'lucide-react';

// --- Firebase Configuration ---
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
const appId = 'mikro-access-pro-v2';

// --- ROBUST CSS FALLBACK ---
// This handles the layout even if Tailwind fails to load.
const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    :root { color-scheme: dark; }
    body { 
      margin: 0; 
      background-color: #020617 !important; 
      color: #f1f5f9; 
      font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
    }
    /* Grid Fallback */
    .grid-container { 
      display: flex; 
      flex-wrap: wrap; 
      gap: 24px; 
      justify-content: center; 
      width: 100%; 
      max-width: 1200px; 
      margin: 0 auto;
      padding: 20px;
      box-sizing: border-box;
    }
    .pricing-card { 
      background: #0f172a; 
      border: 1px solid #1e293b; 
      border-radius: 24px; 
      padding: 32px; 
      flex: 1; 
      min-width: 300px; 
      max-width: 380px; 
      display: flex; 
      flex-direction: column;
      box-sizing: border-box;
    }
    .btn-main { 
      background: #2563eb; 
      color: white; 
      padding: 14px; 
      border-radius: 12px; 
      border: none; 
      font-weight: bold; 
      cursor: pointer; 
      width: 100%;
      margin-top: auto;
    }
    ul { list-style: none; padding: 0; margin: 20px 0; }
    li { margin-bottom: 12px; display: flex; align-items: center; gap: 10px; font-size: 14px; color: #94a3b8; }
    .price-text { font-size: 32px; font-weight: 900; color: white; }
    .nav-bar { width: 100%; height: 64px; border-bottom: 1px solid #1e293b; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; box-sizing: border-box; background: #0f172a; }
  `}} />
);

// --- Navbar ---
const Navbar = ({ user, setView, currentView }) => {
  return (
    <nav className="nav-bar sticky top-0 z-50">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
        <Server className="h-6 w-6 text-blue-500" />
        <span className="text-xl font-bold tracking-tighter">MIKRO<span className="text-blue-500">ACCESS</span></span>
      </div>
      <div className="flex items-center gap-6">
        <button onClick={() => setView('landing')} className={`text-sm font-medium ${currentView === 'landing' ? 'text-blue-400' : 'text-slate-400'}`}>Home</button>
        {user ? (
          <button onClick={() => setView('dashboard')} className="bg-blue-600 px-4 py-2 rounded-lg text-sm font-bold text-white">Dashboard</button>
        ) : (
          <button onClick={() => setView('auth')} className="bg-blue-600 px-4 py-2 rounded-lg text-sm font-bold text-white">Get Started</button>
        )}
      </div>
    </nav>
  );
};

// --- Auth Page ---
const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) await signInWithEmailAndPassword(auth, email, password);
      else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'artifacts', appId, 'users', cred.user.uid, 'profile', 'data'), { email, role: 'user' });
      }
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="flex justify-center pt-20 px-6">
      <div className="pricing-card w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">{isLogin ? 'Sign In' : 'Create Account'}</h2>
        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <input className="bg-slate-800 border-none p-4 rounded-xl text-white outline-none" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
          <input className="bg-slate-800 border-none p-4 rounded-xl text-white outline-none" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
          <button type="submit" className="btn-main">{isLogin ? 'Login' : 'Register'}</button>
        </form>
        <p onClick={() => setIsLogin(!isLogin)} className="text-center text-xs text-slate-500 mt-6 cursor-pointer hover:text-blue-400">
          {isLogin ? "Need an account? Register" : "Have an account? Login"}
        </p>
      </div>
    </div>
  );
};

// --- Dashboard ---
const Dashboard = ({ user, services, onAddService, onDeleteService }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newSvc, setNewSvc] = useState({ name: '', targetIp: '', protocol: 'WinBox (8291)' });

  return (
    <div className="container-custom py-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black text-white">Console</h1>
        <button onClick={() => setIsAdding(true)} className="bg-blue-600 p-3 rounded-xl font-bold text-white flex items-center gap-2"><Plus /> New Tunnel</button>
      </div>

      <div className="grid-container">
        {services.length === 0 ? (
          <div className="pricing-card text-center opacity-50"><p>No active tunnels found.</p></div>
        ) : (
          services.map(svc => (
            <div key={svc.id} className="pricing-card" style={{ maxWidth: '100%', flex: '1 1 100%' }}>
              <div className="flex justify-between">
                <h4 className="font-bold text-white text-lg">{svc.name}</h4>
                <X className="cursor-pointer text-slate-600" onClick={() => onDeleteService(svc.id, svc.ownerId)} />
              </div>
              <p className="text-slate-500 text-xs mt-2">Target: {svc.targetIp}</p>
              <div className="mt-4 p-3 bg-black rounded border border-slate-800 text-blue-400 text-xs font-mono">
                gw-01.mikro.net:{svc.publicPort}
              </div>
            </div>
          ))
        )}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-6 z-50">
          <div className="pricing-card w-full max-w-md">
            <h2 className="text-xl font-bold mb-6">Deploy Instance</h2>
            <input placeholder="Name" className="bg-slate-800 p-3 rounded-xl mb-3 text-white outline-none" onChange={e => setNewSvc({...newSvc, name: e.target.value})} />
            <input placeholder="Target IP" className="bg-slate-800 p-3 rounded-xl mb-6 text-white outline-none" onChange={e => setNewSvc({...newSvc, targetIp: e.target.value})} />
            <div className="flex gap-4">
              <button onClick={() => setIsAdding(false)} className="flex-1 p-3 bg-slate-800 rounded-xl">Cancel</button>
              <button onClick={() => { onAddService(newSvc); setIsAdding(false); }} className="flex-1 p-3 bg-blue-600 rounded-xl font-bold text-white">Deploy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [view, setView] = useState('landing');
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Inject Tailwind Play CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.tailwindcss.com';
    document.head.appendChild(script);

    return onAuthStateChanged(auth, u => {
      setUser(u);
      setLoading(false);
      if (u) setView('dashboard');
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'artifacts', appId, 'users', user.uid, 'services'));
    return onSnapshot(q, snap => setServices(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, [user]);

  const handleAdd = async (data) => {
    const publicPort = Math.floor(10000 + Math.random() * 50000);
    const serviceData = { ...data, publicPort, ownerId: user.uid, createdAt: serverTimestamp() };
    await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'services'), serviceData);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'services', id));
  };

  const pricing = [
    { name: "Lite", price: "7", duration: "7 Days", features: ["Single Tunnel", "WinBox Protocol", "7-Day Validity"] },
    { name: "Pro", price: "25", duration: "1 Month", features: ["SSH & API Support", "30-Day Validity", "Priority Access"] },
    { name: "Elite", price: "250", duration: "1 Year", features: ["Unlimited Bandwidth", "365-Day Validity", "24/7 Support"] }
  ];

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center font-mono text-xs text-slate-500">INITIALIZING...</div>;

  return (
    <div className="min-h-screen bg-slate-950">
      <GlobalStyles />
      <Navbar user={user} setView={setView} currentView={view} />
      
      {view === 'landing' && (
        <div className="w-full">
          <header className="text-center py-20 px-6">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">Connect to MikroTik <br /><span className="text-blue-500">Anywhere.</span></h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-10">Professional standard for WinBox and SSH remote access. Zero-config deployment secured by SwiftNET cloud.</p>
            <button onClick={() => setView('auth')} className="btn-main" style={{ width: 'auto', padding: '16px 40px' }}>Access Console</button>
          </header>

          <div className="grid-container">
            {pricing.map((plan, i) => (
              <div key={i} className="pricing-card">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="price-text">₱{plan.price}<span className="text-slate-500 text-sm font-normal"> / {plan.duration}</span></div>
                <ul>
                  {plan.features.map((f, j) => (
                    <li key={j}><CheckCircle2 className="w-4 h-4 text-blue-500" /> {f}</li>
                  ))}
                </ul>
                <button onClick={() => setView('auth')} className="btn-main">Select Plan</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'auth' && <AuthPage />}
      {view === 'dashboard' && <Dashboard user={user} services={services} onAddService={handleAdd} onDeleteService={handleDelete} />}
    </div>
  );
}