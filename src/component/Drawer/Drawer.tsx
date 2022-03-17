import React, { useContext } from 'react';
import { Drawer } from 'antd';
import 'antd/dist/antd.css';
import MyContext from '../Context/myContext';

export const DrawerRight = (props: any) => {
  var { rightOpen,bookList } = useContext(MyContext)
  const { setParent } = props
  const onClose = () => {
    console.log(1);
    setParent(false);
  };
  return (
    <>
      <Drawer title="图书简介" size='large' placement="right" onClose={onClose} visible={rightOpen}>
        <p>书名:{bookList.title}</p>
        <p>类别:{bookList.catalog}</p>
        <p><img src={bookList.img} alt="" /></p>
        <p>简介:{bookList.sub2}</p>
        <p>标签:{bookList.tags}</p>
        <p>出版时间:{bookList.bytime}</p>
        {/* <p>购买链接:{bookList.online}</p> */}
      </Drawer>
    </>
  );
};

