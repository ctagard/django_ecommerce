import React, {useEffect, useState} from 'react';
import OrdersAreaChart from "../../components/OrdersAreaChart";
import {Row, Col, Form} from "react-bootstrap";
import {useSelector, useDispatch} from "react-redux";
import {listOrders} from '../../actions/orderActions'
import {useNavigate} from 'react-router-dom'

const AdminPage = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const orderList = useSelector(state => state.orderList)
    const {loading, error, orders} = orderList
    console.log(orders)

    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(listOrders())
        } else {
            console.log("NOT ADMIN")
            navigate('/login')
        }
    }, [dispatch, navigate, userInfo])


    return (
        <div>
            <Row>
                <Col md={9}>
                    <h2>Orders Over Time</h2>
                    <Form.Group className="d-flex align-items-center mb-3">
                        <Form.Label htmlFor="startDate" className="mr-3 mb-3">
                            Start
                        </Form.Label>
                        <Form.Control
                            id="startDate"
                            size="sm"
                            type="date"
                            className="mr-3 mb-3"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <Form.Label htmlFor="endDate" className="mr-3 mb-3">
                            End
                        </Form.Label>
                        <Form.Control
                            id="endDate"
                            size="sm"
                            type="date"
                            className="mr-3 mb-3"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </Form.Group>
                    <OrdersAreaChart orders={orders} startDate={startDate} endDate={endDate}/>
                </Col>
            </Row>
        </div>
    )
}

export default AdminPage
