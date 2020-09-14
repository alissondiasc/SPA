import { HomePage } from './../pages/home/home';
import { UserProvider } from './../providers/user/user';
import { Component, ViewChild, HostListener } from '@angular/core';
import { Platform, App, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { ServicoRealizadoPage } from '../pages/servico-realizado/servico-realizado';
import { UsuarioCompleto } from '../entidades/Usuario';
import { Anuncio } from '../entidades/anuncio';
import { ServicoProvider } from '../providers/servico/servico';
import { elementEnd } from '@angular/core/src/render3/instructions';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { SobrePage } from '../pages/sobre/sobre';
import { WebsocketProvider } from '../webSocket/websocket';


@Component({
  templateUrl: 'app.html',
  providers:[WebsocketProvider]
})
export class MyApp {

  public usuarioCompleto = new UsuarioCompleto();
  public servico= new Array<Anuncio>();
  rootPage: any = LoginPage;
  usuarioEmail:string = null;
  usuarioNome:string = null;
  public mockMenu = true
  public isCandidato: boolean= false;

  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    { title: 'Meus Serviços', component: 'MeusServicosPage', active: true, icon: 'albums' },
    { title: 'Perfil', component: 'PerfilPage', active: true, icon: 'person' },
  ]


constructor(public app :App, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private userProvider: UserProvider, private servivoProvider:ServicoProvider) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });

  }


  @HostListener('click', ['$event'],)
  runThisMethod() {
    this.usuarioCompleto = this.userProvider.usuario;
    this.servico = this.servivoProvider.anuncios;
    if(this.servico != null){
      this.servico.forEach(element=>{
        if(element.candidatos){
          element.candidatos.forEach(element=>{
            if(element.id == this.usuarioCompleto.id){
              this.isCandidato = true;
            }
          })
        }
      })

    }

  }

  homepage(){

    this.nav.setRoot(HomePage);
  }
  goServicosAndamento(){

    this.nav.setRoot(ServicoRealizadoPage, {idUsuario:this.usuarioCompleto.id});
  }
  goConfig(){
    this.nav.setRoot(ResetPasswordPage);
  }
  openPage(page) {

    this.nav.setRoot(page.component);
  }
  goSobre(){
    this.nav.setRoot(SobrePage);
  }


logout(){
  this.userProvider.logout();
  this.nav.push(LoginPage);
}

}
