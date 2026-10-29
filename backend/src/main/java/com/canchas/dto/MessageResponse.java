package com.canchas.dto;

import java.time.LocalDateTime;

public class MessageResponse {

    private String mensaje;
    private boolean exito;
    private LocalDateTime timestamp;

    public MessageResponse() {
        this.timestamp = LocalDateTime.now();
    }

    public MessageResponse(String mensaje, boolean exito) {
        this.mensaje = mensaje;
        this.exito = exito;
        this.timestamp = LocalDateTime.now();
    }

    public static MessageResponse ok(String mensaje) {
        return new MessageResponse(mensaje, true);
    }

    public static MessageResponse error(String mensaje) {
        return new MessageResponse(mensaje, false);
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public boolean isExito() {
        return exito;
    }

    public void setExito(boolean exito) {
        this.exito = exito;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}

