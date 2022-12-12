const Filter = (props) => {
    return (
        <div>
            <form onSubmit={(event) => { event.preventDefault() }}>
                <input
                    onChange={props.handler}
                    placeholder={"Search phonebook..."} />
            </form>
        </div>
    )
}

export default Filter
