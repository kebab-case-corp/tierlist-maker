import React from 'react'
import { tierlists } from '@/app/lib/data'

function UnratedBox() {
  return (
    <div>{tierlists[0].unratedItems.map(unratedItem => <img src={unratedItem.image}></img>)}</div>
  )
}

export default UnratedBox