package org.controller;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import org.bd.ConexionMySQL;
import org.model.Articulo;
import org.model.Prestamo;
import java.sql.Statement;
import java.time.LocalDate;

public class ControllerPrestamo {

    //Funcion para las notificaciones automaticas
    public List<Prestamo> getPrestamosPorVencer() throws SQLException, ClassNotFoundException {
        List<Prestamo> prestamosList = new ArrayList<>();
        String query = "SELECT * FROM Prestamos WHERE Fecha_vencimiento = CURDATE() + INTERVAL 1 DAY";

        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = null;
        PreparedStatement pstm = null;
        ResultSet rs = null;

        try {
            conn = connMySQL.openConnection();
            pstm = conn.prepareStatement(query);
            rs = pstm.executeQuery();

            while (rs.next()) {
                int cve_prestamo = rs.getInt("cve_prestamo");
                String usuario = rs.getString("usuario");
                String correo = rs.getString("correo");
                String rol = rs.getString("rol");
                String lugarDeUso = rs.getString("lugarDeUso");
                String ProyectoApoyo = rs.getString("ProyectoApoyo");
                Date fechaSalida = rs.getDate("Fecha_salida");
                Date fechaVencimiento = rs.getDate("Fecha_vencimiento");
                Date fechaDevolucion = rs.getDate("Fecha_devolucion");

                Prestamo prestamo = new Prestamo(cve_prestamo, usuario, correo, rol, lugarDeUso, ProyectoApoyo, fechaSalida, fechaVencimiento, fechaDevolucion);
                prestamosList.add(prestamo);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            throw e;
        } finally {
            try {
                if (rs != null) {
                    rs.close();
                }
                if (pstm != null) {
                    pstm.close();
                }
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        return prestamosList;
    }

    //Insertar datos del prestamo
    public int insertarPrestamo(Prestamo prestamo) throws ClassNotFoundException {
        String query = "INSERT INTO Prestamos (usuario, correo, rol, lugarDeUso, ProyectoApoyo, Fecha_salida, Fecha_vencimiento, Fecha_devolucion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        ConexionMySQL objConn = new ConexionMySQL();
        try {
            Connection conn = objConn.openConnection();
            PreparedStatement pstmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1, prestamo.getUsuario());
            pstmt.setString(2, prestamo.getCorreo());
            pstmt.setString(3, prestamo.getRol());
            pstmt.setString(4, prestamo.getLugarDeUso());
            pstmt.setString(5, prestamo.getProyectoApoyo());
            pstmt.setDate(6, prestamo.getFecha_salida());
            pstmt.setDate(7, prestamo.getFecha_vencimiento());
            pstmt.setDate(8, prestamo.getFecha_devolucion());

            int filasAfectadas = pstmt.executeUpdate();
            if (filasAfectadas > 0) {
                ResultSet generatedKeys = pstmt.getGeneratedKeys();
                if (generatedKeys.next()) {
                    return generatedKeys.getInt(1);
                }
            }
            return -1;
        } catch (SQLException ex) {
            System.out.println(ex);
            return -1;
        }
    }

    //Insertar articulos del prestamo
    public boolean insertarArticulosPrestamo(int cve_prestamo, List<Articulo> articulos) throws ClassNotFoundException {
        String query = "INSERT INTO PrestamoArticulos (cve_prestamo, id_articulo, DescripcionArticulo, cve_articulo) VALUES (?, ?, ?, ?)";
        ConexionMySQL objConn = new ConexionMySQL();
        try {
            Connection conn = objConn.openConnection();
            PreparedStatement pstmt = conn.prepareStatement(query);
            for (Articulo articulo : articulos) {
                pstmt.setInt(1, cve_prestamo);
                pstmt.setInt(2, articulo.getId_articulo());
                pstmt.setString(3, articulo.getDescripcion());
                pstmt.setString(4, articulo.getClaveArticulo());
                pstmt.addBatch();
            }
            int[] filasAfectadas = pstmt.executeBatch();
            return filasAfectadas.length == articulos.size();
        } catch (SQLException ex) {
            System.out.println(ex);
            return false;
        }
    }

    //Disponiblidad de los articulos
    public boolean verificarDisponibilidadArticulos(List<Articulo> articulos) throws ClassNotFoundException {
        String query = "SELECT adision, Estatus FROM Articulos WHERE id_articulo = ?";
        ConexionMySQL objConn = new ConexionMySQL();
        try {
            Connection conn = objConn.openConnection();
            PreparedStatement pstmt = conn.prepareStatement(query);
            for (Articulo articulo : articulos) {
                pstmt.setInt(1, articulo.getId_articulo());
                ResultSet rs = pstmt.executeQuery();
                if (rs.next()) {
                    int adision = rs.getInt("adision");
                    String estatus = rs.getString("Estatus");
                    if (adision <= 0 || !"Disponible".equals(estatus)) {
                        return false;
                    }
                } else {
                    return false;
                }
            }
            return true;
        } catch (SQLException ex) {
            System.out.println(ex);
            return false;
        }
    }

    //Actualizar el estatus y adision de los articulos 
    public boolean actualizarAdisionEstatusArticulos(List<Articulo> articulos) throws ClassNotFoundException {
        String query = "UPDATE Articulos SET adision = adision - 1, Estatus = CASE WHEN adision - 1 <= 0 THEN 'No Disponible' ELSE Estatus END WHERE id_articulo = ?";
        ConexionMySQL objConn = new ConexionMySQL();
        try {
            Connection conn = objConn.openConnection();
            PreparedStatement pstmt = conn.prepareStatement(query);
            for (Articulo articulo : articulos) {
                pstmt.setInt(1, articulo.getId_articulo());
                pstmt.addBatch();
            }
            int[] filasAfectadas = pstmt.executeBatch();

            // Verificar si la actualización fue exitosa
            boolean actualizacionExitosa = true;
            for (int filas : filasAfectadas) {
                if (filas != 1) { // Se espera que se afecte una fila por cada artículo
                    actualizacionExitosa = false;
                    break;
                }
            }
            return actualizacionExitosa;

        } catch (SQLException ex) {
            System.out.println("Error al actualizar adisión y estatus de los artículos: " + ex.getMessage());
            return false;
        }
    }

    //GetAll de los prestamos buacados por clave
    public Prestamo obtenerPrestamo(int clavePrestamo) throws ClassNotFoundException {
        String query = "SELECT * FROM Prestamos WHERE cve_prestamo = ?";
        ConexionMySQL objConn = new ConexionMySQL();
        try {
            Connection conn = objConn.openConnection();
            PreparedStatement pstmt = conn.prepareStatement(query);
            pstmt.setInt(1, clavePrestamo);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                Prestamo prestamo = new Prestamo();
                prestamo.setCve_prestamo(rs.getInt("cve_prestamo"));
                prestamo.setUsuario(rs.getString("usuario"));
                prestamo.setCorreo(rs.getString("correo"));
                prestamo.setRol(rs.getString("rol"));
                prestamo.setLugarDeUso(rs.getString("lugarDeUso"));
                prestamo.setProyectoApoyo(rs.getString("ProyectoApoyo"));
                prestamo.setFecha_salida(rs.getDate("Fecha_salida"));
                prestamo.setFecha_vencimiento(rs.getDate("Fecha_vencimiento"));
                prestamo.setFecha_devolucion(rs.getDate("Fecha_devolucion"));
                return prestamo;
            }
            return null;
        } catch (SQLException ex) {
            System.out.println(ex);
            return null;
        }
    }

    //GetAll de los articulos de los prestamos buscados por la clave del prestamo
    public List<Articulo> obtenerArticulosPrestamo(int cve_prestamo) throws ClassNotFoundException {
        String query = "SELECT id_articulo, DescripcionArticulo, cve_articulo FROM PrestamoArticulos WHERE cve_prestamo = ?";
        ConexionMySQL objConn = new ConexionMySQL();
        List<Articulo> articulos = new ArrayList<>();
        try {
            Connection conn = objConn.openConnection();
            PreparedStatement pstmt = conn.prepareStatement(query);
            pstmt.setInt(1, cve_prestamo);
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                Articulo articulo = new Articulo();
                articulo.setId_articulo(rs.getInt("id_articulo"));
                articulo.setDescripcion(rs.getString("DescripcionArticulo"));
                articulo.setClaveArticulo(rs.getString("cve_articulo"));
                articulos.add(articulo);
            }
        } catch (SQLException ex) {
            System.out.println(ex);
        }
        return articulos;
    }

    //Funcion para realizar la devolucion de un prestamo
    public boolean realizarDevolucion(int clavePrestamo) throws ClassNotFoundException {
        String updatePrestamoQuery = "UPDATE Prestamos SET Fecha_devolucion = NOW() WHERE cve_prestamo = ? AND Fecha_devolucion IS NULL";
        String updateArticuloQuery = "UPDATE Articulos SET adision = adision + 1, Estatus = CASE WHEN adision + 1 > 0 THEN 'Disponible' ELSE Estatus END WHERE id_articulo = ?";
        ConexionMySQL objConn = new ConexionMySQL();
        try {
            Connection conn = objConn.openConnection();
            conn.setAutoCommit(false);

            // Actualizar fecha de devolución en Prestamos
            PreparedStatement pstmtPrestamo = conn.prepareStatement(updatePrestamoQuery);
            pstmtPrestamo.setInt(1, clavePrestamo);
            int prestamoActualizado = pstmtPrestamo.executeUpdate();
            if (prestamoActualizado == 0) {
                conn.rollback();
                return false;
            }

            // Obtener los artículos del préstamo
            List<Articulo> articulos = obtenerArticulosPrestamo(clavePrestamo);

            // Actualizar adision y estatus de artículos
            PreparedStatement pstmtArticulo = conn.prepareStatement(updateArticuloQuery);
            for (Articulo articulo : articulos) {
                pstmtArticulo.setInt(1, articulo.getId_articulo());
                pstmtArticulo.addBatch();
            }
            int[] articulosActualizados = pstmtArticulo.executeBatch();
            conn.commit();
            return articulosActualizados.length == articulos.size();
        } catch (SQLException ex) {
            System.out.println(ex);
            return false;
        }
    }

    //Funcion para realizar la renovacion de un prestamo
    public boolean renovarPrestamo(int clavePrestamo) throws ClassNotFoundException {
        String query = "UPDATE Prestamos SET Fecha_salida = ?, Fecha_vencimiento = ? WHERE cve_prestamo = ? AND Fecha_devolucion IS NULL";
        ConexionMySQL objConn = new ConexionMySQL();
        try {
            Connection conn = objConn.openConnection();
            PreparedStatement pstmt = conn.prepareStatement(query);

            LocalDate today = LocalDate.now();
            LocalDate dueDate = today.plusDays(30);

            pstmt.setDate(1, Date.valueOf(today));
            pstmt.setDate(2, Date.valueOf(dueDate));
            pstmt.setInt(3, clavePrestamo);

            int filasAfectadas = pstmt.executeUpdate();
            return filasAfectadas > 0;
        } catch (SQLException ex) {
            System.out.println(ex);
            return false;
        }
    }

    //Funcion para modificar los datos de un prestamo
    public boolean modificarPrestamo(Prestamo prestamo) throws ClassNotFoundException {
        String query = "UPDATE Prestamos SET usuario = ?, correo = ?, rol = ?, lugarDeUso = ?, ProyectoApoyo = ?, Fecha_salida = ?, Fecha_vencimiento = ? WHERE cve_prestamo = ?";
        ConexionMySQL objConn = new ConexionMySQL();
        try {
            Connection conn = objConn.openConnection();
            PreparedStatement pstmt = conn.prepareStatement(query);
            pstmt.setString(1, prestamo.getUsuario());
            pstmt.setString(2, prestamo.getCorreo());
            pstmt.setString(3, prestamo.getRol());
            pstmt.setString(4, prestamo.getLugarDeUso());
            pstmt.setString(5, prestamo.getProyectoApoyo());
            pstmt.setDate(6, prestamo.getFecha_salida());
            pstmt.setDate(7, prestamo.getFecha_vencimiento());
            pstmt.setInt(8, prestamo.getCve_prestamo());

            int filasAfectadas = pstmt.executeUpdate();
            return filasAfectadas > 0;
        } catch (SQLException ex) {
            System.out.println(ex);
            return false;
        }
    }

    //Funcion para verificar si un articulo ya cuenta con fecha de devolucion
    public boolean verificarFechaDevolucion(int cve_prestamo) throws ClassNotFoundException {
        String query = "SELECT Fecha_devolucion FROM Prestamos WHERE cve_prestamo = ?";
        ConexionMySQL objConn = new ConexionMySQL();
        try {
            Connection conn = objConn.openConnection();
            PreparedStatement pstmt = conn.prepareStatement(query);
            pstmt.setInt(1, cve_prestamo);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                Date fechaDevolucion = rs.getDate("Fecha_devolucion");
                return fechaDevolucion != null;
            }
        } catch (SQLException ex) {
            System.out.println(ex);
        }
        return false;
    }

    public boolean eliminarArticuloPrestamo(int idArticulo, String claveArticulo) throws ClassNotFoundException {
        String deleteArticuloPrestamoQuery = "DELETE FROM PrestamoArticulos WHERE id_articulo = ? AND cve_articulo = ?";
        String updateArticuloQuery = "UPDATE Articulos SET adision = adision + 1, Estatus = CASE WHEN adision + 1 > 0 THEN 'Disponible' ELSE Estatus END WHERE id_articulo = ?";

        ConexionMySQL objConn = new ConexionMySQL();
        try (Connection conn = objConn.openConnection()) {
            conn.setAutoCommit(false);

            // Eliminar artículo del préstamo
            try (PreparedStatement pstmtDelete = conn.prepareStatement(deleteArticuloPrestamoQuery)) {
                pstmtDelete.setInt(1, idArticulo);
                pstmtDelete.setString(2, claveArticulo);

                int rowsDeleted = pstmtDelete.executeUpdate();
                if (rowsDeleted == 0) {
                    System.out.println("No se encontró el artículo en el préstamo.");
                    conn.rollback();
                    return false;
                }
            }

            // Actualizar adision y estatus del artículo
            try (PreparedStatement pstmtUpdate = conn.prepareStatement(updateArticuloQuery)) {
                pstmtUpdate.setInt(1, idArticulo);
                pstmtUpdate.executeUpdate();
            }

            conn.commit();
            return true;

        } catch (SQLException ex) {
            System.out.println("Error SQL: " + ex.getMessage());
            return false;
        }
    }

}
