import React, { useState } from 'react';
import { Product } from '../types';
import { ShieldAlert, Sparkles, Star, Plus, Minus, ShoppingCart, CheckCircle, Clock } from 'lucide-react';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onAddToCart: (product: Product, selectedSize: string, quantity: number) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'Standard');
  const [quantity, setQuantity] = useState<number>(1);
  const [justAdded, setJustAdded] = useState(false);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddClick = () => {
    onAddToCart(product, selectedSize, quantity);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      setQuantity(1); // Reset
    }, 1500);
  };

  return (
    <div 
      className="bg-white rounded-2xl border border-stone-200/60 overflow-hidden shadow-xs hover:shadow-md hover:border-purple-200/80 transition-all duration-300 flex flex-col group relative"
      id={`product-card-${product.id}`}
    >
      {/* Pending status tag if newly added and waiting admin approval */}
      {!product.isApproved && (
        <div className="absolute top-3 left-3 z-10 bg-brand-orange/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <Clock size={11} className="animate-spin-slow" />
          <span>รออนุมัติจากแอดมิน</span>
        </div>
      )}

      {/* Sale / Sparkle luxury badge */}
      {product.salesCount > 30 && (
        <div className="absolute top-3 right-3 z-10 bg-brand-purple/90 backdrop-blur-xs text-brand-gold text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <Sparkles size={11} className="fill-brand-gold text-brand-gold" />
          <span>สินค้ายอดฮิต</span>
        </div>
      )}

      {/* Product Image Stage */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/2 w-full h-full pointer-events-none" />
      </div>

      {/* Content Room */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        
        {/* Shop Line */}
        <div className="flex items-center justify-between text-[11px] mb-2 text-stone-500">
          <div className="flex items-center gap-1 font-medium text-brand-purple hover:underline cursor-pointer">
            <span>{product.shopName}</span>
            {product.shopId === 'shop-1' || product.shopId === 'shop-2' ? (
              <CheckCircle size={10} className="text-brand-orange fill-brand-orange text-white" />
            ) : null}
          </div>
          <span className="bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded-sm uppercase tracking-wider text-[8px] sm:text-[9px] font-semibold">
            {product.category}
          </span>
        </div>

        {/* Product Title */}
        <h3 className="text-stone-900 font-display font-medium text-xs sm:text-sm leading-tight line-clamp-2 h-8 sm:h-10 mb-1 hover:text-brand-purple transition-colors">
          {product.name}
        </h3>

        {/* Rating and Sales Count Row */}
        <div className="flex flex-wrap items-center justify-between gap-1 mb-2.5">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={10} 
                className={`${
                  i < Math.floor(product.rating) 
                    ? 'text-brand-gold fill-brand-gold' 
                    : 'text-stone-200'
                }`} 
              />
            ))}
            <span className="text-[9px] sm:text-[10px] text-stone-500 font-medium ml-0.5">
              ({product.rating.toFixed(1)})
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-stone-500 font-medium">
            ขายแล้ว <span className="text-stone-950 font-bold font-mono">{product.salesCount}</span> ชิ้น
          </span>
        </div>

        {/* Description Snippet */}
        <p className="text-stone-500 text-[11px] sm:text-xs line-clamp-2 mb-2 sm:mb-4 leading-relaxed h-8">
          {product.description}
        </p>

        {/* Separator */}
        <div className="border-t border-stone-100 my-1.5 sm:my-2" />

        {/* Sizes Selection (Grams / Sizes / MLS) */}
        <div className="mb-2.5">
          <label className="block text-[9px] sm:text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1 sm:mb-1.5">
            เลือกขนาด / ตัวเลือก:
          </label>
          <div className="flex flex-wrap gap-1 sm:gap-1.5">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-medium rounded-md transition-all border cursor-pointer ${
                  selectedSize === size
                    ? 'bg-brand-purple border-brand-purple text-white shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100 hover:border-stone-300'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Buying Stage */}
        <div className="mt-auto pt-1 sm:pt-2 space-y-2.5">
          
          {/* Price Tag */}
          <div className="flex items-baseline gap-0.5 sm:gap-1" id={`price-section-${product.id}`}>
            <span className="text-[11px] sm:text-[12px] font-bold text-brand-purple">฿</span>
            <span className="text-base sm:text-lg font-display font-bold text-brand-purple tracking-wide">
              {product.price.toLocaleString('th-TH')}
            </span>
          </div>

          {/* Quantity Controls & Action Button Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-2">
            
            {/* Quantity Selector */}
            <div className="flex items-center justify-between border border-stone-200 rounded-lg bg-stone-50/50 shrink-0">
              <button
                type="button"
                onClick={handleDecrement}
                className="p-1.5 sm:p-2 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
                disabled={justAdded}
              >
                <Minus size={11} />
              </button>
              <span className="w-6 sm:w-8 text-center text-xs font-semibold text-stone-800 font-mono">
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                className="p-1.5 sm:p-2 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
                disabled={justAdded}
              >
                <Plus size={11} />
              </button>
            </div>

            {/* Add to Cart Premium Button */}
            <button
              onClick={handleAddClick}
              disabled={justAdded || !product.isApproved}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                !product.isApproved
                  ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                  : justAdded
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100'
                  : 'bg-brand-orange hover:bg-brand-orange-dark text-white shadow-md shadow-brand-orange/10 transform active:scale-95'
              }`}
            >
              {justAdded ? (
                <>
                  <CheckCircle size={13} className="animate-bounce" />
                  <span>เพิ่มแล้ว!</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={13} />
                  <span>ใส่ตะกร้า</span>
                </>
              )}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}
