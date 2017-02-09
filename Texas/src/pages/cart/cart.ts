import { Component } from '@angular/core';
import { NavController, NavParams  } from 'ionic-angular';
import { CartService } from '../../providers/service/cart-service';
import { Values } from '../../providers/service/values';
import { BillingAddressForm } from '../checkout/billing-address-form/billing-address-form';
import { Functions } from '../../providers/service/functions';


@Component({
  templateUrl: 'cart.html'
})
export class CartPage {

  cart: any;
  status: any;
  obj: any;
  quantity: number;
  update: any;
  options: any;
  number: any;
  addProduct: boolean = true;
  coupon: any;
  a: any;
  buttonText:any;
  disableSubmit: boolean = false;
  buttonCoupon: boolean = false;
  disableSubmitCoupon: boolean = false;
  buttonText1:any;
  chosen_shipping: any;
  shipping: any;
  

  constructor(public nav: NavController, public service: CartService, public values: Values, public params: NavParams, public functions: Functions) {
  	
    this.buttonText= "Continue checkout";
    this.buttonText1= "Apply"
    this.quantity = 1;
    this.options = [];
    this.obj = params.data;
    this.service.loadCart()
        .then((results) => this.handleCartInit(results));


  }

  handleCartInit(results){
    this.cart = results;
    this.shipping = results.zone_shipping;
    this.chosen_shipping = results.chosen_shipping;
  }

  


  handleCart(results){
  
   this.cart = results;

  }

  delete(key){

    this.service.deleteItem(key)
        .then((results) => this.handleCart(results));
     
  }

  checkout(){

     this.disableSubmit= true;
     this.buttonText="Please wait...";
     this.service.checkout()
        .then((results) => this.handleBilling(results));

  }

  handleBilling(results){

      this.disableSubmit=false;
      this.buttonText="Continue checkout";
      this.nav.push(BillingAddressForm, results);
 

  }

  deleteFromCart(id, key){

    this.service.deleteFromCart(id, key)
      .then((results) => this.handleCart(results));
    
  }

  addToCart(id, key){
        this.service.addToCart(id, key)
          .then((results) => this.handleCart(results));
  }

  updateCart(results){
    this.service.loadCart()
        .then((results) => this.handleCart(results));
  }

  handleAddToCart(results){

    this.service.loadCart()
        .then((results) => this.handleCart(results));
        
  }

  submitCoupon(){
    if(this.cart.coupon != undefined){
      this.disableSubmitCoupon = true;
      this.buttonText1= "Loading";
       this.service.submitCoupon(this.cart.coupon)
          .then((results) => this.handleCoupon(results));
    }      

  }

  removeCoupon(){
    this.service.removeCoupon(this.cart.applied_coupons)
          .then((results) => this.handleCoupon(results));
  }

  handleCoupon(results){
    this.disableSubmitCoupon = false;
    this.buttonText1= "Apply";
    this.functions.showAlert("STATUS", results._body);
      this.service.loadCart()
        .then((results) => this.handleCart(results));
  
  }

  handleResults(a){

    if(a.message.status == 'success'){
      this.functions.showAlert(a.message.status, a.message.text);

     
    }

    else{
      this.functions.showAlert(a.message.status, a.message.text);
    }

  }

  updateShipping(method){
    this.chosen_shipping = method;
    this.service.updateShipping(method)
        .then((results) => this.handleShipping(results));

  }

  handleShipping(results){
       this.cart = results;

  }



}
