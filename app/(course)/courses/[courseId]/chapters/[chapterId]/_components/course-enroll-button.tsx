"use client"
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { getServerSession } from "next-auth";
import { authOptions } from "app/api/auth/[...nextauth]/route";


interface CourseEndrollButtonProps {
      price: number;
      courseId: string;
  }

export const CourseEndrollButton = async ({
      price,
      courseId
}):CourseEndrollButtonProps => {


     const  session  = await getServerSession(authOptions);
     
     const [isLoading, setIsLoading] = useState(false);
     

     const onClick = async () => {
         
          setIsLoading(true);
      
          try {
            const response = await axios.post(`/api/courses/${courseId}/checkout`,);
          //   
          } catch (error) {
            console.error("Error initiating checkout:", error);
            toast.error("An error occurred during checkout.");
          } finally {
            setIsLoading(false);
          }

     }

  
     return(
      <Button 
        >
      </Button>
     )  
    

}