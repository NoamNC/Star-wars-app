import React from 'react';
import './VehicleWithMaxPopulationTable.css';

const VehicleWithMaxPopulationTable = ({ vehicle, planets, pilots }) => {
  const tableData = [
    ['Vehicle name with the largest sum', vehicle ? vehicle.name : ''],
    [
      'Related home planets and their respective population',
      planets?.map((planet) => [
        planet.name + ':  ',
        planet.population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      ]),
    ],
    ['Related pilot names', pilots?.map((pilot) => pilot.name+' ')],
  ];

  const table = [];

  for (const [index, values] of tableData.entries()) {
    table.push(
      <tr key={index}>
        {values.map((data, i) => (
          <td className='table_data' key={`${i}key`}>
            {data}
          </td>
        ))}
      </tr>
    );
  }

  return (
    <section id='vehicle-with-max-population-table'>
      <p style={{ margin: '20px 5px 20px 0px' }}>
        The vehicle's name with the highest sum of population for all its pilots
        home planets is represented in the following table:
      </p>

      <table className='table'>
        <tbody>{table}</tbody>
      </table>
    </section>
  );
};

export default VehicleWithMaxPopulationTable;
