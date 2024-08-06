//URL BASE
function setBaseURL() {
    const URL_BASE = 'http://localhost:8080/';
    return URL_BASE;
}

// Llama a la función y almacena el resultado en una constante global
const BASE_URL = setBaseURL();

//Funciones
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
        cargarLugares();
    };
});

function verificarToken() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = BASE_URL + 'SistemaGestion/index.html';
    }
}

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
                window.location.href = BASE_URL + 'index.html';
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
let paginaActual = 0;
const LugaresPorPagina = 10;

function cargarPaginaAnterior() {
    if (paginaActual > 0) {
        paginaActual--;
        cargarLugares();
    }
}

function cargarPaginaSiguiente() {
    paginaActual++;
    cargarLugares();
}

function cargarLugares() {
    const inicio = paginaActual * LugaresPorPagina;
    fetch(BASE_URL + `SistemaGestion/api/lugar/getAllLugaresPaginados?inicio=${inicio}&cantidad=${LugaresPorPagina}`)
    .then(response => response.json())
    .then(data => {
        const tablaLugares = document.getElementById('tablaLugares');
        tablaLugares.innerHTML = ''; // Limpiar tabla

        data.forEach(lugar => {
            const row = `
                <tr>
                    <td>${lugar.cveLugar}</td>
                    <td>${lugar.ubicacion}</td>
                    <td>${lugar.nombre}</td>
                    <td>
                        <button type="button" class="btn btn-info" onclick="seleccionarLugar('${lugar.ubicacion}','${lugar.nombre}',${lugar.cveLugar})"data-id="${lugar.cveLugar}"><i class='bx bxs-select-multiple'></i></button>
                    </td>
                </tr>
            `;
            tablaLugares.innerHTML += row;
        });
    })
    .catch(error => {
        console.error('Error al cargar lugares:', error);
        Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error al cargar lugares',
            icon: 'error'
        });
    });
}

function buscarLugar() {
    const searchInput = document.getElementById('search-input').value.trim().toLowerCase();
    fetch(BASE_URL + `SistemaGestion/api/lugar/buscarLugar?query=${searchInput}`)
        .then(response => response.json())
        .then(data => {
            const tablaLugares = document.getElementById('tablaLugares');
            tablaLugares.innerHTML = ''; // Limpiar tabla

            data.forEach(lugar => {
                const row = `
                    <tr>
                        <td>${lugar.cveLugar}</td>
                        <td>${lugar.ubicacion}</td>
                        <td>${lugar.nombre}</td>
                        <td>
                            <button type="button" class="btn btn-info" onclick="seleccionarLugar('${lugar.ubicacion}','${lugar.nombre}',${lugar.cveLugar})"data-id="${lugar.cveLugar}"><i class='bx bxs-select-multiple'></i></button>
                        </td>
                    </tr>
                `;
                tablaLugares.innerHTML += row;
            });
        })
        .catch(error => {
            console.error('Error al buscar lugares:', error);
            Swal.fire({
                title: 'Error',
                text: 'Ha ocurrido un error al buscar lugares',
                icon: 'error'
            });
        });
}

function agregarLugar() {   
    if (!validarFormulario()) {
        return;
    }
    
    const ubicacion = document.getElementById('ubicacion').value;
    const nombre = document.getElementById('nombre').value;

    fetch(BASE_URL + 'SistemaGestion/api/lugar/agregarLugar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `ubicacion=${encodeURIComponent(ubicacion)}&nombre=${encodeURIComponent(nombre)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                title: 'Éxito',
                text: 'Lugar agregado correctamente',
                icon: 'success'
            }).then(() => {
                cargarLugares();
                limpiarFormulario();
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'No se pudo agregar el lugar',
                icon: 'error'
            });
        }
    })
    .catch(error => {
        console.error('Error al agregar lugar:', error);
        Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error al agregar el lugar',
            icon: 'error'
        });
    });
}

function editarLugar() {
    const idLugar = obtenerIdLugarSeleccionado();
    if (!idLugar) {
        console.error('No se ha seleccionado ningún lugar para editar');
        return;
    }

    if (!validarFormulario()) {
        return;
    }

    const ubicacion = document.getElementById('ubicacion').value;
    const nombre = document.getElementById('nombre').value;

    fetch(BASE_URL + 'SistemaGestion/api/lugar/editarLugar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `cve_lugar=${encodeURIComponent(idLugar)}&ubicacion=${encodeURIComponent(ubicacion)}&nombre=${encodeURIComponent(nombre)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                title: 'Éxito',
                text: 'Lugar editado correctamente',
                icon: 'success'
            }).then(() => {
                cargarLugares();
                limpiarFormulario();
                localStorage.removeItem('selectedPlaceId');
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'No se pudo editar el lugar',
                icon: 'error'
            });
        }
    })
    .catch(error => {
        console.error('Error al editar lugar:', error);
        Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error al editar el lugar',
            icon: 'error'
        });
    });
}

function seleccionarLugar(ubicacion, nombre, idLugar) {
    document.getElementById('cve_lugar').value = idLugar;
    document.getElementById('ubicacion').value = ubicacion;
    document.getElementById('nombre').value = nombre;
    localStorage.setItem('selectedPlaceId', idLugar);
}

function limpiarFormulario() {
    document.getElementById('cve_lugar').value = '';
    document.getElementById('ubicacion').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('search-input').value = '';
}

function obtenerIdLugarSeleccionado() {
    return localStorage.getItem('selectedPlaceId');
}

function validarFormulario() {
    const ubicacion = document.getElementById('ubicacion').value;
    const nombre = document.getElementById('nombre').value;

    if (!ubicacion || !nombre) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, complete todos los campos',
            icon: 'error'
        });
        return false;
    }

    return true;
}
