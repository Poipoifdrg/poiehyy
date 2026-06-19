import React from 'react';
import { Notification } from '../types';
import { Bell, ShieldAlert, Package, Trash2, Check, CheckCircle2 } from 'lucide-react';

interface NotificationsTabProps {
  notifications: Notification[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onMarkSingleAsRead: (id: string) => void;
}

export default function NotificationsTab({
  notifications,
  onMarkAllAsRead,
  onClearAll,
  onMarkSingleAsRead,
}: NotificationsTabProps) {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-2xl mx-auto my-1" id="notifications-tab-container">
      
      {/* Notifications Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-5 mb-6 border-b border-stone-100">
        <div>
          <h2 className="text-lg font-display font-semibold text-stone-900 flex items-center gap-2">
            <Bell size={20} className="text-brand-purple" />
            <span>แจ้งเตือนกิจกรรมระบบ</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            อัปเดตความเคลื่อนไหวเกี่ยวกับสถานะจัดส่งพัสดุด้านล่าง (ยกเว้นไอเทมลงตะกร้า)
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold text-brand-purple bg-brand-purple-light hover:bg-purple-100 transition-colors cursor-pointer"
            >
              <Check size={12} />
              <span>อ่านทั้งหมดแล้ว</span>
            </button>
          )}
          
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold text-stone-500 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 size={12} />
            <span>ล้างทั้งหมด</span>
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-stone-200/60 shadow-xs p-6" id="empty-notifications">
          <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center text-stone-300 mx-auto mb-3">
            <Bell size={22} />
          </div>
          <h3 className="text-sm font-semibold text-stone-700">ไม่มีการแจ้งเตือนใหม่ในขณะนี้</h3>
          <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
            เมื่อมีการจัดส่งของพัสดุ ยืนยันคำสั่งซื้อ หรือร้านค้ายกเลิกรุ่นของท่าน ระบบจะส่งแจ้งเตือนมายังหน้านี้โดยว่องไว
          </p>
        </div>
      ) : (
        <div className="space-y-3.5" id="notifications-list">
          {notifications.map((notif) => {
            const isRead = notif.isRead;
            return (
              <div
                key={notif.id}
                onClick={() => !isRead && onMarkSingleAsRead(notif.id)}
                className={`p-4 rounded-xl border transition-all flex items-start gap-4 relative cursor-pointer ${
                  isRead 
                    ? 'bg-white border-stone-200/60' 
                    : 'bg-purple-50/10 border-purple-200 shadow-3xs'
                }`}
                id={`notification-item-${notif.id}`}
              >
                {/* Unread dot flag */}
                {!isRead && (
                  <span className="absolute top-4 right-4 h-2.5 w-2.5 rounded-full bg-brand-orange ring-2 ring-white"></span>
                )}

                {/* Notif Icon depending on Type */}
                <div className={`p-2.5 rounded-lg shrink-0 ${
                  notif.type === 'shipment' 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : notif.type === 'cancel' 
                    ? 'bg-rose-50 text-rose-600' 
                    : 'bg-purple-50 text-brand-purple'
                }`}>
                  {notif.type === 'shipment' ? (
                    <Package size={18} />
                  ) : notif.type === 'cancel' ? (
                    <ShieldAlert size={18} />
                  ) : (
                    <CheckCircle2 size={18} />
                  )}
                </div>

                {/* Miniature image reference if applicable */}
                {notif.image && (
                  <div className="w-11 h-11 rounded-md overflow-hidden bg-stone-100 border border-stone-200 shrink-0 select-none order-last">
                    <img 
                      src={notif.image} 
                      alt="" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Body Content */}
                <div className="flex-1 min-w-0 pr-4">
                  <h4 className={`text-[13px] font-display leading-tight truncate ${isRead ? 'text-stone-700 font-medium' : 'text-stone-900 font-bold'}`}>
                    {notif.title}
                  </h4>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed mr-2">
                    {notif.body}
                  </p>
                  <span className="text-[10px] text-stone-400 mt-2 block font-medium">
                    {notif.timestamp}
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
