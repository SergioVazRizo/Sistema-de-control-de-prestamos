package org.controller;

import java.sql.Connection;  
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import org.bd.ConexionMySQL;
import org.model.Lugar;

public class ControllerLugar {

    public List<Lugar> getAllLugares() throws SQLException, ClassNotFoundException {
        List<Lugar> lugaresList = new ArrayList<>();
        String query = "SELECT * FROM Lugares";

        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = null;
        PreparedStatement pstm = null;
        ResultSet rs = null;

        try {
            conn = connMySQL.openConnection();
            pstm = conn.prepareStatement(query);
            rs = pstm.executeQuery();

            while (rs.next()) {
                int cveLugar = rs.getInt("cve_lugar");
                String ubicacion = rs.getString("Ubicacion");
                String nombre = rs.getString("Nombre");

                Lugar lugarObj = new Lugar(cveLugar, ubicacion, nombre);
                lugaresList.add(lugarObj);
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
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        return lugaresList;
    }

    public List<Lugar> getAllLugaresPaginados(int inicio, int cantidad) throws SQLException, ClassNotFoundException {
        List<Lugar> lugaresList = new ArrayList<>();
        String query = "SELECT * FROM Lugares LIMIT ? OFFSET ?";

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
                int cveLugar = rs.getInt("cve_lugar");
                String ubicacion = rs.getString("Ubicacion");
                String nombre = rs.getString("Nombre");

                Lugar lugarObj = new Lugar(cveLugar, ubicacion, nombre);
                lugaresList.add(lugarObj);
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
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        return lugaresList;
    }

    public List<Lugar> buscarLugar(String query) throws SQLException, ClassNotFoundException {
        List<Lugar> lugaresList = new ArrayList<>();
        String sql = "SELECT * FROM Lugares WHERE cve_lugar LIKE ? OR Ubicacion LIKE ? OR Nombre LIKE ?";
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = connMySQL.openConnection();
            pstmt = conn.prepareStatement(sql);
            for (int i = 1; i <= 3; i++) {
                pstmt.setString(i, "%" + query + "%");
            }
            rs = pstmt.executeQuery();

            while (rs.next()) {
                Lugar lugar = new Lugar(
                    rs.getInt("cve_lugar"),
                    rs.getString("Ubicacion"),
                    rs.getString("Nombre")
                );
                lugaresList.add(lugar);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                if (rs != null) {
                    rs.close();
                }
                if (pstmt != null) {
                    pstmt.close();
                }
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        return lugaresList;
    }

    public boolean agregarLugar(Lugar lugar) throws ClassNotFoundException {
        String query = "INSERT INTO Lugares (Ubicacion, Nombre) VALUES (?, ?)";
        ConexionMySQL objConn = new ConexionMySQL();
        try {
            Connection conn = objConn.openConnection();
            PreparedStatement pstmt = conn.prepareStatement(query);
            pstmt.setString(1, lugar.getUbicacion());
            pstmt.setString(2, lugar.getNombre());
            int filasAfectadas = pstmt.executeUpdate();
            return filasAfectadas > 0;
        } catch (SQLException ex) {
            System.out.println(ex);
            return false;
        } finally {
            try {
                objConn.closeConnection();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
    
    public boolean editarLugar(Lugar lugar) throws ClassNotFoundException {
        String query = "UPDATE Lugares SET Ubicacion = ?, Nombre = ? WHERE cve_lugar = ?";
        ConexionMySQL objConn = new ConexionMySQL();
        try {
            Connection conn = objConn.openConnection();
            PreparedStatement pstmt = conn.prepareStatement(query);
            pstmt.setString(1, lugar.getUbicacion());
            pstmt.setString(2, lugar.getNombre());
            pstmt.setInt(3, lugar.getCveLugar());
            int filasAfectadas = pstmt.executeUpdate();
            return filasAfectadas > 0;
        } catch (SQLException ex) {
            System.out.println(ex);
            return false;
        } finally {
            try {
                objConn.closeConnection();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

}
