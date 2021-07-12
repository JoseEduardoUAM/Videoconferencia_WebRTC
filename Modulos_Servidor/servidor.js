//Módulo local Modulos.js
const Modulos = require('./dependencias.js');

//Se agrega el puerto 3000
Modulos.app.set('port',process.env.PORT || 3000);

///Documentos estaticos
Modulos.app.use( Modulos.express.static( Modulos.path.join( __dirname , '..' , 'public' ) ));
Modulos.app.get('/', (req, res) => {
  res.sendFile( Modulos.path.resolve(__dirname, '..' , 'public', 'index.html') );
});

//Configuracion del Servidor https
const server = Modulos.https.createServer( {
  cert : Modulos.fs.readFileSync( Modulos.path.join( __dirname , '..' , 'Certificados' , 'cert.pem' ) ),
  key : Modulos.fs.readFileSync( Modulos.path.join( __dirname , '..' , 'Certificados' , 'key.pem' ) )
} , Modulos.app ).listen( Modulos.app.get('port') , function() {
  console.log('Servidor https corriendo en puerto ' , Modulos.app.get('port'));
});

module.exports = {
	app: Modulos.app,
	server: server
}
