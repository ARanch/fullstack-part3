import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/filter'
import InputForm from './components/inputForm'
import List from './components/list'
import entries from './services/entries'
import Overlay from './components/overlay'
//TO dos for ex 2.15-2.18
// √ add notes to a json server
// √ extract code that handles backend to separate module under /services
// √ 2.17 make it possible to delete users, 
// confirm action with window.confirm method
// use http delete request. no data is sent with request
// make it possible to change phone number of entry via PUT

const App = () => {
  useEffect(() => {
    entries.getEntries().then(response => setPersons(response))
  }, [])

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('Type new name...')
  const [newPhone, setNewPhone] = useState('Type new phone number...')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('overlayBasic')

  const overlayTimeout = 2000
  const resetOverlay = (timeout) => {
    setTimeout(() => {
      setMessage(null)
      setMessageType('overlayBasic')
    }
      , timeout)
  }
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value)
  }
  const handleFilterChange = (event) => {
    setFilter(event.target.value.toLowerCase())
  }

  const saveName = (event) => {
    event.preventDefault()
    const { duplicate, index } = checkDuplicates(persons, newName)
    console.log('persons: ', persons)
    console.log('newName: ', newName)
    console.log('duplicate, index:', duplicate, index)
    if (duplicate !== false) {
      console.log('Duplicate entry found: ', newName)
      if (window.confirm(`Add new phone number to ${newName}?`)) {
        const updatedEntry = {
          name: newName,
          phone: newPhone,
          id: index
        }
        entries.updateEntry(index, updatedEntry).catch(error => {
          setMessageType('overlayError')
          setMessage(`Information on ${newName} has already been removed from server!`)
        }) //inserts new phone number at index corresponding to duplicate
        const newPersons = persons.map(person =>
          person.name === newName
            ? updatedEntry
            : person
        )
        //   console.log('person:',persons)
        //   console.log('newPersons:',newPersons)
        setPersons(newPersons)
        setMessageType('overlaySuccess')
        setMessage(`Updated phonenumber for ${newName}`)
        resetOverlay(overlayTimeout)
        // } // using string template

      }
    } else {
      console.log(`Adding ${newName} and ${newPhone}`)
      setPersons(persons.concat({ name: newName, phone: newPhone }))
      entries.addEntry({
        name: newName,
        phone: newPhone
      }).then(() => {
        entries.getEntries().then(response => setPersons(response))
        setMessageType('overlaySuccess')
        setMessage(`"${newName}" added!`)
        resetOverlay(overlayTimeout)
      }
      )
    }
  }
  const deleteEntry = (id) => {
    const name = persons.find(person => person.id === id).name
    if (window.confirm(`Do you really want to delete ${name}`)) {
      entries.deleteEntry(id).then(() => {
        entries.getEntries().then(response => setPersons(response))
      }).then(() => {
        setMessageType('overlayError')
        setMessage(`"${name}" removed!`)
        resetOverlay(overlayTimeout)
      })
    } else {
      alert('Aborted')
    }
  }

  const checkDuplicates = (persons, name) => {
    // takes an array of objects 
    let duplicate = false
    let index = 0
    persons.every(person => {
      if (person.name === name) {
        index = person.id
        duplicate = true
        return false // breaks .every method
      } else {
        console.log('no diplicate found. Continue...')
        return true
      }
      duplicate ? console.log('A duplicate was found, ', name) : console.log('No duplicates found')
    }
    )
    return { duplicate, index }
  }
  // breakout into: filter, input form, and phonebook list
  return (
    <div>
      <Overlay text={message} messageType={messageType} />
      <h1>Phonebook</h1>
      <InputForm submitHandler={saveName} nameHandler={handleNameChange} phoneHandler={handlePhoneChange} />
      <h3>Numbers</h3>
      <Filter handler={handleFilterChange} />
      <List persons={persons} filter={filter} deleteEntry={deleteEntry} />
    </div>
  )
}

export default App