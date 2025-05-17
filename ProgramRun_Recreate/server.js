const http = require('http');
const fs = require('fs');

const server = http.createServer((req,res)=>{

    const auth = req.headers.authorization;
        
    if(!auth){
        res.statusCode = 401; // Need Authorzation 
        res.setHeader('WWW-Authenticate','Basic realm="HiddenBackDoor"');
        return res.end('You need authentication');
    }

    if(req.method === 'POST'){


        return;
    }

    fs.readFile('index.html',(err,data)=>{
        
        res.statusCode = 200;
        res.setHeader('Content-Type','text/html');
        res.end(data);




    })





})


server.listen(3000,'127.0.0.1',()=>{


    console.log('Listening on port 3000');
    

})