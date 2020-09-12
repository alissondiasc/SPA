import { HomePage } from './../home/home';
import { ServicoProvider } from './../../providers/servico/servico';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, } from 'ionic-angular';
import {AlertController } from 'ionic-angular';
import { UsuarioCompleto } from '../../entidades/Usuario';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the ServicoCadastroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-servico-cadastro',
  templateUrl: 'servico-cadastro.html',
})
export class ServicoCadastroPage {
    public isLoading: boolean;
    public  arrayCategorias: Array<Categoria>;
    public id;
    public toogle: boolean;
    servico: {id:string, titulo: string, descricao: string, bairro:string, localidade:string, categoria:{id:string, nome:string}} = {
        id:null,
        titulo: null,
        descricao: null,
        categoria:{id: null, nome:null},
        localidade:null,
        bairro:null
      };
    public usuario = new UsuarioCompleto();


  constructor(public alertController: AlertController,public navCtrl: NavController, public navParams: NavParams,public userProvider: UserProvider ,public servicoProvider: ServicoProvider, public toastCtrl: ToastController) {
 
    this.isLoading = false;
    this.getCategorias();
    this.getDadosUsuarios();
   this.id =  this.navParams.get("id");
   if(this.id){
     this.servicoProvider.getAnuncioId(this.id).subscribe((data:any)=>{
       if(this.id != null || this.id == '' || this.id.trim()){
         this.servico.id= data.id;
         this.servico.titulo = data.titulo;
         this.servico.descricao = data.descricao;
         this.servico.categoria =data.categoria;
       }
     })

   }
   }
  
getCategorias(){
  this.servicoProvider.getCategorias().subscribe((data: any)=>{
    this.arrayCategorias = data;
  }, err =>{
    let toastg = this.toastCtrl.create({
    message: 'Falha ao Buscar Anuncios',
    duration: 3000,
    position: 'top'
    });
    toastg.present();
    });
}
getDadosUsuarios(){
  this.userProvider.getDadosUsuario().subscribe((data:any)=>{
    this.usuario = data;
  })
}
verificarEndereco(){
  if(this.toogle){
    if(!this.usuario.endereco || !this.usuario.endereco.localidade && !this.usuario.endereco.bairro){
      const confirm = this.alertController.create({
        title: 'Ops',
        message: 'Você precisa cadastra um endereço',
        buttons: [
          {
            text: 'cancelar',
            handler: () => {
              this.toogle = false;
            }
          },
          {
            text: 'Atualizar',
            handler: () => {
              this.navCtrl.push("CadastroDadosProfissionaisPage", { dados_usuario: this.usuario })
            }
          }
        ]
      });
      confirm.present();
    }else{
      this.servico.localidade = this.usuario.endereco.localidade;
      this.servico.bairro = this.usuario.endereco.bairro;
    }
  }

}

cadastrar(){

  this.isLoading = true;
  if(this.toogle){
    this.servico.localidade = this.usuario.endereco.localidade;
    this.servico.bairro = this.usuario.endereco.bairro;
  }
  this.servicoProvider.cadastrar(this.servico).subscribe((data: any)=>{
    this.isLoading = false;
    let toast = this.toastCtrl.create({
    message: 'Anucnio Criado Com Sucesso',
    duration: 1000,
    position: 'top'
  });
  toast.present();
  this.navCtrl.setRoot(HomePage)
}, err =>{
let toastg = this.toastCtrl.create({
message: 'Falha ao criar Anuncio',
duration: 3000,
position: 'top'
});
toastg.present();
});   
}

}

export class Categoria {
  id:string;
  nome:string
}
