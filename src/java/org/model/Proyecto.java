/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.model;

/**
 *
 * @author checo
 */

public class Proyecto {
    private int cve_proyecto;
    private String nombre;
    
    // Constructor
    public Proyecto(int cve_proyecto, String nombre) {
        this.cve_proyecto = cve_proyecto;
        this.nombre = nombre;
    }
    
    // Getters y Setters

    public int getCve_proyecto() {
        return cve_proyecto;
    }

    public void setCve_proyecto(int cve_proyecto) {
        this.cve_proyecto = cve_proyecto;
    }
    
    
    public String getNombre() {
        return nombre;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}

