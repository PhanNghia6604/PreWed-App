import React from 'react'
import {Hero} from "./Hero"
import { About } from '../Page/About'
import { Services } from './Services'
import { Counter } from '../Page/Counter'

export const Home = () => {
  return (
    <>
      <Hero/>
      <About/>
      <Services/>
      <Counter/>
    </>
  )
  
}
