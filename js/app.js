//Variables
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

//Clases

class Presupuesto {
    constructor(presupuesto){
        this.presupuesto = presupuesto;
        this.restante = presupuesto;
        this.gastos = [];
    }


    nuevoGasto(gasto){
        this.gastos = [...this.gastos , gasto];
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce((total , gasto)=> total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;

    }
    quitarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id != id);
        this.calcularRestante();
    }
}

class UI {

    insertarPresupuesto( cantidad){
        const {presupuesto , restante}= cantidad
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    mostrarMensaje(mensaje , tipo){
        const mensajeDiv = document.createElement('div');
        mensajeDiv.textContent = mensaje;
        mensajeDiv.classList.add('text-center' , 'alert');

        if(tipo == 'error'){
            mensajeDiv.classList.add('alert-danger');
        }else {
            mensajeDiv.classList.add('alert-success');
        }

        document.querySelector('.primario').insertBefore(mensajeDiv , formulario);

        setTimeout(() => {
            mensajeDiv.remove();
        }, 3000);
    }

    agregarGastoLista(gastos){

        this.limpiarHTML();
        //Iterar sobre los gastos
        gastos.forEach(gasto => {
            const {cantidad, nombre , id} = gasto;

            //Crear un li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id;

            //Agregar al HTML del gasto

                nuevoGasto.innerHTML= `
                    ${nombre} <span class="badge badge-primary badge-pill"> ${cantidad} </span>
                `;
            //Boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger' , 'borrar-gasto');
            btnBorrar.textContent = 'Borrar'
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            //Agregar el HTML
            gastoListado.appendChild(nuevoGasto);

        });
    }

    limpiarHTML(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto , restante} = presupuestoObj;
        const restanteDiv = document.querySelector('.restante')
//Se ha gastado mas de 25%
        if((presupuesto /4) > restante ){
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        }
        else if((presupuesto / 2) > restante){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        }
        else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        if(restante <= 0){
            this.mostrarMensaje('Sin presupuesto suficiente', 'error');

            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}
//Instancias de clasess

let presupuesto;

const ui = new UI;



//Funciones
enventListeners();

function enventListeners(){

    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit' , agregarGasto);
}

function preguntarPresupuesto(){
 const presupuestoUsuario = prompt('¿Cual es tu presupuesto semanal?');

 if(presupuestoUsuario === '' || presupuestoUsuario === null || presupuestoUsuario === isNaN(presupuestoUsuario) || presupuestoUsuario <=0 ){
    window.location.reload();
 }

 presupuesto = new Presupuesto(presupuestoUsuario);
  
 ui.insertarPresupuesto(presupuesto);
} 


function agregarGasto(e){
    e.preventDefault();
  

    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    if(nombre === '' || cantidad === ''){
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    }else if(isNaN(cantidad) || cantidad <=0){
        ui.mostrarMensaje('Cantidad no valida', 'error');
        return;
    }

    //Generar un objeto con el gasto
    const gasto =  {nombre , cantidad , id: Date.now()};

    presupuesto.nuevoGasto(gasto);

    ui.mostrarMensaje('Guardado');

    const {gastos ,restante} = presupuesto;
    
    ui.agregarGastoLista( gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
    formulario.reset();
   
}

function eliminarGasto(id){
    
    
    presupuesto.quitarGasto(id);
    const {gastos ,restante} = presupuesto;
    ui.agregarGastoLista( gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}

