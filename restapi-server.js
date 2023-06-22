const http = require("http");
const PORT = process.env.PORT || 5000;


function ItemModel(){

    this.create = (params) => {
        console.log("creating new item", JSON.stringify(params))

        return {code: "success", message: "item created"}
    }

    this.read = (id) => {
        console.log("reading item", id)

        return {code: "success", item:{ id: id, name: "item name" } }
    }    

    this.update = (id, params) => {
        console.log("updating exiting item", id, JSON.stringify(params))

        return {code: "success", message: `item with id: ${id} updated`}
    }  
    
    this.delete = ( id ) => {
        console.log("deleting item", id)

        return {code: "success", message: `item with id: ${id} deleted`}
    }

    this.list = (  ) => {
        console.log("list items")

        return {code: "success", items:[{ id: "id1", name: "item name" }, { id: "id2", name: "item name" }] }
    }    

}

let models = { 
    "items": new ItemModel(),
    "users": {} // not implemented
}

/*
curl -X GET http://localhost:5000/api/items/ | jq
curl -X GET http://localhost:5000/api/items/item_id/ | jq
curl -X POST http://localhost:5000/api/items/ -H 'Content-Type: application/json'  -d '{"post_request_data":"give me some data"}' | jq
curl -X PATCH http://localhost:5000/api/items/item_id/ -H 'Content-Type: application/json'  -d '{"post_request_data":"give me some data"}' | jq
*/

const server = http.createServer(async (req, res) => {

    let url = req.url

    if (url.startsWith('/'))   url = url.substring(1)
    if (url.endsWith('/'))   url = url.substring(0, url.length-1)

    url = url.split('/')
    
    if (
        url[0] === 'api' && ['items', 'users'].includes(url[1]) 
        && ['GET', 'DELETE', 'POST', 'PATCH'/*, 'PUT' */].includes(req.method) 
        && (   ( req.method === 'GET' && url.length >= 2 && url.length <= 3 )
            || ( req.method === 'POST' && url.length === 2  )
            || ((req.method === 'DELETE' || req.method === 'PATCH') && url.length === 3  )
           )
        
    ) {

        let info = {
            httpVersion: req.httpVersion,
            method: req.method,
            rawHeaders: req.rawHeaders,
            url: req.url
        }

        let data = null
        if (req.method === "POST" || req.method === "PATCH"){
            // in order to test this we need to use curl, postman, or some htmlpage to send posts requests
            
            data = await readReqData(req)

            // in here we assume the data is in json format, but ideally the format of the data is specified in the header of the request,
            // so we know what type of data we need to process
            info.post_data = JSON.parse(data)
        }

        let modelResp = null
        switch (req.method){
            case 'GET': 
                        (url.length === 2) 
                            ? modelResp = models[url[1]].list() 
                            : modelResp = models[url[1]].read(url[2])
                        break;
            case 'POST': 
                        modelResp = models[url[1]].create(data);
                        break;
            case 'PATCH': 
                        modelResp = models[url[1]].update(url[2], data);
                         break;
            case 'DELETE': 
                        modelResp = models[url[1]].delete(url[2], data);
                        break;
        }
        
        // writing status code and header
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ res: 'success', data: modelResp, request_info: info}))
        res.end();
    }

    // If no route present
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ res: 'error', message: "Route/Method not found" }));
    }
});


server.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});

/* returns a promise to retrieve the data for post requests */
function readReqData(req) {
    return new Promise((resolve, reject) => {
        try {
            let body = "";

            req.on("data", (chunk) => {
                body += chunk.toString();
            });

            req.on("end", () => {
                resolve(body);
            });
        } catch (error) {
            reject(error);
        }
    });
}