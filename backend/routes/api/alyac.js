import _ from 'lodash'
import Router from '../router'

/**
 * alyac api 라우터를 정의한다.
 * get, post, put, delete 별 함수를 따로 정의하고, 그에 맞는 handler(함수)를 정의한다.
 */
class ApiAlyacRouter extends Router {
    // eslint-disable-next-line no-useless-constructor
    constructor(getRouterList, postRouterList, putRouterList, deleteRouterList) {
        super(getRouterList, postRouterList, putRouterList, deleteRouterList)
    }
}

/**
 * container 를 통해서 alyac DB 에 접근하는 dbManager 를 가져온다.
 * api 호출이 들어오면 dbManager 를 통해서 DB 검색을 하고, 결과를 리턴한다.
 * @param container
 * @returns {*}
 */
export default function apiAlyacRouter(container) {
    // DB 매니저 가져온다.
    const alyacDBManager = container.get('alyac.dbManager.AlyacDBManager')

    // [/api/alyac] API 호출 시 연결되는 handler(함수)
    async function getAlyacInfoList(req, res) {
        // DB 검색
        const list = await alyacDBManager.getAlyacInfoList()
        // 결과 반환
        res.status(200).send(list)
    }

    // [/alyac/:num] API 호출 시 연결되는 handler(함수)
    async function getAlyacInfoByNum(req, res) {
        // 검색으로 넘어오는 num 정보 가져오기
        const {num} = JSON.parse(JSON.stringify(req.params))
        // DB 검색
        const alyac = await alyacDBManager.getAlyacInfoByNum(num)
        // 결과 반환
        return res.status(200).send(alyac)
    }

    /**
     * Restful API get 리스트를 정의한다.
     * @type {((string|(function(*, *): Promise<void>))[]|(string|(function(*, *): *))[])[]}
     */
    const getRouterList = [
        ['/alyac', getAlyacInfoList],
        ['/alyac/:num', getAlyacInfoByNum],
    ]

    /**
     * * Restful API post 리스트를 정의한다.
     * @type {*[][]}
     */
    const postRouterList = [
        [],
    ]

    /**
     * Restful API put 리스트를 정의한다.
     * @type {*[][]}
     */
    const putRouterList = [
        [],
    ]

    /**
     * Restful API delete 리스트를 정의한다.
     * @type {*[][]}
     */
    const deleteRouterList = [
        [],
    ]

    // get, post, put, delete 자동 등록
    return new ApiAlyacRouter(
        getRouterList,
        postRouterList,
        putRouterList,
        deleteRouterList,
    ).initialize()
}
