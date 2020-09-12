import { Endereco } from "./endereco";
import { DadosProfissionais } from "./dadosprofissionais";
import { Avaliacaos } from "./avaliacaos";

export class UsuarioCompleto{ 
    public id:string;
    public nome: string;
    public cpf: string;
    public rg: string;
    public orgaoExpedidor: string;
    public sexo: string;
    public escolaridade: string;
    public avaliacaos: Array<Avaliacaos>;
    public nacionalidade: string;
    public email: string;
    public senha: string;
    public admin: boolean;
    public dadosProfissionais:DadosProfissionais;
    public endereco: Endereco;
    public telefone: string;
    public celular: string;
    public fotoUsuario: string;
  
    constructor(){
      this.endereco = new Endereco();
      this.dadosProfissionais = new DadosProfissionais();
      this.avaliacaos = new Array<Avaliacaos>();
    }
  
  }