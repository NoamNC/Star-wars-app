import React from 'react';
import planetService from '../services/planet-service';
import './PlanetPopulationChart.css';
import { addCommas } from '../utils/addCommas';

const PlanetPopulationChart = ({ planets }) => {
  const chartPlanets = planetService.getPlanetsForChart(planets);
  
  return (
    <section id='planet-population-chart'>
      <p className='component-description'>
        A bar chart that compares the home planets own population:
      </p>
      <div className='chart-container'>
        <p className='short-text'>M = million</p>
        <div className='chart'>
          {chartPlanets?.map((planet, index) => (
            <div key={planet.name}>
              <p className='responsive-text long-text'>
                {chartPlanets && addCommas(planet.population.toString())}
              </p>
              <p className='responsive-text short-text'>
                {chartPlanets ? `${planet.population / 10000000}M` : ''}
              </p>
              <div className='lightsaber-container'>
                <div className='lightsaber'>
                  <label className='handle'></label>
                  <div className='switch'></div>
                  <div
                    style={{
                      height: `${Math.log(planet.population) * 10}px`,
                    }}
                    className={`plasma color-${index}`}></div>
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
