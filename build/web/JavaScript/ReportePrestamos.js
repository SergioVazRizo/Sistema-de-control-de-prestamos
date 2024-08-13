//URL BASE
function setBaseURL() {
    const URL_BASE = 'http://localhost:8080/';
    return URL_BASE;
}

// Llama a la función y almacena el resultado en una constante global
const BASE_URL = setBaseURL();

document.addEventListener('DOMContentLoaded', function () {
    const catalogos = document.getElementById('catalogos');
    const procesos = document.getElementById('procesos');
    const reportes = document.getElementById('reportes');

    catalogos.addEventListener('click', () => {
        catalogos.parentElement.classList.toggle('active');
    });

    procesos.addEventListener('click', () => {
        procesos.parentElement.classList.toggle('active');
    });

    reportes.addEventListener('click', () => {
        reportes.parentElement.classList.toggle('active');
    });

    const logoutBtn = document.getElementById('logoutBtn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (event) {
            event.preventDefault();

            Swal.fire({
                title: '¿Estás seguro de que deseas salir?',
                text: 'Tu sesión actual se cerrará',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, salir',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    cerrarSesion();
                }
            });
        });
    }


});

function verificarToken() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = BASE_URL + 'SistemaGestion/index.html';
    }
}

window.onload = function () {
    verificarToken();
};

function cerrarSesion() {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('No se encontró el token en el localStorage');
        return;
    }

    fetch(BASE_URL + 'SistemaGestion/api/login/cerrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'token=' + encodeURIComponent(token)
    })
            .then(response => {
                if (response.ok) {
                    localStorage.removeItem('token');
                    Swal.fire({
                        title: 'Sesión cerrada',
                        text: 'exitosamente',
                        icon: 'success'
                    }).then(() => {
                        window.location.href = BASE_URL + 'SistemaGestion/index.html';
                    });
                } else {
                    throw new Error('Error al cerrar sesión');
                }
            })
            .catch(error => {
                console.error(error);
                Swal.fire({
                    title: 'Error',
                    text: 'Ha ocurrido un error al cerrar sesión',
                    icon: 'error'
                });
            });
}
// Funciones Propias
document.addEventListener('DOMContentLoaded', function () {
    const buscarBtn = document.getElementById('buscarClave');
    const contenidoPrincipal = document.querySelector('.datos');

    buscarBtn.addEventListener('click', function () {
        contenidoPrincipal.style.display = 'block';
    });
});

document.getElementById('buscarClave').addEventListener('click', buscarPrestamo);

function buscarPrestamo() {
    const clavePrestamo = document.getElementById('search-input').value;
    fetch(BASE_URL + `SistemaGestion/api/prestamo/buscarPrestamo?clave=${clavePrestamo}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    llenarFormulario(data.prestamo);
                    llenarTablaArticulos(data.articulos);
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'No se encontró el prestamo',
                        icon: 'error'
                    });
                }
            })
            .catch(error => {
                console.error('Error al buscar el prestamo:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Ha ocurrido un error al buscar el prestamo',
                    icon: 'error'
                });
            });
}

function formatDate(dateString) {
    if (!dateString)
        return '00/00/0000';

    // Verificar si el formato ya es YYYY-MM-DD
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (regex.test(dateString)) {
        return dateString; // Ya está en el formato correcto
    }

    // Crear una instancia de Date a partir de la cadena de fecha
    const date = new Date(dateString);

    // Verificar si la fecha es válida
    if (isNaN(date.getTime()))
        return '00/00/0000';

    // Obtener los componentes de la fecha (año, mes, día)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses están basados en 0
    const day = String(date.getDate()).padStart(2, '0');

    // Devolver la fecha en formato YYYY-MM-DD
    return `${year}-${month}-${day}`;
}

function llenarFormulario(prestamo) {
    document.getElementById('usuario').value = prestamo.usuario || '';
    document.getElementById('email').value = prestamo.correo || '';
    document.getElementById('rol').value = prestamo.rol || '';
    document.getElementById('lugar_de_uso').value = prestamo.lugarDeUso || '';
    document.getElementById('proyecto_de_apoyo').value = prestamo.ProyectoApoyo || '';
    document.getElementById('fecha_salida').value = formatDate(prestamo.Fecha_salida);
    document.getElementById('fecha_vencimiento').value = formatDate(prestamo.Fecha_vencimiento);
    document.getElementById('fecha_devolucion').value = formatDate(prestamo.Fecha_devolucion);
}

function limpiarFormulario() {
    document.getElementById('search-input').value = '';
    document.getElementById('usuario').value = '';
    document.getElementById('email').value = '';
    document.getElementById('rol').value = '';
    document.getElementById('lugar_de_uso').value = '';
    document.getElementById('proyecto_de_apoyo').value = '';
    document.getElementById('fecha_salida').value = '';
    document.getElementById('fecha_vencimiento').value = '';
    document.getElementById('fecha_devolucion').value = '';

    // Limpiar la tabla de artículos
    var tablaArticulos = document.getElementById('tablaArticulosParaPrestamo');
    tablaArticulos.innerHTML = '';
}

function llenarTablaArticulos(articulos) {
    const tablaArticulos = document.getElementById('tablaArticulosParaPrestamo');
    tablaArticulos.innerHTML = '';

    articulos.forEach(articulo => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${articulo.id_articulo}</td>
            <td>${articulo.claveArticulo}</td>
            <td>${articulo.descripcion}</td>
        `;
        tablaArticulos.appendChild(fila);
    });
}

function formatDateStr(dateStr) {
    if (!dateStr) {
        return "/  /";
    }
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function generarReporte() {
    // Obtener datos del formulario
    const clave = document.getElementById('search-input').value;
    const usuario = document.getElementById('usuario').value;
    const email = document.getElementById('email').value;
    const rol = document.getElementById('rol').value;
    const lugar_de_uso = document.getElementById('lugar_de_uso').value;
    const proyecto_de_apoyo = document.getElementById('proyecto_de_apoyo').value;
    const fecha_salida = formatDateStr(document.getElementById('fecha_salida').value);
    const fecha_vencimiento = formatDateStr(document.getElementById('fecha_vencimiento').value);
    const fecha_devolucion = formatDateStr(document.getElementById('fecha_devolucion').value);

    // Obtener datos de la tabla de artículos
    const tablaArticulos = document.getElementById('tablaArticulosParaPrestamo');
    const rows = tablaArticulos.getElementsByTagName('tr');
    const data = [];

    for (let i = 0; i < rows.length; i++) {
        const cols = rows[i].getElementsByTagName('td');
        if (cols.length > 0) { // Asegúrate de que la fila tenga celdas
            const descripcion = cols[2].innerText.trim();
            const claveCIO = cols[1].innerText.trim();
            data.push([1, descripcion, claveCIO, fecha_devolucion]);
        }
    }

    // Crear instancia de jsPDF
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [140, 216]
    });

    // Centrar contenido en la página
    const pageWidth = doc.internal.pageSize.width;
    const margin = 5;
    const lineSpacing = 4; // Reducir espacio entre líneas

    // Agregar logo
    const logoBase64 = ''; // Base64 del logo
    doc.addImage(logoBase64, 'PNG', margin, 8, 30, 15); // Ajustar posición del logo

    // Título del documento
    doc.setFontSize(8);
    doc.text("PRÉSTAMO DE EQUIPO ADICIONAL", pageWidth / 2, 13, null, null, 'center');
    doc.text("DE LOS LABORATORIOS DE POSGRADO", pageWidth / 2, 18, null, null, 'center');

    // Clave del préstamo
    doc.setFontSize(8);
    doc.text("DF-LP-P002.F01", pageWidth - margin, 13, null, null, 'right');
    doc.text(clave, pageWidth - margin, 18, null, null, 'right');

    // Datos del usuario
    doc.setFontSize(7);
    let yPos = 30; // Ajuste de posición vertical para reducir margen superior
    doc.text(`NOMBRE DEL (los) USUARIO(s): ${usuario}`, margin, yPos);

    // Roles
    yPos += lineSpacing;
    const roles = {
        Estudiante: rol === 'Estudiante' ? 'X' : '',
        Investigador: rol === 'Investigador' ? 'X' : '',
        Tecnico: rol === 'Tecnico' ? 'X' : '',
        Administrativo: (rol !== 'Estudiante' && rol !== 'Investigador' && rol !== 'Tecnico') ? 'X' : ''
    };

    doc.text(`ESTUDIANTE: ${roles.Estudiante}`, margin, yPos);
    doc.text(`INVESTIGADOR: ${roles.Investigador}`, pageWidth / 4, yPos);
    doc.text(`TECNICO: ${roles.Tecnico}`, pageWidth / 2, yPos);
    doc.text(`OTRO: ${roles.Administrativo}`, 3 * pageWidth / 4, yPos);

    // Detalles del préstamo
    yPos += lineSpacing;
    doc.text(`LUGAR DONDE SE USARÁ EL EQUIPO: ${lugar_de_uso}`, margin, yPos);
    yPos += lineSpacing;
    doc.text(`PROYECTO O EVENTO AL QUE SE APOYA: ${proyecto_de_apoyo}`, margin, yPos);
    yPos += lineSpacing;
    doc.text(`FECHA DE SALIDA: ${fecha_salida}`, margin, yPos);
    doc.text(`FECHA DE VENCIMIENTO: ${fecha_vencimiento}`, pageWidth / 2, yPos);

    // Tabla de artículos
    yPos += lineSpacing * 2;
    doc.autoTable({
        startY: yPos,
        head: [['Cant.', 'Descripción', 'Clave CIO', 'Fecha_Devolución']],
        body: data,
        margin: {left: margin, right: margin},
        styles: {fontSize: 8, cellPadding: 1}, // Reducir tamaño de fuente y padding
        theme: 'striped' // Cambiar tema de la tabla a 'striped'
    });

    // Pie de página
    function addFooter() {
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            const footerY = doc.internal.pageSize.height - 7; // Ajustar margen inferior

            // Agregar líneas justo encima de los textos de firma
            const lineYOffset = 3; // Ajustar la distancia entre la línea y el texto
            doc.setLineWidth(0.5);
            doc.line(margin, footerY - lineYOffset, margin + 40, footerY - lineYOffset); // Línea para "FIRMA DE RECIBIDO"
            doc.line(pageWidth / 2 - 20, footerY - lineYOffset, pageWidth / 2 + 20, footerY - lineYOffset); // Línea para "FIRMA DE AUTORIZACIÓN DE DFA"
            doc.line(pageWidth - margin - 40, footerY - lineYOffset, pageWidth - margin, footerY - lineYOffset); // Línea para "FIRMA DEL RESPONSABLE"

            doc.setFontSize(8);
            doc.text("FIRMA DE RECIBIDO", margin, footerY);
            doc.text("FIRMA DE AUTORIZACIÓN DE DFA", pageWidth / 2, footerY, null, null, 'center'); // Firma DFA centrada
            doc.text("FIRMA DEL RESPONSABLE", pageWidth - margin, footerY, null, null, 'right');
        }
    }

    addFooter();

    // Guardar el PDF
    doc.save('reporte_prestamo.pdf');
}

