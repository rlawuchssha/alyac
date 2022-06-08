
import express from 'express'

/**
 * 정의한 get, post, put, delete 라우터 정보를 자동으로 등록한다.
 */
export default class Router {
  constructor(getRouterList, postRouterList, putRouterList, deleteRouterList) {
    this.router = express.Router({})

    this.getRouterList = getRouterList
    this.postRouterList = postRouterList
    this.putRouterList = putRouterList
    this.deleteRouterList = deleteRouterList

    if (new.target === Router) {
      throw new Error('Abstract class not implemented error')
    }
  }

  // eslint-disable-next-line class-methods-use-this
  setGetHandler(router, data) {
    const url = data.shift()
    if (url === undefined) {
      return
    }
    router.get(url, data)
  }

  // eslint-disable-next-line class-methods-use-this
  setPostHandler(router, data) {
    const url = data.shift()
    if (url === undefined) {
      return
    }
    router.post(url, data)
  }

  // eslint-disable-next-line class-methods-use-this
  setPutHandler(router, data) {
    const url = data.shift()
    if (url === undefined) {
      return
    }
    router.put(url, data)
  }

  // eslint-disable-next-line class-methods-use-this
  setDeleteHandler(router, data) {
    const url = data.shift()
    if (url === undefined) {
      return
    }
    router.delete(url, data)
  }

  initialize() {
    this.getRouterList.forEach(this.setGetHandler.bind(null, this.router))
    this.postRouterList.forEach(this.setPostHandler.bind(null, this.router))
    this.putRouterList.forEach(this.setPutHandler.bind(null, this.router))
    this.deleteRouterList.forEach(this.setDeleteHandler.bind(null, this.router))

    return this.router
  }
}
