const http = require("http");
const PORT = process.env.PORT || 5000;

const server = http.createServer(async (req, res) => {
    
    

    if (req.url.startsWith("/api/") && ['GET', 'DELETE', 'POST'/*, 'PUT', 'PATCH'*/].includes(req.method) ) {

        let info = {
            httpVersion: req.httpVersion,
            method: req.method,
            rawHeaders: req.rawHeaders,
            url: req.url
        }

        if (req.method === "POST"){
            // in order to test this we need to use curl, postman, or some htmlpage to send posts requests
            // curl -X POST http://localhost:5000/api/ -H 'Content-Type: application/json'  -d '{"post_request_data":"give me some data"}'
            let data = await readReqData(req)

            // in here we assume the data is in json format, but ideally the format of the data is specified in the header of the request,
            // so we know what type of data we need to process
            info.post_data = JSON.stringify(data)
        }
        
        // writing status code and header
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ res: 'success', data: "Request Information", request_info: JSON.stringify(info) }))
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