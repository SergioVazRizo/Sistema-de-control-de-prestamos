package org.controller;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import org.apache.commons.codec.digest.DigestUtils;
import org.bd.ConexionMySQL;
import org.model.Usuario;

/**
 *
 * @author checo
 */

public class ControllerLogin {
    
    public Usuario checkUser(String usuario, String password) throws ClassNotFoundException {
        String querySelect = "SELECT * FROM Usuario WHERE usuario = ? AND password = ?";
        String querySet = "UPDATE Usuario SET token = ? WHERE usuario = ? AND password = ?";

        ConexionMySQL objConn = new ConexionMySQL();
        try {
            Connection conn = objConn.openConnection();
            PreparedStatement pstmt = conn.prepareStatement(querySelect);

            pstmt.setString(1, usuario);
            pstmt.setString(2, password);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                String tokenizer = generarToken(usuario);
                PreparedStatement updateStatement = conn.prepareStatement(querySet);
                int idUsuario = rs.getInt("cve_usuario"); 
                String usuarioName = rs.getString("usuario");
                String passwordDb = rs.getString("password");
                updateStatement.setString(1, tokenizer);
                updateStatement.setString(2, usuario);
                updateStatement.setString(3, password);
                updateStatement.executeUpdate();

                return new Usuario(idUsuario, usuario, password, tokenizer, usuario, usuario, usuario, usuario, idUsuario, usuario);

            }
        } catch (SQLException ex) {
            System.out.println(ex);
        }
        return null;
    }
    
    public String generarToken(String nombre) {
        String token = "";
        Timestamp myDate = new Timestamp(System.currentTimeMillis());
        String fecha = new SimpleDateFormat("dd-MM-yyyy:ss").format(myDate);
        token = nombre + "." + "USER" + "." + fecha;
        String tokenizer = DigestUtils.md5Hex(token);
        return tokenizer;
    }
    
}
