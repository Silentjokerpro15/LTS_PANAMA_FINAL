var express = require('express');
var passport = require('passport');
var router = express.Router();

var User = require('../models/user');
var Counter = require('../models/Counter');
var Counterdetalle = require('../models/detalleCounter');
var Dispatcher = require('../models/dispatcher');
var LOGISTICS = require('../models/logistics');
var Camiones = require('../models/logistics_camiones');
var Oficinas = require('../models/oficinas');

//Ruta para la pagina del login
router.get('/', function(req, res, next) {
    res.render('login.ejs',{ message: req.flash('loginMessage') });
});
//Ruta para la pagina del login
router.get('/login', function(req, res, next) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
});
//Ruta para la creacion de el usuario administardor, solo se usa una vez. PREGUNTAR A HERALDOA
router.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
});
//Ruta ara el login del administrador, solo se usa 1 vez. PREGUNTAR A HERALDO
router.get('/profile', isLoggedIn, function(req, res) {
    //El user: req.user es donde se trae la vaaible de session, siempre se debe manejar
    res.render('profile.ejs', { user: req.user });
});
//_______________________________INICIO ADMIN____________________________________________\\

//Ir al index del adminitrador
router.get('/admin', isLoggedIn, function(req, res) {
    res.render('admin/index', { user: req.user });
});

//Se ira a una pagina de usuarios que es donde se despligan todos los usuarios y se pueden crear, actualizar y eliminar
router.get('/usuarios', isLoggedIn ,(req, res) => {
    //Consulta de todos los usuarios con el User.find
    User.find((err, listUser) => {
        console.log(listUser);
        if (err) throw err;
                                    //user: req.user es donde viene la variable de session
        res.render('admin/usuarios',{ user: req.user ,listUser: listUser});
    });
});

router.get('/usuarios/nuevo', isLoggedIn, function(req, res) {
    Oficinas.find((err, oficinas)=>{
        console.log(oficinas);
        if(err) throw err;
        res.render('admin/usuario_nuevo', { user: req.user,oficinas:oficinas });
    });
   
});

router.post('/usuarios/nuevo/crear', isLoggedIn, function(req, res) {
console.log('aca llego mogo');
    var email = req.body.email;
    var name = req.body.name;
    var lastname = req.body.lastname;
    var age = req.body.age;
    var city = req.body.city;
    var origen = req.body.origen;

    var role = req.body.role;
    var password = req.body.password;

    console.log(origen);
    var newUser = new User(req.body);

    var newUser = new User();
    newUser.local.email = email;
    newUser.local.role = role;
    newUser.local.city = city;
    newUser.local.origen = origen;
    newUser.local.name = name;
    newUser.local.lastname = lastname;
    newUser.local.age = age;
    newUser.local.password = newUser.generateHash(password);

    newUser.save(function(err) {
        if(err) {
            console.log(err);
        } else {
            User.find((err, listUser) => {
                console.log(listUser);
                if (err) throw err;
                res.render('admin/usuarios',{ user: req.user ,listUser: listUser});
            });

        }
    });
});


router.get('/usuarios/modificar/:id', isLoggedIn, function(req, res) {
    User.findOne({_id: req.params.id}).exec(function (err, list) {
        console.log(list);
        if (err) {
            console.log("Error:", err);
        }
        else {
            Oficinas.find((err, oficinas)=>{
                console.log(oficinas);
                if(err) throw err;
                res.render('admin/usuario_modificar', {user: req.user, list: list,oficinas:oficinas});
            });
        }
    }); });


router.post('/usuarios/modificar/:id', isLoggedIn, function(req, res) {
    var id = req.params.id;
    console.log(id);
    var email = req.body.email;
    var name = req.body.name;
    var city = req.body.city;
    var origen = req.body.origen;
    var lastname = req.body.lastname;
    var age = req.body.age;
    var role = req.body.role;
    //var id = req.body._id;
    User.findByIdAndUpdate({'_id': id },{'local.name':name,'local.lastname':lastname,'local.email':email,'local.age':age,'local.role':role,'local.city':city,'local.origen':origen},function(err) {
        if(err) {
            console.log(err);
        } else {
            User.find((err, listUser) => {
                console.log(listUser);
                if (err) throw err;
                res.render('admin/usuarios',{ user: req.user ,listUser: listUser});
            });
        }
    });
});

router.get('/usuarios/eliminar/:id', (req, res) => {
    let id = req.params.id;
    User.remove({'_id': id }, (err) => {
        if (err) throw err;
        User.find((err, listUser) => {
            console.log(listUser);
            if (err) throw err;{}
            res.render('admin/usuarios',{ user: req.user ,listUser: listUser});
        });
    });
});


//_______________________________FINAL ADMIN____________________________________________\\

//_______________________________INICIO LOGISTICS____________________________________________\\

router.get('/logistics', isLoggedIn, (req, res) =>{

    res.render('logistics/index',{user : req.user});
});

router.get('/logistics/rutas',isLoggedIn ,(req,res)=>{
        LOGISTICS.find({'rutas.id_subruta':null},(err, listLogistics)=>{
            console.log(listLogistics);
            if(err) throw err;
            res.render('logistics/rutas',{user: req.user, listLogistics: listLogistics});
        });
});


router.get('/logistics/nuevo', isLoggedIn, function(req, res) {
    Oficinas.find((err, oficinas)=>{
        console.log(oficinas);
        if(err) throw err;
        res.render('logistics/ruta_nueva', { user: req.user,oficinas: oficinas });
    });
 
});


router.get('/logistics/sub-ruta/nuevo', isLoggedIn, function(req, res) {
   
        res.render('logistics/sub-ruta_nueva', { user: req.user });
    });
 






router.post('/logistics/nuevo/crear', isLoggedIn, function(req, res) {
   
        var inicio = req.body.inicio;
        var fin = req.body.fin;
        var ruta = (inicio+' - '+fin);
        var id_ruta = req.body.id_ruta;
     
    
        var nueva_ruta = new LOGISTICS();
        nueva_ruta.rutas.inicio = inicio;
        nueva_ruta.rutas.fin = fin;
        nueva_ruta.rutas.ruta = ruta;
        nueva_ruta.rutas.id_ruta = id_ruta;
    
        nueva_ruta.save(function(err) {
            if(err) {
                console.log(err);
            } else {
                LOGISTICS.find((err, listLogistics) => {
                    console.log(listLogistics);
                    if (err) throw err;
                    res.render('logistics/rutas',{ user: req.user ,listLogistics: listLogistics});
                });
    
            }
        });
    });




    router.post('/logistics/sub-ruta/nuevo/crear', isLoggedIn, function(req, res) {
   

        var inicio = req.body.inicio;
        var fin = req.body.fin;
       
        var id_ruta = req.body.id_ruta;
        var id_subruta = req.body.id_subruta;
     
    
        var nueva_ruta = new LOGISTICS();
        nueva_ruta.rutas.inicio = inicio;
        nueva_ruta.rutas.fin = fin;
        nueva_ruta.rutas.id_subruta = id_subruta;
        nueva_ruta.rutas.id_ruta = id_ruta;
    
        nueva_ruta.save(function(err) {
            if(err) {
                console.log(err);
            } else {
                LOGISTICS.find((err, listLogistics) => {
                    console.log(listLogistics);
                    if (err) throw err;
                    res.render('logistics/rutas',{ user: req.user ,listLogistics: listLogistics});
                });
    
            }
        });
     
     
    });



    
router.get('/logistics/rutas/modificar/:id', isLoggedIn, function(req, res) {
    LOGISTICS.findOne({_id: req.params.id}).exec(function (err, listLogistics) {
        console.log(listLogistics);
        if (err) {
            console.log("Error:", err);
        }
        else {
            Oficinas.find((err, oficinas)=>{
                console.log(oficinas);
                if(err) throw err;
            
                res.render('logistics/ruta_modificar', {user: req.user, listLogistics: listLogistics,oficinas: oficinas});

            });
        }
    });
 });

 router.get('/logistics/sub-ruta/:id', isLoggedIn, function(req, res) {
    let id_ruta = req.params.id;
    console.log(id_ruta);
    LOGISTICS.find({'rutas.id_ruta': id_ruta}).exec(function (err, listLogistics) {
        console.log(listLogistics);
        if (err) {
            console.log("Error:", err);
        }
        else {
      console.log(listLogistics);
                res.render('logistics/sub-ruta', {user: req.user, listLogistics: listLogistics});

            
        }
    });

 });






 router.post('/logistics/modificar/:id',isLoggedIn,(req,res )=>{
    var id = req.params.id;
    console.log(id);
    var inicio = req.body.inicio;
    var fin = req.body.fin;
    var ruta = (inicio+' - '+fin);
    
    LOGISTICS.findByIdAndUpdate({'_id': id },{'rutas.inicio':inicio,'rutas.fin':fin,'rutas.ruta':ruta},function(err) {
        if(err) {
            console.log(err);
        } else {
            LOGISTICS.find((err, listLogistics) => {
                console.log(listLogistics);
                if (err) throw err;
                res.render('logistics/rutas',{ user: req.user ,listLogistics: listLogistics});
            });
        }
    });
});



router.get('/logistics/rutas/eliminar/:id', (req, res) => {
    let id = req.params.id;
    LOGISTICS.remove({'_id': id }, (err) => {
        if (err) throw err;
        LOGISTICS.find((err, listLogistics) => {
            console.log(listLogistics);
            if (err) throw err;{}
            res.render('logistics/rutas',{ user: req.user ,listLogistics: listLogistics});
        });
    });
});



//------


router.get('/logistics/camiones',isLoggedIn ,(req,res)=>{
    Camiones.find((err, camiones)=>{
        console.log(camiones);
        if(err) throw err;
        res.render('logistics/camiones',{user: req.user, camiones: camiones});
    });
});


router.get('/logistics/camiones/nuevo', isLoggedIn, function(req, res) {

res.render('logistics/camion_nuevo', { user: req.user });
});




router.post('/logistics/camion/nuevo/crear', isLoggedIn, function(req, res) {

    var modelo = req.body.modelo;
    var placa = req.body.placa;
    var color = req.body.color;
    var id_camion = req.body.id_camion;
  


var nuevo_camion = new Camiones();
console.log();
nuevo_camion.camiones.modelo = modelo;
nuevo_camion.camiones.placa = placa;
nuevo_camion.camiones.color = color;
nuevo_camion.camiones.id_camion = id_camion;

nuevo_camion.save(function(err) {
        if(err) {
            console.log(err);
        } else {
            Camiones.find((err, camiones) => {
                
                if (err) throw err;
                res.render('logistics/camiones',{ user: req.user ,camiones: camiones});
            });

        }
    });
});



router.get('/logistics/camion/modificar/:id', isLoggedIn, function(req, res) {
Camiones.findOne({_id: req.params.id}).exec(function (err, camiones) {

    if (err) {
        console.log("Error:", err);
    }
    else {
        res.render('logistics/camion_modificar', {user: req.user, camiones: camiones});
    }
});
});

router.post('/logistics/camion/modificar/:id',isLoggedIn,(req,res )=>{
var id = req.params.id;
console.log(id);

var modelo = req.body.modelo;
var placa = req.body.placa;
var color = req.body.color;
var id_camion = req.body.id_camion;


Camiones.findByIdAndUpdate({'_id': id },{'camiones.modelo':modelo,'camiones.placa':placa,'camiones.color':color,'camiones.id_camion':id_camion},function(err) {
    if(err) {
        console.log(err);
    } else {
        Camiones.find((err, camiones) => {
        
            if (err) throw err;
            res.render('logistics/camiones',{ user: req.user ,camiones: camiones});
        });
    }
});
});



router.get('/logistics/camion/eliminar/:id', (req, res) => {
let id = req.params.id;
Camiones.remove({'_id': id }, (err) => {
    if (err) throw err;
    Camiones.find((err, camiones) => {

        if (err) throw err;{}
        res.render('logistics/camiones',{ user: req.user ,camiones: camiones});
    });
});
});

//------


router.get('/logistics/oficinas',isLoggedIn ,(req,res)=>{
    Oficinas.find((err, oficinas)=>{
        console.log(oficinas);
        if(err) throw err;
        res.render('logistics/oficinas',{user: req.user, oficinas: oficinas});
    });
});


router.get('/logistics/oficinas/nuevo', isLoggedIn, function(req, res) {
res.render('logistics/oficinas_nueva', { user: req.user });
});




router.post('/logistics/oficinas/nuevo/crear', isLoggedIn, function(req, res) {

    var pais = req.body.pais;
    var provincia = req.body.provincia;
    var descripcion = req.body.descripcion;
    var distrito = req.body.distrito;
    var id_oficina = req.body.id_oficina;
 

    var nueva_oficina = new Oficinas();
    nueva_oficina.oficinas.pais = pais;
    nueva_oficina.oficinas.provincia = provincia;
    nueva_oficina.oficinas.descripcion = descripcion;
    nueva_oficina.oficinas.distrito = distrito;
    nueva_oficina.oficinas.id_oficina = id_oficina;


    nueva_oficina.save(function(err) {
        if(err) {
            console.log(err);
        } else {
            Oficinas.find((err, oficinas) => {
                console.log(oficinas);
                if (err) throw err;
                res.render('logistics/oficinas',{ user: req.user ,oficinas: oficinas});
            });

        }
    });
});



router.get('/logistics/oficinas/modificar/:id', isLoggedIn, function(req, res) {
    Oficinas.findOne({_id: req.params.id}).exec(function (err, oficinas) {
    console.log(oficinas);
    if (err) {
        console.log("Error:", err);
    }
    else {
        res.render('logistics/oficinas_modificar', {user: req.user, oficinas: oficinas});
    }
});
});

router.post('/logistics/oficinas/modificar/:id',isLoggedIn,(req,res )=>{
var id = req.params.id;
console.log(id);

var pais = req.body.pais;
var provincia = req.body.provincia;
var descripcion = req.body.descripcion;
var distrito = req.body.distrito;
var id_oficina = req.body.id_oficina;



Oficinas.findByIdAndUpdate({'_id': id },{'oficinas.pais':pais,'oficinas.provincia':provincia,'oficinas.descripcion':descripcion, 'oficinas.id_oficina':id_oficina, 'oficinas.distrito':distrito},function(err) {
    if(err) {
        console.log(err);
    } else {
        Oficinas.find((err, oficinas) => {
            console.log(oficinas);
            if (err) throw err;
            res.render('logistics/oficinas',{ user: req.user ,oficinas: oficinas});
        });
    }
});
});



router.get('/logistics/oficinas/eliminar/:id', (req, res) => {
let id = req.params.id;
Oficinas.remove({'_id': id }, (err) => {
    if (err) throw err;
    Oficinas.find((err, oficinas) => {
        console.log(oficinas);
        if (err) throw err;{}
        res.render('logistics/oficinas',{ user: req.user ,oficinas: oficinas});
    });
});
});


//-----




//_______________________________FINAL LOGISTICS____________________________________________\\



//_____________________________INICIO COUNTEER______________________________________________\\

router.get('/counter', isLoggedIn,(req, res) =>{

    res.render('counter/index',{ user: req.user });
});

router.get('/counter/todo', isLoggedIn,(req, res) =>{
    console.log(req.user)
    var number = 1;
    var sucursal = req.user.local.origen;

    Counter.find({'local.activo':number, 'local.inicio': sucursal},(err, listclientes) => {
        console.log(listclientes);
        if (err) throw err;
                                    //user: req.user es donde viene la variable de session
        res.render('counter/counter',{ user: req.user ,listclientes: listclientes});
    });
});

router.get('/counter/modificar/:id', isLoggedIn, function(req, res) {
    Counter.findOne({_id: req.params.id}).exec(function (err, listup) {
        console.log(listup);
        if (err) {
            console.log("Error:", err);
        }
        else {
            res.render('counter/cliente_modificar', {user: req.user, listup: listup});
        }
    }); });


router.post('/counter/modificar/:id', isLoggedIn, function(req, res) {
    var id = req.params.id;
    console.log(id);
    var email = req.body.nombrec;
    var name = req.body.cedula;
    var lastname = req.body.nombree;

  
    //var id = req.body._id;
    Counter.findByIdAndUpdate({'_id': id },{'local.nombrec':email,'local.cedula':name,'local.nombree':lastname,},function(err) {
        if(err) {
            console.log(err);
        } else {
             var number = 1;
             var sucursal = req.user.local.origen;
             Counter.find({'local.activo':number, 'local.inicio': sucursal},(err, listclientes) => {
                console.log(listclientes);
                if (err) throw err;
                res.render('counter/counter',{ user: req.user ,listclientes: listclientes});
            });
        }
    });
});
//El eliminar no removera los datos del cliente sino que actualizara el valor de activo  a 0
router.get('/counter/eliminar/:id', (req, res) => {
    let id = req.params.id;
    var number = 0;

    Counter.findByIdAndUpdate({'_id': id },{'local.activo':number,},function(err){
        if (err){
       console.log(err);
        }else 
        {

        if (err) throw err;
              var num = 1;
              var sucursal = req.user.local.origen;
            Counter.find({'local.activo':num, 'local.inicio': sucursal},(err, listclientes) => {
            console.log(listclientes);
            if (err) throw err;{}
            res.render('counter/index',{ user: req.user ,listclientes: listclientes});
        });
          }
    });
});

//Creación del cliente para pedido

router.post('/counter/create/save', isLoggedIn, function(req, res) {
console.log('Aquí estoy');
    var nombrec = req.body.nombrec;
    var nombree = req.body.nombree;
    var cedula = req.body.cedula;
    var id_pedido = req.body.id_pedido;
    var sucursal = req.user.local.origen;

    var inicio = req.user.origen;
    var destino= req.body.destino;
    console.log(destino);
    console.log(sucursal);
    var monto = req.body.monto;
    var activo = 1;


    var newCliente = new Counter(req.body);

    var newCliente = new Counter();
    newCliente.local.id_pedido = id_pedido;
    newCliente.local.nombrec = nombrec;
    newCliente.local.nombree = nombree;
    newCliente.local.cedula = cedula;
    newCliente.local.inicio = sucursal;
    newCliente.local.destino = destino;
    newCliente.local.monto = monto;
    newCliente.local.activo = activo;

    newCliente.save(function(err) {
        if(err) {
            console.log(err);
        } else {
            var number = 1;
            var sucursal = req.user.local.origen;
            Counter.find({'local.activo':number, 'local.inicio': sucursal},(err, listclientes) => {
           
                console.log(listclientes);
                if (err) throw err;
                res.render('counter/counter',{ user: req.user ,listclientes: listclientes});
            });

        }
    });
});
router.get('/counter/create', isLoggedIn, function(req, res) {
    Oficinas.find((err, oficinas)=>{
        console.log(oficinas);
        if(err) throw err;
        res.render('counter/create', { user: req.user,oficinas: oficinas });
     
    });

   
});


//Esto aun no  FUNCIONA 
router.get('/counter/detalle/:id', isLoggedIn, function(req, res) {
   let id = req.params.id;
    Counterdetalle.find({'local.id_pedido': id},(err, listdetalle) => {
   
        if (err) throw err;
                                    //user: req.user es donde viene la variable de session
        res.render('counter/detalle',{ user: req.user ,listdetalle: listdetalle});
    });
});

router.post('/counter/detalle/save/:id', isLoggedIn, function(req, res) {
console.log('Aquí estoy');
  let id = req.params.id;
    var nombrec = req.body.nombrec;
    var cedula = req.body.fragil;
    var direccion = req.body.direccion;
    var activo = 1;
    var enviado = false;
    var recibido = false;
    var manifiesto = '0';


    var newdetalle = new Counterdetalle(req.body);

    var newdetalle = new Counterdetalle();
    newdetalle.local.id_pedido = id;
    newdetalle.local.descripcion = nombrec;
    newdetalle.local.fragil = cedula;
     newdetalle.local.direccion = direccion;
   
    newdetalle.local.enviado = enviado;
       newdetalle.local.recibido = recibido;

        newdetalle.local.activo = activo;
        newdetalle.local.manifiestoid = manifiesto;


    newdetalle.save(function(err) {
        if(err) {
            console.log(err);
        } else {
            Counterdetalle.find({'local.id_pedido': id},(err, listdetalle) => {
                console.log(listdetalle);
                if (err) throw err;
                res.render('counter/detalle',{ user: req.user ,listdetalle: listdetalle});
            });

        }
    });
});
router.get('/counter/detalle/create/:id', isLoggedIn, function(req, res) {
        let id = req.params.id;
   res.render('counter/detalleagregar', { user: req.user, id });
});


//_____________________________FINAL COUNTER________________________________________________\\



//_____________________________FINAL RECEIVERS________________________________________________\\

router.get('/receivers', isLoggedIn, function(req, res) {
    res.render('receivers/index', { user: req.user });
});
//_____________________________FINAL RECEIVERS________________________________________________\\


//_____________________________FINAL DISPATCHER________________________________________________\\
router.get('/dispatcher', isLoggedIn,(req, res) =>{
    Dispatcher.find((err, listmanifest) => {
           console.log(listmanifest);
           if (err) throw err;
                                       //user: req.user es donde viene la variable de session
           res.render('dispatcher/manifest',{ user: req.user ,listmanifest: listmanifest});
       });
   });
   
   
   //actualizar
   
   router.get('/dispatcher/update/:id', isLoggedIn, function(req, res) {
       Dispatcher.findOne({_id: req.params.id}).exec(function (err, listup) {
           console.log(listup);
           if (err) {
               console.log("Error:", err);
           }
           else {
               res.render('dispatcher/update', {user: req.user, listup: listup});
           }
       }); });
   
   
   router.post('/dispatcher/update/:id', isLoggedIn, function(req, res) {
       var id = req.params.id;
       console.log(id);
       var idmanifest= req.body.idmanifest;
       var fecha = req.body.fecha;
       var camion = req.body.camion;
       var conductor = req.body.conductor;
       var ruta = req.body.ruta;
     
       //var id = req.body._id;
       Dispatcher.findByIdAndUpdate({'_id': id },{'local.idmanifest':idmanifest,'local.fecha':fecha,'local.camion':camion,'local.conductor':conductor,'local.ruta':ruta,},function(err) {
           if(err) {
               console.log(err);
           } else {
               Dispatcher.find((err, listmanifest) => {
                   console.log(listmanifest);
                   if (err) throw err;
                   res.render('dispatcher/manifest',{ user: req.user ,listmanifest: listmanifest});
               });
           }
       });
   });
   
   //Eliminar
   router.get('/dispatcher/eliminar/:id', (req, res) => {
       let id = req.params.id;
   
       Dispatcher.remove({'_id': id },(err) => {
           if (err) throw err;
           Dispatcher.find((err, listmanifest) => {
               console.log(listmanifest);
               if (err) throw err;{}
               res.render('dispatcher/manifest',{ user: req.user ,listmanifest: listmanifest});
           });
       });
   });
   
   //crear manifest
   router.post('/dispatcher/create/save', isLoggedIn, function(req, res) {
   console.log('Bomba');
       var idmanifest = req.body.idmanifest;
       var fecha = req.body.fecha;
       var camion = req.body.camion;
       var conductor= req.body.conductor;
       var ruta = req.body.ruta;
       var activo = 1;
   
   
       var newManifest = new Dispatcher(req.body);
   
       var newManifest = new Dispatcher();
       newManifest.local.idmanifest = idmanifest;
       newManifest.local.fecha = fecha;
       newManifest.local.camion = camion;
       newManifest.local.conductor = conductor;
       newManifest.local.ruta = ruta;
       newManifest.local.activo = activo;
   
       newManifest.save(function(err) {
           if(err) {
               console.log(err);
           } else {
               Dispatcher.find((err, listmanifest) => {
                   console.log(listmanifest);
                   if (err) throw err;
                   res.render('dispatcher/manifest',{ user: req.user ,listmanifest: listmanifest});
               });
           }
       });
   });
   router.get('/dispatcher/create', isLoggedIn, function(req, res) {
       res.render('dispatcher/create', { user: req.user });
   });
   
   //monstrar los detalles con activo=1 
   router.get('/dispatcher/detalle/:id', isLoggedIn, function(req, res) {
      let id = req.params.id;
      var number = 1;
                Counterdetalle.find({'local.activo':number,},(err, listdetalle) => {
                   console.log(listdetalle);
                   if (err) throw err;
                   res.render('dispatcher/detalle',{ user: req.user ,listdetalle: listdetalle});
       });
   });
   router.get('/dispatcher/detalle/:id', isLoggedIn, function(req, res) {
       let id = req.params.id;
       console.log(id);
       var idmanifest=req.user;
       Counterdetalle.findByIdAndUpdate({'_id': id },{'local.manifiestoid':idmanifest},function(err) {
           if(err) {
               console.log(err);
           } else {
                var number = 0;
                var enviado = false;
                Counterdetalle.find({'local.activo':number,'local.enviado':enviado},(err, listdetalle) => {
                   console.log(listdetalle);
                   if (err) throw err;
                   res.render('dispatcher/detalle',{ user: req.user ,listdetalle: listdetalle});
               });
           }
       });
   });
   //ver la lista de paquetes dentro del manifest con activo=0
   router.get('/dispatcher/ver/:id', isLoggedIn, function(req, res) {
      console.log("llegue");
       let id = req.params.id;
       console.log(id);
       var activo=0;
       //var id = req.body._id;
       Counterdetalle.findByIdAndUpdate({'_id': id },{'local.activo':activo,'local.manifiestoid':id},function(err) {
           if(err) {
               console.log(err);
           } else {
                var number = 0;
                var enviado = false;
                Counterdetalle.find({'local.activo':number,'local.enviado':enviado},(err, listdetalle) => {
                   console.log(listdetalle);
                   if (err) throw err;
                   res.render('dispatcher/ver',{ user: req.user ,listdetalle: listdetalle});
               });
           }
       });
   });
   
   //agregar detalle al manifest
   router.get('/dispatcher/detalle/save/uno/:id', isLoggedIn, function(req, res) {
       console.log("llegue");
       var id = req.params.id;
       console.log(id);  
       var activo=1;
       Counterdetalle.findByIdAndUpdate({'_id': id },{'local.activo':activo,},function(err) {
           if(err) {
               console.log(err);
           } else {
                var number = 1;
                Counterdetalle.find({'local.activo':number,},(err, listdetalle) => {
                   console.log(listdetalle);
                   if (err) throw err;
                   res.render('dispatcher/detalle',{ user: req.user ,listdetalle: listdetalle});
               });
           }
       });
   });
   //eliminar detalle
   router.get('/dispatcher/eliminar_detalle/:id', (req, res) => {
       let id = req.params.id;
       Counterdetalle.remove({'_id': id },(err) => {
           if (err) throw err;
           Counterdetalle.find((err, listdetalle) => {
               console.log(listdetalle);
               if (err) throw err;{}
               res.render('dispatcher/detalle',{ user: req.user ,listdetalle: listdetalle});
           });
       });
   });
   //Enviar al recividor
   router.get('/dispatcher/finalizar/:id', isLoggedIn, function(req, res) {
       console.log("llegue");
       var id = req.params.id;
       console.log(id);  
       var enviado=true;
       //var id = req.body._id;
       Counterdetalle.findByIdAndUpdate({'_id': id },{'local.enviado':enviado,},function(err) {
           if(err) {
               console.log(err);
           } else {
                var enviado= true;
                Counterdetalle.find({'local.enviado':enviado,},(err, listdetalle) => {
                   console.log(listdetalle);
                   if (err) throw err;
                   res.render('dispatcher/envios',{ user: req.user ,listdetalle: listdetalle});
               });
           }
       });
   });
   
   
   //monstrar los detalles enviados
   router.get('/dispatcher/envios/:id', isLoggedIn, function(req, res) {
      let id = req.params.id;
      var enviado=true;
                Counterdetalle.find({'local.enviado':enviado,},(err, listdetalle) => {
                   console.log(listdetalle);
                   if (err) throw err;
                   res.render('dispatcher/envios',{ user: req.user ,listdetalle: listdetalle});
       });
   });
//_____________________________FINAL DISPATCHER________________________________________________\\


//___________INICIO RECIEVER_______________

router.get('/recieved', isLoggedIn, function(req, res) {
    Counterdetalle.find(
        {
            'local.enviado': true, 
            'local.recibido': false, 
            'local.direccion': req.user.local.origen
        }, (err, list) => {
            if (err) throw err;
            res.render('receivers/index', {list: list});
        }
    );
});

router.get('/markrecieved/:id', isLoggedIn, function(req, res) {
    Counterdetalle.findByIdAndUpdate(
        {'_id': req.params.id}, { 'local.recibido': true }, (err) => {
            if (err) throw err;
            res.redirect('/recieved');
        }
    );
});


//___________FINAL RECIEVER_______________

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});



































//Passport auth

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true,
}));

router.post('/login',
    passport.authenticate('local-login', { failureRedirect: '/login' }),

    function(req ,res) {
       let Role= req.user.local.role;

        if( req.user.local.role === false) {
                req.flash('success_msg', 'Somthing Wrong Bro');
                return res.redirect('/login');
                    }else  if (Role === "ADMIN") {
                        return res.redirect('/admin');
                            } else if (Role === "COUNTER") {
                                         console.log('eres un puto counter');
                                    return res.redirect('/counter');
                                        } else if (Role === "MANIFEST") {
                                                return res.redirect('/manifest');
                                                    } else if (Role === "RECEIVERS") {
            console.log('eres un puto receivers');

            return res.redirect('/recieved');
                                                                }else if(Role ==="DISPATCHER"){
                                                                    return res.redirect('/dispatcher');
        }else if(Role === "LOGISTICS"){
            return  res.redirect('/logistics');

        }


    });


module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

