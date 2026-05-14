import React from 'react'
import './Gearup.css'
const Gearup = () => {
  return (
    <>
      <div className='gear_up_wrapper' style={{
        backgroundImage: `url('/Group 237774.png')`
      }}>

        <div className='gear_up_text_wrapper'>
          <h2>Gear Up. Race Hard.</h2>
          <h4>Built for endurance, strength & every obstacle ahead.</h4>
        </div>
        <div className='gear_up_image_wrapper'>
          <div className='gear_up_image_div'>
            <img src='/Group 237773.png' />
            <div className='shop_now_circle'>
              <h2>Shop Now</h2>
            </div>
          </div>
          <div className='gear_up_image_text'>
            <img src='/unstoppable.png' />
          </div>
        </div>
      </div>
    </>
  )
}

export default Gearup
