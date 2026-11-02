package com.canchas.controller;

import com.canchas.dto.CanchaRequest;
import com.canchas.dto.CanchaResponse;
import com.canchas.dto.MessageResponse;
import com.canchas.model.TipoCancha;
import com.canchas.service.CanchaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/canchas")
public class CanchaController {

    private final CanchaService canchaService;

    public CanchaController(CanchaService canchaService) {
        this.canchaService = canchaService;
    }

    /**
     * Oferta disponible para Clientes y Público en general:
     * Criterio de Aceptación: El cliente puede consultar ÚNICAMENTE la oferta habilitada.
     */
    @GetMapping
    public ResponseEntity<List<CanchaResponse>> getCanchasHabilitadas(
            @RequestParam(required = false) TipoCancha tipo,
            @RequestParam(required = false) BigDecimal maxTarifa,
            @RequestParam(required = false) String buscar
    ) {
        List<CanchaResponse> canchas = canchaService.getCanchasHabilitadas(tipo, maxTarifa, buscar);
        return ResponseEntity.ok(canchas);
    }

    /**
     * Consulta individual para cliente (sólo si está habilitada).
     */
    @GetMapping("/{id}")
    public ResponseEntity<CanchaResponse> getCanchaHabilitadaById(@PathVariable Long id) {
        CanchaResponse cancha = canchaService.getCanchaHabilitadaById(id);
        return ResponseEntity.ok(cancha);
    }

    /**
     * Listado de tipos de canchas disponibles para los filtros de búsqueda.
     */
    @GetMapping("/tipos")
    public ResponseEntity<List<Map<String, String>>> getTiposCancha() {
        List<Map<String, String>> tipos = Arrays.stream(TipoCancha.values())
                .map(t -> Map.of(
                        "codigo", t.name(),
                        "nombre", t.getNombreLegible()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(tipos);
    }

    // =========================================================================
    // OPERACIONES ADMINISTRATIVAS (Exclusivas para ROLE_ADMIN)
    // =========================================================================

    /**
     * Listado administrativo completo (incluye canchas habilitadas y en mantenimiento/desactivadas).
     */
    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<CanchaResponse>> getAllCanchasAdmin() {
        List<CanchaResponse> canchas = canchaService.getAllCanchasAdmin();
        return ResponseEntity.ok(canchas);
    }

    /**
     * Consulta administrativa de cancha por ID para edición.
     */
    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<CanchaResponse> getCanchaAdminById(@PathVariable Long id) {
        CanchaResponse cancha = canchaService.getCanchaAdminById(id);
        return ResponseEntity.ok(cancha);
    }

    /**
     * Creación de cancha deportiva.
     */
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<CanchaResponse> createCancha(@Valid @RequestBody CanchaRequest request) {
        CanchaResponse response = canchaService.createCancha(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Edición y actualización de cancha deportiva.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<CanchaResponse> updateCancha(
            @PathVariable Long id,
            @Valid @RequestBody CanchaRequest request
    ) {
        CanchaResponse response = canchaService.updateCancha(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Desactivación / Activación rápida (Toggle de Estado).
     */
    @PatchMapping("/{id}/toggle-estado")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<CanchaResponse> toggleEstado(@PathVariable Long id) {
        CanchaResponse response = canchaService.toggleEstado(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Desactivación suave de cancha.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<MessageResponse> deleteCancha(@PathVariable Long id) {
        canchaService.deleteCancha(id);
        return ResponseEntity.ok(MessageResponse.ok("Cancha desactivada exitosamente"));
    }
}

