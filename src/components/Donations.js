import React, { useState } from "react";

import InputForm from "./InputForm";

function ShowDonations({ 
  name, 
  firstname, 
  country_localisation, 
  postal_code, 
  file, 
  title, 
  comment, 
  post_date,
  reservation_date, 
  nameReserve,
  firstnameReserve,
  showReservationButton,
  id_donation,
  id_user
  }) {

    // Generation of the parameters that will be used when importing the function
    // In order to pass the data expected from the DB and the API

    // State management and connection recovery
  const [showModal, setShowModal] = useState(false);
  const [isConnected] = useState(localStorage.getItem('isAuthenticated') === 'true');

  async function ReservationClick(){
    // Donation reservation function

    // Retrieval of data and also the date of the reservation
    const reservation_date = new Date().toISOString().slice(0, 10);
      

    // Retrieve data in JSON format
    let data = {
      id_donation:id_donation,
      id_user:id_user,
      reservation_date:reservation_date
    }

    await fetch('http://localhost:7005/api/Reservation', {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(data)
          })
          .then(response => {
            if (response.status === 500) {
              // Message that resets the data situation
              document.getElementById('return').innerHTML = 'Il y a un problème lors de la réservation de votre don'
            }
            if(response.status === 200){
              console.log('Upload succeeded.');
              // Message that resets the data situation
              document.getElementById('return').innerHTML = 'Don réservé avec succès'
            }
          })
  }

  // Status function that allows to manage the enlargement of the article for more details
  // Or close it using &Times which allows it to create a cross in order to close the open article

  function handleClick() {
    setShowModal(true);
  }

  function handleClose() {
    setShowModal(false);
  }

  return (

    
    <div>
      <div className="search min" onClick={handleClick} key={id_donation}>
        <h2>{title}</h2>

        <img src={`/uploads/${file}`} alt={title}/>

        <p>{country_localisation} - {postal_code}</p>
      </div>


      {/* Using the showModal state to say whether or not we put the article in fullscreen with the details */}
      {showModal && (
        <div className="search modal-back">

        <button className="button-close" onClick={handleClose}>
        {/* Using &Times to create a close button */}
          <span className="close-icon">&times;</span>

        </button>
          <div className="modal" key={id_donation}>

            <h2>{title}</h2>
            
              <img src={`/uploads/${file}`} alt={title} />

            <h3>Commentaire du donateur</h3>

              <p className="comment">{comment}</p>
              <p className="publication_date">Date de publication le {post_date}, par {name} {firstname}</p>


        {/* Check if data is entered in order to reveal or not the fact that it is reserved*/}
        {reservation_date && nameReserve && firstnameReserve ? (
          <p className="publication_date">
            Réservé le {reservation_date} par {nameReserve} {firstnameReserve}
          </p>
        ) : null}

       {/*Check if the user is logged in or not in order to make the reservation button appear*/}
        {showReservationButton && (
          isConnected ? (
            <div className="Modal-Button">

              <InputForm 
                inputType="submit"
                name="submit"
                value='Réserver'
                onClick={ReservationClick}
              />

            </div>) 
            : 
            (<p>Vous devez être connecté pour réserver ce don.</p>)
              )}
              <p id="return"></p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowDonations;
