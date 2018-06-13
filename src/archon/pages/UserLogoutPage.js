import React from 'react';
import Radium from 'radium';

import MDL from '../components/MdlComponents';
import NoticeInforCard from '../components/NoticeInforCard';
import Cookie from '../models/Cookie';
import {ACCESS_TOKEN_COOKIE} from '../models/apis/Types';

let UserLogoutPage = React.createClass({

  componentDidMount() {
    Cookie.del(ACCESS_TOKEN_COOKIE);
  },

  render() {
    return (
      <MDL.Grid>
        <MDL.GridCell col={8}>
          <NoticeInforCard title='成功退出' message='您已经成功退出，点击导航栏应用可以重新登录～' />
        </MDL.GridCell>
        
        <MDL.GridCell col={4}>
          <NoticeInforCard title='系统公告' 
            buttons={[
              { title: '我要投诉', onClick: (evt) => { alert('拒绝投诉'); } },
            ]}
            noticeType='info'
            message='LAIN 系统组从今日开始放假两周，没有安排同学值班，望大家周知。' />
        </MDL.GridCell>
      </MDL.Grid>
    );  
  },

});

export default Radium(UserLogoutPage);
