import React, { useState } from 'react';
import { UserProfile, ReceiverInfo, Product } from '../types';
import { User, MapPin, Store, Check, Plus, ArrowRight, Upload, Phone, Shield, Edit2, Clock, CheckCircle2, CheckSquare } from 'lucide-react';

interface ProfileDashboardProps {
  // Profile settings
  userProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onLogout?: () => void;
  
  // Terminal Address
  deliveryAddress: ReceiverInfo;
  onSaveAddress: (address: ReceiverInfo) => void;
  
  // Registration Seller States
  isRegisteredSeller: boolean;
  onRegisterSeller: (realName: string, realSurname: string) => void;
  
  // Adding Custom goods
  onSubmitProduct: (productData: Omit<Product, 'id' | 'shopId' | 'shopName' | 'ratings' | 'salesCount' | 'rating' | 'isApproved'>) => void;
  customProducts: Product[];
  onApproveProductByAdmin: (productId: string) => void; // Admin action simulator!
  
  // Help contact
  onOpenChat: () => void;
}

const TEMPLATE_IMAGES = [
  { name: 'Gucci Horsebit Shoulder Bag (Vintage)', url: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=600&auto=format&fit=crop&q=80', cat: 'Bags & Accessories' },
  { name: 'Omega Seamaster Vintage Watch', url: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&auto=format&fit=crop&q=80', cat: 'Watches' },
  { name: 'Premium Ruby Gold Vintage Ring', url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80', cat: 'Jewelry' },
  { name: 'Ultra Suede Premium Bomber Jacket', url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80', cat: 'Sneakers & Streetwear' },
];

export default function ProfileDashboard({
  userProfile,
  onSaveProfile,
  onLogout,
  deliveryAddress,
  onSaveAddress,
  isRegisteredSeller,
  onRegisterSeller,
  onSubmitProduct,
  customProducts,
  onApproveProductByAdmin,
  onOpenChat,
}: ProfileDashboardProps) {
  // 1. User Editable States
  const [username, setUsername] = useState(userProfile.username);
  const [tel, setTel] = useState(userProfile.tel);
  const [gender, setGender] = useState(userProfile.gender);
  const [birthdate, setBirthdate] = useState(userProfile.birthdate);
  const [email, setEmail] = useState(userProfile.email);
  const [avatarUrl, setAvatarUrl] = useState(userProfile.avatarUrl);
  const [isProfileSaved, setIsProfileSaved] = useState(false);

  // Sync state when userProfile prop changes
  React.useEffect(() => {
    setUsername(userProfile.username || '');
    setTel(userProfile.tel || '');
    setGender(userProfile.gender || 'ชาย');
    setBirthdate(userProfile.birthdate || '');
    setEmail(userProfile.email || '');
    setAvatarUrl(userProfile.avatarUrl || '');
  }, [userProfile]);

  const handleProfileImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 2. Address states
  const [recName, setRecName] = useState(deliveryAddress.name);
  const [recTel, setRecTel] = useState(deliveryAddress.tel);
  const [recAddress, setRecAddress] = useState(deliveryAddress.address);
  const [recPost, setRecPost] = useState(deliveryAddress.postalCode);
  const [isAddressSaved, setIsAddressSaved] = useState(false);

  // 3. Register Merchant states
  const [realName, setRealName] = useState('');
  const [realSurname, setRealSurname] = useState('');
  const [registrationError, setRegistrationError] = useState('');

  // 4. Custom product registration form states
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState<number>(0);
  const [prodCategory, setProdCategory] = useState('Bags & Accessories');
  const [prodSizeString, setProdSizeString] = useState('Small, Medium, Large');
  const [prodImageUrl, setProdImageUrl] = useState(TEMPLATE_IMAGES[0].url);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Handlers
  const handleSaveProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({ username, tel, gender, birthdate, email, avatarUrl });
    setIsProfileSaved(true);
    setTimeout(() => setIsProfileSaved(false), 2000);
  };

  const handleSaveAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveAddress({ name: recName, tel: recTel, address: recAddress, postalCode: recPost });
    setIsAddressSaved(true);
    setTimeout(() => setIsAddressSaved(false), 2000);
  };

  const handleRegisterSellerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!realName.trim() || !realSurname.trim()) {
      setRegistrationError('โปรดระบุ ชื่อและนามสกุลจริงให้ครบถ้วนก่อนลงทะเบียน');
      return;
    }
    setRegistrationError('');
    onRegisterSeller(realName, realSurname);
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !prodDesc.trim() || prodPrice <= 0) {
      alert('โปรดระบุข้อจำกัดข้อมูลสินค้า และราคาที่มากกว่า 0');
      return;
    }

    const sizesArray = prodSizeString.split(',').map((s) => s.trim()).filter((s) => s !== '');

    onSubmitProduct({
      name: prodName,
      description: prodDesc,
      price: prodPrice,
      image: prodImageUrl,
      category: prodCategory,
      sizes: sizesArray.length > 0 ? sizesArray : ['Standard size'],
    });

    setUploadSuccess(true);
    // Reset inputs
    setProdName('');
    setProdDesc('');
    setProdPrice(0);
    setTimeout(() => setUploadSuccess(false), 2500);
  };

  const handleSelectTemplateImage = (item: typeof TEMPLATE_IMAGES[0]) => {
    setProdImageUrl(item.url);
    setProdName(item.name);
    setProdCategory(item.cat);
  };

  return (
    <div className="space-y-10 my-1" id="profile-dashboard-layout">
      
      {/* 2-Column top workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Hand: Profile edit fields & delivery destination */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* User profile details editor */}
          <div className="bg-white rounded-2xl border border-stone-200/60 p-6 shadow-xs" id="profile-info-card">
            <div className="flex justify-between items-center pb-3.5 mb-5 border-b border-stone-100" id="profile-heading-wrapper">
              <h3 className="text-stone-900 font-display font-semibold text-sm flex items-center gap-2">
                <User size={16} className="text-brand-purple" />
                <span>ข้อมูลโปรไฟล์ของฉัน (แก้ไขข้อมูลจริง)</span>
              </h3>
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1"
                  id="btn-logout-luxury"
                >
                  ออกจากระบบ
                </button>
              )}
            </div>

            <form onSubmit={handleSaveProfileSubmit} className="space-y-4">
              
              {/* Profile Avatar custom selection row with Device drag/drop click selection */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pb-4 bg-stone-50/50 p-4 rounded-xl border border-stone-150" id="avatar-uploader-row">
                <div className="relative group/avatar cursor-pointer">
                  <img 
                    src={avatarUrl} 
                    alt={username} 
                    className="w-16 h-16 rounded-full object-cover border-2 border-brand-purple/40 shadow-sm shrink-0 bg-stone-100 transition-all duration-300 group-hover/avatar:ring-2 group-hover/avatar:ring-brand-purple"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                    <Upload size={14} className="text-white" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer rounded-full"
                    id="avatar-hidden-file-input"
                  />
                </div>
                
                <div className="flex-1 w-full space-y-2">
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <label className="block text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                      รูปโปรไฟล์พรีเมียม (ดึงสติ๊กเกอร์จากเครื่อง หรือใส่ลิงก์)
                    </label>
                    <label className="text-[10px] font-bold text-brand-purple hover:text-brand-purple-dark hover:underline flex items-center gap-1 cursor-pointer">
                      <Upload size={12} />
                      <span>ดึงรูปภาพจากเครื่อง/ไฟล์</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleProfileImageFileChange} 
                        className="hidden" 
                        id="avatar-direct-file-input"
                      />
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="ป้อน URL รูปโปรไฟล์ของท่าน..."
                      className="flex-1 px-3 py-1.5 rounded-lg border border-stone-250 text-xs focus:outline-hidden focus:ring-1 focus:ring-brand-purple/20 text-gray-800"
                    />
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80')}
                      className="px-3 py-1.5 bg-stone-100 border border-stone-200 rounded-lg text-xs hover:bg-stone-200 transition-colors text-stone-600 font-medium cursor-pointer"
                    >
                      สุ่มชาย
                    </button>
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80')}
                      className="px-3 py-1.5 bg-stone-100 border border-stone-200 rounded-lg text-xs hover:bg-stone-200 transition-colors text-stone-600 font-medium cursor-pointer"
                    >
                      สุ่มหญิง
                    </button>
                  </div>
                </div>
              </div>

              {/* Editable Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-500 text-xs font-medium mb-1">ชื่อสลักแผง / Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-hidden focus:border-brand-purple text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-stone-500 text-xs font-medium mb-1">เบอร์โทรศัพท์ติดต่อ</label>
                  <input
                    type="text"
                    required
                    value={tel}
                    onChange={(e) => setTel(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-hidden focus:border-brand-purple text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-stone-500 text-xs font-medium mb-1">ระบุเพศ</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-hidden focus:border-brand-purple text-gray-800 bg-white"
                  >
                    <option value="ชาย">ชาย</option>
                    <option value="หญิง">หญิง</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-500 text-xs font-medium mb-1">วัน/เดือน/ปีเกิด</label>
                  <input
                    type="date"
                    required
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-hidden focus:border-brand-purple text-gray-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-500 text-xs font-medium mb-1">อีเมลผู้ถือบัญชี</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-hidden focus:border-brand-purple text-gray-800"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-purple text-white rounded-lg text-xs font-semibold hover:bg-brand-purple-dark text-white cursor-pointer transition-all flex items-center gap-1"
                >
                  {isProfileSaved ? (
                    <>
                      <Check size={14} className="text-brand-gold" />
                      <span>บันทึกประวัติเกียรติยศสำเร็จ!</span>
                    </>
                  ) : (
                    <span>บันทึกข้อมูลสมาชิก</span>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Delivery Destination quick memory bank editing */}
          <div className="bg-white rounded-2xl border border-stone-200/60 p-6 shadow-xs" id="delivery-address-form-profile">
            <h3 className="text-stone-900 font-display font-semibold text-sm flex items-center gap-2 pb-3.5 mb-5 border-b border-stone-100">
              <MapPin size={16} className="text-brand-orange" />
              <span>ที่อยู่จัดส่งพัสดุหลักประจำตัว</span>
            </h3>

            <form onSubmit={handleSaveAddressSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-500 text-xs font-medium mb-1">ชื่อจริงผู้รับปลายทาง</label>
                  <input
                    type="text"
                    required
                    value={recName}
                    onChange={(e) => setRecName(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-hidden focus:border-brand-purple text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-stone-500 text-xs font-medium mb-1">เบอร์ผู้รับปลายทาง</label>
                  <input
                    type="text"
                    required
                    value={recTel}
                    onChange={(e) => setRecTel(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-hidden focus:border-brand-purple text-gray-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-500 text-xs font-medium mb-1">ที่อยู่ชัดเจน</label>
                  <textarea
                    required
                    rows={2}
                    value={recAddress}
                    onChange={(e) => setRecAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-hidden focus:border-brand-purple text-gray-800 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-500 text-xs font-medium mb-1">รหัสไปรษณีย์</label>
                  <input
                    type="text"
                    required
                    value={recPost}
                    onChange={(e) => setRecPost(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-hidden focus:border-brand-purple text-gray-800"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1"
                >
                  {isAddressSaved ? (
                    <>
                      <Check size={14} className="text-brand-orange" />
                      <span>บันทึกที่อยู่ด่วนสำเร็จ!</span>
                    </>
                  ) : (
                    <span>บันทึกที่อยู่จัดส่ง</span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Quick Support Admin direct chat room portal widget */}
          <div className="bg-brand-purple-light/50 border border-purple-200/60 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h4 className="text-brand-purple font-display font-semibold text-sm">ต้องการความช่วยเหลือด่วน?</h4>
              <p className="text-stone-500 text-xs">
                แชตตรงกับทีมงานแอดมิน แพลตฟอร์ม paopao ได้ทันทีแบบ Real-time ตลอด 24 ชม.
              </p>
            </div>
            <button
              onClick={onOpenChat}
              className="px-5 py-2.5 bg-brand-purple hover:bg-brand-purple-dark text-white rounded-full text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
            >
              ติดต่อข้อความแอดมิน
            </button>
          </div>

        </div>

        {/* Right Hand: MERCHANT PLATFORM (เปิดระบบจัดส่งร้านค้า & เพิ่มสินค้าฝากขาย) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Open Shop Registration Module */}
          <div className="bg-white rounded-2xl border border-stone-200/60 p-6 shadow-xs relative overflow-hidden" id="seller-open-shop-card">
            
            {/* Top gold banner badge for aesthetics */}
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-brand-purple via-brand-orange to-brand-gold" />

            {!isRegisteredSeller ? (
              // Case: NOT registered seller yet
              <div className="space-y-5 pt-1">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-50 rounded-lg text-brand-purple">
                    <Store size={20} />
                  </div>
                  <div>
                    <h3 className="text-stone-900 font-display font-bold text-sm">สมัครเปิดร้านฝากขาย (C2C/B2C)</h3>
                    <p className="text-[11px] text-brand-orange uppercase font-extrabold tracking-widest mt-0.5">paopao consignment merchant</p>
                  </div>
                </div>

                <p className="text-stone-500 text-xs leading-relaxed">
                  เปลี่ยนสิ่งของแบรนด์เนมจำกัดจำนวน สินค้าดีไซเนอร์ หรือคลังสะสมของท่านให้เป็นทุน ลงทะเบียนง่ายๆ 
                  ใช้เวลาไม่เกิน 10 วินาทีเพื่อเปิดใช้งานแถบผู้ขายสินค้า
                </p>

                <form onSubmit={handleRegisterSellerSubmit} className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-500 text-[10px] uppercase font-bold tracking-wider mb-1">ชื่อจริงตามบัตร</label>
                      <input
                        type="text"
                        required
                        value={realName}
                        onChange={(e) => setRealName(e.target.value)}
                        placeholder="กรอกชื่อจริง..."
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-hidden text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-500 text-[10px] uppercase font-bold tracking-wider mb-1">นามสกุลจริง</label>
                      <input
                        type="text"
                        required
                        value={realSurname}
                        onChange={(e) => setRealSurname(e.target.value)}
                        placeholder="กรอกนามสกุลจริง..."
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-hidden text-gray-800"
                      />
                    </div>
                  </div>

                  {registrationError && (
                    <p className="text-xs text-rose-500">{registrationError}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>ยืนยันสลักสัญญาเปิดแผง</span>
                    <ArrowRight size={14} className="text-brand-gold" />
                  </button>
                </form>
              </div>
            ) : (
              // Case: IS ALREADY REGISTERED SELLER
              <div className="space-y-6 pt-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                      <Store size={20} />
                    </div>
                    <div>
                      <h3 className="text-stone-900 font-display font-bold text-sm">ระบบบูติกร้านฝากของคุณ</h3>
                      <p className="text-[10px] text-emerald-700 font-mono font-bold uppercase tracking-wider">Seller privilege active</p>
                    </div>
                  </div>

                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                </div>

                <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100 flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-emerald-800 leading-snug">
                    การลงชื่อสมัครเสร็จสิ้น! บัญชีผู้ขายของคุณ: <strong>{realName || userProfile.username} Boutique</strong> สหภาพร่วมรับสินค้าพร้อมเปิดใช้งาน
                  </div>
                </div>

                {/* Submitting products Form */}
                <div className="pt-2 border-t border-stone-100">
                  <h4 className="text-stone-900 font-display font-semibold text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <Plus size={14} className="text-brand-orange" />
                    <span>ยื่นส่งเพิ่มสินค้าฝากขายชิ้นใหม่</span>
                  </h4>

                  {/* Preloaded Template selection box to facilitate testing */}
                  <div className="mb-5 space-y-1.5 bg-stone-50 p-3 rounded-lg border border-stone-200/50">
                    <span className="text-[10px] font-bold text-stone-500 block">เลือกรูปไอเทมตัวสุ่มพรีเมียม (ช่วยให้ทดสอบง่าย):</span>
                    <div className="grid grid-cols-4 gap-2">
                      {TEMPLATE_IMAGES.map((img, i) => (
                        <div
                          key={i}
                          onClick={() => handleSelectTemplateImage(img)}
                          className={`aspect-square rounded-lg overflow-hidden border-2 cursor-pointer hover:border-brand-purple select-none transition-all ${
                            prodImageUrl === img.url ? 'border-brand-purple ring-2 ring-brand-purple-light' : 'border-transparent'
                          }`}
                          title={img.name}
                        >
                          <img src={img.url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleAddProductSubmit} className="space-y-4">
                    <div>
                      <label className="block text-stone-500 text-[10px] font-bold uppercase tracking-wider mb-1">ชื่อสินค้าฝากขาย</label>
                      <input
                        type="text"
                        required
                        value={prodName}
                        onChange={(e) => setProdName(e.target.value)}
                        placeholder="เช่น กระเป๋า Chanel Vintage Black Lambskin..."
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-hidden text-gray-800"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-500 text-[10px] font-bold uppercase tracking-wider mb-1">หมวดหมู่</label>
                        <select
                          value={prodCategory}
                          onChange={(e) => setProdCategory(e.target.value)}
                          className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-hidden bg-white text-gray-800"
                        >
                          <option value="Bags & Accessories">Bags & Accessories</option>
                          <option value="Fragrances">Fragrances</option>
                          <option value="Watches">Watches</option>
                          <option value="Jewelry">Jewelry</option>
                          <option value="Sneakers & Streetwear">Sneakers & Streetwear</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-stone-500 text-[10px] font-bold uppercase tracking-wider mb-1">ระบุราคาขาย (บาท)</label>
                        <input
                          type="number"
                          required
                          value={prodPrice <= 0 ? '' : prodPrice}
                          onChange={(e) => setProdPrice(Number(e.target.value))}
                          placeholder="ระบุตัวเลขราคาสุทธิ..."
                          className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-hidden text-gray-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-500 text-[10px] font-bold uppercase tracking-wider mb-1">ตัวเลือกย่อย / ไซส์ระบุ (คั่นด้วยกิริยาตราจุลภาค , )</label>
                      <input
                        type="text"
                        value={prodSizeString}
                        onChange={(e) => setProdSizeString(e.target.value)}
                        placeholder="Small, Medium, XL (กรองตามจุดประสงค์)"
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-hidden text-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-500 text-[10px] font-bold uppercase tracking-wider mb-1">ลิงก์ภาพภาพสินค้าพัสดุ (หรือคลิกกล่องข้างต้นเพื่อเลือกสุ่มภาพพรีเมียม)</label>
                      <input
                        type="text"
                        required
                        value={prodImageUrl}
                        onChange={(e) => setProdImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-hidden text-gray-800 text-[10px]"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-500 text-[10px] font-bold uppercase tracking-wider mb-1">คำบรรยายสภาพพัสดุและร่องรอยการใช้งาน</label>
                      <textarea
                        required
                        rows={3}
                        value={prodDesc}
                        onChange={(e) => setProdDesc(e.target.value)}
                        placeholder="ระบุรายละเอียดสภาพ อุปกรณ์ที่แถม กล่อง ใบจัดส่งรับรองแท้..."
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-hidden text-gray-800 resize-none"
                      />
                    </div>

                    {uploadSuccess && (
                      <div className="bg-indigo-50 text-indigo-700 text-[11px] p-2.5 rounded-lg border border-indigo-100 font-medium">
                        ✓ ส่งพัสดุฝากขายสำเร็จ! ตอนนี้สินค้าเข้าสถานะ <strong>"รออนุมัติจากแอดมิน"</strong> เรียบร้อยแล้ว
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-brand-orange hover:bg-brand-orange-dark text-white rounded-lg text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer text-center"
                    >
                      ยื่นคำขออนุมัติฝากขายพัสดุ
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>

          {/* Sandbox Admin Simulator Approval Hub (Extreme fidelity addition to verify logic) */}
          <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl shadow-lg text-stone-300" id="admin-sandbox-hub">
            <h4 className="text-white font-display font-semibold text-xs uppercase tracking-widest flex items-center gap-1.5 pb-2.5 mb-4 border-b border-stone-850">
              <Shield size={14} className="text-brand-orange" />
              <span>ศูนย์ควบคุมแอดมิน (Admin approval sandbox)</span>
            </h4>
            
            <p className="text-[11px] text-stone-400 mb-4 leading-relaxed">
              สินค้าพัสดุฝากใหม่จำเป็นต้องได้รับอนุมัติจากแอดมินก่อนจึงจะขึ้นแสดงหน้าร้าน บอร์ดนี้ช่วยให้คุณสามารถจำลองการทำงานเป็นแอดมินเพื่อกดอนุมัติ (Approve) ได้ทันที!
            </p>

            <div className="space-y-3">
              {customProducts.length === 0 ? (
                <div className="text-center py-4 bg-stone-950/50 rounded-lg text-stone-500 text-[10px]">
                  ไม่มีสินค้าที่ผู้ฝากยื่นคำขอเข้ามาในขณะนี้
                </div>
              ) : (
                <div className="max-h-56 overflow-y-auto space-y-2">
                  {customProducts.map((p) => (
                    <div key={p.id} className="p-2.5 bg-stone-950/70 border border-stone-850 rounded-lg flex justify-between items-center gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={p.image} alt="" className="w-8 h-8 object-cover rounded shrink-0 bg-stone-800" />
                        <div className="min-w-0">
                          <p className="text-[11px] text-white font-semibold truncate leading-tight">{p.name}</p>
                          <div className="flex items-center gap-1.5 text-[9px] text-stone-400 mt-0.5">
                            <span>฿{p.price.toLocaleString('th-TH')}</span>
                            <span>•</span>
                            <span>{p.category}</span>
                          </div>
                        </div>
                      </div>

                      {p.isApproved ? (
                        <span className="text-[9px] bg-emerald-900/40 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded-sm shrink-0 flex items-center gap-1 font-semibold">
                          <CheckCircle2 size={10} />
                          <span>อนุมัติแล้ว</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => onApproveProductByAdmin(p.id)}
                          className="px-3 py-1 bg-brand-orange hover:bg-brand-orange-dark text-white text-[10px] font-bold rounded-md transition-all shrink-0 cursor-pointer"
                        >
                          อนุมัติลงขายเลย
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
