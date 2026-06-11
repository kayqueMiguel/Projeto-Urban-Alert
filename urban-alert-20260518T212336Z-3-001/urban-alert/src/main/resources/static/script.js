const inputEndereco = document.getElementById("endereco");
const sugestoes = document.getElementById("sugestoes");

/* =========================
   LIMITES DE BELO HORIZONTE
========================= */

/*
  Bounding Box:
  Sul, Norte, Oeste, Leste
*/

const bhBounds = [
    [-20.060, -44.080], // sudoeste
    [-19.760, -43.850]  // nordeste
];

/* =========================
   MAPA LEAFLET
========================= */

const map = L.map('map', {
    maxBounds: bhBounds,
    maxBoundsViscosity: 1.0
}).setView([-19.9167, -43.9345], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

let marcador = null;

/* =========================
   GEOLOCALIZAÇÃO
========================= */

if(navigator.geolocation){

    navigator.geolocation.getCurrentPosition(

        (position) => {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const dentroBH =
                latitude >= -20.060 &&
                latitude <= -19.760 &&
                longitude >= -44.080 &&
                longitude <= -43.850;

            if(dentroBH){

                map.setView([latitude, longitude], 16);

                marcador = L.marker([latitude, longitude])
                    .addTo(map)
                    .bindPopup("Você está aqui!")
                    .openPopup();

            }else{
                // TRAVA GEOGRÁFICA DO GPS COMENTADA PARA PERMITIR TESTES DE OUTRAS CIDADES
                // alert("Localização fora de Belo Horizonte.");
            }

        },

        (error) => {

            console.error("Erro geolocalização:", error);

        }

    );

}

/* =========================
   AUTOCOMPLETE
========================= */

let timeout = null;

inputEndereco.addEventListener("input", () => {

    clearTimeout(timeout);

    timeout = setTimeout(() => {

        buscarEndereco(inputEndereco.value);

    }, 500);

});

async function buscarEndereco(valor){

    if(valor.length < 3){

        sugestoes.innerHTML = "";
        return;

    }

    try{

        /*
          Busca restrita para Belo Horizonte
        */

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(valor + ', Belo Horizonte')}&limit=5&countrycodes=br&bounded=1&viewbox=-44.080,-19.760,-43.850,-20.060`
        );

        const data = await response.json();

        sugestoes.innerHTML = "";

        if(data.length === 0){

            sugestoes.innerHTML = `
                <div class="sugestao-item">
                    Nenhum endereço encontrado em Belo Horizonte
                </div>
            `;

            return;

        }

        data.forEach(local => {

            const item = document.createElement("div");

            item.classList.add("sugestao-item");

            item.innerText = local.display_name;

            item.addEventListener("click", () => {

                inputEndereco.value = local.display_name;

                sugestoes.innerHTML = "";

                const lat = parseFloat(local.lat);
                const lon = parseFloat(local.lon);

                map.setView([lat, lon], 17);

                if(marcador){

                    map.removeLayer(marcador);

                }

                marcador = L.marker([lat, lon])
                    .addTo(map)
                    .bindPopup(local.display_name)
                    .openPopup();

            });

            sugestoes.appendChild(item);

        });

    }catch(error){

        console.error("Erro API:", error);

    }

}

/* =========================
   FECHAR SUGESTÕES
========================= */

document.addEventListener("click", (e) => {

    const autocomplete = document.querySelector(".autocomplete");

    if(
        autocomplete &&
        !autocomplete.contains(e.target)
    ){

        sugestoes.innerHTML = "";

    }

});


/* =======================================================
   INTEGRAÇÃO COM O BACKEND JAVA (SPRING BOOT)
======================================================= */

const formulario = document.getElementById("formDenuncia");

if (formulario) {
    formulario.addEventListener("submit", async (e) => {
        e.preventDefault(); // Impede a página de recarregar e quebrar o envio

        // Captura os dados digitados na tela
        const tipoProblema = document.getElementById("tipoProblema").value;
        const endereco = document.getElementById("endereco").value;
        const descricao = document.getElementById("descricao").value;

        // Monta o objeto com todas as variações de nomes possíveis para a Entidade Java
        const dadosDenuncia = {
            tipoProblema: tipoProblema,
            tipo: tipoProblema,

            localizacao: endereco,
            localidade: endereco,
            endereco: endereco,

            descricao: descricao,
            texto: descricao
        };

        try {
            // Dispara os dados para a rota correta do Spring Boot
            const resposta = await fetch("http://localhost:8080/api/denuncias", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dadosDenuncia)
            });

            if (resposta.ok) {
                alert("Denúncia enviada com sucesso de forma anônima!");
                formulario.reset(); // Limpa os campos após o envio
                if (marcador) map.removeLayer(marcador); // Reseta o marcador do mapa
            } else {
                alert("Erro ao enviar a denúncia para o servidor.");
            }
        } catch (erro) {
            console.error("Erro na requisição:", erro);
            alert("Não foi possível conectar ao servidor Java.");
        }
    });
}