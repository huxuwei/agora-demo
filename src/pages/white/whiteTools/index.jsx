import React,{useState} from 'react'
import {Button } from 'antd'
import GIcon from '@/components/GIcon'

export default function WhiteTools(props) {
  let [activeIndex, setActiveIndex] = useState(0)
  const list= [
    {text: 'selector',icon: 'iconxuanze' },
    {text: 'pencil',icon: 'iconpencil' },
    {text: 'rectangle',icon: 'iconrectangle' },
    {text: 'ellipse',icon: 'iconellipse' },
    {text: 'eraser',icon: 'iconeraser1' },
    {text: 'text',icon: 'icontext1' },
  ]
  function changeTool(item,i) {
    setActiveIndex(i)
    props.changeTool(item.text)
  }
  return (
    <div className="tools-wrap">
      {
        list.map((item, i) => 
          <Button size='small' type='link' key= {item.text} 
            onClick= {()=>{changeTool(item,i)}}>
            <GIcon  color= {i===activeIndex?'rgb(236, 52, 85)':''}  
              icon={item.icon}></GIcon>
          </Button>
        )
      }
    </div>
  )
}

