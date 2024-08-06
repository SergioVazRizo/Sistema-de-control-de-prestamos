package org.rest;

import com.google.gson.Gson;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.SQLException;
import java.util.List;
import org.controller.ControllerUsuario;
import org.model.Usuario;

@Path("usuario")
public class RestUsuario {

    @Path("getAllUsuarios")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public Response getAllUsuarios() {
        String out = null;
        List<Usuario> usuarios = null;
        ControllerUsuario cu = new ControllerUsuario();
        try {
            usuarios = cu.getAllUsuarios(); 
            out = new Gson().toJson(usuarios);
        } catch (ClassNotFoundException | SQLException e) {
            out = "{\"error\":\"Ocurrió un error. Intente más tarde.\"}";
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).type(MediaType.APPLICATION_JSON).entity(out).build();
        }
        return Response.status(Response.Status.OK).type(MediaType.APPLICATION_JSON).entity(out).build();
    }

    @Path("getAllUsuariosPaginados")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public Response getAllUsuariosPaginados(@QueryParam("inicio") int inicio, @QueryParam("cantidad") int cantidad) {
        String out = null;
        List<Usuario> usuarios = null;
        ControllerUsuario cu = new ControllerUsuario();
        try {
            usuarios = cu.getAllUsuariosPaginados(inicio, cantidad); // Método modificado para paginación
            out = new Gson().toJson(usuarios);
        } catch (ClassNotFoundException | SQLException e) {
            out = "{\"error\":\"Ocurrió un error. Intente más tarde.\"}";
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).type(MediaType.APPLICATION_JSON).entity(out).build();
        }
        return Response.status(Response.Status.OK).type(MediaType.APPLICATION_JSON).entity(out).build();
    }

    @Path("agregarUsuario")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response agregarUsuario(@FormParam("usuario") String usuario,
            @FormParam("password") String password,
            @FormParam("token") String token,
            @FormParam("a_paterno") String a_paterno,
            @FormParam("a_materno") String a_materno,
            @FormParam("nombre") String nombre,
            @FormParam("rol") String rol,
            @FormParam("extension") int extension,
            @FormParam("email") String email) {
        String out;
        ControllerUsuario cu = new ControllerUsuario();
        try {
            Usuario nuevoUsuario = new Usuario(0, usuario, password, token, a_paterno, a_materno, nombre, rol, extension, email);
            boolean resultado = cu.agregarUsuario(nuevoUsuario);
            if (resultado) {
                out = "{\"success\":\"Usuario agregado correctamente\"}";
            } else {
                out = "{\"error\":\"No se pudo agregar el usuario\"}";
            }
            return Response.ok(out).build();
        } catch (ClassNotFoundException e) {
            out = "{\"error\":\"Ocurrió un error. Intente más tarde.\"}";
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        }
    }

    @Path("editarUsuario")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response editarUsuario(@FormParam("cve_usuario") int cve_usuario,
            @FormParam("usuario") String usuario,
            @FormParam("password") String password,
            @FormParam("token") String token,
            @FormParam("a_paterno") String a_paterno,
            @FormParam("a_materno") String a_materno,
            @FormParam("nombre") String nombre,
            @FormParam("rol") String rol,
            @FormParam("extension") int extension,
            @FormParam("email") String email) {
        String out;
        ControllerUsuario cu = new ControllerUsuario();
        try {
            Usuario usuarioActualizado = new Usuario(cve_usuario, usuario, password, token, a_paterno, a_materno, nombre, rol, extension, email);
            boolean resultado = cu.editarUsuario(usuarioActualizado);
            if (resultado) {
                out = "{\"success\":\"Usuario editado correctamente\"}";
            } else {
                out = "{\"error\":\"No se pudo editar el usuario\"}";
            }
            return Response.ok(out).build();
        } catch (ClassNotFoundException e) {
            out = "{\"error\":\"Ocurrió un error. Intente más tarde.\"}";
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        }
    }

    @Path("buscarUsuario")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public Response buscarUsuario(@QueryParam("query") String query) {
        String out = null;
        List<Usuario> usuarios = null;
        ControllerUsuario cu = new ControllerUsuario();
        try {
            usuarios = cu.buscarUsuario(query);
            out = new Gson().toJson(usuarios);
        } catch (ClassNotFoundException | SQLException e) {
            out = "{\"error\":\"Ocurrió un error. Intente más tarde.\"}";
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).type(MediaType.APPLICATION_JSON).entity(out).build();
        }
        return Response.status(Response.Status.OK).type(MediaType.APPLICATION_JSON).entity(out).build();
    }

}
