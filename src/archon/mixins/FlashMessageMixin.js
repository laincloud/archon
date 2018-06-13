import React from 'react';
import NoticeInforCard from '../components/NoticeInforCard';

let FlashMessageMixin = {
  
  renderFlash(flash, action) {
    if (!flash) {
      return null;
    }     
    const closeCard = (evt) => this.props.dispatch(action);
    return (
      <NoticeInforCard title='操作提示' 
        titleIcon='local_bar'
        noticeType='success'
        buttons={[
          { title: '关闭', onClick: closeCard, color: 'accent' },
        ]}
        menuIcon={{ icon: 'close', onClick: closeCard }}
        message={flash}/>
    );
  },

};

export default FlashMessageMixin;
