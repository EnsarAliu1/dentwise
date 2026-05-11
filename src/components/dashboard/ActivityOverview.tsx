import React from 'react'
import DentalHealthOverview from './DentalHealthOverview'
import NextAppointmene from './NextAppointmene'

function ActivityOverview() {
  return (
      <div className='grid lg:grid-cols-3 gap-6'>
          <DentalHealthOverview />
          <NextAppointmene/>
    </div>
  )
}

export default ActivityOverview