import axios from "axios"

const baseUrl = '/api/persons'

const getEntries = () => {
    console.log('fetching entries...')
    const request = axios
        .get(baseUrl)
        .then((response) => response.data)
    return request
}

const addEntry = (newObject) => {
    console.log(`entry added with name: ${newObject.name} and phone ${newObject.phone}`)
    const request = axios
        .post(baseUrl, newObject)
        // .catch(error => console.log(error.response.data.error))

    return request.then(response => response.data)
}

const deleteEntry = (id) => {
    console.log(`delete entry for person with id ${id}`)
    const requestUrl = `${baseUrl}/${id}`
    const request = axios.delete(requestUrl)
    return request
}

const updateEntry = (id, person) => {
console.log('updateEntry', person)
    console.log(`updating entry for ${id}`)
    const requestUrl = `${baseUrl}/${id}`
    const request = axios.put(requestUrl, person)
    return request
}

export default {
    getEntries,
    addEntry: addEntry,
    deleteEntry,
    updateEntry,
}