package org.model;

import java.sql.Date;

public class Prestamo {

    private int cve_prestamo;
    private String usuario;
    private String correo;
    private String rol;
    private String lugarDeUso;
    private String ProyectoApoyo;
    private Date Fecha_salida;
    private Date Fecha_vencimiento;
    private Date Fecha_devolucion;

    //Constructor
    public Prestamo(int cve_prestamo, String usuario, String correo, String rol, String lugarDeUso, String ProyectoApoyo, Date Fecha_salida, Date Fecha_vencimiento, Date Fecha_devolucion) {
        this.cve_prestamo = cve_prestamo;
        this.usuario = usuario;
        this.correo = correo;
        this.rol = rol;
        this.lugarDeUso = lugarDeUso;
        this.ProyectoApoyo = ProyectoApoyo;
        this.Fecha_salida = Fecha_salida;
        this.Fecha_vencimiento = Fecha_vencimiento;
        this.Fecha_devolucion = Fecha_devolucion;
    }
    
    //Constructor vacio
    public Prestamo() {
    }

    public int getCve_prestamo() {
        return cve_prestamo;
    }

    public void setCve_prestamo(int cve_prestamo) {
        this.cve_prestamo = cve_prestamo;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getLugarDeUso() {
        return lugarDeUso;
    }

    public void setLugarDeUso(String lugarDeUso) {
        this.lugarDeUso = lugarDeUso;
    }

    public String getProyectoApoyo() {
        return ProyectoApoyo;
    }

    public void setProyectoApoyo(String ProyectoApoyo) {
        this.ProyectoApoyo = ProyectoApoyo;
    }

    public Date getFecha_salida() {
        return Fecha_salida;
    }

    public void setFecha_salida(Date Fecha_salida) {
        this.Fecha_salida = Fecha_salida;
    }

    public Date getFecha_vencimiento() {
        return Fecha_vencimiento;
    }

    public void setFecha_vencimiento(Date Fecha_vencimiento) {
        this.Fecha_vencimiento = Fecha_vencimiento;
    }

    public Date getFecha_devolucion() {
        return Fecha_devolucion;
    }

    public void setFecha_devolucion(Date Fecha_devolucion) {
        this.Fecha_devolucion = Fecha_devolucion;
    }
   
}
