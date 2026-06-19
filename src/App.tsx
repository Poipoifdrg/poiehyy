import React, { useState, useEffect } from 'react';
import { 
  Product, 
  CartItem, 
  Notification, 
  Purchase, 
  UserProfile, 
  ReceiverInfo, 
  Message 
} from './types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_USER_PROFILE, 
  INITIAL_PURCHASES,
  PROMO_CODES
} from './initialData';

// Component imports
import Header from './components/Header';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import CartTab from './components/CartTab';
import CheckoutView from './components/CheckoutView';
import NotificationsTab from './components/NotificationsTab';
import MyPurchasesTab from './components/MyPurchasesTab';
import ProfileDashboard from './components/ProfileDashboard';
import LiveSupportChat from './components/LiveSupportChat';
import AuthScreen from './components/AuthScreen';

// Icons for simulation controls and bottom navigation
import { Home, ShoppingBag, Bell, ClipboardList, User, HelpCircle, Check, Info, ArrowUp, ShoppingBasket, CheckSquare, Sparkles } from 'lucide-react';

export default function App() {
  // --- Persistent Storage Helpers ---
  const getStored = <T,>(key: string, backup: T): T => {
    try {
      const item = localStorage.getItem(`paopao_${key}`);
      return item ? JSON.parse(item) : backup;
    } catch {
      return backup;
    }
  };

  const setStored = <T,>(key: string, value: T) => {
    localStorage.setItem(`paopao_${key}`, JSON.stringify(value));
  };

  // --- Main React States ---
  const [activeTab, setActiveTab] = useState<string>('marketplace');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Products collection
  const [allProducts, setAllProducts] = useState<Product[]>(() => 
    getStored('products', INITIAL_PRODUCTS)
  );

  // Shopping Cart selection
  const [cart, setCart] = useState<CartItem[]>(() => 
    getStored('cart', [])
  );

  // Orders and histories list
  const [purchases, setPurchases] = useState<Purchase[]>(() => 
    getStored('purchases', INITIAL_PURCHASES)
  );

  // System Notifications
  const [notifications, setNotifications] = useState<Notification[]>(() => 
    getStored('notifications', INITIAL_NOTIFICATIONS)
  );

  // Member profiles
  const [userProfile, setUserProfile] = useState<UserProfile>(() => 
    getStored('profile', INITIAL_USER_PROFILE)
  );

  const [deliveryAddress, setDeliveryAddress] = useState<ReceiverInfo>(() => 
    getStored('address', {
      name: 'กิตติพัทธ์ ณ บางกอก',
      tel: '081-345-6789',
      address: '18/9 Luxury Court ห้อง 402 ซอยสุขุมวิท 39 แขวงคลองตันเหนือ เขตวัฒนา',
      postalCode: '10110'
    })
  );

  // Store owner registers
  const [isRegisteredSeller, setIsRegisteredSeller] = useState<boolean>(() => 
    getStored('is_seller', false)
  );

  // Checkout flow state (if null, display traditional cart list. If set, view checkout layout!)
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);

  // Help support message chat logs state
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Message[]>(() => 
    getStored('chat_logs', [
      {
        id: 'msg-start',
        sender: 'admin',
        text: 'สวัสดีค่ะคุณ Kittipat ยินดีต้อนรับสู่ระบบช่วยเหลือลูกค้า VIP ของ paopao ค่ะ มีอะไรให้แอดมินช่วยบริการเกี่ยวกับ ค้นหาดีล ตรวจสอบของแท้ หรือลงทะเบียนฝากของหรูวันนี้เป็นพิเศษไหมคะ?',
        timestamp: '11:18',
        senderName: 'โบว์ บริการลูกค้า'
      }
    ])
  );

  // Authentication registration lists and active session indicator (default true on first load)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() =>
    getStored('is_logged_in', true)
  );
  const [registeredUsers, setRegisteredUsers] = useState<any[]>(() =>
    getStored('registered_users', [
      {
        username: 'กิตติพัทธ์ ณ บางกอก',
        birthdate: '1998-10-15',
        gender: 'ชาย',
        emailOrTel: '081-345-6789',
        email: 'collector.luxury@paopao.com',
        tel: '081-345-6789',
        password: 'password123',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
      }
    ])
  );

  // --- Write-back storage synchronizers ---
  useEffect(() => { setStored('products', allProducts); }, [allProducts]);
  useEffect(() => { setStored('cart', cart); }, [cart]);
  useEffect(() => { setStored('purchases', purchases); }, [purchases]);
  useEffect(() => { setStored('notifications', notifications); }, [notifications]);
  useEffect(() => { setStored('profile', userProfile); }, [userProfile]);
  useEffect(() => { setStored('address', deliveryAddress); }, [deliveryAddress]);
  useEffect(() => { setStored('is_seller', isRegisteredSeller); }, [isRegisteredSeller]);
  useEffect(() => { setStored('chat_logs', chatMessages); }, [chatMessages]);
  useEffect(() => { setStored('is_logged_in', isLoggedIn); }, [isLoggedIn]);
  useEffect(() => { setStored('registered_users', registeredUsers); }, [registeredUsers]);

  // --- Derived states ---
  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  const activeProducts = allProducts.filter((product) => {
    // Only show approved products
    if (!product.isApproved) return false;

    // Filter by search query if applicable
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        product.name.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        (product.description && product.description.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // --- Functions handler ---

  // Mark all notifications as read
  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Clear all notifications
  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  // Mark single notification as read
  const handleMarkSingleNotificationRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  };

  // Add to Cart Logic
  const handleAddToCart = (product: Product, selectedSize: string, quantity: number) => {
    setCart((prevCart) => {
      // Find matches for same Product ID AND size model option
      const matchIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === selectedSize
      );

      if (matchIndex >= 0) {
        // Increment quantity
        const updated = [...prevCart];
        updated[matchIndex].quantity += quantity;
        return updated;
      } else {
        // Add fresh item sequence
        const newItem: CartItem = {
          id: `${product.id}-${selectedSize.replace(/\s+/g, '')}`,
          product,
          selectedSize,
          quantity,
          isChecked: true, // Auto checked in cart
        };
        return [...prevCart, newItem];
      }
    });
  };

  // Cart: change quantity
  const handleUpdateQuantityInCart = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItemFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
    );
  };

  // Cart: delete individual item
  const handleRemoveItemFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Cart: Toggle individual item check
  const handleToggleCheckInCart = (itemId: string) => {
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, isChecked: !item.isChecked } : item))
    );
  };

  // Cart: Toggle selection for everything in a given shop block
  const handleToggleAllCheckForShop = (shopName: string, isChecked: boolean) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.shopName === shopName ? { ...item, isChecked: isChecked } : item
      )
    );
  };

  // Proceed directly into Checkout layout after selecting items
  const handleProceedToCheckout = () => {
    const validItems = cart.filter((item) => item.isChecked);
    if (validItems.length > 0) {
      setIsCheckingOut(true);
    }
  };

  // Place order from Checkout Page
  const handlePlaceOrder = (details: {
    items: CartItem[];
    receiver: ReceiverInfo;
    paymentMethod: 'cod' | 'bank';
    discountCode: string;
    discountValue: number;
    shippingFee: number;
    grandTotal: number;
  }) => {
    // Generate order sequence
    const orderId = `PP-${Math.floor(10000 + Math.random() * 90000)}`;

    const purchasesGroupedByShop: Purchase[] = [];

    // Group items by shop to create partitioned orders since they are shipped separately by shop
    const shopMap: { [shop: string]: CartItem[] } = {};
    details.items.forEach((item) => {
      const shop = item.product.shopName || 'ร้านค้าทั่วไป';
      if (!shopMap[shop]) shopMap[shop] = [];
      shopMap[shop].push(item);
    });

    Object.keys(shopMap).forEach((shop, index) => {
      const shopItems = shopMap[shop];
      const shopItemsTotal = shopItems.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
      
      // Calculate fraction of discount for this shop chunk
      const ratio = shopItemsTotal / details.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
      const allocatedDiscount = Math.round(details.discountValue * ratio);
      const allocatedTotal = Math.max(0, shopItemsTotal + 80 - allocatedDiscount);

      const newPurchase: Purchase = {
        id: `${orderId}-${index + 1}`,
        shopName: shop,
        items: shopItems.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          size: item.selectedSize,
          image: item.product.image,
        })),
        status: 'awaiting', // รอสินค้าจัดส่ง (Awaiting Shipment)
        totalAmount: allocatedTotal,
        receiverInfo: details.receiver,
        paymentMethod: details.paymentMethod,
        trackingNumber: `TH-PAO-${Math.floor(200000 + Math.random() * 800000)}`,
        date: new Date().toISOString().split('T')[0],
      };

      purchasesGroupedByShop.push(newPurchase);

      // Increment sale count of original products
      setAllProducts((prevProds) =>
        prevProds.map((p) => {
          const matchingItem = shopItems.find((itm) => itm.product.id === p.id);
          if (matchingItem) {
            return {
              ...p,
              salesCount: p.salesCount + matchingItem.quantity,
            };
          }
          return p;
        })
      );
    });

    // Add back to purchases history
    setPurchases((prev) => [...purchasesGroupedByShop, ...prev]);

    // Construct magnificent order confirm notification
    const orderConfirmNotification: Notification = {
      id: `notif-${Math.random()}`,
      type: 'order',
      title: 'จัดทำใบสั่งซื้อพัสดุสำเร็จ',
      body: `คำสั่งซื้อออเดอร์หมายเลขอ้างอิง ${orderId} รวมจำนวน ${details.items.length} ชิ้น ได้ยืนยันเข้าระบบสำนักงานใหญ่แล้ว ได้รับอารักขาแท้แน่นอน!`,
      timestamp: 'เมื่อครู่',
      image: details.items[0].product.image,
      isRead: false,
    };

    setNotifications((prev) => [orderConfirmNotification, ...prev]);

    // Delete checked items from current shopping cart
    const checkedItemIds = details.items.map((i) => i.id);
    setCart((prev) => prev.filter((item) => !checkedItemIds.includes(item.id)));

    // Reset checkout mode state
    setIsCheckingOut(false);
    
    // REDIRECT client straight to 'purchases' tab on 'Awaiting Shipment' subtab
    setActiveTab('purchases');
  };

  // Immediate Customer Cancellations (Awaiting items only)
  const handleCancelPurchase = (purchaseId: string) => {
    setPurchases((prev) =>
      prev.map((pc) => (pc.id === purchaseId ? { ...pc, status: 'cancelled' } : pc))
    );

    const targetPurchase = purchases.find((p) => p.id === purchaseId);
    
    // Construct cancel notification
    const cancelNotification: Notification = {
      id: `notif-${Math.random()}`,
      type: 'cancel',
      title: 'ยกเลิกออเดอร์จัดส่งสำเร็จ',
      body: `คุณได้กดยกเลิกสินค้าพัสดุจากออเดอร์กลุ่ม ${purchaseId} เรียบร้อยแล้ว ยอดเงินที่จ่ายล่วงหน้าจะกลับเข้าบัญชีสะสมทันที`,
      timestamp: 'เมื่อครู่',
      image: targetPurchase?.items[0]?.image,
      isRead: false,
    };

    setNotifications((prev) => [cancelNotification, ...prev]);
  };

  // Simulated confirmation of receiving item
  const handleReceivePurchase = (purchaseId: string) => {
    setPurchases((prev) =>
      prev.map((pc) => (pc.id === purchaseId ? { ...pc, status: 'completed' } : pc))
    );

    const targetPurchase = purchases.find((p) => p.id === purchaseId);

    // Completed notification
    const compNotification: Notification = {
      id: `notif-${Math.random()}`,
      type: 'shipment',
      title: 'คุณยืนยันรับกล่องพัสดุเรียบร้อย',
      body: `พัสดุพาร์ทนเนอร์ ${purchaseId} ได้รับสิทธิ์จัดส่งเสร็จสิ้นสมบูรณ์แล้ว ขอขอบพระคุณที่ร่วมไว้วางใจใช้บริการของ paopao`,
      timestamp: 'เมื่อครู่',
      image: targetPurchase?.items[0]?.image,
      isRead: false,
    };

    setNotifications((prev) => [compNotification, ...prev]);
  };

  // Seller registration complete
  const handleRegisterSeller = (realName: string, realSurname: string) => {
    setIsRegisteredSeller(true);
    
    // Send welcome seller notification
    const sellerNotif: Notification = {
      id: `notif-seller-${Math.random()}`,
      type: 'order',
      title: 'เปิดสิทธิ์พรีเมียมผู้ฝากขาย!',
      body: `ยินดีต้อนรับคุณ ${realName} เข้าสู่สหกรณ์ผู้ฝากขายระดับประเทศ บัดนี้คุณสามารถโพสต์ลงรายการสินค้าใดๆ ก็ได้ทันที`,
      timestamp: 'เมื่อครู่',
      isRead: false,
    };
    setNotifications((prev) => [sellerNotif, ...prev]);
  };

  // Submitting Custom Consignment Products (Initially waiting admin approval)
  const handleRegisterProduct = (prodData: Omit<Product, 'id' | 'shopId' | 'shopName' | 'ratings' | 'salesCount' | 'rating' | 'isApproved'>) => {
    const rawId = `custom-prod-${Date.now()}`;
    const newProduct: Product = {
      ...prodData,
      id: rawId,
      shopId: 'custom-shop',
      shopName: `${userProfile.username} Boutique`,
      salesCount: 0,
      rating: 5.0,
      isApproved: false, // Must be approved by admin simulation!
    };

    setAllProducts((prev) => [newProduct, ...prev]);

    // Send admin check request alert
    const checkAlert: Notification = {
      id: `notif-check-${Math.random()}`,
      type: 'order',
      title: 'ยื่นตรวจสอบคุณภาพพัสดุใหม่',
      body: `สินค้า "${prodData.name}" อยู่ในห้องตรวจสอบแท้โดยคลัง แอดมินจะกดยืนยันใบอนุมัติชิ้นนี้นานสุดไม่เกิน 5 วินาทีค่ะ`,
      timestamp: 'เมื่อครู่',
      image: prodData.image,
      isRead: false,
    };
    setNotifications((prev) => [checkAlert, ...prev]);
  };

  // ADMIN Simulation Center: Approving products immediately to help testing
  const handleApproveProductByAdmin = (productId: string) => {
    setAllProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, isApproved: true } : p))
    );

    const matchProd = allProducts.find((p) => p.id === productId);

    // Notification of success approval
    const approveNotif: Notification = {
      id: `notif-approved-${Math.random()}`,
      type: 'shipment',
      title: 'สินค้าฝากขายของคุณ "อนุมัติเรียบร้อย"',
      body: `แอดมินอนุมัติผ่านเกณฑ์คุณภาพเรียบร้อยแล้ว สินค้า "${matchProd?.name}" ของคุณวางขายบนแถวหน้าร้านค้า paopao ทันที!`,
      timestamp: 'เมื่อครู่',
      image: matchProd?.image,
      isRead: false,
    };
    setNotifications((prev) => [approveNotif, ...prev]);
  };

  // Support Chat Message handler with smart responses simulation
  const handleSendMessage = (text: string) => {
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toTimeString().split(' ')[0].substring(0, 5),
      senderName: userProfile.username.split(' ')[0],
    };

    setChatMessages((prev) => [...prev, userMsg]);

    // Automatic luxury bot responder simulation
    setTimeout(() => {
      let replyText = 'ข้อมูลของคุณส่งถึงทีมแอดมินระดับสูงสุดของสมาคมแล้วค่ะ ทางเรากำลังดำเนินการตรวจสอบและตอบกลับคุณโดยเร็วที่สุดค่ะ';
      const cleanText = text.toLowerCase();

      if (cleanText.includes('แท้') || cleanText.includes('ตรวจสอบ') || cleanText.includes('สแกน') || cleanText.includes('แท้ไหม')) {
        replyText = 'ขอให้ความมั่นใจว่า สินค้าฝากขายพรีเมียมทุกชิ้นบนแพลตฟอร์ม paopao ผ่านการขึงตรวจอย่างเข้มข้นตรงตามมาตรฐานวิชาชีพ มั่นใจได้ของแท้เลอค่าแน่นอนค่ะ';
      } else if (cleanText.includes('ราคา') || cleanText.includes('ลด') || cleanText.includes('โปรโมชั่น') || cleanText.includes('โค้ด')) {
        replyText = 'สามารถร่วมฉลองบัตรกำนัลสมาคมโดยพิมพ์คูปอง "PAOPAOEXCLUSIVELY" ที่หน้าจายกเพื่อรับส่วนลด 15% นะคะ!';
      } else if (cleanText.includes('สมัคร') || cleanText.includes('ขาย') || cleanText.includes('ร้านค้า') || cleanText.includes('เปิดร้าน')) {
        replyText = 'เปิดบูติกขายได้ง่ายๆ ทันทีที่แท็บ "โปรไฟล์ & ร้านค้า" ด้านล่าง เพียงกดยืนยันตนก็ฝากขายพัสดุชิ้นเอกได้ภายใน 2 นาทีค่ะ';
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'admin',
        text: replyText,
        timestamp: new Date().toTimeString().split(' ')[0].substring(0, 5),
        senderName: 'สมาคม แอดมิน paopao VIP',
      };
      setChatMessages((prev) => [...prev, botMsg]);
    }, 1200);
  };

  return (
    <div 
      className="min-h-screen bg-[#fcfbf9] flex flex-col items-center justify-start transition-all duration-300 w-full"
      id="root-viewport-assembly"
    >
      
      {/* Main Framework Layout Container */}
      <div 
        className="w-full flex flex-col bg-white flex-1 max-w-7xl mx-auto border-x border-stone-100/80 shadow-xs relative"
        id="frame-wrapper"
      >
        {/* Main-view container */}
        <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-24" id="immersive-main-view">
          
          {/* Header component */}
          <Header 
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setIsCheckingOut(false); // Cancel checkout mode on tab hop
            }}
            searchQuery={searchQuery}
            setSearchQuery={(q) => {
              setSearchQuery(q);
              if (activeTab !== 'marketplace') {
                setActiveTab('marketplace'); // Jump to main market to show results immediately!
              }
            }}
            cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
            unreadNotificationsCount={unreadNotificationsCount}
            openChatWithAdmin={() => setIsChatOpen(true)}
            isSellerMode={isRegisteredSeller}
          />

        {/* Dynamic content view box */}
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-32" id="dynamic-main-content">
          
          {/* A. PRODUCT MARKETPLACE TAB */}
          {activeTab === 'marketplace' && !isCheckingOut && (
            <div className="space-y-8 animate-fade-in" id="marketplace-tab">
              
              {/* Luxury Hero Banner Carousel */}
              <div className="bg-gradient-to-br from-brand-purple via-brand-purple-dark to-stone-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-purple-900 shadow-md">
                
                {/* Background ambient lighting blobs */}
                <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-brand-orange opacity-15 blur-3xl" />
                <div className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full bg-purple-500 opacity-10 blur-3xl" />

                <div className="max-w-lg space-y-4 relative z-10">
                  <span className="inline-flex items-center gap-1.5 bg-brand-orange-light/10 text-brand-gold text-[10px] font-extrabold uppercase px-3.5 py-1.5 rounded-full border border-brand-orange/20 tracking-widest font-display">
                    <Sparkles size={11} className="fill-brand-gold text-brand-gold animate-pulse" />
                    <span>paopao consignment alliance</span>
                  </span>
                  
                  <h1 className="text-2xl sm:text-4xl font-serif font-semibold tracking-wide leading-tight">
                    พื้นที่ส่งต่อของกิฟท์แท้ <br />
                    <span className="bg-gradient-to-r from-brand-gold to-brand-orange bg-clip-text text-transparent font-bold">เรียบหรู เลอค่า วางใจได้</span>
                  </h1>

                  <p className="text-xs text-stone-300 leading-relaxed">
                    ค้นหาและแลกเปลี่ยนกระเป๋าถือหรูหรา นาฬิกาทองวินเทจ และของสะสมดีไซน์ชั้นนำผ่านการสแกนแท้แบบไร้ที่ติ ใครก็เปิดบูติกวางขายพัสดุได้ง่ายภายในวันเดียว
                  </p>

                  <div className="pt-2 flex flex-wrap gap-4 items-center">
                    <button 
                      onClick={() => setActiveTab('profile')} 
                      className="px-5 py-2.5 bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold rounded-full transition-all shadow-md shadow-brand-orange/20 cursor-pointer"
                    >
                      เปิดร้านขายพัสดุหรูของฉัน
                    </button>
                    <div className="text-[10px] text-stone-300 font-medium">
                      อนุมัติไวโดยคลังแพทย์สแกนแท้ 24 ชม.
                    </div>
                  </div>
                </div>
              </div>

              {/* Title Header with Counter */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-2 pb-4 border-b border-stone-200/60" id="marketplace-results-header">
                <div>
                  <h2 className="text-xl font-display font-semibold text-stone-900 tracking-tight">
                    {searchQuery.trim() ? `ผลการค้นหาสำหรับ "${searchQuery}"` : 'คอลเลกชันสินค้าวางขายล่าสุด'}
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    แสดงเฉพาะสินค้าแอปพรูฟตรงเกรดพรีเมียม ยิ่งช้อปยิ่งสะสมแต้มแรร์ไอเทม
                  </p>
                </div>

                <div className="text-xs text-stone-500 font-medium shrink-0">
                  พบทั้งหมด <span className="text-brand-purple font-bold font-mono">{activeProducts.length}</span> รายการสินค้าเลอค่า
                </div>
              </div>

              {/* Grid of Product Cards */}
              {activeProducts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-stone-100 p-6" id="collection-no-results">
                  <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center text-stone-300 mx-auto mb-3">
                    <ShoppingBasket size={22} />
                  </div>
                  <h3 className="text-sm font-semibold text-stone-700">ไม่มีรายการสินค้าที่ตรงกับคำค้นหาของคุณ</h3>
                  <p className="text-xs text-stone-400 mt-1">
                    ทดลองค้นหาโดยพิมพ์ "กระเป๋า", "น้ำหอม", "นาฬิกา" หรือลงผลิตภัณฑ์ชิ้นใหม่เข้าสู่ตลาดได้เองที่เมนูโปรไฟล์เสรี
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8" id="product-display-grid">
                  {activeProducts.map((prod) => (
                    <ProductCard 
                      key={prod.id}
                      product={prod}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              )}

            </div>
          )}

          {/* B. CART VIEW (TABS TO CART OR CHECKOUT STATE) */}
          {activeTab === 'cart' && (
            <div className="space-y-2 animate-fade-in" id="cart-tab-view">
              {!isCheckingOut ? (
                // Shopping Cart Page
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-display font-semibold text-stone-900">ตะกร้าสินค้าของฉัน</h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      กลุ่มผู้ตอบสนองดีพาร์ทเมนท์พรีเมียม จะจัดแยกสินค้าส่งตรงจากผู้ประมูลฝากขายของคุณ
                    </p>
                  </div>

                  <CartTab 
                    cartItems={cart}
                    onUpdateQuantity={handleUpdateQuantityInCart}
                    onRemoveItem={handleRemoveItemFromCart}
                    onToggleCheck={handleToggleCheckInCart}
                    onToggleAllCheckForShop={handleToggleAllCheckForShop}
                    onProceedToCheckout={handleProceedToCheckout}
                    onNavigateToMarketplace={() => setActiveTab('marketplace')}
                  />
                </div>
              ) : (
                // Checkout Flow View Page
                <CheckoutView 
                  checkedItems={cart.filter((item) => item.isChecked)}
                  receiverProfile={deliveryAddress}
                  onBackToCart={() => setIsCheckingOut(false)}
                  onPlaceOrder={handlePlaceOrder}
                />
              )}
            </div>
          )}

          {/* C. NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="animate-fade-in" id="notifications-tab-view">
              <NotificationsTab 
                notifications={notifications}
                onMarkAllAsRead={handleMarkAllNotificationsRead}
                onClearAll={handleClearAllNotifications}
                onMarkSingleAsRead={handleMarkSingleNotificationRead}
              />
            </div>
          )}

          {/* D. MY PURCHASES TAB */}
          {activeTab === 'purchases' && (
            <div className="space-y-6 animate-fade-in" id="purchases-tab-view">
              <div>
                <h2 className="text-lg font-display font-semibold text-stone-900">การซื้อสะสมของฉัน</h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  ติดตามอัปเดตสิทธิ์การจัดส่งกล่องโบว์ของคุณแบบเรียลไทม์
                </p>
              </div>

              <MyPurchasesTab 
                purchases={purchases}
                onCancelPurchase={handleCancelPurchase}
                onReceivePurchase={handleReceivePurchase}
              />
            </div>
          )}

          {/* E. USER PROFILE & SELLER CONTAINER */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fade-in" id="profile-tab-view">
              <div>
                <h2 className="text-lg font-display font-semibold text-stone-900">
                  {!isLoggedIn ? 'สมัครสมาชิก & เข้าสู่ระบบสมาคม' : 'การจัดการบัญชี & สิทธิเปิดบูติกร้านค้า'}
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  {!isLoggedIn 
                    ? 'กรุณาเข้าสู่ระบบเพื่อเข้าถึงสิทธิ์การฝากของขาย ดีลสะสมพรีเมียม และประวัติการจัดส่งพัสดุหรู' 
                    : 'ยินดีต้อนรับสมาชิกสมาคมสะสมแพลตฟอร์ม คุณสามารถกรอกสัญญาสมัครเพื่อเปิดสิทธิ์ลงฝากของขายร่วมกันได้'}
                </p>
              </div>

              {!isLoggedIn ? (
                <AuthScreen 
                  onLoginSuccess={(profile) => {
                    setUserProfile(profile);
                    setIsLoggedIn(true);
                  }}
                  registeredUsers={registeredUsers}
                  onAddNewUser={(newUser) => {
                    setRegisteredUsers((prev) => [...prev, newUser]);
                  }}
                />
              ) : (
                <ProfileDashboard 
                  userProfile={userProfile}
                  onSaveProfile={setUserProfile}
                  onLogout={() => setIsLoggedIn(false)}
                  deliveryAddress={deliveryAddress}
                  onSaveAddress={setDeliveryAddress}
                  isRegisteredSeller={isRegisteredSeller}
                  onRegisterSeller={handleRegisterSeller}
                  onSubmitProduct={handleRegisterProduct}
                  customProducts={allProducts.filter((p) => p.shopId === 'custom-shop')}
                  onApproveProductByAdmin={handleApproveProductByAdmin}
                  onOpenChat={() => setIsChatOpen(true)}
                />
              )}
            </div>
          )}

        </main>

        {/* Footer component */}
        <Footer />

        {/* Live Support Floating Chat component with Bow responder */}
        <LiveSupportChat 
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          messages={chatMessages}
          onSendMessage={handleSendMessage}
        />

        {/* Premium Bottom Navigation bar (fixed bottom responsive for PC, Tablet & Mobile) */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-brand-purple via-purple-950 to-brand-purple-dark text-white border-t border-purple-800/40 shadow-[0_-10px_35px_rgba(0,0,0,0.18)] backdrop-blur-md" id="luxury-bottom-nav">
          <div className="max-w-7xl mx-auto px-1 sm:px-6">
            <div className="flex justify-around items-center h-18 sm:h-20">
              {[
                { id: 'marketplace', label: 'หน้าแรก', icon: Home, badge: 0 },
                { id: 'cart', label: 'ตะกร้าสินค้า', icon: ShoppingBag, badge: cart.reduce((sum, item) => sum + item.quantity, 0) },
                { id: 'notifications', label: 'แจ้งเตือน', icon: Bell, badge: unreadNotificationsCount },
                { id: 'purchases', label: 'การซื้อของฉัน', icon: ClipboardList, badge: purchases.filter(p => p.status === 'shipping' || p.status === 'placed').length },
                { id: 'profile', label: 'โปรไฟล์ & ร้านค้า', icon: User, badge: 0 },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsCheckingOut(false);
                    }}
                    className={`relative flex flex-col items-center justify-center flex-1 h-full py-2 px-1 text-center transition-all duration-300 group cursor-pointer ${
                      isActive 
                        ? 'text-brand-gold font-bold scale-102' 
                        : 'text-stone-300 hover:text-white'
                    }`}
                    id={`bottom-nav-${tab.id}`}
                  >
                    <div className={`p-1.5 sm:p-2 rounded-2xl transition-all duration-200 ${
                      isActive ? 'bg-gradient-to-tr from-brand-orange-light/20 to-brand-orange/10 text-brand-gold shadow-sm' : 'group-hover:bg-white/5'
                    }`}>
                      <Icon size={20} className={`sm:w-6 sm:h-6 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                    </div>
                    
                    <span className="text-[9px] sm:text-[11px] font-medium tracking-tight mt-1 truncate max-w-full">
                      {tab.label}
                    </span>

                    {/* Badge counts */}
                    {tab.badge > 0 ? (
                      <span className="absolute top-1 right-1/2 translate-x-4 sm:translate-x-6 flex h-4 sm:h-5 w-4 sm:w-5 items-center justify-center rounded-full bg-brand-orange text-white text-[8px] sm:text-[10px] font-extrabold ring-2 ring-brand-purple animate-pulse">
                        {tab.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        </div> {/* Closing tag for #immersive-main-view */}

      </div>
    </div>
  );
}
