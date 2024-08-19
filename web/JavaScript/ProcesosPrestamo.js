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
        window.location.href = BASE_URL+'SistemaGestion/index.html';
    }
}

window.onload = function () {
    verificarToken();
    cargarLugares();
    cargarProyectos();
    cargarUsuarios();
    configurarFechas();
};

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
                        window.location.href = BASE_URL+'SistemaGestion/index.html';
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
let usuarios = [];

function cargarUsuarios() {
    fetch(BASE_URL+'SistemaGestion/api/usuario/getAllUsuarios')
            .then(response => response.json())
            .then(data => {
                usuarios = data.sort((a, b) => {
                    const nombreCompletoA = `${a.nombre} ${a.a_paterno} ${a.a_materno}`.toLowerCase();
                    const nombreCompletoB = `${b.nombre} ${b.a_paterno} ${b.a_materno}`.toLowerCase();
                    if (nombreCompletoA < nombreCompletoB)
                        return -1;
                    if (nombreCompletoA > nombreCompletoB)
                        return 1;
                    return 0;
                });
            })
            .catch(error => console.error('Error al cargar usuarios:', error));
}

function actualizarListaUsuarios(usuariosFiltrados) {
    const listaUsuarios = document.getElementById('lista-usuarios');
    const rolSelect = document.getElementById('rol');
    const correoInput = document.getElementById('email');

    listaUsuarios.innerHTML = "";

    if (usuariosFiltrados.length === 0) {
        listaUsuarios.style.display = 'none';
        return;
    }

    usuariosFiltrados.forEach(usuario => {
        const li = document.createElement('li');
        li.textContent = `${usuario.nombre} ${usuario.a_paterno} ${usuario.a_materno}`;
        li.setAttribute('data-value', usuario.cve_usuario);
        li.onclick = function () {
            document.getElementById('buscar-usuario').value = li.textContent;
            listaUsuarios.style.display = 'none';

            const rolUsuario = usuario.rol;
            const correoUsuario = usuario.email;

            if (rolUsuario) {
                const rolOption = Array.from(rolSelect.options).find(option => option.value === rolUsuario);
                if (rolOption) {
                    rolOption.selected = true;
                }
            }
            if (correoUsuario) {
                correoInput.value = correoUsuario;
            }
        };
        listaUsuarios.appendChild(li);
    });

    listaUsuarios.style.display = 'block';
}

function filtrarUsuarios() {
    const input = document.getElementById('buscar-usuario').value.toLowerCase();
    const usuariosFiltrados = usuarios.filter(usuario => {
        const nombreCompleto = `${usuario.nombre} ${usuario.a_paterno} ${usuario.a_materno}`.toLowerCase();
        return nombreCompleto.includes(input);
    });

    actualizarListaUsuarios(usuariosFiltrados);
}

function cargarLugares() {
    fetch(BASE_URL+'SistemaGestion/api/lugar/getAllLugares')
            .then(response => response.json())
            .then(data => {
                const selectLugar = document.getElementById('lugar_de_uso');
                selectLugar.innerHTML = "";
                data.forEach(lugar => {
                    const option = document.createElement('option');
                    option.value = lugar.nombre;
                    option.textContent = lugar.nombre;
                    selectLugar.appendChild(option);
                });
            })
            .catch(error => console.error('Error al cargar lugares:', error));
}

function cargarProyectos() {
    fetch(BASE_URL+'SistemaGestion/api/proyecto/getAllProyectos')
            .then(response => response.json())
            .then(data => {
                const selectProyecto = document.getElementById('proyecto_de_apoyo');
                selectProyecto.innerHTML = "";
                data.forEach(proyecto => {
                    const option = document.createElement('option');
                    option.value = proyecto.nombre;
                    option.textContent = proyecto.nombre;
                    selectProyecto.appendChild(option);
                });
            })
            .catch(error => console.error('Error al cargar proyectos:', error));
}

function limpiarFormulario() {
    document.getElementById("buscar-usuario").value = "";
    document.getElementById("email").value = "";
    document.getElementById("rol").selectedIndex = 0;
    document.getElementById("lugar_de_uso").selectedIndex = 0;
    document.getElementById("proyecto_de_apoyo").selectedIndex = 0;
}

document.addEventListener('DOMContentLoaded', () => {
    let searchInput = document.getElementById('search-input');
    let searchTimeout;

    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            buscarArticulo(searchInput.value);
        }, 500);
    });
});

async function buscarArticulo(query) {
    if (query.trim() === "") {
        return;
    }
    try {
        const response = await fetch(BASE_URL+`SistemaGestion/api/articulo/buscarArticulo?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error("Error en la búsqueda del artículo");
        }
        const articulos = await response.json();
        agregarArticulosATabla(articulos);
        limpiarInputBusqueda();
    } catch (error) {
        console.error('Error al buscar el artículo:', error);
    }
}

function agregarArticulosATabla(articulos) {
    let tabla = document.getElementById('tablaArticulosParaPrestamo');

    articulos.forEach(articulo => {
        let row = tabla.insertRow();
        row.setAttribute('data-id', articulo.id_articulo);

        let cellId = row.insertCell(0);
        cellId.textContent = articulo.id_articulo;

        let cellClave = row.insertCell(1);
        cellClave.textContent = articulo.claveArticulo;

        let cellDescripcion = row.insertCell(2);
        cellDescripcion.textContent = articulo.descripcion;

        let cellEliminar = row.insertCell(3);
        let btnEliminar = document.createElement('button');
        btnEliminar.className = 'noselect';
        btnEliminar.innerHTML = '<span class="text">Eliminar</span><span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path></svg></span>';
        btnEliminar.addEventListener('click', () => eliminarArticulo(row));
        cellEliminar.appendChild(btnEliminar);
    });
}


function eliminarArticulo(row) {
    let claveArticulo = row.getAttribute('data-clave');
    row.remove();
}

function limpiarInputBusqueda() {
    let searchInput = document.getElementById('search-input');
    searchInput.value = '';
}

function limpiarTablaArticulos() {
    const tabla = document.getElementById('tablaArticulosParaPrestamo');
    while (tabla.rows.length > 0) {
        tabla.deleteRow(0);
    }
}

function configurarFechas() {
    const fechaActual = new Date();
    const fechaSalidaInput = document.getElementById('fecha_salida');
    const fechaVencimientoInput = document.getElementById('fecha_vencimiento');
    const fechaActualFormateada = fechaActual.toISOString().split('T')[0];
    fechaSalidaInput.value = fechaActualFormateada;

    const fechaVencimiento = new Date(fechaActual);
    fechaVencimiento.setDate(fechaVencimiento.getDate() + 30);
    const fechaVencimientoFormateada = fechaVencimiento.toISOString().split('T')[0];
    fechaVencimientoInput.value = fechaVencimientoFormateada;
}

function hacerPrestamo() {
    const usuario = document.getElementById('buscar-usuario').value.trim();
    const correo = document.getElementById('email').value.trim();
    const rol = document.getElementById('rol').value.trim();
    const lugarDeUso = document.getElementById('lugar_de_uso').value.trim();
    const ProyectoApoyo = document.getElementById('proyecto_de_apoyo').value.trim();
    const Fecha_salida = document.getElementById('fecha_salida').value.trim();
    const Fecha_vencimiento = document.getElementById('fecha_vencimiento').value.trim();
    const Fecha_devolucion = ''; // Cambié null a cadena vacía para evitar problemas en el servidor

    // Obtener los artículos seleccionados de la tabla
    var tablaArticulos = document.getElementById('tablaArticulosParaPrestamo');
    var filasArticulos = tablaArticulos.getElementsByTagName('tr');
    var articulos = [];
    for (var i = 0; i < filasArticulos.length; i++) {
        var id_articulo = filasArticulos[i].getAttribute('data-id');
        var descripcion = filasArticulos[i].getElementsByTagName('td')[2].innerText;
        var claveArticulo = filasArticulos[i].getElementsByTagName('td')[1].innerText;
        articulos.push({
            id_articulo: id_articulo,
            descripcion: descripcion,
            claveArticulo: claveArticulo
        });
    }

    // Validar que todos los campos estén llenos y que haya al menos un artículo
    if (articulos.length === 0) {
        Swal.fire({
            title: 'Advertencia',
            text: 'Todos los préstamos deben tener al menos un artículo',
            icon: 'warning'
        });
        return false;
    }

    if (
        usuario === '' ||
        correo === '' ||
        rol === '' ||
        lugarDeUso === '' ||
        ProyectoApoyo === '' ||
        Fecha_salida === '' ||
        Fecha_vencimiento === ''
    ) {
        Swal.fire({
            title: 'Advertencia',
            text: 'Todos los campos son obligatorios',
            icon: 'warning'
        });
        return false;
    }

    // Enviar la solicitud de préstamo
    fetch(BASE_URL+'SistemaGestion/api/prestamo/hacerPrestamo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `usuario=${encodeURIComponent(usuario)}&correo=${encodeURIComponent(correo)}&rol=${encodeURIComponent(rol)}&lugarDeUso=${encodeURIComponent(lugarDeUso)}&ProyectoApoyo=${encodeURIComponent(ProyectoApoyo)}&Fecha_salida=${encodeURIComponent(Fecha_salida)}&Fecha_vencimiento=${encodeURIComponent(Fecha_vencimiento)}&Fecha_devolucion=${encodeURIComponent(Fecha_devolucion)}&articulos=${encodeURIComponent(JSON.stringify(articulos))}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                title: 'Éxito',
                text: `Clave del préstamo: ${data.clave_prestamo}`,
                icon: 'success'
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: data.error || 'No se pudo hacer el préstamo',
                icon: 'error'
            });
        }
        limpiarFormulario();
        limpiarTablaArticulos();
    })
    .catch(error => {
        console.error('Error al realizar el préstamo:', error);
        Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error al realizar el préstamo',
            icon: 'error'
        });
    });
}
