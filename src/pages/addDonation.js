import React, { useState } from "react";
import InputForm from "../components/InputForm"

function AddDonation(){
  // Retrieving the id_user
    const [thisUser] = useState(localStorage.getItem('thisUser'));

    async function AddDonationServer() {
    
      const fileInput = document.getElementById('file');
      const file = fileInput.files[0];
    
      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('title', document.getElementById('title').value);
      formData.append('comment', document.getElementById('comment').value);
      formData.append('post_date', new Date().toISOString().slice(0, 10));
      formData.append('id_user', thisUser);
    
      let response = await fetch('http://localhost:7005/api/Upload', {
        method: 'POST',
        credentials: 'include',
        body: formData
      })

          if (response.status === 200) {
            console.log('Upload succeeded.');
            document.getElementById('return').innerHTML = 'Don envoyé avec succès';
          } else {
            document.getElementById('return').innerHTML = 'Il y a un problème lors de la déposition de votre don';
          }

    }
    
    

    return (        
      <figure className="form-container">

            <h3>Faire une Don Nation</h3>
            
            <InputForm
            label="Titre de votre annonce"
            inputType="text"
            name="title"
            id='title'
            />

            <p className="titlePrevention"> 
            (le titre de l'annonce ne doit pas dépasser 30 caractères)</p>

            <InputForm
            label="Ajoutez votre image"
            inputType="file"
            name="file"
            id='file'
            accept="image/jpeg, image/png, image/jpeg"
            />
            <p className="titlePrevention"> 
            (le nom de l'image ne doit pas dépasser 500 caractères)</p>

            <InputForm
            label="Commentaire"
            inputType="textarea"
            name="comment"
            id='comment'
            placeholder='Veuillez décrire votre donation'
            rows='5'
          />

            <button onClick={AddDonationServer}>Envoyez votre don
            </button>

            <p id="return"> </p>
        </figure>
    )
}

export default AddDonation