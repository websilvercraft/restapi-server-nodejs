const http = require("http");
const PORT = process.env.PORT || 5000;

const server = http.createServer(async (req, res) => {
    
    res.writeHead(404, { "Content-Type": "application/json" });

    if (req.url.startsWith("/api/") && req.method === "GET") {
        res.write(JSON.stringify({ res: 'success', data: "Something here"}))
        
        res.end();
    }

    // If no route present
    else {
        res.end(JSON.stringify({ res: 'success', message: "Route not found" }));
    }
});


server.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});