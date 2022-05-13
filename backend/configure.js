import helmet from 'helmet'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import { Container } from 'typedi'
import express from 'express'
import config from './config'
import alyacBuildModel from "./models/dbSchema/alyac";
import AlyacDBManager from './manager/dbManager/alyacDBManager'
import apiAlyacRouter from "./routes/api/alyac";

/**
 * 프로젝트 초기화 및 구성 정보를 가져온다.
 * 1. DB 연결
 * 2. model(schema) 정의
 * 3. dbManager 생성
 * 4. Restful API 등록
 * @param app
 * @returns {Promise<void>}
 */
export default async function configure(app) {
  try {
    // DB 연결 정보를 설정한다.
    const dbOptions = {
      serverSelectionTimeoutMS: 3000,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }
    // DB 연결 정보는 config 파일에서 가져온다.
    const dbHost = `${config.dbHost}/${config.dbName}`
    // DB 연결
    const dbConnection = await mongoose.createConnection(dbHost, dbOptions)

    // DB model(schema) 정보를 생성한다.
    const alyacModels = alyacBuildModel(dbConnection)
    // 생성한 DB model 을 container 에 저장한다.
    // 저장한 model 은 dbManager 에서 꺼내서 사용한다.
    for (const [key, value] of Object.entries(alyacModels)) {
      // container 저장
      Container.set(`alyac.dbModel.${key}`, value)
    }

    // dbManager 를 생성해서, container 에 저장한다.
    Container.set('alyac.dbManager.AlyacDBManager', new AlyacDBManager(Container))

    // express 웹서버 설정
    app.enable('trust proxy')
    app.use(helmet())
    app.use(cors())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())

    // Restful API 라우터 등록
    // 모든 api 는 /api 를 prefix 로 붙인다.
    app.use('/api', apiAlyacRouter(Container))

    // 초기화 완료
    console.log('initialize configure')
  } catch (e) {
    console.log(e)
    console.log('Server initialize fail')
  }
}
