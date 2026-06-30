/* ==================================================
   MEU PRESENCIAL
   APP.JS
================================================== */

const STORAGE_KEY = "meuPresencial";

const DEFAULT_DATA = {

    meta: 8,

    presencial: 6,

    homeOffice: 8,

    ferias: 2,

    feriados: 1,

    folgas: 4,

    historico: [

        {

            tipo: "Home Office",

            icone: "🏠",

            data: "Hoje",

            hora: "08:32"

        },

        {

            tipo: "Presencial",

            icone: "🏢",

            data: "Ontem",

            hora: "08:10"

        }

    ]

};

let appData = carregarDados();

function carregarDados(){

    const dados = localStorage.getItem(STORAGE_KEY);

    if(dados){

        return JSON.parse(dados);

    }

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(DEFAULT_DATA)

    );

    return structuredClone(DEFAULT_DATA);

}

function salvarDados(){

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(appData)

    );

}

document.addEventListener(

    "DOMContentLoaded",

    iniciarApp

);

function iniciarApp(){

    atualizarDashboard();

    atualizarHistorico();

    configurarBotoes();

}
/* ==========================================
   DASHBOARD
========================================== */

function atualizarDashboard(){

    atualizarMeta();

    atualizarResumo();

    atualizarInsight();

}

function atualizarMeta(){

    const metaDias = document.getElementById("diasMeta");

    const percentual = document.querySelector(".hero-right h1");

    const restante = document.getElementById("diasRestantes");

    if(!metaDias) return;

    metaDias.textContent =
        `${appData.presencial} / ${appData.meta}`;

    const porcentagem = Math.round(
        (appData.presencial / appData.meta) * 100
    );

    if(percentual){

        percentual.textContent =
            porcentagem + "%";

    }

    const faltam =
        appData.meta - appData.presencial;

    if(restante){

        if(faltam > 0){

            restante.innerHTML =
                `Restam apenas <strong>${faltam} dias presenciais</strong>`;

        }else{

            restante.innerHTML =
                `<strong>🎉 Meta concluída!</strong>`;

        }

    }

}

function atualizarResumo(){

    const itens =
        document.querySelectorAll(".summary-item span");

    if(itens.length < 5) return;

    itens[0].textContent =
        appData.presencial;

    itens[1].textContent =
        appData.homeOffice;

    itens[2].textContent =
        appData.ferias;

    itens[3].textContent =
        appData.feriados;

    itens[4].textContent =
        appData.folgas;

}

function atualizarInsight(){

    const insight =
        document.querySelector(".insight p");

    if(!insight) return;

    const faltam =
        appData.meta - appData.presencial;

    if(faltam <= 0){

        insight.innerHTML =
            "🎉 Você já concluiu sua meta deste mês.";

        return;

    }

    if(faltam <= 2){

        insight.innerHTML =
            `Você está muito perto da meta. Restam apenas <strong>${faltam} dias</strong>.`;

        return;

    }

    insight.innerHTML =
        `Ainda faltam <strong>${faltam} dias presenciais</strong> para atingir sua meta.`;

}
/* ==========================================
   REGISTRO DE DIAS
========================================== */

function configurarBotoes(){

    document
        .querySelectorAll(".action")
        .forEach(botao=>{

            botao.addEventListener("click",()=>{

                if(botao.classList.contains("presencial")){

                    registrarDia("Presencial");

                }

                if(botao.classList.contains("home")){

                    registrarDia("Home Office");

                }

                if(botao.classList.contains("ferias")){

                    registrarDia("Férias");

                }

                if(botao.classList.contains("feriado")){

                    registrarDia("Feriado");

                }

                if(botao.classList.contains("folga")){

                    registrarDia("Folga");

                }

            });

        });

}

function registrarDia(tipo){

    const agora = new Date();

    const hora = agora.toLocaleTimeString(
        "pt-BR",
        {
            hour:"2-digit",
            minute:"2-digit"
        }
    );

    const data = agora.toLocaleDateString(
        "pt-BR",
        {
            weekday:"short",
            day:"2-digit",
            month:"2-digit"
        }
    );

    let icone = "📌";

    switch(tipo){

        case "Presencial":

            icone = "🏢";

            if(appData.presencial < appData.meta){

                appData.presencial++;

            }

            break;

        case "Home Office":

            icone = "🏠";

            appData.homeOffice++;

            break;

        case "Férias":

            icone = "🌴";

            appData.ferias++;

            break;

        case "Feriado":

            icone = "🎉";

            appData.feriados++;

            break;

        case "Folga":

            icone = "😴";

            appData.folgas++;

            break;

    }

    appData.historico.unshift({

        tipo,

        icone,

        data,

        hora

    });

    if(appData.historico.length > 30){

        appData.historico.pop();

    }

    salvarDados();

    atualizarDashboard();

    atualizarHistorico();

    mostrarToast(
        tipo + " registrado com sucesso!"
    );

}
/* ==========================================
   HISTÓRICO
========================================== */

function atualizarHistorico(){

    const lista = document.getElementById("historyList");

    if(!lista) return;

    lista.innerHTML = "";

    appData.historico.forEach(item=>{

        const div = document.createElement("div");

        div.className = "history-item";

        div.innerHTML = `
            <div>
                <strong>${item.icone} ${item.tipo}</strong>
                <small>${item.data} • ${item.hora}</small>
            </div>
        `;

        lista.appendChild(div);

    });

}

/* ==========================================
   TOAST
========================================== */

function mostrarToast(texto){

    const toast = document.getElementById("toast");

    if(!toast) return;

    toast.textContent = texto;

    toast.classList.remove("hidden");

    setTimeout(()=>{

        toast.classList.add("hidden");

    },2500);

}

/* ==========================================
   MODAL
========================================== */

const modal = document.getElementById("dayModal");

const closeModal = document.getElementById("closeModal");

if(closeModal){

    closeModal.addEventListener("click",()=>{

        modal.classList.add("hidden");

    });

}

document.querySelectorAll(".modal-option").forEach(botao=>{

    botao.addEventListener("click",()=>{

        modal.classList.add("hidden");

    });

});

/* ==========================================
   NAVEGAÇÃO
========================================== */

document.querySelectorAll(".bottom-nav button").forEach(botao=>{

    botao.addEventListener("click",()=>{

        document
            .querySelectorAll(".bottom-nav button")
            .forEach(b=>b.classList.remove("active"));

        botao.classList.add("active");

    });

});

/* ==========================================
   INICIALIZAÇÃO
========================================== */

window.addEventListener("load",()=>{

    atualizarDashboard();

    atualizarHistorico();

});
