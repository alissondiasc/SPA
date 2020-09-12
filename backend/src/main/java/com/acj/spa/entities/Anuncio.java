package com.acj.spa.entities;

import com.acj.spa.dto.UsuarioDTO;
import com.acj.spa.enums.StatusAnuncio;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Document
public class Anuncio implements Serializable {

    @Id
    private String id;
    private String titulo;
    private String descricao;
    private LocalDateTime dataHora;
    private StatusAnuncio status;
    private String localidade ;
    private String bairro;
    private Boolean isDeleted = false;

    @DBRef
    private Categoria categoria;

    @DBRef
    private Usuario usuario;

    @DBRef
    private Usuario profissional;
    
    @DBRef
    private List<Usuario> candidatos;

    public Anuncio() {
    }

    public Anuncio(String id, String titulo, String descricao, Categoria categoria, Usuario usuario, LocalDateTime dataHora, List<Usuario> candidatos, Usuario profissional, String localidade, String bairro ) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.categoria = categoria;
        this.usuario = usuario;
        this.dataHora = dataHora;
        this.candidatos= candidatos;
        this.profissional = profissional;
        this.localidade = localidade;
        this.bairro = bairro;
    }



    public List<Usuario> getCandidatos() {
		return candidatos;
	}

	public void setCandidatos(List<Usuario> candidatos) {
		this.candidatos = candidatos;
	}

	public LocalDateTime getDataHora() {
		return dataHora;
	}

	public void setDataHora(LocalDateTime dataHora) {
		this.dataHora = dataHora;
	}

    public StatusAnuncio getStatus() {
        return status;
    }

    public void setStatus(StatusAnuncio status) {
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Usuario getProfissional() {
        return profissional;
    }

    public void setProfissional(Usuario profissional) {
        this.profissional = profissional;
    }

    public String getLocalidade() {
        return localidade;
    }

    public void setLocalidade(String localidade) {
        this.localidade = localidade;
    }

    public String getBairro() {
        return bairro;
    }

    public void setBairro(String bairro) {
        this.bairro = bairro;
    }

    public Boolean getDeleted() {
        return isDeleted;
    }

    public void setDeleted(Boolean deleted) {
        isDeleted = deleted;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof Usuario) {
            Usuario qualquer = (Usuario) obj;
            return this.id.equals(qualquer.getId());
        }else {
            return false;
        }
    }
}
