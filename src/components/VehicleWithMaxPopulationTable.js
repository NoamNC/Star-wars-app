import React from 'react';

const VehicleWithMaxPopulationTable = ({ vehicle, planets, pilots }) => {
  return (
    <>
      <h2 style={{color: ' #feda4a'}}>Your Challenge:</h2>
      <p style={{color: ' #feda4a'}}>
        1. Which vehicle names have the highest sum
        of population for all its pilots’ home planets?
      </p>
      <table>
        <tbody>
          <tr className='flexup'>
            <td className='box'>Vehicle name with the largest sum</td>
            <td className='box'>{vehicle ? vehicle.name : ''}</td>
          </tr>
          <tr className='flexup'>
            <td className='box'>
              Related home planets and their respective population
            </td>
            <td className='box'>
              {planets?.map((planet) => [
                planet.name + ', ',
                planet.population,
              ])}
            </td>
          </tr>
          <tr className='flexup'>
            <td className='box'>Related pilot names</td>
            <td className='box'>{pilots?.map((pilot) => pilot.name)}</td>
          </tr>
          <tr></tr>
        </tbody>
      </table>
    </>
  );
};

export default VehicleWithMaxPopulationTable;
