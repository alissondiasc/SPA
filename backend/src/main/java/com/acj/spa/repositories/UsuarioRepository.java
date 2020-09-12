package com.acj.spa.repositories;

import com.acj.spa.entities.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends MongoRepository<Usuario, String> {
	Usuario findByEmail(String email);
	Usuario findByCpf(String cpf);
}
