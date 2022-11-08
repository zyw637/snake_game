// @ts-nocheck

import { Button, Modal } from 'antd';
import React, { memo, useEffect, useState } from 'react';
import styled from "styled-components";
import $ from 'jquery';
import _ from 'lodash';
import { useInterval } from '../hooks/useSetInterval'



export default memo(function Snake() {
  const initSnake = [[20, 20], [20, 40], [20, 60], [20, 80]]

  const [mapSize, setMapSize] = useState(600) //map size
  const [snakeArr, setSnakeArr] = useState(initSnake) // snake's body
  const [dir, setDir] = useState("LEFT") // snake moving direction 
  const [speed, setSpeed] = useState(null);

  const [foodP, setFoodP] = useState([])

  useEffect(() => {
    food();
  }, [])

  useEffect(() => {
    snake();
  }, [snakeArr])


  //snake in map
  const snake = () => {
    $(".snake").remove();
    for (let i in snakeArr) {
      const s = snakeArr[i]
      $("#map").append($("<div class='snake'></div>").css('top', s[0]).css('left', s[1]));
    }
  }

  //food in map
  //set food position
  const food = () => {
    $(".food").remove();
    let foodArr = getFoodArr()
    setFoodP(foodArr)
    let food = $("<div class='food'></div>").css('top', foodArr[0]).css('left', foodArr[1]);
    $("#map").append(food);
  }

  //得到食物的位置
  const getFoodArr = () => {
    let foodArr = [RandomNumBoth(), RandomNumBoth()]
    //判断是否 有覆盖问题 ？
    for (let s of snakeArr) {
      if (s.toString() === foodArr.toString()) {
        return getFoodArr()
      }
    }
    return foodArr
  }

  //基本随机数 
  const RandomNumBoth = () => {
    var num = Math.floor(Math.random() * (mapSize / 20));
    return num * 20;
  }

  document.onkeydown = function () {
    var code;
    if (window.event) {
      code = window.event.keyCode;
    }
    setTimeout(() => { snake_dir(code); }, 200)
  };

  const snake_dir = (code) => {
    switch (code) {
      case 37:
        if (dir !== 'LEFT') {
          setDir("RIGHT")
        }
        break;
      case 38:
        if (dir !== 'UP') {
          setDir("DOWN")
        }
        break;
      case 39:
        if (dir !== 'RIGHT') {
          setDir("LEFT")
        }
        break;
      case 40:
        if (dir !== 'DOWN') {
          setDir("UP")
        }
        break;
    }

    if (!speed) {
      setSpeed(500)
    }

  }


  useInterval(() => {
    let oldArr = _.cloneDeep(snakeArr)

    const head = oldArr[oldArr.length - 1]

    if (dir === "LEFT") {
      checkMove([head[0], head[1] + 20], oldArr)
      oldArr.push([head[0], head[1] + 20])
    }

    if (dir === "UP") {
      checkMove([head[0] + 20, head[1]], oldArr)
      oldArr.push([head[0] + 20, head[1]])
    }

    if (dir === "RIGHT") {
      checkMove([head[0], head[1] - 20], oldArr)
      oldArr.push([head[0], head[1] - 20])
    }

    if (dir === "DOWN") {
      checkMove([head[0] - 20, head[1]], oldArr)
      oldArr.push([head[0] - 20, head[1]])
    }

    for (let s of snakeArr) {
      if (s.toString() === foodP.toString()) {
        setSnakeArr(oldArr)
        food()
        return
      }
    }

    const end = oldArr.shift()
    setSnakeArr(oldArr)
  }, speed)

  function checkMove(newP, oldArr) {
    const x = newP[0]
    const y = newP[1]
    if (x < 0 || y < 0 || x > mapSize || y > mapSize) {
      Modal.confirm({
        centered: true,
        content: "Game Over!!!",
        onOk: () => {
          setSnakeArr(initSnake)
          food()
        },
        onCancel: () => {
          setSnakeArr(initSnake)
          food()
        },
        okText: "restart",
      })
      setSpeed(null)
      return
    }
    for (let s of oldArr) {
      if (s.toString() === newP.toString()) {
        Modal.confirm({
          centered: true,
          content: "You eat yourself!!!!",
          onOk: () => {
            setSnakeArr(initSnake)
            food()
          },
          onCancel: () => {
            setSnakeArr(initSnake)
            food()
          },
          okText: "restart",
        })
        setSpeed(null)
        return
      }
    }
  }

  const setSize = (size) => {
    switch (size) {
      case "s":
        setMapSize(400);
        break;
      case "m":
        setMapSize(600);
        break;
      case "l":
        setMapSize(800);
        break;
      default:
        setMapSize(600);
        break;
    }
    setSpeed(null);
    setSnakeArr(initSnake);
    food();
  }

  return (
    <SnakeWrapper mapSize={mapSize} >

      <div className='btn'>
        <Button onClick={() => { setSpeed(500) }}>default</Button>
        <Button onClick={() => { setSpeed(600) }}>减速</Button>
        <Button onClick={() => { setSpeed(350) }}>加速</Button>
      </div>
      <div className='btn'>
        <Button onClick={() => { setSpeed(null) }}>stop</Button>
        <Button onClick={() => { setSpeed(500) }}>go on</Button>
      </div>
      <div className='btn'>
        <Button onClick={() => { setSize('s') }}>小</Button>
        <Button onClick={() => { setSize('m') }}>中</Button>
        <Button onClick={() => { setSize('l') }}>大</Button>
      </div>

      <div className='btn'>
        {`分数: ${snakeArr.length - 4}`}
      </div>




      <div className="map" id={"map"} >
      </div>
    </SnakeWrapper>
  )
})



const SnakeWrapper = styled.div`
  .btn {
    margin: 10px auto;
    width: 200px;
    display:flex;
    justify-content: space-evenly;
    
  }


  .map{
    border: 1px solid #f13933;
    background-color: #EEEEEE;
    border-radius: 15px;
    position: relative;
    margin: 0 auto;
    height: ${props => props.mapSize}px;
    width: ${props => props.mapSize}px;
  }

  .food {
    width: 20px;
    height: 20px;
    background-color: red;
    position: absolute;
  }
  .snake {
    width: 20px;
    height: 20px;
    background-color: green;
    position: absolute;
  }

  .st {
    width: 20px;
    height: 20px;
    position: absolute;
    background-color: green;

  }
`