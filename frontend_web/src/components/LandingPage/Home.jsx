import React from 'react';
import Appbar from '../Appbar/Appbar';
import './LandingPage.css';
import universityLogo from '/src/assets/static/img/Cebu_Institute_of_Technology_University_logo.png';

const LandingPage = () => {
  return (
      // <div id='wrapper'>
      <>
          <Appbar page={'home'}/>
          <div >
              <img src={universityLogo} style={{
                  width: '720px',
                  top: '25%',
                  height: '600px',
                  left: '60.5%',
                  display: 'inline-block',
                  position: 'absolute',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  opacity: .2 // Makes the logo slightly transparent
              }}></img>
          </div>

          <br/> <br/>
          <div className="landing-page">
              <div className="content">
                  <h1>Laboratory Equipment</h1>
                  <h1>Monitoring System</h1>
                  <p>Optimize lab operations with our app for efficient equipment borrowing, breakage assessment, and
                      real-time inventory management.</p>
              </div>

          </div>
          </>
      // </div>
  );
};

export default LandingPage;
