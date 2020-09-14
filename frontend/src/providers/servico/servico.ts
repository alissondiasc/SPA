import { UserProvider } from './../user/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiProvider } from '../api/api';

@Injectable()
export class ServicoProvider {

  public anuncios : Array<any>

  constructor(public http: HttpClient, public api : ApiProvider, public user: UserProvider) {
   // this.listaAnuncios3();
  }

  headerComAuthenticacao(){
    let headers = new HttpHeaders({
      'Authorization': this.user.getAutorizationToken()
      //'Content-Type':  'application/json'
    })

    return headers;
  }
  carregarServicos(){
    let requisicao = this.api.getSemCabecalho(`protected/anuncios`).subscribe((data:any)=>{
      this.anuncios = data;
    });
    return requisicao;

  }

  deletar(anuncioId: string){
    let headers = new HttpHeaders().append('Authorization', this.user.getAutorizationToken());
    let requisicao = this.api.post('protected/anuncios/deletar',anuncioId,{headers});
    return requisicao;

  }
  candidatar( servicoId: string){
    let headers = this.headerComAuthenticacao();
    let requisicao = this.api.post(`protected/anuncios/candidatar/${servicoId}`, servicoId, {headers} );
    return requisicao;
  }
  contratarServico( idAnuncio: string, idUsuario ){
    let headers = this.headerComAuthenticacao();
    let requisicao = this.api.post(`protected/anuncios/escolher-candidato/${idAnuncio}?idUsuario=${idUsuario}`, idUsuario, {headers} );
    return requisicao;
  }
  finalizarServico(idAnuncio){
    let headers = this.headerComAuthenticacao();
    let requisicao = this.api.post(`protected/anuncios/${idAnuncio}/finalizar`, idAnuncio, {headers});
    return requisicao;
  }
  encerrar(idAnuncio){
    let headers = this.headerComAuthenticacao();
    let requisicao = this.api.post(`protected/anuncios/${idAnuncio}/encerrar`, idAnuncio, {headers});
    return requisicao;
  }
  escolhercandidato(idUsuario,idAanuncio){
    let headers = this.headerComAuthenticacao();
    let requisicao = this.api.post(`protected/anuncios/escolher-candidato/${idAanuncio}?idUsuario=${idUsuario}`, idUsuario, {headers});
    return requisicao;

  }

  cadastrar(servico: any){
    let headers = this.headerComAuthenticacao();
    let requisicao = this.api.post(`protected/anuncios`, servico, {headers});
    return requisicao;
  }

  obterAnuncios(filtro: any){
    let headers = this.headerComAuthenticacao();
    let requisicao = this.api.post(`protected/anuncios/obter-anuncios`, filtro,{headers});
    return requisicao;
  }

  listaAnuncios(page = 0, size=5){
    let requisicao = this.api.getSemCabecalho(`protected/anuncios/servico-paginado?page=${page}&size=${size}`);
    return requisicao;
  }

  listaAnuncios2(){
    let requisicao = this.api.getSemCabecalho(`protected/anuncios`);
    return requisicao;

  }
  listaAnuncios3(){
    let requisicao = this.api.getSemCabecalho(`protected/anuncios`).subscribe((data:any)=>{
      this.anuncios =  data
    })

    return requisicao;

  }

  getCategorias(){
    let headers = this.headerComAuthenticacao();
    let requisicao = this.api.get('categorias', {headers});
    return requisicao;

  }

  getMeusServicos(){
    let headers = this.headerComAuthenticacao();
    let requisicao = this.api.get('protected/anuncios/meus-anuncios', {headers});
    return requisicao;
  }

  getCandidatos(id: string){
    let headers = this.headerComAuthenticacao();
    let requisicao = this.api.get('protected/anuncios/candidatos/' +id, {headers});
    return requisicao;
  }
  getAnuncioId(id){
    let headers = this.headerComAuthenticacao();
    let requisicao = this.api.get(`protected/anuncios/${id}`, {headers});
    return requisicao;
  }



}
