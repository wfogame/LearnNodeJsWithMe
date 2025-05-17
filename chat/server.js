const http = require('http');
const fs = require('fs');
    const server = http.createServer((req,res) =>{
        const auth = req.headers.authorization;

        if(!auth){
            res.statusCode = 401;
            res.setHeader('WWW-Authenticate','Basic')
            return res.end('You need Headers');



        }
    


        
        res.statusCode = 200;
        res.setHeader("Content-Type","text/plain");
        res.end('Success')

    })

    server.listen(5000, ()=>{




    })