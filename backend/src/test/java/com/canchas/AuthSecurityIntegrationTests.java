package com.canchas;

import com.canchas.dto.AdminCreateRequest;
import com.canchas.dto.LoginRequest;
import com.canchas.dto.RegisterRequest;
import com.canchas.model.Role;
import com.canchas.model.Usuario;
import com.canchas.repository.UsuarioRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthSecurityIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        // Clean test users except the default admin if desired, or let existing remain
    }

    @Test
    @DisplayName("Criterio 1: El registro público crea usuario con ROLE_CLIENTE y no permite admin")
    void testPublicRegistrationCreatesRoleCliente() throws Exception {
        String uniqueEmail = "cliente.test." + System.currentTimeMillis() + "@gmail.com";
        RegisterRequest registerReq = new RegisterRequest(
                "Carlos Valderrama",
                uniqueEmail,
                "Password123*",
                "3101234567"
        );

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.rol").value("ROLE_CLIENTE"))
                .andExpect(jsonPath("$.email").value(uniqueEmail))
                .andReturn();

        // Verificar en BD que efectivamente es ROLE_CLIENTE
        Usuario saved = usuarioRepository.findByEmail(uniqueEmail).orElseThrow();
        assertEquals(Role.ROLE_CLIENTE, saved.getRol(), "El registro público debe asignar estrictamente ROLE_CLIENTE");
    }

    @Test
    @DisplayName("Validación: No permite registrar un email duplicado")
    void testDuplicateEmailRegistrationFails() throws Exception {
        String email = "duplicado." + System.currentTimeMillis() + "@canchas.com";
        RegisterRequest req = new RegisterRequest("Juan Perez", email, "Secret123*", "3000000000");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());

        // Intentar registrar el mismo correo
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.mensaje").isNotEmpty());
    }

    @Test
    @DisplayName("Inicio de sesión exitoso y rechazo con contraseña inválida")
    void testLoginFlow() throws Exception {
        String email = "login.test." + System.currentTimeMillis() + "@canchas.com";
        RegisterRequest req = new RegisterRequest("Mario Yepes", email, "Defensa3!", "3209876543");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());

        // Login con credenciales correctas
        LoginRequest validLogin = new LoginRequest(email, "Defensa3!");
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validLogin)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.email").value(email));

        // Login con contraseña incorrecta
        LoginRequest invalidLogin = new LoginRequest(email, "ClaveErrada123");
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidLogin)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.mensaje").value("Correo electrónico o contraseña incorrectos"));
    }

    @Test
    @DisplayName("Criterio 2: Cliente no puede acceder a funciones administrativas (/api/usuarios) -> 403 Forbidden")
    void testClientCannotAccessAdminEndpoints() throws Exception {
        String email = "cliente.permisos." + System.currentTimeMillis() + "@canchas.com";
        RegisterRequest req = new RegisterRequest("Falcao Garcia", email, "Golazo123*", "3154567890");

        MvcResult regResult = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn();

        String jsonResponse = regResult.getResponse().getContentAsString();
        String token = objectMapper.readTree(jsonResponse).get("token").asText();

        // Intenta acceder al endpoint de administración /api/usuarios
        mockMvc.perform(get("/api/usuarios")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Procedimiento seguro de creación de administrador con clave secreta válida")
    void testCreateAdminWithSecret() throws Exception {
        String adminEmail = "nuevo.admin." + System.currentTimeMillis() + "@canchas.com";
        AdminCreateRequest adminReq = new AdminCreateRequest(
                "Super Admin 2",
                adminEmail,
                "AdminSecure2026*",
                "3009998877",
                "AdminSecretKey2026!"
        );

        mockMvc.perform(post("/api/auth/create-admin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(adminReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.rol").value("ROLE_ADMIN"))
                .andExpect(jsonPath("$.email").value(adminEmail));

        // Con clave incorrecta debe ser rechazado con 403 Forbidden
        AdminCreateRequest badReq = new AdminCreateRequest(
                "Hacker Impostor",
                "hacker@fake.com",
                "Hack123*",
                "3000000000",
                "ClaveFalsaInvalida"
        );

        mockMvc.perform(post("/api/auth/create-admin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(badReq)))
                .andExpect(status().isForbidden());
    }
}

