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

    window.onload = function () {
        verificarToken();
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

//Funciones propias
//Usuarios
async function fetchUsuarios() {
    const response = await fetch(BASE_URL+'SistemaGestion/api/usuario/getAllUsuarios');
    return await response.json();
}

async function ReporteUsuarios() {
    const usuarios = await fetchUsuarios();

    const {jsPDF} = window.jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    const data = usuarios.map(usuario => [
            usuario.a_paterno,
            usuario.a_materno,
            usuario.nombre,
            usuario.rol,
            usuario.extension,
            usuario.email
        ]);

    doc.setFont("times");
    doc.setFontSize(19);
    doc.text("Reporte de Usuarios", pageWidth / 2, 20, null, null, "center");

    const y = 30;
    doc.autoTable({
        head: [['Apellido Paterno', 'Apellido Materno', 'Nombre(s)', 'Rol', 'Extensión', 'Email']],
        body: data,
        startY: y,
        theme: 'striped',
        headStyles: {
            fillColor: [77, 134, 156],
            textColor: [238, 247, 255],
            fontSize: 10,
        },
        bodyStyles: {
            textColor: [55, 58, 64],
            fontSize: 8,
        },
        margin: {left: 10, right: 10},
        styles: {
            halign: 'center',
            overflow: 'linebreak',
            cellPadding: 0.1,
            lineHeight: 0.5,
        },
    });

    doc.save("Usuarios.pdf");
}

document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generate-pdf-usuarios');
    generateButton.addEventListener('click', ReporteUsuarios);
});

//Excel
async function ReporteUsuariosExcel() {
    const usuarios = await fetchUsuarios();

    const data = usuarios.map(usuario => ({
        'Apellido Paterno': usuario.a_paterno,
        'Apellido Materno': usuario.a_materno,
        'Nombre(s)': usuario.nombre,
        'Rol': usuario.rol,
        'Extensión': usuario.extension,
        'Email': usuario.email
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");

    XLSX.writeFile(workbook, "Usuarios.xlsx");
}

document.addEventListener('DOMContentLoaded', () => {
    const generateExcelButton = document.getElementById('generate-excel-usuarios');
    generateExcelButton.addEventListener('click', ReporteUsuariosExcel);
});

//Articulos
async function fetchArticulos() {
    const response = await fetch(BASE_URL+'SistemaGestion/api/articulo/getAllArticulos');
    return await response.json();
}

async function ReporteArticulos() {
    const articulos = await fetchArticulos();

    const {jsPDF} = window.jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    const data = articulos.map(articulo => [
            articulo.claveArticulo,
            articulo.adicion,
            articulo.descripcion,
            articulo.modelo,
            articulo.marca,
            articulo.numSerie,
            articulo.estatus,
        ]);

    doc.setFont("times");
    doc.setFontSize(19);
    doc.text("Reporte de Artículos", pageWidth / 2, 20, null, null, "center");

    const y = 30;
    doc.autoTable({
        head: [['Clave', 'Cantidad', 'Descripción', 'Modelo', 'Marca', 'Número de Serie', 'Estado']],
        body: data,
        startY: y,
        theme: 'striped',
        headStyles: {
            fillColor: [77, 134, 156],
            textColor: [238, 247, 255],
            fontSize: 7,
        },
        bodyStyles: {
            textColor: [55, 58, 64],
            fontSize: 8,
        },
        margin: {left: 10, right: 10},
        styles: {
            halign: 'center',
            overflow: 'linebreak',
            cellPadding: 0.1,
            lineHeight: 0.5,
        },
    });

    doc.save("Articulos.pdf");
}

//Excel
async function ReporteArticulosExcel() {
    const articulos = await fetchArticulos();

    const data = articulos.map(articulo => ({
        'Clave': articulo.claveArticulo,
        'Cantidad': articulo.adicion,
        'Descripción': articulo.descripcion,
        'Modelo': articulo.modelo,
        'Marca': articulo.marca,
        'Número de Serie': articulo.numSerie,
        'Estado': articulo.estatus
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Articulos");

    XLSX.writeFile(workbook, "Articulos.xlsx");
}

document.addEventListener('DOMContentLoaded', () => {
    const generateExcelButton = document.getElementById('generate-excel-articulos');
    generateExcelButton.addEventListener('click', ReporteArticulosExcel);
});

document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generate-pdf-articulos');
    generateButton.addEventListener('click', ReporteArticulos);
});

//Lugares
async function fetchLugares() {
    const response = await fetch(BASE_URL+'SistemaGestion/api/lugar/getAllLugares');
    return await response.json();
}

async function ReporteLugares() {
    const lugares = await fetchLugares();

    const {jsPDF} = window.jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    const data = lugares.map(lugar => [
            lugar.cveLugar,
            lugar.ubicacion,
            lugar.nombre
        ]);

    doc.setFont("times");
    doc.setFontSize(19);
    doc.text("Reporte de Lugares", pageWidth / 2, 20, null, null, "center");

    const y = 30;
    doc.autoTable({
        head: [['ID', 'Ubicación', 'Nombre del lugar']],
        body: data,
        startY: y,
        theme: 'striped',
        headStyles: {
            fillColor: [77, 134, 156],
            textColor: [238, 247, 255],
            fontSize: 10,
        },
        bodyStyles: {
            textColor: [55, 58, 64],
            fontSize: 8,
        },
        margin: {left: 10, right: 10},
        styles: {
            halign: 'center',
            overflow: 'linebreak',
            cellPadding: 0.1,
            lineHeight: 0.5,
        },
    });

    doc.save("Lugares.pdf");
}

//Excel
async function ReporteLugaresExcel() {
    const lugares = await fetchLugares();

    const data = lugares.map(lugar => ({
        'ID': lugar.cveLugar,
        'Ubicación': lugar.ubicacion,
        'Nombre del lugar': lugar.nombre
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Lugares");

    XLSX.writeFile(workbook, "Lugares.xlsx");
}

document.addEventListener('DOMContentLoaded', () => {
    const generateExcelButton = document.getElementById('generate-excel-lugares');
    generateExcelButton.addEventListener('click', ReporteLugaresExcel);
});

document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generate-pdf-lugares');
    generateButton.addEventListener('click', ReporteLugares);
});

//Proyectos
async function fetchProyectos() {
    const response = await fetch(BASE_URL+'SistemaGestion/api/proyecto/getAllProyectos');
    return await response.json();
}

async function ReporteProyectos() {
    const proyectos = await fetchProyectos();

    const {jsPDF} = window.jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    const data = proyectos.map(proyecto => [
            proyecto.cve_proyecto,
            proyecto.nombre
        ]);

    doc.setFont("times");
    doc.setFontSize(19);
    doc.text("Reporte de Proyectos", pageWidth / 2, 20, null, null, "center");

    const y = 30;
    doc.autoTable({
        head: [['ID', 'Nombre del proyecto']],
        body: data,
        startY: y,
        theme: 'striped',
        headStyles: {
            fillColor: [77, 134, 156],
            textColor: [238, 247, 255],
            fontSize: 10,
        },
        bodyStyles: {
            textColor: [55, 58, 64],
            fontSize: 8,
        },
        margin: {left: 10, right: 10},
        styles: {
            halign: 'center',
            overflow: 'linebreak',
            cellPadding: 0.1,
            lineHeight: 0.5,
        },
    });

    doc.save("Proyectos.pdf");
}

//Excel
async function ReporteProyectosExcel() {
    const proyectos = await fetchProyectos();

    const data = proyectos.map(proyecto => ({
        'ID': proyecto.cve_proyecto,
        'Nombre del proyecto': proyecto.nombre
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Proyectos");

    XLSX.writeFile(workbook, "Proyectos.xlsx");
}

document.addEventListener('DOMContentLoaded', () => {
    const generateExcelButton = document.getElementById('generate-excel-proyectos');
    generateExcelButton.addEventListener('click', ReporteProyectosExcel);
});

document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generate-pdf-proyectos');
    generateButton.addEventListener('click', ReporteProyectos);
});