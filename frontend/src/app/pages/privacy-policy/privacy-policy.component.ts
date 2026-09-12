import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="legal-page-wrap">
      <div class="legal-header text-center">
        <span class="badge-gold">PRIVACY & DATA PROTECTION</span>
        <h1 class="font-serif page-title mt-2">Privacy & Safety Policy</h1>
        <p class="subtitle">Compliance under Information Technology Act, 2000 & IT Rules.</p>
      </div>

      <div class="legal-card glass-card mt-5">
        <p class="intro-text">
          <strong>Jhulki Haute Couture Private Limited</strong> (“we”, “us”, “our”) respects the privacy of every user who accesses our website at <a href="https://www.jhulki.store" target="_blank" class="gold-text">www.jhulki.store</a> (the “Website”). This Privacy Policy explains what information we collect from you, how we collect and use it, and the steps we take to protect it. It is published in compliance with the Information Technology Act, 2000 and the rules made thereunder. By using the Website, you consent to the practices described here.
        </p>

        <div class="policy-section mt-4">
          <h3 class="font-serif section-title gold-text">1. Information We Collect</h3>
          <p>The information we collect may include both Personal Information and Non-Personal Information.</p>
          <p><strong>Personal Information</strong> may include your name, billing and shipping address, email address, telephone number, transaction and purchase history, payment details, login credentials, and any other information you provide while registering or placing an order.</p>
          <p><strong>Non-Personal Information</strong> is data that does not personally identify you, such as your approximate location, internet service provider, browser type, operating system, the pages you visit, and the date, time and duration of your visit. This is typically collected automatically, including through cookies.</p>
        </div>

        <div class="policy-section mt-4">
          <h3 class="font-serif section-title gold-text">2. How We Use Your Information</h3>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process and fulfil your orders, payments, shipping, and order communications;</li>
            <li>Provide customer support and respond to your queries;</li>
            <li>Personalise your experience on the Website;</li>
            <li>Send you updates, offers and marketing communications (where you have opted in);</li>
            <li>Carry out internal analysis to improve our products, services and Website;</li>
            <li>Detect and prevent fraud and protect the security of the Website; and</li>
            <li>Comply with applicable legal obligations.</li>
          </ul>
          <p>We do not sell, rent or trade your Personal Information. Your information is kept confidential to the maximum extent possible.</p>
        </div>

        <div class="policy-section mt-4">
          <h3 class="font-serif section-title gold-text">3. Cookies</h3>
          <p>Cookies are small identifiers placed on your device that help us recognise you, remember your preferences and understand how the Website is used. You can choose to block or delete cookies through your browser settings; however, some features of the Website may not function properly if cookies are disabled.</p>
        </div>

        <div class="policy-section mt-4">
          <h3 class="font-serif section-title gold-text">4. Sharing & Disclosure</h3>
          <p>We may share your information with trusted service providers (such as payment gateways, logistics and technology partners) strictly to provide our services to you. We may also disclose information where required by law, by a court or government authority, or to protect our legal rights or the safety of our users. We do not disclose your Personal Information to third parties for their own marketing purposes.</p>
          <p>The Website may contain links to third-party websites. We are not responsible for the privacy practices of those websites, and we encourage you to review their policies before sharing any information.</p>
        </div>

        <div class="policy-section mt-4">
          <h3 class="font-serif section-title gold-text">5. Data Security</h3>
          <p>The security of your information is important to us, and we use 256-bit SSL encryption and reasonable security practices and procedures to safeguard it. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security. We will not be held responsible for any loss or misuse of information arising from events beyond our reasonable control.</p>
        </div>

        <div class="policy-section mt-4">
          <h3 class="font-serif section-title gold-text">6. Your Rights</h3>
          <p>All Personal Information is provided by you voluntarily. You may review, update or correct your information at any time, and you may withdraw your consent or request deletion of your Personal Information by writing to us at <strong class="gold-text">info&#64;jhulki.store.com</strong> with the subject line “Delete my information”. Please note that withdrawal of consent applies prospectively, and we may retain certain information where required by law.</p>
        </div>

        <div class="policy-section mt-4">
          <h3 class="font-serif section-title gold-text">7. Changes to This Policy</h3>
          <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page, and your continued use of the Website will constitute acceptance of the updated policy. We encourage you to review this page periodically.</p>
        </div>

        <div class="policy-section mt-4">
          <h3 class="font-serif section-title gold-text">8. Grievance Redressal</h3>
          <p>If you have any questions, concerns or grievances regarding this Privacy Policy or your information, please contact us:</p>
          <div class="contact-box mt-2">
            <p><strong>Email:</strong> info&#64;jhulki.store.com</p>
            <p><strong>Entity:</strong> Jhulki Haute Couture Private Limited</p>
            <p><strong>Corporate Address:</strong> 1st Floor, Sunny Business Park, Sunny Enclave, Sector 125, Mohali, Punjab – 140301, India</p>
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
      padding: 16px;
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
export class PrivacyPolicyComponent {}
