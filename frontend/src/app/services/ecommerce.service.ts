import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of, catchError } from 'rxjs';
import { Product, CartItem, WishlistItem, Address, Order } from '../models/ecommerce.model';
import { AuthService, getApiUrl } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EcommerceService {
  private get apiUrl(): string {
    return getApiUrl();
  }

  products = signal<Product[]>([]);
  cartItems = signal<CartItem[]>([]);
  wishlistItems = signal<WishlistItem[]>([]);
  addresses = signal<Address[]>([]);
  orders = signal<Order[]>([]);

  constructor(private http: HttpClient, private auth: AuthService) {}

  fetchProducts(categorySlug?: string, search?: string, sort?: string): Observable<Product[]> {
    let query = `${this.apiUrl}/products?`;
    if (categorySlug && categorySlug !== 'all') query += `category=${categorySlug}&`;
    if (search) query += `search=${encodeURIComponent(search)}&`;
    if (sort) query += `sort=${sort}`;

    return this.http.get<Product[]>(query).pipe(
      tap(res => this.products.set(res))
    );
  }

  getProduct(idOrSlug: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${idOrSlug}`);
  }

  createProduct(data: any): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, data).pipe(
      tap(() => this.fetchProducts().subscribe())
    );
  }

  updateProduct(id: string, data: any): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, data).pipe(
      tap(() => this.fetchProducts().subscribe())
    );
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${id}`).pipe(
      tap(() => this.fetchProducts().subscribe())
    );
  }

  private getGuestCart(): CartItem[] {
    try {
      const stored = localStorage.getItem('jhulki_guest_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveGuestCart(items: CartItem[]): void {
    try {
      localStorage.setItem('jhulki_guest_cart', JSON.stringify(items));
    } catch {}
  }

  fetchCart(): Observable<CartItem[]> {
    const user = this.auth.getUser();
    if (!user) {
      const guestItems = this.getGuestCart();
      this.cartItems.set(guestItems);
      return of(guestItems);
    }

    // Sync any guest cart items to backend if user just logged in
    const guestItems = this.getGuestCart();
    if (guestItems.length > 0) {
      localStorage.removeItem('jhulki_guest_cart');
      // Fire-and-forget sync each item
      guestItems.forEach(item => {
        this.http.post(`${this.apiUrl}/cart`, {
          userId: user.id,
          productId: item.productId,
          size: item.size,
          quantity: item.quantity
        }).subscribe();
      });
    }

    return this.http.get<CartItem[]>(`${this.apiUrl}/cart?userId=${user.id}`).pipe(
      tap(res => this.cartItems.set(res))
    );
  }

  addToCart(productId: string, size: string, quantity: number = 1): Observable<any> {
    const product = this.products().find(p => p.id === productId);
    const user = this.auth.getUser();

    if (!user) {
      // Guest User local fast optimistic update
      let items = [...this.cartItems()];
      const existingIndex = items.findIndex(i => i.productId === productId && i.size === size);

      if (existingIndex > -1) {
        const newQty = items[existingIndex].quantity + quantity;
        if (newQty <= 0) {
          items.splice(existingIndex, 1);
        } else {
          items[existingIndex] = { ...items[existingIndex], quantity: newQty };
        }
      } else if (quantity > 0) {
        const newItem: CartItem = {
          id: 'guest-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
          userId: 'guest',
          productId,
          product: product || ({ id: productId, name: 'Couture Item', price: 0, images: [] } as any),
          size,
          quantity
        };
        items.push(newItem);
      }

      this.cartItems.set(items);
      this.saveGuestCart(items);
      return of(items);
    }

    // Logged in User - Optimistic local signal update first for instant responsiveness
    let items = [...this.cartItems()];
    const existingIndex = items.findIndex(i => i.productId === productId && i.size === size);

    if (existingIndex > -1) {
      const newQty = items[existingIndex].quantity + quantity;
      if (newQty <= 0) {
        items.splice(existingIndex, 1);
      } else {
        items[existingIndex] = { ...items[existingIndex], quantity: newQty };
      }
    } else if (quantity > 0) {
      const newItem: CartItem = {
        id: 'temp-' + Date.now(),
        userId: user.id,
        productId,
        product: product || ({ id: productId, name: 'Couture Item', price: 0, images: [] } as any),
        size,
        quantity
      };
      items.push(newItem);
    }
    this.cartItems.set(items);

    // Backend sync in background
    return this.http.post<CartItem>(`${this.apiUrl}/cart`, {
      userId: user.id,
      productId,
      size,
      quantity
    }).pipe(
      tap(() => this.fetchCart().subscribe())
    );
  }

  removeFromCart(cartItemId: string): Observable<any> {
    const user = this.auth.getUser();

    if (!user) {
      let items = this.cartItems().filter(i => i.id !== cartItemId);
      this.cartItems.set(items);
      this.saveGuestCart(items);
      return of(items);
    }

    let items = this.cartItems().filter(i => i.id !== cartItemId);
    this.cartItems.set(items);

    return this.http.delete(`${this.apiUrl}/cart?id=${cartItemId}`).pipe(
      tap(() => this.fetchCart().subscribe())
    );
  }

  fetchWishlist(): Observable<WishlistItem[]> {
    const user = this.auth.getUser();
    if (!user) return new Observable(obs => obs.next([]));
    return this.http.get<WishlistItem[]>(`${this.apiUrl}/wishlist?userId=${user.id}`).pipe(
      tap(res => this.wishlistItems.set(res))
    );
  }

  toggleWishlist(productId: string): Observable<any> {
    const user = this.auth.getUser();
    if (!user) throw new Error('User not logged in');

    return this.http.post(`${this.apiUrl}/wishlist`, {
      userId: user.id,
      productId
    }).pipe(
      tap(() => this.fetchWishlist().subscribe())
    );
  }

  isProductWishlisted(productId: string): boolean {
    return this.wishlistItems().some(w => w.productId === productId);
  }

  fetchAddresses(): Observable<Address[]> {
    const user = this.auth.getUser();
    if (!user) return of([]);
    return this.http.get<Address[]>(`${this.apiUrl}/address?userId=${user.id}`).pipe(
      tap(res => {
        let finalAddrs = [...res];
        const savedProfile = localStorage.getItem(`jhulki_profile_${user.id}`);
        if (savedProfile) {
          try {
            const p = JSON.parse(savedProfile);
            if (p.address || p.postalCode || p.phone) {
              const profileAddr: Address = {
                id: 'profile-saved-addr',
                userId: user.id,
                title: 'Profile Saved Address',
                fullName: p.fullName || user.fullName,
                street: p.address || 'Marine Drive',
                city: 'Mumbai',
                state: 'Maharashtra',
                postalCode: p.postalCode || '400021',
                country: 'India',
                phone: p.phone || '+91 98201 99881',
                isDefault: finalAddrs.length === 0
              };
              if (!finalAddrs.some(a => a.street === profileAddr.street && a.postalCode === profileAddr.postalCode)) {
                finalAddrs.unshift(profileAddr);
              }
            }
          } catch (e) {}
        }
        this.addresses.set(finalAddrs);
      }),
      catchError(() => {
        const savedProfile = localStorage.getItem(`jhulki_profile_${user.id}`);
        if (savedProfile) {
          try {
            const p = JSON.parse(savedProfile);
            const profileAddr: Address = {
              id: 'profile-saved-addr',
              userId: user.id,
              title: 'Profile Saved Address',
              fullName: p.fullName || user.fullName,
              street: p.address || 'Marine Drive',
              city: 'Mumbai',
              state: 'Maharashtra',
              postalCode: p.postalCode || '400021',
              country: 'India',
              phone: p.phone || '+91 98201 99881',
              isDefault: true
            };
            this.addresses.set([profileAddr]);
            return of([profileAddr]);
          } catch (e) {}
        }
        return of([]);
      })
    );
  }

  addAddress(address: Partial<Address>): Observable<Address> {
    const user = this.auth.getUser();
    if (!user) throw new Error('User not logged in');

    return this.http.post<Address>(`${this.apiUrl}/address`, {
      ...address,
      userId: user.id
    }).pipe(
      tap(() => this.fetchAddresses().subscribe())
    );
  }

  registerGuestAndCreateAddress(guestData: { email: string; phone: string; fullName: string; street: string; city: string; state: string; postalCode: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/guest-checkout`, guestData).pipe(
      tap((res: any) => {
        if (res.token && res.user) {
          this.auth.setSession(res.token, res.user);
        }
      })
    );
  }

  createRazorpayOrder(amountInPaise: number, receipt?: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/razorpay/create-order`, {
      amount: amountInPaise,
      currency: 'INR',
      receipt
    });
  }

  verifyRazorpayPayment(razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/razorpay/verify-payment`, {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });
  }

  checkoutOrder(totalAmount: number, shippingAddress: Address, paymentMethod: string): Observable<Order> {
    const user = this.auth.getUser();
    if (!user) throw new Error('User details are required for order placement');

    const currentItems = [...this.cartItems()];

    return this.http.post<Order>(`${this.apiUrl}/orders`, {
      userId: user.id,
      items: currentItems,
      totalAmount,
      shippingAddress,
      paymentMethod
    }).pipe(
      tap(() => {
        localStorage.removeItem('jhulki_guest_cart');
        this.cartItems.set([]);
        this.fetchCart().subscribe();
        this.fetchOrders().subscribe();
      })
    );
  }

  fetchOrders(): Observable<Order[]> {
    const user = this.auth.getUser();
    if (!user) return new Observable(obs => obs.next([]));
    return this.http.get<Order[]>(`${this.apiUrl}/orders?userId=${user.id}`).pipe(
      tap(res => this.orders.set(res))
    );
  }

  fetchAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`).pipe(
      tap(res => this.orders.set(res))
    );
  }

  updateOrderTracking(id: string, trackingId: string, status?: string, isBalancePaid?: boolean, expectedDeliveryDate?: string, shippedAt?: string, orderNumber?: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/orders`, { id, orderNumber, trackingId, status, isBalancePaid, expectedDeliveryDate, shippedAt }).pipe(
      tap(updated => {
        this.orders.update(list => list.map(o => (o.id === id || (orderNumber && o.orderNumber === orderNumber)) ? { ...o, ...updated } : o));
      })
    );
  }

  fetchAdminMetrics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/metrics`);
  }

  isSaleActive(product: Product): boolean {
    if (!product.isSaleEnabled) return false;
    if (!product.salePrice || product.salePrice >= product.price) return false;
    const now = new Date().getTime();
    if (product.saleStartTime && now < new Date(product.saleStartTime).getTime()) return false;
    if (product.saleEndTime && now > new Date(product.saleEndTime).getTime()) return false;
    return true;
  }

  getEffectivePrice(product: Product): number {
    return this.isSaleActive(product) ? (product.salePrice as number) : product.price;
  }

  getDiscountPercentage(product: Product): number {
    if (!product.salePrice || product.price <= 0) return 0;
    return Math.round(((product.price - product.salePrice) / product.price) * 100);
  }

  getSaleCountdownLabel(product: Product): string {
    if (!this.isSaleActive(product)) return '';
    const discount = this.getDiscountPercentage(product);

    if (product.saleEndTime) {
      const now = new Date().getTime();
      const end = new Date(product.saleEndTime).getTime();
      const diffMs = end - now;

      if (diffMs > 0) {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        if (diffHours >= 24) {
          const diffDays = Math.floor(diffHours / 24);
          return `${discount}% OFF • Sale ends in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
        } else if (diffHours >= 1) {
          return `${discount}% OFF • Sale ends in ${diffHours} hr${diffHours > 1 ? 's' : ''}`;
        } else {
          return `${discount}% OFF • Sale ends in ${Math.max(1, diffMins)} min${diffMins > 1 ? 's' : ''}`;
        }
      }
    }

    return discount > 0 ? `${discount}% OFF` : 'LIMITED SALE';
  }

  // Calculate Cart Subtotal & BOGO Discount Breakdown
  calculateCartSummary(): { originalSubtotal: number; bogoDiscount: number; finalTotal: number; bogoAppliedPairs: number } {
    const items = this.cartItems();
    let originalSubtotal = 0;

    // Expand items into individual unit prices for BOGO comparison
    const bogoUnits: number[] = [];

    for (const item of items) {
      const unitPrice = this.getEffectivePrice(item.product);
      originalSubtotal += unitPrice * item.quantity;

      if (item.product.isBogoEnabled) {
        for (let i = 0; i < item.quantity; i++) {
          bogoUnits.push(unitPrice);
        }
      }
    }

    // Sort BOGO eligible item prices in descending order (highest value first)
    bogoUnits.sort((a, b) => b - a);

    let bogoDiscount = 0;
    const bogoAppliedPairs = Math.floor(bogoUnits.length / 2);

    // BOGO Rule: For every 2 BOGO items, charge for the higher priced one and discount the lower priced one (100% OFF lower price unit)
    for (let i = 0; i < bogoAppliedPairs; i++) {
      const freeItemPrice = bogoUnits[bogoUnits.length - 1 - i]; // Discount lower price unit
      bogoDiscount += freeItemPrice;
    }

    const finalTotal = Math.max(0, originalSubtotal - bogoDiscount);

    return {
      originalSubtotal,
      bogoDiscount,
      finalTotal,
      bogoAppliedPairs
    };
  }
}
