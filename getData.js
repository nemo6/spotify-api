import SpotifyWebApi  from "spotify-web-api-node"
import fetch          from "node-fetch"
import http           from "http"

const PORT = 9090

var spotifyApi = new SpotifyWebApi({
    clientId: '',
    clientSecret: '',
    redirectUri: `http://localhost:${PORT}/callback`
})

const token = ""

let playlist = [
{id:"3EEWNxeaucRraD36FH2pMK",name:"Classique"},
{id:"2gGbtYsSiM3eLbXQB9rA7V",name:"Cinema"},
{id:"1ihMny7W4lXtfRsU8IoNSV",name:"A"},
{id:"1vqHupeMYYvRBwKMJEm35b",name:"Youtube"},
{id:"5TOTkstNNHaFkdGyIcyrH3",name:"Rain"},
{id:"0M1j1GIqm4vz66FY10MtWc",name:"Dance"},
{id:"4AwPh5vr4OXP4dvtYsSbVT",name:"Chanson"},
{id:"3zn54DRnqoh35NL0i9YXiT",name:"General"},
{id:"3fb0ertyWTKD9S9e43VCTQ",name:"Radio"},
]

spotifyApi.setAccessToken(token)

async function getURI(x){

    let d = await spotifyApi.getPlaylistTracks(x)
    let c = mapForObject( d, (x,i,_,p,last) => ( i == "uri" && (/spotify:track:/).test(x) ) && [x,last(p,1).name] )
    return c
}

async function requestAPI(id,name){

    let response = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })

    let d = await response.json()
    d = d.items.map( x => [x.track.name,x.track.uri] )

    return { [name]: d } 
}

(async (req,res) => {

    let table=[]
    for( let x of playlist ){
        let d = await requestAPI(x.id,x.name)    
        table.push(d)
    }

    server( JSON.stringify(table,null,2) )

})()

function mapForObject(x,callback,v=[],i=0,p=[]){

    let last = (x,n) => x[x.length-n]

    for ( y of Object.keys(x) ) {

        if ( typeof x[y] != 'object' || x[y] == null ){

            ( (x) => x && v.push(x) )(callback(x[y],y,x,p,last)) // x[y] value y key x parent p table of parent
        
        }else{
          
            p.push(x[y])
            i++
            mapForObject(x[y],callback,v,i,p)
            i--
            p.pop()
        }
    }
    return v
}

function server(x,n) {

    const PORT = 8080

    http.createServer(function (req, res) {
        
        res.writeHead(200,{"content-type":`text/${n};charset=utf8`})

        res.end(x)
      
    }).listen(PORT)

    console.log(`Running at port ${PORT}`)

}
