const  http = require('http');
const fs = require('fs');
const server = http.createServer((req,res)=>{
    
const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    // Trigger browser login prompt
    res.writeHead(401, {
      'WWW-Authenticate': 'Basic realm="NOTE if u fail the whole server going to crash lmao", charset="UTF-8"'
    });


        return res.end('Authentication required');

 
  }



 fs.readFile('config.json',(err,data)=>{
            if(err){


                return;
            }

// Inside your auth check block
const base64Credentials = authHeader.split(' ')[1]; // "bWFpbjpwYXNz"
const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
const [username, password] = credentials.split(':');
const config = JSON.parse(data.toString());

if (username !== config.username || password !== config.password) {
    res.writeHead(403);
    return res.end('Invalid credentials');
}

    })


if(req.method === 'POST'){
    req.on('data', data =>{


    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`${data}`);



    })

    req.on('end',()=>{
    res.end();


    })
    

}else{
    fs.readFile('index.html',(err,data)=>{
            if(err){

                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error: Unable to load the requested file.');
                console.error('Error reading file:', err);



                return;
            }


        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);




    })


}

});


server.listen(3000,()=>{

    console.log('The server is listening on port 3000');
    


})

