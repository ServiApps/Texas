import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Config } from './config';
import { Values } from './values';
import { URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { LoadingController } from 'ionic-angular';

var headers = new Headers();
headers.append('Content-Type', 'application/x-www-form-urlencoded');


@Injectable()
export class ProductService {

  data: any;
  url: any;
  product: any;
  gallery: any;
  status: any;
  headers: any;
  
  wishlist: any;
  reviews: any;
  reviewForm: any;
  cart: any;
  code: any;
  loader: any;

  constructor(private http: Http, private config: Config, private values: Values, private loadingController: LoadingController) {
    
    this.url = this.config.url;
  }

  getProduct(id) {
    /*if (this.product) {
      return Promise.resolve(this.product);
    }
    */
    this.presentLoading(this.values.lan.WaitTitle);
    return new Promise(resolve => {
      this.http.get(this.config.setUrl('GET', '/wc-api/v3/products/' + id + '?', false )).map(res => res.json())
        .subscribe(data => {
          this.dismissLoading();
          this.product = data;
          resolve(this.product);
        });
    });
  }

  getReviews(id) {
    return new Promise(resolve => {
      this.http.get(this.config.setUrl('GET', '/wc-api/v3/products/' + id + '/reviews/' + '?', false )).map(res => res.json())
        .subscribe(data => {
          this.reviews = data;
          resolve(this.reviews);
        });
    });
  }

  addToCart(params) {
       return new Promise(resolve => {
      var searchParams = new URLSearchParams();

        for (let param in params) {
            searchParams.set(param, params[param]);
            console.log(param);
            console.log(params[param]);
        }

      this.http.post(this.url + '/api/raham/add_to_cart/', searchParams, {
        headers: headers
        }).map(res => res.json())
        .subscribe(data => { 
          this.status = data;
          resolve(this.status);
        });
    });
  }
  
  presentLoading(text) {

      this.loader = this.loadingController.create({
        content: text,
      });

      this.loader.present();

  }

  dismissLoading() {
      this.loader.dismiss();
}
 
}



