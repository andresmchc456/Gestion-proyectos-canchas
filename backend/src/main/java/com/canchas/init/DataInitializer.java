package com.canchas.init;

import com.canchas.model.Role;
import com.canchas.model.Usuario;
import com.canchas.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.default-email:admin@canchas.com}")
    private String defaultAdminEmail;

    @Value("${app.admin.default-password:Admin123*}")
    private String defaultAdminPassword;

    @Value("${app.admin.default-name:Administrador Principal}")
    private String defaultAdminName;

    public DataInitializer(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
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
}

