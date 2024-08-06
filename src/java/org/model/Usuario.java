/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.model;

/**
 *
 * @author checo
 */
public class Usuario {

    private int cve_usuario;
    private String usuario;
    private String password;
    private String token;
    private String a_paterno;
    private String a_materno;
    private String nombre;
    private String rol;
    private int extension;
    private String email;

    // Constructor
    public Usuario(int cve_usuario, String usuario, String password, String token, String a_paterno, String a_materno,
            String nombre, String rol, int extension, String email) {
        this.cve_usuario = cve_usuario;
        this.usuario = usuario;
        this.password = password;
        this.token = token;
        this.a_paterno = a_paterno;
        this.a_materno = a_materno;
        this.nombre = nombre;
        this.rol = rol;
        this.extension = extension;
        this.email = email;
    }

    // Getters y Setters
    public int getCve_usuario() {
        return cve_usuario;
    }

    public void setCve_usuario(int cve_usuario) {
        this.cve_usuario = cve_usuario;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getA_paterno() {
        return a_paterno;
    }

    public void setA_paterno(String a_paterno) {
        this.a_paterno = a_paterno;
    }

    public String getA_materno() {
        return a_materno;
    }

    public void setA_materno(String a_materno) {
        this.a_materno = a_materno;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public int getExtension() {
        return extension;
    }

    public void setExtension(int extension) {
        this.extension = extension;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    // Método toString para representación de texto del objeto
    @Override
    public String toString() {
        return "Usuario{"
                + "cve_usuario=" + cve_usuario
                + ", usuario='" + usuario + '\''
                + ", password='" + password + '\''
                + ", token='" + token + '\''
                + ", a_paterno='" + a_paterno + '\''
                + ", a_materno='" + a_materno + '\''
                + ", nombre='" + nombre + '\''
                + ", rol='" + rol + '\''
                + ", extension=" + extension
                + ", email='" + email + '\''
                + '}';
    }
}
