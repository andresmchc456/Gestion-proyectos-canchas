package com.canchas.dto;

import com.canchas.model.Cancha;
import com.canchas.model.TipoCancha;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public class CanchaResponse {

    private Long id;
    private String nombre;
    private TipoCancha tipo;
    private String tipoNombreLegible;
    private String superficie;
    private String descripcion;
    private BigDecimal tarifaPorHora;
    private String tarifaFormateada;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime horaApertura;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime horaCierre;

    private String horarioAtencion;
    private Integer duracionTurnoMinutos;
    private Boolean activa;
    private String estadoDescripcion;
    private Boolean techada;
    private Boolean iluminacion;
    private String imagenUrl;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;

    public CanchaResponse() {
    }

    public CanchaResponse(Cancha cancha) {
        this.id = cancha.getId();
        this.nombre = cancha.getNombre();
        this.tipo = cancha.getTipo();
        this.tipoNombreLegible = cancha.getTipo() != null ? cancha.getTipo().getNombreLegible() : "";
        this.superficie = cancha.getSuperficie();
        this.descripcion = cancha.getDescripcion();
        this.tarifaPorHora = cancha.getTarifaPorHora();

        if (cancha.getTarifaPorHora() != null) {
            NumberFormat nf = NumberFormat.getCurrencyInstance(Locale.of("es", "CO"));
            nf.setMaximumFractionDigits(0);
            this.tarifaFormateada = nf.format(cancha.getTarifaPorHora());
        }

        this.horaApertura = cancha.getHoraApertura();
        this.horaCierre = cancha.getHoraCierre();

        DateTimeFormatter timeFmt = DateTimeFormatter.ofPattern("HH:mm");
        if (cancha.getHoraApertura() != null && cancha.getHoraCierre() != null) {
            this.horarioAtencion = cancha.getHoraApertura().format(timeFmt) + " - " + cancha.getHoraCierre().format(timeFmt);
        }

        this.duracionTurnoMinutos = cancha.getDuracionTurnoMinutos();
        this.activa = cancha.getActiva();
        this.estadoDescripcion = Boolean.TRUE.equals(cancha.getActiva()) ? "Habilitada" : "En Mantenimiento";
        this.techada = cancha.getTechada();
        this.iluminacion = cancha.getIluminacion();
        this.imagenUrl = cancha.getImagenUrl();
        this.fechaCreacion = cancha.getFechaCreacion();
        this.fechaActualizacion = cancha.getFechaActualizacion();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getTipoNombreLegible() {
        return tipoNombreLegible;
    }

    public void setTipoNombreLegible(String tipoNombreLegible) {
        this.tipoNombreLegible = tipoNombreLegible;
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

    public String getTarifaFormateada() {
        return tarifaFormateada;
    }

    public void setTarifaFormateada(String tarifaFormateada) {
        this.tarifaFormateada = tarifaFormateada;
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

    public String getHorarioAtencion() {
        return horarioAtencion;
    }

    public void setHorarioAtencion(String horarioAtencion) {
        this.horarioAtencion = horarioAtencion;
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

    public String getEstadoDescripcion() {
        return estadoDescripcion;
    }

    public void setEstadoDescripcion(String estadoDescripcion) {
        this.estadoDescripcion = estadoDescripcion;
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

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }

    public void setFechaActualizacion(LocalDateTime fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }
}

