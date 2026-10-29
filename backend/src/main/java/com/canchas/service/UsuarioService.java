package com.canchas.service;

import com.canchas.dto.AdminCreateRequest;
import com.canchas.dto.UsuarioResponse;
import com.canchas.exception.BadRequestException;
import com.canchas.exception.ResourceNotFoundException;
import com.canchas.model.Role;
import com.canchas.model.Usuario;
import com.canchas.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.bootstrap-secret}")
    private String configuredBootstrapSecret;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Procedimiento seguro de creación de administradores.
     * Requiere presentar la clave de inicialización secreta configurada en el servidor
     * o ser ejecutado por un usuario con sesión activa de ROLE_ADMIN.
     */
    @Transactional
    public UsuarioResponse createAdmin(AdminCreateRequest request) {
        // Validación de seguridad para alta de administrador
        boolean hasValidSecret = configuredBootstrapSecret != null &&
                configuredBootstrapSecret.equals(request.getBootstrapSecret());

        boolean isCallerAdmin = false;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            isCallerAdmin = auth.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        }

        if (!hasValidSecret && !isCallerAdmin) {
            throw new AccessDeniedException("Acceso denegado: Clave de inicialización de administrador inválida o permisos insuficientes");
        }

        String emailClean = request.getEmail().trim().toLowerCase();
        if (usuarioRepository.existsByEmail(emailClean)) {
            throw new BadRequestException("El correo '" + emailClean + "' ya se encuentra registrado");
        }

        Usuario admin = new Usuario();
        admin.setNombreCompleto(request.getNombreCompleto().trim());
        admin.setEmail(emailClean);
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        admin.setTelefono(request.getTelefono() != null ? request.getTelefono().trim() : null);
        admin.setRol(Role.ROLE_ADMIN);
        admin.setActivo(true);

        Usuario guardado = usuarioRepository.save(admin);
        return new UsuarioResponse(guardado);
    }

    /**
     * Listado de usuarios exclusivo para administradores.
     */
    @Transactional(readOnly = true)
    public List<UsuarioResponse> getAllUsuarios() {
        return usuarioRepository.findAllByOrderByFechaCreacionDesc()
                .stream()
                .map(UsuarioResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Consulta de perfil por ID con protección de datos privados:
     * Un usuario común sólo puede ver su propio perfil.
     */
    @Transactional(readOnly = true)
    public UsuarioResponse getUsuarioById(Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new AccessDeniedException("No autenticado");
        }

        Usuario solicitado = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));

        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        // Si no es admin y el email no coincide con el autenticado, se deniega acceso
        if (!isAdmin && !solicitado.getEmail().equalsIgnoreCase(auth.getName())) {
            throw new AccessDeniedException("No tienes permiso para consultar la información privada de otros usuarios");
        }

        return new UsuarioResponse(solicitado);
    }
}

