import ShowDonations from "../components/Donations";
import { useState, useEffect } from "react";

import Search from "../components/searchBar";


import '../style/miniature.css'
import '../style/fullscreen.css'



function DonationsList(){
  // Retrieving user id_user retrieving when user was connected and use for request SQL to the API route
const [id_user] = useState(localStorage.getItem('thisUser'));

// State management, allows to make the reservation button visible or not
const [showReservationButton] = useState(true)
const [data, setData] = useState([]);

// Asynchronous donation display function
const fetchDonations = async () => {
    const url = 'http://localhost:7005/api/showDonations';
    const response = await fetch(url, {
        method:'GET'
    });
    const result = await response.json();
    setData(result);
};

// useEffect which allows display after retrieving and reading data

useEffect(() => {
  fetchDonations();
}, []);

    return (
        <div>
        <Search />
        <div className="title">
        <h1>Liste des donations</h1>
        </div>
        <div className="container">
          {data.map((element) => (
            <ShowDonations
              name={element.name}
              firstname={element.firstname}
              country_localisation={element.country_localisation}
              postal_code={element.postal_code}
              file={element.file}
              title={element.title}
              comment={element.comment}
              post_date={new Date(element.post_date).toLocaleDateString()}
              id_donation={element.id_donation}
              id_user={id_user}
              showReservationButton={showReservationButton}
            />
          ))}
          </div>
        </div>
      );
}

export default DonationsList