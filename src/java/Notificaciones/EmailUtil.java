package Notificaciones;

import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.*;

public class EmailUtil {

    public static void enviarCorreoHTML(String to, String subject, String body) {
        final String username = "checoevr@gmail.com";
        final String password = "ueon znnj ukak xqdo";

        //Microsoft
//        Properties props = new Properties();
//        props.put("mail.smtp.auth", "true");
//        props.put("mail.smtp.starttls.enable", "true");
//        props.put("mail.smtp.host", "smtp.office365.com");
//        props.put("mail.smtp.port", "587");
        
        //Gmail
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        Session session = Session.getInstance(props, new javax.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
            message.setSubject(subject);
            
            // Establece el contenido del mensaje como HTML
            message.setContent(body, "text/html; charset=utf-8");

            Transport.send(message);

            System.out.println("Correo enviado a: " + to);

        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}