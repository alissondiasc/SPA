import { UsuarioCompleto } from "./Usuario";
import { Categoria } from "./categoria";

export class Anuncio{ 
  
    id: string;
    titulo: string
    descricao: string;
    dataHora: Date;
    statusAnuncio:string;
    categoria: Categoria;
    usuario: UsuarioCompleto;
    candidatos: Array<UsuarioCompleto>;
    profissional: UsuarioCompleto;
    localidade: string;
    bairro:string;  
    
  
  constructor(){
      this.usuario = new UsuarioCompleto();
      this.categoria = new Categoria();
      this.candidatos = new Array<UsuarioCompleto>();
      this.profissional = new UsuarioCompleto();
      
  }

}