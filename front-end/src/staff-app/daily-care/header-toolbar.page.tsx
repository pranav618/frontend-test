
import React, { useState } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { SortAction, SortByNameAction } from './home-board.page'
import { DropdownButton, Dropdown } from 'react-bootstrap'
import "./header.css"
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';


export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            width: 130,
            color: "white"
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }),
);



export type ToolbarAction = "roll" | "sort"


interface ToolbarProps {
    onItemClick: (action: ToolbarAction, value?: string) => void
    data: any
    searchStudent: any
    setTypeOfSort: (action: SortAction, value?: string) => void
    typeOfSort: SortAction
    setSortByName: (action: SortByNameAction, value?: string) => void
    sortByName: SortByNameAction
}

export const Toolbar: React.FC<ToolbarProps> = (props) => {
    const classes = useStyles();
    const { onItemClick, data, searchStudent, typeOfSort, setTypeOfSort, sortByName, setSortByName } = props
    const [searchTerm, setSearchTerm] = useState("")

    const editSearch = (e: any) => {
        setSearchTerm(e.target.value)
    }

    const search = () => {
        return data.students.filter((student: any) =>
            (student.first_name + " " + student.last_name).toLowerCase().trim().includes(searchTerm.toLowerCase())
        )
    }

    const debounceSearch = (fn: any, t: any) => {
        let timer: ReturnType<typeof setTimeout>;
        return function (this: any, ...args: any) {
            clearTimeout(timer);
            timer = setTimeout(() => searchStudent(search.apply(this, args)), t)
        }
    }

    const sortByNameInAscOrder = (value: any) => {
        value.students.sort((a: any, b: any) => (a.first_name + a.last_name).toLowerCase().localeCompare((b.first_name + b.last_name).toLowerCase()))
        setTypeOfSort('sortByNameInAscOrder')
        sortByName !== "Sort By" && setSortByName("Sort By" as SortByNameAction)
    }
    const sortByNameInDesInOrder = (value: any) => {
        value.students.sort((a: any, b: any) => (b.first_name + b.last_name).toLowerCase().localeCompare((a.first_name + a.last_name).toLowerCase()))
        setTypeOfSort('sortByNameInDesInOrder')
        sortByName !== "Sort By" && setSortByName("Sort By" as SortByNameAction)
    }
    const sortByFirstName = (value: any) => {
        value.students.sort((a: any, b: any) => (a.first_name).toLowerCase().localeCompare((b.first_name).toLowerCase()))
        setSortByName("First Name" as SortByNameAction)
        typeOfSort !== "unOrdered" && setTypeOfSort("unOrdered" as SortAction)
    }
    const sortByLastName = (value: any) => {
        value.students.sort((a: any, b: any) => (a.last_name).toLowerCase().localeCompare((b.last_name).toLowerCase()))
        setSortByName("Last Name" as SortByNameAction)
        typeOfSort !== "unOrdered" && setTypeOfSort("unOrdered" as SortAction)
    }

    const betterSearch = debounceSearch(search, 300)

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSortByName(event.target.value as SortByNameAction);
    };

    return (
        <S.ToolbarContainer>
            <S.ToolbarSubContainer>
                {typeOfSort === 'unOrdered' && <S.Button onClick={() => sortByNameInAscOrder(data)}> Name
      </S.Button>
                }
                {typeOfSort === 'sortByNameInAscOrder' && <S.Button onClick={() => sortByNameInDesInOrder(data)}> Name
      <S.Image src={require("../../assets/images/up-arrow.png")} />
                </S.Button>
                }
                {typeOfSort === 'sortByNameInDesInOrder' && <S.Button onClick={() => sortByNameInAscOrder(data)}> Name
      <S.Image src={require("../../assets/images/down-arrow.png")} />
                </S.Button>
                }
                <DropdownButton
                    title={sortByName}
                    // menuAlign={ 'xl'= "right"}
                    bsPrefix="drop-down-menu"
                    style={{ flexDirection: 'column' }}

                >


                    {/* <Dropdown.Item bsPrefix="drop-down-item" onClick={() => sortByFirstName(data)} as="button" eventKey="1">First Name </Dropdown.Item>
                    <Dropdown.Item bsPrefix="drop-down-item" onClick={() => sortByLastName(data)} as="button" eventKey="2">Last Name </Dropdown.Item> */}
                    <MenuItem id="1" onClick={() => sortByFirstName(data)} style={{ color: 'white', backgroundColor: '#343f64' }}>First Name </MenuItem>
                    <MenuItem id="2" onClick={() => sortByLastName(data)} style={{ color: 'white', backgroundColor: '#343f64' }}>Last Name </MenuItem>


                </DropdownButton>
            </S.ToolbarSubContainer>
            <input type='text' value={searchTerm} onChange={editSearch} onKeyUp={betterSearch} placeholder="Search" />
            <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
        </S.ToolbarContainer>
    )
}

export const S = {
    PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
    ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
    ToolbarSubContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items:center
   
  `,
    Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
    Image: styled.img`
    height: 14px;
    width: 14px;
    margin-left: 3px;
    color:"#000";
`
}