let accessToken;
const clientID = '';
const redirectURI = 'http://localhost:3000/';

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      console.log('recieved token')
      return accessToken;
    }
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
    }
  },

  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, { 
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (!jsonResponse.tracks) {
        return [];
      } 
      console.log(jsonResponse.tracks.items)
      return jsonResponse.tracks.items.map(track => ({ 
        id: track.id, 
        name: track.name, 
        artist: track.artists[0].name, 
        album: track.album.name, 
        uri: track.uri
      }));
    })
  },

  savePlaylist(playlistName, URIs) {
    if (!playlistName || !URIs) {
      return;
    }
    const accessToken = Spotify.getAccessToken();
    const headers = {Authorization: `Bearer ${accessToken}`};
    let userID;
    // get user id
    return fetch('https://api.spotify.com/v1/me', {headers: headers}
    ).then(response => {
      return response.json();
    }).then(jsonResponse => {
        userID = jsonResponse.id;
        // create new playlist
        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,
          { 
            method: 'POST', 
            body: JSON.stringify({ name: playlistName }), 
            headers: headers
          }).then(response => {
            return response.json()
          }).then(jsonResponse => {
            const playlistID = jsonResponse.id;
            // Add to new playlist
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, 
            { 
              method: 'POST', 
              body: JSON.stringify({ uris: URIs }), 
              headers: headers
            })
          })        
      })
  }
}
export default Spotify;