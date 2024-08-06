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
import org.controller.ControllerProyecto;
import org.model.Proyecto;

/**
 *
 * @author checo
 */

@Path("proyecto")
public class RestProyecto {
    
    @Path("getAllProyectos")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public Response getAllProyectos() {
        ControllerProyecto controllerProyecto = new ControllerProyecto();
        try {
            List<Proyecto> proyectos = controllerProyecto.getAllProyectos();
            String jsonOutput = new Gson().toJson(proyectos);
            return Response.ok(jsonOutput).build();
        } catch (ClassNotFoundException | SQLException e) {
            String errorMessage = "{\"error\":\"Ocurrió un error. Intente más tarde.\"}";
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .type(MediaType.APPLICATION_JSON)
                    .entity(errorMessage)
                    .build();
        }
    }

    @Path("getAllProyectosPaginados")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public Response getAllProyectosPaginados(@QueryParam("inicio") int inicio, @QueryParam("cantidad") int cantidad) {
        ControllerProyecto controllerProyecto = new ControllerProyecto();
        try {
            List<Proyecto> proyectos = controllerProyecto.getAllProyectosPaginados(inicio, cantidad);
            String jsonOutput = new Gson().toJson(proyectos);
            return Response.ok(jsonOutput).build();
        } catch (ClassNotFoundException | SQLException e) {
            String errorMessage = "{\"error\":\"Ocurrió un error. Intente más tarde.\"}";
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .type(MediaType.APPLICATION_JSON)
                    .entity(errorMessage)
                    .build();
        }
    }
    
    @Path("agregarProyecto")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response agregarProyecto(@FormParam("nombre") String nombre) {
        String out;
        ControllerProyecto controllerProyecto = new ControllerProyecto();
        try {
            Proyecto nuevoProyecto = new Proyecto(0, nombre);
            boolean resultado = controllerProyecto.agregarProyecto(nuevoProyecto);
            if (resultado) {
                out = "{\"success\":\"Proyecto agregado correctamente\"}";
            } else {
                out = "{\"error\":\"No se pudo agregar el proyecto\"}";
            }
            return Response.ok(out).build();
        } catch (ClassNotFoundException e) {
            out = "{\"error\":\"Ocurrió un error. Intente más tarde.\"}";
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        }
    }
    
    @Path("editarProyecto")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response editarProyecto(@FormParam("cve_proyecto") int cve_proyecto,
                                   @FormParam("nombre") String nombre) {
        String out;
        ControllerProyecto controllerProyecto = new ControllerProyecto();
        try {
            Proyecto proyectoActualizado = new Proyecto(cve_proyecto, nombre);
            boolean resultado = controllerProyecto.editarProyecto(proyectoActualizado);
            if (resultado) {
                out = "{\"success\":true, \"message\":\"Proyecto editado correctamente\"}";
            } else {
                out = "{\"success\":false, \"error\":\"No se pudo editar el proyecto\"}";
            }
            return Response.ok(out).build();
        } catch (ClassNotFoundException e) {
            out = "{\"success\":false, \"error\":\"Ocurrió un error. Intente más tarde.\"}";
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        }
    }

    @Path("buscarProyecto")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public Response buscarProyecto(@QueryParam("query") String query) {
        String out = null;
        List<Proyecto> proyectos = null;
        ControllerProyecto controllerProyecto = new ControllerProyecto();
        try {
            proyectos = controllerProyecto.buscarProyecto(query);
            out = new Gson().toJson(proyectos);
        } catch (ClassNotFoundException | SQLException e) {
            out = "{\"error\":\"Ocurrió un error. Intente más tarde.\"}";
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).type(MediaType.APPLICATION_JSON).entity(out).build();
        }
        return Response.status(Response.Status.OK).type(MediaType.APPLICATION_JSON).entity(out).build();
    }
}
