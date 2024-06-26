import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import ItemList from './ItemList'

import db from '../services/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'

function ItemListContainer () {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { categoryId } = useParams()

  useEffect(() => {
    setLoading(true)

    let q
    if (!categoryId) {
      q = query(collection(db, 'items'))
    } else {
      q = query(collection(db, 'items'), where('categoryId', '==', categoryId))
    }

    getDocs(q)
      .then((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        return data
      })
      .then((data) => {
        setProducts(data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [categoryId])

  return (
    <>
      {loading
        ? <h1 className='text-center m-5'>Loading...</h1>
        : <ItemList products={products} />}
    </>
  )
}

export default ItemListContainer
