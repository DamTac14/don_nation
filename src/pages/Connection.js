import React from "react"
import InputForm from "../components/InputForm"
import '../style/form.css'

function Connection(){

    async function Login(event) {    
        event.preventDefault(); // Prevent the page from refreshing
    
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
              
        // The json that will be sent to verify data on login
        let userData = {
            email: email,
            password: password
        };
        
        // API route 
        
        try {
          let url = "http://localhost:7005/api/userConnection";
          let response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(userData)
          });
          
          const result = await response.json();

          // Condition for result of database and api if the user was on database
          if (result.serverReturn === 'OK') {
            // Creation of token on localStorage isAuthenticated was used on others composent for condition and interface display elements
            localStorage.setItem('isAuthenticated', 'true');

            // Creation of token on localStorage thisUser was used when we want retrieve id of user to API route and request SQL
            localStorage.setItem('thisUser', result.id_user)

            // Redirection of user when the connection was good and localStorage was end
            window.location.href = "/";
          }
        } catch (error) {
          document.getElementById("error").innerHTML =
            "Une erreur s'est produite lors de la connexion, veuillez vérifier vos identifiants";
        }
    }
    


    return(
    <form className="form-container" onSubmit={Login}>
    
    <h3>Connexion</h3>

        <InputForm
        label="Email"
        inputType="email"
        name="email"
        id='email'
        />

        <InputForm
        label="Mot de passe"
        inputType="password"
        name="password"
        id='password'
        minLength='8'
        />

        <InputForm
        inputType="submit"
        name="connection"
        value='Connexion'
        />

        <p id="error"></p>
    </form>
    )
}

export default Connection