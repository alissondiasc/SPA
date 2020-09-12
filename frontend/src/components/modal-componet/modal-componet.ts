import { Component } from '@angular/core';
import {NavParams, ToastController, NavController, ViewController} from 'ionic-angular';
import { UsuarioCompleto } from '../../entidades/Usuario';
import { ServicoProvider } from './../../providers/servico/servico';
import { UserProvider } from './../../providers/user/user';
import { Avaliacaos } from '../../entidades/avaliacaos';
import { Anuncio } from '../../entidades/anuncio';


/**
 * Generated class for the ModalComponetComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'modal-componet',
  templateUrl: 'modal-componet.html'
})
export class ModalComponetComponent {
  usuario: UsuarioCompleto =  new UsuarioCompleto();
  avaliacao : Avaliacaos = new Avaliacaos();
  anuncio : Anuncio = new Anuncio();
  public isLoading: boolean;

  constructor(
       public params: NavParams,
       public usuarioProvider: UserProvider,
       public servicoProvider: ServicoProvider,
       public toastCtrl: ToastController,
       public navCtrl: NavController,
       private viewCtrl: ViewController
    ){
      this.isLoading = false;
    this.anuncio.id =  params.get('id');
    this.initDado();
  }

  initDado(){
   this.usuarioProvider.getDadosUsuario().subscribe((data:any)=>{
     this.avaliacao.usuario = data
   }), error=>{
    let toastg = this.toastCtrl.create({
      message: 'Errro ao busca usuario' +error,
      duration: 3000,
      position: 'top'
    });
    toastg.present();
   }
   this.servicoProvider.getAnuncioId(this.anuncio.id).subscribe((data :any)=>{
     this.avaliacao.anuncio = data

   })
  }
  onModelChange(ev){
    this.avaliacao.nota = ev
  }
  avaliarServico(){
    this.isLoading = true;
    this.servicoProvider.encerrar(this.avaliacao.anuncio.id).subscribe(data=>{

    })
    this.usuarioProvider.avaliarServico(this.avaliacao).subscribe(data=>{
      this.isLoading = false;
      let toastg = this.toastCtrl.create({
        message: 'Avalição realizada com sucsso, obrigado' ,
        duration: 2000,
        position: 'top'
      });
      this.viewCtrl.dismiss( true  )
      toastg.present();
    })

  }
  cancelar(){
    this.viewCtrl.dismiss()
  }




}
