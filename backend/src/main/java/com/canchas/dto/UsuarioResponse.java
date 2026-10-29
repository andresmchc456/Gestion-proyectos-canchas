package com.canchas.dto;

import com.canchas.model.Role;
import com.canchas.model.Usuario;
import java.time.LocalDateTime;

public class UsuarioResponse {

    private Long id;
    private String nombreCompleto;
    private String email;
    private String telefono;
    private Role rol;
    private Boolean activo;
    private LocalDateTime fechaCreacion;

    public UsuarioResponse() {
    }

    public UsuarioResponse(Usuario usuario) {
        this.id = usuario.getId();
        this.nombreCompleto = usuario.getNombreCompleto();
        this.email = usuario.getEmail();
        this.telefono = usuario.getTelefono();
        this.rol = usuario.getRol();
        this.activo = usuario.getActivo();
        this.fechaCreacion = usuario.getFechaCreacion();
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

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public Role getRol() {
        return rol;
    }

    public void setRol(Role rol) {
        this.rol = rol;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}

