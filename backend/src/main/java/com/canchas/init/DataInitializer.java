package com.canchas.init;

import com.canchas.model.Cancha;
import com.canchas.model.Role;
import com.canchas.model.TipoCancha;
import com.canchas.model.Usuario;
import com.canchas.repository.CanchaRepository;
import com.canchas.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UsuarioRepository usuarioRepository;
    private final CanchaRepository canchaRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.default-email:admin@canchas.com}")
    private String defaultAdminEmail;

    @Value("${app.admin.default-password:Admin123*}")
    private String defaultAdminPassword;

    @Value("${app.admin.default-name:Administrador Principal}")
    private String defaultAdminName;

    public DataInitializer(UsuarioRepository usuarioRepository,
                           CanchaRepository canchaRepository,
                           PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.canchaRepository = canchaRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        inicializarUsuarios();
        inicializarCanchas();
    }

    private void inicializarUsuarios() {
        if (!usuarioRepository.existsByEmail(defaultAdminEmail.trim().toLowerCase())) {
            Usuario admin = new Usuario();
            admin.setNombreCompleto(defaultAdminName);
            admin.setEmail(defaultAdminEmail.trim().toLowerCase());
            admin.setPassword(passwordEncoder.encode(defaultAdminPassword));
            admin.setTelefono("3001234567");
            admin.setRol(Role.ROLE_ADMIN);
            admin.setActivo(true);

            usuarioRepository.save(admin);
            log.info(">>> Administrador inicial creado con éxito: {}", defaultAdminEmail);
        } else {
            log.info(">>> El administrador inicial ya existe en la base de datos.");
        }
    }

    private void inicializarCanchas() {
        if (canchaRepository.count() == 0) {
            List<Cancha> canchasSemilla = List.of(
                    new Cancha(
                            "Cancha Sintética 1 - La Bombonera",
                            TipoCancha.FUTBOL_5,
                            "Césped Sintético Monofilamento 50mm",
                            "Cancha techada con iluminación LED profesional de 400W, graderías y marcador digital.",
                            new BigDecimal("80000.00"),
                            LocalTime.of(6, 0),
                            LocalTime.of(23, 0),
                            60,
                            true, // HABILITADA
                            true, // Techada
                            true, // Iluminación
                            "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80"
                    ),
                    new Cancha(
                            "Cancha Sintética 2 - El Monumental",
                            TipoCancha.FUTBOL_7,
                            "Césped Sintético Bicolor FIFA Quality",
                            "Cancha al aire libre para 7 vs 7 con iluminación nocturna, zona de hidratación y vestuarios.",
                            new BigDecimal("110000.00"),
                            LocalTime.of(7, 0),
                            LocalTime.of(23, 0),
                            60,
                            true, // HABILITADA
                            false, // Aire libre
                            true, // Iluminación
                            "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80"
                    ),
                    new Cancha(
                            "Pista Central de Tenis",
                            TipoCancha.TENIS,
                            "Polvo de Ladrillo Europeo",
                            "Cancha reglamentaria con drenaje rápido, red oficial y sistema de iluminación para juego nocturno.",
                            new BigDecimal("65000.00"),
                            LocalTime.of(6, 0),
                            LocalTime.of(21, 0),
                            60,
                            true, // HABILITADA
                            false, // Aire libre
                            true, // Iluminación
                            "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800&q=80"
                    ),
                    new Cancha(
                            "Pista de Pádel Panorámica",
                            TipoCancha.PADEL,
                            "Césped Texturado Azul y Vidrio Templado 12mm",
                            "Pista cubierta panorámica de última generación, césped monofilamento azul y focos LED sin sombras.",
                            new BigDecimal("75000.00"),
                            LocalTime.of(7, 0),
                            LocalTime.of(23, 0),
                            60,
                            true, // HABILITADA
                            true, // Techada
                            true, // Iluminación
                            "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80"
                    ),
                    new Cancha(
                            "Cancha Múltiple de Baloncesto",
                            TipoCancha.BALONCESTO,
                            "Duela de Madera / Parquet Antideslizante",
                            "Cancha techada con aros retráctiles reglamentarios. Actualmente en labores de mantenimiento de pintura y parquet.",
                            new BigDecimal("55000.00"),
                            LocalTime.of(8, 0),
                            LocalTime.of(22, 0),
                            60,
                            false, // DESHABILITADA / EN MANTENIMIENTO
                            true, // Techada
                            true, // Iluminación
                            "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80"
                    )
            );

            canchaRepository.saveAll(canchasSemilla);
            log.info(">>> Se inicializaron {} canchas deportivas de demostración (4 habilitadas y 1 en mantenimiento).", canchasSemilla.size());
        } else {
            log.info(">>> Las canchas deportivas ya se encuentran registradas en la base de datos.");
        }
    }
}


