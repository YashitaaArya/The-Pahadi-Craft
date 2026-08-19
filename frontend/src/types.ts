export interface ProductColorVariant {
  colorName: string;
  hexCode: string;
  images: string[];
  stock: number;
  sku: string;
}

export interface ProductFragranceVariant {
  fragranceName: string;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  // Legacy single-level category fields - kept so nothing already saved breaks.
  // New products should use mainCategory/primeSubcategory/secondarySubcategory instead.
  category: string;
  subcategory?: string;
  mainCategory?: string;
  primeSubcategory?: string;
  secondarySubcategory?: string;
  scented?: boolean;
  size?: string;
  material?: string;
  numberOfItems?: number;
  volume?: string;
  Weight?: string;
  colorVariants?: ProductColorVariant[];
  fragranceVariants?: ProductFragranceVariant[];
  selectedColorVariant?: ProductColorVariant;
  selectedFragranceVariant?: ProductFragranceVariant;
  fragranceNotes?: string[];
  ingredients?: string[];
  burnTime?: string;
  weight?: string;
  stock: number;
  sku: string;
  additionalImages?: string[];
  addtionalImages?: string[]; // Handle typo in some products
  featured?: boolean;
  trending?: boolean;
  ratings?: number;
  reviewCount?: number;
  orderCount?: number;
  tags?: string[];
  artisanInfo?: string;
  discount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface NavLink {
  path: string;
  label: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  category: string;
  tags?: string[];
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  featured?: boolean;
  status?: 'draft' | 'published';
  views?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Fragrance {
  id: string;
  name: string;
  description: string;
  mood: string;
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
  image: string;
}

export interface CustomOrder {
  fragrance: string;
  size: string;
  container: string;
  label: string;
  quantity: number;
  specialInstructions: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer' | 'moderator';
  createdAt: string;
  avatar?: string;
  phone?: string;
  status?: 'active' | 'blocked' | 'inactive';
}

export interface AdminUser extends User {
  role: 'admin' | 'moderator';
  adminRole: 'developer' | 'owner' | 'sales';
  permissions: string[];
  lastLogin?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: 'pending' | 'processing' | 'dispatched' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  shippingAddress: Address;
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  updatedAt?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  trackingNumber?: string;
  statusHistory?: OrderStatusUpdate[];
}

export interface OrderStatusUpdate {
  status: Order['status'];
  changedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  status: string;
  clientSecret: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt?: string;
  verified?: boolean;
}

export interface Feedback {
  id: string;
  userId: string;
  userEmail: string;
  category: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'responded';
  response?: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  images: string[];
  content: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  description?: string;
  image: string;
  link?: string;
  startDate: string;
  endDate: string;
  active: boolean;
  position: number;
}

export interface Analytics {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalCustomers: number;
  recentOrders: Order[];
  topProducts: Product[];
  salesTrend: SalesTrend[];
  userGrowth: UserGrowth[];
}

export interface SalesTrend {
  date: string;
  sales: number;
  revenue: number;
  orders: number;
}

export interface UserGrowth {
  date: string;
  newUsers: number;
  totalUsers: number;
}

export interface DashboardMetric {
  label: string;
  value: string | number;
  change: number;
  icon: string;
  trend: 'up' | 'down' | 'neutral';
}