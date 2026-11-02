package com.canchas;

import com.canchas.dto.CanchaRequest;
import com.canchas.dto.LoginRequest;
import com.canchas.dto.RegisterRequest;
import com.canchas.model.TipoCancha;
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

import java.math.BigDecimal;
import java.time.LocalTime;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class CanchaIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String adminToken;
    private String clienteToken;

    @BeforeEach
    void obtainTokens() throws Exception {
        // Token de Administrador
        LoginRequest adminLogin = new LoginRequest("admin@canchas.com", "Admin123*");
        MvcResult adminRes = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(adminLogin)))
                .andExpect(status().isOk())
                .andReturn();
        this.adminToken = objectMapper.readTree(adminRes.getResponse().getContentAsString()).get("token").asText();

        // Token de Cliente
        String clientEmail = "cliente.canchas." + System.currentTimeMillis() + "@gmail.com";
        RegisterRequest clientReg = new RegisterRequest("Cliente Tester", clientEmail, "Cliente123*", "3001112233");
        MvcResult clientRes = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(clientReg)))
                .andExpect(status().isCreated())
                .andReturn();
        this.clienteToken = objectMapper.readTree(clientRes.getResponse().getContentAsString()).get("token").asText();
    }

    @Test
    @DisplayName("Criterio de Aceptación: El cliente solo consulta canchas habilitadas (activa = true)")
    void testClientConsultsOnlyActiveCourts() throws Exception {
        // La consulta pública o de cliente debe retornar únicamente canchas con activa = true
        mockMvc.perform(get("/api/canchas")
                        .header("Authorization", "Bearer " + clienteToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", not(empty())))
                .andExpect(jsonPath("$[*].activa", everyItem(is(true))))
                // La cancha "Cancha Múltiple de Baloncesto" está inactiva y no debe aparecer en la lista
                .andExpect(jsonPath("$[*].nombre", not(hasItem("Cancha Múltiple de Baloncesto"))));
    }

    @Test
    @DisplayName("Criterio de Aceptación: El administrador puede consultar TODAS las canchas (activas e inactivas)")
    void testAdminConsultsAllCourts() throws Exception {
        mockMvc.perform(get("/api/canchas/admin")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", not(empty())))
                // El admin sí debe ver la cancha inactiva
                .andExpect(jsonPath("$[*].nombre", hasItem("Cancha Múltiple de Baloncesto")));
    }

    @Test
    @DisplayName("Criterio de Seguridad: Cliente recibe 403 Forbidden al intentar crear o editar canchas")
    void testClientCannotManageCourts() throws Exception {
        CanchaRequest newCourt = new CanchaRequest(
                "Cancha Hacker No Autorizada",
                TipoCancha.FUTBOL_5,
                "Sintética",
                "Descripción",
                new BigDecimal("50000.00"),
                LocalTime.of(8, 0),
                LocalTime.of(22, 0),
                60,
                true,
                false,
                true,
                null
        );

        // Cliente intenta crear cancha -> 403 Forbidden
        mockMvc.perform(post("/api/canchas")
                        .header("Authorization", "Bearer " + clienteToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newCourt)))
                .andExpect(status().isForbidden());

        // Cliente intenta acceder al endpoint admin -> 403 Forbidden
        mockMvc.perform(get("/api/canchas/admin")
                        .header("Authorization", "Bearer " + clienteToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Operaciones Administrativas: Administrador puede crear, editar y alternar estado de cancha")
    void testAdminCourtLifecycle() throws Exception {
        String courtName = "Cancha Nueva Pádel " + System.currentTimeMillis();
        CanchaRequest request = new CanchaRequest(
                courtName,
                TipoCancha.PADEL,
                "Césped Azul Pro",
                "Pista de pádel con vista panorámica",
                new BigDecimal("90000.00"),
                LocalTime.of(7, 0),
                LocalTime.of(23, 0),
                60,
                true,
                true,
                true,
                null
        );

        // 1. Crear
        MvcResult createRes = mockMvc.perform(post("/api/canchas")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.nombre").value(courtName))
                .andExpect(jsonPath("$.activa").value(true))
                .andReturn();

        long createdId = objectMapper.readTree(createRes.getResponse().getContentAsString()).get("id").asLong();

        // 2. Editar
        request.setTarifaPorHora(new BigDecimal("95000.00"));
        request.setDescripcion("Pista de pádel mejorada con iluminación LED");
        mockMvc.perform(put("/api/canchas/" + createdId)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tarifaPorHora").value(95000.00));

        // 3. Desactivar / Toggle de Estado
        mockMvc.perform(patch("/api/canchas/" + createdId + "/toggle-estado")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.activa").value(false));

        // Ahora el cliente NO debe verla en su catálogo público
        mockMvc.perform(get("/api/canchas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].id", not(hasItem((int) createdId))));

        // 4. Volver a activar
        mockMvc.perform(patch("/api/canchas/" + createdId + "/toggle-estado")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.activa").value(true));

        // Ahora el cliente SÍ la ve en su catálogo
        mockMvc.perform(get("/api/canchas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].id", hasItem((int) createdId)));
    }

    @Test
    @DisplayName("Validación: Horario de apertura debe ser anterior a horario de cierre")
    void testInvalidHoursRejected() throws Exception {
        CanchaRequest invalidRequest = new CanchaRequest(
                "Cancha Horario Inválido " + System.currentTimeMillis(),
                TipoCancha.TENIS,
                "Polvo de Ladrillo",
                "Descripción",
                new BigDecimal("60000.00"),
                LocalTime.of(23, 0), // Apertura después de cierre
                LocalTime.of(7, 0),
                60,
                true,
                false,
                true,
                null
        );

        mockMvc.perform(post("/api/canchas")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.mensaje", containsString("anterior a la hora de cierre")));
    }
}

