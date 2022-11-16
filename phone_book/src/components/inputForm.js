import { useState } from 'react'

const InputForm = ({ submitHandler, nameHandler, phoneHandler }) => {
    return (
        <div>
            <h3>Add new</h3>
            <form onSubmit={submitHandler}>
                <div>
                    name:
                    <input
                        onChange={nameHandler}
                        placeholder='insert name here' />
                </div>
                <div>
                    Phonenumber:
                    <input
                        onChange={phoneHandler}
                        placeholder='insert phone number here' />
                </div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
        </div>
    )
}

export default InputForm