package com.acj.spa.controllers;

import com.acj.spa.dto.AnuncioDTO;
import com.acj.spa.dto.FiltroAnunciosDTO;
import com.acj.spa.dto.parser.AnuncioParser;
import com.acj.spa.entities.Anuncio;
import com.acj.spa.entities.Usuario;
import com.acj.spa.services.AnuncioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping(value = "protected/anuncios" )
public class AnuncioController {

    @Autowired
    private AnuncioService anuncioService;
    
    @PostMapping (value = "/deletar") 
	public void deletarMeuAnuncio(@RequestBody String anuncioId, Authentication authenticatioToken){
		 anuncioService.deletarMeuAnuncio(anuncioId, authenticatioToken.getName());
	}
	
    @PostMapping
    public ResponseEntity<Void> cadastrar(@RequestBody(required = false) AnuncioDTO anuncioDTO, Authentication authenticatioToken) {
        AnuncioDTO novoAnuncio = anuncioService.cadastrar(anuncioDTO, authenticatioToken.getName());

        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(novoAnuncio.getId()).toUri();

        return ResponseEntity.created(uri).build();
    }
    
    @PostMapping(value = "candidatar/{id}")
    public ResponseEntity<Void> candidatar(@PathVariable String id) {
    	anuncioService.candidatar(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping(value = "/meus-anuncios")
    public ResponseEntity<List<AnuncioDTO>> listarMeusAnucios(Authentication authenticatioToken) {
        List<AnuncioDTO> anuncioDTOList = anuncioService.listarMeusAnuncios(authenticatioToken.getName());
        return ResponseEntity.ok(anuncioDTOList);
    }
    @GetMapping(value = "/meus-anuncios/andamento")
    public ResponseEntity<List<AnuncioDTO>> obterAnunciosEmAndamento(Authentication authenticatioToken) {
        List<AnuncioDTO> anuncioDTOList = anuncioService.listarMeusAnuncios(authenticatioToken.getName());
        return ResponseEntity.ok(anuncioDTOList);
    }

    @GetMapping
    public ResponseEntity<List<AnuncioDTO>> buscarTodos() {
        List<AnuncioDTO> anuncioDTOList = anuncioService.buscarTodos();
        return ResponseEntity.ok(anuncioDTOList);
    }
    
    @GetMapping(value = "/servico-paginado")
    public ResponseEntity<Page<Anuncio>> buscarTodosPaginado(@RequestParam Integer page, @RequestParam Integer size) {
        Page<Anuncio> anuncios = anuncioService.buscarTodosPaginadoOrdenadoHora(page, size);
        
        return ResponseEntity.ok(anuncios);
    }
    
    @PostMapping(value = "/obter-anuncios")
    public ResponseEntity<Page<Anuncio>> buscarPorTitulo(@RequestBody FiltroAnunciosDTO filtroAnunciosDTO) {
        Page<Anuncio> anuncioList = anuncioService.filtrarAnuncios(filtroAnunciosDTO);

        return ResponseEntity.ok(anuncioList);
    }

    @GetMapping(value = "{id}")
    public ResponseEntity<AnuncioDTO> buscarPorId(@PathVariable String id) {
        Anuncio anuncio = anuncioService.buscarPorId(id);
        return ResponseEntity.ok(AnuncioParser.toDTO(anuncio));
    }
    
    @GetMapping(value = "/candidatos/{id}")
    public List<Usuario> buscarCandidatosPorId(@PathVariable String id) {
        List<Usuario> candidatos = anuncioService.buscarPorId(id).getCandidatos();
        return candidatos;
    }

    @PostMapping(value = "/escolher-candidato/{idAnuncio}")
    public ResponseEntity<Void> escolherCandidato(@PathVariable String idAnuncio, @RequestParam String idUsuario) {
        anuncioService.escolherCandidato(idAnuncio, idUsuario);
	    return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "{idAnuncio}/finalizar")
    public ResponseEntity<Void> finalizarServico(@PathVariable String idAnuncio) {
        anuncioService.finalizarServico(idAnuncio);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "{idAnuncio}/encerrar")
    public ResponseEntity<Void> encerrar(@PathVariable String idAnuncio) {
        anuncioService.encerrarServico(idAnuncio);
        return ResponseEntity.noContent().build();
    }


}
