import superagent from 'superagent'

export default {
    get: (url, headers, params, callback) => {
        superagent
        .get(url)
        .query(params)
        .set(headers)
        .end((err, response) => {
            if (err) {
                callback(err, null)
                return
            }

            callback(null, response.body)
        }) 
    },
    post: (url, headers, body, callback) => {
        superagent
        .post(url)
        .send(body)
        .set(headers)
        .end(function(err, response){
            if (err) {
                callback(err, null)
                return
            }
            callback(null, response.body)
        });
    },
    getFile: (url, callback) => {
        superagent
        .get(url)
        .end((err, response) => {
            if (err) {
                callback(err, null)
                return
            }

            callback(null, response.text)
        }) 
    },
    queryNeo4j: (body, callback) => {
        let auth = btoa("neo4j:Neo4j");
        let url = "http://localhost:7474/db/data/transaction/commit",
        headers = {
          'accept': 'application/json',
          'X-Stream': 'true',
          'authorization': 'Basic ' + auth
        }
        superagent
        .post(url)
        .send(body)
        .set(headers)
        .end(function(err, response){
            if (err) {
                callback(err, null)
                return
            }
            callback(null, response.body)
        });
    }
}