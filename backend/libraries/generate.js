import path from 'path';
import mongoose from "mongoose";
import alyacBuildModel from "../models/dbSchema/alyac";
import config from '../config';

async function run() {
  try {
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

    const alyacModels = alyacBuildModel(dbConnection)

    const alyac = await import(path.join(process.cwd(), './libraries/alyac.json'));
    await alyacModels.alyac.deleteMany()

    for (const a of alyac.default) {
      alyacModels.alyac.create({
        num: a.num,
        name: a.name,
        company: a.company,
        component: a.component,
        effect: a.effect,
        use: a.use,
        pre_condition: a.pre_condition,
        caution: a.caution,
        caution_eat: a.caution_eat,
        caution_reaction: a.caution_reaction,
        keep: a.keep,
        open_date: a.open_date,
        update_date: a.update_date,
      })
    }
  } catch (e) {
    console.log(e);
  }
}

run().then(() => {
  console.log('success');
});
