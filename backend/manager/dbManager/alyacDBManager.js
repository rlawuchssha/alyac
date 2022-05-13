/**
 * 데이터 베이스에 접근해서 데이터를 가져오는 class
 * 몽고 DB 모델을 container 에서 꺼내서 가져온다.
 * 모델을 통해 DB query 를 사용한다.
 */
export default class AlyacDBManager {
    // 생성자에서는 container 를 주입하여 모델을 가져올 준비를 한다.
    constructor(container) {
        // Alyac 모델을 가져온다.
        this.Alyac = container.get('alyac.dbModel.alyac')
    }

    /**
     * 모든 alyac 정보를 가져온다.
     * 몽고 DB 의 find 키워드 사용
     * @returns {Promise<*>}
     */
    async getAlyacInfoList() {
        let alyacList
        try {
            alyacList = await this.Alyac.find().exec()
        } catch (e) {
            console.log(e)
        }

        // db 결과를 반환
        return alyacList
    }

    /**
     * 입력 받은 num 을 검색해서 정보를 가져온다.
     * num 에 일치하는 한 개 정보를 가져오기에 findOne 키워드 사용
     * @param num
     * @returns {Promise<*>}
     */
    async getAlyacInfoByNum(num) {
        let alyacInfo
        try {
            alyacInfo = await this.Alyac.findOne({num}).exec()
        } catch (e) {
            console.log(e)
        }

        // db 결과를 반환
        return alyacInfo
    }

}

