import React from "react"
const Overlay = ({ text, messageType}) => {
    const messageClass = `"${messageType}"`
    return (
        <div className={messageType}>
            <div>
                {text}
            </div>
        </div>
    )
}
export default Overlay