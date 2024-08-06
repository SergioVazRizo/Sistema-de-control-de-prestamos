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
import org.controller.ControllerLugar;
import org.model.Lugar;

@Path("lugar")
public class RestLugar {

    @GET
    @Path("getAllLugares")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllLugares() {
        String out = null;
        List<Lugar> lugares = null;
        ControllerLugar cl = new ControllerLugar();
        try {
            lugares = cl.getAllLugares();
            out = new Gson().toJson(lugares);
        } catch (ClassNotFoundException | SQLException e) {
            out = "{\"error\":\"Ocurrió un error. Intente más tarde.\"}";
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).type(MediaType.APPLICATION_JSON).entity(out).build();
        }
        return Response.status(Response.Status.OK).type(MediaType.APPLICATION_JSON).entity(out).build();
    }

    @GET
    @Path("getAllLugaresPaginados")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllLugaresPaginados(@QueryParam("inicio") int inicio, @QueryParam("cantidad") int cantidad) {
        String out = null;
        List<Lugar> lugares = null;
        ControllerLugar cl = new ControllerLugar();
        try {
            lugares = cl.getAllLugaresPaginados(inicio, cantidad);
            out = new Gson().toJson(lugares);
        } catch (ClassNotFoundException | SQLException e) {
            out = "{\"error\":\"Ocurrió un error. Intente más tarde.\"}";
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).type(MediaType.APPLICATION_JSON).entity(out).build();
        }
        return Response.status(Response.Status.OK).type(MediaType.APPLICATION_JSON).entity(out).build();
    }  

    @Path("agregarLugar")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response agregarLugar(@FormParam("ubicacion") String ubicacion,
                                    @FormParam("nombre") String nombre) {
        String out;
        ControllerLugar cl = new ControllerLugar();
        try {
            Lugar nuevoLugar = new Lugar(0, ubicacion, nombre);
            boolean resultado = cl.agregarLugar(nuevoLugar);
            if (resultado) {
                out = "{\"success\":\"Lugar agregado correctamente\"}";
            } else {
                out = "{\"error\":\"No se pudo agregar el lugar\"}";
            }
            return Response.ok(out).build();
        } catch (ClassNotFoundException e) {
            out = "{\"error\":\"Ocurrió un error. Intente más tarde.\"}";
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        }
    }

    @Path("editarLugar")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response editarLugar(@FormParam("cve_lugar") int cve_lugar,
                                   @FormParam("ubicacion") String ubicacion,
                                   @FormParam("nombre") String nombre) {
        String out;
        ControllerLugar cl = new ControllerLugar();
        try {
            Lugar lugarActualizado = new Lugar(cve_lugar, ubicacion, nombre);
            boolean resultado = cl.editarLugar(lugarActualizado);
            if (resultado) {
                out = "{\"success\":\"Lugar editado correctamente\"}";
            } else {
                out = "{\"error\":\"No se pudo editar el lugar\"}";
            }
            return Response.ok(out).build();
        } catch (ClassNotFoundException e) {
            out = "{\"error\":\"Ocurrió un error. Intente más tarde.\"}";
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        }
    }

    @Path("buscarLugar")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public Response buscarLugar(@QueryParam("query") String query) {
        String out = null;
        List<Lugar> lugares = null;
        ControllerLugar cl = new ControllerLugar();
        try {
            lugares = cl.buscarLugar(query);
            out = new Gson().toJson(lugares);
        } catch (ClassNotFoundException | SQLException e) {
            out = "{\"error\":\"Ocurrió un error. Intente más tarde.\"}";
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).type(MediaType.APPLICATION_JSON).entity(out).build();
        }
        return Response.status(Response.Status.OK).type(MediaType.APPLICATION_JSON).entity(out).build();
    }

}

