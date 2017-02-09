import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Service} from '../../../providers/service/service';
import { Functions } from '../../../providers/service/functions';
import { Values } from '../../../providers/service/values';
import { Home } from '../../home/home';


@Component({
  templateUrl: 'register.html'
})
export class AccountRegister {

  registerData: any;
  loadRegister: any;
  countries: any;
  status:any;
  public disableSubmit: boolean = false;
  buttonText: any;
  errors: any;
  loginStatus: any;
  country: any;
  billing_states: any;
  shipping_states: any;

  constructor(public nav: NavController, public service: Service, public functions: Functions, public values: Values) {
    
    this.registerData = {};
    this.countries = {};
    this.registerData.billing_address = {};
    this.registerData.shipping_address = {};
    this.buttonText = this.values.lan.RegisterText;
    this.service.getNonce()
          .then((results) => this.handleResults(results));

          

  }

  handleResults(results){
    this.countries = results;
  }

  getBillingRegion(countryId) {
    this.billing_states = this.countries.state[countryId];
  }

  getShippingRegion(countryId) {
    this.shipping_states = this.countries.state[countryId];
  }






  register(a) {
    if(this.validateForm()){
      this.disableSubmit = true;
      this.buttonText = this.values.lan.RegisteringUserProgressTitle;

    this.service.register(a, this.countries.save_account_details)
        .then((results) => this.handleRegister(results));

  }
}

validateForm(){

if(this.registerData.first_name == undefined || this.registerData.firstname == "" ){this.functions.showAlert("ERROR", "Please Enter First Name"); return false}
if(this.registerData.last_name == undefined || this.registerData.lastname == ""){this.functions.showAlert("ERROR", "Please Enter Last Name "); return false}
if(this.registerData.email == undefined || this.registerData.email == ""){this.functions.showAlert("ERROR", "Please Enter Email ID"); return false}
if(this.registerData.password == undefined || this.registerData.password == ""){this.functions.showAlert("ERROR", "Please Enter Password"); return false}

this.registerData.username = this.registerData.email;
this.registerData.billing_address.email = this.registerData.email;
this.registerData.billing_address.first_name = this.registerData.first_name;
this.registerData.billing_address.last_name = this.registerData.last_name;
this.registerData.shipping_address.first_name = this.registerData.first_name;
this.registerData.shipping_address.last_name = this.registerData.last_name;
this.registerData.shipping_address.company = this.registerData.billing_address.company;
this.registerData.shipping_address.address_1 = this.registerData.billing_address.address_1;
this.registerData.shipping_address.address_2 = this.registerData.billing_address.address_2;
this.registerData.shipping_address.city = this.registerData.billing_address.city;
this.registerData.shipping_address.state = this.registerData.billing_address.state;
this.registerData.shipping_address.postcode = this.registerData.billing_address.postcode;
this.registerData.shipping_address.country = this.registerData.billing_address.country;
 
return true;
}
    


  handleRegister(results){
    
    this.buttonText = this.values.lan.RegisterText;

   if(!results.errors){
this.countries.checkout_login;
      this.service.login(this.registerData, this.countries.checkout_login)
        .then((results) => this.loginStatus = results);
            this.nav.setRoot(Home);

    }

    else if(results.errors){

      this.errors = results.errors;

    }

  }

  registerCustomer(){
    if(this.validateForm()){
      this.service.registerCustomer(this.registerData)
        .then((results) => this.handleRegister(results));
    }
        
  }

}
