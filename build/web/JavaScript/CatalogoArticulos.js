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
        cargarArticulos();
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
const ArticulosPorPagina = 10;

function cargarPaginaAnterior() {
    if (paginaActual > 0) {
        paginaActual--;
        cargarArticulos();
    }
}

function cargarPaginaSiguiente() {
    paginaActual++;
    cargarArticulos();
}

function cargarArticulos() {
    const inicio = paginaActual * ArticulosPorPagina;
    fetch(BASE_URL+`SistemaGestion/api/articulo/getAllArticulosPaginados?inicio=${inicio}&cantidad=${ArticulosPorPagina}`)
    .then(response => response.json())
    .then(data => {
        const tablaArticulos = document.getElementById('tablaArticulos');
        tablaArticulos.innerHTML = ''; // Limpiar tabla

        data.forEach(articulo => {
            const row = `
                <tr>
                    <td>${articulo.id_articulo}</td>
                    <td>${articulo.claveArticulo}</td>
                    <td>${articulo.descripcion}</td>
                    <td>${articulo.modelo}</td>
                    <td>${articulo.marca}</td>
                    <td>${articulo.numSerie}</td>
                    <td>${articulo.estatus}</td>
                    <td>${articulo.responsable}</td>
                    <td>${articulo.cuenta}</td>
                    <td>
                        <button type="button" class="btn btn-info" onclick="seleccionarArticulo('${articulo.id_articulo}','${articulo.claveArticulo}', '${articulo.descripcion}', '${articulo.modelo}', '${articulo.marca}', '${articulo.numSerie}', '${articulo.estatus}', '${articulo.responsable}', '${articulo.cuenta}')" data-id="${articulo.id_articulo}"><i class='bx bxs-select-multiple'></i></button>
                    </td>
                </tr>
            `;
            tablaArticulos.innerHTML += row;
        });
    })
    .catch(error => {
        console.error('Error al cargar artículos:', error);
        Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error al cargar artículos',
            icon: 'error'
        });
    });
}

function buscarArticulo() {
    const searchInput = document.getElementById('search-input').value.trim().toLowerCase();
    fetch(BASE_URL+`SistemaGestion/api/articulo/buscarArticulo?query=${searchInput}`)
        .then(response => response.json())
        .then(data => {
            const tablaArticulos = document.getElementById('tablaArticulos');
            tablaArticulos.innerHTML = ''; // Limpiar tabla

            data.forEach(articulo => {
                const row = `
                    <tr>
                        <td>${articulo.id_articulo}</td>
                        <td>${articulo.claveArticulo}</td>
                        <td>${articulo.descripcion}</td>
                        <td>${articulo.modelo}</td>
                        <td>${articulo.marca}</td>
                        <td>${articulo.numSerie}</td>
                        <td>${articulo.estatus}</td>
                        <td>${articulo.responsable}</td>
                        <td>${articulo.cuenta}</td>
                        <td>
                            <button type="button" class="btn btn-info" onclick="seleccionarArticulo('${articulo.id_articulo}','${articulo.claveArticulo}', '${articulo.descripcion}', '${articulo.modelo}', '${articulo.marca}', '${articulo.numSerie}', '${articulo.estatus}', '${articulo.responsable}', '${articulo.cuenta}')" data-id="${articulo.id_articulo}"><i class='bx bxs-select-multiple'></i></button>
                        </td>
                    </tr>
                `;
                tablaArticulos.innerHTML += row;
            });
        })
        .catch(error => {
            console.error('Error al buscar artículos:', error);
            Swal.fire({
                title: 'Error',
                text: 'Ha ocurrido un error al buscar artículos',
                icon: 'error'
            });
        });
}

function agregarArticulo() {
    var data = {
        clave_articulo: document.getElementById("cve_articulo").value,
        adicion : 0,
        descripcion: document.getElementById("descripcion").value,
        modelo: document.getElementById("modelo").value,
        marca: document.getElementById("marca").value,
        num_serie: document.getElementById("num_serie").value,
        estatus: document.getElementById("estatus").value,
        responsable: document.getElementById("responsable").value,
        cuenta: document.getElementById("cuenta").value
    };

    fetch(BASE_URL+'SistemaGestion/api/articulo/agregarArticulo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                title: 'Éxito',
                text: 'Articulo agregado correctamente',
                icon: 'success'
            }).then(() => {
                cargarArticulos();
                limpiarFormulario();
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'No se pudo agregar el articulo',
                icon: 'error'
            });
        }
    })
    .catch(error => {
        console.error('Error al agregar articulo:', error);
        Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error al agregar el articulo',
            icon: 'error'
        });
    });
}


function editarArticulo() {
    const id_articulo = obtenerIdArticuloSeleccionado();
    if (!id_articulo) {
        console.error('No se ha seleccionado ningún artículo para editar');
        return;
    }

    const clave_articulo = document.getElementById('cve_articulo').value;
    const descripcion = document.getElementById('descripcion').value;
    const modelo = document.getElementById('modelo').value;
    const marca = document.getElementById('marca').value;
    const num_serie = document.getElementById('num_serie').value;
    const estatus = document.getElementById('estatus').value;
    const responsable = document.getElementById('responsable').value;
    const cuenta = document.getElementById('cuenta').value;

    fetch(BASE_URL+'SistemaGestion/api/articulo/editarArticulo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `id_articulo=${encodeURIComponent(id_articulo)}&clave_articulo=${encodeURIComponent(clave_articulo)}&descripcion=${encodeURIComponent(descripcion)}&modelo=${encodeURIComponent(modelo)}&marca=${encodeURIComponent(marca)}&num_serie=${encodeURIComponent(num_serie)}&estatus=${encodeURIComponent(estatus)}&responsable=${encodeURIComponent(responsable)}&cuenta=${encodeURIComponent(cuenta)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                title: 'Éxito',
                text: 'Artículo editado correctamente',
                icon: 'success'
            }).then(() => {
                cargarArticulos();
                limpiarFormulario();
                localStorage.removeItem('selectedArticleId'); // Limpiar el ID del artículo seleccionado
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'No se pudo editar el artículo',
                icon: 'error'
            });
        }
    })
    .catch(error => {
        console.error('Error al editar artículo:', error);
        Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error al editar el artículo',
            icon: 'error'
        });
    });
}

function seleccionarArticulo(id_articulo, cve_articulo, descripcion, modelo, marca, num_serie, estatus, responsable, cuenta) {
    document.getElementById("id_articulo").value = id_articulo;
    document.getElementById('cve_articulo').value = cve_articulo;
    document.getElementById('descripcion').value = descripcion;
    document.getElementById('modelo').value = modelo;
    document.getElementById('marca').value = marca;
    document.getElementById('num_serie').value = num_serie;
    document.getElementById('estatus').value = estatus;
    document.getElementById('responsable').value = responsable;
    document.getElementById('cuenta').value = cuenta;
    localStorage.setItem('selectedArticleId', id_articulo);
}

function obtenerIdArticuloSeleccionado() {
    // Obtener el ID del artículo seleccionado guardado en localStorage
    return localStorage.getItem('selectedArticleId');
}

function limpiarFormulario() {
document.getElementById("id_articulo").value = '';
document.getElementById('cve_articulo').value = '';
document.getElementById('descripcion').value = '';
document.getElementById('modelo').value = '';
document.getElementById('marca').value = '';
document.getElementById('num_serie').value = '';
document.getElementById('estatus').value = '';
document.getElementById('responsable').value = '';
document.getElementById('cuenta').value = '';
document.getElementById('search-input').value = '';
}

function validarFormulario() {
        var cve_articulo = document.getElementById("cve_articulo").value;
        var descripcion = document.getElementById("descripcion").value;
        var modelo = document.getElementById("modelo").value;
        var marca = document.getElementById("marca").value;
        var num_serie = document.getElementById("num_serie").value;
        var estatus = document.getElementById("estatus").value;
        var responsable = document.getElementById("responsable").value;
        var cuenta = document.getElementById("cuenta").value;

        // Verificar si los campos de cuenta y adición contienen solo números
        if (isNaN(adicion) || adicion == "") {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Por favor, ingrese un valor numérico válido para la adición.'
            });
            return false;
        }
        if (isNaN(cuenta) || cuenta == "") {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Por favor, ingrese un valor numérico válido para la cuenta.'
            });
            return false;
        }

        // Verificar si algún campo está vacío
        if (cve_articulo == "" || descripcion == "" || modelo == "" || marca == "" || num_serie == "" ||   estatus == "" || responsable == "" || cuenta == "") {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Por favor, complete todos los campos.'
            });
            return false;
        }
        return true;
    }


