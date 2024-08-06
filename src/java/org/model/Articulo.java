package org.model;

/**
 *
 * @author checo
 */

public class Articulo {
    private int id_articulo;
    private String claveArticulo;
    private int adicion;
    private String descripcion;
    private String modelo;
    private String marca;
    private String numSerie;
    private String estatus;
    private String responsable;
    private int cuenta;

    // Constructor
    public Articulo(int id_articulo, String claveArticulo, int adicion, String descripcion, String modelo, String marca, String numSerie, String estatus, String responsable, int cuenta) {
        this.id_articulo = id_articulo;
        this.claveArticulo = claveArticulo;
        this.adicion = adicion;
        this.descripcion = descripcion;
        this.modelo = modelo;
        this.marca = marca;
        this.numSerie = numSerie;
        this.estatus = estatus;
        this.responsable = responsable;
        this.cuenta = cuenta;
    }

    //Constructor vacio
    public Articulo(){}
    
    // Getters and Setters

    public int getId_articulo() {
        return id_articulo;
    }

    public void setId_articulo(int id_articulo) {
        this.id_articulo = id_articulo;
    }
    
    public String getClaveArticulo() {
        return claveArticulo;
    }

    public void setClaveArticulo(String claveArticulo) {
        this.claveArticulo = claveArticulo;
    }

    public int getAdicion() {
        return adicion;
    }

    public void setAdicion(int adicion) {
        this.adicion = adicion;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getNumSerie() {
        return numSerie;
    }

    public void setNumSerie(String numSerie) {
        this.numSerie = numSerie;
    }

    public String getEstatus() {
        return estatus;
    }

    public void setEstatus(String estatus) {
        this.estatus = estatus;
    }

    public String getResponsable() {
        return responsable;
    }

    public void setResponsable(String responsable) {
        this.responsable = responsable;
    }

    public int getCuenta() {
        return cuenta;
    }

    public void setCuenta(int cuenta) {
        this.cuenta = cuenta;
    }
}
