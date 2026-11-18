(function () {
  "use strict";
  var host = document.getElementById("host");
  var port = document.getElementById("port");
  var button = document.getElementById("connect");
  var state = document.getElementById("state");
  var feedback = document.getElementById("feedback");

  function validIPv4(value) {
    var parts = value.trim().split(".");
    if (parts.length !== 4) return false;
    return parts.every(function (part) {
      if (!/^\d{1,3}$/.test(part)) return false;
      var n = Number(part);
      return n >= 0 && n <= 255;
    });
  }

  button.addEventListener("click", function () {
    var address = host.value.trim();
    var tcpPort = Number(port.value);
    if (!validIPv4(address)) {
      state.textContent = "Endereço IP inválido";
      feedback.textContent = "Digite o IPv4 local do Switch, por exemplo 192.168.1.50.";
      host.focus();
      return;
    }
    if (!Number.isInteger(tcpPort) || tcpPort < 1 || tcpPort > 65535) {
      state.textContent = "Porta inválida";
      feedback.textContent = "Informe uma porta TCP entre 1 e 65535. A porta padrão do projeto original é 9950.";
      port.focus();
      return;
    }
    state.textContent = "Dados conferidos";
    feedback.textContent = "IP " + address + " e porta " + tcpPort + " foram validados. Ainda não foi aberta uma conexão: a implementação de sockets TCP/UDP e decodificação H.264 para webOS é a próxima etapa.";
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && document.activeElement !== button) {
      button.click();
    }
  });
}());
