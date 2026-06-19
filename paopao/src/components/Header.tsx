import React, { useState } from 'react';
import { Search, ShoppingBag, Bell, MessageSquareCode, User, BadgeCheck, Copy, Check, Menu, X } from 'lucide-react';
import { PROMO_CODES } from '../initialData';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartCount: number;
  unreadNotificationsCount: number;
  openChatWithAdmin: () => void;
  isSellerMode: boolean;
}

export default function Header({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  cartCount,
  unreadNotificationsCount,
  openChatWithAdmin,
  isSellerMode,
}: HeaderProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const tabs = [
    { id: 'marketplace', label: 'หน้าหลักสินค้า', icon: ShoppingBag },
    { id: 'cart', label: 'ตะกร้าของฉัน', icon: ShoppingBag, badge: cartCount },
    { id: 'notifications', label: 'การแจ้งเตือน', icon: Bell, badge: unreadNotificationsCount },
    { id: 'purchases', label: 'การซื้อของฉัน', icon: MessageSquareCode }, // Using MessageSquareCode to symbolize order history
    { id: 'profile', label: 'โปรไฟล์ & ร้านค้า', icon: User, special: isSellerMode },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-xs border-b border-purple-100" id="main-header">
      {/* Top Discount Promo Ribbon Marquee */}
      <div className="bg-gradient-to-r from-brand-purple to-brand-purple-dark text-white py-2 px-4 text-xs font-display flex justify-between items-center overflow-x-auto whitespace-nowrap gap-6 border-b border-brand-orange/20" id="promo-ribbon">
        <div className="flex items-center gap-2 animate-shimmer">
          <span className="bg-brand-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-wider">PREMIUM CODES</span>
          <span>สะสมโค้ดสุดเลอค่าเพื่อรับสิทธิพิเศษวันนี้:</span>
        </div>
        
        <div className="flex items-center gap-4 text-xs">
          {PROMO_CODES.map((promo) => (
            <div key={promo.code} className="flex items-center gap-1.5 bg-white/10 rounded-full pl-2.5 pr-1 py-0.5 hover:bg-white/15 transition-all">
              <span className="font-semibold text-brand-gold">{promo.code}</span>
              <span className="text-white/80 opacity-90 text-[11px]">({promo.label})</span>
              <button 
                onClick={() => handleCopyCode(promo.code)}
                className="p-1 rounded-full bg-brand-orange hover:bg-brand-orange-dark text-white transition-all cursor-pointer"
                title="คัดลอกโค้ด"
              >
                {copiedCode === promo.code ? <Check size={11} className="text-white" /> : <Copy size={11} />}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-4">
          
          {/* Brand Logo (Thai context, high luxury) - Always show now since there is no sidebar */}
          <div 
            className="flex items-center gap-2 cursor-pointer select-none shrink-0" 
            onClick={() => setActiveTab('marketplace')} 
            id="brand-logo"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-purple to-brand-orange flex items-center justify-center shadow-md">
              <span className="text-white text-xl font-display font-bold tracking-tighter">P</span>
            </div>
            <div>
              <span className="text-2xl font-display font-medium bg-gradient-to-r from-brand-purple-dark to-brand-purple bg-clip-text text-transparent font-semibold tracking-wide">
                paopao
              </span>
              <span className="block text-[9px] text-brand-orange uppercase tracking-widest font-bold -mt-1.5">Consignment</span>
            </div>
          </div>

          {/* Luxury Search Bar with Gold-Orange focus */}
          <div className="hidden md:flex flex-1 max-w-lg relative mx-auto" id="desktop-search-container">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="ค้นหากระเป๋า นาฬิกา น้ำหอม หรือเครื่องประดับเลอค่า..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-full border border-purple-100 bg-purple-50/20 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-purple/25 focus:border-brand-purple focus:bg-white transition-all placeholder:text-gray-400 text-gray-800"
            />
          </div>

          {/* Quick Support Admin Chat Trigger button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={openChatWithAdmin}
              className="flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-2.5 rounded-full text-xs font-medium text-brand-purple bg-brand-purple-light hover:bg-purple-100/70 border border-purple-200 transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
              id="admin-chat-trigger"
            >
              <MessageSquareCode size={16} className="text-brand-purple group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline font-semibold">ติดต่อฝ่ายบริการแอดมิน VIP</span>
              <span className="inline sm:hidden font-semibold">คุยกับแอดมิน VIP</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange"></span>
              </span>
            </button>
          </div>

        </div>

        {/* Mobile Search Bar Row (Show on mobile) */}
        <div className="block md:hidden pb-3" id="mobile-search-row">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="ค้นหากระเป๋า นาฬิกา น้ำหอม หรือสินค้าแบรนด์คุณ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-purple-100 bg-purple-50/20 text-xs focus:outline-hidden focus:ring-2 focus:ring-brand-purple/25 focus:border-brand-purple focus:bg-white transition-all text-gray-800"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
