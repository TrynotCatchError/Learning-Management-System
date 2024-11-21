'use client'
import React from 'react'

const FetchDataBtn = () => {
 
 
 
 
      const FetchDataApi = async () => {
            axios.post(`/api/courses/${courseId}/checkout`,);
            console.log("Send Data Already!")
           }
        
 
 
      return (
         <Button 
            onClick={() =>{}}
            className={cn(
            "w-20 h-10 mr-2 flex items-center justify-center align-middle"
          )}>
           Purchase!
          </Button>
  )
}

export default FetchDataBtn