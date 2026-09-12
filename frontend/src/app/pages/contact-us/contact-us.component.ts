import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="legal-page-wrap">
      <div class="legal-header text-center">
        <span class="badge-gold">PERSONALIZED ASSISTANCE</span>
        <h1 class="font-serif page-title mt-2">Contact Us</h1>
        <p class="subtitle">Our Client Support team is dedicated to providing an unparalleled luxury experience.</p>
      </div>

      <div class="legal-card glass-card mt-5">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <!-- Left Info Column -->
          <div class="lg:col-span-5 space-y-6">
            <div class="contact-info-box">
              <h3 class="font-serif gold-text text-lg mb-4 border-b border-amber-500/20 pb-2">Client Support</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="info-label">MAIL US</label>
                  <a href="mailto:info&#64;jhulki.store.com" class="info-value gold-text hover:underline">
                    info&#64;jhulki.store.com
                  </a>
                </div>

                <div>
                  <label class="info-label">CALL US</label>
                  <a href="tel:+918732965683" class="info-value gold-text hover:underline">
                    +91 87329 65683
                  </a>
                </div>

                <div>
                  <label class="info-label">WORKING HOURS</label>
                  <p class="info-value text-white">9:00 AM – 6:00 PM IST</p>
                  <p class="text-gray-400 text-xs mt-0.5">Monday to Friday</p>
                </div>
              </div>
            </div>

            <div class="contact-info-box">
              <h3 class="font-serif gold-text text-md mb-2">Corporate Office</h3>
              <p class="text-xs text-gray-300 leading-relaxed">
                Jhulki Haute Couture Private Limited<br>
                1st Floor, Sunny Business Park, Sunny Enclave,<br>
                Sector 125, Mohali, Punjab – 140301, India
              </p>
            </div>
          </div>

          <!-- Right Interactive Form Column -->
          <div class="lg:col-span-7">
            <div *ngIf="submitted" class="text-center py-10 space-y-3 contact-info-box">
              <div class="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500 text-amber-400 mx-auto flex items-center justify-center text-2xl">
                ✓
              </div>
              <h3 class="text-xl font-serif gold-text">Message Received</h3>
              <p class="text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
                Thank you for reaching out to Jhulki Concierge. Our team will connect with you within 24 business hours.
              </p>
              <button (click)="submitted = false" class="luxury-btn-outline mt-4" style="padding: 10px 24px; font-size: 0.75rem;">
                SEND ANOTHER MESSAGE
              </button>
            </div>

            <form *ngIf="!submitted" (ngSubmit)="onSubmit()" class="space-y-4">
              <h3 class="text-xl font-serif gold-text mb-1">Send an Inquiry</h3>
              <p class="text-gray-400 text-xs mb-4">Fill in your details below and our team will get back to you promptly.</p>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="form-group">
                  <label>YOUR NAME *</label>
                  <input type="text" [(ngModel)]="form.name" name="name" required placeholder="e.g. Ananya Sharma" />
                </div>
                <div class="form-group">
                  <label>EMAIL ADDRESS *</label>
                  <input type="email" [(ngModel)]="form.email" name="email" required placeholder="name&#64;example.com" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="form-group">
                  <label>PHONE NUMBER</label>
                  <input type="tel" [(ngModel)]="form.phone" name="phone" placeholder="+91 98765 43210" />
                </div>
                <div class="form-group">
                  <label>SUBJECT</label>
                  <select [(ngModel)]="form.subject" name="subject">
                    <option value="Order Inquiry">Order Inquiry</option>
                    <option value="Sizing & Fit">Sizing & Fit Advice</option>
                    <option value="Return / Exchange">Return or Exchange</option>
                    <option value="Bespoke Order">Bespoke Couture Request</option>
                    <option value="General">General Questions</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label>MESSAGE *</label>
                <textarea [(ngModel)]="form.message" name="message" rows="4" required placeholder="How can we assist you today?"></textarea>
              </div>

              <button type="submit" class="luxury-btn-primary submit-btn">
                TRANSMIT MESSAGE
              </button>
            </form>
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
    .contact-info-box {
      background: rgba(0, 0, 0, 0.4);
      padding: 24px;
      border-radius: 6px;
      border: 1px solid rgba(212, 175, 55, 0.2);
    }
    .info-label {
      display: block;
      font-size: 0.65rem;
      letter-spacing: 0.2em;
      color: #888;
      margin-bottom: 2px;
    }
    .info-value {
      font-size: 0.95rem;
      font-weight: 500;
    }
    .form-group label {
      display: block;
      font-size: 0.65rem;
      letter-spacing: 0.2em;
      color: #888;
      margin-bottom: 6px;
      font-weight: 600;
    }
    .form-group input, .form-group select, .form-group textarea {
      width: 100%;
      background: #000000;
      border: 1px solid rgba(212, 175, 55, 0.3);
      color: #fff;
      padding: 12px 16px;
      border-radius: 4px;
      font-size: 0.88rem;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
      border-color: var(--color-gold-primary);
      box-shadow: 0 0 8px rgba(212, 175, 55, 0.2);
    }
    .form-group select option {
      background: #111116;
      color: #fff;
    }
    .submit-btn {
      width: 100%;
      padding: 14px;
      font-size: 0.85rem;
      letter-spacing: 0.2em;
      margin-top: 8px;
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
export class ContactUsComponent {
  form = {
    name: '',
    email: '',
    phone: '',
    subject: 'Order Inquiry',
    message: ''
  };

  submitted = false;

  onSubmit() {
    if (this.form.name && this.form.email && this.form.message) {
      this.submitted = true;
      this.form = { name: '', email: '', phone: '', subject: 'Order Inquiry', message: '' };
    }
  }
}
