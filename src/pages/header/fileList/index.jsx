import React, { useState } from 'react'
import './index.less'
import FileItemStatic from './fileItemStatic'

function FileList() {
  let [activeIndex, setActiveIndex] = useState(0)
  const headerList = ['课件库','媒体库']

  return (
    <div className="file-list">
      <header className="file-list-header">
        {
          headerList.map((item, i)=>
            <div key={item}
              onClick={()=>setActiveIndex(i)}
              className={i === activeIndex ? 'active': ''}
            >
              <span>{item}</span>
            </div>
          )
        }
      </header>
      <main className="file-list-main">
        {
          activeIndex === 0 ? 
          <FileItemStatic></FileItemStatic>: ''
        }
        
        {/* <file-item v-show="activeIndex == 1"></file-item>  */}
      
      </main>
    </div>
  )
}

export default FileList