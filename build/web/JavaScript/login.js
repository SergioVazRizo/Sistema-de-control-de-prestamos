//URL BASE
function setBaseURL() {
    const URL_BASE = 'http://localhost:8080/';
    return URL_BASE;
}

// Llama a la función y almacena el resultado en una constante global
const BASE_URL = setBaseURL();

function loginSucces() {
    if (!validarFormulario()) {
        return;
    }
    var usuario = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    const formData = new URLSearchParams();
    formData.append("usuario", usuario);
    formData.append("password", password);

    fetch(BASE_URL+'SistemaGestion/api/login/ingresar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        if (data.token) {
            localStorage.setItem('usuario', usuario);
            localStorage.setItem('token', data.token);

            // Aplicar la clase de animación y redirigir después de que termine la animación
            document.body.classList.add('slide-out-left');
            setTimeout(() => {
                window.location.href = BASE_URL+'SistemaGestion/HTML/PaginaPrincipal.html';
            }, 1000); 
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Usuario o contraseña incorrectos',
                confirmButtonText: 'OK'
            });
        }
    })
    .catch(error => {
        console.error('Error al procesar la solicitud:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al procesar la solicitud',
            confirmButtonText: 'OK'
        });
    });
}

function validarFormulario() {
    const usuarioLogin = document.getElementById('username').value;
    const passwordLogin = document.getElementById('password').value;
    
    if (usuarioLogin.trim() === '') {
        Swal.fire({
            title: 'Advertencia',
            text: 'El campo Usuario no puede estar vacío',
            icon: 'warning'
        });
        return false;
    }

    if (passwordLogin.trim() === '') {
        Swal.fire({
            title: 'Advertencia',
            text: 'El campo Password no puede estar vacío',
            icon: 'warning'
        });
        return false;
    }

    return true;
}


// Agrega un event listener al campo de contraseña
document.getElementById('password').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Previene el comportamiento por defecto del formulario
        loginSucces(); // Llama a la función de inicio de sesión
    }
});


