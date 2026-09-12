import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shipping-delivery',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="legal-page-wrap">
      <div class="legal-header text-center">
        <span class="badge-gold">CLIENT SERVICES</span>
        <h1 class="font-serif page-title mt-2">Shipping & Delivery Policy</h1>
        <p class="subtitle">Delivering artisanal elegance directly to your doorstep with supreme care and reliability.</p>
      </div>

      <div class="legal-card glass-card mt-5">
        <!-- Highlight Banners -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="p-5 rounded-xl bg-black/40 border border-amber-500/30 flex items-start gap-4">
            <div class="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" style="width: 20px; height: 20px; min-width: 20px; min-height: 20px;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-serif gold-text mb-1">30% Advance Booking Available</h3>
              <p class="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Reserve your exclusive handcrafted luxury pieces by paying just <strong class="text-amber-300">30% advance</strong> at checkout. Pay the remaining balance upon delivery.
              </p>
            </div>
          </div>

          <div class="p-5 rounded-xl bg-black/40 border border-amber-500/30 flex items-start gap-4">
            <div class="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" style="width: 20px; height: 20px; min-width: 20px; min-height: 20px;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-serif gold-text mb-1">Express Dispatch within 4 Days</h3>
              <p class="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Every handcrafted piece undergoes strict quality curation and is dispatched from our ateliers within <strong class="text-amber-300">4 business days</strong>.
              </p>
            </div>
          </div>
        </div>

        <div class="policy-section mt-4">
          <h3 class="font-serif section-title gold-text">1. Dispatch & Fulfillment Timeline</h3>
          <p>
            At Jhulki, each article of clothing is handled with extraordinary care. Orders placed on our platform are processed immediately and scheduled for dispatch within <strong class="text-white">4 working days</strong> from the time of order confirmation.
          </p>
          <p class="mt-2">
            Once dispatched, standard delivery typically takes <strong class="text-white">3 to 7 business days</strong> depending on your shipping destination across India.
          </p>
        </div>

        <div class="policy-section mt-4">
          <h3 class="font-serif section-title gold-text">2. Flexible Payment & Advance Booking</h3>
          <p>To make high luxury accessible and convenient, Jhulki offers flexible booking options:</p>
          <ul>
            <li><strong>Full Prepayment:</strong> Standard checkout with instant credit/debit card, UPI, or Net Banking options.</li>
            <li><strong>30% Advance Booking:</strong> Lock in limited-edition heritage items by paying 30% upfront and settling the remaining balance at delivery.</li>
            <li><strong>Cash on Delivery (COD):</strong> Available for select locations and order limits.</li>
          </ul>
        </div>

        <div class="policy-section mt-4">
          <h3 class="font-serif section-title gold-text">3. Shipment Tracking & Real-Time Updates</h3>
          <p>
            As soon as your parcel leaves our fulfillment centre, you will receive an SMS and email containing your tracking AWB number along with a direct link to track your order in real-time on our <a routerLink="/track-order" class="gold-text underline">Track Order Page</a>.
          </p>
        </div>

        <div class="policy-section mt-4">
          <h3 class="font-serif section-title gold-text">4. Shipping Charges</h3>
          <p>
            We offer free standard shipping on all prepaid orders across India. Minimal convenience charges may apply for specialized express delivery or Cash on Delivery service options specified during checkout.
          </p>
        </div>

        <div class="contact-box mt-6 text-center">
          <h4 class="font-serif gold-text text-lg mb-1">Need Assistance With Your Delivery?</h4>
          <p class="text-xs text-gray-400 mb-4">Our Client Concierge is available Monday to Friday, 9:00 AM – 6:00 PM IST.</p>
          <div class="flex flex-wrap justify-center gap-4">
            <a href="mailto:info&#64;jhulki.store.com" class="luxury-btn-outline" style="padding: 8px 18px; font-size: 0.75rem;">EMAIL CONCIERGE</a>
            <a routerLink="/contact-us" class="luxury-btn-primary" style="padding: 8px 18px; font-size: 0.75rem;">CONTACT SUPPORT</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .legal-page-wrap {
      max-width: 1000px;
      margin: 0 auto;
      padding: 40px 24px 100px;
    }
    .page-title {
      font-size: 2.5rem;
      color: #fff;
    }
    .subtitle {
      color: #9a9ab0;
      font-size: 0.95rem;
    }
    .legal-card {
      padding: 40px 36px;
      border: 1px solid rgba(212, 175, 55, 0.25);
      color: #ccc;
      line-height: 1.8;
      font-size: 0.95rem;
    }
    .section-title {
      font-size: 1.3rem;
      margin-bottom: 8px;
    }
    ul {
      padding-left: 20px;
      margin: 10px 0;
    }
    li {
      margin-bottom: 6px;
    }
    .contact-box {
      background: rgba(0, 0, 0, 0.3);
      padding: 24px;
      border-radius: 6px;
      border: 1px solid rgba(212, 175, 55, 0.2);
    }
    @media (max-width: 768px) {
      .legal-card {
        padding: 24px 18px;
      }
      .page-title {
        font-size: 1.8rem;
      }
    }
  `]
})
export class ShippingDeliveryComponent {}
