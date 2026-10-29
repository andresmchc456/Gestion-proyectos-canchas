package com.canchas.service;

import com.canchas.dto.AuthResponse;
import com.canchas.dto.LoginRequest;
import com.canchas.dto.RegisterRequest;
import com.canchas.dto.UsuarioResponse;
import com.canchas.exception.BadRequestException;
import com.canchas.exception.ResourceNotFoundException;
import com.canchas.model.Role;
import com.canchas.model.Usuario;
import com.canchas.repository.UsuarioRepository;
import com.canchas.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    /**
     * Registro público de usuarios.
     * Criterio de aceptación: El registro público SIEMPRE asigna ROLE_CLIENTE y
     * NO permite obtener privilegios de administrador.
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String emailClean = request.getEmail().trim().toLowerCase();

        if (usuarioRepository.existsByEmail(emailClean)) {
            throw new BadRequestException("El correo '" + emailClean + "' ya está registrado en el sistema");
        }

        Usuario usuario = new Usuario();
        usuario.setNombreCompleto(request.getNombreCompleto().trim());
        usuario.setEmail(emailClean);
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setTelefono(request.getTelefono() != null ? request.getTelefono().trim() : null);
        // Garantía de seguridad: siempre ROLE_CLIENTE en registro público
        usuario.setRol(Role.ROLE_CLIENTE);
        usuario.setActivo(true);

        Usuario guardado = usuarioRepository.save(usuario);
        String token = jwtService.generateToken(guardado);

        return new AuthResponse(
                token,
                guardado.getId(),
                guardado.getNombreCompleto(),
                guardado.getEmail(),
                guardado.getRol(),
                guardado.getTelefono()
        );
    }

    /**
     * Inicio de sesión de usuarios (clientes y administradores).
     */
    public AuthResponse login(LoginRequest request) {
        String emailClean = request.getEmail().trim().toLowerCase();

        // Autenticación con Spring Security (valida credenciales con BCrypt)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(emailClean, request.getPassword())
        );

        Usuario usuario = usuarioRepository.findByEmail(emailClean)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con correo: " + emailClean));

        if (Boolean.FALSE.equals(usuario.getActivo())) {
            throw new BadRequestException("Tu cuenta se encuentra inactiva. Comunícate con la administración.");
        }

        String token = jwtService.generateToken(usuario);

        return new AuthResponse(
                token,
                usuario.getId(),
                usuario.getNombreCompleto(),
                usuario.getEmail(),
                usuario.getRol(),
                usuario.getTelefono()
        );
    }

    /**
     * Obtiene los datos del usuario actualmente autenticado según su token JWT.
     */
    @Transactional(readOnly = true)
    public UsuarioResponse getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new BadRequestException("No hay una sesión de usuario activa");
        }

        String email = auth.getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con correo: " + email));

        return new UsuarioResponse(usuario);
    }
}

