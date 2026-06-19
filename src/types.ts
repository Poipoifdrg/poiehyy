export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  shopId: string;
  shopName: string;
  category: string;
  sizes: string[];
  salesCount: number;
  rating: number;
  isApproved: boolean;
  isCustomAdded?: boolean;
}

export interface CartItem {
  id: string; // unique cart item id (productId + size)
  product: Product;
  selectedSize: string;
  quantity: number;
  isChecked: boolean;
}

export interface Shop {
  id: string;
  name: string;
  ownerName: string;
  isVerified: boolean;
  joinedDate: string;
  bannerColor: string;
}

export interface Notification {
  id: string;
  type: 'order' | 'cancel' | 'shipment';
  title: string;
  body: string;
  timestamp: string;
  image?: string;
  isRead?: boolean;
}

export interface ReceiverInfo {
  name: string;
  tel: string;
  address: string;
  postalCode: string;
}

export interface Purchase {
  id: string;
  shopName: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    size: string;
    image: string;
  }[];
  status: 'awaiting' | 'shipping' | 'completed' | 'cancelled';
  totalAmount: number;
  receiverInfo: ReceiverInfo;
  paymentMethod: 'cod' | 'bank';
  trackingNumber: string;
  date: string;
}

export interface UserProfile {
  username: string;
  tel: string;
  gender: string;
  birthdate: string;
  email: string;
  avatarUrl: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'admin' | 'merchant';
  text: string;
  timestamp: string;
  senderName: string;
}
