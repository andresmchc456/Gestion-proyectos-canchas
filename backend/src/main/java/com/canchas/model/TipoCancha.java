package com.canchas.model;

public enum TipoCancha {
    FUTBOL_5("Fútbol 5"),
    FUTBOL_7("Fútbol 7"),
    FUTBOL_11("Fútbol 11"),
    TENIS("Tenis"),
    PADEL("Pádel"),
    BALONCESTO("Baloncesto"),
    VOLEIBOL("Voleibol");

    private final String nombreLegible;

    TipoCancha(String nombreLegible) {
        this.nombreLegible = nombreLegible;
    }

    public String getNombreLegible() {
        return nombreLegible;
    }
}

