const  http = require('http');
const fs = require('fs');
const server = http.createServer((req,res)=>{

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

