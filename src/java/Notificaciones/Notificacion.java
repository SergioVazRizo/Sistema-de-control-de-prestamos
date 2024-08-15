package Notificaciones;

/**
 *
 * @author checo
 */

import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.concurrent.*;
import org.controller.ControllerPrestamo;
import org.model.Prestamo;

public class Notificacion implements Runnable {

    public void run() {
        ControllerPrestamo controller = new ControllerPrestamo();

        try {
            List<Prestamo> prestamosPorVencer = controller.getPrestamosPorVencer();
            SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");

            for (Prestamo prestamo : prestamosPorVencer) {
                String to = prestamo.getCorreo();
                String subject = "IMPORTANTE: Su préstamo está por vencer";
                String formattedDate = dateFormat.format(prestamo.getFecha_vencimiento());
                
                String body = "<html><body>" +
                              "<p>Estimado, " + prestamo.getUsuario() +
                              "<p>Su préstamo con clave " +prestamo.getCve_prestamo() + " está por vencer el " + formattedDate + ".</p>" +
                              "<p>Por favor, realice la devolución a tiempo o pase a realizar su renovación.</p>" +
                              "<p>Saludos cordiales.</p>" +
                              "<p>Favor de no responder a este correo.</p>" +
                              "</body></html>";
                
                EmailUtil.enviarCorreoHTML(to, subject, body);
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        ScheduledExecutorService scheduler
                = Executors.newSingleThreadScheduledExecutor();

        Runnable task = new Notificacion();
        int initialDelay = 1;
        int periodicDelay = 1;
        scheduler.scheduleAtFixedRate(task, initialDelay, periodicDelay,
                TimeUnit.DAYS
        );
    }
}