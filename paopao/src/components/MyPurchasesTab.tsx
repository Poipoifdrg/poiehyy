import React, { useState } from 'react';
import { Purchase } from '../types';
import { Package, Truck, CheckCircle2, XCircle, ChevronRight, Clock, MapPin, Phone, HelpCircle } from 'lucide-react';

interface MyPurchasesTabProps {
  purchases: Purchase[];
  onCancelPurchase: (purchaseId: string) => void;
  onReceivePurchase?: (purchaseId: string) => void; // Optional confirm receive for simulation joy!
}

type SubTabStatus = 'awaiting' | 'shipping' | 'completed' | 'cancelled';

export default function MyPurchasesTab({
  purchases,
  onCancelPurchase,
  onReceivePurchase,
}: MyPurchasesTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTabStatus>('awaiting');

  const subTabs = [
    { id: 'awaiting', label: 'รอสินค้าจัดส่ง', icon: Clock, count: purchases.filter(p => p.status === 'awaiting').length },
    { id: 'shipping', label: 'กำลังจัดส่ง', icon: Truck, count: purchases.filter(p => p.status === 'shipping').length },
    { id: 'completed', label: 'ได้รับสำเร็จแล้ว', icon: CheckCircle2, count: purchases.filter(p => p.status === 'completed').length },
    { id: 'cancelled', label: 'สินค้าที่ยกเลิก', icon: XCircle, count: purchases.filter(p => p.status === 'cancelled').length },
  ];

  const filteredPurchases = purchases.filter((p) => p.status === activeSubTab);

  return (
    <div className="my-1" id="my-purchases-container">
      
      {/* Upper Sub-navigation Tab Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8 bg-purple-50/40 p-1.5 rounded-xl border border-purple-100" id="purchases-subtabs">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as SubTabStatus)}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                isActive
                  ? 'bg-brand-purple text-white shadow-xs'
                  : 'text-stone-600 hover:text-brand-purple hover:bg-white'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-brand-gold' : 'text-stone-400'} />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold font-mono ${isActive ? 'bg-white text-brand-purple' : 'bg-stone-200 text-stone-700'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Status Showcase Area */}
      {filteredPurchases.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-stone-200/60 p-6 max-w-lg mx-auto" id="empty-state-purchases">
          <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center text-stone-300 mx-auto mb-3">
            <Package size={22} />
          </div>
          <h3 className="text-sm font-semibold text-stone-700">ไม่มีรายการในหมวดนี้</h3>
          <p className="text-xs text-stone-400 mt-1">
            {activeSubTab === 'awaiting' && 'เมื่อกดชำระเงินพัสดุสำเร็จ รายการสั่งซื้อใหม่จะเข้ามาขึ้นคิวหน้านี้เพื่อให้บูติกร้านอนุมัติเตรียมห่อ'}
            {activeSubTab === 'shipping' && 'ไม่มีพัสดุที่กำลังเร่งความเร็วส่งทางด่วนในขณะนี้'}
            {activeSubTab === 'completed' && 'ยังไม่มีออเดอร์แบรนด์เนมที่ได้รับสำเร็จสมบูรณ์'}
            {activeSubTab === 'cancelled' && 'ไม่มีประวัติพัสดุที่ถูกลูกค้ายกเลิก'}
          </p>
        </div>
      ) : (
        <div className="space-y-6" id="purchases-list">
          {filteredPurchases.map((pc) => (
            <div 
              key={pc.id} 
              className="bg-white rounded-2xl border border-stone-200/60 shadow-3xs overflow-hidden flex flex-col"
              id={`purchase-card-${pc.id}`}
            >
              
              {/* Purchase Item Header details */}
              <div className="bg-stone-50/55 px-4 sm:px-6 py-3 border-b border-stone-100 flex flex-wrap justify-between items-center gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-stone-900 font-display">หมายเลขสั่งซื้อ: #{pc.id}</span>
                  <span className="text-stone-300">•</span>
                  <span className="text-stone-500 font-medium">วันที่ซื้อ: {pc.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest font-mono">
                    {pc.paymentMethod === 'cod' ? 'เก็บปลายทาง (COD)' : 'โอนเงิน (Secure Bank)'}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    pc.status === 'awaiting' 
                      ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                      : pc.status === 'shipping' 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : pc.status === 'completed' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {pc.status === 'awaiting' && 'รอร้านค้าเตรียมส่ง'}
                    {pc.status === 'shipping' && 'กำลังจัดส่งด่วนพิเศษ'}
                    {pc.status === 'completed' && 'ได้รับสำเร็จแล้ว'}
                    {pc.status === 'cancelled' && 'รายการถูกยกเลิก'}
                  </span>
                </div>
              </div>

              {/* Purchase Shop and merchandise items rows */}
              <div className="p-4 sm:p-6 space-y-4">
                <div className="text-xs font-bold text-brand-purple flex items-center gap-1.5 pb-2 border-b border-stone-100">
                  <span className="w-2 h-2 rounded-full bg-brand-orange"></span>
                  <span>ร้านผู้ฝากส่ง: {pc.shopName}</span>
                </div>

                {pc.items.map((item, index) => (
                  <div key={index} className="flex items-start sm:items-center justify-between gap-4 py-1">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img 
                        src={item.image} 
                        alt={item.productName} 
                        className="w-12 h-12 object-cover rounded-lg border border-stone-200 shrink-0 bg-stone-50"
                      />
                      <div className="min-w-0">
                        <h4 className="text-[13px] font-display font-semibold text-stone-900 truncate leading-snug">{item.productName}</h4>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500">
                          <span className="bg-stone-100 px-1.5 py-0.2 rounded-sm text-stone-600">สเปก: {item.size}</span>
                          <span>x{item.quantity}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold text-stone-800">
                      ฿{(item.price * item.quantity).toLocaleString('th-TH')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Delivery destination preview details on card */}
              <div className="px-4 sm:px-6 py-3.5 bg-stone-50/30 border-t border-stone-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-stone-600">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-stone-500 font-medium">
                    <MapPin size={12} className="text-stone-400" />
                    <span>ที่อยู่จัดส่งพัสดุ:</span>
                  </div>
                  <p className="font-semibold text-stone-800">{pc.receiverInfo.name}</p>
                  <p className="text-stone-500 leading-relaxed text-[11px]">{pc.receiverInfo.address} {pc.receiverInfo.postalCode}</p>
                </div>

                <div className="flex flex-col justify-between md:items-end gap-3">
                  <div className="space-y-1 md:text-right">
                    <div className="flex items-center md:justify-end gap-1 text-stone-400 text-[11px]">
                      <Phone size={11} />
                      <span>เบอร์ติดต่อผู้รับ: {pc.receiverInfo.tel}</span>
                    </div>
                    {pc.trackingNumber && (
                      <div className="text-[11px] text-stone-500">
                        เลขพัสดุ: <span className="font-mono text-xs font-bold text-brand-purple">{pc.trackingNumber}</span>
                      </div>
                    )}
                  </div>

                  {/* Receipt totals */}
                  <div className="flex items-baseline gap-1 md:text-right pt-1">
                    <span className="text-stone-500 text-[11px] font-medium">รวมยอดเงินทั้งสิ้น:</span>
                    <span className="text-sm font-mono font-bold text-brand-purple">
                      ฿{pc.totalAmount.toLocaleString('th-TH')}
                    </span>
                  </div>
                </div>
              </div>

              {/* ACTION ROW (Immediate Cancellation or simulated confirmation) */}
              {activeSubTab === 'awaiting' && (
                <div className="bg-rose-50/15 border-t border-stone-100 p-3 flex justify-between items-center">
                  <span className="text-[10px] text-stone-500 flex items-center gap-1">
                    <HelpCircle size={11} className="text-amber-500" />
                    <span>คุณยกเลิกได้เองทันทีก่อนทางผู้รับฝากส่งแพ็คของ</span>
                  </span>
                  
                  <button
                    onClick={() => onCancelPurchase(pc.id)}
                    className="px-4.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95"
                    id={`cancel-order-btn-${pc.id}`}
                  >
                    กดยกเลิกสินค้า
                  </button>
                </div>
              )}

              {activeSubTab === 'shipping' && onReceivePurchase && (
                <div className="bg-blue-50/15 border-t border-stone-100 p-3 flex justify-between items-center">
                  <span className="text-[10px] text-stone-500">
                    * พัสดุของท่านถูกด่วนพิเศษ คาดแอดถึงจุดกระจายสินค้าท้องถิ่นแล้ว
                  </span>
                  
                  <button
                    onClick={() => onReceivePurchase(pc.id)}
                    className="px-4.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95"
                  >
                    ยืนยันได้รับของตรงปกแล้ว
                  </button>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
