import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="legal-page-wrap">
      <div class="legal-header text-center">
        <span class="badge-gold">TERMS & CONDITIONS</span>
        <h1 class="font-serif page-title mt-2">Terms of Service</h1>
        <p class="subtitle">Terms governing the use of Jhulki Haute Couture services and digital atelier.</p>
      </div>

      <div class="legal-card glass-card mt-5">
        <p class="intro-text">
          Welcome to <strong>Jhulki Haute Couture Private Limited</strong>. By browsing, accessing, or placing an order on <a href="https://www.jhulki.store" target="_blank" class="gold-text">www.jhulki.store</a>, you agree to comply with and be bound by the following terms and conditions. Please read them carefully before using our platform.
        </p>

        <div class="policy-section mt-4">
          <h3 class="font-serif section-title gold-text">1. Account & Membership</h3>
          <p>
            When creating an account on Jhulki, you agree to provide true, accurate, and complete information. You are responsible for maintaining the confidentiality of your account password and restricting unauthorized access to your device.
          </p>
        </div>

        <div class="policy-section mt-4">
          <h3 class="font-serif section-title gold-text">2. Product Descriptions & Craftsmanship</h3>
          <p>
            All garments, ethnic couture, and handcrafted pieces are described as accurately as possible. Due to the handcrafted nature of traditional Indian textiles (such as Bandhani, Chikankari, and hand-block prints), subtle variations in color, print, and weave are authentic features of artisanal work.
          </p>
        </div>

        <div class="policy-section mt-4">
          <h3 class="font-serif section-title gold-text">3. Pricing & Payment Terms</h3>
          <p>
            All prices listed on our platform are inclusive of applicable taxes unless specified otherwise. We reserve the right to revise prices or cancel orders affected by manifest pricing errors.
          </p>
          <ul class="mt-2">
            <li><strong>Full Prepayment:</strong> Accepted via credit/debit cards, Net Banking, and UPI.</li>
            <li><strong>30% Advance Booking:</strong> Pay 30% to reserve limited handcrafted inventory, with balance due upon delivery.</li>
          </ul>
        </div>

        <div class="policy-section mt-4">
          <h3 class="font-serif section-title gold-text">4. Intellectual Property</h3>
          <p>
            All content on this site, including logos, designs, trademarks, text, graphics, and apparel images, is the exclusive property of Jhulki Haute Couture Private Limited and protected by copyright laws.
          </p>
        </div>

        <div class="policy-section mt-4">
          <h3 class="font-serif section-title gold-text">5. Governing Law & Jurisdiction</h3>
          <p>
            These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of these terms or your use of the website shall be subject to the exclusive jurisdiction of the courts located in Mohali / Chandigarh, India.
          </p>
        </div>

        <div class="contact-box mt-6 text-center">
          <h4 class="font-serif gold-text text-lg mb-1">Questions Regarding Our Terms?</h4>
          <p class="text-xs text-gray-400 mb-4">Our legal and concierge team is available to answer any questions.</p>
          <a href="mailto:info&#64;jhulki.store.com" class="luxury-btn-outline inline-block" style="padding: 8px 24px; font-size: 0.75rem;">
            EMAIL CONCIERGE
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
    .intro-text {
      font-size: 1.05rem;
      color: #ddd;
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
export class TermsOfServiceComponent {}
