package com.acj.spa.repositories;

import com.acj.spa.entities.DadosProfissionais;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DadosProfissionaisRepository extends MongoRepository<DadosProfissionais, String> {
}
