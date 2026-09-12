import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cancellations-return',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="legal-page-wrap">
      <div class="legal-header text-center">
        <span class="badge-gold">CLIENT PROTECTION</span>
        <h1 class="font-serif page-title mt-2">Cancellations & Return Policy</h1>
        <p class="subtitle">Your trust is our highest privilege. Enjoy effortless cancellations, returns, and exchange requests.</p>
      </div>

      <div class="legal-card glass-card mt-5">
        <div class="policy-section">
          <h3 class="font-serif section-title gold-text">1. Order Cancellation Guidelines</h3>
          <p>We understand that plans can change. You may cancel your order at any time before it has been dispatched from our atelier.</p>
          <ul>
            <li><strong>Pre-Dispatch Cancellations:</strong> Full refund will be initiated instantly to your original payment method.</li>
            <li><strong>Post-Dispatch Cancellations:</strong> If the order has already been shipped, please decline parcel delivery at arrival or request a return upon delivery.</li>
          </ul>
        </div>

        <div class="policy-section mt-4">
          <h3 class="font-serif section-title gold-text">2. Return & Exchange Window</h3>
          <p>We offer a hassle-free <strong class="text-white">7-Day Easy Return & Exchange Policy</strong> from the date of delivery.</p>
          <p class="mt-2">To be eligible for a return or size exchange, the item must fulfill the following criteria:</p>
          <ul>
            <li>Unused, unwashed, and undamaged condition with original price tags and Jhulki luxury packaging intact.</li>
            <li>Accompanied by the original invoice or digital proof of purchase.</li>
            <li>Custom-tailored or personalized bespoke garments are non-returnable unless defective.</li>
          </ul>
        </div>

        <div class="policy-section mt-4">
          <h3 class="font-serif section-title gold-text">3. How to Initiate a Return or Exchange</h3>
          <ol class="list-decimal pl-5 space-y-2">
            <li>Visit our dedicated <a routerLink="/track-order" class="gold-text underline font-medium">Return/Exchange Portal</a> or email our team at <a href="mailto:info&#64;jhulki.store.com" class="gold-text underline">info&#64;jhulki.store.com</a> with your Order ID.</li>
            <li>Provide a reason for return and upload photos if the garment is damaged or defective.</li>
            <li>Our reverse logistics partner will schedule a complimentary pickup from your doorstep within 48 hours.</li>
          </ol>
        </div>

        <div class="contact-box mt-6 text-center">
          <h4 class="font-serif gold-text text-lg mb-1">Have Questions About Your Order Return?</h4>
          <p class="text-xs text-gray-400 mb-4">Our concierge team is standing by to resolve any issue promptly.</p>
          <div class="flex flex-wrap justify-center gap-4">
            <a href="mailto:info&#64;jhulki.store.com" class="luxury-btn-outline" style="padding: 8px 18px; font-size: 0.75rem;">MAIL CONCIERGE</a>
            <a routerLink="/track-order" class="luxury-btn-primary" style="padding: 8px 18px; font-size: 0.75rem;">TRACK / RETURN ORDER</a>
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
export class CancellationsReturnComponent {}
