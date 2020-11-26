var express = require('express');
var exphbs  = require('express-handlebars');
var port = process.env.PORT || 3000
const mercadopago = require('mercadopago');
mercadopago.configure({
    access_token: 'APP_USR-1159009372558727-072921-8d0b9980c7494985a5abd19fbe921a3d-617633181',
    integrator_id: "dev_24c65fb163bf11ea96500242ac130004"
});


var app = express();
// var baseUrl = "https://joss1091-mp-commerce-nodejs.herokuapp.com/"
 var baseUrl = "http://localhost:3000/"
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.render('home', {view: "search"});
});

app.get('/detail', function (req, res) {
    var img = req.query.img.replace("./","/")
    var global = {
        view: "item",
        title: req.query.title,
        price: req.query.price,
        img: req.query.img
    }
    let preference = {
        items: [{
            id: "1234",
            title: req.query.title,
            unit_price: parseFloat(req.query.price),
            quantity: 1,
            description: "Dispositivo móvil de Tienda e-commerce",
            picture_url: baseUrl + img
        }],
        external_reference: "joss1091@gmail.com",
        payer: {
            name: "Lalo Landa",
            email: "test_user_81131286@testuser.com",
            phone: {
                area_code: "52",
                number: parseInt("5549737300")
            },
            address: {
                zip_code: "03940",
                street_name: "Insurgentes Sur",
                street_number: 1602
            }
        },
        auto_return: "approved",
        back_urls: {
            success: baseUrl + "payment-sucess" ,
            pending: baseUrl + "payment-pending",
            failure: baseUrl + "payment-failure"
        },
        notification_url: baseUrl + "notification",
        payment_methods: {
            installments: 6,
            excluded_payment_methods: [
                {id: "amex"}
            ],
            excluded_payment_types: [
                {id: "atm"}
            ]
        }
    };

    mercadopago.preferences.create(preference)
        .then(function (response) {
            console.log(response)
            // Este valor reemplazará el string "<%= global.id %>" en tu HTML
            global.payment_url = response.body.init_point;
            res.render('detail', global);
        }).catch(function (error) {
            console.log(error);
        });
    
});

app.get("/process-payment",function(req,res){
    res.render("payment",req.query)
})

app.get("/payment-success", function(req, res){
    res.render("success", req.query)
})

app.get("/payment-pending", function (req, res) {
    res.render("pending", req.query)
})

app.get("/payment-failure", function (req, res) {
    res.render("failure", req.query)
})
app.post("/notification", function(req, res){
    console.log(req)
    res.send("notification recibida")
})

app.listen(port);