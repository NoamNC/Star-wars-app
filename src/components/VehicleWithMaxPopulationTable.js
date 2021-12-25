import React from 'react';
import './VehicleWithMaxPopulationTable.css';

const VehicleWithMaxPopulationTable = ({ vehicle, planets, pilots }) => {
  const elements = [
    'Vehicle name with the largest sum',
    vehicle ? vehicle.name : '',
  ];

  const items = [];

  for (const [index, value] of elements.entries()) {
    items.push(
      <td className='table_data' key={index}>
        {value}
      </td>
    );
  }

  return (
    <section id='vehicle-with-max-population-table'>
      <p style={{ color: ' #feda4a', margin: '20px 5px' }}>
        The vehicle's name with the highest sum of population for all its pilots
        home planets is represented in the following table:
      </p>

      <table className='table'>
        <tbody>
          <tr>{items}</tr>
          <tr>
            <td className='table_data'>
              Related home planets and their respective population
            </td>
            <td className='table_data'>
              {planets?.map((planet) => [
                planet.name + ':  ',
                planet.population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
              ])}
            </td>
          </tr>
          <tr>
            <td className='table_data'>Related pilot names</td>
            <td className='table_data'>{pilots?.map((pilot) => pilot.name)}</td>
          </tr>
          <tr></tr>
        </tbody>
      </table>
    </section>
  );
};

export default VehicleWithMaxPopulationTable;
