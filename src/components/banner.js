import React, {useState} from "react";
import {Link} from "react-router-dom";

import '../style/banner.css'

function Banner() {
  // Retrieve connection localStorage and id_user during connection
  const [isConnected, setIsConnected] = useState(localStorage.getItem('isAuthenticated') === 'true');
  const [thisUser, setThisUser] = useState(localStorage.getItem('thisUser'));

  // Disconnection API call that destroys the token created in the API server
  const url = 'http://localhost:7005/api/Logout'
  const Logout = () => {
    fetch(url, {
        method: 'POST',
        credentials: 'include'
    })
    .then(response => {
        // remove login token from localStorage, also id_user and update local state
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('thisUser');
        setThisUser(false)
        setIsConnected(false);
        
        // reload page to update UI
        window.location.reload();
    })
    .catch(error => {
        console.error(error);
    });
}



  return (
    <div class="banner-container">
    <h1 class="banner-title">Don Nation</h1>

    {/* Condition for UI when user was connected or not */}
    
    {isConnected ? ( 
      <p class="connection">
      <Link to="/user_connection" onClick={Logout} class="banner-link">Déconnexion</Link>
      </p>
 ) : (
        <p class="connection">
      <Link to="/user_connection" class="banner-link">Connexion</Link>
      <Link to="/user_registration" class="banner-link">Inscrivez-vous</Link>
      </p>
      )}
  </div>
  
  );
}

export default Banner