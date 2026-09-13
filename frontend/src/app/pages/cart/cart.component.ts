import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EcommerceService } from '../../services/ecommerce.service';
import { AuthService } from '../../services/auth.service';
import { Address } from '../../models/ecommerce.model';
import { Alert } from '../../utils/alert.utils';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="cart-page">
      <div class="header-banner">
        <span class="badge-gold">HAUTE SHOPPING BAG</span>
        <h1 class="font-serif page-title">Your Selected Pieces</h1>
      </div>

      <div *ngIf="ecommerceService.cartItems().length > 0; else emptyCart" class="cart-layout">
        <!-- Cart Items List -->
        <div class="items-list">
          <div *ngFor="let item of ecommerceService.cartItems()" class="cart-item-card glass-card">
            <img [src]="item.product.images?.[0] || '/images/cat-women-chaniya-choli.jpg'" (error)="onImageError($event)" [alt]="item.product.name" class="item-img" />
            <div class="item-details">
              <span class="category">{{ item.product.category?.name }}</span>
              <h3 class="name font-serif">{{ item.product.name }}</h3>
              <p class="size-info">Selected Size: <strong>{{ item.size }}</strong></p>
              <div class="price">
                ₹{{ ecommerceService.getEffectivePrice(item.product) }}
                <span *ngIf="item.product.isBogoEnabled" class="bogo-chip ml-2">B1G1</span>
              </div>
            </div>

            <div class="item-qty">
              <span>Qty: {{ item.quantity }}</span>
            </div>

            <button (click)="removeItem(item.id)" class="remove-btn" title="Remove item">
              &times;
            </button>
          </div>
        </div>

        <!-- Order Summary & Checkout Panel -->
        <div class="summary-panel glass-card">
          <h2 class="font-serif summary-title">Order Summary</h2>

          <div class="summary-row">
            <span>Subtotal</span>
            <span class="price-val">₹{{ summary().originalSubtotal | number:'1.2-2' }}</span>
          </div>

          <div class="summary-row" *ngIf="summary().bogoDiscount > 0">
            <span class="gold-text">BUY 1 GET 1 DISCOUNT</span>
            <span class="gold-text price-val">- ₹{{ summary().bogoDiscount | number:'1.2-2' }}</span>
          </div>

          <div class="summary-row">
            <span>Complimentary Pan India Express Shipping</span>
            <span class="gold-text">FREE</span>
          </div>

          <!-- Payment Scheme Options -->
          <div class="payment-plan-section mt-4">
            <label class="section-label">SELECT PAYMENT SCHEME:</label>
            <div class="plan-cards-grid mt-2">
              <div 
                class="plan-card" 
                [class.selected]="paymentScheme === '20_PERCENT'" 
                (click)="paymentScheme = '20_PERCENT'"
              >
                <div class="plan-radio-row">
                  <span class="radio-dot" [class.active]="paymentScheme === '20_PERCENT'"></span>
                  <span class="plan-name font-serif">20% Advance Booking</span>
                </div>
                <span class="plan-sub">Pay 20% now, rest 80% when AWB is generated</span>
                <span class="plan-badge font-serif">⚡ 2-Day Dispatch Refund Guarantee</span>
              </div>

              <div 
                class="plan-card mt-2" 
                [class.selected]="paymentScheme === 'FULL'" 
                (click)="paymentScheme = 'FULL'"
              >
                <div class="plan-radio-row">
                  <span class="radio-dot" [class.active]="paymentScheme === 'FULL'"></span>
                  <span class="plan-name font-serif">100% Full Payment</span>
                </div>
                <span class="plan-sub">Pay total order amount upfront</span>
              </div>
            </div>
          </div>

          <!-- Total / Payable Breakdown -->
          <div class="summary-row" style="border-top: 1px dashed rgba(255,255,255,0.15); padding-top: 12px; margin-top: 12px;">
            <span style="font-size: 0.9rem; color: #aaa;">Total Order Amount:</span>
            <span class="price-val" style="font-size: 1.25rem; color: #f3e5ab; font-weight: 700;">₹{{ summary().finalTotal | number:'1.2-2' }}</span>
          </div>

          <div class="summary-row total-row" *ngIf="paymentScheme === '20_PERCENT'" style="margin-top: 10px; background: rgba(212, 175, 55, 0.08); padding: 12px; border-radius: 6px; border: 1px solid rgba(212, 175, 55, 0.25);">
            <div>
              <span style="display:block; font-size:0.68rem; letter-spacing:0.1em; color:#ffb703;">PAY TODAY (20% ADVANCE)</span>
              <span class="total-price" style="font-size: 1.4rem;">₹{{ getPayableToday() | number:'1.2-2' }}</span>
            </div>
            <div style="text-align:right;">
              <span style="display:block; font-size:0.68rem; letter-spacing:0.1em; color:#aaa;">BALANCE AFTER AWB (80%)</span>
              <span class="gold-text price-val" style="font-size:1.2rem; display:block; margin-top:2px;">₹{{ getRemainingBalance() | number:'1.2-2' }}</span>
            </div>
          </div>

          <div class="summary-row total-row" *ngIf="paymentScheme === 'FULL'" style="margin-top: 10px;">
            <span>Pay Today (100% Full Payment)</span>
            <span class="total-price">₹{{ summary().finalTotal | number:'1.2-2' }}</span>
          </div>

          <!-- Address Picker for Logged-in Users -->
          <div class="address-section mt-4" *ngIf="authService.isLoggedIn()">
            <label>DELIVERY ADDRESS:</label>
            <select [(ngModel)]="selectedAddressId" class="address-select mt-2">
              <option value="" disabled [selected]="!selectedAddressId">Select Shipping Address</option>
              <option *ngFor="let addr of getAvailableAddresses()" [value]="addr.id">
                {{ addr.title }} - {{ addr.street }}, {{ addr.city }} ({{ addr.postalCode }})
              </option>
            </select>
            <a routerLink="/profile" class="add-address-link mt-2">+ Manage Addresses in Profile</a>
          </div>

          <!-- Checkout Button -->
          <button 
            (click)="proceedToPaymentFlow()" 
            [disabled]="isProcessing() || (authService.isLoggedIn() && !selectedAddressId)" 
            class="luxury-btn-primary checkout-btn mt-4"
          >
            {{ isProcessing() ? 'PROCESSING ORDER...' : ('PAY ₹' + (getPayableAmount() | number:'1.2-2') + ' VIA RAZORPAY') }}
          </button>
        </div>
      </div>

      <!-- Post-Payment Guest Details & Shipping Address Modal -->
      <div class="modal-backdrop" *ngIf="showGuestModal()">
        <div class="modal-card glass-card qr-modal-card">
          <div class="modal-header">
            <div>
              <h3 class="font-serif gold-text">Payment Verified! Fill Shipping Details</h3>
              <p style="color: #aaa; font-size: 0.8rem; margin: 2px 0 0;">Transaction Ref ID verified. Please provide your shipping details to complete your order booking.</p>
            </div>
          </div>

          <div class="qr-modal-body mt-3">
            <form (ngSubmit)="completeGuestOrderAfterPayment()" class="utr-form">
              <div class="form-group mb-3">
                <label>FULL NAME</label>
                <input type="text" [(ngModel)]="guestForm.fullName" name="fullName" placeholder="e.g. Ananya Roy" required />
              </div>

              <div class="form-group mb-3">
                <label>EMAIL ADDRESS</label>
                <input type="email" [(ngModel)]="guestForm.email" name="email" placeholder="e.g. ananya@gmail.com" required />
              </div>

              <div class="form-group mb-3">
                <label>PHONE / CONTACT NUMBER</label>
                <input type="tel" [(ngModel)]="guestForm.phone" name="phone" placeholder="e.g. +91 9876543210" required />
              </div>

              <div class="form-group mb-3">
                <label>SHIPPING STREET ADDRESS</label>
                <input type="text" [(ngModel)]="guestForm.street" name="street" placeholder="e.g. Flat 402, Sunshine Towers, Marine Drive" required />
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div class="form-group mb-3">
                  <label>CITY</label>
                  <input type="text" [(ngModel)]="guestForm.city" name="city" placeholder="e.g. Mumbai" required />
                </div>
                <div class="form-group mb-3">
                  <label>PINCODE / POSTAL CODE</label>
                  <input type="text" [(ngModel)]="guestForm.postalCode" name="postalCode" placeholder="e.g. 400021" required />
                </div>
              </div>

              <div class="modal-actions mt-4">
                <button type="submit" [disabled]="isProcessing()" class="luxury-btn-primary w-100">
                  {{ isProcessing() ? 'CONFIRMING ORDER...' : 'COMPLETE & CONFIRM ORDER' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <ng-template #emptyCart>
        <div class="empty-cart glass-card">
          <h2 class="font-serif">Your Shopping Bag is Empty</h2>
          <p>Explore our latest couture arrivals and add pieces to your bag.</p>
          <a routerLink="/products" class="luxury-btn-primary mt-4">DISCOVER COLLECTIONS</a>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .cart-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 24px 100px;
    }

    .header-banner {
      text-align: center;
      margin-bottom: 40px;
    }

    .page-title {
      font-size: 2.8rem;
      color: #fff;
      margin-top: 8px;
    }

    .cart-layout {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 40px;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .cart-item-card {
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 24px;
      position: relative;
    }

    .item-img {
      width: 110px;
      height: 140px;
      object-fit: cover;
      border-radius: 2px;
    }

    .item-details {
      flex-grow: 1;
    }

    .category {
      font-size: 0.6rem;
      letter-spacing: 0.2em;
      color: var(--color-gold-primary);
    }

    .name {
      font-size: 1.15rem;
      margin: 4px 0 6px;
      color: #fff;
    }

    .size-info {
      font-size: 0.8rem;
      color: #aaa;
    }

    .price {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--color-gold-light);
      margin-top: 6px;
    }

    .bogo-chip {
      font-size: 0.6rem;
      background: #ff4757;
      color: #fff;
      padding: 2px 6px;
      border-radius: 2px;
    }

    .item-qty {
      font-size: 0.9rem;
      color: #ccc;
    }

    .remove-btn {
      background: none;
      border: none;
      color: #888;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 4px 8px;
      transition: color 0.2s;
    }

    .remove-btn:hover {
      color: #ff4757;
    }

    .summary-panel {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      height: fit-content;
    }

    .summary-title {
      font-size: 1.4rem;
      margin-bottom: 8px;
      color: #fff;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.9rem;
      color: #bbb;
    }

    .price-val {
      font-weight: 600;
      color: #fff;
    }

    .gold-text {
      color: var(--color-gold-primary);
    }

    .payment-plan-section label {
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      color: #888;
    }

    .plan-card {
      padding: 12px;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
      background: rgba(255,255,255,0.02);
    }

    .plan-card.selected {
      border-color: var(--color-gold-primary);
      background: rgba(212, 175, 55, 0.05);
    }

    .plan-radio-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .radio-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid #666;
    }

    .radio-dot.active {
      border-color: var(--color-gold-primary);
      background: var(--color-gold-primary);
    }

    .plan-name {
      font-size: 0.95rem;
      color: #fff;
    }

    .plan-sub {
      display: block;
      font-size: 0.75rem;
      color: #888;
      margin-top: 4px;
      margin-left: 20px;
    }

    .plan-badge {
      display: inline-block;
      font-size: 0.65rem;
      color: var(--color-gold-primary);
      margin-top: 4px;
      margin-left: 20px;
    }

    .total-row {
      font-size: 1.1rem;
      font-weight: 700;
      color: #fff;
    }

    .total-price {
      color: var(--color-gold-primary);
    }

    .address-section label {
      font-size: 0.7rem;
      letter-spacing: 0.1em;
      color: #888;
      display: block;
    }

    .address-select {
      width: 100%;
      padding: 10px;
      background: #121214;
      border: 1px solid rgba(255,255,255,0.15);
      color: #fff;
      border-radius: 4px;
      font-size: 0.85rem;
    }

    .add-address-link {
      display: block;
      font-size: 0.75rem;
      color: var(--color-gold-primary);
      text-decoration: none;
    }

    .checkout-btn {
      width: 100%;
      padding: 14px;
      font-size: 0.85rem;
      letter-spacing: 0.15em;
    }

    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0,0.85);
      backdrop-filter: blur(8px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .qr-modal-card {
      max-width: 500px;
      width: 100%;
      padding: 28px;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;

      h3 { font-size: 1.2rem; margin: 0; }
    }

    .close-btn {
      background: none;
      border: none;
      color: #aaa;
      font-size: 1.8rem;
      cursor: pointer;
      line-height: 1;
    }

    .merchant-info-strip {
      background: rgba(212, 175, 55, 0.08);
      border: 1px dashed rgba(212, 175, 55, 0.3);
      padding: 10px 14px;
      border-radius: 4px;
      font-size: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .m-label { color: #888; font-size: 0.68rem; letter-spacing: 0.1em; }
    .m-val { color: #f3e5ab; font-weight: 700; letter-spacing: 0.05em; }

    .qr-code-box {
      display: flex;
      align-items: center;
      gap: 20px;
      background: #09090b;
      border: 1px solid rgba(212, 175, 55, 0.25);
      border-radius: 6px;
      padding: 16px;
    }

    .upi-qr-img {
      width: 140px;
      height: 140px;
      border-radius: 4px;
      background: #fff;
      padding: 6px;
    }

    .qr-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .upi-id-tag { font-size: 0.85rem; color: #ddd; }
    .amount-tag { font-size: 0.95rem; color: #fff; }
    .scan-note { font-size: 0.72rem; color: #888; margin: 0; }

    .utr-form .form-group label {
      font-size: 0.7rem;
      letter-spacing: 0.1em;
      color: #aaa;
      display: block;
      margin-bottom: 6px;
    }

    .utr-form input {
      width: 100%;
      padding: 12px;
      background: #121214;
      border: 1px solid rgba(255,255,255,0.2);
      color: #fff;
      border-radius: 4px;
      font-size: 0.95rem;
    }

    .help-text {
      font-size: 0.7rem;
      color: #777;
      display: block;
      margin-top: 4px;
    }

    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .modal-actions button {
      padding: 10px 20px;
      font-size: 0.8rem;
    }

    .empty-cart {
      text-align: center;
      padding: 60px 20px;
    }

    @media (max-width: 900px) {
      .cart-page { padding: 20px 12px 60px; }
      .page-title { font-size: 1.8rem; }
      .cart-layout { grid-template-columns: 1fr; gap: 24px; }
      .cart-item-card { padding: 14px; gap: 14px; }
      .item-img { width: 80px; height: 100px; }
      .name { font-size: 1rem; }
      .qr-code-box { flex-direction: column; text-align: center; }
    }
  `]
})
export class CartComponent implements OnInit {
  addresses = signal<Address[]>([]);
  selectedAddressId: string = '';
  isProcessing = signal(false);
  showPaymentModal = signal(false);
  showGuestModal = signal(false);
  paymentGateway: 'RAZORPAY' | 'UPI_QR' = 'RAZORPAY';
  paymentScheme: '20_PERCENT' | 'FULL' = '20_PERCENT';
  utrNumber: string = '';

  guestForm = {
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: ''
  };

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img && !img.src.includes('jhulki_brand_logo')) {
      img.src = '/images/cat-women-chaniya-choli.jpg';
    }
  }

  constructor(
    public ecommerceService: EcommerceService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.ecommerceService.fetchCart().subscribe();
    if (this.authService.isLoggedIn()) {
      this.ecommerceService.fetchAddresses().subscribe(addrs => {
        this.addresses.set(addrs);
        const defaultAddr = addrs.find(a => a.isDefault) || addrs[0];
        if (defaultAddr) this.selectedAddressId = defaultAddr.id;
      });
    }
  }

  getAvailableAddresses(): Address[] {
    const addrs = this.ecommerceService.addresses();
    if (addrs && addrs.length > 0) {
      if (!this.selectedAddressId) {
        const defaultAddr = addrs.find(a => a.isDefault) || addrs[0];
        if (defaultAddr) this.selectedAddressId = defaultAddr.id;
      }
      return addrs;
    }
    return this.addresses();
  }

  summary() {
    return this.ecommerceService.calculateCartSummary();
  }

  getPayableToday(): number {
    const total = this.summary().finalTotal;
    return Math.round(total * 0.20);
  }

  getRemainingBalance(): number {
    const total = this.summary().finalTotal;
    return total - this.getPayableToday();
  }

  getPayableAmount(): number {
    return this.paymentScheme === '20_PERCENT' ? this.getPayableToday() : this.summary().finalTotal;
  }

  getUpiQrUrl(): string {
    const amount = this.getPayableAmount();
    const upiString = `upi://pay?pa=jhulki@upi&pn=Jhulki%20Haute%20Couture%20Pvt%20Ltd&am=${amount}&cu=INR&tn=Booking%20Advance`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}&color=d4af37&bgcolor=09090b`;
  }

  removeItem(cartItemId: string) {
    this.ecommerceService.removeFromCart(cartItemId).subscribe();
  }

  proceedToPaymentFlow() {
    if (this.authService.isLoggedIn()) {
      const addrs = this.getAvailableAddresses();
      const address = addrs.find(a => a.id === this.selectedAddressId) || addrs[0];
      if (!address) {
        Alert.warning('Address Required', 'Please select or add a valid delivery address.');
        return;
      }
      this.selectedAddressId = address.id;
    }

    this.launchRazorpayCheckout();
  }

  launchRazorpayCheckout() {
    const payableRupees = this.getPayableAmount();
    const amountInPaise = Math.round(payableRupees * 100);

    if (amountInPaise < 100) {
      Alert.error('Invalid Amount', 'Payable amount must be at least ₹1.');
      return;
    }

    this.isProcessing.set(true);

    // Step 1: Call Backend to Create Razorpay Order
    this.ecommerceService.createRazorpayOrder(amountInPaise, `rcpt_${Date.now()}`).subscribe({
      next: (orderData) => {
        const razorpayOrderId = orderData.order_id;
        const razorpayKeyId = orderData.key_id || 'rzp_live_TbYe1fftFsYN2G';

        const user = this.authService.getUser();
        const addrs = this.getAvailableAddresses();
        const userAddr = addrs.find(a => a.id === this.selectedAddressId) || addrs[0];

        const prefillName = user?.fullName || this.guestForm.fullName || 'Valued Client';
        const prefillEmail = user?.email || this.guestForm.email || 'client@jhulki.store';
        const prefillPhone = userAddr?.phone || this.guestForm.phone || '';

        // Step 2: Configure Razorpay Standard Checkout Modal
        const options: any = {
          key: razorpayKeyId,
          amount: amountInPaise,
          currency: 'INR',
          name: 'Jhulki Haute Couture',
          description: this.paymentScheme === '20_PERCENT' ? '20% Advance Order Booking' : '100% Full Order Payment',
          image: '/jhulki_brand_logo.jpg',
          order_id: razorpayOrderId,
          prefill: {
            name: prefillName,
            email: prefillEmail,
            contact: prefillPhone
          },
          theme: {
            color: '#d4af37'
          },
          handler: (response: any) => {
            // Step 3: Call Backend to Verify Payment Signature
            this.handleRazorpaySuccess(response, razorpayOrderId);
          },
          modal: {
            ondismiss: () => {
              this.isProcessing.set(false);
              Alert.warning('Payment Cancelled', 'Razorpay checkout window was closed before completing payment.');
            }
          }
        };

        // Open Razorpay Standard Checkout Window
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', (response: any) => {
          this.isProcessing.set(false);
          Alert.error('Payment Failed', response.error?.description || 'Payment could not be processed by Razorpay.');
        });
        rzp.open();
      },
      error: (err) => {
        this.isProcessing.set(false);
        Alert.error('Razorpay Error', err?.error?.error || 'Could not initiate Razorpay order session.');
      }
    });
  }

  private handleRazorpaySuccess(response: any, orderId: string) {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

    this.ecommerceService.verifyRazorpayPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature).subscribe({
      next: (verifyRes) => {
        if (verifyRes.success) {
          const schemeLabel = this.paymentScheme === '20_PERCENT' ? '20% Advance Booking' : '100% Full Payment';
          const methodString = `Razorpay Prepaid (${razorpay_payment_id}) - ${schemeLabel}`;

          if (!this.authService.isLoggedIn()) {
            this.utrNumber = razorpay_payment_id;
            this.showGuestModal.set(true);
            this.isProcessing.set(false);
          } else {
            this.utrNumber = razorpay_payment_id;
            this.processLoggedInOrderWithPayment(methodString);
          }
        } else {
          this.isProcessing.set(false);
          Alert.error('Verification Failed', 'Payment signature mismatch. Order was not created.');
        }
      },
      error: (err) => {
        this.isProcessing.set(false);
        Alert.error('Verification Error', err?.error?.error || 'Failed to verify payment with Razorpay backend.');
      }
    });
  }

  private processLoggedInOrderWithPayment(methodString: string) {
    const fullTotalAmount = this.summary().finalTotal;
    const finalAmountPaidToday = this.getPayableAmount();

    const addrs = this.getAvailableAddresses();
    const address = addrs.find(a => a.id === this.selectedAddressId) || addrs[0];

    this.ecommerceService.checkoutOrder(fullTotalAmount, address, methodString).subscribe({
      next: (order) => {
        this.finishPaymentFlow(order, finalAmountPaidToday, fullTotalAmount);
      },
      error: (err) => {
        this.isProcessing.set(false);
        Alert.error('Order Failed', err?.error?.error || 'Order creation failed after payment.');
      }
    });
  }

  openPaymentModal() {
    if (this.authService.isLoggedIn()) {
      const addrs = this.getAvailableAddresses();
      const address = addrs.find(a => a.id === this.selectedAddressId) || addrs[0];
      if (!address) {
        Alert.warning('Address Required', 'Please select or add a valid delivery address.');
        return;
      }
      this.selectedAddressId = address.id;
    }

    this.utrNumber = '';
    this.showPaymentModal.set(true);
  }

  submitUpiPayment() {
    if (!this.utrNumber || this.utrNumber.trim().length < 6) {
      Alert.warning('Transaction Ref ID Required', 'Please enter your 12-digit UPI UTR / Transaction Ref Number from your payment app receipt.');
      return;
    }

    // Hide payment QR modal
    this.showPaymentModal.set(false);

    if (!this.authService.isLoggedIn()) {
      // Guest User Flow: Prompt for Shipping Details NOW after payment
      this.showGuestModal.set(true);
    } else {
      // Logged In User Flow: Complete order directly
      this.processLoggedInOrder();
    }
  }

  completeGuestOrderAfterPayment() {
    if (!this.guestForm.fullName || !this.guestForm.email || !this.guestForm.phone || !this.guestForm.street) {
      Alert.warning('Incomplete Details', 'Please fill in your name, email, contact number, and shipping address.');
      return;
    }

    const fullTotalAmount = this.summary().finalTotal;
    const finalAmountPaidToday = this.getPayableAmount();
    const schemeLabel = this.paymentScheme === '20_PERCENT' ? '20% Advance Booking' : '100% Full Payment';
    const methodString = this.utrNumber.startsWith('pay_')
      ? `Razorpay Prepaid (${this.utrNumber}) - ${schemeLabel}`
      : `Prepaid UPI (UTR: ${this.utrNumber.trim()}) - ${schemeLabel}`;

    this.isProcessing.set(true);

    this.ecommerceService.registerGuestAndCreateAddress(this.guestForm).subscribe({
      next: (res) => {
        const shippingAddress: Address = res.address || {
          id: 'guest-addr',
          userId: res.user.id,
          title: 'Shipping Address',
          fullName: this.guestForm.fullName,
          street: this.guestForm.street,
          city: this.guestForm.city,
          state: this.guestForm.state,
          postalCode: this.guestForm.postalCode,
          country: 'India',
          phone: this.guestForm.phone,
          isDefault: true
        };

        this.ecommerceService.checkoutOrder(fullTotalAmount, shippingAddress, methodString).subscribe({
          next: (order) => {
            this.showGuestModal.set(false);
            this.finishPaymentFlow(order, finalAmountPaidToday, fullTotalAmount);
          },
          error: (err) => {
            this.isProcessing.set(false);
            Alert.error('Order Failed', err?.error?.error || 'Order creation failed.');
          }
        });
      },
      error: (err) => {
        this.isProcessing.set(false);
        Alert.error('Registration Failed', err?.error?.error || 'Could not save guest account details.');
      }
    });
  }

  private processLoggedInOrder() {
    const fullTotalAmount = this.summary().finalTotal;
    const finalAmountPaidToday = this.getPayableAmount();
    const schemeLabel = this.paymentScheme === '20_PERCENT' ? '20% Advance Booking' : '100% Full Payment';
    const methodString = `Prepaid UPI (UTR: ${this.utrNumber.trim()}) - ${schemeLabel}`;

    const addrs = this.getAvailableAddresses();
    const address = addrs.find(a => a.id === this.selectedAddressId) || addrs[0];

    this.isProcessing.set(true);
    this.ecommerceService.checkoutOrder(fullTotalAmount, address, methodString).subscribe({
      next: (order) => {
        this.finishPaymentFlow(order, finalAmountPaidToday, fullTotalAmount);
      },
      error: (err) => {
        this.isProcessing.set(false);
        Alert.error('Order Failed', err?.error?.error || 'Order processing failed.');
      }
    });
  }

  private finishPaymentFlow(order: any, finalAmountPaidToday: number, fullTotalAmount: number) {
    this.isProcessing.set(false);
    this.showPaymentModal.set(false);

    if (this.paymentScheme === '20_PERCENT') {
      Alert.success(
        'Payment Verified & Order Placed!',
        `Order #${order.orderNumber} successfully registered with ₹${finalAmountPaidToday.toLocaleString()} advance booking.\n\nYour user account has been registered with your provided contact details. You can track your order status in real time.`
      ).then(() => {
        this.router.navigate(['/track-order']);
      });
    } else {
      Alert.success(
        'Payment Confirmed!',
        `Thank you! Order #${order.orderNumber} (₹${fullTotalAmount.toLocaleString()}) has been confirmed.`
      ).then(() => {
        this.router.navigate(['/track-order']);
      });
    }
  }
}

