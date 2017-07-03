
import ClientAPI from 'ClientAPI'
import BaseSvc from './BaseSvc'

export default class ModelSvc extends BaseSvc {

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  constructor (opts) {

    super (opts)

    this._api = new ClientAPI(this._config.apiUrl)
  }

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  name() {

    return 'ModelSvc'
  }

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  getModels (dbName) {

    const url = `${this._config.apiUrl}/${dbName}`

    return this._api.ajax(url)
  }

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  getRecentModels (dbName) {

    const url = `${this._config.apiUrl}/${dbName}/recents`

    return this._api.ajax(url)
  }

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  getModel (dbName, modelId) {

    const url = `${this._config.apiUrl}/${dbName}/${modelId}`

    return this._api.ajax(url)
  }

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  getThumbnailUrl (dbName, modelId, size = 200) {

    const url =
      `${this._config.apiUrl}/${dbName}/${modelId}/thumbnail` +
      `?size=${size}`

    return url
  }

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  getThumbnails (dbName, modelIds) {

    const url = `${this._config.apiUrl}/${dbName}/thumbnails`

    return this._api.ajax({
      url: url,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(modelIds)
    })
  }
}
