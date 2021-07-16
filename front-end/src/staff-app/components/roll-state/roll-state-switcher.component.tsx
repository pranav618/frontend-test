import React, { useState } from "react"
import { RolllStateType } from "shared/models/roll"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"
import { Attendance, userAttendace } from "../../daily-care/home-board.page"
import { Person } from "shared/models/person"
interface Props {
  initialState?: RolllStateType
  size?: number
  onStateChange?: (newState: RolllStateType) => void
  updateAttendace?: (value: Attendance) => void
  student: Person
  isFilter?: boolean
  filterRollState: RolllStateType
}
export const RollStateSwitcher: React.FC<Props> = ({ initialState = "unmark", size = 40, onStateChange, updateAttendace, student, isFilter, filterRollState }) => {
  const [rollState, setRollState] = useState(isFilter ? filterRollState : initialState)

  const nextState = () => {
    const states: RolllStateType[] = ["present", "late", "absent"]
    if (rollState === "unmark" || rollState === "absent") return states[0]
    const matchingIndex = states.findIndex((s) => s === rollState)
    return matchingIndex > -1 ? states[matchingIndex + 1] : states[0]
  }

  const onClick = () => {
    const next = nextState()
    if (next === 'present' && updateAttendace) {
      const length = userAttendace.present.length
      if (userAttendace.absent.some(person => person === student)) {
        const index = userAttendace.absent.indexOf(student)
        userAttendace.absent.splice(index, 1)
      }
      if (userAttendace.late.some(person => person === student)) {
        const index = userAttendace.late.indexOf(student)
        userAttendace.late.splice(index, 1)
      }
      if (!userAttendace.present.some(person => person === student))
        userAttendace.present[length] = student
      const value = {
        ...userAttendace,
      }
      updateAttendace(value)
    }
    else if (next === 'absent' && updateAttendace) {
      const length = userAttendace.absent.length

      if (userAttendace.present.some(person => person === student)) {
        const index = userAttendace.present.indexOf(student)
        userAttendace.present.splice(index, 1)
      }
      if (userAttendace.late.some(person => person === student)) {
        const index = userAttendace.late.indexOf(student)
        userAttendace.late.splice(index, 1)
      }
      if (!userAttendace.absent.some(person => person === student))
        userAttendace.absent[length] = student
      const value = {
        ...userAttendace,
      }
      updateAttendace(value)
    }
    else if (next === 'late' && updateAttendace) {
      const length = userAttendace.late.length
      if (userAttendace.absent.some(person => person === student)) {
        const index = userAttendace.absent.indexOf(student)
        userAttendace.absent.splice(index, 1)
      }
      if (userAttendace.present.some(person => person === student)) {
        const index = userAttendace.present.indexOf(student)
        userAttendace.present.splice(index, 1)
      }
      if (!userAttendace.late.some(person => person === student))
        userAttendace.late[length] = student
      const value = {
        ...userAttendace,
      }
      updateAttendace(value)
    }

    setRollState(next)
    if (onStateChange) {
      onStateChange(next)
    }
  }

  return <RollStateIcon type={rollState} size={size} onClick={onClick} />
}
