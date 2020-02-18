import React, { useState, useEffect } from 'react'
import './index.less'
import FileItemStatic from './fileItemStatic'
import FileItemMedia from './fileItemMedia'
import http from '@/utils/request'
import { roleConifg} from '@/utils/config.js'
import {Upload, Button, Icon, message} from 'antd'


function FileList(props) {
  let [activeIndex, setActiveIndex] = useState(0)
  let [fileList, setFileList] = useState({ordinary:[],media:[],image:[]})
  let [status, setstatus] = useState(false)
  const headerList = ['课件库','媒体库']
  const { id: roomId, userInfo: { id:userId, role}} = props.roomInfo
  const imgTypeList = ['png','jpg','jpeg']
  const fileTypeList1 = ['.pdf','.ppt','.pptx','.doc','.docx',...imgTypeList]
  const fileTypeList2 = ['.mp3']
  useEffect(()=>{
    getFileList()
  },[])
  function getFileList() {
    if(role !== roleConifg.teach && role !== roleConifg.assistant)return
    const params ={roomId, userId}
    http.get('getCourseware',params).then(res=>{
      setFileList(res.data)
    })
  }

  const beforeUpload = (file) =>{
    
    const isFileType1 = fileTypeList1.find(item=>file.name.indexOf(item)>-1)
    const isFileType2 = fileTypeList2.find(item=>file.name.indexOf(item)>-1)
    if (!isFileType1&&!isFileType2) {
      message.error(`文件格式只支持${[...fileTypeList1,...fileTypeList2].join(',')}`);
      return false
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    const isLt10M = file.size / 1024 / 1024 < 10;

    if (isFileType1 &&!isLt5M) {
      message.error('课件最大支持上传5M');
      return false
    }
    if (isFileType2 &&!isLt10M) {
      message.error('媒体文件最大支持上传10M');
      return false
    }
    return true
  }

  const customRequest = (file)=> {
    if(beforeUpload(file.file)){
      const params = new FormData();
      params.append("roomId",roomId);
      params.append("userId",userId);
      params.append("files",file.file);
      const config = {
        headers: {"Content-Type": "multipart/form-data"}
      }
      setstatus(true)
      http.post('uploads',params,config).then(res=>{
        message.success('文件上传成功');
        getFileList()
        setstatus(false)
      }).catch(err=>{
        setstatus(false)
      })
    }
    console.log('file',file)
  }
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
      <div className="file-upload">
        <Upload 
          //  accept={[...fileTypeList1,...fileTypeList2].join('')}
          showUploadList={false}
          customRequest= {(file)=>{customRequest(file)}}>
          <Button loading={status}>
            <Icon type="upload" /> 上传
          </Button>
        </Upload>
      </div>
      <main className="file-list-main">
        {
          activeIndex === 0  && (fileList.ordinary || fileList.image) ? 
          <FileItemStatic fileList={[...fileList.ordinary, ...fileList.image]}></FileItemStatic>:null
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