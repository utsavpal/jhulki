import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { EcommerceService } from '../../services/ecommerce.service';
import { AuthService } from '../../services/auth.service';
import { Order } from '../../models/ecommerce.model';
import { Alert } from '../../utils/alert.utils';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="admin-orders-page">
      <div class="header-banner">
        <div>
          <span class="badge-gold">ATELIER LOGISTICS</span>
          <h1 class="font-serif page-title">Client Orders & AWB Management</h1>
          <p class="subtitle">Assign and auto-save courier AWB tracking IDs for luxury client dispatches</p>
        </div>

        <div class="header-actions">
          <a routerLink="/admin" class="luxury-btn-outline">
            ← BACK TO PRODUCT CATALOG
          </a>
        </div>
      </div>

      <!-- Search and Filter Bar -->
      <div class="search-filter-card glass-card mt-4">
        <div class="search-input-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input 
            type="text" 
            placeholder="Search by Order #, Client Name, or AWB Tracking ID..." 
            [(ngModel)]="searchQuery" 
            (input)="filterOrders()" 
          />
        </div>
        <div class="orders-count font-serif">
          Showing <span>{{ filteredOrders().length }}</span> Orders
        </div>
      </div>

      <!-- Luxury Loading State -->
      <div *ngIf="isLoading()" class="luxury-loader-card glass-card mt-4">
        <div class="luxury-spinner">
          <div class="spinner-ring ring-outer"></div>
          <div class="spinner-ring ring-inner"></div>
          <div class="brand-sparkle">✨</div>
        </div>
        <h3 class="font-serif loader-headline mt-4">Loading Admin Logistics Dashboard...</h3>
        <p class="loader-quote">"Crafting extraordinary elegance for extraordinary moments."</p>
      </div>

      <!-- Orders List Container -->
      <div class="orders-container mt-4" *ngIf="!isLoading()">
        <div *ngFor="let order of filteredOrders()" class="order-admin-card glass-card">
          <!-- Order Card Top Bar -->
          <div class="order-top-bar">
            <div class="order-meta">
              <span class="order-no">{{ order.orderNumber }}</span>
              <span class="order-date">{{ order.createdAt | date:'mediumDate' }}</span>
              <span class="status-chip" [class.shipped]="order.status === 'SHIPPED'" [class.delivered]="order.status === 'DELIVERED'">
                {{ order.status }}
              </span>
            </div>

            <div class="order-total-wrap">
              <span class="total-label">Total Amount:</span>
              <span class="total-val gold-text">₹{{ order.totalAmount | number:'1.2-2' }}</span>
            </div>
          </div>

          <!-- Client & Shipping Details -->
          <div class="client-details-strip">
            <div class="client-info">
              <span class="info-label">CLIENT NAME:</span>
              <span class="info-val">{{ order.shippingName }}</span>
            </div>
            <div class="client-info">
              <span class="info-label">DESTINATION:</span>
              <span class="info-val">{{ order.shippingCity }}, {{ order.shippingState }} ({{ order.shippingZip }})</span>
            </div>
            <div class="client-info">
              <span class="info-label">PHONE:</span>
              <span class="info-val">{{ order.shippingPhone }}</span>
            </div>
            <div class="client-info">
              <span class="info-label">PAYMENT:</span>
              <span class="info-val">{{ order.paymentMethod }}</span>
            </div>
          </div>

          <!-- Products Included in Order -->
          <div class="order-items-section mt-3">
            <h4 class="items-title font-serif">Order Items ({{ order.items.length }})</h4>
            <div class="items-grid">
              <div *ngFor="let item of order.items" class="order-item-card">
                <img [src]="item.product?.images?.[0] || '/images/cat-women-chaniya-choli.jpg'" (error)="onImageError($event)" [alt]="item.product?.name" class="item-img" />
                <div class="item-details">
                  <span class="item-name font-serif" style="letter-spacing: 0.08em; font-weight: 700; color: #d4af37;">
                    PRODUCT ID: {{ item.product?.customCode || item.product?.id || 'JHK-ITEM' }}
                  </span>
                  <span style="font-size: 0.72rem; color: #888; display: block; margin-top: 2px;">({{ item.product?.name }})</span>
                  <div class="item-specs mt-1">
                    <span class="spec-tag">SIZE: {{ item.size }}</span>
                    <span class="spec-tag">QTY: {{ item.quantity }}</span>
                  </div>
                  <span class="item-price gold-text">₹{{ item.price | number:'1.2-2' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Advance Payment & Balance Due Strip -->
          <div class="advance-payment-strip mt-3">
            <span class="pay-tag advance" *ngIf="!order.isBalancePaid">20% ADVANCE PAID: ₹{{ getAdvancePaid(order) | number:'1.2-2' }}</span>
            <span class="pay-tag balance" [class.paid]="order.isBalancePaid">
              {{ order.isBalancePaid ? '✓ 100% FULL PAYMENT RECEIVED' : ('⏳ 80% BALANCE DUE: ₹' + (getBalanceDue(order) | number:'1.2-2')) }}
            </span>
            <button *ngIf="order.isBalancePaid" (click)="openInvoiceModal(order)" class="admin-invoice-btn" title="View & Print Client Tax Invoice">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              <span>TAX INVOICE</span>
            </button>
            <span class="pay-tag notice" *ngIf="order.status === 'SHIPPED' && !order.isBalancePaid">
              📧 24-Hour Balance Payment Email Sent to Client
            </span>
          </div>

          <!-- Status Select (Left) & AWB Tracking (Right) -->
          <div class="awb-control-footer mt-4">
            <!-- Left: Status Dropdown -->
            <div class="status-select-wrap">
              <label class="awb-label font-serif">ORDER STATUS:</label>
              <select 
                [ngModel]="order.status" 
                (ngModelChange)="onStatusChange(order, $event)" 
                class="status-select"
              >
                <option value="PENDING">PENDING</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <!-- Right: AWB Field + Save AWB Button (Disabled until status is SHIPPED) -->
            <div class="awb-field-wrap">
              <label class="awb-label font-serif">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:4px;">
                  <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
                AWB / TRACKING ID:
              </label>
              <div class="awb-input-group">
                <input 
                  type="text" 
                  class="awb-input" 
                  [disabled]="order.status !== 'SHIPPED'"
                  [(ngModel)]="order.trackingId" 
                  placeholder="{{ order.status === 'SHIPPED' ? 'Enter AWB / Tracking number...' : 'Status must be SHIPPED to enter AWB' }}" 
                />
                <button 
                  (click)="saveAwb(order)" 
                  [disabled]="order.status !== 'SHIPPED' || order._saving" 
                  class="luxury-btn-primary save-awb-btn"
                >
                  {{ order._saving ? 'SAVING...' : 'SAVE AWB' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Email Notification Sent Banner -->
          <div class="email-sent-banner mt-3" *ngIf="order.status === 'SHIPPED'">
            <span>📧 <strong>Automated Client Dispatch Email Active:</strong> Client ({{ order.shippingName }}) notified with Delhivery AWB #{{ order.trackingId || 'AWB-PENDING' }}. Client requested to pay 80% balance (₹{{ getBalanceDue(order) | number:'1.2-2' }}) within 24 hours.</span>
          </div>
        </div>

        <div *ngIf="filteredOrders().length === 0" class="no-orders glass-card">
          <p class="font-serif">No orders match your search filter.</p>
        </div>
      </div>

      <!-- Official Tax Invoice Modal Overlay for Admin -->
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
                    <strong class="item-title-text" style="color: #000; font-family: monospace; font-size: 0.9rem;">
                      {{ item.product?.customCode || item.product?.id }}
                    </strong>
                    <span style="display: block; font-size: 0.75rem; color: #555;">{{ item.product?.name }}</span>
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
                    <td class="t-val">₹{{ getAdvancePaid(selectedInvoiceOrder) | number:'1.2-2' }}</td>
                  </tr>
                  <tr>
                    <td class="t-lbl">Balance Paid (80%):</td>
                    <td class="t-val">₹{{ getBalanceDue(selectedInvoiceOrder) | number:'1.2-2' }}</td>
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
    .admin-orders-page {
      max-width: 1280px;
      margin: 0 auto;
      padding: 40px 24px 100px;
    }

    .header-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      padding-bottom: 24px;
    }

    .page-title {
      font-size: 2.4rem;
      color: #fff;
      margin: 6px 0;
    }

    .subtitle {
      font-size: 0.85rem;
      color: #888;
    }

    .search-filter-card {
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
    }

    .search-input-wrap {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid var(--color-border-subtle);
      border-radius: 4px;
      padding: 8px 16px;
      flex-grow: 1;
      max-width: 500px;
      color: #888;
    }

    .search-input-wrap input {
      background: none;
      border: none;
      outline: none;
      color: #fff;
      width: 100%;
      font-size: 0.85rem;
    }

    .orders-count {
      font-size: 0.9rem;
      color: #aaa;
    }

    .orders-count span {
      color: var(--color-gold-primary);
      font-weight: 700;
    }

    .orders-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .order-admin-card {
      padding: 24px;
      border: 1px solid rgba(212, 175, 55, 0.2);
      transition: var(--transition-smooth);
    }

    .order-admin-card:hover {
      border-color: var(--color-gold-primary);
      box-shadow: 0 10px 30px rgba(0,0,0,0.6);
    }

    .order-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      padding-bottom: 14px;
    }

    .order-meta {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .order-no {
      font-size: 1.25rem;
      color: var(--color-gold-light);
      font-weight: 700;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      letter-spacing: 0.05em;
    }

    .order-date {
      font-size: 0.8rem;
      color: #888;
    }

    .status-chip {
      background: rgba(212, 175, 55, 0.15);
      color: var(--color-gold-primary);
      border: 1px solid var(--color-gold-primary);
      padding: 3px 10px;
      font-size: 0.65rem;
      letter-spacing: 0.15em;
      border-radius: 2px;
      font-weight: 600;
    }

    .status-chip.shipped {
      background: rgba(52, 152, 219, 0.2);
      color: #3498db;
      border-color: #3498db;
    }

    .status-chip.delivered {
      background: rgba(46, 204, 113, 0.2);
      color: #2ecc71;
      border-color: #2ecc71;
    }

    .order-total-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .total-label {
      font-size: 0.8rem;
      color: #888;
    }

    .total-val {
      font-size: 1.3rem;
      font-weight: 600;
    }

    .client-details-strip {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      background: rgba(0,0,0,0.3);
      padding: 12px 18px;
      border-radius: 4px;
      margin-top: 14px;
    }

    .client-info {
      display: flex;
      flex-direction: column;
    }

    .info-label {
      font-size: 0.6rem;
      letter-spacing: 0.15em;
      color: #666;
      margin-bottom: 2px;
    }

    .info-val {
      font-size: 0.85rem;
      color: #e0e0e0;
      font-weight: 500;
    }

    .items-title {
      font-size: 1.1rem;
      color: #fff;
      margin-bottom: 12px;
    }

    .items-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }

    .order-item-card {
      display: flex;
      align-items: center;
      gap: 14px;
      background: rgba(0,0,0,0.25);
      border: 1px solid rgba(255,255,255,0.06);
      padding: 10px;
      border-radius: 4px;
    }

    .item-img {
      width: 55px;
      height: 70px;
      object-fit: cover;
      border-radius: 2px;
      border: 1px solid rgba(255,255,255,0.1);
    }

    .item-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .item-name {
      font-size: 0.9rem;
      color: #fff;
      line-height: 1.2;
    }

    .item-specs {
      display: flex;
      gap: 8px;
    }

    .spec-tag {
      font-size: 0.65rem;
      background: rgba(255,255,255,0.06);
      color: #aaa;
      padding: 2px 6px;
      border-radius: 2px;
    }

    .item-price {
      font-size: 0.95rem;
      font-weight: 600;
    }

    /* AWB Logistics Footer Control */
    .awb-control-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      background: rgba(212, 175, 55, 0.05);
      border: 1px solid rgba(212, 175, 55, 0.2);
      padding: 16px 20px;
      border-radius: 4px;
    }

    .awb-field-wrap {
      display: flex;
      align-items: center;
      gap: 14px;
      flex-grow: 1;
    }

    .awb-label {
      font-size: 0.75rem;
      letter-spacing: 0.12em;
      color: var(--color-gold-light);
      white-space: nowrap;
      font-weight: 600;
    }

    .awb-input-group {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-grow: 1;
      max-width: 450px;
    }

    .awb-input {
      flex: 1;
      background: #000;
      border: 1px solid var(--color-border-glow);
      color: #fff;
      padding: 10px 16px;
      border-radius: 4px;
      font-size: 0.85rem;
      letter-spacing: 0.05em;
      outline: none;
      transition: var(--transition-smooth);
    }

    .awb-input:disabled {
      background: rgba(255, 255, 255, 0.03);
      border-color: rgba(255, 255, 255, 0.1);
      color: #666;
      cursor: not-allowed;
    }

    .awb-input:focus:not(:disabled) {
      border-color: var(--color-gold-primary);
      box-shadow: 0 0 10px rgba(212, 175, 55, 0.2);
    }

    .save-awb-btn {
      padding: 10px 18px;
      font-size: 0.75rem;
      letter-spacing: 0.08em;
      white-space: nowrap;
    }

    .save-awb-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      pointer-events: none;
    }

    .awb-status-text {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.7rem;
      letter-spacing: 0.1em;
      padding: 2px 6px;
      border-radius: 2px;
    }

    .awb-status-text.saving {
      color: #f39c12;
    }

    .awb-status-text.saved {
      color: #2ecc71;
      font-weight: 600;
    }

    .email-sent-banner {
      background: rgba(52, 152, 219, 0.15);
      border: 1px solid #3498db;
      color: #3498db;
      padding: 10px 16px;
      font-size: 0.8rem;
      border-radius: 4px;
    }

    .status-select-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .status-select {
      background: #000;
      border: 1px solid var(--color-border-subtle);
      color: #fff;
      padding: 8px 14px;
      font-size: 0.75rem;
      letter-spacing: 0.1em;
      border-radius: 4px;
      outline: none;
    }

    .advance-payment-strip {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      background: rgba(212, 175, 55, 0.05);
      border: 1px dashed rgba(212, 175, 55, 0.25);
      padding: 10px 14px;
      border-radius: 4px;
    }

    .pay-tag {
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      padding: 3px 8px;
      border-radius: 3px;
    }

    .pay-tag.advance {
      background: rgba(212, 175, 55, 0.15);
      color: #f3e5ab;
      border: 1px solid rgba(212, 175, 55, 0.3);
    }

    .pay-tag.balance {
      background: rgba(255, 183, 3, 0.15);
      color: #ffb703;
      border: 1px solid rgba(255, 183, 3, 0.3);
    }

    .pay-tag.balance.paid {
      background: rgba(52, 199, 89, 0.15);
      color: #34c759;
      border-color: rgba(52, 199, 89, 0.3);
    }

    .pay-tag.notice {
      background: rgba(0, 122, 255, 0.15);
      color: #64b5f6;
      border: 1px solid rgba(0, 122, 255, 0.3);
    }

    .no-orders {
      text-align: center;
      padding: 50px;
      color: #888;
    }

    @media (max-width: 768px) {
      .awb-control-footer {
        flex-direction: column;
        align-items: stretch;
      }
      .awb-field-wrap {
        flex-direction: column;
        align-items: stretch;
      }
    }

    .admin-invoice-btn {
      background: rgba(52, 199, 89, 0.15);
      border: 1px solid rgba(52, 199, 89, 0.4);
      color: #34c759;
      padding: 3px 10px;
      border-radius: 3px;
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-left: auto;
      transition: all 0.2s ease;
    }

    .admin-invoice-btn:hover {
      background: rgba(52, 199, 89, 0.3);
      color: #fff;
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
  `]
})
export class AdminOrdersComponent implements OnInit, OnDestroy {
  orders = signal<any[]>([]);
  filteredOrders = signal<any[]>([]);
  statusFilter = 'ALL';
  searchQuery = '';
  showInvoiceModal = signal(false);
  selectedInvoiceOrder: any = null;
  private refreshInterval: any;

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img && !img.src.includes('jhulki_brand_logo')) {
      img.src = '/images/cat-women-chaniya-choli.jpg';
    }
  }

  constructor(
    private ecommerceService: EcommerceService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/']);
      return;
    }
    this.loadOrders();

    // Auto-refresh admin order list quietly every 10 seconds without re-rendering whole page
    this.refreshInterval = setInterval(() => {
      if (this.authService.isAdmin()) {
        this.loadOrders();
      }
    }, 10000);
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  isLoading = signal<boolean>(true);

  loadOrders() {
    this.ecommerceService.fetchAllOrders().subscribe({
      next: (data) => {
        const list = this.applyLocalOverrides(data || []);
        this.orders.set(list);
        this.filteredOrders.set(list);
        this.isLoading.set(false);
      },
      error: () => {
        this.orders.set([]);
        this.filteredOrders.set([]);
        this.isLoading.set(false);
      }
    });
  }

  getAdvancePaid(order: any): number {
    if (order.advancePaid) return order.advancePaid;
    return Math.round(order.totalAmount * 0.20);
  }

  getBalanceDue(order: any): number {
    if (order.balanceDue) return order.balanceDue;
    return order.totalAmount - this.getAdvancePaid(order);
  }

  private applyLocalOverrides(orderList: any[]): any[] {
    const raw = localStorage.getItem('jhulki_admin_orders_overrides');
    if (!raw) return orderList;

    try {
      const overrides: Record<string, any> = JSON.parse(raw);
      return orderList.map(o => {
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
      return orderList;
    }
  }

  private saveLocalOverride(order: any) {
    const raw = localStorage.getItem('jhulki_admin_orders_overrides') || '{}';
    try {
      const overrides = JSON.parse(raw);
      overrides[order.id] = {
        trackingId: order.trackingId,
        status: order.status,
        shippedAt: order.shippedAt,
        expectedDeliveryDate: order.expectedDeliveryDate
      };
      if (order.orderNumber) {
        overrides[order.orderNumber] = overrides[order.id];
      }
      localStorage.setItem('jhulki_admin_orders_overrides', JSON.stringify(overrides));
    } catch (e) {}
  }

  filterOrders() {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) {
      this.filteredOrders.set(this.orders());
      return;
    }

    const filtered = this.orders().filter(o =>
      o.orderNumber.toLowerCase().includes(q) ||
      o.shippingName.toLowerCase().includes(q) ||
      (o.trackingId && o.trackingId.toLowerCase().includes(q))
    );
    this.filteredOrders.set(filtered);
  }

  onStatusChange(order: any, newStatus: string) {
    if (order.status === newStatus) return;
    order.status = newStatus;
    
    if (order.status === 'SHIPPED') {
      order.shippedAt = order.shippedAt || new Date().toISOString();
      order.expectedDeliveryDate = new Date(new Date(order.shippedAt).getTime() + 5 * 24 * 60 * 60 * 1000).toISOString();
    }

    this.saveLocalOverride(order);

    if (order.id) {
      this.ecommerceService.updateOrderTracking(
        order.id, 
        order.trackingId || '', 
        order.status, 
        undefined, 
        order.expectedDeliveryDate, 
        order.shippedAt,
        order.orderNumber
      ).subscribe({
        next: (res) => {
          console.log('[SUCCESS] Status updated in DB:', res);
          Alert.success('Status Updated!', `Order #${order.orderNumber} status updated to ${order.status}.`);
        },
        error: (err) => {
          console.error('[ERROR] Failed to update status in DB:', err);
          const errDetail = err?.status === 0 ? 'CORS / Network Error (PATCH method not allowed or server down)' : (err?.error?.error || err?.message || JSON.stringify(err));
          Alert.error('Status Update Failed!', `Could not save status to database: ${errDetail}`);
        }
      });
    }
  }

  saveAwb(order: any) {
    if (!order.trackingId || !order.trackingId.trim()) {
      Alert.warning('AWB Number Required', 'Please enter a valid AWB / Tracking ID before saving.');
      return;
    }

    order._saving = true;
    this.saveLocalOverride(order);

    this.ecommerceService.updateOrderTracking(
      order.id, 
      order.trackingId.trim(), 
      order.status, 
      undefined, 
      order.expectedDeliveryDate, 
      order.shippedAt,
      order.orderNumber
    ).subscribe({
      next: (res) => {
        order._saving = false;
        console.log('[SUCCESS] AWB saved in DB:', res);
        Alert.success('AWB Saved!', `AWB Tracking ID ${order.trackingId} saved for Order #${order.orderNumber}.`);
      },
      error: (err) => {
        order._saving = false;
        console.error('[ERROR] Failed to save AWB in DB:', err);
        const errDetail = err?.status === 0 ? 'CORS / Network Error (PATCH method not allowed or server down)' : (err?.error?.error || err?.message || JSON.stringify(err));
        Alert.error('AWB Save Failed!', `Could not save AWB to database: ${errDetail}`);
      }
    });
  }

  saveTracking(order: any) {
    this.saveAwb(order);
  }

  private createDummyOrders() {
    return [
      {
        id: 'dummy-1',
        orderNumber: 'JHL-894102',
        createdAt: new Date().toISOString(),
        totalAmount: 380000.00,
        status: 'PROCESSING',
        trackingId: 'AWB984712049IN',
        shippingName: 'Ananya Singhania',
        shippingStreet: 'Villa 14, Mulberry Woods, Palm Beach Road',
        shippingCity: 'Mumbai',
        shippingState: 'Maharashtra',
        shippingZip: '400006',
        shippingPhone: '+91 98201 45789',
        paymentMethod: 'Haute Card',
        items: [
          {
            id: 'item-1',
            size: 'M',
            quantity: 1,
            price: 245000.00,
            product: {
              name: 'Jhulki First Edition Chaniya Choli set',
              images: ['/products/chaniya-choli/full.jpg']
            }
          },
          {
            id: 'item-2',
            size: 'S',
            quantity: 1,
            price: 135000.00,
            product: {
              name: 'Festive Teal Blue Gajji Silk Printed Kurta Set',
              images: ['/products/kurta-teal-gajji/full.jpg']
            }
          }
        ]
      },
      {
        id: 'dummy-2',
        orderNumber: 'JHL-741289',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        totalAmount: 285000.00,
        status: 'SHIPPED',
        trackingId: 'AWB871239014IN',
        shippingName: 'Devraj Kapadia',
        shippingStreet: '42 Rajpur Hill Road',
        shippingCity: 'Dehradun',
        shippingState: 'Uttarakhand',
        shippingZip: '248001',
        shippingPhone: '+91 97110 88234',
        paymentMethod: 'Net Banking',
        items: [
          {
            id: 'item-3',
            size: 'L',
            quantity: 1,
            price: 285000.00,
            product: {
              name: 'Imperial Off-White Gold Mirrorwork Chaniya Choli Set',
              images: ['/products/imperial-offwhite-gold-mirrorwork-chaniya-choli/full.jpg']
            }
          }
        ]
      },
      {
        id: 'dummy-3',
        orderNumber: 'JHL-650392',
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        totalAmount: 165000.00,
        status: 'PENDING',
        trackingId: '',
        shippingName: 'Rohan Oberoi',
        shippingStreet: 'Flat 802, The Camellias, DLF Phase 5',
        shippingCity: 'Gurugram',
        shippingState: 'Haryana',
        shippingZip: '122002',
        shippingPhone: '+91 99100 44120',
        paymentMethod: 'UPI Express',
        items: [
          {
            id: 'item-4',
            size: '40R',
            quantity: 1,
            price: 165000.00,
            product: {
              name: 'Royal Black Asymmetrical Kutchi Embroidered Kurta Set',
              images: ['/products/kurta-black-kutchi/full.jpg']
            }
          }
        ]
      }
    ];
  }

  getBogoDiscountAmount(order: any): number {
    if (!order || !order.items || order.items.length < 2) return 0;
    const itemTotalSum = order.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    return Math.max(0, itemTotalSum - order.totalAmount);
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
