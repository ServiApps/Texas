import {Component, ViewChild} from '@angular/core';
import {Platform, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {Home} from '../pages/home/home';
import {SearchPage} from '../pages/search/search';
import {AccountLogin} from '../pages/account/login/login';
import {AccountRegister} from '../pages/account/register/register';
import {Wishlist} from '../pages/account/wishlist/wishlist';
import {Address} from '../pages/account/address/address';
import {Orders} from '../pages/account/orders/orders';
import {ProductsPage} from '../pages/products/products';
import {CartPage} from '../pages/cart/cart';
import {Service} from '../providers/service/service';
import {Values} from '../providers/service/values';
import {ImagePicker} from 'ionic-native';
import {File} from 'ionic-native';

declare var cordova: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Home;
  pages: Array<{title: string, component: any}>
  menu: Array<{title: string, component: any}>
  configuration: any;
  items: any;

  constructor(public platform: Platform, public service: Service, public values: Values) {

    this.initializeApp();

    this.pages = [
      { title: 'Guest Login', component: AccountLogin },
      { title: 'Welcome', component: AccountLogin },
      { title: 'Home', component: Home },
      { title: 'Search', component: SearchPage } 
    ];

    this.menu = [
      { title: 'Login', component: AccountLogin },
      { title: 'Register', component: AccountRegister },
      { title: 'Wishlist', component: Wishlist },
      { title: 'Address', component: Address },
      { title: 'Orders', component: Orders },
      { title: 'Checkout', component: CartPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();

      this.service.load()
       .then((results) => this.configuration = results);

      File.checkFile(cordova.file.dataDirectory, "profile.jpg")
         .then(_ => this.values.avatar = cordova.file.dataDirectory + "profile.jpg").catch(err => this.values.avatar = "assets/image/profile.jpg");

    });
  }

  openPage(page) {
    this.nav.setRoot(page);
  }

  getCategory(id, slug){
    this.items = [];
    this.items.id = id;
    this.items.slug = slug;
    this.items.categories = this.service.categories;
      this.nav.setRoot(ProductsPage, this.items);
  }

  getCart(){
      this.nav.setRoot(CartPage);
  }

  logout(){
      this.service.logout();  
  }


  getImage(){
      ImagePicker.getPictures({maximumImagesCount: 1, quality: 100, width: 800, height: 800}).then((results) => {
        for (var i = 0; i < results.length; i++) {
         
          var currentName = results[i].replace(/^.*[\\\/]/, '');
          var currentDir = results[i].match(/(.*)[\/\\]/)[1]||'';
          
          var newFileName = "profile.jpg";
          this.values.avatar = results[i] + '?' + new Date().getTime();
          
          File.moveFile(currentDir, currentName, cordova.file.dataDirectory, newFileName).then(function(success){}, function(error){});
        } 
      }, (err) => { });
  }


}


