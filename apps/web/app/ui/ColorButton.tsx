import { FaCircle } from "react-icons/fa";

type prop = {
    color:string,
    setColor(color:string):void
}

const ColorButton = ({color,setColor}:prop) => {
  return (
    <div>
        <button className='color-button' onClick={()=>setColor(color)}><FaCircle color={color}/></button>
    </div>
  )
}

export default ColorButton