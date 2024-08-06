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

    fetch(BASE_URL +'SistemaGestion/api/login/cerrar', {
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
                        window.location.href = BASE_URL+'index.html';
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

//Funciones Propias
//Funcion para desplegar el contendo al presionar el boton 
document.addEventListener('DOMContentLoaded', function () {
    const buscarBtn = document.getElementById('buscarClave');
    const contenidoPrincipal = document.querySelector('.datos');

    buscarBtn.addEventListener('click', function () {
        contenidoPrincipal.style.display = 'block';
    });
});

document.getElementById('buscarClave').addEventListener('click', buscarPrestamo);

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
}

function buscarPrestamo() {
    const clavePrestamo = document.getElementById('search-input').value;
    fetch(BASE_URL+`SistemaGestion/api/prestamo/buscarPrestamo?clave=${clavePrestamo}`, {
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

function llenarFormulario(prestamo) {
    document.getElementById('usuario').value = prestamo.usuario;
    document.getElementById('email').value = prestamo.correo;
    document.getElementById('rol').value = prestamo.rol;
    document.getElementById('lugar_de_uso').value = prestamo.lugarDeUso;
    document.getElementById('proyecto_de_apoyo').value = prestamo.ProyectoApoyo;
    document.getElementById('fecha_salida').value = formatDate(prestamo.Fecha_salida);
    document.getElementById('fecha_vencimiento').value = formatDate(prestamo.Fecha_vencimiento);
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

function hacerRenovacion() {
    const clavePrestamo = document.getElementById('search-input').value;

    fetch(BASE_URL+'SistemaGestion/api/prestamo/renovarPrestamo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({clavePrestamo: clavePrestamo})
    })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        title: 'Éxito',
                        text: 'Préstamo renovado correctamente.',
                        icon: 'success'
                    });
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'No se pudo renovar el préstamo.',
                        icon: 'error'
                    });
                }
                limpiarFormulario();
            })
            .catch(error => {
                console.error('Error al renovar el préstamo:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Ocurrió un error al renovar el préstamo.',
                    icon: 'error'
                });
            });
}
