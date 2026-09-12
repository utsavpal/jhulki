import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="legal-page-wrap">
      <div class="legal-header text-center">
        <span class="badge-gold">OUR HERITAGE & VISION</span>
        <h1 class="font-serif page-title mt-2">About Jhulki</h1>
        <p class="subtitle">Where timeless Indian tradition meets modern luxury and handcrafted perfection.</p>
      </div>

      <div class="legal-card glass-card mt-5">
        <div class="content-block">
          <p class="lead-text">
            Welcome to <strong>Jhulki</strong> — where timeless tradition meets modern elegance. We are an Indian ethnic & haute couture wear label built on a simple belief: that clothing should tell a story, celebrate rich cultural heritage, and help every individual feel confident and radiant in their own skin.
          </p>

          <p class="body-text mt-3">
            Our collections bring together the richness of India’s textile traditions with contemporary luxury design — from authentic handmade Kutchi mirrorwork and Gajji silk Bandhani to delicate zari work, festive Chaniya Cholis, and bespoke menswear kurta sherwanis. Each piece is chosen with utmost care for its fabric, craftsmanship, and the master artisans behind it.
          </p>
        </div>

        <div class="stand-for-section mt-5">
          <h2 class="font-serif section-heading gold-text">What We Stand For</h2>
          
          <div class="values-grid mt-4">
            <div class="value-item">
              <div class="value-icon">✨</div>
              <div>
                <h4 class="font-serif value-title">Authentic Craftsmanship</h4>
                <p class="value-desc">Genuine handwork and traditional heritage techniques, never mass-produced imitations.</p>
              </div>
            </div>

            <div class="value-item">
              <div class="value-icon">💎</div>
              <div>
                <h4 class="font-serif value-title">Quality You Can Feel</h4>
                <p class="value-desc">Thoughtfully sourced luxury fabrics, hand-finished to ensure lasting elegance.</p>
              </div>
            </div>

            <div class="value-item">
              <div class="value-icon">👑</div>
              <div>
                <h4 class="font-serif value-title">Designs for Everyone</h4>
                <p class="value-desc">A diverse range of bespoke styles and tailored fits for grand celebrations, weddings, and occasion wear.</p>
              </div>
            </div>

            <div class="value-item">
              <div class="value-icon">🤝</div>
              <div>
                <h4 class="font-serif value-title">Supporting Skilled Artisans</h4>
                <p class="value-desc">By sourcing directly from master craftspeople across India, we help keep centuries-old heritage traditions alive.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="closing-block mt-5 text-center">
          <p class="closing-text">
            Whether you’re dressing for a grand wedding celebration or adding a touch of Indian heritage to your wardrobe, <strong>Jhulki</strong> is here to help you do it with ease, grace, and haute couture style.
          </p>
          <h3 class="font-serif slogan-text mt-3 gold-text">
            Join the Jhulki Family — Where Tradition Meets Modernity, and Style Knows No Boundaries.
          </h3>
          <a routerLink="/products" class="luxury-btn-primary mt-4 inline-block">EXPLORE COLLECTIONS</a>
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
    }
    .lead-text {
      font-size: 1.15rem;
      line-height: 1.8;
      color: #f3e5ab;
    }
    .body-text {
      font-size: 0.98rem;
      line-height: 1.8;
      color: #ccc;
    }
    .section-heading {
      font-size: 1.6rem;
      border-bottom: 1px dashed rgba(212, 175, 55, 0.3);
      padding-bottom: 10px;
    }
    .values-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }
    .value-item {
      display: flex;
      gap: 16px;
      background: rgba(0, 0, 0, 0.3);
      padding: 20px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    .value-icon {
      font-size: 1.8rem;
    }
    .value-title {
      font-size: 1.1rem;
      color: #fff;
      margin-bottom: 6px;
    }
    .value-desc {
      font-size: 0.85rem;
      color: #aaa;
      line-height: 1.5;
    }
    .closing-text {
      font-size: 1.05rem;
      color: #ddd;
      line-height: 1.8;
    }
    .slogan-text {
      font-size: 1.3rem;
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
export class AboutUsComponent {}
