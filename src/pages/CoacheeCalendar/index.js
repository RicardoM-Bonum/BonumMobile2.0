import React from 'react'
import CoacheeCalendarContextWrapper from './context/CoacheeCalendarContextWrapper'
import CoacheeCalendarPage from './CoacheeCalendar'

function CoacheeCalendar() {
  return (
    <CoacheeCalendarContextWrapper>
      <CoacheeCalendarPage />
    </CoacheeCalendarContextWrapper>
  )
}

export default CoacheeCalendar
