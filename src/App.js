import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react'

import Banner from './components/banner';
import Connection from './pages/Connection';
import Registration from './pages/registration';
import NavBar from './components/NavBar';

import DonationsList from './pages/DonationList';
import AddDonation from './pages/addDonation';
import HistoricDonationsList from './pages/HistoricDonation';
import BeConnected from './components/MustConnected';
import Connected from './components/Connected';
import Footer from './components/footer';

function App() {
  // Retrieving user connection create at connection form and use for connection condition 
  const [isConnected] = useState(localStorage.getItem('isAuthenticated') === 'true');

  // If user was connected, he sees all route, if he's not he sees a message for login required

  return (
  <Router>
    <div>
      <Banner />
      <NavBar />
        <Routes>
          {isConnected ? (<Route path='/user_registration' element={<Connected />} />) 
          : (<Route path='/user_registration' element={<Registration />} />)}

          {isConnected ? (<Route path='/user_connection' element={<Connected />} />) 
          : (<Route path='/user_connection' element={<Connection />} />)}

          <Route path='/' element={<DonationsList />} />

          {isConnected ? (<Route path='/add_donations' element={<AddDonation />} />): 
        (<Route path='/add_donations' element={<BeConnected />} />)}

          {isConnected ? (<Route path='/historic_donations' element={<HistoricDonationsList />} />)
        : (<Route path='/historic_donations' element={<BeConnected />} />)}
        </Routes>
        <Footer />
    </div>
  </Router>
  )
}

export default App;
