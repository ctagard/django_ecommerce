import React, {useState, useEffect} from 'react'
import {Card, Row, Col, Form, Button} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import {listProductDetails} from '../actions/productActions'
import {addToCart} from '../actions/cartActions'
import Rating from './Rating'
import {Link} from 'react-router-dom'

function Product({product}) {

    const dispatch = useDispatch()

    const productDetails = useSelector(state => state.productDetails)
    const {loading, error, productDetailsFromState} = productDetails

    const [qty, setQty] = useState(1)
    const [buttonClicked, setButtonClicked] = useState(false);



    useEffect(() => {
         if (buttonClicked) {
            const timer = setTimeout(() => {
                setButtonClicked(false);
            }, 500); // Animation duration in milliseconds

            return () => {
                clearTimeout(timer);
            };
        }
        dispatch(listProductDetails(product._id))
    }, [buttonClicked, dispatch, product._id])

    const addToCartHandler = () => {
        setButtonClicked(true)
        dispatch(addToCart(product._id, qty))
    }

    return (
        <Card className="my-3 p-3 rounded">
            <Link to={`/product/${product._id}`}>
                <Card.Img src={product.image}/>
            </Link>
            <Card.Body className={"d-flex flex-column"}>
                <Link to={`/product/${product._id}`}>
                    <Card.Title as="div" className={"card-title"}>
                        <strong>{product.name}</strong>
                    </Card.Title>
                </Link>
                <Card.Text as='div'>
                    <div className="my-3">
                        <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'}/>
                    </div>
                </Card.Text>
                <Row className={'align-items-center'}>
                    <Col>
                        <Card.Text as='h3'>
                            ${product.price}
                        </Card.Text>
                    </Col>
                    {product.countInStock === 0 ? (
                        <Col xs={6} md={6} lg={7} className="ml-auto out-of-stock">
                            <span className="text-danger">Out of Stock</span>
                        </Col>
                    ) : (
                        <Col xl={8} lg={7} xs={6} md={6} className="ml-auto">
                            <Row>
                                <Col className={"qty-box"}>
                                    <Form.Control
                                        as={'select'}
                                        value={qty}
                                        onChange={(e) => setQty(e.target.value)}
                                    >
                                        {
                                            [...Array(product.countInStock).keys()].map((x) => (
                                                <option key={x + 1} value={x + 1}>
                                                    {x + 1}
                                                </option>
                                            ))
                                        }

                                    </Form.Control>
                                </Col>
                                <Col className={"cart-button"}>
                                    <Button
                                        onClick={addToCartHandler}
                                        className={`btn-block ${buttonClicked ? 'animate' : ''}`}
                                        type={'button'}
                                        disabled={product.countInStock === 0}>
                                        <i className="fas fa-shopping-cart"></i>
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    )}


                </Row>
            </Card.Body>
        </Card>
    )
}

export default Product
