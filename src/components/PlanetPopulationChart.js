import React from 'react';
import planetService from '../services/planet-service';
import './PlanetPopulationChart.css';

const PlanetPopulationChart = ({ planets }) => {
  const chartPlanets = planetService.getPlanetsForChart( planets);
  return (
    <section id='planet-population-chart'>
      <p style={{ margin: '60px 5px 30px 0px' }}>
        A bar chart that compares the home planets own population:
      </p>
      <div className='chart-container'>
        <p className='short-text'>M = million</p>
        <div className='chart'>
          {chartPlanets?.map((planet) => (
            <div style={{ minWidth: '0px' }} key={planet.name}>
              <p className='responsive-text long-text' >
                {chartPlanets? planet.population.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  : ''}
              </p>
              <p className='responsive-text short-text'>
                {chartPlanets? 
                   `${planet.population / 10000000}M` : ''}
              </p>
              <div className='lightsaber-container'>
                <div className='lightsaber'>
                  <label className='handle'></label>
                  <div className='switch'></div>
                  <div
                    style={{
                      height: `${Math.log(planet.population) * 10}px`,
                    }}
                    className={`plasma ${planet.name}`}></div>
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
