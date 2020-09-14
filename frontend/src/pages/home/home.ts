import { CadastroPage } from './../cadastro/cadastro';
import { UserProvider } from './../../providers/user/user';
import { ServicoCadastroPage } from './../servico-cadastro/servico-cadastro';
import { Component } from '@angular/core';
import { NavController, ToastController, AlertController } from 'ionic-angular';
import { ServicoProvider } from '../../providers/servico/servico';
import { UsuarioCompleto } from '../../entidades/Usuario';
import { ServicoDetalhesPage } from '../servico-detalhes/servico-detalhes';
import { Anuncio } from '../../entidades/anuncio';
import { Loader } from '../../providers/Loader';
import { finalize } from 'rxjs/operators';
import { WebsocketProvider } from '../../webSocket/websocket';
import { ApiProvider } from '../../providers/api/api';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers:[Loader]
})
export class HomePage {
  public buscaTitulo = false;
  public lista_anuncios = new Array<Anuncio>();
  public dados_usuario: any;
  public page = 0;
  public size;
  public usuarioCompleto = new UsuarioCompleto();
  private totalElementos: number;
  public filtro: any = {};
  private cacto: boolean;
  stompClient: any;
  private notificacoes: number = 0;

  constructor(
    public navCtrl: NavController,
    public servicoProvider: ServicoProvider,
    public toastCtrl: ToastController,
    public loaderCom: Loader,
    public alertController: AlertController,
    private userProvider: UserProvider,
    private api: ApiProvider,
    private websocketProvider: WebsocketProvider
  ) {
    this.filtro.page = 0;
    this.carregarDadosUsuario();
    this.obterAnuncios(false, false);


  };
  _connect() {
    console.log("Initialize WebSocket Connection");
    let ws = new SockJS(`${this.api.url}/notificacao`);
    this.stompClient = Stomp.over(ws);
    const _this = this;
    _this.stompClient.connect({},  (frame) => {
      _this.stompClient.subscribe('/topic/new.notificacao'+this.usuarioCompleto.id, (listNotificacao:any) => {
        const responde =  JSON.parse(listNotificacao.body);
        if(responde!! && responde > this.notificacoes){
          this.notificacoes = responde;
        }
      });
      //_this.stompClient.reconnect_delay = 2000;
    }, this.errorCallBack);
  }
  errorCallBack(error) {
    console.log("errorCallBack -> " + error)
    setTimeout(() => {
      this._connect();
    }, 5000);
  }


  pageDetalhes(anuncio) {
    this.navCtrl.push(ServicoDetalhesPage, { anuncio: anuncio })
  }

  carregarDadosUsuario() {
    this.userProvider.getDadosUsuario().subscribe(
      user => {
        const response = (user as any);
        this.usuarioCompleto = response;
        this.dados_usuario = response;
        this._connect()
      });
  }

  candidatarSE(idServico: string) {
    if (!this.usuarioCompleto.dadosProfissionais) {
      const confirm = this.alertController.create({
        title: 'Opa',
        message: 'Para se candidatar é preciso estar com os dados atualizados!',
        buttons: [
          {
            text: 'agora não',
            handler: () => {
              this.navCtrl.setRoot("HomePage")
            }
          },
          {
            text: 'Atualizar',
            handler: () => {
              this.navCtrl.push("CadastroDadosProfissionaisPage", { dados_usuario: this.dados_usuario })
            }
          }
        ]
      });
      confirm.present();
    } else {
      this.servicoProvider.candidatar(idServico).subscribe((data: any) => {
        let toastg = this.toastCtrl.create({
          message: 'Parabens, candidatura efetuada com sucesso',
          duration: 1500,
          position: 'top'
        });
        toastg.present();
      }, err => {
        let toastg = this.toastCtrl.create({
          message: 'Você já se candidatou a este serviço!',
          duration: 3000,
          position: 'top'
        });
        toastg.present();
      });

    }

  }

  goCadastrarServico() {
    if (this.userProvider._user != null) {
      this.navCtrl.push(ServicoCadastroPage);
    } else {
      this.navCtrl.push(CadastroPage);
    }
  }

  obterServicos(infiniteScroll) {
    this.page = !infiniteScroll? 0 : this.page;
    this.servicoProvider.listaAnuncios(this.page, this.size).subscribe(
      (data: any) => {
        if (!infiniteScroll) {
          this.lista_anuncios = [];
        }
        this.totalElementos = data.totalElements;
        this.lista_anuncios = (data.content && data.content.length)? this.lista_anuncios.concat(data.content) : this.lista_anuncios;
        this.page = this.page + 1;
        console.log(this.totalElementos)
        if (infiniteScroll) {
          infiniteScroll.complete();
        }
      }, error => {
        console.log(error);
      }
    )
  }

  doRefresh(refresher) {
    this.servicoProvider.listaAnuncios().subscribe(
      data => {
        const response = (data as any)
        this.lista_anuncios = response.content
        refresher.complete();
      }, error => {
        console.log(error);
      });
  }

  obterAnuncios(infiniteScroll?, cancelarBusca?, refresh?) {

    if(!!cancelarBusca) {
      this.buscaTitulo =  false;
      this.filtro.descricao = null;
    }
    if(!infiniteScroll){
     if(!cancelarBusca){
       this.loaderCom.show();
     }
      this.filtro.page = 0;
    }else {
      this.filtro.page = this.filtro.page+1;
    }
      if (this.filtro.descricao && this.filtro.descricao === '') {
        this.filtro.descricao = null;
      }

        this.servicoProvider.obterAnuncios(this.filtro).pipe(finalize(()=>this.loaderCom.hide())).subscribe(
          (data: any) => {
            if (!infiniteScroll &&  (data.content && data.content.length)) {
              this.lista_anuncios = [];
              this.lista_anuncios = data.content;
            }
            if(infiniteScroll &&  (data.content && data.content.length)){
              this.lista_anuncios = (data.content && data.content.length)? this.lista_anuncios.concat(data.content) : !!infiniteScroll? [] : this.lista_anuncios;
            }
            this.totalElementos = data.totalElements;
            this.page = this.page + 1;
            this.cacto = !data.content.length ? true : false;
            if (infiniteScroll) {
              infiniteScroll.complete();
            }
            if (refresh) {
              refresh.complete();
            }
          })
  };

};
