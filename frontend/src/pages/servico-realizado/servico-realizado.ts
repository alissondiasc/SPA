import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { ServicoProvider } from '../../providers/servico/servico';
import { UsuarioCompleto } from '../../entidades/Usuario';
import { Anuncio } from '../../entidades/anuncio';
import { Loader } from '../../providers/Loader';
import { finalize } from 'rxjs/operators';

@IonicPage()
@Component({
  selector: 'page-servico-realizado',
  templateUrl: 'servico-realizado.html',
  providers:[Loader]
})
export class ServicoRealizadoPage {

  public file: any;

  public usuario = new UsuarioCompleto();
  public servicos = new Array<Anuncio>();
  public meusServicosAndamento :any[] = [];
  loading: any
  private cacto: boolean;
  private idUsuario: string;
  private filtro: any = {};
  private totalElementos: any;
  private page: number = 0;


  constructor(
    public loader: Loader,
    public navCtrl: NavController,
    public navParams: NavParams,
    private user: UserProvider,
    private anuncio: ServicoProvider) {
    this.idUsuario = this.navParams.get('idUsuario')
    console.log(this.idUsuario)
    this.filtro.statusAnuncio = "EM_ANDAMENTO"
    this.filtro.idProfissional = this.idUsuario;
    this.obterAnuncios();

  }

  initDados() {
    this.loader.show();
    this.anuncio.listaAnuncios2().pipe(finalize(()=> this.loader.hide())).subscribe((data: any) => {
      this.servicos = data;
      this.servicos.forEach(element => {
        if (element.profissional != null && element.profissional.id == this.usuario.id && element.statusAnuncio !== "ANUNCIOFINALIZADO") {
          this.meusServicosAndamento.push(element)
          if(!this.meusServicosAndamento.length){
            this.cacto = true;
          }else{
            this.cacto = false;
          }
        }
      });
    })
    this.user.getDadosUsuario().subscribe((data: any) => {
      this.usuario = data;

    })
  }
  obterAnuncios(infiniteScroll?, cancelarBusca?) {
    this.filtro.page = !infiniteScroll? 0 : this.filtro.page;
    if (this.filtro.descricao && this.filtro.descricao === '') {
      this.filtro.descricao = null;
    }

    this.anuncio.obterAnuncios(this.filtro).subscribe(
      (data: any) => {
        if (!infiniteScroll) {
          this.meusServicosAndamento = [];
        }
        this.totalElementos = data.totalElements;
        this.meusServicosAndamento = (data.content && data.content.length)? this.meusServicosAndamento.concat(data.content) : !!infiniteScroll? [] : this.meusServicosAndamento;
        this.page = this.page + 1;
        this.cacto = !data.content.length ? true : false;
        console.log(this.meusServicosAndamento[0])
        if (infiniteScroll) {
          infiniteScroll.complete();
        }
      })
  };
  isFinalizado(status: string){
    return status === "FINALIZADO"
  }
  finalizarServico(id) {
    this.loader.show()
    this.anuncio.finalizarServico(id).pipe(finalize(()=> this.loader.hide())).subscribe((data: any) => {
      this.obterAnuncios();
    })
  }

}
