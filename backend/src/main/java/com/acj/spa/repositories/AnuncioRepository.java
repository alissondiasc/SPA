package com.acj.spa.repositories;

import java.util.List;

import com.acj.spa.enums.StatusAnuncio;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import com.acj.spa.entities.Anuncio;
import com.acj.spa.entities.Usuario;

@Repository
public interface AnuncioRepository extends MongoRepository<Anuncio, String>, QuerydslPredicateExecutor<Anuncio> {
	
	List<Anuncio> findByOrderByDataHoraDesc();

	Page<Anuncio> findByTituloLikeIgnoreCaseOrderByDataHoraDesc(String titulo, Pageable pageable);

	List<Anuncio> findByUsuarioOrderByDataHoraDescAndDeletedFalse(Usuario usuario);

    Page<Anuncio> findByStatusOrderByDataHoraDesc(StatusAnuncio novo, Pageable pageRequest);
}
