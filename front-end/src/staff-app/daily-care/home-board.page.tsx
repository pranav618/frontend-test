import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { ItemType } from '../components/roll-state/roll-state-list.component'
import { RolllStateType } from "shared/models/roll"
import { Toolbar, S, ToolbarAction } from './header-toolbar.page'
export interface Attendance {
  present: Person[];
  late: Person[];
  absent: Person[];
}
export const userAttendace: Attendance = {
  present: [],
  late: [],
  absent: [],
}



const initialRollStateFilter = "unmark" as RolllStateType

export type SortAction = "sortByNameInAscOrder" | "sortByNameInDesInOrder" | "unOrdered"
export type SortByNameAction = "First Name" | "Last Name" | "Sort By"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [filterData, setFilterData] = useState(data)
  const [isFilter, setIsFilter] = useState(false)
  const [filterRollState, setRollState] = useState(initialRollStateFilter)
  const [searchValue, setSearchValue] = useState([])
  const [isSearch, setIsSearch] = useState(false)
  const [typeOfSort, setTypeOfSort] = useState("unOrdered" as SortAction)
  const [sortByName, setSortByName] = useState("Sort By" as SortByNameAction)


  const [attendance, setAttendance] = useState(userAttendace)

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  const updateAttendace = (value: Attendance) => {
    setAttendance(value)
  }

  const onChange = (e: SortByNameAction) => {
    setSortByName(e)
  }


  const searchStudent = (value: any) => {
    !isSearch && setIsSearch(true)
    setSearchValue(value)
    const newData = {
      ...filterData,
      students: [...value]
    }
    // isFilter && setFilterData(newData)
  }

  const onRollStateClick = (value: ItemType) => {
    isSearch && setIsSearch(false)
    if (value === "present") {
      const newData = {
        ...data,
        students: userAttendace.present
      }

      setFilterData(newData)
      setIsFilter(true)
      setRollState("present")
    }
    if (value === "absent") {
      const newData = {
        ...data,
        students: userAttendace.absent
      }
      setFilterData(newData)
      setIsFilter(true)
      setRollState("absent")
    }
    if (value === "late") {
      const newData = {
        ...data,
        students: userAttendace.late
      }
      setFilterData(newData)
      setIsFilter(true)
      setRollState("late")
    }

    if (value === "all") {
      setFilterData(data)
      setIsFilter(false)
    }
  }

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }

  return (
    <>{console.log("********attt", filterData, data, searchValue)}
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} data={isFilter ? filterData : data} searchStudent={searchStudent} typeOfSort={typeOfSort} setTypeOfSort={setTypeOfSort} sortByName={sortByName} setSortByName={setSortByName} />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && isFilter && !isSearch && filterData?.students && (
          <>
            {filterData.students.map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} updateAttendace={updateAttendace} isFilter={isFilter} filterRollState={filterRollState} />
            ))}
          </>
        )}

        {loadState === "loaded" && !isFilter && !isSearch && data?.students && (
          <>
            {data.students.map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} updateAttendace={updateAttendace} isFilter={!isFilter} filterRollState={initialRollStateFilter} />
            ))}
          </>
        )}

        {loadState === "loaded" && !isFilter && isSearch && searchValue && (
          <>
            {searchValue.map((s: any) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} updateAttendace={updateAttendace} isFilter={!isFilter} filterRollState={initialRollStateFilter} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} userAttendace={userAttendace} onRollStateClick={onRollStateClick} />
    </>
  )
}
