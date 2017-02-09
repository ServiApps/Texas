import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, ViewController } from 'ionic-angular';
import { ProductPage } from '../product/product';
import { CategoryService } from '../../providers/service/category-service';
import { CartPage } from '../cart/cart';
import { Values } from '../../providers/service/values';

@Component({
  template: `<ion-header><ion-toolbar color="shadow"> <ion-title text-center>{{values.lan.SelectOptions}}</ion-title> <ion-buttons end> <button ion-button light class="has-icon icon-only has-badge" (click)="close()"> <ion-icon name="close"></ion-icon> </button> </ion-buttons></ion-toolbar></ion-header><ion-content><div *ngIf="options"> <div *ngIf="options.product.options"><div *ngIf="options.product.options.option.length"> <div *ngFor="let option of options.product.options.option; let i=index"> <ion-list radio-group [(ngModel)]="select[i]"> <ion-list-header><b>{{option._label}}</b></ion-list-header> <div *ngIf="option.value.length"> <ion-item *ngFor="let value of option.value"> <ion-label text-wrap>{{value._label}}{{value._formated_price}}</ion-label> <ion-radio value="{{option._code + ':' + value._code}}"></ion-radio> </ion-item> </div><ion-item *ngIf="!option.value.length"> <ion-label text-wrap>{{option.value._label}}{{option.value._formated_price}}</ion-label> <ion-radio value="{{option._code + ':' + option.value._code}}"></ion-radio> </ion-item> </ion-list></div></div><div *ngIf="!options.product.options.option.length"> <ion-list radio-group [(ngModel)]="select[0]"> <ion-list-header><b>{{options.product.options.option._label}}</b></ion-list-header> <div *ngIf="options.product.options.option.value.length"> <ion-item *ngFor="let value of options.product.options.option.value"> <ion-label text-wrap>{{value._label}}{{value._formated_price}}</ion-label> <ion-radio value="{{options.product.options.option._code + ':' + value._code}}"></ion-radio> </ion-item> </div><ion-item *ngIf="!options.product.options.option.value.length"> <ion-label text-wrap>{{options.product.options.option.value._label}}{{options.product.options.option.value._formated_price}}</ion-label> <ion-radio value="{{options.product.options.option._code + ':' + options.product.options.option.value._code}}"></ion-radio> </ion-item> </ion-list></div></div><ion-item> <ion-label>{{values.lan.Quantity}}</ion-label> <ion-input required type="number" [(ngModel)]="quantity" min="1" name="quantity"></ion-input> </ion-item></div></ion-content><ion-footer primary *ngIf="options"><ion-grid no-padding> <button ion-button full clear color="shadow" no-padding no-margin (click)="addToCart()"> ADD TO CART </button></ion-grid></ion-footer>`,
  })

export class MyPop{

  options: any;
  select: any;
  status: any;
  quantity: any;

  constructor(public viewCtrl: ViewController, params: NavParams, public service: CategoryService, public values: Values) {

    this.select = [];
    this.options = params.data.options;
    this.quantity = 1;


  }

  close() {

    this.values.filterUpdate = false;
    this.viewCtrl.dismiss();
  }
  
  addToCart(){


    if(this.values.cart[this.options.product._id] == undefined){this.values.cart[this.options.product._id] = parseInt(this.quantity)} else{this.values.cart[this.options.product._id] += parseInt(this.quantity)}; 

    var text = '{';
    var i;
    for (i = 0; i < this.select.length; i++) {
      var res = this.select[i].split(":");
      text += '"'+res[0]+'":"'+res[1]+'",';
    }
    text += '"product":"' + this.options.product._id + '",';
    text += '"qty":"' + this.quantity + '"}';

    var obj = JSON.parse(text);

    this.service.addToCart(obj)
    .then((results) => this.status = results);

  }
  

}

@Component({
  selector: 'page-products',
  templateUrl: 'products.html'
  })

export class ProductsPage {

  products: any;
  moreProducts: any;
  count: any;
  offset: any;
  category:any;
  filters: any;
  has_more_items: boolean = true;
  listview: boolean = false;
  status: any;
  options: any;
  pop: any;
  categories: any;
  subCategories: any;
  items: any;
  quantity: any;
  filter: any;

  constructor(public nav:NavController, public popoverCtrl: PopoverController, public service: CategoryService, params: NavParams, public values: Values) {

    this.filter = {};
    this.filter.category = params.data.slug;
    this.filter.id = params.data.id;
    this.filter.page = 2;
    this.categories = params.data.categories;
    this.count = 10;
    this.offset = 0;
    this.values.filter = {};
    this.options = [];
    this.subCategories = [];
    this.products = [];
    this.items = [];
    this.quantity = "1";

    this.service.load( this.parseText(this.filter.category, this.count, this.offset, this.values.filter) )
      .then((results) => this.products = results);

    for (var i = 0; i < this.categories.product_categories.length; i++) {
          if(this.categories.product_categories[i].parent == this.filter.id){

            this.subCategories.push(this.categories.product_categories[i]);

          }
    } 

  }

  getCategory(id, slug){
    this.items.id = id;
    this.items.slug = slug;
    this.items.categories = this.categories;
      this.nav.push(ProductsPage, this.items);
  }

  parseText(id, count, offset, obj2){
    
    var text = '{';
    text += '"category'+'":"'+id+'"}';
    var obj1 = JSON.parse(text);

    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;

  }

  getProducts(id){
    this.nav.push(ProductsPage, id);
  }

  getProduct(id){
    this.nav.push(ProductPage, id);
  }

  getCart(){
    this.nav.push(CartPage);
  }

  doInfinite(infiniteScroll) {
    this.service.loadMore( this.filter )
         .then((results) => this.handleMore(results, infiniteScroll));

  }

  handleMore(results, infiniteScroll){
    
    this.filter.page += 1;

    if(results.products!=undefined){
      for (var i = 0; i < results.products.length; i++) {
        this.products.products.push(results.products[i]);
      };
    }
    
    if (results.products.length==0) {
      this.has_more_items = false;
    }

    infiniteScroll.complete();

  }


setListView(){
  this.values.listview = true;

}

setGridView(){
  this.values.listview = false;
}


deleteFromCart(id){

  this.service.deleteFromCart(id)
    .then((results) => this.status = results);
  
}

updateToCart(id){
    this.service.updateToCart(id)
    .then((results) => this.status = results);
}

addToCart(id, type){

  if(type == 'variable'){
    this.nav.push(ProductPage, id);
  }

  else{
    var text = '{';
        var i;
        for (i = 0; i < this.options.length; i++) {
            var res = this.options[i].split(":");
            text += '"'+res[0]+'":"'+res[1]+'",';
        }
        text += '"product_id":"' + id + '",';
        text += '"quantity":"' + this.quantity + '"}';

        var obj = JSON.parse(text);

      this.service.addToCart(obj)
        .then((results) => this.updateCart(results));
  }

        
}
 updateCart(a){        

  }
  
}
