# Kruppa — demonstração do site institucional

Versão temporária do site institucional Kruppa, com a paleta e a animação aprovadas.
O verde da interface é #d6de23. Todos os cubos da animação são cor-de-rosa,
e a brincadeira repete-se automaticamente a cada 30 segundos enquanto visível.
O controlo Pausar animação permite interromper e retomar; respeita movimento reduzido.
Este repositório contém apenas HTML, CSS, JavaScript e as ilustrações do site.
O logótipo, a galeria e o vídeo continuam a usar os endereços públicos da biblioteca Wix.

## Publicar no GitHub Pages

Em Settings → Pages, seleccionar Deploy from a branch, branch main e pasta / (root).
O site usa caminhos relativos, compatíveis com o endereço de projecto do GitHub Pages.
Não configurar um domínio personalizado para esta demonstração.

## Ligações

- Pré-candidatura temporária: mailto:geral@kkruppa.com,pedagogia@kkruppa.com
- Login no rodapé: https://kflow.kkruppa.com/

Os quatro botões de pré-candidatura abrem uma mensagem pré-preenchida para os dois
endereços. O visitante confirma o envio na sua aplicação de email. O site estático
não envia mensagens automaticamente. O Login continua a exigir o subdomínio Kflow activo.
O GitHub Pages publica o site institucional; não executa a plataforma Kflow.

## Rollback da ilustração

A imagem original permanece intacta em assets/kruppa-menino-storyboard.jpg.
SHA-256: 16e2054dd82145987eee22de76a5cd7e8c50567ac36aa81615eadd1cbc7583d8
Para repor a versão estática, mudar mode para 'static' em hero-config.js.
A opção ?hero=static#inicio permite ver essa versão sem alterar a configuração.

## Retirar a demonstração

Em Settings → Pages, escolher Unpublish site. Isto retira o endereço público
sem apagar o repositório ou afectar o site oficial no Wix.
