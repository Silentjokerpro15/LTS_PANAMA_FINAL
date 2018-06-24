var express = require('express');
var passport = require('passport');
var router = express.Router();
var User = require('../models/user');
var Counter = require('../models/Counter');
var Counterdetalle = require('../models/detalleCounter');
var LOGISTICS = require('../models/logistics');

var Camiones = require('../models/logistics_camiones');

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
    res.render('admin/usuario_nuevo', { user: req.user });
});

router.post('/usuarios/nuevo/crear', isLoggedIn, function(req, res) {
console.log('aca llego mogo');
    var email = req.body.email;
    var name = req.body.name;
    var lastname = req.body.lastname;
    var age = req.body.age;
    var city = req.body.city;
    var role = req.body.role;
    var password = req.body.password;

    console.log(role);
    var newUser = new User(req.body);

    var newUser = new User();
    newUser.local.email = email;
    newUser.local.role = role;
    newUser.local.city = city;
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
            res.render('admin/usuario_modificar', {user: req.user, list: list});
        }
    }); });


router.post('/usuarios/modificar/:id', isLoggedIn, function(req, res) {
    var id = req.params.id;
    console.log(id);
    var email = req.body.email;
    var name = req.body.name;
    var city = req.body.city;
    var lastname = req.body.lastname;
    var age = req.body.age;
    var role = req.body.role;
    //var id = req.body._id;
    User.findByIdAndUpdate({'_id': id },{'local.name':name,'local.lastname':lastname,'local.email':email,'local.age':age,'local.role':role,'local.city':city},function(err) {
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
        LOGISTICS.find((err, listLogistics)=>{
            console.log(listLogistics);
            if(err) throw err;
            res.render('logistics/rutas',{user: req.user, listLogistics: listLogistics});
        });
});


router.get('/logistics/nuevo', isLoggedIn, function(req, res) {
    res.render('logistics/ruta_nueva', { user: req.user });
});




router.post('/logistics/nuevo/crear', isLoggedIn, function(req, res) {
   
        var inicio = req.body.inicio;
        var fin = req.body.fin;
        var ruta = (inicio+' - '+fin);
    
     
    
        var nueva_ruta = new LOGISTICS();
        nueva_ruta.rutas.inicio = inicio;
        nueva_ruta.rutas.fin = fin;
        nueva_ruta.rutas.ruta = ruta;

    
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
            res.render('logistics/ruta_modificar', {user: req.user, listLogistics: listLogistics});
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
  


var nuevo_camion = new Camiones();
console.log();
nuevo_camion.camiones.modelo = modelo;
nuevo_camion.camiones.placa = placa;
nuevo_camion.camiones.color = color;


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


Camiones.findByIdAndUpdate({'_id': id },{'camiones.modelo':modelo,'camiones.placa':placa,'camiones.color':color},function(err) {
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




//_______________________________FINAL LOGISTICS____________________________________________\\



//_____________________________INICIO COUNTEER______________________________________________\\

router.get('/counter', isLoggedIn,(req, res) =>{
 Counter.find((err, listclientes) => {
        console.log(listclientes);
        if (err) throw err;
                                    //user: req.user es donde viene la variable de session
        res.render('counter/index',{ user: req.user ,listclientes: listclientes});
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
    var age = req.body.direccion;
  
    //var id = req.body._id;
    Counter.findByIdAndUpdate({'_id': id },{'local.nombrec':email,'local.cedula':name,'local.nombree':lastname,'local.direccion':age,},function(err) {
        if(err) {
            console.log(err);
        } else {
            Counter.find((err, listclientes) => {
                console.log(listclientes);
                if (err) throw err;
                res.render('counter/index',{ user: req.user ,listclientes: listclientes});
            });
        }
    });
});

/*router.get('/counter/eliminar/:id', (req, res) => {
    let id = req.params.id;
    var number = 0;
    Counter.findByIdAndUpdate({'_id': id },{'local.activo':number,}, (err) => {
        if (err) throw err;
        Counter.find((err, listclientes) => {
            console.log(listclientes);
            if (err) throw err;{}
            res.render('counter/index',{ user: req.user ,listclientes: listclientes});
        });
    });
});*/

router.get('/counter/eliminar/:id', (req, res) => {
    let id = req.params.id;

    Counter.remove({'_id': id },(err) => {
        if (err) throw err;
        Counter.find((err, listclientes) => {
            console.log(listclientes);
            if (err) throw err;{}
            res.render('counter/index',{ user: req.user ,listclientes: listclientes});
        });
    });
});

//Creación del cliente para pedido

router.post('/counter/create/save', isLoggedIn, function(req, res) {
console.log('Aquí estoy');
    var nombrec = req.body.nombrec;
    var nombree = req.body.nombree;
    var cedula = req.body.cedula;
    var direccion= req.body.direccion;
    var monto = req.body.monto;
    var activo = 1;


    var newCliente = new Counter(req.body);

    var newCliente = new Counter();
    newCliente.local.nombrec = nombrec;
    newCliente.local.nombree = nombree;
    newCliente.local.cedula = cedula;
    newCliente.local.direccion = direccion;
    newCliente.local.monto = monto;
    newCliente.local.activo = activo;

    newCliente.save(function(err) {
        if(err) {
            console.log(err);
        } else {
            Counter.find((err, listclientes) => {
                console.log(listclientes);
                if (err) throw err;
                res.render('counter/index',{ user: req.user ,listclientes: listclientes});
            });

        }
    });
});
router.get('/counter/create', isLoggedIn, function(req, res) {
    res.render('counter/create', { user: req.user });
});


//Esto aun no  FUNCIONA 
/*router.get('/counter/detalle/:id', isLoggedIn, function(req, res) {
    let id = req.params.id;
    Counterdetalle.findOne({'id:': id}, (err, listdetalle) => {
   
        if (err) throw err;
                                    //user: req.user es donde viene la variable de session
        res.render('counter/detalle',{ user: req.user ,listdetalle: listdetalle});
    });
});




router.post('/counter/detalle/save/:id', isLoggedIn, function(req, res) {
console.log('Aquí estoy');
let id = req.params.id;
    var nombrec = req.body.nombrec;
    var nombree = req.body.nombree;
    var cedula = req.body.cedula;
    var direccion= req.body.direccion;
    var monto = req.body.monto;
    var activo = 1;


    var newCliente = new Counter(req.body);

    var newCliente = new Counter();
    newCliente.local.nombrec = nombrec;
    newCliente.local.nombree = nombree;
    newCliente.local.cedula = cedula;
    newCliente.local.direccion = direccion;
    newCliente.local.monto = monto;
    newCliente.local.activo = activo;

    newCliente.save(function(err) {
        if(err) {
            console.log(err);
        } else {
            Counter.find((err, listclientes) => {
                console.log(listclientes);
                if (err) throw err;
                res.render('counter/index',{ user: req.user ,listclientes: listclientes});
            });

        }
    });
});
*/


//_____________________________FINAL COUNTER________________________________________________\\


//_____________________________FINAL MANIFEST________________________________________________\\
router.get('/manifest', isLoggedIn, function(req, res) {
    res.render('manifest/index', { user: req.user });
});
//_____________________________FINAL MANIFEST________________________________________________\\

//_____________________________FINAL RECEIVERS________________________________________________\\

router.get('/receivers', isLoggedIn, function(req, res) {
    res.render('receivers/index', { user: req.user });
});
//_____________________________FINAL RECEIVERS________________________________________________\\


//_____________________________FINAL DISPATCHER________________________________________________\\
router.get('/dispatcher', isLoggedIn, function(req, res) {
    res.render('dispatcher/index', { user: req.user });
});
//_____________________________FINAL DISPATCHER________________________________________________\\


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

            return res.redirect('/receivers');
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

