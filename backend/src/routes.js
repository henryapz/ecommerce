import express from "express"
import mongoose from "mongoose"
import Product from "./models/product.js"
import Order from "./models/order.js"
import mercadopago from "mercadopago"

const router = express.Router()

mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN,
})

router.get("/products", async (req, res, next) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (e) {
    next(e)
  }
})

router.post("/products", async (req, res, next) => {
  try {
    const { name, description, price, image } = req.body
    const product = await Product.create({ name, description, price, image })
    res.json(product)
  } catch (e) {
    next(e)
  }
})

router.post("/orders", async (req, res) => {
  const { products } = req.body
  const items = []
  for (let i = 0; i < products.length; i++) {
    const product = await Product.findById(new mongoose.Types.ObjectId(products[i])).lean()
    products[i] = product
    if (product) {
      items.push({
        title: product.name,
        quantity: 1,
        currency_id: "PEN",
        unit_price: product.price,
        picture_url: product.image,
      })
    }
  }
  const order = await Order.create({ products })
  mercadopago.preferences
    .create({
      items,
      notification_url: "https://hookbin.com/b90rzJ70Q6cKGq00yE79",
      back_urls: {
        success: "http://localhost:3000/",
        pending: "http://localhost:3000/",
        failure: "http://localhost:3000/",
      },
    })
    .then(function (response) {
      res.json({
        id: response.body.id,
        sandbox_init_point: response.body.sandbox_init_point,
        order,
      })
    })
    .catch(function (error) {
      res.json({ items })
    })
})

export default router
