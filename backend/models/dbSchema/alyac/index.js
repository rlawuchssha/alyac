import _ from 'lodash'
import mongoose from 'mongoose'
import alyacSchema from "./alyac";

const schemes = { alyacSchema }

const NAME_MATCH = /(.*?)Schema$/

function _discriminate(db, base, name, schema) {
    if (db.models[name]) {
        return db.models[name]
    }
    return base.discriminator(name, schema)
}

/**
 * alyac table(schema 정보를 가져온다)
 * 정의한 alyacSchema 를 가져와서 반환한다. DB Table 생성
 * @param database
 * @returns {Dictionary<mongoose/Model>}
 */
function alyacBuildModel(database) {
    const db = database || mongoose
    const models = _.chain(schemes)
        .mapKeys((v, k) => k.match(NAME_MATCH)[1])
        .mapValues((s, k) => db.model(k, s, k))
        .value()

    return models
}

export default alyacBuildModel
