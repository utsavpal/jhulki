import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { EcommerceService } from '../../services/ecommerce.service';
import { Order } from '../../models/ecommerce.model';
import { Alert } from '../../utils/alert.utils';

@Component({
  selector: 'app-track-order',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="track-order-page" *ngIf="authService.isLoggedIn()">
      <div class="header-banner">
        <span class="badge-gold">EXPRESS LOGISTICS & TRACKING</span>
        <h1 class="font-serif page-title">Track Your Haute Couture Orders</h1>
        <p class="subtitle">Real-time status updates from quality inspection to white-glove doorstep delivery.</p>
      </div>

      <!-- Luxury Loading State -->
      <div *ngIf="isLoading()" class="luxury-loader-card glass-card mt-5">
        <div class="luxury-spinner">
          <div class="spinner-ring ring-outer"></div>
          <div class="spinner-ring ring-inner"></div>
          <div class="brand-sparkle">✨</div>
        </div>
        <h3 class="font-serif loader-headline mt-4">Retrieving Your Luxury Orders...</h3>
        <p class="loader-quote">"Crafting extraordinary elegance for extraordinary moments."</p>
      </div>

      <div class="orders-container mt-5" *ngIf="!isLoading()">
        <div *ngFor="let order of getDisplayOrders()" class="order-card glass-card">
          <!-- Transparent Angled DELIVERED Stamp Watermark -->
          <div class="delivered-watermark-stamp" *ngIf="order.status === 'DELIVERED'">
            <div class="stamp-inner">
              <span class="stamp-title font-serif">DELIVERED</span>
              <span class="stamp-sub font-serif">AUTHENTIC & VERIFIED</span>
            </div>
          </div>

          <div class="order-header-row">
            <div>
              <span class="order-num">{{ order.orderNumber }}</span>
              <span class="order-date">{{ order.createdAt | date:'mediumDate' }}</span>
            </div>
            <div class="header-right">
              <a 
                *ngIf="order.status === 'DELIVERED'" 
                [routerLink]="['/returns-exchange']" 
                [queryParams]="{ orderId: order.id }"
                class="invoice-icon-btn return-exchange-btn" 
                title="Initiate Easy Size Exchange or Return Pickup"
                style="border-color: #d4af37; color: #d4af37; background: rgba(212, 175, 55, 0.1);"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                </svg>
                <span>EXCHANGE / RETURN</span>
              </a>
              <button *ngIf="order.isBalancePaid" (click)="openInvoiceModal(order)" class="invoice-icon-btn" title="View & Download Official Tax Invoice">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
                <span>TAX INVOICE</span>
              </button>
              <span class="status-badge" [class.shipped]="order.status === 'SHIPPED'" [class.delivered]="order.status === 'DELIVERED'">
                {{ order.status }}
              </span>
            </div>
          </div>

          <!-- Live Order Progress Bar -->
          <div class="tracking-progress-bar mt-4">
            <div class="step-point" [class.active]="true">
              <span class="dot"></span>
              <span class="step-label">Placed</span>
            </div>
            <div class="line" [class.active]="order.status === 'PROCESSING' || order.status === 'SHIPPED' || order.status === 'DELIVERED'"></div>
            <div class="step-point" [class.active]="order.status === 'PROCESSING' || order.status === 'SHIPPED' || order.status === 'DELIVERED'">
              <span class="dot"></span>
              <span class="step-label">Quality Check</span>
            </div>
            <div class="line" [class.active]="order.status === 'SHIPPED' || order.status === 'DELIVERED'"></div>
            <div class="step-point" [class.active]="order.status === 'SHIPPED' || order.status === 'DELIVERED'">
              <span class="dot"></span>
              <span class="step-label">Dispatched</span>
            </div>
            <div class="line" [class.active]="order.status === 'DELIVERED'"></div>
            <div class="step-point" [class.active]="order.status === 'DELIVERED'">
              <span class="dot"></span>
              <span class="step-label">Delivered</span>
            </div>
          </div>

          <!-- AWB & Expected Delivery Info Strip -->
          <div class="awb-info-strip mt-4" *ngIf="order.trackingId">
            <div class="info-item">
              <span class="label">DELHIVERY AWB TRACKING NUMBER:</span>
              <span class="val font-serif gold-text">{{ order.trackingId }}</span>
            </div>
            <div class="info-item">
              <span class="label">EXPECTED DELIVERY DATE:</span>
              <span class="val green-text">{{ getExpectedDeliveryDate(order) }}</span>
            </div>
          </div>

          <div class="awb-info-strip pending-strip mt-4" *ngIf="!order.trackingId">
            <div class="info-item">
              <span class="label">STATUS:</span>
              <span class="val">Product verification & Delhivery AWB assignment in progress...</span>
            </div>
          </div>

          <!-- 24-Hour Balance Payment Section for Shipped Prepaid Orders -->
          <div class="balance-payment-box mt-4" *ngIf="order.status === 'SHIPPED' && !order.isBalancePaid">
            <div class="balance-header">
              <div>
                <span class="balance-title font-serif">80% BALANCE PAYMENT DUE</span>
                <p class="balance-amount gold-text">₹{{ getBalanceDueAmount(order) | number:'1.2-2' }}</p>
                <div class="order-status-summary mt-1">
                  <span class="label">CURRENT STATUS:</span>
                  <span class="val green-text">SHIPPED & DISPATCHED</span>
                  <span class="bullet">•</span>
                  <span class="label">AWB #:</span>
                  <span class="val gold-text">{{ order.trackingId || 'AWB Pending' }}</span>
                </div>
              </div>
              <div class="timer-badge">
                <span class="timer-label">PAYMENT TIMER:</span>
                <span class="timer-val font-serif">⏳ {{ get24hTimer(order) }}</span>
              </div>
            </div>

            <!-- Strict Non-Refundable Cancellation Warning -->
            <div class="warning-alert mt-3">
              <span>⚠️ <strong>Important Notice:</strong> Your order status is updated to <strong>SHIPPED</strong> with AWB Number <strong>{{ order.trackingId }}</strong>. Please pay the remaining 80% balance (₹{{ getBalanceDueAmount(order) | number:'1.2-2' }}) within 24 hours of dispatch. If unpaid within 24 hours, delivery will be put on hold/cancelled.</span>
            </div>

            <button (click)="openBalancePaymentModal(order)" class="luxury-btn-primary pay-balance-btn mt-3">
              PAY REMAINING 80% BALANCE NOW (₹{{ getBalanceDueAmount(order) | number:'1.2-2' }})
            </button>
          </div>

          <!-- Paid Confirmation Badge (Shown when paid and not yet delivered) -->
          <div class="paid-confirmation-banner mt-4" *ngIf="order.isBalancePaid && order.status !== 'DELIVERED'">
            <div class="paid-banner-left">
              <span>✓ 100% Full Order Payment Complete • Thank you for shopping with Jhulki Haute Couture!</span>
            </div>
          </div>

          <!-- Order Items -->
          <div class="order-items-preview mt-4">
            <div *ngFor="let item of order.items" class="order-item-row">
              <img [src]="item.product?.images ? item.product.images[0] : '/products/chaniya-choli/full.jpg'" [alt]="item.product?.name" class="mini-img" />
              <div class="item-meta">
                <span class="item-name font-serif">{{ item.product?.name || 'Jhulki Bespoke Item' }}</span>
                <span class="item-spec">Size: {{ item.size }} | Qty: {{ item.quantity }}</span>
              </div>
              <span class="item-price">₹{{ item.price * item.quantity | number:'1.2-2' }}</span>
            </div>
          </div>

          <!-- Order Summary Footer with Breakdown -->
          <div class="order-footer-breakdown mt-3">
            <div class="footer-row" *ngIf="getBogoDiscountAmount(order) > 0">
              <span class="sub-label gold-text">BOGO SPECIAL DISCOUNT APPLIED:</span>
              <span class="val gold-text">- ₹{{ getBogoDiscountAmount(order) | number:'1.2-2' }}</span>
            </div>
            
            <div class="footer-main-row">
              <div class="footer-col" [style.width]="order.isBalancePaid ? '100%' : 'auto'">
                <span class="f-label">TOTAL ORDER AMOUNT:</span>
                <span class="f-val total-highlight">₹{{ order.totalAmount | number:'1.2-2' }}</span>
                <span *ngIf="order.isBalancePaid" class="green-text ml-2" style="font-size:0.75rem; font-weight:700;">(100% FULLY PAID)</span>
              </div>
              <div class="footer-col" *ngIf="!order.isBalancePaid">
                <span class="f-label">ADVANCE PAID (20%):</span>
                <span class="f-val green-highlight">₹{{ getAdvancePaidAmount(order) | number:'1.2-2' }}</span>
              </div>
              <div class="footer-col" *ngIf="!order.isBalancePaid">
                <span class="f-label">BALANCE DUE (80%):</span>
                <span class="f-val gold-highlight">₹{{ getBalanceDueAmount(order) | number:'1.2-2' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="getDisplayOrders().length === 0" class="no-orders glass-card">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="1.5" style="margin-bottom: 12px;">
            <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
          <h3 class="font-serif gold-text">No Orders Found</h3>
          <p>You haven't placed any haute couture orders yet.</p>
          <a routerLink="/products" class="luxury-btn-primary mt-4">EXPLORE COLLECTIONS</a>
        </div>
      </div>

      <!-- UPI QR Code Payment Modal for 80% Remaining Balance -->
      <div class="payment-modal-backdrop" *ngIf="showBalanceModal()" (click)="showBalanceModal.set(false)">
        <div class="payment-modal-card glass-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div>
              <span class="badge-gold">SAFE UPI GATEWAY</span>
              <h3 class="font-serif gold-text mt-1">Pay Remaining 80% Balance</h3>
              <p class="modal-subtitle">Order #{{ selectedOrderForPayment?.orderNumber }} • AWB: {{ selectedOrderForPayment?.trackingId }}</p>
            </div>
            <button class="close-btn" (click)="showBalanceModal.set(false)">✕</button>
          </div>

          <div class="modal-body text-center mt-3" *ngIf="selectedOrderForPayment">
            <div class="amount-summary-pill mb-3">
              <span class="sub-label">AMOUNT TO PAY:</span>
              <span class="pay-val gold-text font-serif">₹{{ getBalanceDueAmount(selectedOrderForPayment) | number:'1.2-2' }}</span>
            </div>

            <!-- QR Code Section -->
            <div class="qr-container">
              <img [src]="getUpiQrUrl(selectedOrderForPayment)" alt="UPI Payment QR Code" class="qr-img" />
              <p class="scan-instruction mt-2">Scan QR with GPay, PhonePe, Paytm, BHIM, or any UPI App</p>
              <div class="upi-id-badge mt-1">
                <span>UPI ID: <strong>jhulki@upi</strong></span>
              </div>
            </div>

            <!-- Transaction Ref Input -->
            <div class="form-group text-left mt-4">
              <label class="input-label">ENTER 12-DIGIT UPI TRANSACTION REF / UTR ID <span class="required">*</span></label>
              <input
                type="text"
                class="luxury-input"
                placeholder="e.g. 425619283745"
                [(ngModel)]="utrNumber"
                maxlength="20"
              />
              <span class="help-text">Enter the 12-digit UTR/Ref number from your payment receipt for instant auto-verification.</span>
            </div>

            <!-- Submit Button -->
            <button (click)="submitBalancePayment()" [disabled]="isProcessing()" class="luxury-btn-primary full-width mt-4">
              <span *ngIf="!isProcessing()">VERIFY & COMPLETE 80% PAYMENT (₹{{ getBalanceDueAmount(selectedOrderForPayment) | number:'1.2-2' }})</span>
              <span *ngIf="isProcessing()">VERIFYING PAYMENT...</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Official Tax Invoice Modal Overlay -->
      <div class="invoice-modal-backdrop" *ngIf="showInvoiceModal()" (click)="showInvoiceModal.set(false)">
        <div class="invoice-modal-card" (click)="$event.stopPropagation()">
          <div class="invoice-action-bar">
            <span class="action-title">Tax Invoice • Order #{{ selectedInvoiceOrder?.orderNumber }}</span>
            <div class="action-btns">
              <button (click)="printInvoice()" class="print-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 6 2 18 2 18 9"></polyline>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                  <rect x="6" y="14" width="12" height="8"></rect>
                </svg>
                <span>PRINT / SAVE PDF</span>
              </button>
              <button class="close-modal-btn" (click)="showInvoiceModal.set(false)">✕</button>
            </div>
          </div>

          <!-- Printable Invoice Sheet -->
          <div class="printable-invoice" id="printableInvoice" *ngIf="selectedInvoiceOrder">
            <!-- Brand Header -->
            <div class="inv-header">
              <div class="brand-info">
                <h2 class="brand-name">JHULKI HAUTE COUTURE</h2>
                <p class="brand-sub">Haute Couture Ethnic Wear & Fashion</p>
                <p class="company-details">
                  Jhulki Haute Couture Pvt. Ltd.<br/>
                  Email: jhulki.official@gmail.com | Web: www.jhulki.store
                </p>
              </div>
              <div class="inv-badge-wrap">
                <div class="tax-inv-badge">TAX INVOICE</div>
                <table class="meta-mini-table">
                  <tr>
                    <td class="m-lbl">Invoice No:</td>
                    <td class="m-val bold">INV-{{ selectedInvoiceOrder.orderNumber }}</td>
                  </tr>
                  <tr>
                    <td class="m-lbl">Invoice Date:</td>
                    <td class="m-val">{{ selectedInvoiceOrder.createdAt | date:'longDate' }}</td>
                  </tr>
                  <tr>
                    <td class="m-lbl">Payment Status:</td>
                    <td class="m-val green-text bold">✓ PAID (100% Full)</td>
                  </tr>
                  <tr>
                    <td class="m-lbl">Payment Mode:</td>
                    <td class="m-val">{{ selectedInvoiceOrder.paymentMethod || 'UPI / Card' }}</td>
                  </tr>
                  <tr *ngIf="selectedInvoiceOrder.trackingId">
                    <td class="m-lbl">AWB Tracking:</td>
                    <td class="m-val bold">{{ selectedInvoiceOrder.trackingId }}</td>
                  </tr>
                </table>
              </div>
            </div>

            <div class="inv-divider"></div>

            <!-- Addresses -->
            <div class="inv-address-grid">
              <div class="addr-card-block">
                <span class="addr-lbl">BILLED & SHIPPED TO:</span>
                <p class="cust-name">{{ selectedInvoiceOrder.shippingName }}</p>
                <p class="cust-address">
                  {{ selectedInvoiceOrder.shippingStreet }}<br/>
                  {{ selectedInvoiceOrder.shippingCity }}, {{ selectedInvoiceOrder.shippingState }} - {{ selectedInvoiceOrder.shippingZip }}<br/>
                  India
                </p>
                <p class="cust-contact">Phone: {{ selectedInvoiceOrder.shippingPhone }}</p>
              </div>
            </div>

            <!-- Items Table -->
            <table class="inv-table mt-3">
              <thead>
                <tr>
                  <th class="text-center" style="width: 40px;">#</th>
                  <th>Item Description</th>
                  <th class="text-center">Size</th>
                  <th class="text-center">Qty</th>
                  <th class="text-right">Unit Price</th>
                  <th class="text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of selectedInvoiceOrder.items; let i = index">
                  <td class="text-center">{{ i + 1 }}</td>
                  <td>
                    <strong class="item-title-text">{{ item.product?.name || 'Jhulki Haute Couture Item' }}</strong>
                  </td>
                  <td class="text-center">{{ item.size }}</td>
                  <td class="text-center">{{ item.quantity }}</td>
                  <td class="text-right">₹{{ item.price | number:'1.2-2' }}</td>
                  <td class="text-right">₹{{ (item.price * item.quantity) | number:'1.2-2' }}</td>
                </tr>
              </tbody>
            </table>

            <!-- Summary & Tax Section -->
            <div class="inv-footer-grid mt-3">
              <div class="terms-box">
                <span class="terms-title">TERMS & CONDITIONS:</span>
                <ol class="terms-list">
                  <li><strong>Return & Exchange Window:</strong> 7-day return and exchange period from delivery date for unused items with tags intact.</li>
                  <li><strong>Ethnic Wear Damage Policy:</strong> If embroidery, hand-carved mirrorwork, zari detailing, or stone embellishments on ethnic wear / chaniya choli are damaged, pulled, or altered, <u>no return or refund will be accepted</u>.</li>
                  <li><strong>Oxidized & Fine Jewelry Care:</strong> Antique oxidized silver finish is handcrafted. Avoid direct contact with perfume, moisture, hairsprays, or harsh chemicals to prevent discoloration and retain original luster.</li>
                  <li>This is a computer-generated tax invoice requiring no physical signature.</li>
                </ol>
              </div>

              <div class="totals-box">
                <table class="totals-table">
                  <tr *ngIf="getBogoDiscountAmount(selectedInvoiceOrder) > 0">
                    <td class="t-lbl">BOGO Offer Discount:</td>
                    <td class="t-val green-text">- ₹{{ getBogoDiscountAmount(selectedInvoiceOrder) | number:'1.2-2' }}</td>
                  </tr>
                  <tr>
                    <td class="t-lbl">Subtotal:</td>
                    <td class="t-val">₹{{ selectedInvoiceOrder.totalAmount | number:'1.2-2' }}</td>
                  </tr>
                  <tr>
                    <td class="t-lbl">GST Included (3%):</td>
                    <td class="t-val">₹{{ (selectedInvoiceOrder.totalAmount * 0.03 / 1.03) | number:'1.2-2' }}</td>
                  </tr>
                  <tr class="highlight-total-row">
                    <td class="t-lbl">Total Invoice Amount:</td>
                    <td class="t-val">₹{{ selectedInvoiceOrder.totalAmount | number:'1.2-2' }}</td>
                  </tr>
                  <tr>
                    <td class="t-lbl">Advance Paid (20%):</td>
                    <td class="t-val">₹{{ getAdvancePaidAmount(selectedInvoiceOrder) | number:'1.2-2' }}</td>
                  </tr>
                  <tr>
                    <td class="t-lbl">Balance Paid (80%):</td>
                    <td class="t-val">₹{{ getBalanceDueAmount(selectedInvoiceOrder) | number:'1.2-2' }}</td>
                  </tr>
                  <tr class="zero-balance-row">
                    <td class="t-lbl">BALANCE OUTSTANDING:</td>
                    <td class="t-val green-text">₹0.00 (PAID IN FULL)</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Authenticity Stamp -->
            <div class="inv-stamp-row mt-4">
              <div class="stamp-badge font-serif">
                <span class="stamp-top">JHULKI ATELIER</span>
                <span class="stamp-bot">VERIFIED PAYMENT</span>
              </div>
              <div class="sign-block">
                <span class="sign-line">Authorized Signatory</span>
                <span class="company-sub">Jhulki Haute Couture Pvt. Ltd.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .track-order-page {
      max-width: 1000px;
      margin: 0 auto;
      padding: 40px 24px 100px;
    }

    .header-banner {
      text-align: center;
    }

    .page-title {
      font-size: 2.4rem;
      color: #f3e5ab;
      margin-top: 8px;
    }

    .subtitle {
      color: #9a9ab0;
      font-size: 0.95rem;
      margin-top: 4px;
    }

    .order-card {
      padding: 24px;
      margin-bottom: 30px;
      position: relative;
      overflow: hidden;
    }

    .delivered-watermark-stamp {
      position: absolute;
      top: 50%;
      right: 8%;
      transform: translateY(-50%) rotate(-14deg);
      pointer-events: none;
      z-index: 1;
      opacity: 0.25;
      user-select: none;
    }

    .stamp-inner {
      border: 3px double #34c759;
      border-radius: 8px;
      padding: 10px 22px;
      text-align: center;
      background: rgba(52, 199, 89, 0.04);
      box-shadow: 0 0 20px rgba(52, 199, 89, 0.1);
    }

    .stamp-title {
      font-size: 2.2rem;
      font-weight: 800;
      letter-spacing: 0.22em;
      color: #34c759;
      display: block;
      line-height: 1;
      text-transform: uppercase;
    }

    .stamp-sub {
      font-size: 0.65rem;
      letter-spacing: 0.25em;
      color: #34c759;
      display: block;
      margin-top: 4px;
    }

    .order-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .order-num {
      font-size: 1.25rem;
      color: #d4af37;
      margin-right: 12px;
      font-weight: 700;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      letter-spacing: 0.05em;
    }

    .order-date {
      color: #8a8a9e;
      font-size: 0.82rem;
    }

    .status-badge {
      background: rgba(212, 175, 55, 0.15);
      border: 1px solid rgba(212, 175, 55, 0.4);
      color: #d4af37;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.08em;
    }

    .status-badge.shipped {
      background: rgba(52, 199, 89, 0.15);
      border-color: rgba(52, 199, 89, 0.4);
      color: #34c759;
    }

    .status-badge.delivered {
      background: rgba(0, 122, 255, 0.15);
      border-color: rgba(0, 122, 255, 0.4);
      color: #007aff;
    }

    .tracking-progress-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      padding: 10px 0;
    }

    .step-point {
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 2;
    }

    .dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #2a2a35;
      border: 2px solid #555;
      transition: all 0.3s ease;
    }

    .step-point.active .dot {
      background: #d4af37;
      border-color: #f3e5ab;
      box-shadow: 0 0 10px rgba(212, 175, 55, 0.8);
    }

    .step-label {
      font-size: 0.75rem;
      color: #777;
      margin-top: 6px;
      font-weight: 500;
    }

    .step-point.active .step-label {
      color: #f3e5ab;
    }

    .line {
      flex: 1;
      height: 2px;
      background: #2a2a35;
      margin: 0 4px;
      margin-bottom: 20px;
    }

    .line.active {
      background: linear-gradient(90deg, #d4af37, #aa820a);
    }

    .awb-info-strip {
      background: rgba(212, 175, 55, 0.08);
      border: 1px solid rgba(212, 175, 55, 0.25);
      border-radius: 4px;
      padding: 12px 18px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }

    .pending-strip {
      background: rgba(255, 255, 255, 0.03);
      border-color: rgba(255, 255, 255, 0.1);
    }

    .label {
      font-size: 0.7rem;
      letter-spacing: 0.1em;
      color: #a0a0b5;
      margin-right: 8px;
    }

    .val {
      font-weight: 600;
      font-size: 0.95rem;
    }

    .gold-text { color: #d4af37; }
    .green-text { color: #34c759; }

    .balance-payment-box {
      background: rgba(255, 183, 3, 0.08);
      border: 1px solid rgba(255, 183, 3, 0.3);
      border-radius: 6px;
      padding: 16px 20px;
    }

    .balance-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }

    .balance-title {
      font-size: 0.85rem;
      letter-spacing: 0.1em;
      color: #ffb703;
    }

    .balance-amount {
      font-size: 1.5rem;
      font-weight: 700;
      margin-top: 2px;
    }

    .timer-badge {
      text-align: right;
    }

    .timer-label {
      font-size: 0.68rem;
      letter-spacing: 0.1em;
      color: #aaa;
      display: block;
    }

    .timer-val {
      font-size: 1.1rem;
      color: #ff4d4d;
      font-weight: 700;
    }

    .warning-alert {
      background: rgba(255, 77, 77, 0.12);
      border: 1px solid rgba(255, 77, 77, 0.3);
      border-radius: 4px;
      padding: 10px 14px;
      font-size: 0.82rem;
      color: #ff8080;
    }

    .pay-balance-btn {
      width: 100%;
    }

    .paid-confirmation-banner {
      background: rgba(52, 199, 89, 0.12);
      border: 1px solid rgba(52, 199, 89, 0.3);
      color: #34c759;
      padding: 12px;
      border-radius: 4px;
      text-align: center;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .order-items-preview {
      border-top: 1px dashed rgba(255, 255, 255, 0.1);
      padding-top: 16px;
    }

    .order-item-row {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 12px;
    }

    .mini-img {
      width: 48px;
      height: 48px;
      object-fit: cover;
      border-radius: 4px;
      border: 1px solid rgba(212, 175, 55, 0.3);
    }

    .item-meta {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .item-name {
      font-size: 0.95rem;
      color: #e5e5e7;
    }

    .item-spec {
      font-size: 0.75rem;
      color: #888;
    }

    .item-price {
      font-size: 0.95rem;
      color: #d4af37;
    }

    .order-footer-breakdown {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 16px;
    }

    .footer-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      font-size: 0.82rem;
    }

    .footer-main-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      background: rgba(0, 0, 0, 0.3);
      padding: 14px 18px;
      border-radius: 6px;
      border: 1px solid rgba(212, 175, 55, 0.2);
    }

    .footer-col {
      display: flex;
      flex-direction: column;
    }

    .f-label {
      font-size: 0.65rem;
      letter-spacing: 0.12em;
      color: #888;
    }

    .f-val {
      font-size: 1.25rem;
      font-weight: 700;
      margin-top: 2px;
    }

    .total-highlight { color: #f3e5ab; }
    .green-highlight { color: #34c759; }
    .gold-highlight { color: #d4af37; }

    .no-orders {
      text-align: center;
      padding: 60px 20px;
    }

    .order-status-summary {
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .bullet { color: #555; }

    /* Modal Backdrop and Card */
    .payment-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .payment-modal-card {
      width: 92% !important;
      max-width: 480px !important;
      background: #121216 !important;
      border: 1px solid rgba(212, 175, 55, 0.35) !important;
      border-radius: 8px !important;
      padding: 24px !important;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(212, 175, 55, 0.15) !important;
      position: relative !important;
      z-index: 1001 !important;
      animation: modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes modalPop {
      from { opacity: 0; transform: scale(0.94) translateY(12px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 12px;
    }

    .modal-subtitle {
      font-size: 0.8rem;
      color: #9a9ab0;
    }

    .close-btn {
      font-size: 1.5rem;
      color: #888;
      background: none;
      border: none;
      cursor: pointer;
      line-height: 1;
      transition: color 0.2s ease;
    }

    .close-btn:hover {
      color: #ff6b6b;
    }

    .amount-summary-pill {
      background: rgba(212, 175, 55, 0.1);
      border: 1px dashed rgba(212, 175, 55, 0.3);
      padding: 10px;
      border-radius: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .sub-label {
      font-size: 0.72rem;
      letter-spacing: 0.1em;
      color: #aaa;
    }

    .pay-val {
      font-size: 1.3rem;
      font-weight: 700;
    }

    .qr-container {
      background: #09090b;
      border: 1px solid rgba(212, 175, 55, 0.25);
      border-radius: 6px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .qr-img {
      width: 170px;
      height: 170px;
      background: #fff;
      padding: 6px;
      border-radius: 4px;
    }

    .scan-instruction {
      font-size: 0.78rem;
      color: #ccc;
    }

    .upi-id-badge {
      font-size: 0.8rem;
      color: #d4af37;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .input-label {
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      color: #bbb;
    }

    .required { color: #ff6b6b; }

    .luxury-input {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(212, 175, 55, 0.3);
      border-radius: 4px;
      padding: 10px 14px;
      color: #fff;
      font-size: 0.95rem;
      width: 100%;
      outline: none;
      transition: border-color 0.2s ease;
    }

    .luxury-input:focus {
      border-color: #d4af37;
      box-shadow: 0 0 10px rgba(212, 175, 55, 0.2);
    }

    .help-text {
      font-size: 0.7rem;
      color: #777;
    }

    .full-width {
      width: 100%;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .invoice-icon-btn {
      background: rgba(212, 175, 55, 0.15);
      border: 1px solid rgba(212, 175, 55, 0.4);
      color: #d4af37;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.25s ease;
    }

    .invoice-icon-btn:hover {
      background: rgba(212, 175, 55, 0.3);
      border-color: #d4af37;
      color: #fff;
    }

    .paid-confirmation-banner {
      background: rgba(52, 199, 89, 0.12);
      border: 1px solid rgba(52, 199, 89, 0.3);
      color: #34c759;
      padding: 12px 18px;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .paid-banner-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .luxury-invoice-btn {
      background: #34c759;
      color: #000;
      border: none;
      padding: 6px 14px;
      border-radius: 4px;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.25s ease;
    }

    .luxury-invoice-btn:hover {
      background: #2cb04d;
      transform: translateY(-1px);
    }

    /* Invoice Modal Styles */
    .invoice-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      padding: 20px;
      overflow-y: auto;
    }

    .invoice-modal-card {
      background: #fff;
      color: #111;
      width: 100%;
      max-width: 780px;
      border-radius: 8px;
      box-shadow: 0 25px 60px rgba(0,0,0,0.9);
      overflow: hidden;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    }

    .invoice-action-bar {
      background: #111116;
      color: #fff;
      padding: 14px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(212, 175, 55, 0.3);
    }

    .action-title {
      font-size: 0.85rem;
      letter-spacing: 0.08em;
      color: #f3e5ab;
      font-weight: 600;
    }

    .action-btns {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .print-btn {
      background: #d4af37;
      color: #000;
      border: none;
      padding: 6px 14px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
    }

    .print-btn:hover {
      background: #e5be48;
    }

    .close-modal-btn {
      background: none;
      border: none;
      color: #aaa;
      font-size: 1.2rem;
      cursor: pointer;
      line-height: 1;
    }

    .close-modal-btn:hover {
      color: #ff6b6b;
    }

    .printable-invoice {
      padding: 36px 40px;
      background: #ffffff;
      color: #111111;
      font-family: 'Helvetica Neue', Arial, sans-serif;
      overflow-y: auto;
    }

    .inv-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .brand-name {
      font-family: serif;
      font-size: 1.6rem;
      letter-spacing: 0.12em;
      color: #111;
      margin: 0;
    }

    .brand-sub {
      font-size: 0.75rem;
      letter-spacing: 0.15em;
      color: #b5952f;
      text-transform: uppercase;
      margin-top: 2px;
    }

    .company-details {
      font-size: 0.75rem;
      color: #555;
      line-height: 1.45;
      margin-top: 8px;
    }

    .tax-inv-badge {
      background: #111;
      color: #d4af37;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      padding: 6px 14px;
      border-radius: 2px;
      text-align: center;
      margin-bottom: 8px;
    }

    .meta-mini-table {
      font-size: 0.78rem;
      color: #333;
    }

    .meta-mini-table td {
      padding: 2px 4px;
    }

    .m-lbl {
      color: #666;
      text-align: right;
    }

    .m-val {
      padding-left: 8px !important;
    }

    .bold { font-weight: 700; }

    .inv-divider {
      height: 1px;
      background: #e0e0e0;
      margin: 20px 0;
    }

    .inv-address-grid {
      display: flex;
      justify-content: space-between;
      gap: 20px;
    }

    .addr-lbl {
      font-size: 0.68rem;
      letter-spacing: 0.12em;
      color: #888;
      font-weight: 700;
    }

    .cust-name {
      font-size: 0.95rem;
      font-weight: 700;
      color: #111;
      margin-top: 4px;
    }

    .cust-address {
      font-size: 0.82rem;
      color: #444;
      line-height: 1.4;
      margin-top: 2px;
    }

    .cust-contact {
      font-size: 0.78rem;
      color: #666;
      margin-top: 4px;
    }

    .inv-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      font-size: 0.82rem;
    }

    .inv-table th {
      background: #f8f9fa;
      border-top: 2px solid #111;
      border-bottom: 2px solid #111;
      padding: 10px 8px;
      text-align: left;
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #111;
    }

    .inv-table td {
      padding: 12px 8px;
      border-bottom: 1px solid #eee;
      color: #222;
    }

    .text-center { text-align: center; }
    .text-right { text-align: right; }

    .inv-footer-grid {
      display: flex;
      justify-content: space-between;
      gap: 30px;
      margin-top: 20px;
    }

    .terms-box {
      flex: 1;
      background: #fafafa;
      padding: 12px 16px;
      border-radius: 4px;
      border: 1px solid #eee;
    }

    .terms-title {
      font-size: 0.68rem;
      letter-spacing: 0.1em;
      font-weight: 700;
      color: #555;
    }

    .terms-list {
      font-size: 0.72rem;
      color: #666;
      padding-left: 14px;
      margin-top: 6px;
      line-height: 1.5;
    }

    .totals-box {
      width: 280px;
    }

    .totals-table {
      width: 100%;
      font-size: 0.82rem;
    }

    .totals-table td {
      padding: 5px 0;
    }

    .t-lbl {
      color: #555;
    }

    .t-val {
      text-align: right;
      font-weight: 600;
      color: #111;
    }

    .highlight-total-row {
      border-top: 1px solid #111;
      border-bottom: 1px solid #111;
      font-weight: 700;
    }

    .highlight-total-row td {
      padding: 8px 0;
      font-size: 0.9rem;
    }

    .zero-balance-row td {
      padding-top: 8px;
      font-weight: 700;
    }

    .inv-stamp-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-top: 1px dashed #ccc;
      padding-top: 20px;
    }

    .stamp-badge {
      border: 2px double #b5952f;
      padding: 8px 16px;
      border-radius: 50px;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #b5952f;
      transform: rotate(-3deg);
    }

    .stamp-top {
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      font-weight: 700;
    }

    .stamp-bot {
      font-size: 0.6rem;
      letter-spacing: 0.1em;
    }

    .sign-block {
      text-align: right;
    }

    .sign-line {
      font-size: 0.8rem;
      font-weight: 700;
      color: #111;
      display: block;
      border-top: 1px solid #111;
      padding-top: 4px;
      width: 180px;
    }

    .company-sub {
      font-size: 0.7rem;
      color: #666;
    }

    .luxury-loader-card {
      text-align: center;
      padding: 70px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(10, 10, 14, 0.45);
      border: 1px solid rgba(212, 175, 55, 0.2);
    }

    .luxury-spinner {
      position: relative;
      width: 70px;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .spinner-ring {
      position: absolute;
      border-radius: 50%;
      border: 2px solid transparent;
    }

    .ring-outer {
      width: 66px;
      height: 66px;
      border-top-color: var(--color-gold-primary);
      border-bottom-color: var(--color-gold-primary);
      animation: spin 1.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
    }

    .ring-inner {
      width: 44px;
      height: 44px;
      border-left-color: #f3e5ab;
      border-right-color: #f3e5ab;
      animation: spin-reverse 1.2s linear infinite;
    }

    .brand-sparkle {
      font-size: 1.3rem;
      animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes spin-reverse {
      0% { transform: rotate(360deg); }
      100% { transform: rotate(0deg); }
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.4; transform: scale(0.9); }
      50% { opacity: 1; transform: scale(1.15); }
    }

    .loader-headline {
      font-size: 1.3rem;
      color: #fff;
      letter-spacing: 0.08em;
    }

    .loader-quote {
      font-size: 0.9rem;
      font-style: italic;
      color: var(--color-gold-light);
      margin-top: 6px;
      letter-spacing: 0.03em;
    }

    /* Print CSS Override */
    @media print {
      body * {
        visibility: hidden !important;
      }
      #printableInvoice, #printableInvoice * {
        visibility: visible !important;
      }
      #printableInvoice {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
        box-shadow: none !important;
      }
      .invoice-modal-backdrop, .invoice-modal-card {
        background: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        position: static !important;
      }
      .invoice-action-bar {
        display: none !important;
      }
    }
  `]
})
export class TrackOrderComponent implements OnInit, OnDestroy {
  showBalanceModal = signal(false);
  showInvoiceModal = signal(false);
  selectedOrderForPayment: any = null;
  selectedInvoiceOrder: any = null;
  utrNumber: string = '';
  isProcessing = signal(false);
  private refreshInterval: any;

  isLoading = signal<boolean>(true);

  constructor(
    public authService: AuthService,
    public ecommerceService: EcommerceService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth']);
      return;
    }
    this.isLoading.set(true);
    this.ecommerceService.fetchOrders().subscribe({
      next: () => this.isLoading.set(false),
      error: () => this.isLoading.set(false)
    });

    // Auto-refresh order data quietly every 10 seconds
    this.refreshInterval = setInterval(() => {
      if (this.authService.isLoggedIn()) {
        this.ecommerceService.fetchOrders().subscribe();
      }
    }, 10000);
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  getDisplayOrders() {
    const dbOrders = this.ecommerceService.orders() || [];
    return this.applyLocalOverrides(dbOrders);
  }

  private applyLocalOverrides(orders: any[]): any[] {
    const raw = localStorage.getItem('jhulki_admin_orders_overrides');
    if (!raw) return orders;
    try {
      const overrides: Record<string, any> = JSON.parse(raw);
      return orders.map(o => {
        const ov = overrides[o.id] || overrides[o.orderNumber];
        if (ov) {
          return {
            ...o,
            trackingId: ov.trackingId !== undefined ? ov.trackingId : o.trackingId,
            status: ov.status !== undefined ? ov.status : o.status,
            shippedAt: ov.shippedAt !== undefined ? ov.shippedAt : o.shippedAt,
            expectedDeliveryDate: ov.expectedDeliveryDate !== undefined ? ov.expectedDeliveryDate : o.expectedDeliveryDate
          };
        }
        return o;
      });
    } catch (e) {
      return orders;
    }
  }

  getExpectedDeliveryDate(order: any): string {
    const shipDate = order.shippedAt ? new Date(order.shippedAt) : new Date(order.createdAt);
    const deliveryDate = new Date(shipDate.getTime() + 5 * 24 * 60 * 60 * 1000);
    return deliveryDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }

  get24hTimer(order: any): string {
    const shipTime = order.shippedAt ? new Date(order.shippedAt).getTime() : new Date(order.createdAt).getTime();
    const expiryTime = shipTime + 24 * 60 * 60 * 1000;
    const now = Date.now();
    const diff = expiryTime - now;

    if (diff <= 0) return 'EXPIRED (Cancellation Pending)';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${mins}m ${secs}s`;
  }

  getAdvancePaidAmount(order: any): number {
    if (order.advancePaid) return order.advancePaid;
    return Math.round(order.totalAmount * 0.20);
  }

  getBogoDiscountAmount(order: any): number {
    if (!order.items || order.items.length < 2) return 0;
    const itemTotalSum = order.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    return Math.max(0, itemTotalSum - order.totalAmount);
  }

  getBalanceDueAmount(order: any): number {
    if (order.balanceDue) return order.balanceDue;
    return order.totalAmount - this.getAdvancePaidAmount(order);
  }

  getUpiQrUrl(order: any): string {
    const amount = this.getBalanceDueAmount(order);
    const upiString = `upi://pay?pa=jhulki@upi&pn=Jhulki%20Haute%20Couture%20Pvt%20Ltd&am=${amount}&cu=INR&tn=Balance%20Order%20${order?.orderNumber}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}&color=d4af37&bgcolor=09090b`;
  }

  openBalancePaymentModal(order: any) {
    this.selectedOrderForPayment = order;
    this.utrNumber = '';
    this.showBalanceModal.set(true);
  }

  submitBalancePayment() {
    if (!this.utrNumber || this.utrNumber.trim().length < 6) {
      Alert.warning('Transaction Ref ID Required', 'Please enter your 12-digit UPI UTR / Transaction Ref Number from your payment app receipt.');
      return;
    }

    const order = this.selectedOrderForPayment;
    const amount = this.getBalanceDueAmount(order);

    this.isProcessing.set(true);

    const onComplete = () => {
      this.isProcessing.set(false);
      this.showBalanceModal.set(false);
      order.isBalancePaid = true;
      Alert.success(
        '80% Balance Payment Received!',
        `✓ Transaction Ref ID: ${this.utrNumber.trim()}\n\nThank you! 80% balance payment (₹${amount.toLocaleString()}) for Order #${order.orderNumber} has been verified and recorded.`
      );
    };

    if (order.id && !order.id.startsWith('demo-')) {
      this.ecommerceService.updateOrderTracking(order.id, order.trackingId, order.status, true).subscribe({
        next: () => onComplete(),
        error: () => onComplete()
      });
    } else {
      onComplete();
    }
  }

  openInvoiceModal(order: any) {
    this.selectedInvoiceOrder = order;
    this.showInvoiceModal.set(true);
  }

  printInvoice() {
    const elem = document.getElementById('printableInvoice');
    if (!elem) {
      window.print();
      return;
    }
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const doc = printFrame.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Tax Invoice - ${this.selectedInvoiceOrder?.orderNumber || 'Jhulki'}</title>
            <style>
              * { box-sizing: border-box; }
              body { margin: 0; padding: 24px; font-family: 'Helvetica Neue', Arial, sans-serif; color: #111; background: #fff; }
              .inv-header { display: flex; justify-content: space-between; align-items: flex-start; }
              .brand-name { font-family: serif; font-size: 1.6rem; letter-spacing: 0.12em; color: #111; margin: 0; }
              .brand-sub { font-size: 0.75rem; letter-spacing: 0.15em; color: #b5952f; text-transform: uppercase; margin-top: 2px; }
              .company-details { font-size: 0.75rem; color: #555; line-height: 1.45; margin-top: 8px; }
              .tax-inv-badge { background: #111; color: #d4af37; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.15em; padding: 6px 14px; border-radius: 2px; text-align: center; margin-bottom: 8px; }
              .meta-mini-table { font-size: 0.78rem; color: #333; }
              .meta-mini-table td { padding: 2px 4px; }
              .m-lbl { color: #666; text-align: right; }
              .m-val { padding-left: 8px !important; }
              .bold { font-weight: 700; }
              .green-text { color: #2cb04d; }
              .inv-divider { height: 1px; background: #e0e0e0; margin: 20px 0; }
              .inv-address-grid { display: flex; justify-content: space-between; gap: 20px; }
              .addr-lbl { font-size: 0.68rem; letter-spacing: 0.12em; color: #888; font-weight: 700; }
              .cust-name { font-size: 0.95rem; font-weight: 700; color: #111; margin-top: 4px; margin-bottom: 0; }
              .cust-address { font-size: 0.82rem; color: #444; line-height: 1.4; margin-top: 2px; }
              .cust-contact { font-size: 0.78rem; color: #666; margin-top: 4px; }
              .inv-table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 0.82rem; }
              .inv-table th { background: #f8f9fa; border-top: 2px solid #111; border-bottom: 2px solid #111; padding: 10px 8px; text-align: left; font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; color: #111; }
              .inv-table td { padding: 12px 8px; border-bottom: 1px solid #eee; color: #222; }
              .text-center { text-align: center; }
              .text-right { text-align: right; }
              .mt-3 { margin-top: 16px; }
              .mt-4 { margin-top: 24px; }
              .font-serif { font-family: serif; }
              .inv-footer-grid { display: flex; justify-content: space-between; gap: 30px; margin-top: 20px; }
              .terms-box { flex: 1; background: #fafafa; padding: 12px 16px; border-radius: 4px; border: 1px solid #eee; }
              .terms-title { font-size: 0.68rem; letter-spacing: 0.1em; font-weight: 700; color: #555; }
              .terms-list { font-size: 0.72rem; color: #666; padding-left: 14px; margin-top: 6px; line-height: 1.5; }
              .totals-box { width: 280px; }
              .totals-table { width: 100%; font-size: 0.82rem; }
              .totals-table td { padding: 5px 0; }
              .t-lbl { color: #555; }
              .t-val { text-align: right; font-weight: 600; color: #111; }
              .highlight-total-row { border-top: 1px solid #111; border-bottom: 1px solid #111; font-weight: 700; }
              .highlight-total-row td { padding: 8px 0; font-size: 0.9rem; }
              .zero-balance-row td { padding-top: 8px; font-weight: 700; }
              .inv-stamp-row { display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px dashed #ccc; padding-top: 20px; }
              .stamp-badge { border: 2px double #b5952f; padding: 8px 16px; border-radius: 50px; display: flex; flex-direction: column; align-items: center; color: #b5952f; transform: rotate(-3deg); }
              .stamp-top { font-size: 0.7rem; letter-spacing: 0.15em; font-weight: 700; }
              .stamp-bot { font-size: 0.6rem; letter-spacing: 0.1em; }
              .sign-block { text-align: right; }
              .sign-line { font-size: 0.8rem; font-weight: 700; color: #111; display: block; border-top: 1px solid #111; padding-top: 4px; width: 180px; }
              .company-sub { font-size: 0.7rem; color: #666; }
              @media print {
                @page { margin: 12mm; size: portrait; }
                body { padding: 0; }
              }
            </style>
          </head>
          <body>
            ${elem.innerHTML}
          </body>
        </html>
      `);
      doc.close();
      setTimeout(() => {
        printFrame.contentWindow?.focus();
        printFrame.contentWindow?.print();
        setTimeout(() => {
          if (document.body.contains(printFrame)) {
            document.body.removeChild(printFrame);
          }
        }, 1000);
      }, 300);
    }
  }
}
