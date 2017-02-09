import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { ProductService } from '../../providers/service/product-service';
import { CartPage } from '../cart/cart';
import { Values } from '../../providers/service/values';
import { KeysPipe } from '../../pipes/pipe';
import { Functions } from '../../providers/service/functions';



@Component({
  templateUrl: 'product.html'

})
export class ProductPage {
  @ViewChild(Content) content: Content;

  product: any;
  id: any;
  status: any;
  options: any;
  opt: any;
  message: any;
  wishlist: any;
  quantity: any;
  reviews: any;
  reviewForm: any;
  nickname: any;
  details: any;


  constructor(public nav: NavController, public service: ProductService, params: NavParams, public functions: Functions, public values: Values) {
    
    this.id = params.data;
    this.options = [];
    this.quantity = "1";
    this.service.getProduct(this.id)
        .then((results) => this.product = results);
  }

  getProduct(id){
      this.nav.push(ProductPage, id);
  }

  addToCart(id){

    if(this.product.type == 'variable' && this.options.length == 0){
      this.functions.showAlert('Eroor', 'Please Select Product Option...')
    }

    else{
      var text = '{';
      var i;
      for (i = 0; i < this.options.length; i++) {
          var res = this.options[i].split(":");
          for(var j = 0; j < res.length; j=j+2){
          text += '"'+res[j]+'":"'+res[j+1]+'",';
        }
      }
      text += '"product_id":"' + id + '",';

      text += '"quantity":"' + this.quantity + '"}';

      var obj = JSON.parse(text);
      this.service.addToCart(obj)
        .then((results) => this.updateCart(results));
    }

      
  }

  
  updateCart(a){

        this.values.count += parseInt(this.quantity);

  }


  getCart(){
      this.nav.push(CartPage);
  }
    
  buyNow(id){

        var text = '{';
        var i;
        for (i = 0; i < this.options.length; i++) {
            var res = this.options[i].split(":");
            text += '"'+res[0]+'":"'+res[1]+'",';
        }
        text += '"product":"' + id + '",';
        text += '"qty":"' + this.quantity + '"}';

        var obj = JSON.parse(text);

     this.nav.push(CartPage, obj);
      
  }
    mySlideOptions = {
      initialSlide: 1,
      loop: true,
      autoplay: 5800,
      pager: true
    }

  getReviews(){
   this.service.getReviews(this.id)
    .then((results) => this.handleReview(results));
  }

  handleReview(a){
    this.reviews = a;
    setTimeout(() => {
    this.content.scrollToBottom(300);
    }, 100);

  }




}