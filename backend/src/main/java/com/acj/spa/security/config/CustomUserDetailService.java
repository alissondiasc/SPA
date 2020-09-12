package com.acj.spa.security.config;

import com.acj.spa.entities.Usuario;
import com.acj.spa.repositories.UsuarioRepository;
import com.acj.spa.security.UsuarioSecurity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
public class CustomUserDetailService implements UserDetailsService{

	private final UsuarioRepository usuarioRepository;
	
	@Autowired
	public CustomUserDetailService(UsuarioRepository usuarioRepository) {
		this.usuarioRepository = usuarioRepository;
	}
	
	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		Usuario usuario = usuarioRepository.findByEmail(email);
		
		return new UsuarioSecurity(usuario.getEmail(), usuario.getSenha(), usuario.getPerfil());
	}

}
