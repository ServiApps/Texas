import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { Address } from '../pages/account/address/address';
import { EditAddressForm } from '../pages/account/edit-address-form/edit-address-form';
import { AccountForgotten } from '../pages/account/forgotten/forgotten';
import { AccountLogin } from '../pages/account/login/login';
import { OrderDetails } from '../pages/account/order-details/order-details';
import { Orders } from '../pages/account/orders/orders';
import { AccountRegister } from '../pages/account/register/register';
import { Wishlist } from '../pages/account/wishlist/wishlist';



import { CartPage } from '../pages/cart/cart';
import { BillingAddressForm } from '../pages/checkout/billing-address-form/billing-address-form';
import { OrderSummary } from '../pages/checkout/order-summary/order-summary';
import { Home } from '../pages/home/home';
import { ProductPage } from '../pages/product/product';
import { ProductsPage } from '../pages/products/products';
import { MyPop } from '../pages/products/products';
import { SearchPage } from '../pages/search/search';
import { MyPopover } from '../pages/search/search';



//Proviers
import { CartService } from '../providers/service/cart-service';
import { CategoryService } from '../providers/service/category-service';
import { CheckoutService } from '../providers/service/checkout-service';
import { Config } from '../providers/service/config';
import { Functions } from '../providers/service/functions';
import { ProductService } from '../providers/service/product-service';
import { SearchService } from '../providers/service/search-service';
import { Service } from '../providers/service/service';
import { Values } from '../providers/service/values';
import { WishlistService } from '../providers/service/wishlist-service';

import { KeysPipe } from '../pipes/pipe';



@NgModule({
  declarations: [
    MyApp,
    Address,
    EditAddressForm,
    AccountForgotten,
    AccountLogin,
    OrderDetails,
    Orders,
    AccountRegister,
    Wishlist,
    CartPage,
    BillingAddressForm,
    OrderSummary,
    Home,
    ProductPage,
    ProductsPage,
    SearchPage,
    KeysPipe,
    MyPop,
    MyPopover,

  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Address,
    EditAddressForm,
    AccountForgotten,
    AccountLogin,
    OrderDetails,
    Orders,
    AccountRegister,
    Wishlist,
    CartPage,
    BillingAddressForm,
    OrderSummary,
    Home,
    ProductPage,
    ProductsPage,
    SearchPage,
    MyPop,
    MyPopover,

  ],
  providers: [
  CartService,
  CategoryService,
  CheckoutService,
  Config,
  Functions,
  ProductService,
  SearchService,
  Service,
  Values,
  WishlistService

  ]
})
export class AppModule {}
