/*
 * ############### POO - Proyecto Presupuestos ################

 * Vídeo 1: Creación de Prompt y validación.
 * Vídeo 2: Crear clase presupuesto y relacionarla con el prompt.
 * Vídeo 3: Asociar clase UI para que clases Presupuesto sea mostrada.
 * Vídeo 4: Validar formulario gastos y asignar cantidad válida a los gastos
 * Vídeo 5: Recoger los gastos en la clase Presupuestos y Validar entrada correcta de datos.
 * Vídeo 6: Añadir los gastos al HTML debajo de listado con un método UI. 
 * Vídeo 7: Restar en 'restante' cada vez que se añade un gasto. 
 */

/*
 * #### Variables y Selectores ####
 */

const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

/*
 * #### Eventos ####
 */

eventListeners();
function eventListeners() {
	// Prompt para introducir presupuesto.
	document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
	// Escucha para el submit del form.
	formulario.addEventListener('submit', agregarGasto);
}

/*
 * #### Clases ####
 * Conveniente tomarse un momento para identificar cuáles se van a necesitar
 * Clase Presupuesto y Clase interfaz de usuario.
 */

// Clase Presupuesto.
class Presupuesto {
	constructor(presupuesto) {
		this.presupuesto = Number(presupuesto);
		this.restante = Number(presupuesto); //? Cuando comenzamos coincide con el presupuesto.
		this.gastos = []; //? Vacío, aún no se ha creado.
	}

	// Método Agregar gasto desde UI.
	nuevoGasto(gasto) {
		this.gastos = [...this.gastos, gasto];
		this.calcularRestante();
	}
	// Método Calcular saldo restante
	calcularRestante() {
		const gastado = this.gastos.reduce(
			(total, gasto) => total + gasto.cantidad,
			0
		);
		this.restante = this.presupuesto - gastado;
	}
}

//Clase UI
//? No necesita atributos. Sólo métodos. Lo toma todo de Presupuesto.
class UI {
	// Insertar presupuesto desde el prompt.
	insertarPresupuesto(cantidad) {
		// Extraer valor
		const { presupuesto, restante } = cantidad;
		// Asignar al HTML.
		document.querySelector('#total').textContent = presupuesto;
		document.querySelector('#restante').textContent = restante;
	}

	// Imprimir alerta de validación de form.
	imprimirAlerta(mensaje, tipo) {
		// Crear el Div
		const divMensaje = document.createElement('div');
		divMensaje.classList.add('text-center', 'alert'); // Class BootStrap
		// Seleccionar CSS si es tipo error.
		if (tipo === 'error') {
			divMensaje.classList.add('alert-danger'); // Clase BS.
		} else {
			divMensaje.classList.add('alert-success');
		}

		// Mensaje de error
		divMensaje.textContent = mensaje;
		// Insertar mensaje de error en HTML
		document.querySelector('.primario').insertBefore(divMensaje, formulario); // Parámetros: qué colocamos y dónde.
		// Eliminar mensaje tras 3s.
		setTimeout(() => {
			divMensaje.remove();
		}, 3000);
	}

	// Imprimir listado de gastos
	mostrarGastos(gastos) {
		// Eliminar HTML previo.
		this.limpiarHTML();

		// Iterar gastos
		gastos.forEach((gasto) => {
			const { cantidad, nombre, id } = gasto; //? Destructiring para no poner gasto.cantidad, etc...

			// Crear un LI
			const nuevoGasto = document.createElement('li');
			nuevoGasto.className =
				'list-group-item d-flex justify-content-between align-items-center'; //? Cómodo para añadir muchas clases

			// Añadir atributo id. Dos formas:
			//! nuevoGasto.setAttribute('data-id',id) // Hacen lo mismo
			nuevoGasto.dataset.id = id;

			// Agregar el HTML del gasto.
			//? No recomendable innerHTML por seguridad. Lo hace porque se ahorra muchos createElement() y textContent().
			nuevoGasto.innerHTML = `${nombre} <span class='badge badge-primary badge-pill'> ${cantidad} $ </span>`;

			// Botón para borrar el gasto.
			const btnBorrar = document.createElement('button');
			btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
			btnBorrar.innerHTML = 'Borrar &times;'; //? Lleva HTML
			nuevoGasto.appendChild(btnBorrar);

			// Agregar al HTML
			gastoListado.appendChild(nuevoGasto);
		});
	}

	// Limpiar HTML
	limpiarHTML() {
		while (gastoListado.firstChild) {
			gastoListado.removeChild(gastoListado.firstChild);
		}
	}

	// Introducir restante en el HTML
	actualizarRestante(restante) {
		document.querySelector('#restante').textContent = restante;
	}
}

// Instanciar
//? Variable presupuesto en ámbito global recoge la instancia del prompt.
//? Instanciamos UI global para ser accesible desde varias funciones.
const ui = new UI();
let presupuesto;

/*
 * #### Funciones ####
 */

// Prompt
function preguntarPresupuesto() {
	const presupuestoUsuario = prompt('¿Cuál es tu presupuesto?');
	// console.log(Number(presupuestoUsuario)); //? Number()===parseInt() || parseFloat()

	// Validación prompt
	// Si el usuario no introduce nada || El usuario le da a cancelar === NULL || Si el usuario introduce una letra: isNaN() || Si introduce un valor negativo o 0.

	if (
		presupuestoUsuario === '' ||
		presupuestoUsuario === null ||
		isNaN(presupuestoUsuario) ||
		presupuestoUsuario <= 0
	) {
		//? Función JS que recarga la página.
		window.location.reload();
	}

	//? Recogemos el presupuesto en el promt y lo convertimos en variable instanciada para su clase.
	presupuesto = new Presupuesto(presupuestoUsuario);
	// console.log(presupuesto);

	// Insertar presupuesto en UI.
	ui.insertarPresupuesto(presupuesto);
}

// Agregar gastos
//? Como es un submit introducimos el preventDefault
function agregarGasto(e) {
	e.preventDefault();

	// Leer los datos del formulario.
	const nombre = document.querySelector('#gasto').value;
	const cantidad = Number(document.querySelector('#cantidad').value);

	// Validar formulario.

	if (nombre === '' || cantidad === '') {
		// !        console.log('Ambos campos son obligatorios');
		// Para mostrar la validación en UI.
		//? Introducimos dos parámetros para poder ver el tipo de mensaje y modificarlo con CSS.
		ui.imprimirAlerta('Ambos campos son obligatorios', 'error');

		return;
		//? Utilizamos un else porque será un mensaje diferente.
	} else if (cantidad <= 0 || isNaN(cantidad)) {
		ui.imprimirAlerta('Cantidad no válida', 'error');

		return;
	}
	// console.log('Agregando gasto...');

	// Generar objeto para recoger el gasto introducido por el usuario.
	//? Object literal Destructuring
	//! const { nombre, cantidad } = gasto;

	//? Object literal Enhancement -> Contrario de Destructuring. Incluir parámetros en objeto.
	const gasto = { nombre, cantidad, id: Date.now() }; //? Incluímos id generado a partir de la fecha para identificarlo luego.

	// Añade el gasto referido a la clase.
	presupuesto.nuevoGasto(gasto);

	// Validadión entrada gasto correcta.
	ui.imprimirAlerta('Gasto añadido correctamente'); //? NO le añadimos tipo error como segundo argumento. El ELSE de la validación le pone la clase correcta si no es un error.

	// Reset form tras introducir datos.
	formulario.reset();

	// Imprimir los gastos
	const { gastos, restante } = presupuesto; // Destructuring
	// ui.mostrarGastos(gastos);

	ui.agregarGastoListado(gastos);

	ui.actualizarRestante(restante);
}
