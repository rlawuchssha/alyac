
import express from 'express'
import http from 'http'

// 설정 정보 가져오기
import config from './config'
import configure from './configure'

/**
 * 서버를 생성한다.
 * 1. 웹서버(express) 생성
 * 2. DB 연결 및 준비
 */
class Server {
  constructor() {
    this.http = http
    this.port = config.serverPort
    this.app = null
    this.server = null
  }

  async initialize() {
    this.app = express()
    // express 생성
    this.server = http.createServer(this.app)
    // 구성 초기화
    await configure(this.app)
  }

  // 웹서버 시작
  listen() {
    return new Promise((resolve) => this.server.listen(this.port, '0.0.0.0', () => resolve(this)))
  }
}

// 서버 구동 부분
async function runServer() {
  const server = new Server()
  await server.initialize()
  return server.listen()
}

// 서버 시작
runServer().then((server) => console.log(`Alyac Server Ready : ${server.port}`))

/*
## Directory 구조
	.
	├── config                  // 환경설정 파일
	├── manager                 
	│   └── dbManager
	│       └── alyacDBManager  // DB 접근 매니저
	│                           
	├── models                  // DB 모델
	│   ├── dbSchema
	│    ...
	│
	├── routes                  // 라우팅 처리
	│   ├── api                 // Restful API 정의
	│    ...
	│
	├── index.js                // 프로젝트 초기화(manager)
	└── package.json            // npm 모듈 정의
*/