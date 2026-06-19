import React, { useState } from 'react';
import { User, Calendar, Sparkles, Mail, Lock, Phone, ArrowRight, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  onClose?: () => void;
  registeredUsers: any[];
  onAddNewUser: (newUser: any) => void;
}

export default function AuthScreen({
  onLoginSuccess,
  onClose,
  registeredUsers,
  onAddNewUser,
}: AuthScreenProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register fields
  const [regName, setRegName] = useState('');
  const [regBirthdate, setRegBirthdate] = useState('');
  const [regGender, setRegGender] = useState('ชาย');
  const [regIdentifier, setRegIdentifier] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginIdentifier.trim()) {
      setLoginError('กรุณาใส่เบอร์โทรศัพท์หรืออีเมล');
      return;
    }
    if (!loginPassword) {
      setLoginError('กรุณาใส่รหัสผ่าน');
      return;
    }

    // Lookup user in credentials list
    const foundUser = registeredUsers.find(
      (u) =>
        (u.emailOrTel.toLowerCase() === loginIdentifier.toLowerCase().trim() ||
         (u.email && u.email.toLowerCase() === loginIdentifier.toLowerCase().trim()) ||
         (u.tel && u.tel.replace(/-/g, '') === loginIdentifier.replace(/-/g, '').trim())) &&
        u.password === loginPassword
    );

    if (foundUser) {
      // Map to UserProfile
      const userProfile: UserProfile = {
        username: foundUser.username,
        tel: foundUser.tel || (foundUser.emailOrTel.match(/^\d+$/) ? foundUser.emailOrTel : '081-345-6789'),
        gender: foundUser.gender || 'ชาย',
        birthdate: foundUser.birthdate || '1998-10-15',
        email: foundUser.email || (foundUser.emailOrTel.includes('@') ? foundUser.emailOrTel : 'user@paopao.com'),
        avatarUrl: foundUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      };
      
      onLoginSuccess(userProfile);
    } else {
      setLoginError('เบอร์โทรศัพท์/อีเมล หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim()) {
      setRegError('กรุณาระบุชื่อ-นามสกุลของคุณ');
      return;
    }
    if (!regBirthdate) {
      setRegError('กรุณาระบุวันเดือนปีเกิด');
      return;
    }
    if (!regIdentifier.trim()) {
      setRegError('กรุณาระบุเบอร์โทรศัพท์หรืออีเมล');
      return;
    }
    if (regPassword.length < 8) {
      setRegError('รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษรขึ้นไป');
      return;
    }

    // Check if user already exists
    const userExists = registeredUsers.some(
      (u) => u.emailOrTel.toLowerCase() === regIdentifier.toLowerCase().trim()
    );

    if (userExists) {
      setRegError('เบอร์โทรศัพท์หรืออีเมลนี้ถูกใช้งานแล้วในระบบ');
      return;
    }

    // Set a default high-quality avatar based on gender selection
    let defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80';
    if (regGender === 'หญิง') {
      defaultAvatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80';
    } else if (regGender === 'ชาย') {
      defaultAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80';
    }

    // Create new registered user
    const newUser = {
      username: regName,
      birthdate: regBirthdate,
      gender: regGender,
      emailOrTel: regIdentifier.trim(),
      email: regIdentifier.includes('@') ? regIdentifier.trim() : `${regName.replace(/\s+/g, '').toLowerCase()}@paopao.com`,
      tel: !regIdentifier.includes('@') ? regIdentifier.trim() : '081-000-0000',
      password: regPassword,
      avatarUrl: defaultAvatar,
    };

    onAddNewUser(newUser);
    setRegSuccess(true);
    
    // Automatically transition to login or log the user in after 1.5 seconds
    setTimeout(() => {
      onLoginSuccess({
        username: newUser.username,
        tel: newUser.tel,
        gender: newUser.gender,
        birthdate: newUser.birthdate,
        email: newUser.email,
        avatarUrl: newUser.avatarUrl,
      });
      setRegSuccess(false);
      // Reset fields
      setRegName('');
      setRegBirthdate('');
      setRegGender('ชาย');
      setRegIdentifier('');
      setRegPassword('');
    }, 1500);
  };

  const handleQuickTestLogin = (userReg: any) => {
    setLoginIdentifier(userReg.emailOrTel);
    setLoginPassword(userReg.password);
  };

  return (
    <div className="w-full max-w-md mx-auto my-6 bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden animate-fade-in" id="auth-panel-window">
      {/* Luxury branding header */}
      <div className="bg-gradient-to-tr from-brand-purple via-purple-950 to-brand-purple-dark p-8 pb-10 text-center relative">
        <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-brand-purple via-brand-orange to-brand-gold" />
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-brand-purple to-brand-orange flex items-center justify-center mx-auto shadow-lg border border-purple-400/20 mb-3">
          <span className="text-white text-2xl font-serif font-bold tracking-tighter">P</span>
        </div>
        <h2 className="text-2xl font-serif font-medium text-brand-gold tracking-wide">สมาคมพาสปอร์ตสมาชิกหรู</h2>
        <p className="text-stone-300 text-xs mt-1 font-sans">paopao Premium Consignment Alliance</p>
      </div>

      {/* Tabs segment */}
      <div className="flex border-b border-stone-100 bg-stone-50/50" id="auth-tabs">
        <button
          onClick={() => {
            setActiveTab('login');
            setLoginError('');
            setRegError('');
          }}
          className={`flex-1 py-4 text-center text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer border-b-2 ${
            activeTab === 'login'
              ? 'border-brand-purple text-brand-purple bg-white font-bold'
              : 'border-transparent text-stone-500 hover:text-stone-700 hover:bg-stone-100/30'
          }`}
          id="tab-login"
        >
          เข้าสู่ระบบ (Sign In)
        </button>
        <button
          onClick={() => {
            setActiveTab('register');
            setLoginError('');
            setRegError('');
          }}
          className={`flex-1 py-4 text-center text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer border-b-2 ${
            activeTab === 'register'
              ? 'border-brand-purple text-brand-purple bg-white font-bold'
              : 'border-transparent text-stone-500 hover:text-stone-700 hover:bg-stone-100/30'
          }`}
          id="tab-register"
        >
          สมัครสมาชิกใหม่ (Sign Up)
        </button>
      </div>

      {/* Content Form container */}
      <div className="p-6 sm:p-8">
        {activeTab === 'login' ? (
          /* ================= LOGIN FORM ================= */
          <form onSubmit={handleLoginSubmit} className="space-y-5" id="form-login-fields">
            {loginError && (
              <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs flex items-start gap-2 animate-shake">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-stone-500 text-xs font-semibold mb-1">เบอร์โทรศัพท์ หรือ อีเมล</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail size={16} />
                </span>
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="เช่น 081-345-6789 หรือ collector@paopao.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/10 text-stone-800"
                  id="login-identifier-input"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-stone-500 text-xs font-semibold mb-1">รหัสผ่านยืนยันตน</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock size={16} />
                </span>
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="รหัสผ่านบัญชีของคุณ..."
                  className="w-full pl-10 pr-10 py-2.5 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/10 text-stone-800"
                  id="login-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-2 bg-brand-purple hover:bg-brand-purple-dark text-white rounded-xl text-xs sm:text-sm font-semibold tracking-wide cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-md shadow-brand-purple/10 border-0"
              id="btn-login-submit"
            >
              <span>เข้าสู่ระบบบูติก</span>
              <ArrowRight size={16} className="text-brand-gold animate-pulse" />
            </button>

            {/* Quick test convenience bank */}
            <div className="pt-4 border-t border-stone-100" id="quick-presets">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-2">บัญชีทดลองล็อกอิน (คลิกเพื่อจัดใส่ได้ทันที)</span>
              <div className="space-y-1.5">
                {registeredUsers.map((u, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleQuickTestLogin(u)}
                    className="w-full text-left p-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg text-stone-600 text-[11px] transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <span className="font-semibold text-stone-800">{u.username.split(' ')[0]}</span>
                      <span className="text-stone-400 ml-1">({u.emailOrTel})</span>
                    </div>
                    <span className="text-[9px] font-bold text-brand-purple font-mono bg-purple-150-dark px-1.5 py-0.5 rounded-sm">รหัส: {u.password}</span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        ) : (
          /* ================= REGISTER FORM ================= */
          <form onSubmit={handleRegisterSubmit} className="space-y-4" id="form-register-fields">
            {regError && (
              <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs flex items-start gap-2 animate-shake">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{regError}</span>
              </div>
            )}

            {regSuccess ? (
              <div className="p-8 text-center space-y-3 bg-emerald-50/60 border border-emerald-100 rounded-2xl animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-150-dark text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle size={24} />
                </div>
                <h4 className="text-emerald-900 font-semibold text-sm">ยินดีต้อนรับสมาชิกใหม่สำเร็จ!</h4>
                <p className="text-xs text-emerald-700">กำลังสถาปนาเข้าสู่ระบบสมาคม paopao ในครู่เดียว...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 space-y-1">
                    <label className="block text-stone-500 text-xs font-semibold">ชื่อจริง-นามสกุลของคุณ</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <User size={15} />
                      </span>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="ชื่อจริง และนามสกุลสะกดพรีเมียม"
                        className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:border-brand-purple text-stone-800"
                        id="reg-name-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-stone-500 text-xs font-semibold">วันเดือนปีเกิด</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <Calendar size={15} />
                      </span>
                      <input
                        type="date"
                        required
                        value={regBirthdate}
                        onChange={(e) => setRegBirthdate(e.target.value)}
                        className="w-full pl-9 pr-2 py-2 border border-stone-200 rounded-xl text-[11px] focus:outline-hidden focus:border-brand-purple text-stone-800"
                        id="reg-birthdate-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-stone-500 text-xs font-semibold">ระบุเพศ</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <Sparkles size={14} />
                      </span>
                      <select
                        value={regGender}
                        onChange={(e) => setRegGender(e.target.value)}
                        className="w-full pl-9 pr-2 py-2 border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:border-brand-purple bg-white text-stone-800"
                        id="reg-gender-select"
                      >
                        <option value="ชาย">ชาย</option>
                        <option value="หญิง">หญิง</option>
                        <option value="อื่นๆ">อื่นๆ</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-stone-500 text-xs font-semibold">เบอร์โทรศัพท์ หรือ อีเมล</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Mail size={15} />
                    </span>
                    <input
                      type="text"
                      required
                      value={regIdentifier}
                      onChange={(e) => setRegIdentifier(e.target.value)}
                      placeholder="เช่น 081-345-6789 หรือ name@domain.com"
                      className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:border-brand-purple text-stone-800"
                      id="reg-identifier-input"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <label className="block text-stone-500 text-xs font-semibold">รหัสผ่านบัญชีปวงทอง</label>
                    <span className={`text-[9px] font-bold ${regPassword.length >= 8 ? 'text-emerald-600' : 'text-stone-400'}`}>
                      {regPassword.length}/8 ตัวอักษรขึ้นไป
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Lock size={15} />
                    </span>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="พิมพ์รหัสผ่านอย่างน้อย 8 ตัวอักษรขึ้นไป"
                      className="w-full pl-10 pr-10 py-2 border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:border-brand-purple text-stone-800"
                      id="reg-password-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
                    >
                      {showRegPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <p className="text-[10px] text-stone-400 italic">
                    * ทางสมาคมปกป้องข้อมูลรหัสผ่านและการเคลมลิขสิทธิ์ความปลอดภัยสูงสุด
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 mt-3 bg-brand-orange hover:bg-brand-orange-dark text-white rounded-xl text-xs font-bold tracking-wide cursor-pointer transition-all flex items-center justify-center gap-1.5 border-0 shadow-xs"
                  id="btn-register-submit"
                >
                  <span>ส่งสาสน์ลงชื่อสมัครสมาชิก</span>
                  <ArrowRight size={15} />
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
