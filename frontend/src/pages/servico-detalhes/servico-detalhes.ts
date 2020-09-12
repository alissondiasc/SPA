import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServicoProvider } from '../../providers/servico/servico';
import { Anuncio } from '../../entidades/anuncio';

/**
 * Generated class for the ServicoDetalhesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-servico-detalhes',
  templateUrl: 'servico-detalhes.html',
})
export class ServicoDetalhesPage {
  public anuncio = new Anuncio();
  public candidatos: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public servicoProvider: ServicoProvider,
  ) {
    this.initDados();
  }

  ionViewDidLoad() {

  }
  initDados() {
    this.anuncio = this.navParams.get('anuncio')
      if(this.anuncio.candidatos){
        this.candidatos = this.anuncio.candidatos.length;
      }else{
        
      }    
  }

}
