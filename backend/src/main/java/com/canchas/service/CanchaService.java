package com.canchas.service;

import com.canchas.dto.CanchaRequest;
import com.canchas.dto.CanchaResponse;
import com.canchas.exception.BadRequestException;
import com.canchas.exception.ResourceNotFoundException;
import com.canchas.model.Cancha;
import com.canchas.model.TipoCancha;
import com.canchas.repository.CanchaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CanchaService {

    private final CanchaRepository canchaRepository;

    public CanchaService(CanchaRepository canchaRepository) {
        this.canchaRepository = canchaRepository;
    }

    /**
     * Consulta para clientes y público:
     * Criterio de Aceptación: El cliente puede consultar ÚNICAMENTE la oferta habilitada (activa = true).
     */
    @Transactional(readOnly = true)
    public List<CanchaResponse> getCanchasHabilitadas(TipoCancha tipo, BigDecimal maxTarifa, String buscar) {
        List<Cancha> canchas = canchaRepository.findByActivaTrueOrderByNombreAsc();

        return canchas.stream()
                .filter(c -> tipo == null || c.getTipo() == tipo)
                .filter(c -> maxTarifa == null || c.getTarifaPorHora().compareTo(maxTarifa) <= 0)
                .filter(c -> {
                    if (buscar == null || buscar.trim().isEmpty()) {
                        return true;
                    }
                    String term = buscar.trim().toLowerCase();
                    boolean matchNombre = c.getNombre() != null && c.getNombre().toLowerCase().contains(term);
                    boolean matchSuperficie = c.getSuperficie() != null && c.getSuperficie().toLowerCase().contains(term);
                    boolean matchDescripcion = c.getDescripcion() != null && c.getDescripcion().toLowerCase().contains(term);
                    return matchNombre || matchSuperficie || matchDescripcion;
                })
                .map(CanchaResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Consulta individual para cliente: solo retorna si está habilitada.
     */
    @Transactional(readOnly = true)
    public CanchaResponse getCanchaHabilitadaById(Long id) {
        Cancha cancha = canchaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cancha no encontrada con ID: " + id));

        if (Boolean.FALSE.equals(cancha.getActiva())) {
            throw new ResourceNotFoundException("La cancha solicitada no se encuentra habilitada para reservas en este momento.");
        }

        return new CanchaResponse(cancha);
    }

    /**
     * Consulta para Administradores:
     * Retorna todas las canchas (habilitadas y en mantenimiento/desactivadas).
     */
    @Transactional(readOnly = true)
    public List<CanchaResponse> getAllCanchasAdmin() {
        return canchaRepository.findAllByOrderByFechaCreacionDesc()
                .stream()
                .map(CanchaResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Consulta individual para Administradores (sin restricción de estado activo).
     */
    @Transactional(readOnly = true)
    public CanchaResponse getCanchaAdminById(Long id) {
        Cancha cancha = canchaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cancha no encontrada con ID: " + id));
        return new CanchaResponse(cancha);
    }

    /**
     * Creación de cancha (Exclusivo para ROLE_ADMIN).
     */
    @Transactional
    public CanchaResponse createCancha(CanchaRequest request) {
        validarHorarios(request);

        String nombreLimpio = request.getNombre().trim();
        if (canchaRepository.existsByNombreIgnoreCase(nombreLimpio)) {
            throw new BadRequestException("Ya existe una cancha registrada con el nombre '" + nombreLimpio + "'");
        }

        Cancha cancha = new Cancha();
        cancha.setNombre(nombreLimpio);
        cancha.setTipo(request.getTipo());
        cancha.setSuperficie(request.getSuperficie().trim());
        cancha.setDescripcion(request.getDescripcion() != null ? request.getDescripcion().trim() : null);
        cancha.setTarifaPorHora(request.getTarifaPorHora());
        cancha.setHoraApertura(request.getHoraApertura());
        cancha.setHoraCierre(request.getHoraCierre());
        cancha.setDuracionTurnoMinutos(request.getDuracionTurnoMinutos() != null ? request.getDuracionTurnoMinutos() : 60);
        cancha.setActiva(request.getActiva() != null ? request.getActiva() : true);
        cancha.setTechada(request.getTechada() != null ? request.getTechada() : false);
        cancha.setIluminacion(request.getIluminacion() != null ? request.getIluminacion() : true);
        cancha.setImagenUrl(asignarImagenPredeterminadaSiVacia(request.getImagenUrl(), request.getTipo()));

        Cancha guardada = canchaRepository.save(cancha);
        return new CanchaResponse(guardada);
    }

    /**
     * Edición de cancha (Exclusivo para ROLE_ADMIN).
     */
    @Transactional
    public CanchaResponse updateCancha(Long id, CanchaRequest request) {
        validarHorarios(request);

        Cancha cancha = canchaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cancha no encontrada con ID: " + id));

        String nombreLimpio = request.getNombre().trim();
        if (canchaRepository.existsByNombreIgnoreCaseAndIdNot(nombreLimpio, id)) {
            throw new BadRequestException("Ya existe otra cancha con el nombre '" + nombreLimpio + "'");
        }

        cancha.setNombre(nombreLimpio);
        cancha.setTipo(request.getTipo());
        cancha.setSuperficie(request.getSuperficie().trim());
        cancha.setDescripcion(request.getDescripcion() != null ? request.getDescripcion().trim() : null);
        cancha.setTarifaPorHora(request.getTarifaPorHora());
        cancha.setHoraApertura(request.getHoraApertura());
        cancha.setHoraCierre(request.getHoraCierre());
        cancha.setDuracionTurnoMinutos(request.getDuracionTurnoMinutos() != null ? request.getDuracionTurnoMinutos() : 60);
        if (request.getActiva() != null) {
            cancha.setActiva(request.getActiva());
        }
        if (request.getTechada() != null) {
            cancha.setTechada(request.getTechada());
        }
        if (request.getIluminacion() != null) {
            cancha.setIluminacion(request.getIluminacion());
        }
        if (request.getImagenUrl() != null && !request.getImagenUrl().trim().isEmpty()) {
            cancha.setImagenUrl(request.getImagenUrl().trim());
        } else if (cancha.getImagenUrl() == null || cancha.getImagenUrl().trim().isEmpty()) {
            cancha.setImagenUrl(asignarImagenPredeterminadaSiVacia(null, request.getTipo()));
        }

        Cancha actualizada = canchaRepository.save(cancha);
        return new CanchaResponse(actualizada);
    }

    /**
     * Desactivación / Activación rápida (Toggle de Estado).
     * Exclusivo para ROLE_ADMIN.
     */
    @Transactional
    public CanchaResponse toggleEstado(Long id) {
        Cancha cancha = canchaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cancha no encontrada con ID: " + id));

        cancha.setActiva(!Boolean.TRUE.equals(cancha.getActiva()));
        Cancha guardada = canchaRepository.save(cancha);
        return new CanchaResponse(guardada);
    }

    /**
     * Desactivación / Eliminación suave de cancha.
     */
    @Transactional
    public void deleteCancha(Long id) {
        Cancha cancha = canchaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cancha no encontrada con ID: " + id));

        // Desactivación lógica para preservar integridad histórica
        cancha.setActiva(false);
        canchaRepository.save(cancha);
    }

    private void validarHorarios(CanchaRequest request) {
        if (request.getHoraApertura() == null || request.getHoraCierre() == null) {
            throw new BadRequestException("Los horarios de apertura y cierre son obligatorios");
        }
        if (!request.getHoraApertura().isBefore(request.getHoraCierre())) {
            throw new BadRequestException("La hora de apertura (" + request.getHoraApertura() +
                    ") debe ser anterior a la hora de cierre (" + request.getHoraCierre() + ")");
        }
    }

    private String asignarImagenPredeterminadaSiVacia(String imagenUrl, TipoCancha tipo) {
        if (imagenUrl != null && !imagenUrl.trim().isEmpty()) {
            return imagenUrl.trim();
        }

        if (tipo == null) {
            return "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80";
        }

        return switch (tipo) {
            case FUTBOL_5 -> "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80";
            case FUTBOL_7 -> "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80";
            case FUTBOL_11 -> "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80";
            case TENIS -> "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800&q=80";
            case PADEL -> "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80";
            case BALONCESTO -> "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80";
            case VOLEIBOL -> "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80";
        };
    }
}
