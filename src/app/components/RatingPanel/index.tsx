"use client"
import { useState } from "react"
import RatingSlider from "../RatingSlider"
import {data} from "@/app/lib/data"
import { tierList } from "@/app/lib/data"


function RatingPanel({}) {
    const [rating, setRating] = useState(data.ratings)
    console.log(rating)
  return (
    <div><img src={data.image} alt=""></img>
    {tierList.criterias.map((criteria, i) => <RatingSlider name={criteria.name} setRating={setRating} index={i} rating={rating} key={i} ></RatingSlider>)}
    <button>Ajouter</button>
    <p className="rating">{rating.reduce((sum, currentRate) => sum + currentRate, 0)}</p>
    </div>
  )
}

export default RatingPanel