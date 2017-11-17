// module pour creer serveur web
var http = require('http');
// module pour analyser l url
var url = require('url');
// module pour lire un fichier local
var fs = require('fs');

//on cree le serveur
var server = http.createServer(function (req, res) {
    //on recupere l url et on le decompose -> objet dont query contient les parametres
    var url_parts = url.parse(req.url, true);
    //on identifie le parametre name
    var name = url_parts.query.name;
    //on identifie le parametre password
    var password = url_parts.query.password;
    //si nom et mot de passe ok alos...
    if (name==="axel" && password==="1701") {
        //on affiche dans la console le nom de l user
        console.log('Name: ' +name);
        // on defini la reponse comme du json
        res.writeHead(200, {'Content-Type': 'application/json'});
        // on envoie notre objet message
        res.end(JSON.stringify({message: 'Hello ' +name + '!'}));
    }
    //sinon ...
    else {
        // on defini la reponse comme une page html
        res.writeHead(200, {'Content-Type': 'text/html'});
        // on lit le fichier home (readFile du module fs)
        fs.readFile('home.html',function (err,data) {
            res.end(data);
        });
    }
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');