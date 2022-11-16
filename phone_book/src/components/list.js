import { useState } from 'react'
import axios from 'axios'
import entries from '../services/entries'
import App from '../App'


const DeleteButton = ({person, deleteEntry}) => {
    // const handleClick = () => {
    //     deleteEntry(person.id)
    // }
    return (
        <button key={person.id} onClick={() => deleteEntry(person.id)}>Delete</button>
    )
}

const List = ({persons, filter, deleteEntry}) => {
    return (
        <div>
            <ul>
                {filter === ''
                    ? persons.map(person => <li key={person.name}>👨‍🦱 {person.name} – 📱 Phone: {person.phone} <DeleteButton person={person} deleteEntry={deleteEntry}/></li>)
                    : persons.filter(person => person.name.toLowerCase() === filter).map(person => <li key={person.name}>👨‍🦱 {person.name} – 📱 Phone: {person.phone}</li>)
                }
            </ul>
        </div>

    )
}
export default List