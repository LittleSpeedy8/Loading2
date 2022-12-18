const express = require("express")
const app = express()
const client = require("../index")
// config = require("../Structures/config")

const session = require("express-session")
const MemoryStore = require("memorystore")(session)
const DiscordStrategy = require("passport-discord").Strategy
const passport = require("passport")

const bodyParser = require('body-parser');
const path = require("path");
//const { guilds, user } = require("../Structures/index");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views")

//const test = parseInt(user.joinedTimestamp / 1000)

passport.use(
    new DiscordStrategy({
        clientID: client.config.Client_ID,
        clientSecret: client.config.Client_Secret,
        callbackURL: "Your bot callback just dm if you need help with this",
        scope: ["identify", "guilds"]
    },

        function (accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                return done(null, profile)
            })
        }
    )
)

app.use(session({
    store: new MemoryStore({checkPeriod: 86400000}),
    secret: "you cam make any thing up for this",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user)
})

passport.deserializeUser(function(obj, done) {
    done(null, obj)
})

const users = client.users.cache.size

app.get('/', (req, res) => res.render('home', { bot: client, users, req }))

app.get('/login', async (req, res, next) => {
    next();
}, passport.authenticate('discord'))


app.get('/callback', passport.authenticate("discord", { failureRedirect: "/"}), function(req, res){
res.redirect("/")
})


app.get('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });




app.use(express.static(path.join(__dirname, '/views')));
app.use('/css', express.static(__dirname + 'views/assets/css/'))
app.use('/js', express.static(__dirname + 'views/assets/js/'))


app.get('*', (req, res) => {
    res.sendFile(__dirname + '/views/404.html')
 }); 
 

app.listen(client.config.port, () => {
    console.log(`Server is on port http://localhost:${client.config.port}/`)
})