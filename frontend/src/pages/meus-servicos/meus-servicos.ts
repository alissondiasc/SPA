import { CandidatosPage } from './../candidatos/candidatos';
import { ServicoProvider } from './../../providers/servico/servico';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, Events } from 'ionic-angular';
import { UserProvider } from './../../providers/user/user';
import { UsuarioCompleto } from '../../entidades/Usuario';
import { ModalComponetComponent } from '../../components/modal-componet/modal-componet';
import { ServicoCadastroPage } from '../servico-cadastro/servico-cadastro';
import { Loader } from '../../providers/Loader';
import { finalize, take } from 'rxjs/operators';

@IonicPage()
@Component({
  selector: 'page-meus-servicos',
  templateUrl: 'meus-servicos.html',
  providers:[Loader]
})
export class MeusServicosPage {
  public usuario = new UsuarioCompleto;
  public meus_anuncios = new Array<any>();
  public meus_em_andamento = new Array<any>();
  public meus_servicos_finalizado = new Array<any>();
  public typeRequest = "servicoNovo";
  public statusAnuncio: { novo: null, andamento: null, finalizado: null }
  public id;
  public isLoading: boolean;
  private cactoNovo: boolean;
  private cactoEmAndamento: boolean;
  private cactoFinalizado: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public servicoProvider: ServicoProvider,
    public loader: Loader,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController) {

    this.isLoading = false;
    this.getMeusServicos();
  }

  deletar(anuncioId: string) {
    this.isLoading = true;
    this.servicoProvider.deletar(anuncioId).subscribe((data: any) => {
      this.isLoading = false;
      this.getMeusServicos();
      let toastg = this.toastCtrl.create({
        message: 'Anuncio Apagado Com Sucesso',
        duration: 3000,
        position: 'top'
      });
      toastg.present();
    }, error => {
      this.isLoading = false;
      let toastg = this.toastCtrl.create({
        message: 'Falha ao buscar serviços, Tente Novamente',
        duration: 3000,
        position: 'top'
      });
      toastg.present();
    });
  }
  finalizarServico(id) {
    this.isLoading = true;
    this.servicoProvider.finalizarServico(id).subscribe((data: any) => {
      this.isLoading = false;

      this.navCtrl.setRoot(MeusServicosPage);
    })
  }

  avaliarServico(id) {
    let modal = this.modalCtrl.create(ModalComponetComponent, { id: id, usuario: this.usuario }, { cssClass: "modalAvaliacao" });
    modal.onDidDismiss(data => {
      if(data){
        this.getMeusServicos();
      }
    })

    modal.present();
  }
  edit(id) {
    this.navCtrl.push(ServicoCadastroPage, { id: id })
  }

  getMeusServicos() {
    this.loader.show();
    this.meus_anuncios = [];
    this.meus_em_andamento = [];
    this.meus_servicos_finalizado = [];
    this.servicoProvider.getMeusServicos()
      .pipe(
      finalize(() => this.loader.hide()),
      take(1),
    ).subscribe((data: any) => {
      data.forEach(element => {
        if (element.statusAnuncio == "NOVO") {
          this.meus_anuncios.push(element);
        } else if (element.statusAnuncio == "EM_ANDAMENTO") {
          this.meus_em_andamento.push(element);
        } else {
          this.meus_servicos_finalizado.push(element);
        }
      });
      if(this.meus_anuncios.length){
        this.cactoNovo = false;
      }else{
        this.cactoNovo = true;
      }
      if(this.meus_em_andamento.length){
        this.cactoEmAndamento = false;
      }else{
        this.cactoEmAndamento = true;
      }
      if(this.meus_servicos_finalizado.length){
        this.cactoFinalizado = false;
      }else{
        this.cactoFinalizado = true;
      }
    }, error => {
      let toastg = this.toastCtrl.create({
        message: 'Falha ao buscar serviços, Tente Novamente',
        duration: 3000,
        position: 'top'
      });
      toastg.present();

    });
  }

  // carregarUsuario() {
  //   this.userProvider.getDadosUsuario().subscribe((data: any) => {
  //     this.usuario = data;
  //   }, error => {
  //     let toastg = this.toastCtrl.create({
  //       message: 'Não foi possivel carregar Usuario',
  //       duration: 3000,
  //       position: 'top'
  //     });
  //     toastg.present();
  //   });
  // }



  goCandidatos(idAnuncio: string, idUsuario: string) {

    this.navCtrl.push(CandidatosPage, { idAnuncio: idAnuncio, idUsuario: idUsuario });

  }

}
