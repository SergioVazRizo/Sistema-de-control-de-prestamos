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
import org.controller.ControllerArticulo;
import org.model.Articulo;

@Path("articulo")
public class RestArticulo {
    
    @Path("getAllArticulos")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllArticulos() {
        String out = null;
        List<Articulo> articulos = null;
        ControllerArticulo controller = new ControllerArticulo();
        try {
            articulos = controller.getAllArticulos();
            out = new Gson().toJson(articulos);
        } catch (ClassNotFoundException | SQLException e) {
            out = "{\"error\":\"Ocurrió un error. Intente más tarde.\"}";
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).type(MediaType.APPLICATION_JSON).entity(out).build();
        }
        return Response.status(Response.Status.OK).type(MediaType.APPLICATION_JSON).entity(out).build();
    }

    @Path("getAllArticulosPaginados")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllArticulosPaginados(@QueryParam("inicio") int inicio, @QueryParam("cantidad") int cantidad) {
        String out = null;
        List<Articulo> articulos = null;
        ControllerArticulo controller = new ControllerArticulo();
        try {
            articulos = controller.getAllArticulosPaginados(inicio, cantidad);
            out = new Gson().toJson(articulos);
        } catch (ClassNotFoundException | SQLException e) {
            out = "{\"error\":\"Ocurrió un error. Intente más tarde.\"}";
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).type(MediaType.APPLICATION_JSON).entity(out).build();
        }
        return Response.status(Response.Status.OK).type(MediaType.APPLICATION_JSON).entity(out).build();
    }

    
    @Path("buscarArticulo")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response buscarArticulo(@QueryParam("query") String query) {
        String out = null;
        List<Articulo> articulos = null;
        ControllerArticulo ca = new ControllerArticulo();
        try {
            articulos = ca.buscarArticulo(query);
            out = new Gson().toJson(articulos);
        } catch (ClassNotFoundException | SQLException e) {
            out = "{\"error\":\"Ocurrió un error. Intente más tarde.\"}";
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).type(MediaType.APPLICATION_JSON).entity(out).build();
        }
        return Response.status(Response.Status.OK).type(MediaType.APPLICATION_JSON).entity(out).build();
    }

    @Path("agregarArticulo")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response agregarArticulo(@FormParam("clave_articulo") String claveArticulo,
                                    @FormParam("adicion") int adicion,
                                    @FormParam("descripcion") String descripcion,
                                    @FormParam("modelo") String modelo,
                                    @FormParam("marca") String marca,
                                    @FormParam("num_serie") String numSerie,
                                    @FormParam("estatus") String estatus,
                                    @FormParam("responsable") String responsable,
                                    @FormParam("cuenta") int cuenta) {
        String out;
        ControllerArticulo controller = new ControllerArticulo();
        try {
            Articulo nuevoArticulo = new Articulo(0, claveArticulo, adicion, descripcion, modelo, marca, numSerie, estatus, responsable, cuenta);
            boolean resultado = controller.agregarArticulo(nuevoArticulo);
            if (resultado) {
                out = "{\"success\":\"Artículo agregado correctamente\"}";
                return Response.ok(out).build();
            } else {
                out = "{\"error\":\"No se pudo agregar el artículo\"}";
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
            }
        } catch (ClassNotFoundException e) {
            out = "{\"error\":\"Ocurrió un error. Intente más tarde.\"}";
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        }
    }
    
    @Path("editarArticulo")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response editarArticulo(@FormParam("id_articulo") int id_articulo,
                                   @FormParam("clave_articulo") String claveArticulo,
                                   @FormParam("adicion") int adicion,
                                   @FormParam("descripcion") String descripcion,
                                   @FormParam("modelo") String modelo,
                                   @FormParam("marca") String marca,
                                   @FormParam("num_serie") String numSerie,
                                   @FormParam("estatus") String estatus,
                                   @FormParam("responsable") String responsable,
                                   @FormParam("cuenta") int cuenta) {
        String out;
        ControllerArticulo controller = new ControllerArticulo();
        try {
            Articulo articuloActualizado = new Articulo(id_articulo, claveArticulo, adicion, descripcion, modelo, marca, numSerie, estatus, responsable, cuenta);
            boolean resultado = controller.editarArticulo(articuloActualizado);
            if (resultado) {
                out = "{\"success\":\"Artículo editado correctamente\"}";
            } else {
                out = "{\"error\":\"No se pudo editar el artículo\"}";
            }
            return Response.ok(out).build();
        } catch (ClassNotFoundException e) {
            out = "{\"error\":\"Ocurrió un error. Intente más tarde.\"}";
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        }
    }

    
}
