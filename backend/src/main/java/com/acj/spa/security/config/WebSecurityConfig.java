package com.acj.spa.security.config;

import com.acj.spa.security.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.security.SecureRandom;
import java.util.Arrays;

@EnableWebSecurity
@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	private CustomUserDetailService customUserDatailService;

	@Autowired
	private JWTUtil jwtUtil;
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.cors().configure(http);
		
		http.httpBasic().and().authorizeRequests().antMatchers(HttpMethod.POST, "/login").permitAll();
		http.httpBasic().and().authorizeRequests().antMatchers(HttpMethod.POST, "/usuarios").permitAll();
		http.httpBasic().and().authorizeRequests().antMatchers(HttpMethod.POST, "/usuarios/esqueceuSenha").permitAll();
		http.httpBasic().and().authorizeRequests().antMatchers(HttpMethod.POST, "/usuarios/salvarSenha").permitAll();
		http.httpBasic().and().authorizeRequests().antMatchers(HttpMethod.POST, "/categorias").permitAll();
		http.httpBasic().and().authorizeRequests().antMatchers(HttpMethod.GET, "/protected/anuncios/**").permitAll();
		
		//BLOQUEIA TODOS AS URLs NÃO MAPEADAS
		http.authorizeRequests().anyRequest().authenticated();
		//MAPEA URLS COMO PADRAO /ADMIN E / PROTECTED PARA SEREM ACESSADAS APENAS COM AUTORIZAÇÃO DE USER OU ADMIN
		http.authorizeRequests().antMatchers("/admim/").hasRole("ADMIN").antMatchers("/protected/").hasRole("USER").and().addFilter(new JWTAuthenticationFilter(authenticationManager(), jwtUtil)).addFilter(new JWTAuthorizationFilter(authenticationManager(), customUserDatailService, jwtUtil));
		http.csrf().disable();
	}

	//Allow CORS
	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(Arrays.asList("*"));
		configuration.setAllowedMethods(Arrays.asList("GET","POST","PUT","DELETE","OPTIONS"));
		configuration.setAllowedHeaders(Arrays.asList("*"));
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
	@Bean
	public PasswordEncoder passwordEncoder() {
		SecureRandom secureRandom = new SecureRandom("G52S(TTT_&_@n-}6r}Zq#KbyvELaj=aw$}WPq5=".getBytes());
		return new BCryptPasswordEncoder(15, secureRandom);
	}

	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		//REALIZA A CRIPTOGRAFIA DA SENHA DOS USUARIOS PARA AUTENTICAR
		auth.userDetailsService(customUserDatailService).passwordEncoder(new BCryptPasswordEncoder());
	}
}
