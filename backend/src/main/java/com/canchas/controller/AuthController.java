package com.canchas.controller;

import com.canchas.dto.*;
import com.canchas.service.AuthService;
import com.canchas.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UsuarioService usuarioService;

    public AuthController(AuthService authService, UsuarioService usuarioService) {
        this.authService = authService;
        this.usuarioService = usuarioService;
    }

    /**
     * Registro público para clientes.
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Inicio de sesión para clientes y administradores.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Obtener datos del usuario en sesión activa.
     */
    @GetMapping("/me")
    public ResponseEntity<UsuarioResponse> getSessionUser() {
        UsuarioResponse response = authService.getCurrentUser();
        return ResponseEntity.ok(response);
    }

    /**
     * Procedimiento seguro para dar de alta administradores.
     * Requiere el bootstrapSecret configurado en el servidor o autorización de un admin activo.
     */
    @PostMapping("/create-admin")
    public ResponseEntity<UsuarioResponse> createAdmin(@Valid @RequestBody AdminCreateRequest request) {
        UsuarioResponse response = usuarioService.createAdmin(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Cierre de sesión (informativo para cliente SPA).
     */
    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout() {
        return ResponseEntity.ok(MessageResponse.ok("Sesión cerrada exitosamente"));
    }
}

