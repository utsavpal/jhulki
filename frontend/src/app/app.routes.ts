import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CartComponent } from './pages/cart/cart.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TrackOrderComponent } from './pages/track-order/track-order.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminOrdersComponent } from './pages/admin-orders/admin-orders.component';
import { AuthComponent } from './pages/auth/auth.component';
import { ReturnsExchangeComponent } from './pages/returns-exchange/returns-exchange.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './pages/terms-of-service/terms-of-service.component';
import { ShippingDeliveryComponent } from './pages/shipping-delivery/shipping-delivery.component';
import { CancellationsReturnComponent } from './pages/cancellations-return/cancellations-return.component';
import { RefundPolicyComponent } from './pages/refund-policy/refund-policy.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { CareersComponent } from './pages/careers/careers.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Jhulki - Buy Premium Ethnic Collection in India' },
  { path: 'products', component: ProductsComponent, title: 'Collections | Jhulki Luxury' },
  { path: 'product/:id', component: ProductDetailComponent, title: 'Product Details | Jhulki Luxury' },
  { path: 'cart', component: CartComponent, title: 'Shopping Bag | Jhulki Luxury' },
  { path: 'wishlist', component: WishlistComponent, title: 'Wishlist | Jhulki Luxury' },
  { path: 'profile', component: ProfileComponent, title: 'My Account | Jhulki Luxury' },
  { path: 'track-order', component: TrackOrderComponent, title: 'Track Order | Jhulki Luxury' },
  { path: 'returns-exchange', component: ReturnsExchangeComponent, title: 'Returns & Size Exchange | Jhulki Luxury' },
  { path: 'admin', component: AdminComponent, title: 'Admin Atelier | Jhulki Luxury' },
  { path: 'admin/orders', component: AdminOrdersComponent, title: 'Admin Orders & Logistics | Jhulki Luxury' },
  { path: 'auth', component: AuthComponent, title: 'Sign In / Register | Jhulki Luxury' },

  // Legal & Info Pages
  { path: 'about-us', component: AboutUsComponent, title: 'About Us | Jhulki Heritage' },
  { path: 'privacy-policy', component: PrivacyPolicyComponent, title: 'Privacy & Safety | Jhulki Luxury' },
  { path: 'terms-of-service', component: TermsOfServiceComponent, title: 'Terms of Service | Jhulki Luxury' },
  { path: 'shipping-delivery', component: ShippingDeliveryComponent, title: 'Shipping & Delivery | Jhulki Luxury' },
  { path: 'cancellations-return', component: CancellationsReturnComponent, title: 'Cancellations & Return | Jhulki Luxury' },
  { path: 'refund-policy', component: RefundPolicyComponent, title: 'Refund Policy | Jhulki Luxury' },
  { path: 'contact-us', component: ContactUsComponent, title: 'Contact Us | Jhulki Concierge' },
  { path: 'careers', component: CareersComponent, title: 'Careers & Atelier Internships | Jhulki Luxury' },

  { path: '**', redirectTo: '' }
];
