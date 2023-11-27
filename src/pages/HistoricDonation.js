import ShowDonations from "../components/Donations";
import InputForm from "../components/InputForm";
import { useState, useEffect } from "react";

import Search from "../components/searchBar";

import '../style/miniature.css'
import '../style/fullscreen.css'
import '../style/historic.css'


function HistoricDonationsList(){
  // Retrieving user id_user retrieving when user was connected and use for request SQL to the API route
  const [idUser] = useState(localStorage.getItem('thisUser'));
    // creation of differents state was use on the function or was use to store data
    const [showReservationButton] = useState(false)
    const [data, setData] = useState([]);
    const [isDonationsClicked, setIsDonationsClicked] = useState(false);

    // Asynchronous function that allows you to see the history of user donations
    const fetchDonations = async () => {
        const url = `http://localhost:7005/api/ShowDonationsHistoric/${idUser}`;
        const response = await fetch(url, {
            method:'GET',
            credentials: 'include',
        });
        const result = await response.json();
        setData(result);
    };
    // Asynchronous function that allows to see the user's booking history

    const fetchReservations = async () => {
        const url = `http://localhost:7005/api/ShowReservationsHistoric/${idUser}`;
        const response = await fetch(url, {
            method:'GET',
            credentials: 'include',
        });
        const result = await response.json();
        setData(result);
    };

    // Management of buttons that will display reservation or donation

    const handleSubmitDonations = (event) => {
        event.preventDefault(); // Prevent the form from auto-submitting
        setIsDonationsClicked(true);
        fetchDonations();
    }

    const handleSubmitReservations = (event) => {
        event.preventDefault(); // Prevent the form from auto-submitting
        setIsDonationsClicked(false);
        fetchReservations()
    }

    // Use of the useEffect which allows the display after retrieval and reading of the data

    useEffect(() => {
        if (isDonationsClicked) {
            fetchDonations();
        } else {
            fetchReservations();
        }
    }, [isDonationsClicked])

    return (
        <div className="historicContainer">
            <Search />
            <h1>Historique de vos {isDonationsClicked ? 'donations' : 'réservations'}</h1>
            <div className="title">
            <InputForm 
                    inputType='submit'
                    value='Donations'
                    className={isDonationsClicked ? 'historicSubmit active' : 'historicSubmit'}
                    onClick={handleSubmitDonations}
                />
                <InputForm 
                    inputType='submit'
                    value='Réservations'
                    className={!isDonationsClicked ? 'historicSubmit active' : 'historicSubmit'}
                    onClick={handleSubmitReservations}
                />
            </div>

            <div className="container">
            {data.map((element) => (
                <ShowDonations
                    key={element.id_donation}
                    name={element.name}
                    firstname={element.firstname}
                    country_localisation={element.country_localisation}
                    postal_code={element.postal_code}
                    file={element.file}
                    title={element.title}
                    comment={element.comment}
                    post_date={new Date(element.post_date).toLocaleDateString()}
                    reservation_date={new Date(element.reservation_date).toLocaleDateString()}
                    nameReserve={element.name_reserve}
                    firstnameReserve={element.firstname_reserve}
                    showReservationButton={showReservationButton}
                />
                ))}
                </div>
        </div>
    );
}

export default HistoricDonationsList;
