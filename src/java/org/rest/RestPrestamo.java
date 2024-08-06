package org.rest;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import org.controller.ControllerPrestamo;
import org.model.Prestamo;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.model.Articulo;

@Path("prestamo")
public class RestPrestamo {

    @Path("hacerPrestamo")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response hacerPrestamo(
            @FormParam("usuario") String usuario,
            @FormParam("correo") String correo,
            @FormParam("rol") String rol,
            @FormParam("lugarDeUso") String lugarDeUso,
            @FormParam("ProyectoApoyo") String ProyectoApoyo,
            @FormParam("Fecha_salida") String Fecha_salida,
            @FormParam("Fecha_vencimiento") String Fecha_vencimiento,
            @FormParam("Fecha_devolucion") String Fecha_devolucion,
            @FormParam("articulos") String articulosJson) {
        String out;
        ControllerPrestamo controller = new ControllerPrestamo();
        try {
            Prestamo nuevoPrestamo = new Prestamo();
            nuevoPrestamo.setUsuario(usuario);
            nuevoPrestamo.setCorreo(correo);
            nuevoPrestamo.setRol(rol);
            nuevoPrestamo.setLugarDeUso(lugarDeUso);
            nuevoPrestamo.setProyectoApoyo(ProyectoApoyo);

            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            nuevoPrestamo.setFecha_salida(new java.sql.Date(format.parse(Fecha_salida).getTime()));
            nuevoPrestamo.setFecha_vencimiento(new java.sql.Date(format.parse(Fecha_vencimiento).getTime()));
            if (Fecha_devolucion != null && !Fecha_devolucion.isEmpty()) {
                nuevoPrestamo.setFecha_devolucion(new java.sql.Date(format.parse(Fecha_devolucion).getTime()));
            } else {
                nuevoPrestamo.setFecha_devolucion(null);
            }

            List<Articulo> articulos = new Gson().fromJson(articulosJson, new TypeToken<List<Articulo>>() {
            }.getType());
            boolean disponibilidad = controller.verificarDisponibilidadArticulos(articulos);

            if (!disponibilidad) {
                out = "{\"error\":\"Uno o más artículos no están disponibles\"}";
                return Response.status(Response.Status.BAD_REQUEST).entity(out).build();
            }

            int cve_prestamo = controller.insertarPrestamo(nuevoPrestamo);
            if (cve_prestamo > 0) {
                boolean resultadoArticulos = controller.insertarArticulosPrestamo(cve_prestamo, articulos);
                if (resultadoArticulos) {
                    boolean actualizacionExitosa = controller.actualizarAdisionEstatusArticulos(articulos);
                    if (actualizacionExitosa) {
                        out = "{\"success\":\"Prestamo realizado correctamente\", \"clave_prestamo\":" + cve_prestamo + "}";
                    } else {
                        out = "{\"error\":\"No se pudo actualizar la adición y el estatus de los artículos\"}";
                    }
                } else {
                    out = "{\"error\":\"No se pudo realizar el prestamo de los articulos\"}";
                }
            } else {
                out = "{\"error\":\"No se pudo realizar el prestamo\"}";
            }
            return Response.ok(out).build();
        } catch (ClassNotFoundException | ParseException e) {
            out = "{\"error\":\"Ocurrió un error. Intente más tarde.\"}";
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        }
    }

    @GET
    @Path("buscarPrestamo")
    @Produces(MediaType.APPLICATION_JSON)
    public Response buscarPrestamo(@QueryParam("clave") int clavePrestamo) {
        try {
            ControllerPrestamo controller = new ControllerPrestamo();
            Prestamo prestamo = controller.obtenerPrestamo(clavePrestamo);
            List<Articulo> articulos = controller.obtenerArticulosPrestamo(clavePrestamo);

            if (prestamo != null && articulos != null) {
                // Formatear las fechas a 'YYYY-MM-DD'
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                String fechaSalida = dateFormat.format(prestamo.getFecha_salida());
                String fechaVencimiento = dateFormat.format(prestamo.getFecha_vencimiento());
                String fechaDevolucion = prestamo.getFecha_devolucion() != null ? dateFormat.format(prestamo.getFecha_devolucion()) : null;

                Map<String, Object> prestamoMap = new HashMap<>();
                prestamoMap.put("cve_prestamo", prestamo.getCve_prestamo());
                prestamoMap.put("usuario", prestamo.getUsuario());
                prestamoMap.put("correo", prestamo.getCorreo());
                prestamoMap.put("rol", prestamo.getRol());
                prestamoMap.put("lugarDeUso", prestamo.getLugarDeUso());
                prestamoMap.put("ProyectoApoyo", prestamo.getProyectoApoyo());
                prestamoMap.put("Fecha_salida", fechaSalida);
                prestamoMap.put("Fecha_vencimiento", fechaVencimiento);
                prestamoMap.put("Fecha_devolucion", fechaDevolucion);

                String jsonResponse = new Gson().toJson(Map.of(
                        "success", true,
                        "prestamo", prestamoMap,
                        "articulos", articulos
                ));
                return Response.ok().entity(jsonResponse).build();
            } else {
                return Response.ok().entity("{\"success\":false}").build();
            }
        } catch (ClassNotFoundException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("{\"error\":\"Ocurrió un error. Intente más tarde.\"}").build();
        }
    }

    @POST
    @Path("hacerDevolucion")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response hacerDevolucion(String requestData) {
        Gson gson = new Gson();
        RequestDevolucion request = gson.fromJson(requestData, RequestDevolucion.class);
        int clavePrestamo = request.getClavePrestamo();
        try {
            ControllerPrestamo controller = new ControllerPrestamo();
            boolean resultado = controller.realizarDevolucion(clavePrestamo);
            if (resultado) {
                return Response.ok().entity("{\"success\":true}").build();
            } else {
                return Response.ok().entity("{\"success\":false,\"error\":\"No se pudo realizar la devolución.\"}").build();
            }
        } catch (ClassNotFoundException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("{\"error\":\"Ocurrió un error. Intente más tarde.\"}").build();
        }
    }

    private static class RequestDevolucion {

        private int clavePrestamo;

        public int getClavePrestamo() {
            return clavePrestamo;
        }
    }

    @Path("renovarPrestamo")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response renovarPrestamo(String requestData) {
        Gson gson = new Gson();
        try {
            RequestRenovacion request = gson.fromJson(requestData, RequestRenovacion.class);
            int clavePrestamo = request.getClavePrestamo();

            ControllerPrestamo controller = new ControllerPrestamo();
            boolean resultado = controller.renovarPrestamo(clavePrestamo);
            if (resultado) {
                return Response.ok("{\"success\":true}").build();
            } else {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("{\"success\":false,\"error\":\"No se pudo realizar la renovación. Verifique si el préstamo ya fue devuelto.\"}")
                        .build();
            }
        } catch (ClassNotFoundException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\":\"Ocurrió un error. Intente más tarde.\"}")
                    .build();
        }
    }

    private static class RequestRenovacion {

        private int clavePrestamo;

        public int getClavePrestamo() {
            return clavePrestamo;
        }
    }

    @Path("modificarPrestamo/{cve_prestamo}")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response modificarPrestamo(
            @PathParam("cve_prestamo") int cve_prestamo,
            @FormParam("usuario") String usuario,
            @FormParam("correo") String correo,
            @FormParam("rol") String rol,
            @FormParam("lugarDeUso") String lugarDeUso,
            @FormParam("ProyectoApoyo") String ProyectoApoyo,
            @FormParam("Fecha_salida") String Fecha_salida,
            @FormParam("Fecha_vencimiento") String Fecha_vencimiento,
            @FormParam("articulos") String articulosJson) {
        String out;
        ControllerPrestamo controller = new ControllerPrestamo();
        try {
            boolean tieneFechaDevolucion = controller.verificarFechaDevolucion(cve_prestamo);
            if (tieneFechaDevolucion) {
                out = "{\"error\":\"El préstamo ya tiene una fecha de devolución asignada y no puede ser modificado\"}";
                return Response.status(Response.Status.BAD_REQUEST).entity(out).build();
            }

            Prestamo prestamo = new Prestamo();
            prestamo.setCve_prestamo(cve_prestamo);
            prestamo.setUsuario(usuario);
            prestamo.setCorreo(correo);
            prestamo.setRol(rol);
            prestamo.setLugarDeUso(lugarDeUso);
            prestamo.setProyectoApoyo(ProyectoApoyo);

            // Convertir las fechas de cadena a java.sql.Date
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            if (Fecha_salida != null && !Fecha_salida.isEmpty()) {
                prestamo.setFecha_salida(new java.sql.Date(format.parse(Fecha_salida).getTime()));
            }
            if (Fecha_vencimiento != null && !Fecha_vencimiento.isEmpty()) {
                prestamo.setFecha_vencimiento(new java.sql.Date(format.parse(Fecha_vencimiento).getTime()));
            }

            // Obtener los artículos actuales del préstamo
            List<Articulo> articulosExistentes = controller.obtenerArticulosPrestamo(cve_prestamo);

            // Parsear los nuevos artículos desde el JSON
            List<Articulo> nuevosArticulos = new Gson().fromJson(articulosJson, new TypeToken<List<Articulo>>() {
            }.getType());

            // Validar si hay artículos para modificar
            if (articulosExistentes.isEmpty() && nuevosArticulos.isEmpty()) {
                out = "{\"error\":\"No se puede modificar el préstamo sin artículos.\"}";
                return Response.status(Response.Status.BAD_REQUEST).entity(out).build();
            }

            boolean actualizacionExitosa = controller.modificarPrestamo(prestamo);

            if (actualizacionExitosa) {
                // Verificar disponibilidad de artículos antes de insertarlos
                boolean disponibilidad = controller.verificarDisponibilidadArticulos(nuevosArticulos);

                if (!disponibilidad) {
                    out = "{\"error\":\"Uno o más artículos que agregó no están disponibles\"}";
                    return Response.status(Response.Status.BAD_REQUEST).entity(out).build();
                }

                boolean resultadoArticulos = controller.insertarArticulosPrestamo(cve_prestamo, nuevosArticulos);
                if (resultadoArticulos) {
                    boolean actualizacionArticulosExitosa = controller.actualizarAdisionEstatusArticulos(nuevosArticulos);
                    if (actualizacionArticulosExitosa) {
                        out = "{\"success\":\"Préstamo modificado correctamente\"}";
                    } else {
                        out = "{\"error\":\"No se pudo actualizar la adición y el estatus de los artículos\"}";
                    }
                } else {
                    out = "{\"error\":\"No se pudo realizar el préstamo de los artículos\"}";
                }
            } else {
                out = "{\"error\":\"No se pudo modificar el préstamo\"}";
            }
            return Response.ok(out).build();
        } catch (ClassNotFoundException | ParseException e) {
            out = "{\"error\":\"Ocurrió un error. Intente más tarde.\"}";
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        }
    }

    @Path("eliminarArticulo")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response eliminarArticulo(
            @FormParam("id_articulo") int idArticulo,
            @FormParam("clave_articulo") String claveArticulo) {

        String out;
        ControllerPrestamo controller = new ControllerPrestamo();
        try {
            boolean resultado = controller.eliminarArticuloPrestamo(idArticulo, claveArticulo);
            if (resultado) {
                out = "{\"success\":\"Artículo eliminado del préstamo correctamente\"}";
            } else {
                out = "{\"error\":\"No se pudo eliminar el artículo del préstamo\"}";
            }
            return Response.ok(out).build();
        } catch (ClassNotFoundException e) {
            System.out.println("Error: " + e.getMessage());
            out = "{\"error\":\"Ocurrió un error. Intente más tarde.\"}";
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        }
    }

}
