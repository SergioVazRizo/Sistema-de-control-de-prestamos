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
});

function verificarToken() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = BASE_URL + 'SistemaGestion/index.html';
    }
}

function cerrarSesion() {
    const usuario = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');

    if (!usuario || !token) {
        console.error('No se encontraron usuario o token en el localStorage');
        return;
    }

    fetch(BASE_URL + 'SistemaGestion/api/login/cerrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'usuario=' + encodeURIComponent(usuario) + '&token=' + encodeURIComponent(token)
    })
            .then(response => {
                if (response.ok) {
                    localStorage.removeItem('usuario');
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

document.addEventListener('DOMContentLoaded', function () {
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

window.onload = function () {
    verificarToken();
    cargarUsuarios();
}

//Funciones propias
let paginaActual = 0;
const usuariosPorPagina = 10;

function cargarPaginaAnterior() {
    if (paginaActual > 0) {
        paginaActual--;
        cargarUsuarios();
    }
}

function cargarPaginaSiguiente() {
    paginaActual++;
    cargarUsuarios();
}

function cargarUsuarios() {
    const inicio = paginaActual * usuariosPorPagina;
    fetch(BASE_URL + `SistemaGestion/api/usuario/getAllUsuariosPaginados?inicio=${inicio}&cantidad=${usuariosPorPagina}`)
            .then(response => response.json())
            .then(data => {
                const tablaUsuarios = document.getElementById('tablaUsuarios');
                tablaUsuarios.innerHTML = ''; // Limpiar tabla

                data.forEach(usuario => {
                    const row = `
                <tr>
                    <td>${usuario.cve_usuario}</td>
                    <td>${usuario.usuario}</td>
                    <td>${usuario.password}</td>
                    <td>${usuario.a_paterno}</td>
                    <td>${usuario.a_materno}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.rol}</td>
                    <td>${usuario.extension}</td>
                    <td>${usuario.email}</td>
                    <td>
                        <button type="button" class="btn btn-info" onclick="seleccionarUsuario('${usuario.usuario}', '${usuario.password}', ${usuario.cve_usuario}, '${usuario.a_paterno}', '${usuario.a_materno}', '${usuario.nombre}', '${usuario.rol}', '${usuario.extension}', '${usuario.email}')" data-id="${usuario.cve_usuario}"><i class='bx bxs-select-multiple'></i></button>
                    </td>
                </tr>
            `;
                    tablaUsuarios.innerHTML += row;
                });
            })
            .catch(error => {
                console.error('Error al cargar usuarios:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Ha ocurrido un error al cargar usuarios',
                    icon: 'error'
                });
            });
}

function buscarUsuario() {
    const searchInput = document.getElementById('search-input').value.trim().toLowerCase();
    fetch(BASE_URL + `SistemaGestion/api/usuario/buscarUsuario?query=${searchInput}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                const tablaUsuarios = document.getElementById('tablaUsuarios');
                tablaUsuarios.innerHTML = ''; // Limpiar tabla

                data.forEach(usuario => {
                    const row = `
                    <tr>
                        <td>${usuario.cve_usuario}</td>
                        <td>${usuario.usuario}</td>
                        <td>${usuario.password}</td>
                        <td>${usuario.a_paterno}</td>
                        <td>${usuario.a_materno}</td>
                        <td>${usuario.nombre}</td>
                        <td>${usuario.rol}</td>
                        <td>${usuario.extension}</td>
                        <td>${usuario.email}</td>
                        <td>
                            <button type="button" class="btn btn-info" onclick="seleccionarUsuario('${usuario.usuario}', '${usuario.password}', ${usuario.cve_usuario}, '${usuario.a_paterno}', '${usuario.a_materno}', '${usuario.nombre}', '${usuario.rol}', '${usuario.extension}', '${usuario.email}')" data-id="${usuario.cve_usuario}"><i class='bx bxs-select-multiple'></i></button>
                        </td>
                    </tr>
                `;
                    tablaUsuarios.innerHTML += row;
                });
            })
            .catch(error => {
                console.error('Error al buscar usuarios:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Ha ocurrido un error al buscar usuarios',
                    icon: 'error'
                });
            });
}


function agregarUsuario() {
    if (!validarFormulario()) {
        return;
    }

    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;
    const a_paterno = document.getElementById('a_paterno').value;
    const a_materno = document.getElementById('a_materno').value;
    const nombre = document.getElementById('nombre').value;
    const rol = document.getElementById('rol').value;
    const extension = document.getElementById('extension').value;
    const email = document.getElementById('email').value;

    fetch(BASE_URL + 'SistemaGestion/api/usuario/agregarUsuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `usuario=${encodeURIComponent(usuario)}&password=${encodeURIComponent(password)}&a_paterno=${encodeURIComponent(a_paterno)}&a_materno=${encodeURIComponent(a_materno)}&nombre=${encodeURIComponent(nombre)}&rol=${encodeURIComponent(rol)}&extension=${encodeURIComponent(extension)}&email=${encodeURIComponent(email)}`
    })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        title: 'Éxito',
                        text: 'Usuario agregado correctamente',
                        icon: 'success'
                    }).then(() => {
                        cargarUsuarios();
                        limpiarFormulario();
                    });
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'No se pudo agregar el usuario',
                        icon: 'error'
                    });
                }
            })
            .catch(error => {
                console.error('Error al agregar usuario:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Ha ocurrido un error al agregar el usuario',
                    icon: 'error'
                });
            });
}

function editarUsuario() {
    const idUsuario = obtenerIdUsuarioSeleccionado();
    if (!idUsuario) {
        console.error('No se ha seleccionado ningún usuario para editar');
        return;
    }

    if (!validarFormulario()) {
        return;
    }

    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;
    const a_paterno = document.getElementById('a_paterno').value;
    const a_materno = document.getElementById('a_materno').value;
    const nombre = document.getElementById('nombre').value;
    const rol = document.getElementById('rol').value;
    const extension = document.getElementById('extension').value;
    const email = document.getElementById('email').value;

    fetch(BASE_URL + 'SistemaGestion/api/usuario/editarUsuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `cve_usuario=${encodeURIComponent(idUsuario)}&usuario=${encodeURIComponent(usuario)}&password=${encodeURIComponent(password)}&a_paterno=${encodeURIComponent(a_paterno)}&a_materno=${encodeURIComponent(a_materno)}&nombre=${encodeURIComponent(nombre)}&rol=${encodeURIComponent(rol)}&extension=${encodeURIComponent(extension)}&email=${encodeURIComponent(email)}`
    })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        title: 'Éxito',
                        text: 'Usuario editado correctamente',
                        icon: 'success'
                    }).then(() => {
                        cargarUsuarios();
                        limpiarFormulario();
                        localStorage.removeItem('selectedUserId'); // Limpiar el ID del usuario seleccionado
                    });
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'No se pudo editar el usuario',
                        icon: 'error'
                    });
                }
            })
            .catch(error => {
                console.error('Error al editar usuario:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Ha ocurrido un error al editar el usuario',
                    icon: 'error'
                });
            });
}

function seleccionarUsuario(usuario, password, idUsuario, a_paterno, a_materno, nombre, rol, extension, email) {
    document.getElementById('usuario').value = usuario;
    document.getElementById('password').value = password;
    document.getElementById('a_paterno').value = a_paterno;
    document.getElementById('a_materno').value = a_materno;
    document.getElementById('nombre').value = nombre;
    document.getElementById('rol').value = rol;
    document.getElementById('extension').value = extension;
    document.getElementById('email').value = email;
    localStorage.setItem('selectedUserId', idUsuario);
}

function obtenerIdUsuarioSeleccionado() {
    // Obtener el ID del usuario seleccionado guardado en localStorage
    return localStorage.getItem('selectedUserId');
}

function limpiarFormulario() {
    document.getElementById('usuario').value = '';
    document.getElementById('password').value = '';
    document.getElementById('a_paterno').value = '';
    document.getElementById('a_materno').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('rol').value = '';
    document.getElementById('extension').value = '';
    document.getElementById('email').value = '';
    document.getElementById('search-input').value = '';
}

function validarFormulario() {
    const a_paterno = document.getElementById('a_paterno').value;
    const a_materno = document.getElementById('a_materno').value;
    const nombre = document.getElementById('nombre').value;
    const rol = document.getElementById('rol').value;
    const extension = document.getElementById('extension').value;
    const email = document.getElementById('email').value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
            a_paterno.trim() === '' ||
            a_materno.trim() === '' ||
            nombre.trim() === '' ||
            rol.trim() === '' ||
            extension.trim() === '' ||
            !/^\d+$/.test(extension.trim()) ||
            email.trim() === '' ||
            !emailRegex.test(email.trim())
            ) {
        Swal.fire({
            title: 'Advertencia',
            text: 'Faltan Datos, la extensión no es numérica o el email no es válido',
            icon: 'warning'
        });
        return false;
    }

    return true;
}

function iniciarReconocimientoVoz() {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'es-ES'; // Configura el idioma español
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript.toLowerCase();
        procesarTextoVoz(speechResult);
    };

    recognition.onerror = (event) => {
        console.error("Error en el reconocimiento de voz: ", event.error);
        Swal.fire({
            icon: 'error',
            title: 'Error en el reconocimiento de voz',
            text: event.error,
        });
    };

    recognition.start();
}

function procesarTextoVoz(texto) {
    const datosUsuario = {};

    if (texto.includes("usuario")) {
        const usuario = obtenerValorCampo(texto, "usuario");
        if (usuario)
            datosUsuario.usuario = usuario;
    }
    if (texto.includes("contraseña")) {
        const password = obtenerValorCampo(texto, "contraseña");
        if (password)
            datosUsuario.password = password;
    }
    if (texto.includes("apellido paterno")) {
        const aPaterno = obtenerValorCampo(texto, "apellido paterno");
        if (aPaterno)
            datosUsuario.a_paterno = aPaterno;
    }
    if (texto.includes("apellido materno")) {
        const aMaterno = obtenerValorCampo(texto, "apellido materno");
        if (aMaterno)
            datosUsuario.a_materno = aMaterno;
    }
    if (texto.includes("nombre")) {
        const nombre = obtenerValorCampo(texto, "nombre");
        if (nombre)
            datosUsuario.nombre = nombre;
    }
    if (texto.includes("rol")) {
        const rol = obtenerValorCampo(texto, "rol");
        if (rol)
            datosUsuario.rol = rol;
    }
    if (texto.includes("extensión")) {
        const extension = obtenerValorCampo(texto, "extensión");
        if (extension)
            datosUsuario.extension = extension;
    }
    if (texto.includes("email")) {
        const email = obtenerValorCampo(texto, "email");
        if (email)
            datosUsuario.email = email;
    }

    if (Object.keys(datosUsuario).length > 0) {
        llenarFormulario(datosUsuario);
    } else {
        Swal.fire({
            icon: 'error',
            title: 'No se reconocieron suficientes datos',
            text: 'Por favor, intente de nuevo.',
        });
    }
}

function obtenerValorCampo(texto, campo) {
    const regex = new RegExp(`${campo}\\s*([\\w\\s@.]+)`, 'i'); // Actualiza el regex para capturar email y más caracteres
    const match = texto.match(regex);
    return match ? match[1].trim() : null;
}

function llenarFormulario(datosUsuario) {
    const campos = {
        'usuario': 'usuario',
        'password': 'password',
        'a_paterno': 'a_paterno',
        'a_materno': 'a_materno',
        'nombre': 'nombre',
        'rol': 'rol',
        'extension': 'extension',
        'email': 'email'
    };

    for (const [key, value] of Object.entries(datosUsuario)) {
        const campo = document.getElementById(campos[key]);
        if (campo && value) {
            // Solo actualiza el campo si no tiene valor o si el nuevo valor es diferente
            if (!campo.value || campo.value !== value) {
                campo.value = value;
            }
        }
    }

    Swal.fire({
        icon: 'success',
        title: 'Formulario actualizado con éxito',
        text: 'Los datos se han actualizado en el formulario.',
    });
}
