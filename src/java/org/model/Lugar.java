package org.model;

/**
 *
 * @author checo
 */

public class Lugar {
    private int cveLugar;
    private String ubicacion;
    private String nombre;

    // Constructor por defecto
    public Lugar() {
    }

    // Constructor con parámetros
    public Lugar(int cveLugar, String ubicacion, String nombre) {
        this.cveLugar = cveLugar;
        this.ubicacion = ubicacion;
        this.nombre = nombre;
    }

    // Getters y Setters
    public int getCveLugar() {
        return cveLugar;
    }

    public void setCveLugar(int cveLugar) {
        this.cveLugar = cveLugar;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    // Método toString
    @Override
    public String toString() {
        return "Lugar{" +
                "cveLugar=" + cveLugar +
                ", ubicacion='" + ubicacion + '\'' +
                ", nombre='" + nombre + '\'' +
                '}';
    }
}

