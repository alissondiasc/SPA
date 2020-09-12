import { UserProvider } from './../../providers/user/user';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { UsuarioCompleto } from '../../entidades/Usuario';
import { Camera, CameraOptions } from '@ionic-native/camera';


@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {
  public usuarioCompleto = new UsuarioCompleto();
  public candidato: any
  public usuario: any
  public rate = 5;
  public media = 0;
  public emailCandidato;
  public typeRequest = "perfil";
  isLoading: boolean;
  preview: string | ArrayBuffer;
  public myPhoto:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    public userProvider: UserProvider,
    public toastCtrl: ToastController) {
    this.isLoading = false;
    this.emailCandidato = navParams.get('email');
    if (this.emailCandidato) {
      this.userProvider.buscarPorId(this.emailCandidato).subscribe((data: any) => {
        this.usuarioCompleto = data;
        this.usuarioCompleto.avaliacaos.forEach(ele => {
          this.media += ele.nota
        })
        this.media = this.media / this.usuarioCompleto.avaliacaos.length
      })
    } else {

      this.userProvider.getDadosUsuario().subscribe((dato: any) => {
        this.usuarioCompleto = dato;
        this.usuarioCompleto.avaliacaos.forEach(ele => {
          this.media += ele.nota
        })
        this.media = this.media / this.usuarioCompleto.avaliacaos.length
      });

    }

  }
  getImagem(){
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum:false
    }
    this.camera.getPicture(options).then((imageData)=>{
      this.usuarioCompleto.fotoUsuario = 'data:image/jpeg;base64,' + imageData;
    },error=>{
    })
  }
  teste(){
   // console.log("funfa")
  }

  onModelChange(event) {
  }

  goAtualizarDados() {
    this.isLoading = true;

    this.navCtrl.push("CadastroDadosProfissionaisPage", { dados_usuario: this.usuarioCompleto });
    this.isLoading = false;
  }

  fazerMedia(qtdAvaliacao, somaAvaliacao) {
    let media
    media = somaAvaliacao / qtdAvaliacao;
    return media;
  }
  preparaMedia() {
    let teste
    this.usuarioCompleto.avaliacaos.map(el => {
      teste = el.nota
    })


  }

}


