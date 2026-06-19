import React, { useState } from 'react';
import { CartItem, ReceiverInfo, Purchase } from '../types';
import { ChevronLeft, ShieldCheck, MapPin, Truck, Ticket, DollarSign, Award, CreditCard } from 'lucide-react';
import { PROMO_CODES } from '../initialData';

interface CheckoutViewProps {
  checkedItems: CartItem[];
  receiverProfile: ReceiverInfo;
  onPlaceOrder: (purchaseDetails: {
    items: CartItem[];
    receiver: ReceiverInfo;
    paymentMethod: 'cod' | 'bank';
    discountCode: string;
    discountValue: number;
    shippingFee: number;
    grandTotal: number;
  }) => void;
  onBackToCart: () => void;
}

export default function CheckoutView({
  checkedItems,
  receiverProfile,
  onPlaceOrder,
  onBackToCart,
}: CheckoutViewProps) {
  // Local states for custom receiver form
  const [name, setName] = useState(receiverProfile.name || '');
  const [tel, setTel] = useState(receiverProfile.tel || '');
  const [address, setAddress] = useState(receiverProfile.address || '');
  const [postalCode, setPostalCode] = useState(receiverProfile.postalCode || '');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank'>('bank');

  // Promo code application
  const [promoInput, setPromoInput] = useState('');
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [discountValue, setDiscountValue] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccessMsg, setPromoSuccessMsg] = useState('');

  // Group items by shop for displaying
  const groupedByShop: { [shopName: string]: CartItem[] } = {};
  checkedItems.forEach((item) => {
    const shop = item.product.shopName || 'ร้านค้าทั่วไป';
    if (!groupedByShop[shop]) {
      groupedByShop[shop] = [];
    }
    groupedByShop[shop].push(item);
  });

  const shopNames = Object.keys(groupedByShop);
  const totalItemPrice = checkedItems.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);

  // Shipping Fee model: ฿80 per individual shop to reflect safe premium shipping
  const shippingFee = shopNames.length * 80;

  // Form error validator
  const [formError, setFormError] = useState('');

  // Calculate promotional discount values
  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccessMsg('');
    const uppercaseCode = promoInput.trim().toUpperCase();

    const matched = PROMO_CODES.find((c) => c.code === uppercaseCode);
    if (!matched) {
      setPromoError('ระบุโค้ดไม่ถูกต้อง หรือ โค้ดหมดอายุการใช้งาน');
      setDiscountValue(0);
      setActiveCode(null);
      return;
    }

    if (matched.code === 'PAOPAOLUXE' && totalItemPrice < 20000) {
      setPromoError('สิทธิ์หมดชั่วคราว หรือ ยอดช้อปอาหารสมองพรีเมียมไม่ครบ ฿20,000');
      setDiscountValue(0);
      setActiveCode(null);
      return;
    }

    setActiveCode(matched.code);
    if (matched.percent) {
      // 10% discount on entire jewelry/or anything we want
      const amount = Math.round(totalItemPrice * 0.1);
      setDiscountValue(amount);
      setPromoSuccessMsg(`ประยุกต์โค้ดลดเลิศค่าสำเร็จ! ลด 10% เป็นจำนวน ฿${amount.toLocaleString('th-TH')}`);
    } else {
      setDiscountValue(matched.value);
      setPromoSuccessMsg(`คูปองประยุกต์สำเร็จ! ลดทันที ฿${matched.value.toLocaleString('th-TH')}`);
    }
  };

  const finalGrandTotal = Math.max(0, totalItemPrice + shippingFee - discountValue);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !tel.trim() || !address.trim() || !postalCode.trim()) {
      setFormError('โปรดกรอกข้อมูลฟอร์มส่งมอบพัสดุให้ครบถ้วนก่อนบันทึกสั่งซื้อ');
      return;
    }
    setFormError('');

    onPlaceOrder({
      items: checkedItems,
      receiver: { name, tel, address, postalCode },
      paymentMethod,
      discountCode: activeCode || '',
      discountValue,
      shippingFee,
      grandTotal: finalGrandTotal,
    });
  };

  return (
    <div className="max-w-4xl mx-auto my-1" id="checkout-view-stage">
      
      {/* Back to Cart Action */}
      <button
        onClick={onBackToCart}
        className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-brand-purple mb-6 group cursor-pointer font-medium"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        <span>ย้อนกลับไปแก้ไขตะกร้าสินค้า</span>
      </button>

      <div className="bg-gradient-to-r from-purple-900 to-purple-950 text-white rounded-2xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-brand-orange/20">
        <div>
          <h2 className="text-xl font-display font-bold text-brand-gold tracking-wide">ขั้นตอนสรุปชำระเงินพรีเมียม</h2>
          <p className="text-xs text-stone-300 mt-1">
            ท่านกำลังสั่งซื้อพัสดุแบรนด์เนมจำกัดจำนวน สินค้าจะถูกห่อหุ้มในกล่องสุดหรูและจัดส่งด่วนพิเศษ
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg border border-white/15">
          <ShieldCheck size={18} className="text-brand-gold" />
          <span className="text-[11px] font-bold tracking-wider uppercase font-mono">100% Secure Checkout</span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Hand: Fill details & Delivery Destination */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Receiver Info Form */}
          <div className="bg-white rounded-2xl border border-stone-200/60 p-5 shadow-xs" id="receiver-delivery-card">
            <h3 className="text-stone-900 font-display font-semibold text-sm flex items-center gap-2 pb-3.5 mb-5 border-b border-stone-100">
              <MapPin size={16} className="text-brand-orange" />
              <span>ที่อยู่สำหรับจัดส่งพัสดุด่วน</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-stone-500 text-xs font-medium mb-1.5">ชื่อ-นามสกุล ผู้รับพัสดุ</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ตัวอย่าง: คุณกิตติพัทธ์ ณ บางกอก"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 text-xs focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple focus:outline-hidden text-gray-800"
                />
              </div>

              <div>
                <label className="block text-stone-500 text-xs font-medium mb-1.5">เบอร์โทรศัพท์ติดต่อ (สายด่วนขนส่ง)</label>
                <input
                  type="tel"
                  required
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  placeholder="ตัวอย่าง: 081-345-6789"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 text-xs focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple focus:outline-hidden text-gray-800"
                />
              </div>

              <div>
                <label className="block text-stone-500 text-xs font-medium mb-1.5">ที่อยู่โดยละเอียด (บ้านเลขที่, ถนน, แขวง, เขต, จังหวัด)</label>
                <textarea
                  required
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="ตัวอย่าง: 18/9 Luxury Court ห้อง 402 ซอยสุขุมวิท 39 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 text-xs focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple focus:outline-hidden text-gray-800 resize-none"
                />
              </div>

              <div>
                <label className="block text-stone-500 text-xs font-medium mb-1.5">รหัสไปรษณีย์</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="ตัวอย่าง: 10110"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 text-xs focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple focus:outline-hidden text-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Checkout Payment Method Selection */}
          <div className="bg-white rounded-2xl border border-stone-200/60 p-5 shadow-xs" id="payment-method-card">
            <h3 className="text-stone-900 font-display font-semibold text-sm flex items-center gap-2 pb-3.5 mb-5 border-b border-stone-100">
              <CreditCard size={16} className="text-brand-purple" />
              <span>ช่องทางการชำระเงินเกรดปลอดภัย</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Bank Transfer option */}
              <div
                onClick={() => setPaymentMethod('bank')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 relative ${
                  paymentMethod === 'bank'
                    ? 'border-brand-purple bg-purple-50/10'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${
                  paymentMethod === 'bank' ? 'border-brand-purple bg-brand-purple' : 'border-stone-300'
                }`}>
                  {paymentMethod === 'bank' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-800">โอนผ่านบัญชีธนาคาร (แนะนํา)</h4>
                  <p className="text-[10px] text-stone-500 mt-1">รับส่วนรับคะแนนสะสม และไม่มีค่าธรรมเนียมปลายทาง</p>
                  
                  {paymentMethod === 'bank' && (
                    <div className="mt-3 p-2 bg-purple-50 rounded text-[10px] text-stone-600 space-y-1 font-mono">
                      <div>ธนาคารกสิกรไทย (KBANK)</div>
                      <div className="font-bold text-brand-purple">091-8-22345-0</div>
                      <div>บจก. เพาเพลิน เพื่อ paopao แพลตฟอร์ม</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Cash on Delivery option */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'cod'
                    ? 'border-brand-purple bg-purple-50/10'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${
                  paymentMethod === 'cod' ? 'border-brand-purple bg-brand-purple' : 'border-stone-300'
                }`}>
                  {paymentMethod === 'cod' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-800">บริการเก็บเงินปลายทาง (COD)</h4>
                  <p className="text-[10px] text-stone-500 mt-1">ชำระด้วยเงินสดหรือแอปมือถือกับพนักงานขนส่งที่หน้าบ้าน</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Hand: Order items list, Promos & Grand billing summary */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Order items separated by Shop (C2C/B2C separate shipment model requested) */}
          <div className="bg-white rounded-2xl border border-stone-200/60 p-5 shadow-xs" id="order-merchandise-list">
            <h3 className="text-stone-900 font-display font-semibold text-xs uppercase tracking-wider pb-3.5 mb-4 border-b border-stone-100">
              ทบทวนรายการสินค้าในคำสั่งซื้อ
            </h3>

            <div className="space-y-4">
              {shopNames.map((shop) => (
                <div key={shop} className="space-y-2 pb-3 mb-3 border-b border-stone-100 last:border-0 last:p-0 last:m-0">
                  <div className="text-[10px] font-bold text-brand-purple flex items-center gap-1">
                    <span>{shop}</span>
                    <span className="text-[9px] bg-purple-50 text-brand-purple border border-purple-200 px-1 py-0.2 rounded-sm text-stone-400 font-normal">
                      ชาร์จขนส่ง ฿80
                    </span>
                  </div>

                  {groupedByShop[shop].map((item) => (
                    <div key={item.id} className="flex justify-between items-center gap-2 py-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="w-10 h-10 object-cover rounded-md border border-stone-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-[11px] text-stone-800 font-semibold truncate max-w-[160px]">{item.product.name}</p>
                          <p className="text-[9px] text-stone-400">ขนาด: {item.selectedSize} | x{item.quantity}</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-stone-700 font-semibold shrink-0">
                        ฿{(item.product.price * item.quantity).toLocaleString('th-TH')}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Promo Codes Application component */}
          <div className="bg-white rounded-2xl border border-stone-200/60 p-5 shadow-xs" id="promo-code-card">
            <h4 className="text-stone-900 font-display font-semibold text-xs uppercase tracking-widest flex items-center gap-1.5 mb-3">
              <Ticket size={13} className="text-brand-orange" />
              <span>รหัสคูปองส่วนลดพิเศษ</span>
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="กรอกชื่อโค้ด เช่น WELCOMEPAO"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-stone-200 text-xs focus:ring-1 focus:ring-brand-purple/20 focus:outline-hidden text-gray-800"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="px-4 py-2 bg-stone-950 text-white rounded-lg text-xs hover:bg-stone-800 transition-colors cursor-pointer"
              >
                ใช้โค้ด
              </button>
            </div>
            {promoSuccessMsg && (
              <p className="text-[11px] text-emerald-600 mt-2 font-medium">✓ {promoSuccessMsg}</p>
            )}
            {promoError && (
              <p className="text-[11px] text-rose-500 mt-2 font-medium">✗ {promoError}</p>
            )}
            
            <div className="mt-3 py-2 px-3 bg-brand-orange-light/40 border border-brand-orange/10 rounded-lg text-[10px] text-stone-500 leading-relaxed">
              * ดูบัตรส่วนลดพรีเมียมทั้งหมดได้เกียรติยศที่แถบวิ่งสีม่วงสูงสุดด้านบนสุดของเว็บ และกดคัดลอกมาใช้ได้เลย!
            </div>
          </div>

          {/* Grand Receipt calculations & Submit Order */}
          <div className="bg-white rounded-2xl border border-stone-200/60 p-6 shadow-sm space-y-4" id="checkout-receipt-card">
            <h4 className="text-stone-900 font-display font-semibold text-xs uppercase tracking-wider pb-2 border-b border-stone-100">
              สรุปรายละเอียดบิลทั้งหมด
            </h4>

            <div className="space-y-2.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>ยอดเงินสินค้าทั้งหมด</span>
                <span className="font-mono text-stone-800 font-bold">฿{totalItemPrice.toLocaleString('th-TH')}</span>
              </div>
              <div className="flex justify-between items-center text-stone-500">
                <span className="flex items-center gap-1">
                  <Truck size={12} className="text-stone-400" />
                  <span>ค่าบริการจัดส่งพัสดุด่วนพิเศษ</span>
                </span>
                <span className="font-mono">฿{shippingFee.toLocaleString('th-TH')}</span>
              </div>
              {discountValue > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold items-center bg-emerald-50/50 p-2 rounded">
                  <span>ส่วนลดคูปอง ({activeCode})</span>
                  <span className="font-mono">-฿{discountValue.toLocaleString('th-TH')}</span>
                </div>
              )}
            </div>

            <div className="border-t border-stone-100 my-2" />

            <div className="flex justify-between items-center pt-2" id="checkout-grand-total-row">
              <span className="text-stone-900 font-bold text-sm">ยอดชำระเงินทั้งหมด</span>
              <div className="text-right">
                <span className="text-xs font-bold text-brand-purple mr-1">฿</span>
                <span className="text-2xl font-display font-bold text-brand-purple tracking-wide">
                  {finalGrandTotal.toLocaleString('th-TH')}
                </span>
              </div>
            </div>

            {formError && (
              <div className="bg-rose-50 text-rose-600 text-[11px] p-3 rounded-lg border border-rose-100 font-medium">
                {formError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-brand-orange hover:bg-brand-orange-dark text-white rounded-full text-xs font-semibold tracking-wider transition-all shadow-md shadow-brand-orange/15 shadow-2xl active:scale-[0.98] cursor-pointer text-center block mt-4"
              id="place-order-submit-btn"
            >
              สั่งซื้อสินค้าเสร็จสิ้น
            </button>
            
            <p className="text-[10px] text-stone-400 text-center leading-relaxed px-4">
              การสั่งซื้อจะเชื่อมต่อผ่านระบบจัดส่งมาตรฐานทันที คุณสามารถขอยกเลิกได้ตลอดเวลาก่อนผู้ส่งเข้ารับพัสดุ
            </p>

          </div>

        </div>

      </form>

    </div>
  );
}
