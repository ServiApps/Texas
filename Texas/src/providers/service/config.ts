import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';


declare var oauthSignature: any;

@Injectable()
export class Config {

  url: any;
  consumerKey: any;
  consumerSecret: any;
  oauth: any;
  signedUrl: any;
  randomString: any;
  oauth_nonce: any;
  oauth_signature_method: any;
  encodedSignature: any;
  searchParams: any;
  customer_id: any;
  params: any;

  constructor() {

    this.url = 'http://texas.appstakeaway.com';

    this.oauth = oauthSignature;
    this.oauth_signature_method = 'HMAC-SHA1';
    this.searchParams = new URLSearchParams();
    this.params = {};
    this.params.oauth_consumer_key = this.consumerKey;
    this.params.oauth_signature_method = 'HMAC-SHA1';
    this.params.oauth_version = '1.0';

  }


  setOauthNonce(length, chars) {
     var result = '';
     for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
                return result;
  }


  setUrl(method, endpoint, filter) {

    if( this.url.indexOf('https') >= 0){
      var unordered = {};
      if(filter){
        for(var key in filter) {
          if(key == 'category'){
            unordered["filter[" + key + "]"] = filter[key];
          }else
          unordered[key] = filter[key];
        }
      }

      unordered['consumer_key'] = this.consumerKey;
      unordered['consumer_secret'] = this.consumerSecret;
      
      var ordered = {};
      Object.keys(unordered).sort().forEach(function(key) {
        ordered[key] = unordered[key];
      });

      this.searchParams = new URLSearchParams();

      for(var key in ordered) {
        this.searchParams.set(key, ordered[key]);
      }

      return this.url + endpoint + this.searchParams.toString();
    }  

    else{
      var url = this.url + endpoint;
      this.params['oauth_consumer_key'] = this.consumerKey;
      this.params['oauth_nonce'] = this.setOauthNonce(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
      this.params['oauth_timestamp'] = new Date().getTime()/1000;

      var unordered = {};
      for(var key in this.params) {
        unordered[key] = this.params[key];
      }

      if(filter){
        for(var key in filter) {
          if(key == 'category'){
            unordered["filter[" + key + "]"] = filter[key];
          }else
          unordered[key] = filter[key];
        }
      }
      
      var ordered = {};
      Object.keys(unordered).sort().forEach(function(key) {
        ordered[key] = unordered[key];
      });

      this.searchParams = new URLSearchParams();

      for(var key in ordered) {
        this.searchParams.set(key, ordered[key]);
      }

      this.encodedSignature = this.oauth.generate(method, url, this.searchParams.toString(), this.consumerSecret);
      return this.url + endpoint + this.searchParams.toString() + '&oauth_signature=' + this.encodedSignature;
    }

  }


}

