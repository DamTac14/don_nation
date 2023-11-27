import React, { useState } from "react";
import InputForm from "../components/InputForm";

function Registration(){
  // State of password was use to show or not the password when user forget or has error
  const [showPassword, setShowPassword] = useState(false);

  // function for show password 
  const togglePassword = (event) => {
    event.preventDefault(); // Prevent the page from refreshing
    setShowPassword(!showPassword);
  }

  // asynchronous function force registration
  async function RegistrationUsers(event){

    event.preventDefault()  // Prevent the page from refreshing

    const name = document.getElementById('name').value.toUpperCase()
    const firstname = document.getElementById('firstname').value
    const email = document.getElementById('email').value

    // Empty password statement to store passwords that will be checked and validated
    let password;

    // Recovery of the password as well as that of verification to compare them
    const password1 = document.querySelector('input[name="password"]');
    const password2 = document.querySelector('input[name="password_confirmation"]');

    // Verification condition

    if (password1.value !== password2.value) {
      document.getElementById('return').innerHTML = "Les mots de passe ne correspondent pas !";
      password1.value = "";
      password2.value = "";
      password1.focus();
    }
    else {
      // The passwords match, we can continue processing
      password = password1.value;
    }
    // Retrieve data, transform location data to be uppercase in the
    // database so that they can be grouped together in the future when there is greater demand and need for improvement
    const country_localisation = document.getElementById('country_localisation').value.toUpperCase();
    const postal_code = document.getElementById('postal_code').value


// form in JSON format
    const userData = {
      name:name,
      firstname:firstname,
      email:email,
      password:password,

      country_localisation:country_localisation,
      postal_code:postal_code
    }

   const send = await fetch('http://localhost:7005/api/Registration', {
      method: 'POST',
      headers:
      {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
  });
            if (!send.ok) {
              throw new Error('Registration failed.');
            }
            if(send.ok){
              document.getElementById('return').innerHTML = "Votre inscription s'est déroulée avec succès"
              console.log('Registration succeeded.');
            }
  }

  return (
    <>
      <form className="form-container" onSubmit={RegistrationUsers}>
      
        <h3>Inscription</h3>

        <InputForm 
          label="Nom"
          inputType="text"
          name="name"
          id='name'
          required
        />

        <InputForm 
          label="Prenom"
          inputType="text"
          name="firstname"
          id='firstname'
          required
        />

        <InputForm 
        label="Ville"
        inputType="text"
        name="country_localisation"
        id='country_localisation'
        required
        />

        <InputForm 
        label="Code postal"
        inputType="text"
        name="postal_code"
        id='postal_code'
        required
        />

        <InputForm 
          label="Email"
          inputType="email"
          name="email"
          id='email'
          required
        />

        <InputForm 
          label="Mot de passe (8 caractères minimum)"
          inputType={showPassword ? "text" : "password"}
          name="password"
          className="password"
          minLength='8'
          required
        />

        <InputForm 
          label="Vérifiez votre mot de passe"
          inputType={showPassword ? "text" : "password"}
          name="password_confirmation"
          className="password"
          minLength='8'
          required
        />


        <InputForm 
          inputType="submit"
          name="submit"
          value={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
          onClick={togglePassword}
          id='showPassword'
        />

        <InputForm 
          inputType="submit"
          name="submit"
          value='Valider votre inscription'
        />

        <p id="return"></p>
      </form>
    </>
  )
}

export default Registration
