//URL BASE
function setBaseURL() {
    const URL_BASE = 'http://localhost:8080/';
    return URL_BASE;
}

// Llama a la función y almacena el resultado en una constante global
const BASE_URL = setBaseURL();


document.addEventListener('DOMContentLoaded', function() {
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
        logoutBtn.addEventListener('click', function(event) {
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

    window.onload = function() {
        verificarToken();
        cargarProyectos();
    };
});

function verificarToken() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = BASE_URL+'SistemaGestion/index.html';
    }
}

function cerrarSesion() {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('No se encontró el token en el localStorage');
        return;
    }

    fetch(BASE_URL+'SistemaGestion/api/login/cerrar', {
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
let paginaActual = 0;
const ProyectosPorPagina = 10;

function cargarPaginaAnterior() {
    if (paginaActual > 0) {
        paginaActual--;
        cargarProyectos();
    }
}

function cargarPaginaSiguiente() {
    paginaActual++;
    cargarProyectos();
}

function cargarProyectos() {
    const inicio = paginaActual * ProyectosPorPagina;
    fetch(BASE_URL + `SistemaGestion/api/proyecto/getAllProyectosPaginados?inicio=${inicio}&cantidad=${ProyectosPorPagina}`)
    .then(response => response.json())
    .then(data => {
        const tablaProyectos = document.getElementById('tablaProyectos');
        tablaProyectos.innerHTML = ''; // Limpiar tabla

        data.forEach(proyecto => {
            const row = `
                <tr>
                    <td>${proyecto.cve_proyecto}</td>
                    <td>${proyecto.nombre}</td>
                    <td>
                        <button type="button" class="btn btn-info" onclick="seleccionarProyecto('${proyecto.cve_proyecto}', '${proyecto.nombre}')" data-id="${proyecto.cve_proyecto}"><i class='bx bxs-select-multiple'></i></button>
                    </td>
                </tr>
            `;
            tablaProyectos.innerHTML += row;
        });
    })
    .catch(error => {
        console.error('Error al cargar proyectos:', error);
        Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error al cargar proyectos',
            icon: 'error'
        });
    });
}

function buscarProyecto() {
    const searchInput = document.getElementById('search-input').value.trim().toLowerCase();
    fetch(BASE_URL+`SistemaGestion/api/proyecto/buscarProyecto?query=${searchInput}`)
        .then(response => response.json())
        .then(data => {
            const tablaProyectos = document.getElementById('tablaProyectos');
            tablaProyectos.innerHTML = ''; // Limpiar tabla

            data.forEach(proyecto => {
                const row = `
                    <tr>
                        <td>${proyecto.cve_proyecto}</td>
                        <td>${proyecto.nombre}</td>
                        <td>
                            <button type="button" class="btn btn-info" onclick="seleccionarProyecto('${proyecto.cve_proyecto}', '${proyecto.nombre}')" data-id="${proyecto.cve_proyecto}"><i class='bx bxs-select-multiple'></i></button>
                        </td>
                    </tr>
                `;
                tablaProyectos.innerHTML += row;
            });
        })
        .catch(error => {
            console.error('Error al buscar proyectos:', error);
            Swal.fire({
                title: 'Error',
                text: 'Ha ocurrido un error al buscar proyectos',
                icon: 'error'
            });
        });
}

function agregarProyecto() {
    if (!validarFormulario()) {
        return;
    }
    
    const nombre = document.getElementById('nombre_proyecto').value;

    fetch(BASE_URL+'SistemaGestion/api/proyecto/agregarProyecto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `nombre=${encodeURIComponent(nombre)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                title: 'Éxito',
                text: 'Proyecto agregado correctamente',
                icon: 'success'
            }).then(() => {
                cargarProyectos();
                limpiarFormulario();
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'No se pudo agregar el proyecto',
                icon: 'error'
            });
        }
    })
    .catch(error => {
        console.error('Error al agregar proyecto:', error);
        Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error al agregar el proyecto',
            icon: 'error'
        });
    });
}

function editarProyecto() {
    const idProyecto = obtenerIdProyectoSeleccionado();
    if (!idProyecto) {
        console.error('No se ha seleccionado ningún proyecto para editar');
        return;
    }

    if (!validarFormulario()) {
        return;
    }

    const nombre = document.getElementById('nombre_proyecto').value;

    fetch(BASE_URL+'SistemaGestion/api/proyecto/editarProyecto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `cve_proyecto=${encodeURIComponent(idProyecto)}&nombre=${encodeURIComponent(nombre)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                title: 'Éxito',
                text: 'Proyecto editado correctamente',
                icon: 'success'
            }).then(() => {
                cargarProyectos();
                limpiarFormulario();
                localStorage.removeItem('selectedProjectId');
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: data.error || 'No se pudo editar el proyecto',
                icon: 'error'
            });
        }
    })
    .catch(error => {
        console.error('Error al editar proyecto:', error);
        Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error al editar el proyecto',
            icon: 'error'
        });
    });
}


function seleccionarProyecto(idProyecto, nombre) {
    document.getElementById('nombre_proyecto').value = nombre;
    document.getElementById('cve_proyecto').value = idProyecto; // Asegúrate de que este campo exista en el HTML
    localStorage.setItem('selectedProjectId', idProyecto);
}

function obtenerIdProyectoSeleccionado() {
    // Obtener el ID del proyecto seleccionado guardado en localStorage
    return localStorage.getItem('selectedProjectId');
}

function limpiarFormulario(){
    document.getElementById('cve_proyecto').value = '';
    document.getElementById('nombre_proyecto').value = '';
    document.getElementById('search-input').value = '';
}

function validarFormulario() {
    const nombre = document.getElementById('nombre_proyecto').value;
    // Verificar que no haya campos vacíos
    if (nombre.trim() === '') {
        Swal.fire({
            title: 'Advertencia',
            text: 'No se pueden enviar campos vacíos',
            icon: 'warning'
        });
        return false;
    }

    return true;
}
