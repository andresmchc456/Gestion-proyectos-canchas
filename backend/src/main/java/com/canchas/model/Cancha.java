package com.canchas.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "canchas")
public class Cancha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TipoCancha tipo;

    @Column(nullable = false, length = 80)
    private String superficie;

    @Column(length = 1000)
    private String descripcion;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal tarifaPorHora;

    @Column(nullable = false)
    private LocalTime horaApertura;

    @Column(nullable = false)
    private LocalTime horaCierre;

    @Column(nullable = false)
    private Integer duracionTurnoMinutos = 60;

    @Column(nullable = false)
    private Boolean activa = true;

    @Column(nullable = false)
    private Boolean techada = false;

    @Column(nullable = false)
    private Boolean iluminacion = true;

    @Column(length = 500)
    private String imagenUrl;

    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    private LocalDateTime fechaActualizacion;

    public Cancha() {
    }

    public Cancha(String nombre, TipoCancha tipo, String superficie, String descripcion,
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

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
        this.fechaActualizacion = LocalDateTime.now();
        if (this.activa == null) {
            this.activa = true;
        }
        if (this.duracionTurnoMinutos == null) {
            this.duracionTurnoMinutos = 60;
        }
        if (this.techada == null) {
            this.techada = false;
        }
        if (this.iluminacion == null) {
            this.iluminacion = true;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.fechaActualizacion = LocalDateTime.now();
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

