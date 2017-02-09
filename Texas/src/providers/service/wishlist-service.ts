import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Config } from './config';
import { Values } from './values';
import { URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import { LoadingController } from 'ionic-angular';


@Injectable()
export class WishlistService {

  data: any;
  url: any;
  wishlist: any;
  status: any;
  headers: any;
  

  constructor(private http: Http, private config: Config, private values: Values, private loadingController: LoadingController) {
    
    this.url = this.config.url;
  }

  load() {
    var params = new URLSearchParams();
    params.append("count", "10");
    return new Promise(resolve => {
      this.http.post(this.url + '/xmlconnect/wishlist/', params).map(res => res.json())
        .subscribe(data => {
          this.wishlist = data;
      
          resolve(this.wishlist);
        });
    });
  }

  deleteItem(id){
    var params = new URLSearchParams();
    params.append("item", id);
      return new Promise(resolve => {
      this.http.post(this.url + '/xmlconnect/wishlist/remove', params).map(res => res.json())

        .subscribe(data => {
          this.wishlist = data;          
          resolve(this.wishlist);
        });
    });

  }

  addToCart(id){
    var params = new URLSearchParams();
    params.append("item", id);
    return new Promise(resolve => {
      this.http.post(this.url + '/xmlconnect/wishlist/cart/', params).map(res => res.json())
        .subscribe(data => {
          this.wishlist = data;
          this.values.count = this.values.count + 1;
          resolve(this.wishlist);
        });
    });

  }

}

