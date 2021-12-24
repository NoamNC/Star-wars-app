import React from 'react'

const Chat = ({chartPlanets}) => {


    return (
        <div className='chart'>
        {chartPlanets?.map((planet) => (
          <div style={{minWidth: '0px'}} key={planet.name}>
            <p className='dynamic-text'>{planet.population}</p>
          <div className='lightsaber-container' >
            <div className='lightsaber'>
              <label className='handle'></label>
              <div className='switch'></div>
              <div
                style={{
                  height: `${Math.log(planet.population) * 10}px`
                }}
                className={`plasma ${planet.name}`}
              ></div>
            </div>
          </div>
            <p className='dynamic-text'>{planet.name}</p>F
          </div>
        ))}
      </div>
    
    )
}

export default Chat
