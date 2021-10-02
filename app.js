let nuevo = document.getElementById("btnCreate");
let form = document.querySelector("form");
let ajaxear = form.querySelector("button");
let inputId = form.querySelector('input[name="id"]');
let nombre = form.querySelector('input[name="nombre"]');
let precio = form.querySelector('input[name="precio"]');

nuevo.addEventListener("click", mostrarFormulario);
ajaxear.addEventListener("click", enviarFormulario)


fetch("http://localhost:3000/products")
    .then(handlerJsonRequest)
    .then(mostrarProductos);
  
function handlerJsonRequest(respuesta){
    if(!respuesta.ok){
        throw new Error("Error ajax");
    }
    return respuesta.json();
}

function mostrarProductos(json) {
    let tbody = document.querySelector("tbody");
    tbody.addEventListener("click", e => {
        if (e.target.classList[1] == "fa-pencil"){
        mostrarFormulario(e)
        };
        if (e.target.classList[1] == "fa-trash") {
        eliminarProducto(e)
        };
    })
    tbody.innerHTML = json.map(u => `<tr>
        <td>${u.id}</td>
        <td>${u.name}</td>
        <td>${u.price}</td>
        <td><i data-id=${u.id} class="fa fa-pencil"></i></td>
        <td><i data-id=${u.id} class="fa fa-trash"></i></td>
        </tr>`).join('');
};

function enviarFormulario (e){
    e.preventDefault();
    const nuevoProducto = {
        name: nombre.value,
        price: precio.value
    }
    if (inputId.value == 0) {
        fetch('http://localhost:3000/products', {
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevoProducto)
        });
    }
    else {
        fetch('http://localhost:3000/products/'+inputId.value, {
            method: 'put',
            headers: {
                "Content-Type": "application/json"
            },
        body: JSON.stringify(nuevoProducto)
        })
    }
};
 
function eliminarProducto (e) {
    fetch("http://localhost:3000/products/"+e.target.dataset.id)
        .then(handlerJsonRequest)
        .then(json => {
            let respuesta = confirm(`¿Desea borrar el objeto ${json.id} - ${json.name} de $${json.price}?`)
            return respuesta;
        })
        .then (respuesta => {
            if (respuesta) {
                fetch("http://localhost:3000/products/"+e.target.dataset.id, {
                    method: "delete",
                })
            }
        })
}

function mostrarFormulario (e) {
    form.classList.remove("oculto");
    inputId.setAttribute("type","hidden");
    
    if (e.target.tagName == "BUTTON") {
        inputId.value = 0;
        nombre.value = "";
        precio.value = "";
    }

    else {
        fetch("http://localhost:3000/products/"+e.target.dataset.id)
            .then(handlerJsonRequest)
            .then(json => {
                inputId.setAttribute("type","number")
                // inputId.setAttribute("disabled","")
                inputId.value = json.id;
                nombre.value = json.name;
                precio.value = json.price;
            })
    }
};
