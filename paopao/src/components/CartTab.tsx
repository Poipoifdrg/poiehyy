import React from 'react';
import { CartItem } from '../types';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, Store, CheckSquare, Square } from 'lucide-react';

interface CartTabProps {
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onToggleCheck: (itemId: string) => void;
  onToggleAllCheckForShop: (shopName: string, isChecked: boolean) => void;
  onProceedToCheckout: () => void;
  onNavigateToMarketplace: () => void;
}

export default function CartTab({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onToggleCheck,
  onToggleAllCheckForShop,
  onProceedToCheckout,
  onNavigateToMarketplace,
}: CartTabProps) {
  // Group elements by Shop Name
  const groupedByShop: { [shopName: string]: CartItem[] } = {};
  cartItems.forEach((item) => {
    const shop = item.product.shopName || 'ร้านค้าทั่วไป';
    if (!groupedByShop[shop]) {
      groupedByShop[shop] = [];
    }
    groupedByShop[shop].push(item);
  });

  const shopNames = Object.keys(groupedByShop);

  // Total for checked items
  const checkedItems = cartItems.filter((item) => item.isChecked);
  const checkedCount = checkedItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalPrice = checkedItems.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl border border-stone-200/60 shadow-xs max-w-lg mx-auto my-4" id="empty-cart-state">
        <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center text-brand-purple mb-4">
          <ShoppingBag size={28} />
        </div>
        <h3 className="text-lg font-display font-medium text-stone-900 mb-2">ตะกร้าของคุณยังเงียบเหงาอยู่...</h3>
        <p className="text-xs text-stone-500 max-w-sm mb-6 leading-relaxed">
          เลือกชมคอลเลกชันระดับพรีเมียม ฝากขายจากคนรักแบรนด์เนม และเพิ่มไอเทมเลอค่าในตะกร้าชำระเงินกับเรา
        </p>
        <button
          onClick={onNavigateToMarketplace}
          className="px-6 py-2.5 rounded-full bg-brand-purple text-white hover:bg-brand-purple-dark text-xs font-semibold tracking-wide transition-all shadow-md shadow-brand-purple/10 cursor-pointer"
        >
          กลับสู่ร้านค้าออนไลน์
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start my-1" id="cart-container">
      
      {/* Left Column: Grouped items */}
      <div className="lg:col-span-2 space-y-6">
        
        {shopNames.map((shopName) => {
          const itemsInShop = groupedByShop[shopName];
          const allCheckedInShop = itemsInShop.every((item) => item.isChecked);
          
          return (
            <div 
              key={shopName} 
              className="bg-white rounded-2xl border border-stone-200/60 p-5 shadow-xs"
              id={`cart-shop-${shopName.replace(/\s+/g, '-').toLowerCase()}`}
            >
              
              {/* Shop Header with Toggle */}
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => onToggleAllCheckForShop(shopName, !allCheckedInShop)}
                    className="text-brand-purple hover:text-brand-purple-dark transition-colors cursor-pointer"
                    title="เลือกทั้งหมดของร้านนี้"
                  >
                    {allCheckedInShop ? (
                      <CheckSquare size={20} className="fill-brand-purple text-white" />
                    ) : (
                      <Square size={20} className="text-stone-300" />
                    )}
                  </button>
                  <div className="flex items-center gap-1.5 font-display font-semibold text-stone-800 text-sm">
                    <Store size={15} className="text-brand-orange" />
                    <span>ผู้ฝากขาย: {shopName}</span>
                  </div>
                </div>
                
                <span className="text-[10px] bg-brand-purple-light text-brand-purple px-2 py-0.5 rounded-sm font-semibold uppercase tracking-wider">
                  MEMBER
                </span>
              </div>

              {/* Items in Shop */}
              <div className="space-y-4">
                {itemsInShop.map((item) => (
                  <div 
                    key={item.id} 
                    className={`flex items-start sm:items-center gap-3 p-3 rounded-xl border transition-all ${
                      item.isChecked 
                        ? 'bg-purple-50/15 border-purple-200' 
                        : 'bg-white border-stone-100'
                    }`}
                    id={`cart-item-${item.id}`}
                  >
                    {/* Individual Checkbox */}
                    <button
                      onClick={() => onToggleCheck(item.id)}
                      className="text-brand-purple shrink-0 mt-2 sm:mt-0 cursor-pointer"
                    >
                      {item.isChecked ? (
                        <CheckSquare size={18} className="fill-brand-purple text-white" />
                      ) : (
                        <Square size={18} className="text-stone-300" />
                      )}
                    </button>

                    {/* Product Image miniature */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-50 border border-stone-100 shrink-0">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Product Details (Middle) */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[13px] font-display font-medium text-stone-900 leading-tight truncate">
                        {item.product.name}
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-1 items-center text-[10px] text-stone-500">
                        <span className="bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded-sm">
                          โมเดล: {item.selectedSize}
                        </span>
                        <span>•</span>
                        <span>ราคาชิ้นละ ฿{item.product.price.toLocaleString('th-TH')}</span>
                      </div>
                    </div>

                    {/* Controls & Price (Right End) */}
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 shrink-0 self-stretch justify-between sm:justify-end">
                      
                      {/* Sub-Quantity Modifiers inside Cart */}
                      <div className="flex items-center border border-stone-200 rounded-md bg-stone-50 h-8">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="w-6 text-center text-xs font-semibold text-stone-800 font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
                        >
                          <Plus size={10} />
                        </button>
                      </div>

                      {/* Delete item from cart */}
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-stone-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-all cursor-pointer"
                        title="ลบออกจากตะกร้า"
                      >
                        <Trash2 size={14} />
                      </button>

                      {/* Computed Price */}
                      <div className="text-right min-w-[70px]">
                        <span className="text-xs font-mono font-bold text-stone-900 block">
                          ฿{(item.product.price * item.quantity).toLocaleString('th-TH')}
                        </span>
                      </div>

                    </div>

                  </div>
                ))}
              </div>

            </div>
          );
        })}

        {/* Support helper details */}
        <div className="text-[11px] text-stone-400 text-center leading-relaxed">
          * มีสินค้าต่างผู้ฝากขาย ระบบจะจัดส่งพัสดุเป็นสัดส่วนแยกกล่องตามลำดับร้านเพื่อดูแลคัดกรองแท้แยกบูติก
        </div>

      </div>

      {/* Right Column: Order Pricing Summary card */}
      <div className="bg-white rounded-2xl border border-stone-200/60 p-6 shadow-xs sticky top-32" id="cart-summary-card">
        <h3 className="text-stone-900 font-display font-semibold text-sm uppercase tracking-wider pb-3 border-b border-stone-100 mb-4">
          ยอดสรุปสั่งซื้อชำระเงิน
        </h3>

        <div className="space-y-3.5 mb-6 text-xs text-stone-600">
          <div className="flex justify-between">
            <span>จำนวนสินค้าทั้งหมดในตระกร้า</span>
            <span>{cartItems.length} รายการ</span>
          </div>
          
          <div className="flex justify-between font-medium">
            <span>ที่เลือกชำระบัดนี้</span>
            <span className="text-brand-purple font-semibold">{checkedCount} ชิ้น</span>
          </div>

          <div className="border-t border-stone-100 my-2" />

          {checkedItems.length > 0 && (
            <div className="space-y-2 py-1 bg-stone-50/50 p-2.5 rounded-lg border border-stone-100">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">สรุปสินค้าที่กำลังสั่งซื้อ:</span>
              {checkedItems.map((item) => (
                <div key={item.id} className="flex justify-between text-[11px] text-stone-500">
                  <span className="truncate max-w-[150px]">{item.product.name} ({item.selectedSize})</span>
                  <span>x{item.quantity}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-baseline pt-2">
            <span className="text-stone-800 font-bold">ยอดเงินเฉพาะสินค้า</span>
            <div className="text-right">
              <span className="text-stone-400 mr-1 text-[11px]">฿</span>
              <span className="text-base font-display font-bold text-stone-950">
                {totalPrice.toLocaleString('th-TH')}
              </span>
            </div>
          </div>
        </div>

        {/* Checkout CTA */}
        <button
          onClick={onProceedToCheckout}
          disabled={checkedItems.length === 0}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-full text-xs font-semibold tracking-wide transition-all ${
            checkedItems.length > 0
              ? 'bg-brand-purple text-white shadow-md hover:bg-brand-purple-dark active:scale-[0.98] cursor-pointer'
              : 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
          }`}
          id="proceed-checkout-btn"
        >
          <span>ทำการชำระเงิน</span>
          <ArrowRight size={14} />
        </button>

        {checkedItems.length === 0 && (
          <p className="text-[10px] text-brand-orange text-center mt-3 font-medium">
            * โปรดติ๊กเครื่องหมายหน้าสินค้าที่ต้องการชำระเงินเพื่อเริ่มเช็คเอาท์
          </p>
        )}
      </div>

    </div>
  );
}
