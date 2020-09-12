package com.acj.spa.repositories;

import com.acj.spa.entities.Endereco;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnderecoRepository  extends MongoRepository<Endereco, String> {
}
