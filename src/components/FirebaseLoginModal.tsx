import React, { useState, useEffect } from 'react';
import { 
  auth, 
  googleProvider, 
  isRealFirebaseConfigured, 
  currentFirebaseConfig, 
  saveCustomFirebaseConfig, 
  clearCustomFirebaseConfig,
  FirebaseConfigKeys
} from '../config/firebase';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  X, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Lock, 
  Sparkles, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  Settings, 
  KeyRound, 
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FirebaseLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseLoginModal: React.FC<FirebaseLoginModalProps> = ({
  isOpen,
  onClose
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authTab, setAuthTab] = useState<'phone' | 'email' | 'config'>('phone');
  
  // Phone Auth State
  const [phoneNumber, setPhoneNumber] = useState('+919822012345');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  
  // Email Auth State
  const [email, setEmail] = useState('farmer@krishicopilot.in');
  const [password, setPassword] = useState('kisan@123456');
  const [isRegisteringEmail, setIsRegisteringEmail] = useState(false);

  // Status & Error handling
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Custom Firebase Keys Editor
  const [customApiKey, setCustomApiKey] = useState(currentFirebaseConfig.apiKey);
  const [customAuthDomain, setCustomAuthDomain] = useState(currentFirebaseConfig.authDomain);
  const [customProjectId, setCustomProjectId] = useState(currentFirebaseConfig.projectId);
  const [customAppId, setCustomAppId] = useState(currentFirebaseConfig.appId);

  // Listen to live Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Initialize invisible Recaptcha for Phone Auth
  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      try {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'firebase-recaptcha-container', {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA solved
          },
          'expired-callback': () => {
            setErrorMessage('reCAPTCHA expired. Please try again.');
          }
        });
      } catch (e) {
        console.error('reCAPTCHA setup error', e);
      }
    }
  };

  // 1. Send Real SMS via Firebase Phone Auth
  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);
    setIsLoading(true);

    try {
      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;

      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(result);
      setStatusMessage(`✓ Firebase SMS OTP dispatched to ${formattedPhone}! Check your phone.`);
      setIsLoading(false);
    } catch (error: any) {
      console.error('Firebase Phone Auth Error:', error);
      setIsLoading(false);
      
      if (!isRealFirebaseConfigured()) {
        setErrorMessage(
          `⚠️ Firebase is running in Demo Mode. To send SMS to your real SIM, click "⚙️ Firebase Keys" tab and enter your Firebase API Key, or test with Email/Password!`
        );
      } else {
        setErrorMessage(error.message || 'Failed to send SMS via Firebase.');
      }
    }
  };

  // 2. Verify Phone SMS OTP via Firebase
  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) return;

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const userCredential = await confirmationResult.confirm(phoneOtp);
      setCurrentUser(userCredential.user);
      setIsLoading(false);
      setStatusMessage('✓ Successfully Verified & Logged in via Firebase Phone Auth!');
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch (error: any) {
      setIsLoading(false);
      setErrorMessage(error.message || 'Invalid Firebase OTP code.');
    }
  };

  // 3. Email & Password Auth via Firebase
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);
    setIsLoading(true);

    try {
      let userCredential;
      if (isRegisteringEmail) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        setStatusMessage('✓ Firebase account created successfully!');
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        setStatusMessage('✓ Logged in successfully with Firebase Email!');
      }

      setCurrentUser(userCredential.user);
      setIsLoading(false);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch (error: any) {
      setIsLoading(false);
      setErrorMessage(error.message || 'Firebase Email authentication failed.');
    }
  };

  // 4. Google OAuth Sign-in via Firebase
  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setStatusMessage(null);
    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      setCurrentUser(result.user);
      setIsLoading(false);
      setStatusMessage(`✓ Signed in with Google as ${result.user.displayName || result.user.email}!`);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch (error: any) {
      setIsLoading(false);
      setErrorMessage(error.message || 'Google Sign-in failed.');
    }
  };

  // 5. Firebase Sign Out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setConfirmationResult(null);
      setStatusMessage('Logged out of Firebase.');
    } catch (error: any) {
      setErrorMessage('Failed to sign out.');
    }
  };

  // 6. Save Custom Firebase Project Keys
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const newConfig: FirebaseConfigKeys = {
      apiKey: customApiKey.trim(),
      authDomain: customAuthDomain.trim(),
      projectId: customProjectId.trim(),
      storageBucket: `${customProjectId.trim()}.appspot.com`,
      messagingSenderId: "123456789012",
      appId: customAppId.trim() || "1:123456789012:web:abcdef"
    };

    saveCustomFirebaseConfig(newConfig);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white">
        
        {/* Invisible Recaptcha Anchor */}
        <div id="firebase-recaptcha-container"></div>

        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border-b border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 text-xl font-bold">
              🔥
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-base text-white">Real Firebase Authentication</h3>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80 font-medium">
                Official Google Firebase Phone SMS & Email Verification
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live User Session Card (If Logged in) */}
        {currentUser ? (
          <div className="p-5 space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Firebase Session Verified (Active)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">UID: {currentUser.uid.substring(0, 8)}...</span>
              </div>

              <div className="space-y-1 text-sm font-bold text-white">
                <div>Phone: <span className="font-mono text-emerald-300">{currentUser.phoneNumber || 'Not linked'}</span></div>
                <div>Email: <span className="font-mono text-emerald-300">{currentUser.email || 'Not linked'}</span></div>
                <div>Display Name: <span className="text-white">{currentUser.displayName || 'Verified Kisan User'}</span></div>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full py-2.5 rounded-xl bg-red-900/80 hover:bg-red-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out from Firebase</span>
            </button>
          </div>
        ) : (
          /* Login Tabs: Phone vs Email vs Project Keys */
          <div className="p-5 overflow-y-auto space-y-4">
            
            {/* Tabs */}
            <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-black">
              <button
                type="button"
                onClick={() => {
                  setAuthTab('phone');
                  setErrorMessage(null);
                }}
                className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition-all ${
                  authTab === 'phone' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Phone SMS</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthTab('email');
                  setErrorMessage(null);
                }}
                className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition-all ${
                  authTab === 'email' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email/Pass</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthTab('config');
                  setErrorMessage(null);
                }}
                className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition-all ${
                  authTab === 'config' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Firebase Keys</span>
              </button>
            </div>

            {/* TAB 1: Real Phone SMS Auth */}
            {authTab === 'phone' && (
              <div className="space-y-3.5 text-xs">
                <form onSubmit={confirmationResult ? handleVerifyPhoneOtp : handleSendPhoneOtp} className="space-y-3">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">
                      Mobile Number (with +91 Country Code):
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98220 12345"
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl font-mono font-bold text-white"
                      required
                    />
                  </div>

                  {confirmationResult && (
                    <div className="space-y-1 animate-in fade-in">
                      <label className="font-bold text-slate-300 block">
                        6-Digit Firebase SMS Code received on phone:
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={phoneOtp}
                        onChange={(e) => setPhoneOtp(e.target.value)}
                        placeholder="123456"
                        className="w-full p-2.5 bg-slate-950 border border-amber-500 rounded-xl font-mono font-black text-center text-lg text-amber-300 tracking-widest"
                        required
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <span className="animate-pulse">Connecting to Firebase...</span>
                    ) : confirmationResult ? (
                      <>
                        <span>Verify Firebase SMS Code</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <Phone className="w-4 h-4" />
                        <span>Send Real Firebase SMS OTP</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: Email & Password Auth */}
            {authTab === 'email' && (
              <div className="space-y-3.5 text-xs">
                <form onSubmit={handleEmailAuth} className="space-y-3">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Email Address:</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl font-bold text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Password:</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl font-bold text-white"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{isRegisteringEmail ? 'Already have an account?' : 'New to Firebase?'}</span>
                    <button
                      type="button"
                      onClick={() => setIsRegisteringEmail(!isRegisteringEmail)}
                      className="text-emerald-400 font-bold underline"
                    >
                      {isRegisteringEmail ? 'Switch to Sign In' : 'Create New Account'}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{isRegisteringEmail ? 'Register New Firebase Account' : 'Sign In with Firebase Email'}</span>
                  </button>
                </form>

                {/* Google Sign-in Alternative */}
                <div className="pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs shadow flex items-center justify-center gap-2"
                  >
                    <span>🌐 Sign in with Google Popup</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: Custom Firebase Keys Setup */}
            {authTab === 'config' && (
              <form onSubmit={handleSaveConfig} className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <div className="font-bold text-amber-400 flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5" />
                    Connect Your Own Firebase Project:
                  </div>
                  <p>
                    Paste your credentials from <strong>Firebase Console $\to$ Project Settings $\to$ Web App</strong>:
                  </p>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">API Key (apiKey):</label>
                  <input
                    type="text"
                    value={customApiKey}
                    onChange={(e) => setCustomApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl font-mono text-white text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Project ID:</label>
                    <input
                      type="text"
                      value={customProjectId}
                      onChange={(e) => setCustomProjectId(e.target.value)}
                      placeholder="krishi-copilot"
                      className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl font-mono text-white text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Auth Domain:</label>
                    <input
                      type="text"
                      value={customAuthDomain}
                      onChange={(e) => setCustomAuthDomain(e.target.value)}
                      placeholder="krishi.firebaseapp.com"
                      className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl font-mono text-white text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow"
                  >
                    Save & Connect Firebase
                  </button>
                  <button
                    type="button"
                    onClick={clearCustomFirebaseConfig}
                    className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                  >
                    Reset Defaults
                  </button>
                </div>
              </form>
            )}

            {/* Status & Error Messages */}
            {statusMessage && (
              <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/90 border border-red-500/50 text-red-300 text-xs font-bold flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

          </div>
        )}

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Google Cloud Firebase SDK v10+
          </span>
          <a
            href="https://console.firebase.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:underline flex items-center gap-0.5"
          >
            <span>Firebase Console</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>

      </div>
    </div>
  );
};
