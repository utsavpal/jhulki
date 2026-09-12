import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-refund-policy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="legal-page-wrap">
      <div class="legal-header text-center">
        <span class="badge-gold">FINANCIAL INTEGRITY</span>
        <h1 class="font-serif page-title mt-2">Refund Policy</h1>
        <p class="subtitle">Transparent, swift, and secure refund processing for total peace of mind.</p>
      </div>

      <div class="legal-card glass-card mt-5">
        <div class="policy-section">
          <h3 class="font-serif section-title gold-text">1. Refund Process & Timeline</h3>
          <p>
            Once your returned item is received at our facility and passes quality inspection, your refund will be processed immediately. You will receive email notifications at every stage of the refund lifecycle.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div class="p-4 rounded-xl bg-black/40 border border-amber-500/20">
              <h4 class="gold-text font-serif mb-1">Prepaid Orders</h4>
              <p class="text-xs text-gray-300">Refunded directly to the original bank account, UPI ID, or card within <strong class="text-white">5–7 business days</strong>.</p>
            </div>
            <div class="p-4 rounded-xl bg-black/40 border border-amber-500/20">
              <h4 class="gold-text font-serif mb-1">COD & 30% Advance Orders</h4>
              <p class="text-xs text-gray-300">Refunded via direct NEFT bank transfer or instantly issued as store credits as per your choice.</p>
            </div>
          </div>
        </div>

        <div class="policy-section mt-4">
          <h3 class="font-serif section-title gold-text">2. Instant Store Credit Option</h3>
          <p>
            Clients opting for Store Credit receive an instant gift code loaded into their Jhulki account, valid for 12 months with extra reward bonuses on future atelier purchases.
          </p>
        </div>

        <div class="policy-section mt-4">
          <h3 class="font-serif section-title gold-text">3. Non-Refundable Scenarios</h3>
          <ul>
            <li>Items damaged due to improper care or washing non-compliance.</li>
            <li>Products returned without original tags, security seals, or packaging.</li>
            <li>Requests made beyond the 7-day post-delivery inspection window.</li>
          </ul>
        </div>

        <div class="contact-box mt-6 text-center">
          <h4 class="font-serif gold-text text-lg mb-1">Track Your Refund Status</h4>
          <p class="text-xs text-gray-400 mb-4">Reach out to our finance and concierge team for any queries.</p>
          <a href="mailto:info&#64;jhulki.store.com" class="luxury-btn-primary inline-block" style="padding: 8px 24px; font-size: 0.75rem;">
            EMAIL INFO&#64;JHULKI.STORE.COM
          </a>
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
    .inline-block {
      display: inline-block;
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
export class RefundPolicyComponent {}
