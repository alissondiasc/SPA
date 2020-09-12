package com.acj.spa.dto;

import java.io.Serializable;

public class CategoriaDTO implements Serializable {

    private String id;
    private String nome;

    public CategoriaDTO() {
    }

    public CategoriaDTO(String id, String nome) {
        this.id = id;
        this.nome = nome;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
