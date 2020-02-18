import React from 'react'
import "@/assets/js/svg"

function GIcon(props) {
  const {icon, color, width} = props
  const style = {
    fill: color, 
    width: width?width: '1em',
    height: width?width: '1em',
    verticalAlign: '-0.15em'
  }
  return (
    <svg aria-hidden="true" style={style}>
      <use xlinkHref={`#${icon}`}></use>
    </svg>
  )
}
export default GIcon