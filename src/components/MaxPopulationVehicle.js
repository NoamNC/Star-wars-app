import React from 'react';
import './MaxPopulationVehicle.css';

import vehicleService from '../services/vehicle-service';

const MaxPopulationVehicle = ({ planets, vehicles, people }) => {
  const vehicle = vehicleService.getMaxPopulationVehicle(planets, vehicles, people);
console.log(vehicle)
  return (
    <section id='vehicle-with-max-population-table'>
      <p style={{ margin: '0px 5px 20px 0px' }}>
        The vehicle's name with the highest sum of population for all its pilots home
        planets is represented in the following table:
      </p>

      <table className='table'>
        <tbody>
          <tr>
            <td className='table_data'>Vehicle name with the largest sum</td>
            <td className='table_data'>{vehicle ? vehicle.name : ''}</td>
          </tr>
          <tr>
            <td className='table_data'>
              Related home planets and their respective population
            </td>
            <td className='table_data'>
              {Object.values(vehicle.pilots)?.map((pilot) => [
                pilot.homeworldName + ': ',
                pilot.population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '. ',
              ])}
            </td>
          </tr>
          <tr>
            <td className='table_data'>Related pilot names</td>
            <td className='table_data'>
              {Object.keys(vehicle.pilots)?.map((pilot) => pilot + ' ')}
            </td>
          </tr>
          <tr></tr>
        </tbody>
      </table>
    </section>
  );
};

export default MaxPopulationVehicle;
