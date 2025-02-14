import React from 'react'
import {Hero} from "./Hero"
import { About } from '../Page/About'
import { Services } from './Services'
import { Counter } from '../Page/Counter'
import { Portfolio } from '../Page/Portfolio'
import { Blog } from '../Page/Blog/Blog'



export const Home = () => {
  return (
    <>
      <Hero/>
      <About/>
      <Services/>
      <Counter/>
      <Portfolio/>
      <Blog/>
      

    </>
  )
  
}
