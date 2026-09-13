import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EcommerceService } from '../../services/ecommerce.service';
import { AuthService } from '../../services/auth.service';
import { Order, OrderItem } from '../../models/ecommerce.model';
import { Alert } from '../../utils/alert.utils';

@Component({
  selector: 'app-returns-exchange',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="returns-page">
      <div class="returns-header text-center">
        <span class="badge-gold">CLIENT PROTECTION</span>
        <h1 class="font-serif page-title mt-2">Returns & Exchanges</h1>
        <p class="subtitle">Initiate a seamless size exchange or doorstep return request for your delivered garments.</p>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading()" class="luxury-loader-card glass-card mt-5 text-center p-5">
        <div class="luxury-spinner">
          <div class="spinner-ring ring-outer"></div>
          <div class="brand-sparkle">✨</div>
        </div>
        <h3 class="font-serif loader-headline mt-3">Loading Order Details...</h3>
      </div>

      <!-- Main Form Container -->
      <div *ngIf="!isLoading()" class="returns-container glass-card mt-5">
        
        <!-- Step 1: Order Summary Banner -->
        <div class="order-summary-banner p-4 mb-4" *ngIf="targetOrder">
          <div class="flex justify-between items-center flex-wrap gap-3">
            <div>
              <span class="order-number-title">Order #{{ targetOrder.orderNumber }}</span>
              <span class="order-date-sub block mt-1">Delivered on {{ targetOrder.createdAt | date:'mediumDate' }}</span>
            </div>
            <span class="status-badge-delivered">DELIVERED</span>
          </div>
        </div>

        <!-- Order Selector dropdown if no specific order provided -->
        <div class="form-group mb-4" *ngIf="!targetOrder && deliveredOrders().length > 0">
          <label class="field-label">SELECT DELIVERED ORDER FOR RETURN / EXCHANGE <span class="gold-text">*</span></label>
          <select [(ngModel)]="selectedOrderId" (change)="onOrderSelectChange()" class="luxury-select mt-2">
            <option value="" disabled selected>Select an eligible delivered order</option>
            <option *ngFor="let o of deliveredOrders()" [value]="o.id">
              Order #{{ o.orderNumber }} - ₹{{ o.totalAmount | number:'1.2-2' }} (Delivered)
            </option>
          </select>
        </div>

        <div *ngIf="!targetOrder && deliveredOrders().length === 0" class="no-delivered-card text-center p-5 glass-card">
          <h3 class="font-serif gold-text">No Delivered Orders Eligible</h3>
          <p class="text-gray-400 text-sm mt-2">Returns and size exchanges can only be initiated for orders that have been successfully delivered.</p>
          <a routerLink="/track-order" class="luxury-btn-primary mt-4 inline-block">RETURN TO ORDER TRACKING</a>
        </div>

        <div *ngIf="targetOrder">
          <!-- Step 2: Item Selection -->
          <div class="section-block mt-5 pt-3">
            <h3 class="section-title font-serif">1. Select Item for Request</h3>
            <div class="items-selection-grid mt-3">
              <div 
                *ngFor="let item of targetOrder.items" 
                class="item-choice-card glass-card p-3 flex items-center gap-4 cursor-pointer"
                [class.selected]="selectedItemId === item.id"
                (click)="selectedItemId = item.id"
              >
                <input type="radio" name="selectedItem" [checked]="selectedItemId === item.id" />
                <img [src]="item.product?.images?.[0] || '/products/chaniya-choli/full.jpg'" [alt]="item.product?.name" class="item-thumb" />
                <div class="item-info">
                  <span class="item-name font-serif text-white font-medium block">
                    {{ item.product?.name || 'Couture Garment' }} &nbsp;<span class="text-gray-500 font-normal">|</span>&nbsp; <span class="text-gray-300 font-normal text-xs">Ordered Size: <strong class="text-white">{{ item.size }}</strong></span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Request Type Selection -->
          <div class="section-block mt-5">
            <h3 class="section-title font-serif">2. Select Service Type</h3>
            <div class="request-type-grid mt-3">
              <div 
                class="type-card glass-card p-4 text-left cursor-pointer"
                [class.active]="requestType === 'EXCHANGE'"
                (click)="requestType = 'EXCHANGE'"
              >
                <span class="service-tag font-serif">SIZE EXCHANGE</span>
                <h4 class="font-serif text-white mt-2">Exchange For New Size</h4>
                <p class="text-xs text-gray-400 mt-1">Request a size replacement (S, M, L, XL, XXL, Custom Fit) with complimentary doorstep pickup.</p>
              </div>

              <div 
                class="type-card glass-card p-4 text-left cursor-pointer"
                [class.active]="requestType === 'RETURN'"
                (click)="requestType = 'RETURN'"
              >
                <span class="service-tag font-serif">RETURN & REFUND</span>
                <h4 class="font-serif text-white mt-2">Garment Return</h4>
                <p class="text-xs text-gray-400 mt-1">Return item for a full refund back to your original payment method within 5-7 business days.</p>
              </div>
            </div>
          </div>

          <!-- Step 4: Size Exchange Options -->
          <div class="section-block mt-4" *ngIf="requestType === 'EXCHANGE'">
            <h3 class="section-title font-serif">3. Select Requested Replacement Size</h3>
            <div class="flex flex-wrap gap-3 mt-3">
              <button 
                *ngFor="let size of availableSizes" 
                (click)="newRequestedSize = size"
                [class.selected-size]="newRequestedSize === size"
                class="size-pill-btn"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <!-- Step 5: Reason & Comments -->
          <div class="section-block mt-5">
            <h3 class="section-title font-serif">{{ requestType === 'EXCHANGE' ? '4.' : '3.' }} Primary Reason</h3>
            <select [(ngModel)]="reason" class="luxury-select mt-3">
              <option value="" disabled selected>Select reason from dropdown</option>
              <option value="Size fit too small">Size fit is too small / tight</option>
              <option value="Size fit too large">Size fit is too loose / large</option>
              <option value="Color or fabric variation">Fabric / Color variation from website preview</option>
              <option value="Defective or damaged garment">Garment arrived defective or damaged</option>
              <option value="Changed mind">Changed mind / Expected different style</option>
            </select>

            <div class="form-group mt-4">
              <label class="field-label">ADDITIONAL COURIER PICKUP INSTRUCTIONS (OPTIONAL)</label>
              <textarea 
                [(ngModel)]="comments" 
                rows="3" 
                class="luxury-textarea mt-2" 
                placeholder="e.g. Please arrange pickup between 2 PM and 5 PM. Garment is neatly packed in original packaging."
              ></textarea>
            </div>
          </div>

          <!-- Reverse Pickup Shipping Confirmation -->
          <div class="pickup-address-card glass-card mt-5 p-4">
            <div>
              <span class="logistics-heading font-serif">COMPLIMENTARY REVERSE PICKUP ADDRESS</span>
              <p class="pickup-address-text text-xs text-gray-300 mt-2">
                Address: <strong>{{ targetOrder.shippingStreet }}, {{ targetOrder.shippingCity }} ({{ targetOrder.shippingZip }})</strong><br/>
                Contact: <strong>{{ targetOrder.shippingName }} ({{ targetOrder.shippingPhone }})</strong>
              </p>
              <p class="text-xs text-gray-400 mt-1">Our logistics partner will collect the parcel within 48 hours of request confirmation.</p>
            </div>
          </div>

          <!-- Submit Action -->
          <div class="submit-action-wrap mt-5 text-center">
            <button 
              (click)="submitRequest()" 
              [disabled]="isSubmitting() || !selectedItemId || !reason || (requestType === 'EXCHANGE' && !newRequestedSize)"
              class="luxury-btn-primary w-full py-4 text-xs tracking-widest uppercase font-semibold"
            >
              {{ isSubmitting() ? 'PROCESSING REQUEST...' : 'SUBMIT ' + requestType + ' REQUEST' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .returns-page {
      max-width: 860px;
      margin: 0 auto;
      padding: 40px 24px 100px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    .page-title {
      font-size: 2.4rem;
      color: #ffffff;
      font-weight: 400;
      margin-top: 8px;
    }

    .subtitle {
      color: #9a9ab0;
      font-size: 0.9rem;
      margin-top: 6px;
    }

    .returns-container {
      padding: 36px;
      border: 1px solid rgba(212, 175, 55, 0.25);
    }

    .order-summary-banner {
      background: rgba(212, 175, 55, 0.06);
      border: 1px solid rgba(212, 175, 55, 0.2);
      border-radius: 4px;
    }

    .order-number-title {
      font-size: 1.15rem;
      color: var(--color-gold-primary);
      font-weight: 700;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      letter-spacing: 0.05em;
    }

    .order-date-sub {
      font-size: 0.8rem;
      color: #888899;
    }

    .status-badge-delivered {
      background: rgba(74, 222, 128, 0.12);
      color: #4ade80;
      border: 1px solid rgba(74, 222, 128, 0.3);
      padding: 4px 12px;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      border-radius: 2px;
    }

    .field-label {
      font-size: 0.72rem;
      letter-spacing: 0.1em;
      color: #aaa;
      font-weight: 600;
    }

    .luxury-select, .luxury-textarea {
      width: 100%;
      background: #09090b;
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #ffffff;
      padding: 12px;
      border-radius: 4px;
      font-size: 0.88rem;
    }

    .luxury-select:focus, .luxury-textarea:focus {
      border-color: var(--color-gold-primary);
      outline: none;
    }

    .section-title {
      font-size: 1.1rem;
      color: var(--color-gold-primary);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 8px;
    }

    .items-selection-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .item-choice-card {
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    .item-choice-card:hover, .item-choice-card.selected {
      border-color: var(--color-gold-primary);
      background: rgba(212, 175, 55, 0.05);
    }

    .item-thumb {
      width: 55px;
      height: 70px;
      object-fit: cover;
      border-radius: 2px;
    }

    .item-name {
      font-size: 0.95rem;
    }

    .item-size-info {
      color: #aaa;
    }

    .request-type-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .type-card {
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    .type-card:hover, .type-card.active {
      border-color: var(--color-gold-primary);
      background: rgba(212, 175, 55, 0.06);
    }

    .service-tag {
      font-size: 0.65rem;
      letter-spacing: 0.15em;
      color: var(--color-gold-primary);
      font-weight: 700;
      display: block;
    }

    .size-pill-btn {
      padding: 8px 18px;
      font-size: 0.78rem;
      border: 1px solid rgba(255, 255, 255, 0.15);
      background: #09090b;
      color: #cccccc;
      border-radius: 2px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .size-pill-btn:hover, .size-pill-btn.selected-size {
      border-color: var(--color-gold-primary);
      color: #000000;
      background: var(--color-gold-primary);
      font-weight: 600;
    }

    .pickup-address-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 4px;
    }

    .logistics-heading {
      font-size: 0.75rem;
      letter-spacing: 0.12em;
      color: var(--color-gold-primary);
      display: block;
    }

    .pickup-address-text {
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .returns-container { padding: 20px 14px; }
      .request-type-grid { grid-template-columns: 1fr; }
      .page-title { font-size: 1.8rem; }
    }
  `]
})
export class ReturnsExchangeComponent implements OnInit {
  isLoading = signal(true);
  isSubmitting = signal(false);
  deliveredOrders = signal<Order[]>([]);
  targetOrder: Order | null = null;
  selectedOrderId: string = '';
  selectedItemId: string = '';
  requestType: 'EXCHANGE' | 'RETURN' = 'EXCHANGE';
  newRequestedSize: string = '';
  reason: string = '';
  comments: string = '';
  availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom Measurement'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private ecommerceService: EcommerceService
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth']);
      return;
    }

    const orderIdParam = this.route.snapshot.queryParamMap.get('orderId');

    this.ecommerceService.fetchOrders().subscribe(orders => {
      const delivered = orders.filter(o => o.status === 'DELIVERED');
      this.deliveredOrders.set(delivered);

      if (orderIdParam) {
        const found = orders.find(o => o.id === orderIdParam || o.orderNumber === orderIdParam);
        if (found) {
          this.targetOrder = found;
          this.selectedOrderId = found.id;
          if (found.items && found.items.length > 0) {
            this.selectedItemId = found.items[0].id;
          }
        }
      } else if (delivered.length > 0) {
        this.targetOrder = delivered[0];
        this.selectedOrderId = delivered[0].id;
        if (delivered[0].items && delivered[0].items.length > 0) {
          this.selectedItemId = delivered[0].items[0].id;
        }
      }

      this.isLoading.set(false);
    });
  }

  onOrderSelectChange() {
    const found = this.deliveredOrders().find(o => o.id === this.selectedOrderId);
    if (found) {
      this.targetOrder = found;
      if (found.items && found.items.length > 0) {
        this.selectedItemId = found.items[0].id;
      }
    }
  }

  submitRequest() {
    if (!this.targetOrder || !this.selectedItemId || !this.reason) {
      Alert.warning('Incomplete Request', 'Please select an item and provide a reason.');
      return;
    }
    if (this.requestType === 'EXCHANGE' && !this.newRequestedSize) {
      Alert.warning('Select Size', 'Please select a replacement size for your exchange.');
      return;
    }

    const item = this.targetOrder.items.find(i => i.id === this.selectedItemId);

    this.isSubmitting.set(true);

    setTimeout(() => {
      this.isSubmitting.set(false);

      if (this.requestType === 'EXCHANGE') {
        Alert.success(
          'Size Exchange Request Registered!',
          `Request ID: EX-${Math.floor(100000 + Math.random() * 900000)}\n\nOrder #${this.targetOrder?.orderNumber} • ${item?.product?.name || 'Garment'} (New Requested Size: ${this.newRequestedSize})\n\nOur Delhivery reverse courier partner will pick up the package within 48 hours.`
        ).then(() => {
          this.router.navigate(['/track-order']);
        });
      } else {
        Alert.success(
          'Return & Refund Request Submitted!',
          `Request ID: RT-${Math.floor(100000 + Math.random() * 900000)}\n\nOrder #${this.targetOrder?.orderNumber} • ${item?.product?.name || 'Garment'}\n\nOur team will collect the parcel within 48 hours. Full refund of ₹${item?.price || this.targetOrder?.totalAmount} will be processed upon quality inspection.`
        ).then(() => {
          this.router.navigate(['/track-order']);
        });
      }
    }, 1200);
  }
}
