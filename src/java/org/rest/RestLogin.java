package org.rest;

import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import org.bd.ConexionMySQL;
import org.controller.ControllerLogin;
import org.model.Usuario;

/**
 *
 * @author checo
 */

@Path("login")
public class RestLogin {
    
    @Path("ingresar")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response ingresar(@FormParam("usuario") String usuario, @FormParam("password") String password) throws ClassNotFoundException {
        
        Usuario u = new Usuario(0, usuario, password, usuario, usuario, usuario, usuario, usuario, 0, usuario);
        String out;
        ControllerLogin objCL = new ControllerLogin();
        Usuario token = objCL.checkUser(u.getUsuario(), u.getPassword());
        if (token != null) {
            out = "{\"success\":\"Usuario Encontrado\",\"token\":\"" + token.getToken() + "\"}";
        } else {
            out = "{\"error\":\"Usuario no encontrado\"}";
        }
        System.out.println(out);
        return Response.ok(out).build();
    }
    
    @Path("cerrar")
    @POST
    public Response cerrarSesion(@FormParam("usuario") String usuario) throws ClassNotFoundException, SQLException {
        
            ConexionMySQL objConn = new ConexionMySQL();
            Connection conn = objConn.openConnection();

            String queryUpdate = "UPDATE Usuario SET token = NULL WHERE usuario = ?";
            PreparedStatement pstmt = conn.prepareStatement(queryUpdate);
            pstmt.setString(1, usuario);
            String out;
            int filasAfectadas = pstmt.executeUpdate();

            if (filasAfectadas > 0) {
                out = "{\"success\":\"Sesión cerrada\"}";
            } else {
                out ="{\"error\":\"Usuario no encontrado\"}";
            }
        return Response.ok(out).build();
    }
}
