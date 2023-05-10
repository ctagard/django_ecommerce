import React, {useState, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {Button, Row, Col, ListGroup, Image, Card} from 'react-bootstrap'

import Message from "../components/Message";
import Loader from "../components/Loader";
import {getOrderDetails, payOrder, deliverOrder} from "../actions/orderActions";
import {PayPalScriptProvider, PayPalButtons} from "@paypal/react-paypal-js";
import {useDispatch, useSelector} from 'react-redux'
import {ORDER_PAY_RESET, ORDER_DELIVER_RESET} from "../constants/orderConstants";

function OrderScreen() {
    const params = useParams()
    const orderId = params.id

    const navigate = useNavigate()

    const dispatch = useDispatch()
    const [sdkReady, setSdkReady] = useState(false)

    const debug = true

    const orderDetails = useSelector(state => state.orderDetails)
    const {order, error, loading} = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    const {loading: loadingPay, success: successPay} = orderPay

    const orderDeliver = useSelector(state => state.orderDeliver)
    const {loading: loadingDeliver, success: successDeliver} = orderDeliver

    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin

    // Calculate prices
    if (!loading && !error) {
        order.itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    }

    //Ae7Z-8UivHVjDtiwqfIX7hcEGXHKlWwMA4wYr-TNjSkKezpW2gpuOPcJmirTuu-qZexFvGbVl_TYs3Iw


    useEffect(() => {
        if (!userInfo) {
            navigate('/login')
        }

        if (!order || successPay || order._id !== Number(orderId) || successDeliver) {
            dispatch({type: ORDER_PAY_RESET})
            dispatch({type: ORDER_DELIVER_RESET})

            dispatch(getOrderDetails(orderId))
        } else if (!order.isPaid) {
            if (!window.paypal) {
                setSdkReady(false)
            } else {
                setSdkReady(true)
            }
        }

    }, [dispatch, order, orderId, successPay, successDeliver, userInfo, navigate])


    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(orderId, paymentResult))
    }

    const deliverHandler = () => {
        dispatch(deliverOrder(order))
    }


    return loading ? (
        <Loader/>
    ) : error ? (
        <Message variant={'danger'}>{error}</Message>
    ) : (
        <div>
            <h1>Order {order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant={'flush'}>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p><strong>Name: </strong> {order.user.name} </p>
                            <p><strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                            <p>
                                <strong>Shipping: </strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city}
                                {' '}
                                {order.shippingAddress.postalCode},
                                {' '}
                                {order.shippingAddress.country}
                            </p>
                            {order.isDelivered ? (
                                <Message variant={'success'}>Delivered on {order.deliveredAt}</Message>
                            ) : (
                                <Message variant={'warning'}>Not Delivered</Message>
                            )}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong>
                                {order.paymentMethod}
                            </p>

                            {order.isPaid ? (
                                <Message variant={'success'}>Paid on {order.paidAt}</Message>
                            ) : (
                                <Message variant={'warning'}>Not Paid</Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {order.orderItems.length === 0 ? <Message variant={'info'}>Your order is empty
                            </Message> : (
                                <ListGroup variant={'flush'}>
                                    {order.orderItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={item.image} alt={item.name} fluid rounded/>
                                                </Col>
                                                <Col>
                                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}


                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant={'flush'}>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>

                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items:</Col>
                                    <Col>${order.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col>${order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax:</Col>
                                    <Col>${order.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>${order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            {(!order.isPaid && !debug) ? (
                                <ListGroup.Item>
                                    <PayPalScriptProvider
                                        options={{"client-id": "AUecS9NYkOy8YJioLJL3V__EAaZI0R2jNUXcYCnmXrpdnB-fkVuBxqY73A92NzrJ6Mf2aoymr5bBqaMm"}}
                                    >
                                        <PayPalButtons
                                            style={{layout: "vertical"}}
                                            disabled={false}
                                            createOrder={(data, actions) => {
                                                return actions.order.create({
                                                    purchase_units: [{
                                                        amount: {
                                                            value: order.totalPrice
                                                        }
                                                    }]
                                                })
                                            }}
                                            onApprove={(data, actions) => {
                                                return actions.order.capture().then(function (details) {
                                                    successPaymentHandler(details)
                                                })
                                            }}
                                        />
                                    </PayPalScriptProvider>
                                < /ListGroup.Item>
                            ) : (
                                <ListGroup.Item>
                                    Paypal buttons go here - but this isn't a real business!
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                        {loadingDeliver && <Loader/>}
                        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                            <ListGroup.Item>
                               <Button
                                type={'button'}
                                className={'btn btn-block'}
                                onClick={deliverHandler}
                               >
                                   Mark as Delivered
                               </Button>
                            </ListGroup.Item>
                            )}
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default OrderScreen
