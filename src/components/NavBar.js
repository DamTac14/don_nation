import React, {useState} from "react";
import {Link} from "react-router-dom";
import '../style/nav.css'

function NavBar(){
    // Retrieve the connection in order to give access to menu tabs or not 
   const [isConnected] = useState(localStorage.getItem('isAuthenticated') === 'true');

    return (
        <nav>
            <ul>
                <li><Link to={'/'}>Donations</Link></li>
                <li><Link to={'/add_donations'}>Faire une donation</Link></li>
                {isConnected && <li><Link to={'/historic_donations'}>Historique</Link></li>}
            </ul>
        </nav>
    )
}

export default NavBar;