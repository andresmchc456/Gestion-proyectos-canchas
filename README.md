# Sistema de Gestión y Reserva de Canchas Deportivas

Sistema web full-stack para el registro, consulta y gestión de reservas de canchas deportivas en clubes o complejos recreativos.

---

## 🛠️ Stack Tecnológico

- **Base de Datos:** PostgreSQL 17 (`canchas_db`)
- **Backend:** Java 21+ con Spring Boot 3.4.2 (Arquitectura por capas: Controller, Service, Repository, Model, DTO, Security)
- **Seguridad:** Spring Security 6 + Autenticación Stateless JWT (JSON Web Tokens) + Encriptación BCrypt
- **Frontend:** React.js (SPA moderna con Vite), React Router 7, Lucide Icons, diseño deportivo responsivo

---

## 📋 Implementación de la Historia de Usuario 1

> **Historia de Usuario:**
> *«Como usuario, quiero registrarme e iniciar sesión, para gestionar mis reservas de acuerdo con los permisos de mi perfil».*

### Desglose de Tareas Realizadas (Total: 24h estimadas):
1. **Tarea 1: Modelo de usuario y procedimiento seguro de creación de administradores (8h)**
   - Entidad JPA `Usuario` con roles tipados (`ROLE_CLIENTE`, `ROLE_ADMIN`).
   - Inicialización automática segura (`DataInitializer`) del administrador maestro inicial con contraseña encriptada en BCrypt.
   - Endpoint seguro `POST /api/auth/create-admin` protegido por clave de inicialización secreta (`bootstrapSecret: AdminSecretKey2026!`) o rol de administrador autenticado.

2. **Tarea 2: Inicio y cierre de sesión, autenticación y permisos del backend (8h)**
   - Configuración de `SecurityFilterChain` con sesiones stateless.
   - Filtro JWT (`JwtAuthenticationFilter`) que intercepta cabeceras `Authorization: Bearer <token>`.
   - Control de acceso basado en roles (`@PreAuthorize` / `hasAuthority`).
   - Criterio estricto: El registro público siempre asigna `ROLE_CLIENTE`.
   - Criterio estricto: Las consultas a usuarios administrativos (`GET /api/usuarios`) están vetadas para clientes (HTTP 403 Forbidden).

3. **Tarea 3: Formularios de acceso y registro, validaciones y mensajes (8h)**
   - SPA React con formulario de Login y Registro reactivos y responsivos.
   - Validaciones en tiempo real y al enviar (formato de correo, longitud de contraseña, confirmación de clave, teléfono).
   - Manejo de alertas y mensajes de error/éxito claros.
   - Botones de acceso rápido para pruebas (Admin Demo y Cliente Demo).
   - Sección interactiva en el Dashboard que demuestra en vivo la aplicación de permisos y bloqueo 403 Forbidden.

---

## 🚀 Cómo Ejecutar el Proyecto

### 1. Base de Datos
PostgreSQL corriendo en el puerto `5432` con la base de datos `canchas_db`:
- Usuario: `postgres`
- Contraseña: `admin123` (configurable en `backend/src/main/resources/application.properties`)

### 2. Backend (Spring Boot)
Desde la carpeta raíz del proyecto:
```bash
cd backend
.\mvnw.cmd spring-boot:run
```
El servidor backend se levantará en: **`http://localhost:8080`**

### 3. Frontend (React + Vite)
Desde otra terminal:
```bash
cd frontend
npm run dev
```
La aplicación web estará disponible en: **`http://localhost:5173`**

---

## 🔑 Credenciales de Prueba Preconfiguradas

| Perfil | Correo Electrónico | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@canchas.com` | `Admin123*` | Total (Gestión, Canchas, Reportes, Usuarios) |
| **Cliente** | `riquelme10@boca.com` | `Magia10Total*` | Reservas y perfil personal |
| **Registro Público** | *Cualquier correo nuevo* | *Definida por usuario* | Siempre asigna rol `ROLE_CLIENTE` |

---

## 📋 Implementación de la Historia de Usuario 3 (HU03)

> **Historia de Usuario:**
> *«Como administrador, quiero configurar las canchas, sus precios y horarios, para publicar una oferta de reservas actualizada».* (3 PE — 24 horas)
>
> **Aceptación:** El administrador puede mantener las canchas y el cliente puede consultar únicamente la oferta habilitada.

### Desglose de Tareas Realizadas (Total: 24h estimadas):
1. **Tarea 1: Modelo de canchas, tipos, tarifas y disponibilidad (8h)**
   - Entidad JPA `Cancha` con atributos: `nombre`, `tipo` (`TipoCancha`: Fútbol 5, Fútbol 7, Fútbol 11, Tenis, Pádel, Baloncesto, Voleibol), `superficie`, `descripcion`, `tarifaPorHora`, `horaApertura`, `horaCierre`, `duracionTurnoMinutos`, `techada`, `iluminacion`, `activa` e `imagenUrl`.
   - Repositorio `CanchaRepository` con métodos para consultar canchas habilitadas (`activa = true`) y filtros por deporte, precio y texto.
   - DTOs `CanchaRequest` (con validaciones de horas y tarifas) y `CanchaResponse` (con tarifas y horarios formateados).

2. **Tarea 2: Operaciones administrativas de creación, edición y desactivación (8h)**
   - Endpoints REST protegidos para `ROLE_ADMIN`:
     - `POST /api/canchas`: Alta de nuevas canchas.
     - `PUT /api/canchas/{id}`: Edición de tarifas, horarios, características y superficies.
     - `PATCH /api/canchas/{id}/toggle-estado`: Activación o puesta en mantenimiento con 1 solo clic.
     - `DELETE /api/canchas/{id}`: Desactivación suave.
     - `GET /api/canchas/admin`: Listado integral de todas las canchas (activas e inactivas).
   - Bloqueo estricto con `HTTP 403 Forbidden` para clientes que intenten operaciones de modificación.

3. **Tarea 3: Pantallas de consulta y filtros para clientes (8h)**
   - Pantalla de Catálogo (`CanchasCatalog.jsx`):
     - Muestra **únicamente la oferta habilitada** al público y clientes.
     - Filtros interactivos en tiempo real por tipo de deporte, tarifa máxima por hora, búsqueda por texto, filtro de techada e iluminación nocturna.
     - Tarjetas con fotografía deportiva, superficie, horarios oficiales y precio por hora formateado.
   - Panel de Gestión Administrativa (`AdminCanchas.jsx`):
     - Tarjetas de métricas: total de canchas, habilitadas, en mantenimiento y tarifa promedio.
     - Tabla interactiva con botones para cambiar de estado al instante (Habilitar / Desactivar) y botón para editar con modal completo.
     - Botón para registrar nueva cancha deportiva con sugerencia automática de fotos por disciplina.

---

## 🧪 Pruebas Automatizadas

Para ejecutar la suite de pruebas unitarias y de integración del backend:
```bash
cd backend
.\mvnw.cmd test
```
Resultados: **11/11 pruebas aprobadas** (Auth + HU03 Canchas) verificando registro, seguridad, filtros de clientes y ciclo de vida de canchas para administradores.

