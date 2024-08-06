package org.controller;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import org.bd.ConexionMySQL;
import org.model.Usuario;

public class ControllerUsuario {

    public List<Usuario> getAllUsuarios() throws SQLException, ClassNotFoundException {
        List<Usuario> usuariosList = new ArrayList<>();
        String query = "SELECT * FROM Usuario";

        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = null;
        PreparedStatement pstm = null;
        ResultSet rs = null;

        try {
            conn = connMySQL.openConnection();
            pstm = conn.prepareStatement(query);
            rs = pstm.executeQuery();

            while (rs.next()) {
                int cve_usuario = rs.getInt("cve_usuario");
                String usuario = rs.getString("usuario");
                String password = rs.getString("password");
                String token = rs.getString("token");
                String a_paterno = rs.getString("a_paterno");
                String a_materno = rs.getString("a_materno");
                String nombre = rs.getString("nombre");
                String rol = rs.getString("rol");
                int extension = rs.getInt("extension");
                String email = rs.getString("email");

                Usuario usuarioObj = new Usuario(cve_usuario, usuario, password, token, a_paterno, a_materno, nombre, rol, extension, email);
                usuariosList.add(usuarioObj);
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

        return usuariosList;
    }

    public List<Usuario> getAllUsuariosPaginados(int inicio, int cantidad) throws SQLException, ClassNotFoundException {
        List<Usuario> usuariosList = new ArrayList<>();
        String query = "SELECT * FROM Usuario LIMIT ? OFFSET ?";

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
                int cve_usuario = rs.getInt("cve_usuario");
                String usuario = rs.getString("usuario");
                String password = rs.getString("password");
                String token = rs.getString("token");
                String a_paterno = rs.getString("a_paterno");
                String a_materno = rs.getString("a_materno");
                String nombre = rs.getString("nombre");
                String rol = rs.getString("rol");
                int extension = rs.getInt("extension");
                String email = rs.getString("email");

                Usuario usuarioObj = new Usuario(cve_usuario, usuario, password, token, a_paterno, a_materno, nombre, rol, extension, email);
                usuariosList.add(usuarioObj);
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

        return usuariosList;
    }

    public List<Usuario> buscarUsuario(String query) throws SQLException, ClassNotFoundException {
        List<Usuario> usuariosList = new ArrayList<>();
        String sql = "SELECT * FROM Usuario WHERE cve_usuario LIKE ? OR usuario LIKE ? OR password LIKE ? OR a_paterno LIKE ? OR a_materno LIKE ? OR nombre LIKE ? OR rol LIKE ? OR extension LIKE ? OR email LIKE ?";
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = connMySQL.openConnection();
            pstmt = conn.prepareStatement(sql);
            for (int i = 1; i <= 9; i++) {
                pstmt.setString(i, "%" + query + "%");
            }
            rs = pstmt.executeQuery();

            while (rs.next()) {
                Usuario usuario = new Usuario(
                    rs.getInt("cve_usuario"),
                    rs.getString("usuario"),
                    rs.getString("password"),
                    rs.getString("token"),
                    rs.getString("a_paterno"),
                    rs.getString("a_materno"),
                    rs.getString("nombre"),
                    rs.getString("rol"),
                    rs.getInt("extension"),
                    rs.getString("email")
                );
                usuariosList.add(usuario);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            // Maneja el cierre de recursos
        }

        return usuariosList;
    }

    public boolean agregarUsuario(Usuario usuario) throws ClassNotFoundException {
        String query = "INSERT INTO Usuario (usuario, password, token, a_paterno, a_materno, nombre, rol, extension, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        ConexionMySQL objConn = new ConexionMySQL();
        try {
            Connection conn = objConn.openConnection();
            PreparedStatement pstmt = conn.prepareStatement(query);
            pstmt.setString(1, usuario.getUsuario());
            pstmt.setString(2, usuario.getPassword());
            pstmt.setString(3, usuario.getToken());
            pstmt.setString(4, usuario.getA_paterno());
            pstmt.setString(5, usuario.getA_materno());
            pstmt.setString(6, usuario.getNombre());
            pstmt.setString(7, usuario.getRol());
            pstmt.setInt(8, usuario.getExtension());
            pstmt.setString(9, usuario.getEmail());
            int filasAfectadas = pstmt.executeUpdate();
            return filasAfectadas > 0;
        } catch (SQLException ex) {
            System.out.println(ex);
            return false;
        }
    }

    public boolean editarUsuario(Usuario usuario) throws ClassNotFoundException {
        String query = "UPDATE Usuario SET usuario = ?, password = ?, token = ?, a_paterno = ?, a_materno = ?, nombre = ?, rol = ?, extension = ?, email = ? WHERE cve_usuario = ?";
        ConexionMySQL objConn = new ConexionMySQL();
        try {
            Connection conn = objConn.openConnection();
            PreparedStatement pstmt = conn.prepareStatement(query);
            pstmt.setString(1, usuario.getUsuario());
            pstmt.setString(2, usuario.getPassword());
            pstmt.setString(3, usuario.getToken());
            pstmt.setString(4, usuario.getA_paterno());
            pstmt.setString(5, usuario.getA_materno());
            pstmt.setString(6, usuario.getNombre());
            pstmt.setString(7, usuario.getRol());
            pstmt.setInt(8, usuario.getExtension());
            pstmt.setString(9, usuario.getEmail());
            pstmt.setInt(10, usuario.getCve_usuario());
            int filasAfectadas = pstmt.executeUpdate();
            return filasAfectadas > 0;
        } catch (SQLException ex) {
            System.out.println(ex);
            return false;
        }
    }
    



}
