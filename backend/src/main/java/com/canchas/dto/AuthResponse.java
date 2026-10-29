package com.canchas.dto;

import com.canchas.model.Role;

public class AuthResponse {

    private String token;
    private String tipoToken = "Bearer";
    private Long id;
    private String nombreCompleto;
    private String email;
    private Role rol;
    private String telefono;

    public AuthResponse() {
    }

    public AuthResponse(String token, Long id, String nombreCompleto, String email, Role rol, String telefono) {
        this.token = token;
        this.tipoToken = "Bearer";
        this.id = id;
        this.nombreCompleto = nombreCompleto;
        this.email = email;
        this.rol = rol;
        this.telefono = telefono;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTipoToken() {
        return tipoToken;
    }

    public void setTipoToken(String tipoToken) {
        this.tipoToken = tipoToken;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRol() {
        return rol;
    }

    public void setRol(Role rol) {
        this.rol = rol;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
}

