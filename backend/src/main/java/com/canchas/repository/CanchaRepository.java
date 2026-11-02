package com.canchas.repository;

import com.canchas.model.Cancha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CanchaRepository extends JpaRepository<Cancha, Long> {

    List<Cancha> findByActivaTrueOrderByNombreAsc();

    List<Cancha> findAllByOrderByFechaCreacionDesc();

    boolean existsByNombreIgnoreCase(String nombre);

    boolean existsByNombreIgnoreCaseAndIdNot(String nombre, Long id);

    long countByActiva(boolean activa);
}
