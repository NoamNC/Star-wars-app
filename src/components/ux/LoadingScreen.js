import React from 'react';
import './LoadingScreen.css'

const LoadingScreen = () => {
  return (
      <section className='loader'>
        <div className='loader_crawl'>
          <div className='loader_crawl_title'>
            <p>Episode IV</p>
            <h1>A New Hope</h1>
          </div>

          <p>
            I want to use this loading time and thank you for giving me this opportunity to demonstrate my skills.
            Hey, my name is Noam Cohen. I am a 31 year old fullStack programer from Tel Aviv.
          </p>
          <p>
             3 things about me:
             I am a highly motivated, hard working and creative programer with a passion for code!
             I thrive in a social enlivenment but I work super efficiently independently. 
             I have a dog named Lima and shes the love of my life. 
          </p>
          <p>
            If you got this far you're either checking out my code thoroughly or you're REALLY REALLY patient. 
            in both cases I sincerely appreciate it very much.
            thank you for your time.
          </p>
        </div>
      </section>
  );
};

export default LoadingScreen;
