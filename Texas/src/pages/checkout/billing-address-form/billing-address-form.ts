import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';
import { CheckoutService } from '../../../providers/service/checkout-service';
import { Functions } from '../../../providers/service/functions';
import { Values } from '../../../providers/service/values';
import { Home } from '../../home/home';
import { OrderSummary } from '../order-summary/order-summary';



@Component({
  templateUrl: 'billing-address-form.html'
})
export class BillingAddressForm {

  billingAddressForm: any;
  billing: any;
  regions: any;
  status: any;
  errorMessage: any;
  address: any;
  form: any;
  states: any;
  OrderReview: any;
  loginData: any;
  id: any;
  error: any;
  couponStatus: any;
  showCreateAccont:  boolean = false;
  buttonSubmit: boolean= false;
  buttonSubmitLogin: boolean= false;
  buttonSubmitCoupon: boolean= false;
  buttonText: any;
  buttonText1: any;
  buttonText2: any

  
  constructor(public nav: NavController, public service: CheckoutService, params: NavParams, public functions: Functions, public values: Values) {

    this.buttonText="Place order";
    this.buttonText1= "Apply";
    this.buttonText2= "Login";
    this.loginData = [];
    this.form = params.data;
    this.billing = {};
    this.billing.shipping = true;
    this.billing.save_in_address_book = true;
    this.getRegion(this.form.billing_country);

  }



  getRegion(countryId) {

    this.states = this.form.state[countryId];

    this.service.updateOrderReview(this.form)
        .then((results) => this.OrderReview = results);

  }


  checkout() {

    this.buttonSubmit= true;
    this.buttonText="Placing order...";
    this.service.checkout(this.form)
        .then((results) => this.handleBilling(results));

  }

  checkoutPaypal(){

    this.buttonSubmit= true;
    this.buttonText="Placing order...";
    this.service.checkout(this.form)
        .then((results) => this.handlePaypal(results));

  }

  handlePaypal(results){
    
    if(results.result == 'success'){
      let browser = new InAppBrowser(results.redirect, '_blank', 'location=yes');
        browser.show();
        this.values.cart = [];
        this.values.count = 0;
        this.nav.setRoot(Home);
     }

    else if(results.result == 'failure'){
      this.functions.showAlert("STATUS", results.messages);
    }

    this.buttonSubmit= false;
    this.buttonText="Place Order";

  }

  checkoutStripe(){

    this.buttonSubmit= true;
    this.buttonText="Placing Order...";
    this.service.getStripeToken(this.form)
        .then((results) => this.handleStripeToken(results));

  }

  handleStripeToken(results){
  if(results.error){
    this.buttonSubmit= false;
    this.buttonText="Place Order";
    this.functions.showAlert("ERROR", results.error.message);
  }
  else{
    this.service.stripePlaceOrder(this.form, results)
        .then((results) => this.handleBilling(results));
  }
  }


  handleStripe(results){

    console.log(results);
  }

  

  handleBilling(results){

     if(results.result == "success"){
        var str = results.redirect;
        var pos1 = str.lastIndexOf("order-received/");
        var pos2 = str.lastIndexOf("?key=wc_order");
        var pos3 = pos2 - (pos1+15);
        var order_id = str.substr(pos1+15, pos3);
      this.nav.push(OrderSummary, order_id);
     }

     else if(results.result == "failure"){
      this.functions.showAlert("ERROR", results.messages);
     }

    this.buttonSubmit= false;
    this.buttonText="Place Order";
      
  }


   login() {

 
     if(this.validateForm()){      
       
       this.buttonSubmitLogin = true;
       this.buttonText2= "Loading";

       this.service.login(this.form)
          .then((results) => this.handleResults(results));

     }
 }

validateForm(){

if(this.form.username == undefined || this.form.username == ""){return false}
if(this.form.password == undefined || this.form.password == ""){return false}

else{return true}
}


  handleResults(a){

    this.buttonSubmitLogin = false;
    this.buttonText2= "Login";

    if(a.user_logged){
      this.form = a;
      this.states = this.form.state[this.form.billing_country];
      this.values.isLoggedIn = a.user_logged;
      this.values.customerName = a.billing_first_name;
      this.values.customerId = a.user_id;
      this.values.logoutUrl = a.logout_url;
    }
    else {
      this.functions.showAlert("Error", 'Login unsuccessful. try again');
    }
  }
  
  submitCoupon(){

    this.buttonSubmitCoupon = true;
    this.buttonText1= "Loading";
   
    this.service.submitCoupon(this.form)
      .then((results) => this.handleCoupon(results));

  }

  handleCoupon(results){
    this.buttonSubmitCoupon = false;
    this.buttonText1= "Apply";

    this.couponStatus = results._body;
    this.functions.showAlert("STATUS", results._body);
    this.service.updateOrderReview(this.form)
        .then((results) => this.OrderReview = results);
  
  }

  
  createAccount(){
    this.showCreateAccont = true;
  }

  changePayment(){
    this.buttonSubmit= false;
    this.buttonText="Place Order";
  }
}