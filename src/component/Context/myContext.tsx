import React from 'react';
interface context {
    rightOpen: boolean,
    bookList:any
}

const MyContext = React.createContext<context>({
    rightOpen:false,
    bookList:{}
})
export default MyContext