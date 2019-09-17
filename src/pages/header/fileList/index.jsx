import React, { useState, useEffect } from 'react'
import './index.less'
import FileItemStatic from './fileItemStatic'
import FileItemMedia from './fileItemMedia'
import http from '@/utils/request'

function FileList(props) {
  let [activeIndex, setActiveIndex] = useState(0)
  let [fileList, setFileList] = useState(0)
  const headerList = ['课件库','媒体库']
  
  useEffect(()=>{
    console.log('this.props.roomInfo',props.roomInfo)
    const { id: roomId, userInfo: { id:userId, role}} = props.roomInfo
    if(role!== 1)return
    const params ={roomId, userId}
    http.get('getCourseware',params).then(res=>{
      setFileList(res.data)
    })
  },[])

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
          activeIndex === 0 && fileList.ordinary ? 
          <FileItemStatic fileList={fileList.ordinary}></FileItemStatic>:null
        }
        {
          activeIndex === 1 && fileList.media ? 
          <FileItemMedia fileList={fileList.media}></FileItemMedia>:  null
        }
        
        {/* <FileItemMedia v-show="activeIndex == 1"></FileItemMedia>  */}
      
      </main>
    </div>
  )
}

export default FileList