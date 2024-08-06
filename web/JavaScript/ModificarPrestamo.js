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

// Funciones Propias
document.addEventListener('DOMContentLoaded', function () {
    const buscarBtn = document.getElementById('buscarClave');
    const contenidoPrincipal = document.querySelector('.datos');

    buscarBtn.addEventListener('click', function () {
        contenidoPrincipal.style.display = 'block';
    });
});

// Función para buscar un préstamo por su clave
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

function formatDate(dateString) {
    if (!dateString) return '00/00/0000';

    // Verificar si el formato ya es YYYY-MM-DD
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (regex.test(dateString)) {
        return dateString; // Ya está en el formato correcto
    }

    // Crear una instancia de Date a partir de la cadena de fecha
    const date = new Date(dateString);
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) return '00/00/0000';

    // Obtener los componentes de la fecha (año, mes, día)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses están basados en 0
    const day = String(date.getDate()).padStart(2, '0');

    // Devolver la fecha en formato YYYY-MM-DD
    return `${year}-${month}-${day}`;
}

// Función para llenar el formulario con los datos del préstamo encontrado
function llenarFormulario(prestamo) {
    document.getElementById('buscar-usuario').value = prestamo.usuario;
    document.getElementById('email').value = prestamo.correo;
    document.getElementById('rol').value = prestamo.rol;
    document.getElementById('lugar_de_uso').value = prestamo.lugarDeUso;
    document.getElementById('proyecto_de_apoyo').value = prestamo.ProyectoApoyo;
    document.getElementById('Fecha_salida').value = formatDate(prestamo.Fecha_salida);
    document.getElementById('Fecha_vencimiento').value = formatDate(prestamo.Fecha_vencimiento);
}

// Función para limpiar el formulario y la tabla de artículos
function limpiarFormulario() {
    document.getElementById('search-input').value = '';
    document.getElementById('buscar-usuario').value = '';
    document.getElementById('email').value = '';
    document.getElementById('rol').value = '';
    document.getElementById('lugar_de_uso').value = '';
    document.getElementById('proyecto_de_apoyo').value = '';
    document.getElementById('Fecha_salida').value = '';
    document.getElementById('Fecha_vencimiento').value = '';

    // Limpiar la tabla de los artículos
    var tablaArticulos = document.getElementById('tablaArticulosParaPrestamo');
    tablaArticulos.innerHTML = '';

    var tablaArticulos = document.getElementById('tablaArticulosParaPrestamoAgregar');
    tablaArticulos.innerHTML = '';
}

//Funcion para eliminar articulo de la tabla
function eliminarArticulo(row) {
    let claveArticulo = row.getAttribute('data-clave');
    console.log('Clave del artículo:', claveArticulo);
    row.remove();
}

//Funcion para eliminar un articulo que ya estaba en el prestamo
function eliminarArticuloPrestamo(row) {
    let idArticulo = row.getAttribute('data-id');
    let claveArticulo = row.getAttribute('data-clave');

    Swal.fire({
        title: '¿Estás seguro de eliminar el artículo?',
        text: 'No se podra cancelar el movimiento',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(BASE_URL+`api/prestamo/eliminarArticulo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `id_articulo=${encodeURIComponent(idArticulo)}&clave_articulo=${encodeURIComponent(claveArticulo)}`
            })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error en la respuesta de la red');
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data.success) {
                            Swal.fire({
                                title: 'Eliminado',
                                text: 'El artículo ha sido eliminado del préstamo',
                                icon: 'success'
                            });
                            row.remove();
                        } else {
                            Swal.fire({
                                title: 'Error',
                                text: data.error,
                                icon: 'error'
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Error al eliminar el artículo del préstamo:', error);
                        Swal.fire({
                            title: 'Error',
                            text: 'Ha ocurrido un error al eliminar el artículo del préstamo',
                            icon: 'error'
                        });
                    });
        }
    });
}


// Función para llenar la tabla de artículos del préstamo encontrado
function llenarTablaArticulos(articulos) {
    const tablaArticulos = document.getElementById('tablaArticulosParaPrestamo');
    tablaArticulos.innerHTML = '';

    articulos.forEach(articulo => {
        const fila = document.createElement('tr');
        fila.setAttribute('data-id', articulo.id_articulo);
        fila.setAttribute('data-clave', articulo.claveArticulo);
        fila.innerHTML = `
            <td>${articulo.id_articulo}</td>
            <td>${articulo.claveArticulo}</td>
            <td>${articulo.descripcion}</td>
            <td>
                <button class="noselect" onclick="eliminarArticuloPrestamo(this.parentNode.parentNode)">
                    <span class="text">Eliminar</span>
                    <span class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
                        </svg>
                    </span>
                </button>
            </td>
        `;
        tablaArticulos.appendChild(fila);
    });
}


// Función para buscar un artículo por su clave
document.addEventListener('DOMContentLoaded', () => {
    let searchInput = document.getElementById('search-input-products');
    let searchTimeout;

    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            buscarArticulo(searchInput.value);
        }, 500);
    });
});

// funcion para buscar un articulo 
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

// Función para agregar los artículos buscados a la tabla
function agregarArticulosATabla(articulos) {
    let tabla = document.getElementById('tablaArticulosParaPrestamoAgregar');

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

// Función para limpiar el input de búsqueda de artículos
function limpiarInputBusqueda() {
    document.getElementById('search-input-products').value = '';
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

// Función para modificar un préstamo
function modificarPrestamo() {
    const clavePrestamo = document.getElementById('search-input').value;
    const usuario = document.getElementById('buscar-usuario').value;
    const correo = document.getElementById('email').value;
    const rol = document.getElementById('rol').value;
    const lugarDeUso = document.getElementById('lugar_de_uso').value;
    const ProyectoApoyo = document.getElementById('proyecto_de_apoyo').value;
    const Fecha_salida = document.getElementById("Fecha_salida").value;
    const Fecha_vencimiento = document.getElementById("Fecha_vencimiento").value;

    // Obtener los artículos seleccionados de la tabla
    var tablaArticulos = document.getElementById('tablaArticulosParaPrestamoAgregar');
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
    
    console.log("articulos");
    console.log(articulos); // Para verificar los datos en la consola

    fetch(BASE_URL+`SistemaGestion/api/prestamo/modificarPrestamo/${clavePrestamo}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `usuario=${encodeURIComponent(usuario)}&correo=${encodeURIComponent(correo)}&rol=${encodeURIComponent(rol)}&lugarDeUso=${encodeURIComponent(lugarDeUso)}&ProyectoApoyo=${encodeURIComponent(ProyectoApoyo)}&Fecha_salida=${encodeURIComponent(Fecha_salida)}&Fecha_vencimiento=${encodeURIComponent(Fecha_vencimiento)}&articulos=${encodeURIComponent(JSON.stringify(articulos))}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                title: 'Éxito',
                text: `Préstamo editado correctamente.`,
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
    })
    .catch(error => {
        console.error('Error al editar el préstamo:', error);
        Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error al realizar el préstamo',
            icon: 'error'
        });
    });
}
