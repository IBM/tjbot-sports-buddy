[![Build Status](https://travis-ci.org/IBM/tjbot-sports-buddy.svg?branch=master)](https://travis-ci.org/IBM/tjbot-sports-buddy)

# Desenvolva um TJBot usando serviços do Watson para falar sobre esportes

*Ler em outros idiomas: [한국어](README-ko.md).*

Nesta jornada do desenvolvedor, será desenvolvido um TJBot que entende de beisebol. Usando o Watson Discovery, o TJBot fornecerá informações sobre seus times preferidos, como posição atual na liga, próximos jogos e links para alguns artigos relevantes do Watson News.

Depois de concluir esta jornada, o leitor saberá como:
* Desenvolver um TJBot que conversa usando o Watson Assistant
* Usar os serviços Watson Text to Speech e Speech to Text para conversar com o TJBot
* Usar o Watson Tone Analyzer para determinar como você se sente em relação aos seus times preferidos
* Usar o Watson Discovery News para encontrar notícias a respeito dos seus times preferidos
* Consultar origens de dados de terceiros para obter os dados mais recentes da Major League Baseball (MLB)
* Usar o Twilio para enviar mensagens de texto por SMS com os calendários dos times e links para notícias

![](doc/source/images/architecture.png)

### With Watson
Deseja levar seu aplicativo Watson para o próximo nível? Quer aproveitar os ativos da marca Watson? Participe do programa [With Watson](https://www.ibm.com/watson/with-watson), que oferece recursos técnicos, de marketing e da marca exclusivos para amplificar e acelerar sua solução comercial incorporada do Watson.

## Componentes inclusos
* [Watson Assistant](https://www.ibm.com/watson/developercloud/conversation.html): Desenvolva, teste e implemente um bot ou agente virtual em dispositivos móveis, plataformas de sistemas de mensagens ou até mesmo um robô físico.
* [Watson Discovery](https://www.ibm.com/watson/developercloud/discovery.html): Um mecanismo cognitivo de procura e analytics de conteúdo para aplicativos identificarem padrões, tendências e informações acionáveis.
* [Watson Text to Speech](https://www.ibm.com/watson/developercloud/text-to-speech.html): Converte textos escritos para áudios em linguagem natural, com suporte a vários idiomas e tipos de vozes.
* [Watson Speech to Text](https://www.ibm.com/watson/developercloud/speech-to-text.html): Um serviço que converte voz humana em textos escritos.
* [Watson Tone Analyzer](https://www.ibm.com/watson/developercloud/tone-analyzer.html): Usa análise linguística para detectar os tons da comunicação em texto escrito.

## Tecnologias utilizadas
* [Twilio](https://www.twilio.com/): Integre voz, sistema de mensagens e VoIP nos seus aplicativos móveis e da web.
* [MLB FantasyData](https://fantasydata.com/): Um dos principais provedores de conteúdo e dados esportivos em tempo real para vários esportes, atendendo a clientes de fantasy league, mídia e dispositivo móvel no mundo todo.
* [Node.js](https://nodejs.org/en/): Um tempo de execução JavaScript direcionado por evento assíncrono, criado para o desenvolvimento de aplicativos escaláveis.
# Assista ao vídeo
[![](http://img.youtube.com/vi/NJ87_rYfH0c/0.jpg)](https://www.youtube.com/watch?v=NJ87_rYfH0c)
# Etapas

Este aplicativo foi criado para ser executado em um TJBot, mas pode funcionar em qualquer estação de trabalho ou laptop padrão com suporte para controles de áudio - especificamente, um dispositivo de entrada de microfone e um alto-falante de saída. Para começar, talvez seja mais simples instalar no seu laptop. Caso queira desenvolver diretamente em um TJBot, passe para a seção [Desenvolver um TJBot](#build-a-tjbot) antes de concluir as próximas etapas.
1. [Clonar o repositório](#1-clone-the-repo)
2. [Criar serviços do Bluemix](#2-create-bluemix-services)
3. [Configurar o Watson Assistant](#3-configure-watson-conversation)
4. [Ativar o Watson Discovery](#4-enable-watson-discovery)
5. [Ativar o Watson Speech to Text](#5-enable-watson-speech-to-text)
6. [Ativar o Watson Text to Speech](#6-enable-watson-text-to-speech)
7. [Ativar o Watson Tone Analyzer](#7-enable-watson-tone-analyzer)
8. [Inscrever-se no serviço do Twilio](#8-register-for-twilio-service)
9. [Inscrever-se no serviço do MLB FantasyData](#9-register-for-mlb-fantasy-data-service)
10. [Executar o aplicativo](#10-run-the-application)
## 1. Clonar o repositório
Clone o `tjbot-sports-buddy` localmente. Em um terminal, execute:

`$ git clone https://github.com/ibm/tjbot-sports-buddy`

Utilizaremos o arquivo [`data/workspace.json`](data/workspace.json)

# 2. Criar serviços do Bluemix
Crie os serviços a seguir:
* [**Watson Assistant**](https://console.ng.bluemix.net/catalog/services/conversation)
* [**Watson Discovery**](https://console.ng.bluemix.net/catalog/services/discovery)
* [**Watson Text to Speech**](https://console.ng.bluemix.net/catalog/services/text-to-speech/)
* [**Watson Speech to Text**](https://console.ng.bluemix.net/catalog/services/speech-to-text/)
* [**Watson Tone Analyzer**](https://console.ng.bluemix.net/catalog/services/tone-analyzer/)
## 3. Configurar o Watson Assistant
Acione a ferramenta **Watson Assistant**. Use o botão com o ícone **import** à direita

<p align="center">
  <img width="400" height="55" src="doc/source/images/import_conversation_workspace.png" />
</p>

Localize a versão local de [`data/workspace.json`](data/workspace.json) e selecione **Import**. Para localizar o **ID da área de trabalho**, clique no menu de contexto da nova área de trabalho e selecione **View details**. Salve esse ID para mais tarde.

<p align="center">
  <img width="400" height="250" src="doc/source/images/open_conversation_menu.png" />
</p>

*Como opção*, para visualizar o diálogo do Assistant, selecione a área de trabalho e escolha a guia **Dialog**. Este é um fragmento do diálogo:

![](doc/source/images/dialog.png)

## 4. Ativar o Watson Discovery

Acione a ferramenta **Watson Discovery**. Selecione **Watson Discovery News Collection**.

<p align="center">
  <img width="400" height="250" src="doc/source/images/watson_news.png" />
</p>

No painel de detalhes, salve os valores **environment_id** e **collection_id**.

<p align="center">
  <img width="800" height="225" src="doc/source/images/view_discovery_ids.png" />
</p>

## 5. Ativar o Watson Speech to Text
Selecione o serviço **Watson Speech to Text**. Selecione o item do menu **Service credentials**.

![](doc/source/images/speech_to_text_ids.png)

Clique em **View Credentials** e salve os valores **username** e **password**.
## 6. Ativar o Watson Text to Speech
Selecione o serviço **Watson Text to Speech**. Selecione o item do menu **Service credentials**.

![](doc/source/images/text_to_speech_ids.png)

Clique em **View Credentials** e salve os valores **username** e **password**.
## 7. Ativar o Watson Tone Analyzer
Selecione o serviço **Watson Tone Analyzer**. Selecione o item do menu **Service credentials**.

![](doc/source/images/tone_analyzer_ids.png)

 Clique em **View Credentials** e salve os valores **username** e **password**.

 ## 8. Inscrever-se para o serviço do Twilio
 Uma das funções principais do `tjbot-sports-buddy` é enviar mensagens de texto sobre os próximos jogos e manchetes de notícias a respeito dos times de beisebol preferidos dos usuários. Para enviar mensagens de texto por SMS, usamos o serviço do Twilio. Inscreva-se para uma conta para teste gratuita em [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio).

 Como parte do serviço, serão atribuídos os valores a seguir, que precisarão ser salvos. É possível acessá-los por meio das configurações da conta do usuário:
 - SID da conta
 - Token de autenticação

 ![](doc/source/images/twilio.png)

 Por fim, você precisará de um número de telefone fornecido pelo Twilio, do qual todas as mensagens de texto serão originadas. Para criar um, navegue até a opção *Programmable SMS* no menu de contexto.

 ![](doc/source/images/number.png)

 - Número de telefone fornecido pelo Twilio

 Por padrão, você poderá enviar mensagens de texto por SMS somente para o número de telefone que foi fornecido no momento da criação da conta. Para enviar mensagens para outros números, você precisa adicioná-los em [https://www.twilio.com/console](https://www.twilio.com/). Para cada número inserido, o usuário do número deverá verificá-lo e vai receber um código de verificação. Em seguida, o código de verificação deve ser inserido para concluir o processo de registro.

 ## 9. Inscrever-se para o serviço do MLB FantasyData

 Outra característica do `tjbot-sports-buddy` é ser capaz de fornecer estatísticas atualizadas da Major League Baseball (MLB). Especificamente, calendário e posição. Para recuperar esses dados, usamos APIs fornecidas pelo FantasyData.

 Inscreva-se para uma conta para teste gratuita em [https://developer.fantasydata.com](https://developer.fantasydata.com).

 Após a inscrição, salve a chave de assinatura fornecida, disponível no seu perfil.

 ![](doc/source/images/mlb.png)

 ## 10. Executar o aplicativo

 Em primeiro lugar, atualize os valores em [`config.new.js`](config.new.js) e renomeie como `config.js`:

 ```
 $ cp config.new.js config.js ### edit config.js
 ```
 Em segundo lugar, instale as dependências, execute o seguinte no local do repositório clonado:
 ```
 $ npm install --save
 ```
 > **OBSERVAÇÃO:** talvez seja necessário instalar outras dependências; consulte a seção [Resolução de Problemas](resolução de problemas) abaixo.

 Por fim, execute o aplicativo:
 ```
 $ node run.js
 ```
 # Saída de amostra

 Versão textual de uma conversa de amostra com o TJBot:

 >**Você:** "Olá, Watson"

 >**TJBot:** "Olá. Eu me chamo Watson e gosto muito de beisebol. Qual é seu time preferido?"

 >**Você:** "Os Yankees"

 >**TJBot:** "Os New York Yankees estão em primeiro lugar no momento. Como você acha que será o desempenho do time este ano?"

 >**Você:** "Excelente!"

 >**TJBot:** "Concordo, se conseguirem se manter em forma"

 >**TJBot:** "Gostaria de receber uma mensagem de texto com os próximos jogos dos New York Yankees e links para algumas manchetes do Watson News?"

 >**Você:** "Claro"

 >**TJBot:** "Qual número devo usar?"

 >**Você:** “Um, dois, três, quatro, cinco, seis, sete, oito, nove, dez, zero"

 >**TJBot:** "A mensagem de texto foi enviada. Você está interessado em algum outro time?"

 >**Você:** "Não, obrigado"

 >**TJBot:** "Certo. Tenha um bom dia"

 Segue uma recapitulação dos serviços usados para ter essa conversa:

 - *Watson Assistant:* O fluxo da conversa.
 - *Watson Speech-To-Text:* Converte a entrada do usuário em texto.
 - *Watson Text-To-Speech:* Converte as respostas do TJBot em som.
 - *Watson Tone Analyzer:* Determina uma resposta adequada ao sentimento do usuário em relação ao seu time preferido.
 - *Watson Discovery:* Gera links para manchetes sobre o time.
 - *FantasyData:* Recupera a posição atual e os próximos jogos do time.
 - *Twilio:* Envia mensagem de texto com o calendário e notícias sobre a equipe para o usuário.

 ## Desenvolver um TJBot

 Para desenvolver um TJBot, siga o tutorial intitulado: [Desenvolva um chatbot que se importa: Parte 2](https://medium.com/ibm-watson-developer-cloud/build-a-chatbot-that-cares-part-2-66367cf26e4b).

 Ele contém um guia abrangente para:
 - Configuração do Raspberry Pi
 - Montagem do TJBot Carboard
 - Configuração do Node.js
 - Suporte e resolução de problemas de áudio

 Quando o TJBot estiver em execução e funcional, realize as etapas 1-10 acima para configurar e executar o aplicativo **TJBot Sports Buddy**.

 # Resolução de Problemas
 ### Socorro! Meu aplicativo está falhando

 Talvez você precise instalar algumas dependências relacionadas a áudio caso esteja vendo este erro:
 ```
 events.js:163 throw er; // Unhandled 'error' event
 ```

 #### No OSX

 Use `brew` para instalar:
 * mplayer * sox * ffmpeg
 ```
 $ brew install sox mplayer ffmpeg
 ```
 E use NPM para instalar: * node-ffprobe
 ```
 $ npm install node-ffprobe
 ```
 #### No Ubuntu Use `apt-get` para instalar: * ffmpeg
 ```
 $ sudo apt-get install ffmpeg
 ```
 E use NPM para instalar: * node-ffprobe
 ```
 $ npm install node-ffprobe
 ```
 ### O TJBot diz "Oi, estou acordado" e, em seguida, é desativado.
 Encontramos esse erro no Ubuntu. É causado por problemas no microfone.

 A primeira etapa é diagnosticar o problema. Em [run.js](run.js), acesse o objeto a seguir e modifique `debug` para true:
 ```
 const MIC_PARAMS = {
   rate: 44100,
   channels: 2,
   debug: true,
   exitOnSilence: 6
 };
 ```

 Se encontrar o erro:
 ```
 Received Info: arecord: main:722: audio open error: No such file or directory
 ```
 Tente fazer o seguinte:
 ```
 $ arecord -l // locate your microphone card and device number
 **** List of CAPTURE Hardware Devices ****
 card 0: Intel [HDA Intel], device 0: ALC262 Analog [ALC262 Analog]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
 card 0: Intel [HDA Intel], device 2: ALC262 Alt Analog [ALC262 Alt Analog]
  Subdevices: 2/2
  Subdevice #0: subdevice #0
  Subdevice #1: subdevice #1
card 2: C320M [Plantronics C320-M], device 0: USB Audio [USB Audio]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
 ```

 A seguir, inclua o número da placa e do dispositivo (`hw:card,device`) nos parâmetros do microfone. Por exemplo, para usar a placa `Plantronics` acima:
 ```
 const MIC_PARAMS = {
   rate: 44100,
   channels: 2,
   device: 'hw:2,0',
   debug: true, exitOnSilence: 6
 };
 ```

 Se encontrar o erro:
 ```
 Received Info: arecord: main:722: audio open error: Device or resource busy
 ```

 Significará que seu dispositivo está sendo usado por outro processo. Tente fazer o seguinte:
 1. Saia de qualquer aplicativo de controle de áudio que possa estar em execução, como `PulseAudio`.
 2. Saia de todos os navegadores abertos. Caso ainda encontre o erro, reinicialize.
 > **OBSERVAÇÃO:** não se esqueça de definir `debug:false` depois que tudo estiver funcionando; caso contrário, muitas mensagens de log serão enviadas ao console.

 # Licença
 [Apache 2.0](LICENÇA)
