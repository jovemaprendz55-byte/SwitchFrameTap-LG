# Switch Frame Tap LG

Cliente experimental para adaptar o projeto [Switch Frame Tap](https://github.com/TomasUribe/switch-frame-tap) a TVs LG com webOS.

## Alvo deste projeto

- TV de teste: LG 32LR600BPSA
- Plataforma informada: webOS 23
- Resolução lógica do aplicativo: 1280 x 720 (HD)
- Pacote de destino: webOS `.ipk`
- ID: `com.jovemaprendz.switchframetaplg`

## Estado atual

A interface inicial permite informar o endereço IPv4 do Nintendo Switch e a porta TCP. Ela **não conecta nem reproduz vídeo ainda**.

O workflow GitHub Actions prepara os ícones PNG exigidos pelo webOS, instala o webOS TV CLI e tenta empacotar `app/` em um arquivo IPK. O arquivo gerado fica disponível como artefato da execução do workflow.

## Próximas etapas técnicas

1. Confirmar o formato exato das mensagens e o handshake da implementação de rede do Switch Frame Tap.
2. Criar um JavaScript Service compatível com o Node.js 12.22.2 usado pelo webOS TV 23 para a conexão TCP/UDP.
3. Definir uma ponte eficiente entre o serviço e a página web, evitando transportar cada frame como JSON/base64.
4. Validar a compatibilidade do fluxo H.264 recebido com o pipeline de vídeo do webOS 23. H.264 Annex-B bruto não deve ser presumido como entrada MSE válida sem empacotamento/formato de byte-stream compatível.
5. Integrar áudio e controles, medir latência e testar na TV física.

## Limitações conhecidas

- O build IPK não significa que a transmissão esteja implementada.
- O protocolo do projeto original precisa ser lido diretamente no código-fonte antes de implementar o cliente.
- O suporte a MSE no webOS 23 não garante, por si só, que qualquer fluxo H.264 bruto possa ser anexado diretamente a um MediaSource.
- A primeira validação deve ser instalação e abertura da interface na TV em Developer Mode.

## Build

O workflow `.github/workflows/build-ipk.yml` executa automaticamente em pushes na branch `main` ou manualmente pela aba **Actions**.

## Créditos e licença

O projeto original Switch Frame Tap é distribuído sob GPL-2.0. Esta adaptação deve preservar os avisos de copyright, a licença e as obrigações aplicáveis caso reutilize código do projeto original. Esta interface inicial ainda não incorpora código-fonte do viewer original.
