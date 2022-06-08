/**
 * dotenv 모듈을 통해서 .env 환경 설정 파일을 읽어온다.
 * .env 파일을 읽어서 object 형태로 사용한다.
 */

import path from 'path';
import dotenv from 'dotenv';

dotenv.config({
  path: path.join(__dirname, `/.env.develop`),
});

// 설정 내보내기
const config = Object.freeze({
  // Port
  serverHost: process.env.HOST,
  serverPort: process.env.PORT,

  dbHost: process.env.DATABASE_HOST,
  dbPort: process.env.DATABASE_PORT,
  dbName: process.env.DATABASE_NAME,
});

export default config;
