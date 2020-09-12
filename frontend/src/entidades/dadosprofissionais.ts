export class DadosProfissionais {
    resumo: string;
    qtdServicos: number;
    profissaoPrincipal: Categoria;
    outrasProfissoes: Array<Categoria>
    constructor() {
        this.profissaoPrincipal = new Categoria();
        this.outrasProfissoes = new Array<Categoria>();
    }

}
export class Categoria {
    id: string;
    nome: string;
    constructor() { }
}