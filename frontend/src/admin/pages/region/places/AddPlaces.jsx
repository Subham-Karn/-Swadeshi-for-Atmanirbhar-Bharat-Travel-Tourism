import React from 'react'
import { useParams } from 'react-router-dom'

const AddPlaces = () => {
    const {placeId} = useParams();
  return (
    <div>{placeId ? "Edit PLace" : "Add Places"}</div>
  )
}

export default AddPlaces