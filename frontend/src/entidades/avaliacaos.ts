import { UsuarioCompleto } from "./Usuario";
import { Anuncio } from "./anuncio";

export class Avaliacaos{ 
  
    nota: number;
    comentario: string
    usuario: UsuarioCompleto;
    anuncio: Anuncio;
    
  
  constructor(){
      this.usuario = new UsuarioCompleto();
      this.anuncio = new Anuncio();
  }

}