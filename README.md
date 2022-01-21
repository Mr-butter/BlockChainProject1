# BlockChainProject

## 프로젝트 팀명 : CoLink

### :relaxed: CoLink

### 블록체인 개념를 이해하고 적용해보기 위한 마이닝 사이트

## 프로젝트 시작일 : 2021-01-05

Member.

#### 김혜린: [깃허브] (https://github.com/Hyerin1208) :watermelon:

#### 박성근: [깃허브] (https://github.com/Mr-butter) :grapes:

#### 이민주: [깃허브] (https://github.com/codecocos) :strawberry:

## 목차

[1.개요](#개요)

[2.목적](#목적)

- 기존 서비스와의 차별점

[3.전체 소스 코드](#전체-소스-코드-click)

[4.사용한 기술](#사용한-기술)

[5.주요 기능](#주요-기능)

[6.발생한 이슈 & 해결 방법](#발생한-이슈--해결-방법)

[7.상세 설명](#상세-설명)

- DB 구조 (ERD)

- 전체 흐름도

- 프로젝트 설명 PPT

[8.참여인원](#참여-인원-4명)

---

### 개요

블록체인 동작원리, 작업증명 알고리즘, 웹소켓을 이해하기 위한 프로젝트

### 목적

> 수업시간에 배웠던 블록체인을 직접 구현하며 블록체인에 대한 이해
> 웹소켓을 통한 양방향 통신의 이해
> 노드기반 서버, 리액트 기반 클라이언트 작성
> 서버-클라이언트-데이터베이스 연동

### 사용한 기술 요약

Node.js (express 서버)
React (클라이언트)
ws (웹소켓)
eth-lightwallet (지갑)
crypto-js (암호화)
MUI (인터페이스)
Mysql, mariadb (데이터 베이스)

### 사용 모듈 (server) :

        "bcrypt": "^5.0.1",
        "cookie-parser": "~1.4.4",
        "cors": "^2.8.5",
        "crypto-js": "^4.1.1",
        "debug": "~2.6.9",
        "dotenv": "^10.0.0",
        "elliptic": "^6.5.4",
        "eth-lightwallet": "^4.0.0",
        "express": "~4.16.1",
        "express-session": "^1.17.2",
        "http-errors": "~1.6.3",
        "merkle": "^0.6.0",
        "morgan": "~1.9.1",
        "multer": "^1.4.4",
        "mysql2": "^2.3.3",
        "passport": "^0.5.2",
        "passport-local": "^1.0.0",
        "random": "^3.0.6",
        "sequelize": "^6.12.5",
        "sequelize-cli": "^6.3.0",
        "ws": "^8.4.0"

### 사용 모듈 (client) :

    "@emotion/react": "^11.5.0",
    "@emotion/styled": "^11.3.0",
    "@material-ui/core": "^4.12.3",
    "@mui/icons-material": "^5.2.5",
    "@mui/lab": "^5.0.0-alpha.54",
    "@mui/material": "^5.0.4",
    "@mui/styles": "^5.0.2",
    "@mui/x-data-grid": "^5.0.0-beta.7",
    "@testing-library/jest-dom": "^5.11.4",
    "@testing-library/react": "^11.1.0",
    "@testing-library/user-event": "^12.1.10",
    "apexcharts": "^3.32.1",
    "axios": "^0.24.0",
    "boxicons": "^2.1.1",
    "clsx": "^1.1.1",
    "copy-to-clipboard": "^3.3.1",
    "crypto-js": "^4.1.1",
    "date-fns": "^2.25.0",
    "eth-lightwallet": "^4.0.0",
    "final-form": "^4.20.4",
    "history": "^5.1.0",
    "jsonwebtoken": "^8.5.1",
    "markdown-to-jsx": "^7.1.3",
    "prop-types": "^15.7.2",
    "qs": "^6.10.1",
    "react": "^17.0.2",
    "react-apexcharts": "^1.3.9",
    "react-cookie": "^4.1.1",
    "react-date-range": "^1.4.0",
    "react-dom": "^17.0.2",
    "react-final-form": "^6.5.7",
    "react-icons": "^4.3.1",
    "react-modal": "^3.14.4",
    "react-redux": "^7.2.6",
    "react-router": "^5.2.1",
    "react-router-dom": "^5.3.0",
    "react-scripts": "4.0.3",
    "react-spring": "^9.0.0-rc.3",
    "recharts": "^2.1.6",
    "redux": "^4.1.2",
    "redux-actions": "^2.6.5",
    "redux-devtools-extension": "^2.13.9",
    "redux-persist": "^6.0.0",
    "redux-promise": "^0.6.0",
    "redux-thunk": "^2.4.0",
    "redux-undo": "^1.0.1",
    "styled-components": "^5.3.3",
    "web-vitals": "^1.0.1",
    "ws": "^8.4.0"

### 주요 기능

- 메인페이지 : `MUI` `styled-components` `boxicons` `redux`
- 로그인&지갑 : `crypto-js` `eth-lightwallet` `redux`
- 블록정보 페이지 : `sequelize` `mysql2`
- 마이닝 페이지 : `ws` `axios`

## 발생한 이슈와 해결방법

다른 OS 환경에서 테스트 중 빈번한 모듈에러

> > 서버 또는 클라이언트의 package-lock.json의 재작성으로 해결
> > 웹소켓 서버접속시 원장 반복되는 원장불일치 오류
> > 코드 작성시 비교조건 오류로 인한 수정 (개인적 오타)
> > 지갑 생성후 복구 시 기존에 있던 지갑인지 확인하는 문제
> > 지갑 관련 데이터 DB에 저장하는 것으로 해결
> > 클라이언트에서 실시간으로 블록의 변화를 확인
> > 클라이언트가 웹소켓에 접속하는 것으로 해결
> > 블록 생성 정보가 DB에 들어갈 경우 DB에서 블록정보 검색에 실패
> > DB자료구조 변경으로 해결 (JSON 형식을 STRING으로 변환)

## 디렉토리 설명
