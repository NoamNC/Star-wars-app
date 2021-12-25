import React from 'react';
import './PlanetPopulationChart.css'

const PlanetPopulationChart = ({ chartPlanets }) => {
  return (
    <section id='planet-population-chart'>
      <p style={{ color: ' #feda4a', margin: '60px 0px 30px 0px' }}>
        A bar chart that compares the home planets own population:
      </p>
      <div className='chart-container'>
        <div className='chart'>
          {chartPlanets?.map((planet) => (
            <div style={{ minWidth: '0px' }} key={planet.name}>
              <p className='responsive-text'>{planet.population}</p>
              <div className='lightsaber-container'>
                <div className='lightsaber'>
                  <label className='handle'></label>
                  <div className='switch'></div>
                  <div
                    style={{
                      height: `${Math.log(planet.population) * 10}px`,
                    }}
                    className={`plasma ${planet.name}`}
                  ></div>
                </div>
              </div>
              <p className='responsive-text'>{planet.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlanetPopulationChart;
