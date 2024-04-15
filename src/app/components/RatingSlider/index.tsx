import {ChangeEvent, useState} from "react"
import styles from "@/app/components/RatingSlider/index.module.css"

type RatingSliderProps = {
    name: string
    setRating: Function
    index: number
    rating: number[]
}


function RatingSlider({name, setRating, index, rating}:RatingSliderProps) {
    const [value, setValue] = useState(0)
    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        const newRating = [...rating]
        newRating[index] = parseFloat(e.target.value)
        setValue(parseFloat(e.target.value))
        setRating(newRating)
    } 
  return (
    <div className={styles.div}>
        <label htmlFor={name}>{name}</label>
        <input type="range" min="0" max="5" value={value} className="slider" id={name} step={0.25} onChange={handleChange}/>
        <output htmlFor={name}>{value}</output>
    </div>
  )
}

export default RatingSlider