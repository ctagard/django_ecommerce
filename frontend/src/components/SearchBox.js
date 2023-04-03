import React, {useState, useEffect} from 'react'
import { Button, Form } from 'react-bootstrap'

import { useNavigate, useLocation} from 'react-router-dom'

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

function SearchBox() {

    const [keyword, setKeyword] = useState('')
    let navigate = useNavigate()
    let location = useLocation()

    let q = useQuery().get("keyword")
    q = q ? q : ''

    useEffect(() => {
        setKeyword(q)
    }, [q])

    const submitHandler = (e) => {
        e.preventDefault()
        if (keyword.trim()) {
            navigate(`/?keyword=${keyword}&page=1`)
        } else {
            navigate(location.pathname)
        }

    }
    return (
        <Form onSubmit={submitHandler} inline>
            <Form.Control
                type='text'
                name='q'
                onChange={(e) => setKeyword(e.target.value)}
                className='mr-sm-2 ml-sm-5'

            >
            </Form.Control>
            <Button
                type='submit'
                variant='outline-success'
                className='p-2 mx-md-1'
            >
                Submit
            </Button>
        </Form>
    )
}

export default SearchBox
