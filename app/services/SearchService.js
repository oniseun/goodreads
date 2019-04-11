const fetch = require('node-fetch');
const config = require('./../../config/config');
const parser = require('xml2json');

module.exports = class SearchService {

  constructor(configs) {
    this.configs = configs || config;
  }


  filter(list, order,max_results) 
  {
      switch(order){
        case 'all' : 
        
      break;

        case 'rating-asc' : 
                  list.sort((a, b) => {
                    return parseFloat(a.average_rating) - parseFloat(b.average_rating);
                });  
      break;
        case 'rating-desc' : 
        list.sort((a, b) => {
          return parseFloat(a.average_rating) - parseFloat(b.average_rating);
      });  
      list.reverse();
      
      break;
        case 'title-asc' : case 'title-desc' :
        list.sort((a, b) => {
          a = a.best_book;
          b = b.best_book;

          if(!a.hasOwnProperty('title') || 
             !b.hasOwnProperty('title')) {
            return 0; 
          }
          
          const varA = (typeof a['title'] === 'string') ? 
            a['title'].toUpperCase() : a['title'];
          const varB = (typeof b['title'] === 'string') ? 
            b['title'].toUpperCase() : b['title'];
            
          let comparison = 0;
          if (varA > varB) {
            comparison = 1;
          } else if (varA < varB) {
            comparison = -1;
          }
          return (
            (order == 'title-desc') ? 
            (comparison * -1) : comparison
          );
        });

        break;

        case 'author-asc' :   case 'author-desc' : 
        
        list.sort((a, b) => {
          a = a.best_book.author;
          b = b.best_book.author;

          if(!a.hasOwnProperty('name') || 
             !b.hasOwnProperty('name')) {
            return 0; 
          }
          
          const varA = (typeof a['name'] === 'string') ? 
            a['name'].toUpperCase() : a['name'];
          const varB = (typeof b['name'] === 'string') ? 
            b['name'].toUpperCase() : b['name'];
            
          let comparison = 0;
          if (varA > varB) {
            comparison = 1;
          } else if (varA < varB) {
            comparison = -1;
          }
          return (
            (order == 'author-desc') ? 
            (comparison * -1) : comparison
          );
        });
        
        break;


        case 'date-asc' : case 'date-desc' :
        list.sort((a, b) => {
          var pubDayA = typeof  a.original_publication_day.$t != 'undefined' ? a.original_publication_day.$t+ ' / '  : '01 / ';
         var pubMonthA = typeof  a.original_publication_month.$t != 'undefined' ? a.original_publication_month.$t+ ' / '  : '01 / ';
          var pubYearA = typeof  a.original_publication_year.$t != 'undefined' ? a.original_publication_year.$t  : '1970';
          var pubDateA = pubMonthA + pubDayA +  pubYearA ;

          var pubDayB = typeof  b.original_publication_day.$t != 'undefined' ? b.original_publication_day.$t+ ' / '  : '01 / ' ;
         var pubMonthB = typeof  b.original_publication_month.$t != 'undefined' ? b.original_publication_month.$t+ ' / '  : '01 / ';
          var pubYearB = typeof  b.original_publication_year.$t != 'undefined' ? b.original_publication_year.$t  : '1970';
          var pubDateB =pubMonthB + pubDayB +  pubYearB ;

          let aTimeStamp =  (new Date(pubDateA)).getTime();
          let bTimeStamp = (new Date(pubDateB)).getTime();
          console.log(pubDateA + ' | ' +aTimeStamp);
          console.log(pubDateB + ' | ' +bTimeStamp);

          return  (order == 'date-desc') ?  parseFloat(bTimeStamp) - parseInt(aTimeStamp) :  parseInt(aTimeStamp) - parseInt(bTimeStamp)    ;

          });  
        break;

      }

      return  list.length > max_results ?  list.slice(0, max_results) : list ;
  }

  search(bookName,filter) {
    return new Promise((resolve, reject) => {

        fetch(config.goodreads.base_url + config.goodreads.search_resource + bookName + '&key=' + config.goodreads.key, 
            { 
              method: 'GET', 
              headers: { 'Content-Type': 'application/json' }
            }
        ).then(res => res.text()
        ).then(xml => { 
          let max_results = 10 ;
          let json = JSON.parse(parser.toJson(xml));
          let resolvedData =  json.GoodreadsResponse.search;

          let list = {}; // work list or rather book list

          let finalResult = { 
            returnData : list, 
            queryString : resolvedData.query,
            filter : filter
          
          };

          if(resolvedData.results)
          {
            list = this.filter(resolvedData.results.work, filter, max_results);
            
       
          }
        
          finalResult = { 
            returnData : list, 
            queryString : resolvedData.query,
            filter : filter
          
          };
                

          return resolve(finalResult) ;

        }).catch(e => {
          return reject(e)
        });

    });
  }

}