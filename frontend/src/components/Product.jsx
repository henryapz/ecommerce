import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import { useDispatch } from "react-redux"

function Product({ product }) {
  const dispatch = useDispatch()

  function addToCart(product) {
    dispatch({ type: "ADD_TO_CART", payload: product })
  }
  const style = {
    maxHeight: "140px",
    maxWidth: "140px",
    width: "auto",
    height: "auto",
    alignSelf: "center",
  }
  return (
    <Col xs={6} className="mb-3">
      <Card style={{ height: "100%" }}>
        <Card.Img variant="top" src={product.image} style={style} />
        <Card.Body>
          <Card.Title>{product.name}</Card.Title>
          <Card.Text>{product.description}</Card.Text>
          <div className="d-flex justify-content-between align-items-center">
            ${product.price}
            <Button variant="primary" onClick={() => addToCart(product)}>
              Add To Cart
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default Product
