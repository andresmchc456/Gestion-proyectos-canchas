package com.canchas.controller;

import com.canchas.dto.UsuarioResponse;
import com.canchas.service.AuthService;
import com.canchas.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final AuthService authService;

    public UsuarioController(UsuarioService usuarioService, AuthService authService) {
        this.usuarioService = usuarioService;
        this.authService = authService;
    }

    /**
     * Consulta del perfil del usuario autenticado.
     */
    @GetMapping("/perfil")
    public ResponseEntity<UsuarioResponse> getMiPerfil() {
        UsuarioResponse miPerfil = authService.getCurrentUser();
        return ResponseEntity.ok(miPerfil);
    }

    /**
     * Consulta de usuario por ID.
     * Criterio de aceptación: Un cliente sólo puede ver su propio perfil,
     * no puede acceder a información privada de otros usuarios.
     */
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> getUsuarioPorId(@PathVariable Long id) {
        UsuarioResponse response = usuarioService.getUsuarioById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Listado total de usuarios.
     * Criterio de aceptación: Exclusivo para administradores.
     * Clientes recibirán 403 Forbidden.
     */
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<UsuarioResponse>> listarUsuarios() {
        List<UsuarioResponse> usuarios = usuarioService.getAllUsuarios();
        return ResponseEntity.ok(usuarios);
    }
}

