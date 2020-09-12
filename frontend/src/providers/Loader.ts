import { Injectable } from '@angular/core';
import { LoadingController, Platform, Loading } from 'ionic-angular';
@Injectable()
export class Loader {

  loader: Loading;
  loaderActived:boolean;

  constructor(
    public platform: Platform,
    public loading: LoadingController
  ) {}

  show(message?: string) {
    if(!this.loaderActived){
      this.loader = this.loading.create({
        content: message
      });
      this.loaderActived = true;
      this.loader.present();
    }
  }

  hide() {
    if(this.loaderActived){
      this.loader.dismiss();
      this.loaderActived = false;
    }
  }
}
