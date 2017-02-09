import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { Config } from './config';
import { Values } from './values';
import { URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';

var headers = new Headers();
headers.append('Content-Type', 'application/x-www-form-urlencoded');

@Injectable()
export class Service {

  data: any;
  url: any;
  categories: any;
  banners: any;
  orders: any;
  order: any;
  isloggedIn: any;
  status: any;
  address: any;
  headers: any;
  products: any;
  product: any;
  cart: any;
  configuration: any;
  loader: any;
  loginStatus: any;
  mainCategories: any;
  country: any;
  user: any;
  
  constructor(private http: Http, private config: Config, private values: Values, public loadingCtrl: LoadingController) {
    
    this.url = this.config.url;
    this.mainCategories = [];

  }

  load() {  

        this.presentLoading(this.values.lan.WaitTitle);
        return new Promise(resolve => {

         this.http.get(this.url + '/api/raham/keys/').map(res => res.json())
            .subscribe(data => {                    
             this.config.consumerKey = data.keys.consumerKey;
             this.config.consumerSecret = data.keys.consumerSecret;
              this.values.currency = data.currency;
              this.banners = data.banners;
                if(data.user.data != undefined){
                  this.values.isLoggedIn = data.user.data.status;
                  this.values.customerId = data.user.data.ID;
                  this.values.customerName = data.user.data.user_nicename;
                  this.values.logoutUrl = this.encodeUrl(data.user.data.url);
                }     

                this.http.get(this.config.setUrl('GET', '/wc-api/v3/products/categories?', false )).map(res => res.json())
                  .subscribe(data => {
                    this.dismissLoading();
                    this.categories = data;

                    
                    for (var i = 0; i < this.categories.product_categories.length; i++) {
                      if(this.categories.product_categories[i].parent == '0'){

                        this.mainCategories.push(this.categories.product_categories[i]);

                      }
                    }  ///wc-api/v3/products/attributes                
                   

                   /*this.http.get(this.config.setUrl('GET', '/wc-api/v3/products/attributes?', false )).map(res => res.json())
                      .subscribe(data => {
                        console.log(data);

                        });*/

                   this.http.get(this.url + '/api/raham/cart/').map(res => res.json())
                      .subscribe(data => {
                        this.cart = data;
                        this.values.updateCart(this.cart); 

                        });                
   
                    resolve(this.categories);
                });

           });       

        

      });  
    
  }


  
  getNonce(){
    
    return new Promise(resolve => {  
      this.http.get(this.url + '/api/raham/nonce/').map(res => res.json())
        .subscribe(data => {
          resolve(data);
      });

    });

  }

  
  login(a, nonce) {
    var params = new URLSearchParams();
    params.append("username", a.username);
    params.append("password", a.password);
    params.append("_wpnonce", nonce);
    params.append("login", 'Login');
    params.append("redirect", this.url + '/api/raham/userdata/');
    
    return new Promise(resolve => {  
      this.http.post(this.url + '/api/raham/login/', params).map(res => res.json())
        .subscribe(data => {
          if(!data.errors){
            this.values.isLoggedIn = data.data.status;
            this.values.customerName = data.data.user_nicename;
            this.values.customerId = data.data.ID;
            this.values.logoutUrl = this.encodeUrl(data.data.url);
            this.values.avatar = data.data.avatar;
          }

          this.http.get(this.url + '/api/raham/cart/').map(res => res.json())
            .subscribe(data => {
              this.cart = data;
              this.values.updateCart(this.cart); 

              });   
          
          resolve(data);
        });

    });

  }

  encodeUrl(href){
    return href.replace(/&amp;/g, '&')
  }

  
  register(a, nonce) {

    return new Promise(resolve => {

          var params = new URLSearchParams();
          params.append("user_login", a.email);
         // params.append("display_name", a.lastname);
         params.append("user_pass", a.password);
         params.append("user_email", a.email);
          params.append("first_name", a.firstname);
          params.append("last_name", a.lastname);    

          params.append("nonce", nonce);         
          
            this.http.post(this.url + '/api/raham/register/', params).map(res => res.json())
              .subscribe(data => {

                  if(!data.errors){
                    var params = new URLSearchParams();
                    params.append("username", a.email);
                    params.append("password", a.password);
                    params.append("_wpnonce", data.data.checkout_login);
                    params.append("login", 'Login');
                    params.append("redirect", this.url + '/api/raham/userdata/');
                    this.http.post(this.url + '/api/raham/login/', params).map(res => res.json())
                         .subscribe(dataLogin => {

                          this.loginStatus = dataLogin;
                          this.values.isLoggedIn = this.loginStatus.data.status;
                          this.values.customerName = this.loginStatus.data.user_nicename;
                          this.values.customerId = this.loginStatus.data.ID;
                          this.values.logoutUrl = this.loginStatus.data.url;
                    
                    });
                  }   

                resolve(data);
            });
              
    });

  }

  
  logout() {
    return new Promise(resolve => {
      this.http.get(this.encodeUrl(this.values.logoutUrl))
        .subscribe(data => {
          this.values.isLoggedIn = false;
          this.values.customerName = "";

          this.http.get(this.url + '/api/raham/cart/').map(res => res.json())
          .subscribe(data => {
            this.cart = data;
            this.values.updateCart(this.cart); 

            });   
          resolve(this.cart);
        });
    });
  }

  
  passwordreset(email, nonce, url) {
    var params = new URLSearchParams();
    params.append("user_login", email);
    params.append("wc_reset_password", "true");
    params.append("_wpnonce", nonce);
    params.append("_wp_http_referer", '/my-account/lost-password/');
    return new Promise(resolve => {
      this.http.post(this.url + '/my-account/lost-password/', params)
        .subscribe(status => {
          resolve(status);
        });
    });
  }

  passwordResetNonce() {
    return new Promise(resolve => {
      this.http.get(this.url + '/api/raham/passwordreset/').map(res => res.json())
        .subscribe(data => {
          resolve(data);
        });
    });
  }

  
  getAddress() {
    return new Promise(resolve => {
      this.http.get(this.config.setUrl('GET', '/wc-api/v3/customers/' + this.values.customerId + '?', false )).map(res => res.json())
        .subscribe(data => {
          this.address = data;
          resolve(this.address);
        });
    });
  }

  
  saveAddress(address) {
    
    var params = {
      customer: address 
    };

    return new Promise(resolve => {
      this.http.put(this.config.setUrl('PUT', '/wc-api/v3/customers/' + this.values.customerId + '?', false ), params).map(res => res.json())
        .subscribe(data => {
          this.products = data;
          resolve(this.products);
        });
    });

  }

  
  editAddress(address, id) {
    var params = new URLSearchParams();
    params.append("id", id);
    params.append("firstname", address.firstname);
    params.append("lastname", address.lastname);
    params.append("company", address.company);
    params.append("street[0]", address.street1);
    params.append("street[1]", address.street2);
    params.append("city", address.city);
    params.append("postcode", address.postcode);
    params.append("telephone", address.telephone);
    params.append("country_id", address.country_id);
    params.append("region_id", address.region_id);
    params.append("region", address.region);
    if(address.default_billing)
    params.append("default_billing", "1");
    if(address.default_shipping)
    params.append("default_shipping", "1");
    return new Promise(resolve => {
      this.http.post(this.url + '/api/raham/wp-json/wc/v1/customers/<id>', params, {
        headers: headers
        }).map(res => res.json())
        .subscribe(data => {
          this.status = data;
          resolve(this.status);
      });
      
    });
  }



  getOrder( id ){
       return new Promise(resolve => {
          this.http.get(this.config.setUrl('GET', '/wc-api/v3/orders/' + id + '?', false )).map(res => res.json())
            .subscribe(data => {
              this.order = data;
              resolve(this.order);
            });
        });

  }


  getCountry(){
       return new Promise(resolve => {  
      this.http.get(this.url + '/api/raham/get_country/').map(res => res.json())
        .subscribe(data => {
          this.country = data;

          
          resolve(this.country);
        });
  });     

 }

 
  registerCustomer(customer){

    var params = {
      customer: customer
    };


    return new Promise(resolve => {
      this.http.post(this.config.setUrl('POST', '/wc-api/v3/customers/?', false ), params).map(res => res.json())
        .subscribe(data => {
          this.user = data;
          resolve(this.user);
        });
    });

  }

getOrders( filter ) {

    return new Promise(resolve => {
      this.http.get(this.config.setUrl('GET', '/wc-api/v3/orders/?', filter )).map(res => res.json())
        .subscribe(data => {
          this.orders = data;
         
          resolve(this.orders);
        });
    });
  }


presentLoading(text) {

      this.loader = this.loadingCtrl.create({
        content: text,
      });

      this.loader.present();

  }

  dismissLoading() {
      this.loader.dismiss();
}

}


