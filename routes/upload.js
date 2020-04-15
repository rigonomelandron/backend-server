var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require( 'fs' );

var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

app.use(fileUpload());


app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;
    // validacion tipos de collecion

    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if( tiposValidos.indexOf( tipo )<0){

        return res.status(400).json({
              ok: false,
              mensaje: 'Tipo de colección no es válida',
            errors: { message: 'Tipo de colección no es válida'}

        });
    }

    if( !req.files){

        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe de seleccionar una imagen'}

        });
    }
     // Obtener nombre del archivo
     var archivo = req.files.imagen;
     var nombreCortado= archivo.name.split('.');
     var extensionArchivo = nombreCortado[nombreCortado.length - 1];

     // Sólo estas extensiones aceptamos
     var extensionesValidas = ['png' , 'jpg', 'gif', 'jpeg'];
     if ( extensionesValidas .indexOf(extensionArchivo)<0){
         return res.status(400).json({
             ok: false,
             mensaje: 'Extensión no válida',
             errors: { message: 'Las extensiones válidas son ' + extensionesValidas.join(',')}

         });

     }
     // nombre de archivo personalizado
     var nombreArchivo = `${ id }-${ new Date().getMilliseconds()}.${ extensionArchivo }`;

     //Mover el archivo del temporal al path
     var path = `./uploads/${ tipo }/${ nombreArchivo}`;
     archivo.mv( path, err=>{

        if( err ){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

         subirPorTipo(tipo, id, nombreArchivo, res);


      
     })

   

});

function subirPorTipo( tipo, id, nombreArchivo, res ){

    if( tipo === 'usuarios'){
        
        Usuario.findById( id,(err, usuario)=>{ 

            if( !usuario){

                res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                   errors: { message: 'Usuario no existe'}
                });  

            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            // Si existe una imagen cargada anterior la elimina
              if(fs.existsSync(pathViejo)){
                fs.unlink( pathViejo );
              }

              usuario.img = nombreArchivo;

              usuario.save( (err, usuarioActualizado)=>{

                usuarioActualizado.password = ':)';
                
                  res.status(200).json({
                     ok: true,
                     mensaje: 'Imagen actualizada',
                     usuario: usuarioActualizado
                  });  

              });
        });

    }
    if (tipo === 'medicos') {

       Medico.findById(id, (err, medico) => {

           if (!medico) {

               res.status(400).json({
                   ok: true,
                   mensaje: 'Médico no existe',
                   errors: { message: 'Médico no existe' }
               });

           }

          var pathViejo = './uploads/medicos/' + medico.img;

    // Si existe una imagen cargada anterior la elimina
    if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo);
    }

    medico.img = nombreArchivo;

    medico.save((err, medicoActualizado) => {

        res.status(200).json({
            ok: true,
            mensaje: 'Imagen actualizada',
            medico: medicoActualizado
        });

    });
});


    }
    if (tipo === 'hospitales') {
       
        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {

                res.status(400).json({
                    ok: true,
                    mensaje: 'Hospital no existe',
                    errors: { message: 'Hospital no existe' }
                });

            }

            var pathViejo = './uploads/hospitales/' + hospital.img;

            // Si existe una imagen cargada anterior la elimina
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {

                res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen actualizada',
                    hospital: hospitalActualizado
                });

            });
        });

    }

}

module.exports = app;