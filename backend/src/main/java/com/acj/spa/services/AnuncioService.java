package com.acj.spa.services;

import com.acj.spa.dto.AnuncioDTO;
import com.acj.spa.dto.FiltroAnunciosDTO;
import com.acj.spa.dto.parser.AnuncioParser;
import com.acj.spa.entities.Anuncio;
import com.acj.spa.entities.QAnuncio;
import com.acj.spa.entities.Usuario;
import com.acj.spa.enums.StatusAnuncio;
import com.acj.spa.repositories.AnuncioRepository;
import com.acj.spa.services.exception.ObjectNotFoundException;
import com.acj.spa.util.CoreUtils;
import com.querydsl.core.BooleanBuilder;
import org.codehaus.plexus.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class AnuncioService {

    @Autowired
    private AnuncioRepository anuncioRepository;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private CategoriaService categoriaService;

    @Autowired
    private DadosProfissionaisService dadosProfissionaisService;

    public AnuncioDTO cadastrar(AnuncioDTO anuncioDTO, String email) {
        anuncioDTO.setCategoria(categoriaService.buscarPorId(anuncioDTO.getCategoria().getId()));
        anuncioDTO.setAnunciante(usuarioService.buscarPorEmail(email));
        
        LocalDateTime agora = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
        agora.format(formatter);
        anuncioDTO.setDataHora(agora);
        
        Anuncio anuncio = AnuncioParser.toEntity(anuncioDTO);
        anuncio.setStatus(StatusAnuncio.NOVO);
        return AnuncioParser.toDTO(anuncioRepository.save(anuncio));
    }

    public List<AnuncioDTO> buscarTodos() {
        List<Anuncio> anuncios = anuncioRepository.findByOrderByDataHoraDesc();
        return anuncios.stream().map(AnuncioParser::toDTO).collect(Collectors.toList());
    }
    
    public Page<Anuncio> buscarTodosPaginadoOrdenadoHora(Integer page, Integer size) {
        Pageable pages = new PageRequest(page, size);
        return anuncioRepository.findByStatusOrderByDataHoraDesc(StatusAnuncio.NOVO, pages);
    }
    
    public List<AnuncioDTO> listarMeusAnuncios(String idUsuario) {
    	Usuario usuario = usuarioService.obterUsuarioLogado();
        List<Anuncio> anuncios = anuncioRepository.findByUsuarioAndIsDeletedFalseOrderByDataHoraDesc(usuario);
        return anuncios.stream().map(AnuncioParser::toDTO).collect(Collectors.toList());
    }
    
    public Page<Anuncio> filtrarAnuncios(FiltroAnunciosDTO filtroAnunciosDTO) {
        final QAnuncio qAnuncio = new QAnuncio("anuncio");
        Pageable pageable = PageRequest.of(filtroAnunciosDTO.getPage(), filtroAnunciosDTO.getCont(), filtroAnunciosDTO.getOrderBy(), "dataHora");

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qAnuncio.isDeleted.eq(false));

        if (!StringUtils.isEmpty(filtroAnunciosDTO.getDescricao())) {
            builder
                    .and(qAnuncio.titulo.matches(CoreUtils.retornarPrimeiroCampoRegex(filtroAnunciosDTO.getDescricao())).and(qAnuncio.titulo.matches(CoreUtils.retornarRegexParametroPesquisa(filtroAnunciosDTO.getDescricao()))))
                    .or(qAnuncio.descricao.matches(CoreUtils.retornarPrimeiroCampoRegex(filtroAnunciosDTO.getDescricao())).and(qAnuncio.descricao.matches(CoreUtils.retornarRegexParametroPesquisa(filtroAnunciosDTO.getDescricao()))));

        }
        if (Objects.nonNull(filtroAnunciosDTO.getStatusAnuncio())) {
            builder.and(qAnuncio.status.eq(filtroAnunciosDTO.getStatusAnuncio())).or(qAnuncio.status.eq(StatusAnuncio.FINALIZADO));
        }
        if (Objects.nonNull(filtroAnunciosDTO.getIdProfissional())) {
            builder.and(qAnuncio.profissional.id.eq(filtroAnunciosDTO.getIdProfissional()));
        }
        if (Objects.nonNull(filtroAnunciosDTO.getCategoriaDTO())) {
            builder.and(qAnuncio.categoria.id.eq(filtroAnunciosDTO.getCategoriaDTO().getId()));
        }
        if (Objects.nonNull(filtroAnunciosDTO.getBairro())) {
            builder.and(qAnuncio.bairro.eq(filtroAnunciosDTO.getBairro()));
        }
        if (Objects.nonNull(filtroAnunciosDTO.getCategoriaDTO())) {
            builder.and(qAnuncio.localidade.eq(filtroAnunciosDTO.getCidade()));
        }

        return anuncioRepository.findAll(builder, pageable);
    }

    public Anuncio buscarPorId(String id) {
        return anuncioRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("Anúncio não encontrado"));
    }
    
    
    public void candidatar(String anuncioId) {
       Anuncio anuncio = buscarPorId(anuncioId);
       Usuario usuario = usuarioService.obterUsuarioLogado();
       		
       if (this.candidaturaValida(usuario, anuncio)) {
    	   List<Usuario> candidatos = new ArrayList<Usuario>();
    	   if (anuncio.getCandidatos() != null) {
    		   candidatos = anuncio.getCandidatos();
    	   }
       	   candidatos.add(usuario);
           anuncio.setCandidatos(candidatos);
           anuncioRepository.save(anuncio);
       }else{
    	   System.out.println("Candidatura Invalida");
    	   throw new DataIntegrityViolationException("Erro usuario ja existe ou é dono do anuncio");
       }	   
    } 
    
    public void deletarMeuAnuncio(String anuncioId, String usuarioId) {
    	Anuncio anuncio = buscarPorId(anuncioId);
    	if (anuncio.getUsuario().getEmail().equals(usuarioId)) {
    		anuncioRepository.delete(anuncio);
		}else{
	    	   System.out.println("Usuario Tentando apagar anuncio pertecente a outro usuario");
	    	   throw new DataIntegrityViolationException("Usuario não é dono do anuncio");
	    }	   
    	
    }
    
    
    public boolean candidaturaValida(Usuario usuario, Anuncio anuncio) {
    	boolean candidaturaValida = false;
    	
    	if (usuario.getId().equals(anuncio.getUsuario().getId())) {
    		candidaturaValida = false;
		}else{
			 List<Usuario> candidatos = new ArrayList<Usuario>();
			 if(anuncio.getCandidatos() != null) {
				 candidatos = anuncio.getCandidatos();
				 if(candidatos.contains(usuario)) {
					 candidaturaValida = false;
				 }else {
					 candidaturaValida = true;
				 }
			 }else {
				 candidaturaValida=true;
			 }
     	}
    	return candidaturaValida;
    }

    public Anuncio escolherCandidato(String idAnuncio, String idUsuario) {
        Anuncio anuncio = buscarPorId(idAnuncio);
        Usuario candidato = usuarioService.buscarPorId(idUsuario);
        Usuario usuario = usuarioService.obterUsuarioLogado();

        if (anuncio.getUsuario().equals(usuario)) {
            anuncio.setProfissional(candidato);
            anuncio.setStatus(StatusAnuncio.EM_ANDAMENTO);
            anuncioRepository.save(anuncio);
        }

        return anuncio;
    }
//    public UsuarioDTO acrescentarServico(UsuarioDTO usuarioDTO){
//        usuarioDTO.getDadosProfissionais().setQtdServicos(usuarioDTO.getDadosProfissionais().getQtdServicos() !=null? usuarioDTO.getDadosProfissionais().getQtdServicos()+1:1);
//        return  usuarioService.acrescentarDados(usuarioDTO);
//
//    }

    public void finalizarServico(String idAnuncio) {
        Anuncio anuncio = buscarPorId(idAnuncio);
        anuncio.setStatus(StatusAnuncio.FINALIZADO);
        anuncioRepository.save(anuncio);
        anuncio.getProfissional().getDadosProfissionais().setQtdServicos(anuncio.getProfissional().getDadosProfissionais().getQtdServicos() != null ? anuncio.getProfissional().getDadosProfissionais().getQtdServicos()+1:1);
        usuarioService.acrescentarDados(anuncio.getProfissional());

    }
    public void encerrarServico(String idAnuncio) {
        Anuncio anuncio = buscarPorId(idAnuncio);
        anuncio.setStatus(StatusAnuncio.ANUNCIOFINALIZADO);
        anuncio.setDeleted(Boolean.TRUE);
        anuncioRepository.save(anuncio);

    }
}
