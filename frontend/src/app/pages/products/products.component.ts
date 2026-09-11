import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EcommerceService } from '../../services/ecommerce.service';
import { AuthService } from '../../services/auth.service';
import { Alert } from '../../utils/alert.utils';
import { Product } from '../../models/ecommerce.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="products-page">
      <!-- Header Banner -->
      <div class="page-header">
        <span class="badge-gold" *ngIf="!isBogoFiltered">JHULKI COLLECTION</span>
        <span class="badge-gold" *ngIf="isBogoFiltered" style="background:#ff4757; color:#fff;">BUY 1 GET 1 FREE PROMOTION</span>
        <h1 [class.font-serif]="!isBogoFiltered" class="page-title" [style.font-family]="isBogoFiltered ? 'sans-serif' : 'inherit'" [style.font-weight]="isBogoFiltered ? '600' : 'normal'" [style.letter-spacing]="isBogoFiltered ? '0.02em' : 'normal'">{{ selectedCategoryName() }}</h1>
        <p class="page-desc" *ngIf="!isBogoFiltered">Explore our curated selection of bespoke apparel, haute couture evening wear, and accessories.</p>
      </div>

      <!-- Filters & Sorting Controls -->
      <div class="controls-bar glass-card">
        <div class="category-pills">
          <button 
            *ngFor="let cat of categories" 
            (click)="selectCategory(cat.slug)"
            [class.active]="currentCategory === cat.slug && !isBogoFiltered"
            class="pill-btn"
          >
            {{ cat.name }}
          </button>
          
          <!-- BOGO Quick Filter Button -->
          <button 
            (click)="toggleBogoFilter()" 
            [class.active]="isBogoFiltered"
            class="pill-btn bogo-pill-btn"
          >
            BOGO OFFERS
          </button>
        </div>

        <div class="sort-wrap">
          <label>Sort By:</label>
          <select [(ngModel)]="currentSort" (change)="applyFilters()">
            <option value="newest">Newest Arrivals</option>
            <option value="bogo-first">BOGO Offers First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>
      </div>

      <!-- Products Grid -->
      <div class="products-grid mt-5">
        <div *ngFor="let product of products()" class="product-card glass-card">
          <div class="product-image-wrap">
            <!-- BOGO Corner Ribbon Badge -->
            <div class="bogo-ribbon" *ngIf="product.isBogoEnabled">
              <span>BUY 1 GET 1 FREE</span>
            </div>

            <img [src]="product.images[0]" [alt]="product.name" />
            <button 
              class="wishlist-btn" 
              (click)="toggleWishlist($event, product.id)"
              [class.active]="ecommerceService.isProductWishlisted(product.id)"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>
          <div class="product-info">
            <span class="category-tag">{{ product.category?.name || 'HAUTE COUTURE' }}</span>
            <a [routerLink]="['/product', product.id]" class="product-name font-serif">{{ product.name }}</a>
            <div class="product-price">
              <span class="current-price">₹{{ ecommerceService.getEffectivePrice(product) }}</span>
              <span class="old-price" *ngIf="ecommerceService.isSaleActive(product)">₹{{ product.price }}</span>
              <span class="sale-badge ml-auto" *ngIf="ecommerceService.isSaleActive(product)" style="font-size:0.6rem; color:#000; background:#d4af37; padding:2px 8px; border-radius:2px; font-weight:600; letter-spacing:0.05em;">
                {{ ecommerceService.getSaleCountdownLabel(product) }}
              </span>
            </div>
            <a [routerLink]="['/product', product.id]" class="view-details-btn">
              VIEW DETAILS
            </a>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="products().length === 0" class="empty-state glass-card">
        <h3 class="font-serif">No Luxury Pieces Found</h3>
        <p>There are no products matching your selected category or search filters.</p>
        <button (click)="resetFilters()" class="luxury-btn-primary mt-3">Reset Filters</button>
      </div>
    </div>
  `,
  styles: [`
    .products-page {
      max-width: 1400px;
      margin: 0 auto;
      padding: 40px 24px 100px;
    }

    .page-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .page-title {
      font-size: 3rem;
      color: #fff;
      margin: 12px 0 8px;
    }

    .page-desc {
      color: #9a9ab0;
      max-width: 600px;
      margin: 0 auto;
      font-size: 0.95rem;
    }

    .controls-bar {
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }

    .category-pills {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .pill-btn {
      padding: 8px 18px;
      font-size: 0.75rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #aaa;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 20px;
      transition: var(--transition-smooth);
    }

    .pill-btn:hover, .pill-btn.active {
      color: #000;
      background: var(--color-gold-primary);
      border-color: var(--color-gold-primary);
    }

    .bogo-pill-btn {
      border-color: #ff4757;
      color: #ff6b81;
      font-weight: 700;
    }

    .bogo-pill-btn:hover, .bogo-pill-btn.active {
      background: linear-gradient(135deg, #ff4757, #ff6b81) !important;
      color: #fff !important;
      border-color: #ff4757 !important;
      box-shadow: 0 4px 12px rgba(255,71,87,0.4);
    }

    .sort-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .sort-wrap label {
      font-size: 0.75rem;
      color: #888;
      letter-spacing: 0.1em;
    }

    .sort-wrap select {
      background: #000;
      color: var(--color-gold-light);
      border: 1px solid var(--color-border-subtle);
      padding: 8px 14px;
      font-size: 0.8rem;
      border-radius: 4px;
      outline: none;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 30px;
    }

    .product-card {
      position: relative;
      transition: var(--transition-smooth);
      display: flex;
      flex-direction: column;
    }

    .product-card:hover {
      transform: translateY(-6px);
      box-shadow: var(--box-shadow-luxury);
      border-color: var(--color-border-glow);
    }

    /* BOGO Corner Ribbon Badge */
    .bogo-ribbon {
      position: absolute;
      top: 0;
      left: 0;
      width: 110px;
      height: 110px;
      overflow: hidden;
      z-index: 5;
      pointer-events: none;
    }

    .bogo-ribbon span {
      position: absolute;
      display: block;
      width: 155px;
      padding: 5px 0;
      background: linear-gradient(135deg, #ff4757, #ff6b81);
      box-shadow: 0 3px 10px rgba(0,0,0,0.5);
      color: #fff;
      font-size: 0.6rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-align: center;
      right: -25px;
      top: 22px;
      transform: rotate(-45deg);
      text-transform: uppercase;
      border: 1px dashed rgba(255,255,255,0.4);
    }

    .product-image-wrap {
      position: relative;
      height: 380px;
      overflow: hidden;
      background: #111;
    }

    .product-image-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s ease;
    }

    .product-card:hover .product-image-wrap img {
      transform: scale(1.05);
    }

    .wishlist-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      background: rgba(0,0,0,0.6);
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      transition: var(--transition-smooth);
      z-index: 6;
    }

    .wishlist-btn.active, .wishlist-btn:hover {
      background: var(--color-gold-primary);
      color: #000;
    }

    .product-info {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    .category-tag {
      font-size: 0.6rem;
      letter-spacing: 0.2em;
      color: var(--color-gold-light);
      text-transform: uppercase;
    }

    .product-name {
      font-size: 1.2rem;
      color: #fff;
      margin: 6px 0 10px;
    }

    .product-price {
      display: flex;
      gap: 12px;
      align-items: baseline;
      margin-bottom: 16px;
    }

    .current-price {
      font-size: 1.3rem;
      color: var(--color-gold-primary);
    }

    .old-price {
      font-size: 0.9rem;
      text-decoration: line-through;
      color: #666;
    }

    .view-details-btn {
      margin-top: auto;
      border: 1px solid rgba(255,255,255,0.15);
      color: #d0d0d0;
      text-align: center;
      padding: 10px;
      font-size: 0.75rem;
      letter-spacing: 0.15em;
      transition: var(--transition-smooth);
    }

    .view-details-btn:hover {
      border-color: var(--color-gold-primary);
      color: var(--color-gold-primary);
      background: rgba(212,175,55,0.05);
    }

    .empty-state {
      text-align: center;
      padding: 60px 24px;
      margin-top: 40px;
    }

    .empty-state h3 {
      font-size: 1.8rem;
      color: var(--color-gold-light);
      margin-bottom: 8px;
    }
  `]
})
export class ProductsComponent implements OnInit {
  products = signal<Product[]>([]);
  categories = [
    { name: 'All Collections', slug: 'all' },
    { name: 'Men', slug: 'men' },
    { name: 'Kurta', slug: 'kurta' },
    { name: 'Women', slug: 'women' },
    { name: 'Chaniya Choli', slug: 'chaniya-choli' },
    { name: 'Blouse', slug: 'blouse' },
    { name: 'Accessories', slug: 'accessories' },
    { name: 'Kids', slug: 'kids' },
    { name: 'Couple', slug: 'couple' },
  ];

  currentCategory = 'all';
  currentSort = 'newest';
  currentSearch = '';
  isBogoFiltered = false;

  constructor(
    public ecommerceService: EcommerceService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['category']) this.currentCategory = params['category'];
      if (params['search']) this.currentSearch = params['search'];
      if (params['bogo'] === 'true') {
        this.isBogoFiltered = true;
        this.currentSort = 'bogo-first';
      } else {
        this.isBogoFiltered = false;
      }
      this.applyFilters();
    });
  }

  selectedCategoryName(): string {
    if (this.isBogoFiltered) return 'Buy 1 Get 1 Free Offers';
    const found = this.categories.find(c => c.slug === this.currentCategory);
    return found ? found.name : 'Haute Couture Collections';
  }

  selectCategory(slug: string) {
    this.currentCategory = slug;
    this.isBogoFiltered = false;
    this.applyFilters();
  }

  toggleBogoFilter() {
    this.isBogoFiltered = !this.isBogoFiltered;
    if (this.isBogoFiltered) {
      this.currentSort = 'bogo-first';
    }
    this.applyFilters();
  }

  resetFilters() {
    this.currentCategory = 'all';
    this.isBogoFiltered = false;
    this.currentSort = 'newest';
    this.currentSearch = '';
    this.applyFilters();
  }

  applyFilters() {
    this.ecommerceService.fetchProducts(this.currentCategory, this.currentSearch, this.currentSort).subscribe(data => {
      let result = [...data];
      if (this.isBogoFiltered || this.currentSort === 'bogo-first') {
        // Sort BOGO enabled items first
        result.sort((a, b) => (b.isBogoEnabled ? 1 : 0) - (a.isBogoEnabled ? 1 : 0));
      }
      this.products.set(result);
    });
  }

  toggleWishlist(event: MouseEvent, productId: string) {
    event.stopPropagation();
    if (!this.authService.isLoggedIn()) {
      Alert.info('Sign In Required', 'Please sign in to add items to your wishlist.');
      return;
    }
    this.ecommerceService.toggleWishlist(productId).subscribe();
  }
}

