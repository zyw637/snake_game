import React, { memo } from 'react';
import { BrowserRouter } from "react-router-dom";
import Snake from './snake';


export default memo(function App() {

  return (
    <div className="wrap-v1">
      <BrowserRouter>
        <Snake />
      </BrowserRouter>
    </div>

  )
})