const http = require('http');
const fs = require('fs');

const server = http.createServer((req,res)=>{

    const auth = req.headers.authorization;
        
    if(!auth){
        res.statusCode = 401; // Need Authorzation 
        res.setHeader('WWW-Authenticate','Basic realm="HiddenBackDoor"');
        return res.end('You need authentication');
    }





})