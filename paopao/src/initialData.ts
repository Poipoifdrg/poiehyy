import { Product, Shop, Notification, UserProfile, Purchase } from './types';

export const INITIAL_SHOPS: Shop[] = [
  {
    id: 'shop-1',
    name: 'Maison Luxe Consignment',
    ownerName: 'Isabella Taylor',
    isVerified: true,
    joinedDate: '2025-01-12',
    bannerColor: 'bg-brand-purple'
  },
  {
    id: 'shop-2',
    name: 'Aura Premium Vintage',
    ownerName: 'Kenji Sato',
    isVerified: true,
    joinedDate: '2025-03-05',
    bannerColor: 'bg-amber-800'
  },
  {
    id: 'shop-3',
    name: 'Sole Archive BKK',
    ownerName: 'Anont Ch.',
    isVerified: false,
    joinedDate: '2025-05-20',
    bannerColor: 'bg-zinc-900'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'L’Infini Suede & Gold Shoulder Bag',
    description: 'A masterpiece crafted from royal purple suede leather with 24k gold-plated accents. Exquisite detailing with a spacious silk-lined interior. Lightly used, excellent pristine condition with authenticity card and dust bag included.',
    price: 49500,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
    shopId: 'shop-1',
    shopName: 'Maison Luxe Consignment',
    category: 'Bags & Accessories',
    sizes: ['Small (18cm)', 'Medium (24cm)'],
    salesCount: 14,
    rating: 4.9,
    isApproved: true
  },
  {
    id: 'prod-2',
    name: 'Royal Oud Impérial Extrait de Parfum',
    description: 'An elite fragrance combining smoky cambodian oud, delicate damask rose, and sweet saffron. Extremely long-lasting projection. 95% volume remaining inside an elegant hand-polished glass flacon.',
    price: 8900,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&auto=format&fit=crop&q=80',
    shopId: 'shop-1',
    shopName: 'Maison Luxe Consignment',
    category: 'Fragrances',
    sizes: ['50 ml', '100 ml'],
    salesCount: 42,
    rating: 4.8,
    isApproved: true
  },
  {
    id: 'prod-3',
    name: 'Chronograph Classic Gold Watch',
    description: 'Timeless luxury vintage chronograph with a 40mm golden dial and genuine alligator leather strap. Self-winding automatic movement with 48 hours of power reserve. Certified collection piece.',
    price: 125000,
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&auto=format&fit=crop&q=80',
    shopId: 'shop-2',
    category: 'Watches',
    sizes: ['Standard 40mm'],
    salesCount: 5,
    rating: 5.0,
    isApproved: true,
    shopName: 'Aura Premium Vintage'
  },
  {
    id: 'prod-4',
    name: 'Pure 18K Solid Gold Link Bracelet',
    description: 'Elegant Parisian chain-link bracelet in solid 18-karat yellow gold. Featuring a secure sleek safety clasp. Perfect as a standalone piece or layered accessory. Weight ranges from 12g to 20g.',
    price: 36000,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80',
    shopId: 'shop-2',
    shopName: 'Aura Premium Vintage',
    category: 'Jewelry',
    sizes: ['15 grams', '20 grams'],
    salesCount: 11,
    rating: 4.7,
    isApproved: true
  },
  {
    id: 'prod-5',
    name: 'Retro Crimson Legacy Sneakers',
    description: 'Highly rare vintage sneakers in a gorgeous premium ruby crimson and ice-white colorway. Kept in a dual-humidity storage. Never worn, brand new with original box.',
    price: 18500,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    shopId: 'shop-3',
    shopName: 'Sole Archive BKK',
    category: 'Sneakers & Streetwear',
    sizes: ['US 8.5', 'US 9.5', 'US 10.5'],
    salesCount: 121,
    rating: 4.9,
    isApproved: true
  },
  {
    id: 'prod-6',
    name: 'Hermitage Hand-knit Silk Scarf',
    description: 'Ultra luxurious, hand-woven luxury silk scarf carrying elegant heritage baroque motifs. Feels incredibly soft. Pre-owned in pristine museum-grade condition with dry cleaning certificate.',
    price: 9500,
    image: 'https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?w=600&auto=format&fit=crop&q=80',
    shopId: 'shop-1',
    shopName: 'Maison Luxe Consignment',
    category: 'Bags & Accessories',
    sizes: ['Square 90cm'],
    salesCount: 8,
    rating: 4.6,
    isApproved: true
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    type: 'shipment',
    title: 'พัสดุเตรียมจัดส่งแล้ว',
    body: 'สินค้า "Royal Oud Impérial" จากร้าน Maison Luxe Consignment กำลังส่งมอบให้ขนส่งด่วน ปลายทางของคุณ',
    timestamp: '15 นาทีที่แล้ว',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=100&q=80',
    isRead: false
  },
  {
    id: 'notif-2',
    type: 'order',
    title: 'คำสั่งซื้อของคุณได้รับการอนุมัติ',
    body: 'ร้าน Aura Premium Vintage ยืนยันออเดอร์ "Solid Gold Link Bracelet" และเริ่มแพ็คสินค้าอย่างหรูหราแล้ว',
    timestamp: '2 ชั่วโมงที่แล้ว',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&q=80',
    isRead: false
  },
  {
    id: 'notif-3',
    type: 'shipment',
    title: 'จัดส่งพัสดุสำเร็จ',
    body: 'การจัดส่งสำหรับออเดอร์ #PP-9921 เสร็จสมบูรณ์แล้ว กล่องของขวัญผูกโบว์หรูสลักชื่อแบรนด์ paopao ส่งตรงถึงมือคุณแล้ว',
    timestamp: '1 วันที่แล้ว',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80',
    isRead: true
  }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  username: 'Kittipat LuxuryCollector',
  tel: '081-345-6789',
  gender: 'ชาย',
  birthdate: '1998-10-15',
  email: 'collector.luxury@paopao.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
};

export const INITIAL_PURCHASES: Purchase[] = [
  {
    id: 'PP-29381',
    shopName: 'Maison Luxe Consignment',
    items: [
      {
        productId: 'prod-2',
        productName: 'Royal Oud Impérial Extrait de Parfum',
        quantity: 1,
        price: 8900,
        size: '50 ml',
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=150&q=80'
      }
    ],
    status: 'shipping',
    totalAmount: 9050, // includes 150 shipping
    receiverInfo: {
      name: 'กิตติพัทธ์ ณ บางกอก',
      tel: '081-345-6789',
      address: '18/9 Luxury Court ห้อง 402 ซอยสุขุมวิท 39 แขวงคลองตันเหนือ เขตวัฒนา',
      postalCode: '10110'
    },
    paymentMethod: 'bank',
    trackingNumber: 'TH-EXPRESS-992831',
    date: '2026-06-17'
  },
  {
    id: 'PP-18374',
    shopName: 'Sole Archive BKK',
    items: [
      {
        productId: 'prod-5',
        productName: 'Retro Crimson Legacy Sneakers',
        quantity: 1,
        price: 18500,
        size: 'US 9.5',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&q=80'
      }
    ],
    status: 'completed',
    totalAmount: 18620, // 18500 + 120 shipping
    receiverInfo: {
      name: 'กิตติพัทธ์ ณ บางกอก',
      tel: '081-345-6789',
      address: '18/9 Luxury Court ห้อง 402 ซอยสุขุมวิท 39 แขวงคลองตันเหนือ เขตวัฒนา',
      postalCode: '10110'
    },
    paymentMethod: 'cod',
    trackingNumber: 'TH-DHL-711928',
    date: '2026-06-10'
  }
];

export const PROMO_CODES = [
  { code: 'PAOPAOEXCLUSIVELY', value: 15, percent: true, label: 'ลด 15% สำหรับการสั่งซื้อครั้งแรก!' },
  { code: 'PAOPAOLUXE', value: 1500, label: 'ส่วนลด ฿1,500 เมื่อช้อปครบ 20,000' },
  { code: 'WELCOMEPAO', value: 500, label: 'ส่วนลดต้อนรับสมาชิกใหม่ ฿500 ไม่มีขั้นต่ำ' },
  { code: 'GOLDENGOLD', value: 10, percent: true, label: 'ลด 10% สำหรับสินค้าเครื่องประดับทอง' }
];
