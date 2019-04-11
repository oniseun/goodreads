const fetch = require('node-fetch');
const config = require('./../../config/config');
const parser = require('xml2json');

module.exports = class SearchService {

  constructor(configs) {
    this.configs = configs || config;
  }

  search(bookName) {
    return new Promise((resolve, reject) => {

        fetch(config.goodreads.base_url + config.goodreads.search_resource + bookName + '&key=bZFY4Rc5TZpBEc89fv7XKA', 
            { 
              method: 'GET', 
              headers: { 'Content-Type': 'application/json' }
            }
        ).then(res => res.text()
        ).then(xml => { 
          let json = JSON.parse(parser.toJson(xml));
          return resolve(json.GoodreadsResponse.search)
        }).catch(e => {
          return reject(e)
        });

    });
  }

}