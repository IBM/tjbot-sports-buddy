[![Build Status](https://travis-ci.org/IBM/tjbot-sports-buddy.svg?branch=master)](https://travis-ci.org/IBM/tjbot-sports-buddy)

# 스포츠에 대해 이야기하는 Watson Services를 활용한 TJBot 구축하기

이 개발자 여정에서는 야구를 아는 TJBot을 제작할 것입니다. Watson Discovery를 사용하여 TJBot은 좋아하는 팀의 현재 리그 순위, 예정된 일정 및 관련 기사 링크등의 정보를 Watson News로 부터 제공합니다. Twilio를 통해 사용자에게 SMS 문자 메시지를 보내는 방법도 추가로 보여줍니다.

이 개발 과정을 마치면 다음과 같은 것을 이해하게 될 것입니다 :

* Watson Conversation을 사용한 대화형 TJBot의 작성
* Watson Text to Speech 및 Speech to Text 서비스를 통한 TJBot과의 대화
* Watson Tone Analyzer를 사용하여 좋아하는 팀에 대한 대중의 의견 분석 (감성 분석)
* Watson Discovery를 사용하여 좋아하는 팀에 대한 뉴스 기사 검색
* FantasyData.com와 같은 타사 데이터 소스를 쿼리를 통한 최신 Major League Baseball (MLB) 데이터 가져오기
* Twilio를 사용하여 팀 일정 및 뉴스 기사 링크가 포함 된 SMS 문자 발송


![](doc/source/images/architecture.png)

### With Watson

Watson 애플리케이션의 다음 레벨로 넘어가고 싶으신가요? Watson 브랜드 자산을 활용하고 싶으신가요? 독점적 브랜드, 마케팅, 기술 리소스를 제공하는 [With Watson](https://www.ibm.com/watson/with-watson) 프로그램에 참여하시면 Watson을 활용한 여러분의 상용 솔루션의 가치를 높일 수 있습니다.

## 포함된 구성요소

* [Watson Conversation](https://www.ibm.com/watson/developercloud/conversation.html): 모바일 디바이스와 메신저 플랫폼, 심지어 물리적 로봇 상에서의 대화 봇 또는 가상 에이전트를 빌드, 테스트하고 디플로이합니다.
* [Watson Discovery](https://www.ibm.com/watson/developercloud/discovery.html): 특정 패턴, 트렌드, 실행 가능한 인사이트를 도출하는 애플리케이션 개발을 위한 인공지능 기반 검색, 콘텐츠 분석 엔진.
* [Watson Text to Speech](https://www.ibm.com/watson/developercloud/text-to-speech.html): Converts written text into natural sounding audio in a variety of languages and voices.
* [Watson Speech to Text](https://www.ibm.com/watson/developercloud/speech-to-text.html): A service that converts human voice into written text.
* [Watson Tone Analyzer](https://www.ibm.com/watson/developercloud/tone-analyzer.html): Uses linguistic analysis to detect communication tones in written text.

## 주요 기술

* [Twilio](https://www.twilio.com/): 음성, 메시징 및 VoIP를 웹 및 모바일 앱에 통합시킵니다. 
* [MLB Fantasy Data](https://fantasydata.com/): A leading provider of real time sports data and content across multiple sports, serving fantasy, media and mobile clients worldwide.
* [Node.js](https://nodejs.org/en/): An asynchronous event driven JavaScript runtime, designed to build scalable applications.

# 비디오 보기

[![](http://img.youtube.com/vi/NJ87_rYfH0c/0.jpg)](https://www.youtube.com/watch?v=NJ87_rYfH0c)

# 단계

이 응용 프로그램은 TJBot에서 실행되도록 설계되었지만 오디오 컨트롤(특히 마이크 입력 장치 및 출력 스피커)을 지원하는 모든 표준 워크 스테이션 또는 랩톱에서 작동 할 수 있습니다. 먼저 노트북에서 이 작업을 수행하는 것이 더 간단할 수 있습니다. TJBot에서 직접 빌드 하려면 다음 단계를 완료하기 전에 [Build a TJBot](#build-a-tjbot) 섹션으로 이동 하십시오.

1. [저장소 복제](#1-저장소-복제)
2. [Bluemix 서비스 생성](#2-bluemix-서비스-생성)
3. [Watson Conversation 구성](#3-watson-conversation-구성)
4. [Watson Discovery 사용](#4-watson-discovry-사용)
5. [Watson Speech to Text 사용](#5-watson-speech-to-text-사용)
6. [Watson Text to Speech 사용](#6-watson-text-to-speech-사용)
7. [Watson Tone Analyzer 사용](#7-watson-tone-analyzer-사용)
8. [Twilio 서비스 등록](#8-Twilio-서비스-등록)
9. [MLB 판타지 데이터 서비스 등록](#9-MLB-판타지-데이터-서비스-등록)
10. [애플리케이션 실행](#10-애플리케이션-실행)

## 1. 저장소 복제

'tjbot-sports-buddy'를 로컬에 복제합니다. 터미널에서 다음을 실행합니다.:

  `$ git clone https://github.com/ibm/tjbot-sports-buddy`

[`data/workspace.json`](data/workspace.json)파일도 함께 사용할 것입니다.

## 2. Bluemix 서비스 생성

다음 서비스를 생성하십시오.:

  * [**Watson Conversation**](https://console.ng.bluemix.net/catalog/services/conversation)
  * [**Watson Discovery**](https://console.ng.bluemix.net/catalog/services/discovery)
  * [**Watson Text to Speech**](https://console.ng.bluemix.net/catalog/services/text-to-speech/)
  * [**Watson Speech to Text**](https://console.ng.bluemix.net/catalog/services/speech-to-text/)
  * [**Watson Tone Analyzer**](https://console.ng.bluemix.net/catalog/services/tone-analyzer/)


## 3. Watson Conversation 구성

 **Watson Conversation** 도구를 실행합니다. 오른쪽의 **import** 아이콘 버튼을 사용합니다.

<p align="center">
  <img width="400" height="55" src="doc/source/images/import_conversation_workspace.png">
</p>

로컬에 복제된 [`data/workspace.json`](data/workspace.json) 파일을 찾아,
**Import** 에서 선택합니다. 생성된 작업 공간 (workspace)의 컨텍스트 메뉴 내 **View details**를 클릭하여, **Workspace ID** 를 찾습니다. 나중을 위해 기억합니다.

<p align="center">
  <img width="400" height="250" src="doc/source/images/open_conversation_menu.png">
</p>

*필요에 따라*, 대화 플로우를 보려면, 해당 작업 공간(workspace)를 선택 후, **Dialog** 탭을 선택합니다. 해당 내용의 스닛펫은 다음과 같습니다.:

![](doc/source/images/dialog.png)

## 4. Watson Discovery 사용

**Watson Discovery** 도구를 실행합니다. **Watson Discovery News Collection**를 선택합니다.

<p align="center">
  <img width="400" height="250" src="doc/source/images/watson_news.png">
</p>

세부 정보 패널에서, **environment_id** 및 **collection_id** 값을 확인합니다.

<p align="center">
  <img width="800" height="225" src="doc/source/images/view_discovery_ids.png">
</p>

## 5. Watson Speech to Text 사용

**Watson Speech to Text** 서비스를 선택합니다. **Service credentials** 메뉴 아이템를 선택합니다.

![](doc/source/images/speech_to_text_ids.png)

**View Credentials** 를 선택하고, **username** 및 **password** 값을 확인합니다.

## 6. Watson Text to Speech 사용

**Watson Text to Speech** 서비스를 선택합니다. **Service credentials** 메뉴 아이템을 선택합니다.

![](doc/source/images/text_to_speech_ids.png)

**View Credentials** 를 선택하고, **username** 및 **password** 값을 확인합니다.

## 7. Watson Tone Analyzer 사용

**Watson Tone Analyzer** 서비스를 선택합니다. **Service credentials** 메뉴 아이템을 선택합니다.

![](doc/source/images/tone_analyzer_ids.png)

**View Credentials** 를 선택하고, **username** 및 **password** 값을 확인합니다.

## 8. Twilio 서비스 등록

`tjbot-sports-buddy` 의 주요 기능 중 하나는 사용자가 좋아하는 야구 팀의 다음 경기 일정 및 관련 뉴스 헤드라인를 SMS로 받는 것입니다.
대한 곧 출시 될 게임 및 뉴스 헤드 라인입니다. SMS 문자 메시지를 보내기 위해 Twilio 서비스를 사용합니다. 
SMS text messages, we use the Twilio service. [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio) 에서 무료 평가판 계정을 등록합니다.

해당 서비스 설정 정보 중 몇가지를 사용자 계정 설정을 통해 확인합니다.:

- 계정 SID (Account SID)
- 인증 토큰 (Authentication Token)

![](doc/source/images/twilio.png)

마지막으로 Twilio에서 제공한 전화 번호가 필요합니다. 이 번호를 통해 SMS 문자 메시지가 발송됩니다. 전화 번호 생성을 위해 컨텍스트 메뉴에서 *Programmable SMS* 옵션으로 이동하십시오.

![](doc/source/images/number.png)

- Twilio가 제공 한 전화 번호

기본적으로 계정을 만들 때 제공한 전화 번호로만 SMS 문자 메시지를 보낼 수 있습니다. 다른 번호로 메시지를 보내려면 [https://www.twilio.com/console](https://www.twilio.com/)에서 해당 전화 번호를 추가하여야 합니다. 입력한 각 번호에 대해 해당 번호의 사용자에게 확인을 요청하는 인증 코드가 전송되며, 등록 프로세스를 완료하려면이 인증 확인 코드를 입력해야 합니다.

## 9. MLB 판타지 데이터 서비스 등록

`tjbot-sports-buddy` 또 다른 특징은 MLB (메이저 리그 야구) 경기 일정 및 순위와 관련된 기록 및 정보를 제공한다는 것입니다. FantasyData에서 제공하는 API를 사용하여, 관련 정보를 수신합니다.

[https://developer.fantasydata.com](https://developer.fantasydata.com)에서 무료 평가판을 등록합니다.

등록되면 본인 계정에 제공되는 구독 키를 저장하십시오.

![](doc/source/images/mlb.png)

## 10. 애플리케이션 실행

첫째, [`config.new.js`](config.new.js) 에 있는 값을 업데이트 한 후 `config.js`로 파일 이름을 변경합니다.:

```
$ cp config.new.js config.js
### edit config.js
```

둘째, 의존 관계에 있는 라이브러리를 설치합니다. 로컬 복제본 저장소 위치에서 다음을 실행하십시오:

```
$ npm install --save
```

> **NOTE:** 다른 의존 관계에 있는 라이브러리를 설치해야 할 수도 있습니다. 아래의 [Troubleshooting](troubleshooting) 섹션을 참조합니다.

마지막으로 애플리케이션을 실행합니다.:

```
$ node run.js
```

# 샘플 출력

TJBot을 사용한 샘플 대화의 텍스트 버전 :

>**You:** "Hello Watson" 

>**TJBot:** "Hello. I'm Watson and I love baseball. Who's your favorite team?"

>**You:** "The Yankees"

>**TJBot:** "The New York Yankees are currently in first place. How do you think they will do this year?"

>**You:** "Great!"

>**TJBot:** "I agree, if they can stay healthy"

>**TJBot:** "Would you like me to text you the New York Yankees upcoming schedule and some headling links from Watson News?"

>**You:** "Sure"

>**TJBot:** "What number should I use?"

>**You:** "One two three four five six seven eight nine ten zero"

>**TJBot:** "Your text has been sent. Are you interested in any other teams?"

>**You:** "No thank you"

>**TJBot:** "OK. Have a nice day"

이 대화를 수행하는 데 사용된 서비스를 요약하면 다음과 같습니다.:

- *Watson Conversation:* 대화 흐름.
- *Watson Speech-To-Text:* 사용자 입력을 텍스트로 변환합니다.
- *Watson Text-To-Speech:* TJ Bot 응답을 음성으로 변환합니다.
- *Watson Tone Analyzer:* 자신이 가장 좋아하는 팀에 대한 사용자의 감정에 기반하여 적절한 응답을 결정합니다
- *Watson Discovery:* 팀에 대한 헤드 라인 링크를 생성합니다.
- *Fantasy Data:* 팀의 예정된 경기 일정을 가져옵니다. 
- *Twilio:* 사용자에게 팀 일정과 관련 뉴스를 SMS로 보냅니다.

## Build a TJBot

당신만으 TJBot를 작성하려면 아래의 튜토리얼을 참고하십시오.
[Build a Chatbot That Cares - Part2](https://medium.com/ibm-watson-developer-cloud/build-a-chatbot-that-cares-part-2-66367cf26e4b).

다음을 위한 포괄적인 안내를 제공합니다.:

- 라즈베리 파이 설정
- TJBot 카드 보드 조립
- Node.js 설정
- 오디오 지원 및 문제 해결

위의 과정을 통해 TJBot을 만들고 실행하셨다면, 위의 1 - 10 단계를 수행하여, **TJBot Sports Buddy** 애플리케이션을 실행합니다. 

# 문제 해결

### 도와주세요! 내 앱이 죽습니다.

다음 오류가 표시되는 경우 몇 가지 오디오 관련 추가 라이브러리를 설치해야 할 수 있습니다:

```
events.js:163
  throw er; // Unhandled 'error' event
```

#### OSX의 경우

`brew` 를 이용하여 설치합니다.:

* mplayer
* sox
* ffmpeg

```
$ brew install sox mplayer ffmpeg
```

NPM 를 이용하여 설치합니다.:

* node-ffprobe

```
$ npm install node-ffprobe
```

#### 우분투의 경우

`apt-get` 를 이용하여 설치합니다.:

* ffmpeg

```
$ sudo apt-get install ffmpeg
```

NPM 를 이용하여 설치합니다.:

* node-ffprobe

```
$ npm install node-ffprobe
```

# License

[Apache 2.0](LICENSE)
