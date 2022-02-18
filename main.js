const formulario = document.getElementById("formulario");
const inputsFormulario = document.querySelectorAll("#formulario input");
const input_buscar = document.getElementById("txt_buscar");
const txt_nombre = document.getElementById("txt_nombre");
const txt_precio = document.getElementById("txt_precio");
const txt_año = document.getElementById("txt_año");
const txt_url = document.getElementById("txt_url");
const table = document.getElementById("tablaDiscos");
const camposValidar = {precio : false,año: false}
var discos = [], contador = 3, isVacio= false;

class Disco
{
  constructor(id,nombre, precio,año,url) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.año = año;
    this.url = url
  }
} 

document.querySelector("#tablaDiscos").addEventListener("",leerJSON());

function leerJSON()
{
    var xmlhttp;

    if(window.XMLHttpRequest)
    {
        xmlhttp = new XMLHttpRequest();
    }
    else{
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function()
    {
        if(xmlhttp.readyState === 4 && xmlhttp.status === 200)
        {
            var datos = JSON.parse(xmlhttp.responseText);

            for(let i in datos)
            {
                discos.push(datos[i])
            }

            document.getElementById("tablaDiscos").innerHTML= crearTabla(discos);
        }    
        
    }

    xmlhttp.open("GET","discos.json",true)
    xmlhttp.send()
}

let crearTabla = function(listaDiscos)
{
  let htmlTabla = "<tr><th>Id</th><th>Nombre disco</th><th>Precio</th><th>Año</th><th>Acción</th></tr>"
  
  for(let disco of listaDiscos)
  {
    let fila = `<tr identificador=${disco.id}><td>`
    fila += disco.id;
    fila += "</td>"

    fila += "<td>"
    fila += disco.nombre;
    fila += "</td>"

    fila += "<td>"
    fila += "$ "+disco.precio;
    fila += "</td>"

    fila += "<td>"
    fila += disco.año;
    fila += "</td>"

    fila += "<td>"
    fila += "<button class=boton_borrar><img src=Iconos_svg/borrar.svg></button>"
    fila += "</td>"

    fila += "</tr>"

    htmlTabla += fila;
  }

  return htmlTabla;
};

//Ingreso///

const validarFormuario = (e) =>
{
    switch(e.target.name)
    {
        case "precio":
            if(parseFloat(e.target.value)>0)
            {
                validarCampo("precio",true)
            }
            else
            {
                validarCampo("precio",false)
            }
        break;

        case "año":
            if(parseInt(e.target.value)>1929)
            {
                validarCampo("año",true)
            }
            else
            {
                validarCampo("año",false)
            }
        break;
    } 
}

const validarCampo = (campo,estado) =>
{
    if(estado==true)
    {
        document.getElementById(`grupo_${campo}`).classList.remove("formulario_grupo_incorrecto")
        document.getElementById(`grupo_${campo}`).classList.add("formulario_grupo_correcto")
        document.querySelector(`#grupo_${campo} .formulario_input_error`).classList.remove("formulario_input_error_activo")
        camposValidar[campo] = true
    }
    else
    {
        document.getElementById(`grupo_${campo}`).classList.add("formulario_grupo_incorrecto")
        document.querySelector(`#grupo_${campo} .formulario_input_error`).classList.add("formulario_input_error_activo")
        camposValidar[campo] = false
    }
}

formulario.addEventListener("submit",(e) =>
{
    e.preventDefault();

    if(camposValidar.año && camposValidar.precio)
    {
        let disco = new Disco(parseInt(contador),txt_nombre.value,parseFloat(txt_precio.value),parseInt(txt_año.value),txt_url.value)
        discos.push(disco)
        alert("Disco guardado exitosamente")
        document.getElementById("tablaDiscos").innerHTML= crearTabla(discos);
        contador++;
        limpiarCampos()
        if(isVacio)
        {
            document.getElementById("todo_buscar").style.display = 'block'
            document.getElementById("mensajeVasioCampoBusqueda").style.display = 'none'
            isVacio = false;
        } 
    }
});

inputsFormulario.forEach((input) =>
{
    input.addEventListener("keyup",validarFormuario);
});

///Buscar///
const validaBusca = (e) =>
{
    if(!(e.target.value == ""))
    {
        document.querySelector("#prueba .dicono_equis").classList.add("dicono_equis_activo")
    }
    else
    {
        document.querySelector("#prueba .dicono_equis").classList.remove("dicono_equis_activo")
    }
}


input_buscar.addEventListener("keyup",validaBusca);

input_buscar.addEventListener("keydown",(e) =>
{
    if(e.key=="Enter")
    {
        SearchDisco()
    }
});

function SearchDisco()
{
    if(input_buscar.value=="")
    {
        document.getElementById("informacion_disco").innerHTML= "<p class=mensajeCampoBuscarVacio>Debe ingresar un nombre de disco</p>"
    }
    else
    {
        let indice = -1

        for(let i in discos)
        {
            if(discos[i].nombre==input_buscar.value)
            {
                indice = i;
                break;
            }
        }

        if(indice!=-1)
        {
            document.getElementById("informacion_disco").innerHTML= MostrarRespueta(true,indice);
        }
        else
        {
            document.getElementById("informacion_disco").innerHTML= MostrarRespueta(false,indice);
        }
    }

    document.querySelector("#prueba .dicono_buscar").classList.remove("dicono_buscar_activo")
}

let MostrarRespueta = function(estado,indice)
{
    let htmlRespuesta =""

    if(estado)
    {
        htmlRespuesta = `<div class=CampoDiscoExiste><div><img src="${discos[indice].url}" alt="Porta del disco" 
        class="ImagenDisco"></div><div><p class="textoDiscoExiste textoNegritaDiscoExiste firstTextoDiscoExiste">Nombre disco</p>
        <p class="textoDiscoExiste textoNegritaDiscoExiste">Precio</p><p class="textoDiscoExiste textoNegritaDiscoExiste">Año</p>
        </div><div><p class="textoDiscoExiste textoNegritaDiscoExiste firstTextoDiscoExiste">:</p><p class="textoDiscoExiste 
        textoNegritaDiscoExiste">:</p><p class="textoDiscoExiste textoNegritaDiscoExiste">:</p></div><div><p 
        class="textoDiscoExiste firstTextoDiscoExiste">${discos[indice].nombre}</p><p class="textoDiscoExiste">$
        ${discos[indice].precio}</p><p class="textoDiscoExiste">${discos[indice].año}</p></div></div>`
    }
    else
    {
        htmlRespuesta = "<p class=mensajeDiscoNoExiste>El disco no se encuentra en existencia</p>"
    }

  return htmlRespuesta;
};

///Borrar//

table.addEventListener("click",(e)=>
{
    if(e.target.parentNode.nodeName=="BUTTON")
    {
        let idEliminar = e.target.parentNode.parentNode.parentNode.getAttribute("identificador")
        console.log(e.target.parentNode.parentNode.parentNode)
        let indice  = DiscoEliminar(idEliminar)
        discos.splice(indice,1)
        document.getElementById("tablaDiscos").innerHTML= crearTabla(discos);
        let tamañoListaDisco = discos.length
        if(tamañoListaDisco==0)
        {
            document.getElementById("todo_buscar").style.display = 'none'
            document.getElementById("mensajeVasioCampoBusqueda").style.display = 'block'
            document.getElementById("tablaDiscos").innerHTML= "<p class=mensajeListaVaciaTabla>Lista vacia. Ingresa un disco</p>"
            LimpiarCampoBuscar()
            isVacio = true;
        }
    } 
})

const DiscoEliminar = function(indiceBuscar)
{
    for(let i in discos)
    {
        if(discos[i].id == indiceBuscar)
        {
            return i
        }
    }
}


function limpiarCampos()
{
    txt_nombre.value ="";
    txt_precio.value="";
    txt_año.value="";
    txt_url.value = "";
}

function Aparecer()
{
    document.querySelector("#prueba .dicono_buscar").classList.add("dicono_buscar_activo")
}

function Desaparecer()
{
    document.querySelector("#prueba .dicono_buscar").classList.remove("dicono_buscar_activo")
}

function LimpiarCampoBuscar()
{
    input_buscar.value = "";
    document.querySelector("#prueba .dicono_equis").classList.remove("dicono_equis_activo")
    document.getElementById("informacion_disco").innerHTML=""
}


