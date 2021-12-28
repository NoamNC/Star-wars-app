import React from 'react';
import './PlanetPopulationChart.css';

const PlanetPopulationChart = ({ planets }) => {
  const planetsForChart = new Set([
    'Tatooine',
    'Alderaan',
    'Naboo',
    'Bespin',
    'Endor',
  ]);
  const chartPlanets = [];
  Object.values(planets).forEach((planet) => {
    if (planetsForChart.has(planet.name)) {
      chartPlanets.push(planet);
    }
  });

  return (
    <section id='planet-population-chart'>
      <p style={{ margin: '60px 5px 30px 0px' }}>
        A bar chart that compares the home planets own population:
      </p>
      <div className='chart-container'>
        <p>M = million</p>
        <div className='chart'>
          {chartPlanets?.map((planet) => (
            <div style={{ minWidth: '0px' }} key={planet.name}>
              <p className='responsive-text'>
                {chartPlanets
                  ? planet.population
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  : `${planet.population / 10000000}M`}
              </p>
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
