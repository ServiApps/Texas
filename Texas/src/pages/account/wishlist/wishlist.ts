import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WishlistService } from '../../../providers/service/wishlist-service';
import { Functions } from '../../../providers/service/functions';
import { Values } from '../../../providers/service/values';
import {CartPage} from '../../cart/cart';
import {ProductPage} from '../../product/product';

@Component({
  templateUrl: 'wishlist.html'
})
export class Wishlist {

  wishlist: any;
  count: any;
  status: any;
  id: any;

  constructor(public nav: NavController, public service: WishlistService, public functions: Functions, public values: Values) {

  	this.count = 10;
  	this.service.load()
        .then((results) => this.wishlist = results);
    
  }

  getCart(){
      this.nav.push(CartPage);
  }

  getProduct(id){
      this.nav.push(ProductPage, id);
  }


  delete(id){

    this.service.deleteItem(id)
        .then((results) => this.update(results));
     
  }

  update(a){

    if(a.message.status == "success"){
      this.service.load()
        .then((results) => this.wishlist = results);
        this.functions.showAlert(a.message.status, a.message.text);

    }

    if(a.message.status == "error"){

      this.functions.showAlert(a.message.status, a.message.text);
       
    }

  }

  addToCart(id){
    this.service.addToCart(id)
        .then((results) => this.update(results));
  }

  
}