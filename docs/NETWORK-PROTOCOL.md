# Protocolo de rede — pesquisa inicial

Esta nota registra apenas o que foi confirmado no código-fonte original. Não inventar framing de pacotes: o formato completo dos quadros ainda precisa ser lido no viewer original.

## Descoberta do Switch na rede

Fonte original: `TomasUribe/switch-frame-tap`, arquivo `tier4/applet-mitm/source/applet_mitm_net.cpp`.

- O Switch escuta conexões de viewer em **TCP 9950**.
- O Switch envia beacon por **UDP 9951** enquanto não há viewer conectado.
- O beacon é texto ASCII no formato:

```text
SFTAP1 <IP_DO_SWITCH> 9950 Switch Frame Tap
```

- O beacon é enviado para broadcast global e para o broadcast da sub-rede, aproximadamente uma vez por segundo.
- O servidor aceita **um viewer por vez**.
- O viewer e o Switch precisam estar na mesma rede local.
- O Switch precisa estar configurado em modo Network e reiniciado para ativar esse transporte.

## Dados transmitidos

A documentação original confirma que a conexão de rede carrega o mesmo fluxo básico do transporte USB:

- cabeçalhos de stream identificados como `SFTR`;
- vídeo H.264;
- áudio PCM estéreo de 48 kHz.

O fluxo é enviado pelo TCP. TCP é um fluxo de bytes, portanto uma leitura pode conter parte de um pacote, um pacote inteiro ou vários pacotes. O cliente deverá acumular bytes e reconstruir mensagens conforme o framing real do protocolo.

## Mensagens do viewer para o Switch

Fonte original: `tier4/applet-mitm/source/applet_mitm_viewermsg.hpp`.

Mensagens identificadas:

| Bytes | Função |
| --- | --- |
| `SFTK` | Solicitar um keyframe |
| `SFTC` | Informar que o viewer desenha os recortes |
| `SFTD` | Informar que o viewer não desenha os recortes |
| `SFTL` | Travar o tamanho do stream durante gravação |
| `SFTU` | Destravar e seguir o tamanho do jogo |
| `SFTQ` | Encerrar (documentado para USB) |
| `SFTI` + 28 bytes | Estado do controle enviado pelo viewer |

O pacote `SFTI` tem 32 bytes no total; seus campos são little-endian. A primeira implementação para TV não enviará comandos de controle: apenas receberá vídeo e áudio.

## Plano de implementação para webOS 23

1. Implementar descoberta UDP 9951 no JavaScript Service.
2. Implementar conexão TCP 9950 no JavaScript Service usando APIs Node.js compatíveis com Node 12.22.2.
3. Ler o código do viewer Android/PC para reproduzir exatamente o framing `SFTR` e o sincronismo de áudio/vídeo.
4. Criar uma ponte binária de baixa sobrecarga entre o serviço e o app web. Não enviar cada frame como JSON/base64.
5. Validar o formato de vídeo que o player webOS aceita. O fato de o webOS 23 oferecer MSE não prova que H.264 Annex-B bruto possa ser anexado diretamente.
6. Testar primeiro vídeo sem áudio, depois áudio sincronizado.

## Fontes

- Projeto original: https://github.com/TomasUribe/switch-frame-tap
- Transporte: `tier4/applet-mitm/source/applet_mitm_net.cpp`
- Mensagens do viewer: `tier4/applet-mitm/source/applet_mitm_viewermsg.hpp`
- Guia webOS JavaScript Services: https://webostv.developer.lge.com/develop/guides/js-service-basics
