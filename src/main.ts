import './style.css'

type Dato = {
  presupuesto: number,
  allow: boolean
}
interface Trans {
  tipo: string,
  detalle: string,
  monto : number,
  fecha: number
}
let presupesto = 0
let gastoTotal:number[] = []
let entradaTotal:number[] = []
let InOut:Trans[] = []
const app = document.querySelector<HTMLDivElement>('#app')!
const modal = document.querySelector<HTMLDivElement>('#iPresupesto')!
const btnModal = document.querySelector<HTMLButtonElement>('#btnAdd')!
const contene = document.querySelector<HTMLDivElement>('#contenedor')!
const cambio = document.querySelector<HTMLSpanElement>('#presupuestoS')!
const pGasto = document.querySelector<HTMLSpanElement>('#gasto')!
const pEntrada = document.querySelector<HTMLSpanElement>('#entrada')!
const pRestante = document.querySelector<HTMLSpanElement>('#restante')!
const todo = document.querySelector<HTMLButtonElement>('#todo')!


addEventListener('load', pregunta)

btnModal?.addEventListener('click', () => {
  const dato = document.querySelector<HTMLInputElement>('#pre')?.value!
  console.log(dato);
  
  if(dato !== ''){
    presupesto = Number(dato)
    let local:Dato = {
      presupuesto: presupesto,
      allow: true
    }
    localStorage.setItem('presupuesto', JSON.stringify(local))
     modal?.classList.remove('show')
     modal?.classList.add('hide')
    contene?.classList.add('show')
    Pintar()
  }
})

function Pintar() {
  cambio.innerText = `${Convert(presupesto)}`
  todo.innerHTML = `${entradaTotal.length != 0? Convert(presupesto + entradaTotal.reduce((a, b) => a + b)): Convert(presupesto)}`
  pGasto.innerText = `${Convert(gastoTotal.reduce((a, b) => a + b, 0))}`
  pRestante.innerText = `${entradaTotal.length != 0?Convert((entradaTotal.reduce((a, b) => a + b) + presupesto) - gastoTotal.reduce((a, b) => a + b, 0))  : Convert(presupesto - gastoTotal.reduce((a, b) => a + b, 0))}`
  pEntrada.innerText = `${Convert(entradaTotal.reduce((a, b) => a + b, 0))}`
}

function pregunta() {
  let dato = localStorage.getItem('presupuesto')
  let gasTotal = localStorage.getItem('gastoTotal')
  let enTotal = localStorage.getItem('entradaTotal')
  let ino = localStorage.getItem('InOut')
  if(dato){
    let dato2:Dato = JSON.parse(dato)
    if(dato2.allow){
     modal?.classList.remove('show')
     modal?.classList.add('hide')
    contene?.classList.add('show')
    presupesto = dato2.presupuesto
    pintarTrnas()
    Pintar()
    }else{
     modal?.classList.add('show')
     modal?.classList.remove('hide')
    contene?.classList.remove('show')
    }
    if (gasTotal){
      let gasDos:number[] = JSON.parse(gasTotal)
      gastoTotal = [...gasDos]
    Pintar()
    }else{
      gastoTotal = []
    }
    if(enTotal){
      let enDos:number[] = JSON.parse(enTotal)
      entradaTotal = [...enDos]
    Pintar()
    }else{
      entradaTotal = []
    }
    if (ino){
      let inDos = JSON.parse(ino)
      InOut = [...inDos]
      pintarTrnas()      
      Pintar()
    }
  }
}

const form = document.querySelector<HTMLFormElement>('#from')!
form.addEventListener('submit', (e) => {
  e.preventDefault()
  let select = document.querySelector<HTMLSelectElement>('#opcion')?.value!
  let referencia = document.querySelector<HTMLInputElement>('#dGasto')?.value!
  let monto = document.querySelector<HTMLInputElement>('#mGasto')?.value!
  if (select === '' || referencia === '' || monto === ''){
    alert('Todos los campos son obligatorios')
    return
  } 
    let mandar: Trans = {
    detalle: referencia,
    monto: Number(monto),
    tipo: select,
    fecha: Date.now()
  }
  
  if(select === 'salida') {
    gastoTotal.push(Number(monto))
    localStorage.setItem('gastoTotal', JSON.stringify(gastoTotal))
  }
  if(select === 'entrada') {
    entradaTotal.push(Number(monto)) 
    localStorage.setItem('entradaTotal', JSON.stringify(entradaTotal))
  }

  InOut.push(mandar)
  localStorage.setItem('InOut', JSON.stringify(InOut))
  pintarTrnas()
  Pintar()
})

function pintarTrnas() {
  app.innerHTML = ''
  InOut.forEach(ino => {
    app.innerHTML += `
      <div class="${ino.tipo}" >
        <h4>${ino.detalle}</h4>
        <p>${Convert(ino.monto)}</p>
        <p class="fecha">${new Intl.DateTimeFormat('es-Es').format(new Date(ino.fecha))}</p>
      </div>
    `
  })
}
function Convert(int: number) {
  return new Intl.NumberFormat('en-EN', {style:"currency", currency:'USD'}).format(int)
}
