import { ServicoProvider } from './../../providers/servico/servico';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { MeusServicosPage } from '../meus-servicos/meus-servicos';
import { PerfilPage } from '../perfil/perfil';
import { Anuncio } from '../../entidades/anuncio';
import { Loader } from '../../providers/Loader';
import { finalize } from 'rxjs/operators';

/**
 * Generated class for the CandidatosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-candidatos',
  templateUrl: 'candidatos.html',
  providers:[Loader]
})
export class CandidatosPage {
  public idAnuncio: string;
  public candidatos:any[] = [];
  public servio = new Anuncio();
  public isLoading: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loader: Loader,
    public servicoProvider: ServicoProvider,
    public toastCtrl: ToastController) {
    this.isLoading = false;
    this.idAnuncio = navParams.get('idAnuncio');
    this.getCandidatos(this.idAnuncio);
    this.getAnuncioId(this.idAnuncio);
  }

  getCandidatos(id: string) {
    this.loader.show();
    this.idAnuncio = id;
    this.servicoProvider.getCandidatos(id).pipe(finalize(()=> this.loader.hide())).subscribe((data: any) => {
      this.candidatos = data;
    }, error => {
      let toastg = this.toastCtrl.create({
        message: 'Falha ao buscar candidatos, Tente Novamente',
        duration: 3000,
        position: 'top'
      });
      toastg.present();
    });
  }
  getAnuncioId(id) {
    this.servicoProvider.getAnuncioId(this.idAnuncio).subscribe((data: any) => {
      this.servio = data;
    })
  }
  goPerfil(email) {
    this.navCtrl.push(PerfilPage, { email: email });
  }

  contratar(idUsuario) {
    this.isLoading = true;
    this.servicoProvider.escolhercandidato(idUsuario, this.idAnuncio).subscribe(data => {
      this.isLoading = false;
      let toast = this.toastCtrl.create({
        message: 'Sua contratação foi realizada com sucesso.',
        duration: 1000,
        position: 'top'
      });
      toast.present();
      this.navCtrl.setRoot(MeusServicosPage);
    })


  }

}
