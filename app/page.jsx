'use client'
import SideBarFull from '../app/dashboard/page'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { LoginForm } from '../@/components/login-form';
export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async () => {
    router.push('/signin')
  }

  return (
    <div className="">
      
       <div className='w-full h-[100vh] relative'  >  
           <SideBarFull/>
            <div className=" items-center justify-center h-[100vh] flex ">
               <div className="">
                <LoginForm />
                </div>
            </div>
         </div>
         </div>
        
     
   
  )
}