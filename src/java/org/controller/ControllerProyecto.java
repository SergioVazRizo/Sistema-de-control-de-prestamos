package org.controller;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import org.bd.ConexionMySQL;
import org.model.Proyecto;

public class ControllerProyecto {
    
    public List<Proyecto> getAllProyectos() throws SQLException, ClassNotFoundException {
        List<Proyecto> proyectosList = new ArrayList<>();
        String query = "SELECT * FROM Proyectos";

        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = null;
        PreparedStatement pstm = null;
        ResultSet rs = null;

        try {
            conn = connMySQL.openConnection();
            pstm = conn.prepareStatement(query);
            rs = pstm.executeQuery();

            while (rs.next()) {
                int cve_proyecto = rs.getInt("cve_proyecto");
                String nombre = rs.getString("nombre");

                Proyecto proyectoObj = new Proyecto(cve_proyecto, nombre);
                proyectosList.add(proyectoObj);
            }
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
            connMySQL.closeConnection();
        }

        return proyectosList;
    }

    public List<Proyecto> getAllProyectosPaginados(int inicio, int cantidad) throws SQLException, ClassNotFoundException {
        List<Proyecto> proyectosList = new ArrayList<>();
        String query = "SELECT * FROM Proyectos LIMIT ? OFFSET ?";

        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = null;
        PreparedStatement pstm = null;
        ResultSet rs = null;

        try {
            conn = connMySQL.openConnection();
            pstm = conn.prepareStatement(query);
            pstm.setInt(1, cantidad);
            pstm.setInt(2, inicio);
            rs = pstm.executeQuery();

            while (rs.next()) {
                int cve_proyecto = rs.getInt("cve_proyecto");
                String nombre = rs.getString("nombre");

                Proyecto proyectoObj = new Proyecto(cve_proyecto, nombre);
                proyectosList.add(proyectoObj);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                if (rs != null) {
                    rs.close();
                }
                if (pstm != null) {
                    pstm.close();
                }
                connMySQL.closeConnection();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        return proyectosList;
    }
    
    public List<Proyecto> buscarProyecto(String query) throws SQLException, ClassNotFoundException {
        List<Proyecto> proyectosList = new ArrayList<>();
        String sql = "SELECT * FROM Proyectos WHERE cve_proyecto LIKE ? OR nombre LIKE ?";
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = connMySQL.openConnection();
            pstmt = conn.prepareStatement(sql);
            for (int i = 1; i <= 2; i++) {
                pstmt.setString(i, "%" + query + "%");
            }
            rs = pstmt.executeQuery();

            while (rs.next()) {
                Proyecto proyecto = new Proyecto(
                    rs.getInt("cve_proyecto"),
                    rs.getString("nombre")
                );
                proyectosList.add(proyecto);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            // Maneja el cierre de recursos
        }

        return proyectosList;
    }

    public boolean agregarProyecto(Proyecto proyecto) throws ClassNotFoundException {
        String query = "INSERT INTO Proyectos (nombre) VALUES (?)";
        ConexionMySQL objConn = new ConexionMySQL();
        try {
            Connection conn = objConn.openConnection();
            PreparedStatement pstmt = conn.prepareStatement(query);
            pstmt.setString(1, proyecto.getNombre());
            int filasAfectadas = pstmt.executeUpdate();
            return filasAfectadas > 0;
        } catch (SQLException ex) {
            System.out.println(ex);
            return false;
        }
    }

    public boolean editarProyecto(Proyecto proyecto) throws ClassNotFoundException {
        String query = "UPDATE Proyectos SET nombre = ? WHERE cve_proyecto = ?";
        ConexionMySQL objConn = new ConexionMySQL();
        try {
            Connection conn = objConn.openConnection();
            PreparedStatement pstmt = conn.prepareStatement(query);
            pstmt.setString(1, proyecto.getNombre());
            pstmt.setInt(2, proyecto.getCve_proyecto());
            int filasAfectadas = pstmt.executeUpdate();
            return filasAfectadas > 0;
        } catch (SQLException ex) {
            System.out.println(ex);
            return false;
        }
    }

}
