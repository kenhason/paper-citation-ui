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
    }
}