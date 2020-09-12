import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Country } from '../form/form.model';
import { UserProvider } from './../../providers/user/user';
import { UsuarioCompleto } from '../../entidades/Usuario';
import { ServicoProvider } from './../../providers/servico/servico';
import { Camera, CameraOptions } from '@ionic-native/camera';


/**
 * Generated class for the CadastroDadosProfissionaisPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cadastro-dados-profissionais',
  templateUrl: 'cadastro-dados-profissionais.html',
})
export class CadastroDadosProfissionaisPage {
  dadosProfissionaisForm: FormGroup;
  paises_telefone_grupo: FormGroup;
  response: any;
  paises: Array<Country>;
  generos: Array<string>;
  usuarioCompleto = new UsuarioCompleto();
  listCAtegorias: any;
  validation_messages = {
    'nome': [
      { type: 'required', message: 'Nome é um campo obrigatório.' }
    ],
    'email': [
      { type: 'required', message: 'Email é obrigatório.' },
      { type: 'pattern', message: 'Entre com um email válido.' }
    ],
    'emailSecundario': [
      { type: 'required', message: 'Email é obrigatório.' },
      { type: 'pattern', message: 'Entre com um email válido.' },
    ],
    'resumoProfissional': [
      { type: 'required', message: 'Ops! Conte mais sobre seu trabalho.' }
    ],
    'cep': [
      { type: 'required', message: 'CEP é um campo obrigatorio.' },
      { type: 'minlength', message: 'O CEP deve contem no mínimo 7 caracteres' }
    ],
    'logradouro': [
      { type: 'required', message: 'Logradouro é um campo obrigatorio.' }
    ],
    'bairro': [
      { type: 'required', message: 'Bairro é um campo obrigatorio.' }
    ],
    'cidade': [
      { type: 'required', message: 'Cidade é um campo obrigatorio.' }
    ],
    'categoriaPrincipal': [
      { type: 'required', message: 'Categoria principal é um campo obrigatorio.' }
    ],
    'cpf': [
      { type: 'required', message: 'CPF principal é um campo obrigatorio.' },
      { type: 'minlength', message: 'Seu CPF deverá contem 11 digitos' }
    ],
    'rg': [
      { type: 'required', message: 'RG principal é um campo obrigatorio.' },
      { type: 'minlength', message: 'Seu RG deverá contem 7 digitos' }
    ],
    'escolaridade': [
      { type: 'required', message: 'Escolaridade principal é obrigatorio.' }
    ],



  };
  isLoading: boolean;

  constructor(

    public formBuilder: FormBuilder,
    public user: UserProvider,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public navParams: NavParams,
    public servicoProvider: ServicoProvider,
    private camera: Camera,

  ) {
    this.isLoading = false;
    this.validarConfigurarDadosUsuarios();
    this.getCategorias();


  }

  submeter() {
    this.isLoading = true;
    if(this.usuarioCompleto){
      this.isLoading = true;
      this.user.atualizarUsuario(this.usuarioCompleto).subscribe(data=>{
        this.user.getUsurioEmailNome();
        this.navCtrl.setRoot("PerfilPage")
        this.isLoading = false;
      }),error =>{
        this.isLoading = false;
        let toastg = this.toastCtrl.create({
          message: 'Aconteceu um erro tente novamente ou aguarde a equipe tecnica solucionar.',
          duration: 3000,
          position: 'top'
          });
        this.isLoading = false;
        toastg.present();
      }
    }

  }
  getRemove(){
    this.usuarioCompleto.fotoUsuario = null;
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

  getEndereco(cep) {
    if (this.usuarioCompleto.endereco.cep) {
          this.user.buscaCep(this.usuarioCompleto.endereco.cep).subscribe(data => {
          this.usuarioCompleto.endereco.bairro = data.bairro;
          this.usuarioCompleto.endereco.ibge = data.ibge;
          this.usuarioCompleto.endereco.localidade = data.localidade;
          this.usuarioCompleto.endereco.logradouro = data.logradouro;
          this.usuarioCompleto.endereco.rua = data.rua;
          this.usuarioCompleto.endereco.uf = data.uf;
      }),error=>{
        let toastg = this.toastCtrl.create({
          message: 'Este CEP não existe em nossa base de dados.',
          duration: 3000,
          position: 'top'
          });
        toastg.present();

      }
    }

  }
  onModelChange(event){

  }

  ionViewWillLoad() {

    this.dadosProfissionaisForm = this.formBuilder.group({
      nomeCompleto: new FormControl(this.usuarioCompleto.nome, Validators.required),
      sexo: new FormControl(this.usuarioCompleto.sexo),
      escolaridade: new FormControl(this.usuarioCompleto.escolaridade),
      telefone: new FormControl('', Validators.required),
      celular: new FormControl('', Validators.required),
      email: new FormControl(this.usuarioCompleto.email),
      // emailSecundaio: new FormControl('', Validators.compose([
      //   Validators.pattern('^[a-zA-Z0-9_.+-]+[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      // ])),
      cpf: new FormControl(this.usuarioCompleto.cpf, Validators.compose([
        Validators.required,
        Validators.minLength(11)
      ])),
      rg: new FormControl(this.usuarioCompleto.rg, Validators.required),
      orgaoexpedidor: new FormControl(this.usuarioCompleto.orgaoExpedidor),
      cep: new FormControl(this.usuarioCompleto.endereco.cep),
      logradouro: new FormControl(this.usuarioCompleto.endereco.logradouro, Validators.required),
      bairro: new FormControl(this.usuarioCompleto.endereco.bairro, Validators.required),
      complemento: new FormControl(this.usuarioCompleto.endereco.rua),
      cidade: new FormControl(this.usuarioCompleto.endereco.localidade, Validators.required),
      categoriaPrincipal: new FormControl(this.usuarioCompleto.dadosProfissionais.profissaoPrincipal.id, Validators.required),
      resumoProfissional: new FormControl(this.usuarioCompleto.dadosProfissionais.resumo, Validators.required),
      fotoUsuario: new FormControl(this.usuarioCompleto.fotoUsuario)

    });
  }
  getCategorias() {
    this.servicoProvider.getCategorias().subscribe((data) => {
      this.listCAtegorias = data;
    }, error => {
      let toastg = this.toastCtrl.create({
        message: 'Erro ao busca categorias',
        duration: 3000,
        position: 'top'
      });
      toastg.present();
    });
  }

  validarConfigurarDadosUsuarios() {
    this.response = this.navParams.get('dados_usuario');
    this.usuarioCompleto.senha = this.response.senha;
    if (this.response != null && this.response.dadosProfissionais != null) {
      this.response.dadosProfissionais.resumo ? this.usuarioCompleto.dadosProfissionais.resumo = this.response.dadosProfissionais.resumo : this.usuarioCompleto.dadosProfissionais.resumo;
      this.response.dadosProfissionais.qtdServicos ? this.usuarioCompleto.dadosProfissionais.qtdServicos = this.response.dadosProfissionais.qtdServicos : this.usuarioCompleto.dadosProfissionais.qtdServicos;
    }
    if (this.response != null && this.response.dadosProfissionais != null && this.response.dadosProfissionais.profissaoPrincipal != null) {
      this.response.dadosProfissionais.profissaoPrincipal.id ? this.usuarioCompleto.dadosProfissionais.profissaoPrincipal.id = this.response.dadosProfissionais.profissaoPrincipal.id : this.usuarioCompleto.dadosProfissionais.profissaoPrincipal.id;
      this.response.dadosProfissionais.profissaoPrincipal.nome ? this.usuarioCompleto.dadosProfissionais.profissaoPrincipal.nome = this.response.dadosProfissionais.profissaoPrincipal.nome :this.usuarioCompleto.dadosProfissionais.profissaoPrincipal.nome ;
    }
    if (this.response != null && this.response.dadosProfissionais != null && this.response.dadosProfissionais.outrasProfissoes != null) {
      this.usuarioCompleto.dadosProfissionais.outrasProfissoes = this.response.dadosProfissionais.outrasProfissoes;
    }
    if (this.response != null && this.response.endereco != null) {
      this.response.endereco.bairro ? this.usuarioCompleto.endereco.bairro = this.response.endereco.bairro : this.usuarioCompleto.endereco.bairro;
      this.response.endereco.cep ? this.usuarioCompleto.endereco.cep = this.response.endereco.cep : this.usuarioCompleto.endereco.cep;
      this.response.endereco.localidade ? this.usuarioCompleto.endereco.localidade = this.response.endereco.localidade : this.usuarioCompleto.endereco.localidade;
      this.response.endereco.logradouro ? this.usuarioCompleto.endereco.logradouro = this.response.endereco.logradouro : this.usuarioCompleto.endereco.logradouro;
      this.response.endereco.rua ? this.usuarioCompleto.endereco.rua = this.response.endereco.rua : this.usuarioCompleto.endereco.rua;
      this.response.endereco.uf ? this.usuarioCompleto.endereco.uf = this.response.endereco.uf : this.usuarioCompleto.endereco.uf;
    }
      this.response.id? this.usuarioCompleto.id= this.response.id : this.usuarioCompleto.id;
      this.response.nome ? this.usuarioCompleto.nome = this.response.nome : this.usuarioCompleto.nome;
      this.response.email ? this.usuarioCompleto.email = this.response.email : this.usuarioCompleto.email;
      this.response.escolaridade ? this.usuarioCompleto.escolaridade = this.response.escolaridade : this.usuarioCompleto.escolaridade;
      this.response.rg ? this.usuarioCompleto.rg = this.response.rg : this.usuarioCompleto.rg;
      this.response.orgaoExpedidor ? this.usuarioCompleto.orgaoExpedidor = this.response.orgaoExpedidor : this.usuarioCompleto.orgaoExpedidor;
      this.response.sexo ? this.usuarioCompleto.sexo = this.response.sexo : this.usuarioCompleto.sexo;
      this.response.cpf ? this.usuarioCompleto.cpf = this.response.cpf : this.usuarioCompleto.cpf;
      this.response.telefone?this.usuarioCompleto.telefone = this.response.telefone:this.usuarioCompleto.telefone;
      this.response.celular?this.usuarioCompleto.celular = this.response.celular:this.usuarioCompleto.celular;
      this.response.fotoUsuario?this.usuarioCompleto.fotoUsuario = this.response.fotoUsuario:this.usuarioCompleto.fotoUsuario;

  }

  recebeArquivo(event) {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = e =>  this.usuarioCompleto.fotoUsuario = reader.result;

        reader.readAsDataURL(file);
      }
    }


  }
}
