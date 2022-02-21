const express       = require('express')
const app           = express()
const router        = express.Router()
const SpotifyWebApi = require('spotify-web-api-node')
const PORT          = 9090

// your clientId and clientSecret are in https://developer.spotify.com/dashboard/applications/

var spotifyApi = new SpotifyWebApi({
    clientId: '',
    clientSecret: '',
    redirectUri: `http://localhost:${PORT}/callback`
})

router.get('/', (req, res, next) => {
    res.redirect(spotifyApi.createAuthorizeURL([
        "ugc-image-upload",
        "user-read-recently-played",
        "user-read-playback-state",
        "user-top-read",
        "app-remote-control",
        "playlist-modify-public",
        "user-modify-playback-state",
        "playlist-modify-private",
        "user-follow-modify",
        "user-read-currently-playing",
        "user-follow-read",
        "user-library-modify",
        "user-read-playback-position",
        "playlist-read-private",
        "user-read-email",
        "user-read-private",
        "user-library-read",
        "playlist-read-collaborative",
        "streaming"
    ]))
})

// > https://developer.spotify.com/dashboard/applications/
// > Edit Settings
// > Redirect URIs
// > http://localhost:9090/callback

router.get('/callback', (req, res, next) => {
    const code = req.query.code
    spotifyApi.authorizationCodeGrant(req.query.code).then((response) => {
        res.send( response.body.access_token )
    })
})

app.use('/', router)

app.listen( PORT, () => {
   console.log(`Running at port ${PORT}`)
})
