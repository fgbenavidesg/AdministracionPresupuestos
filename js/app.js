const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');


//eventos 

eventListener();

function eventListener(){
    document.addEventListener('DOMContentLoaded',preguntarPresupuesto);
    formulario.addEventListener('submit',agregarGasto);
}


//clases

class Presupuesto {
    constructor(presupuesto){

        this.presupuesto = Number(presupuesto);      
        this.restante = Number(presupuesto);
        this.gastos =[];
    }

    nuevoGasto(gasto){

        this.gastos = [...this.gastos,gasto];
        console.log(this.gastos);
        this.calcularRestante();
    
    }
    
    calcularRestante(){

    
        const gastado= this.gastos.reduce((total, gasto)=> total + gasto.cantidad,0);
        this.restante = this.presupuesto - gastado;
    }
    eliminarGasto(id){
        this.gastos= this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }
}


class UI{

    insertarPresupuesto (cantidad){

        document.querySelector('#total').textContent = cantidad.presupuesto;
        document.querySelector('#restante').textContent= cantidad.restante;
    }


    imprimirAlerta(msj,tipo){
            
        const divMsj = document.createElement('div');
        divMsj.classList.add('text-center','alert');
        if(tipo==='error'){
            divMsj.classList.add('alert-danger');
        }else{
            divMsj.classList.add('alert-success');

        }

        divMsj.textContent= msj;
        document.querySelector('.primario').insertBefore(divMsj,formulario);
        setTimeout(() => {
           divMsj.remove();     
        }, 3000);
    }   

    agregarGastoListado(gastos){

            // Limpiar HTML
            this.limpiarHTML();

            // Iterar sobre los gastos 
            gastos.forEach(gasto => {
                const {nombre, cantidad, id } = gasto;
    
                // Crear un LI
                const nuevoGasto = document.createElement('li');
                nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
                nuevoGasto.dataset.id = id;
    
                // Insertar el gasto
                nuevoGasto.innerHTML = `
                    ${nombre}
                    <span class="badge badge-primary badge-pill">$ ${cantidad}</span>
                `;
    
                // boton borrar gasto.
                const btnBorrar = document.createElement('button');
                btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
                btnBorrar.textContent = 'Borrar';
                btnBorrar.onclick= ()=>{
                    eliminarGasto(id);
                }
                nuevoGasto.appendChild(btnBorrar);
                
                // Insertar al HTML
                gastoListado.appendChild(nuevoGasto);
            });
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent =restante;
    }
    comprobarPresupuesto(presupuestoObj){
       const {presupuesto, restante}= presupuestoObj;
       const restanteDiv = document.querySelector('.restante');

      //comprabando el 25%
      if((presupuesto/4)> restante){
        restanteDiv.classList.remove('alert-success', 'alert-warning');
        restanteDiv.classList.add('alert-danger');
      } else if((presupuesto/2) >restante){
        restanteDiv.classList.remove('alert-success');
        restanteDiv.classList.add('alert-warning');
      }else{
        restanteDiv.classList.remove('alert-danger','alert-warning');
        restanteDiv.classList.add('alert-success');
      }
      
      
      //si el total es 0 o menor 
      if(restante <= 0){
          ui.imprimirAlerta('el presupuesto se ha agotado', 'error');
          formulario.querySelector('button[type ="submit"]').disabled= true;
      }
    }
    limpiarHTML(){

        while(gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }        

    }
}


//instanciamos ui

const ui = new UI; 
//funciones
let presupuesto;
function preguntarPresupuesto (){
    const PresupuestoUsuario = Number(prompt('¿cual es tu presupuesto?'));
    
    if(PresupuestoUsuario==='' || PresupuestoUsuario===null || isNaN(PresupuestoUsuario) || PresupuestoUsuario <= 0){
        window.location.reload();  
    }
    presupuesto = new Presupuesto(PresupuestoUsuario);

    ui.insertarPresupuesto(presupuesto);
}
 
//añadir gastos
function agregarGasto(e){

    e.preventDefault();

    //leer datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);
    //validar que los campos no esten vacios
    if(nombre ==='' || cantidad ===''){
        ui.imprimirAlerta('ambos campos son obligatorios','error');
        return;
    }else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('cantidad no valida','error'); 
        return;

    }else{

        //generar un obj con el gasto
        const gasto = {
                nombre,
                cantidad,
                id : Date.now()
            }
            //añade nuevo gasto
            presupuesto.nuevoGasto(gasto);


            ui.imprimirAlerta('¡gasto agregado correctamente!');
   
            ui.agregarGastoListado(presupuesto.gastos);
            ui.actualizarRestante(presupuesto.restante);
            ui.comprobarPresupuesto(presupuesto);

            formulario.reset();


    }
    
    
}
function eliminarGasto(id){
    //elimina de la clase
   presupuesto.eliminarGasto(id);
   //elimina del html
    ui.agregarGastoListado(presupuesto.gastos);
    ui.actualizarRestante(presupuesto.restante);
    ui.comprobarPresupuesto(presupuesto);
}




