import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Service} from '../../../providers/service/service';
import { Values } from '../../../providers/service/values';
import { Address } from '../address/address';

@Component({
  templateUrl: 'edit-address-form.html'
})
export class EditAddressForm {

  status: any;
  form: any;
  editAddress: any;
  regions: any = [];
  address: any;
  id: any;
  country: any;
  billing_states: any;
  shipping_states: any;
  public disableSubmit:boolean= false;
 
  constructor(public nav: NavController, public service: Service, params: NavParams, public values: Values) {
    
    this.editAddress = params.data;
    this.editAddress.shipping = true;
    
    this.service.getCountry()
        .then((results) => this.handleContries(results)); 	
  
  }


  handleContries(results){
    this.country = results;
    this.billing_states = this.country.state[this.editAddress.billing_address.country];
    this.shipping_states = this.country.state[this.editAddress.shipping_address.country];   

  }


  getBillingRegion(countryId) {
        this.billing_states = this.country.state[countryId];
  }


  getShippingRegion(countryId) {
        this.shipping_states = this.country.state[countryId];
  }


  saveAddress(){

    if(this.editAddress.shipping){
      this.editAddress.shipping_address.first_name = this.editAddress.billing_address.first_name;
      this.editAddress.shipping_address.last_name = this.editAddress.billing_address.last_name;
      this.editAddress.shipping_address.company = this.editAddress.billing_address.company;
      this.editAddress.shipping_address.address_1 = this.editAddress.billing_address.address_1;
      this.editAddress.shipping_address.address_2 = this.editAddress.billing_address.address_2;
      this.editAddress.shipping_address.city = this.editAddress.billing_address.city;
      this.editAddress.shipping_address.country = this.editAddress.billing_address.country;  
      this.editAddress.shipping_address.state = this.editAddress.billing_address.state;      
      this.editAddress.shipping_address.postcode = this.editAddress.billing_address.postcode;
    }

      this.service.saveAddress(this.editAddress)
        .then((results) => this.handleSaveAddress(results));
  }


  handleSaveAddress(results){

    this.disableSubmit=false;
    this.nav.setRoot(Address);
  }


  validateForm(){

        if(this.editAddress.billing_address.firstname == undefined || this.editAddress.billing_address.firstname ==""){return false}
        if(this.editAddress.billing_address.lastname == undefined || this.editAddress.billing_address.lastname ==""){return false}
        if(this.editAddress.billing_address.telephone == undefined || this.editAddress.billing_address.telephone ==""){return false}
        if(this.editAddress.billing_address.email == undefined || this.editAddress.billing_address.email ==""){return false}
        if(this.editAddress.billing_address.street1 == undefined || this.editAddress.billing_address.street1 ==""){return false}
        if(this.editAddress.billing_address.city== undefined || this.editAddress.billing_address.city ==""){return false}
        if(this.editAddress.billing_address.postcode == undefined || this.editAddress.billing_address.postcode ==""){ return false}
        if(this.editAddress.billing_address.country_id == undefined || this.editAddress.billing_address.country_id ==""){return false}
        if(this.regions.length != 0){return false}

         else{return true}
      
  } 
 

 
}
