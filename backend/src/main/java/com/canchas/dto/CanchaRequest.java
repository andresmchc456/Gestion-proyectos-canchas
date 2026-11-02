package com.canchas.dto;

import com.canchas.model.TipoCancha;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalTime;

public class CanchaRequest {

    @NotBlank(message = "El nombre de la cancha es obligatorio")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    private String nombre;

    @NotNull(message = "El tipo de cancha es obligatorio")
    private TipoCancha tipo;

    @NotBlank(message = "La superficie es obligatoria")
    @Size(max = 80, message = "La superficie no puede exceder 80 caracteres")
    private String superficie;

    @Size(max = 1000, message = "La descripción no puede exceder 1000 caracteres")
    private String descripcion;

    @NotNull(message = "La tarifa por hora es obligatoria")
    @DecimalMin(value = "1.00", message = "La tarifa por hora debe ser mayor a 0")
    private BigDecimal tarifaPorHora;

    @NotNull(message = "La hora de apertura es obligatoria")
    @JsonFormat(pattern = "HH:mm")
    private LocalTime horaApertura;

    @NotNull(message = "La hora de cierre es obligatoria")
    @JsonFormat(pattern = "HH:mm")
    private LocalTime horaCierre;

    @Min(value = 30, message = "La duración mínima de turno es de 30 minutos")
    @Max(value = 240, message = "La duración máxima de turno es de 240 minutos")
    private Integer duracionTurnoMinutos = 60;

    private Boolean activa = true;

    private Boolean techada = false;

    private Boolean iluminacion = true;

    private String imagenUrl;

    public CanchaRequest() {
    }

    public CanchaRequest(String nombre, TipoCancha tipo, String superficie, String descripcion,
                         BigDecimal tarifaPorHora, LocalTime horaApertura, LocalTime horaCierre,
                         Integer duracionTurnoMinutos, Boolean activa, Boolean techada,
                         Boolean iluminacion, String imagenUrl) {
        this.nombre = nombre;
        this.tipo = tipo;
        this.superficie = superficie;
        this.descripcion = descripcion;
        this.tarifaPorHora = tarifaPorHora;
        this.horaApertura = horaApertura;
        this.horaCierre = horaCierre;
        this.duracionTurnoMinutos = duracionTurnoMinutos != null ? duracionTurnoMinutos : 60;
        this.activa = activa != null ? activa : true;
        this.techada = techada != null ? techada : false;
        this.iluminacion = iluminacion != null ? iluminacion : true;
        this.imagenUrl = imagenUrl;
    }

    // Getters and Setters
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public TipoCancha getTipo() {
        return tipo;
    }

    public void setTipo(TipoCancha tipo) {
        this.tipo = tipo;
    }

    public String getSuperficie() {
        return superficie;
    }

    public void setSuperficie(String superficie) {
        this.superficie = superficie;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public BigDecimal getTarifaPorHora() {
        return tarifaPorHora;
    }

    public void setTarifaPorHora(BigDecimal tarifaPorHora) {
        this.tarifaPorHora = tarifaPorHora;
    }

    public LocalTime getHoraApertura() {
        return horaApertura;
    }

    public void setHoraApertura(LocalTime horaApertura) {
        this.horaApertura = horaApertura;
    }

    public LocalTime getHoraCierre() {
        return horaCierre;
    }

    public void setHoraCierre(LocalTime horaCierre) {
        this.horaCierre = horaCierre;
    }

    public Integer getDuracionTurnoMinutos() {
        return duracionTurnoMinutos;
    }

    public void setDuracionTurnoMinutos(Integer duracionTurnoMinutos) {
        this.duracionTurnoMinutos = duracionTurnoMinutos;
    }

    public Boolean getActiva() {
        return activa;
    }

    public void setActiva(Boolean activa) {
        this.activa = activa;
    }

    public Boolean getTechada() {
        return techada;
    }

    public void setTechada(Boolean techada) {
        this.techada = techada;
    }

    public Boolean getIluminacion() {
        return iluminacion;
    }

    public void setIluminacion(Boolean iluminacion) {
        this.iluminacion = iluminacion;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }
}

