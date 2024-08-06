package org.bd;

import java.sql.CallableStatement;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.ArrayList;
import java.sql.Connection;

/**
 *
 * @author checo
 */

public class ConexionMySQL {
    // Variable para guardar el objeto de conexion
    private Connection connection = null;
    
    // Metodo para abrir la conexion
    public Connection openConnection() throws ClassNotFoundException, SQLException{
        Class.forName("com.mysql.cj.jdbc.Driver");
        
        String url = "jdbc:mysql://localhost:3306/GestionInventario";
        String user = "root";
        String password = "sergio";
        
        connection = DriverManager.getConnection(url, user, password);
        return connection;
    }    
    
    // Metodo para cerrar la conexion
    public void closeConnection() throws SQLException{
        if (connection != null){
            connection.close();   
        } else {
            System.out.println("The connection has not been initiated");
        }
    }
    
    public void executeCallableEstatment(String query, ArrayList<Object> lista) throws ClassNotFoundException, SQLException{
        openConnection();
        CallableStatement cstm = connection.prepareCall(query);
        
        for (int i = 0; i < lista.size(); i++) {
            switch (lista.get(i).getClass().getName()) {
                case "java.lang.Integer" -> cstm.setInt(1, (int) lista.get(i));
                case "java.lang.String" -> cstm.setString(1, (String) lista.get(i));
                case "java.lang.Float" -> cstm.setFloat(1, (float) lista.get(i));
            }
        }
        
        cstm.execute();
        
    }
}
