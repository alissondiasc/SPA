import { Storage } from '@ionic/storage';
import { ApiProvider } from './../api/api';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Avaliacaos } from '../../entidades/avaliacaos';
import { UsuarioCompleto } from '../../entidades/Usuario';


/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {
  public usuario = new UsuarioCompleto()
  _user: string = null;
  _email:string;
  _nome:string;

  public avaliacao = new Avaliacaos();

  constructor(public api: ApiProvider,public  http: HttpClient, public storage : Storage) {
    this.getDadosUsuario();

  }


  headerComAuthenticacao(){
    let headers = new HttpHeaders({
      'Authorization': this.getAutorizationToken(),
      'Content-Type':  'application/json'
    })
   
    return headers;
  }

  getUsurioEmailNome(){
    let headers = this.headerComAuthenticacao();
    let requisicao = this.api.get('usuarios/protected',{headers}).subscribe((data:any)=>{
      this.usuario = data;
    })
    return requisicao;

    
  }
   postData(formData: FormData) {
    let headers = this.headerComAuthenticacao();
    let requisicao = this.api.post('upload' , formData,{headers})
    // this.http.post<boolean>("http://192.168.178.84:8080/upload", formData)
    //   .pipe(
    
    //     finalize(() => this.loading.dismiss())
    //   )
    //   .subscribe(ok => this.showToast(ok));
    return requisicao
  }

  getDadosUsuario(){
    let headers = this.headerComAuthenticacao();
    let requisicao = this.api.get('usuarios/protected',{headers});
    return requisicao;
  }
  avaliarServico(avaliacao: Avaliacaos){
    this.avaliacao = avaliacao;
    let headers = this.headerComAuthenticacao();
    let requisicao = this.api.post(`usuarios/${this.avaliacao.anuncio.profissional.id}/avaliar`,avaliacao, {headers});
    return requisicao;
  }

  buscarPorId(email){
    let headers = this.headerComAuthenticacao();
    let requisicao = this.api.get(`usuarios/${email}/`, {headers});
    return requisicao;
  }


  cadastrar(credenciais: any){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    let requisicao = this.api.post('usuarios' , credenciais,{headers});
    return requisicao;
  }
  
  cadastrarDadosProfissionais(credenciais: any){
    let headers = new HttpHeaders().append('Authorization', this.getAutorizationToken());
    let requisicao = this.api.post('usuarios/dados-profissionais' , credenciais,{headers});
    return requisicao;
  }
  atualizarUsuario(credenciais: any){
    let headers = new HttpHeaders().append('Authorization', this.getAutorizationToken());
    let requisicao = this.api.post('usuarios/atualizar' , credenciais,{headers});
  
    return requisicao;
  }
  atualizarInicias(credenciais: any){
    let headers = new HttpHeaders().append('Authorization', this.getAutorizationToken());
    let requisicao = this.api.post('usuarios/atualizarInicias' , credenciais,{headers});
    return requisicao;
  }
  

  cadastrarEndereco(credenciais: any){
    let headers = new HttpHeaders().append('Authorization', this.getAutorizationToken());
    let requisicao = this.api.post('endereco' , credenciais,{headers});
    return requisicao;
  }
  resetSEnha(credenciais: any){
    let headers = new HttpHeaders().append('Authorization', this.getAutorizationToken());
    let requisicao = this.api.post('usuarios/resetPass' , credenciais,{headers});
    return requisicao;
  }
  esqueceuSEnha(credenciais: any){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    let requisicao = this.api.post('usuarios/esqueceuSenha' , credenciais,{headers});
    return requisicao;
  }
  salvarNewSenha(credenciais: any){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    let requisicao = this.api.post('usuarios/salvarSenha' , credenciais,{headers});
    return requisicao;
  }

  buscaCep(cep:String):any{
    let requisicao = this.http.get(`http://viacep.com.br/ws/` + cep + `/json/`);
    return requisicao;
  }

  callService(cep:String):any {
    let requisicao = this.http.get(`http://viacep.com.br/ws/` + cep + `/json/`);
    return requisicao;
  }

  login(credenciais: any){
  
    let request = this.api.post('login',credenciais, {responseType: 'text'});

    request.subscribe((data: any)=>{
    });
    return request;
  }

    /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
    this.storage.clear();
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    this._user = resp;
  }

  getAutorizationToken(){
    return this._user
  }
}


