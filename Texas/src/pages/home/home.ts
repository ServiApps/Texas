import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {ProductsPage} from '../products/products';
import {CartPage} from '../cart/cart';
import {SearchPage} from '../search/search';
import {Service} from '../../providers/service/service';
import { Values } from '../../providers/service/values';

@Component({
  templateUrl: 'home.html'
})
export class Home {

  status: any;
  items: any;
  product: any;
  id: any;


  constructor(public nav:NavController, public service: Service, public values: Values) {

    this.items = [];

   }

  getCategory(id, slug){
    this.items.id = id;
    this.items.slug = slug;
    this.items.categories = this.service.categories;
      this.nav.push(ProductsPage, this.items);
  }

  getCart(){
      this.nav.push(CartPage);
  }

  getSearch(){
      this.nav.push(SearchPage);
  }

  mySlideOptions = {
    initialSlide: 1,
    loop: true,
    autoplay: 5800,
    pager: true
  }

}
