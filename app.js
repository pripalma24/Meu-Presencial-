let dias=Number(localStorage.getItem('dias')||6);
let hist=JSON.parse(localStorage.getItem('hist')||'[]');
function render(){
document.getElementById('meta').textContent=`${dias}/8`;
document.getElementById('texto').textContent=dias<8?`Faltam ${8-dias} dias`:'Meta concluída';
const ul=document.getElementById('hist');ul.innerHTML='';
hist.slice().reverse().forEach(r=>ul.innerHTML+=`<li>${r}</li>`);
localStorage.setItem('dias',dias);
localStorage.setItem('hist',JSON.stringify(hist));
}
function registrar(t){
if(t==='P'&&dias<8)dias++;
hist.push((t==='P'?'🏢 Presencial':'🏠 Home Office')+' '+new Date().toLocaleString('pt-BR'));
render();
}
render();
