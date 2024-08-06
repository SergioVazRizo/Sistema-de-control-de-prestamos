package org.controller;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import org.bd.ConexionMySQL;
import org.model.Articulo;

public class ControllerArticulo {

    public List<Articulo> getAllArticulos() throws SQLException, ClassNotFoundException {
        List<Articulo> articulosList = new ArrayList<>();
        String query = "SELECT * FROM Articulos";

        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = null;
        PreparedStatement pstm = null;
        ResultSet rs = null;

        try {
            conn = connMySQL.openConnection();
            pstm = conn.prepareStatement(query);
            rs = pstm.executeQuery();

            while (rs.next()) {
                int id_articulo = rs.getInt("id_articulo");
                String claveArticulo = rs.getString("clave_articulo");
                int adicion = rs.getInt("adision");
                String descripcion = rs.getString("Descripcion");
                String modelo = rs.getString("Modelo");
                String marca = rs.getString("Marca");
                String numSerie = rs.getString("Num_Serie");
                String estatus = rs.getString("Estatus");
                String responsable = rs.getString("Responsable");
                int cuenta = rs.getInt("Cuenta");

                Articulo articuloObj = new Articulo(id_articulo, claveArticulo, adicion, descripcion, modelo, marca, numSerie, estatus, responsable, cuenta);
                articulosList.add(articuloObj);
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

        return articulosList;
    }

    public List<Articulo> getAllArticulosPaginados(int inicio, int cantidad) throws SQLException, ClassNotFoundException {
        List<Articulo> articulosList = new ArrayList<>();
        String query = "SELECT * FROM Articulos LIMIT ? OFFSET ?";

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
                int id_articulo = rs.getInt("id_articulo");
                String claveArticulo = rs.getString("clave_articulo");
                int adicion = rs.getInt("adision");
                String descripcion = rs.getString("Descripcion");
                String modelo = rs.getString("Modelo");
                String marca = rs.getString("Marca");
                String numSerie = rs.getString("Num_Serie");
                String estatus = rs.getString("Estatus");
                String responsable = rs.getString("Responsable");
                int cuenta = rs.getInt("Cuenta");

                Articulo articuloObj = new Articulo( id_articulo, claveArticulo, adicion, descripcion, modelo, marca, numSerie, estatus, responsable, cuenta);
                articulosList.add(articuloObj);
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

        return articulosList;
    }

    public List<Articulo> buscarArticulo(String query) throws SQLException, ClassNotFoundException {
        List<Articulo> articulosList = new ArrayList<>();
        String sql = "SELECT * FROM Articulos WHERE clave_articulo LIKE ?";
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = connMySQL.openConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, "%" + query + "%");
            rs = pstmt.executeQuery();

            while (rs.next()) {
                Articulo articulo = new Articulo(
                        rs.getInt("id_articulo"),
                        rs.getString("clave_articulo"),
                        rs.getInt("adision"), 
                        rs.getString("Descripcion"),
                        rs.getString("Modelo"),
                        rs.getString("Marca"),
                        rs.getString("Num_Serie"),
                        rs.getString("Estatus"),
                        rs.getString("Responsable"),
                        rs.getInt("Cuenta"));
                articulosList.add(articulo);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            // Maneja el cierre de recursos
        }
        return articulosList;
    }
    
    public boolean agregarArticulo(Articulo articulo) throws ClassNotFoundException {
        String query = "INSERT INTO Articulos (clave_articulo, adision, Descripcion, Modelo, Marca, Num_Serie, Estatus, Responsable, Cuenta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        ConexionMySQL objConn = new ConexionMySQL();
        try {
            Connection conn = objConn.openConnection();
            PreparedStatement pstmt = conn.prepareStatement(query);
            pstmt.setString(1, articulo.getClaveArticulo());
            pstmt.setInt(2, articulo.getAdicion());
            pstmt.setString(3, articulo.getDescripcion());
            pstmt.setString(4, articulo.getModelo());
            pstmt.setString(5, articulo.getMarca());
            pstmt.setString(6, articulo.getNumSerie());
            pstmt.setString(7, articulo.getEstatus());
            pstmt.setString(8, articulo.getResponsable());
            pstmt.setInt(9, articulo.getCuenta());
            int filasAfectadas = pstmt.executeUpdate();
            return filasAfectadas > 0;
        } catch (SQLException ex) {
            System.out.println(ex);
            return false;
        }
    }

    public boolean editarArticulo(Articulo articulo) throws ClassNotFoundException {
        String query = "UPDATE Articulos SET clave_articulo = ?, adision = ?, Descripcion = ?, Modelo = ?, Marca = ?, Num_Serie = ?, Estatus = ?, Responsable = ?, Cuenta = ? WHERE id_articulo = ?";
        ConexionMySQL objConn = new ConexionMySQL();
        try {
            Connection conn = objConn.openConnection();
            PreparedStatement pstmt = conn.prepareStatement(query);
            pstmt.setString(1, articulo.getClaveArticulo());
            pstmt.setInt(2, articulo.getAdicion());
            pstmt.setString(3, articulo.getDescripcion());
            pstmt.setString(4, articulo.getModelo());
            pstmt.setString(5, articulo.getMarca());
            pstmt.setString(6, articulo.getNumSerie());
            pstmt.setString(7, articulo.getEstatus());
            pstmt.setString(8, articulo.getResponsable());
            pstmt.setInt(9, articulo.getCuenta());
            pstmt.setInt(10, articulo.getId_articulo());
            int filasAfectadas = pstmt.executeUpdate();
            return filasAfectadas > 0;
        } catch (SQLException ex) {
            System.out.println(ex);
            return false;
        }
    }


}
