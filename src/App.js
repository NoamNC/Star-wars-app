import { useState, useEffect } from 'react';
import planetService from './services/planet-service'
import peopleService from './services/people-service';
import vehicleService from './services/vehicle-service';
import LoadingScreen from './components/ux/LoadingScreen';
import PlanetPopulationChart from './components/PlanetPopulationChart';
import VehicleWithMaxPopulationTable from './components/VehicleWithMaxPopulationTable';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [planets, setPlanets] = useState();
  const [people, setPeople] = useState();
  const [vehicles, setVehicles] = useState();

  useEffect(async () => {
    const planets = await planetService.getPlanets()
    const vehicles = await vehicleService.getVehicles();
    const people = await peopleService.getPeople();
    setVehicles(vehicles);
    setPlanets(planets);
    setPeople(people);
    setIsLoading(false);
  }, []);

  return (
    <>
      {!isLoading && (
        <>
          <VehicleWithMaxPopulationTable planets={planets} vehicles={vehicles} people={people} />
          <PlanetPopulationChart planets={planets}  />
        </>
      )}

      {isLoading && <LoadingScreen />}
    </>
  );
}

export default App;
