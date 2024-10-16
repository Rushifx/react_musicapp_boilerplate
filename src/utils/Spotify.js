let accessToken = "";
const clientID = "01893deb65e1423ca673e6152aa257c4";
//const redirectUrl = "http://localhost:3000";
const redirectUrl = "https://colinspotifyapplication.surge.sh";

const Spotify = {
    
    //creates accessToken if not found
    getAccessToken(){

        // first check for access token
        if(accessToken) return accessToken;

        const tokenInURL = window.location.href.match(/access_token=([^&]*)/);
        const expiryTime = window.location.href.match(/expires_in=([^&]*)/);

        // second check for acces token
        if(tokenInURL && expiryTime){

            // set access token and expiry time variables
            accessToken = tokenInURL[1];
            const expiresIn = Number(expiryTime[1]);

            // logging values for accessToken and expiresIn
            console.log(accessToken, expiresIn);

            // setting the access token to expire at the value for expiration time
            // clears accessToken after expiry time
            // If expires_in = 3600 (1 hour), accessToken'll be cleared after 1 hour (3600 * 1000 ms = 3,600,000 ms or 1 hour).
            window.setTimeout(() => (accessToken = ""), expiresIn * 1000);

            // clear the url after the accesstoken expires
            window.history.pushState("Access token", null, "/");
            return accessToken;
            }else{

                // If no access to spotify, request for access
                const redirect = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUrl}`;
                window.location = redirect;
            }

    },

    // Search Function Object
    async search(term){

        if(term === null || term === undefined || term === "")
            return;

        accessToken = Spotify.getAccessToken();
        return await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            method: "GET",
            headers: {Authorization: `Bearer ${accessToken}`}
        })
        .then((response)=>response.json())
        .then((jsonResponse)=>{
            if(!jsonResponse)
                console.log("Response error");  //Response from spotify is erroneous
            return jsonResponse.tracks.items.map((t) =>({
                id: t.id,
                name: t.name,
                artist: t.artists[0].name,
                album: t.album.name,
                uri: t.uri
            }));
        })

    },

    // Takes in name and uri of the track to save
    savePlayList(name, tracksUris){
        if (!name || !tracksUris) {
            return;
        }
        const token = Spotify.getAccessToken();
        const header = {Authorization: `Bearer ${token}`};
        let userId = "";

        // fetching profile
        return fetch(`https://api.spotify.com/v1/me`, {headers: header})                         // fetch my profile
                .then((response) => response.json())
                .then((jsonResponse)=>{
                    userId = jsonResponse.id;                                                   // process the response of my own ID
                    let playlistId = "";
                    return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {      // fetch playlist of my profile and store the name of my new playlist
                        headers: header, 
                        method: "POST", 
                        body: JSON.stringify({name: name})})
                            .then((response)=> response.json())
                            .then((jsonResponse)=>{
                                playlistId = jsonResponse.id;
                                return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, { // fetch new playlist of my profile and store the songs
                                    headers: header,
                                    method: "POST",
                                    body: JSON.stringify({uris: tracksUris})
                                })
                            })
                });
    }

};

export {Spotify};