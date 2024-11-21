"use client";

import React from 'react';
import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormLabel, FormItem, FormMessage, FormDescription } from '../../../../../components/ui/form';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useSession, signOut } from 'next-auth/react';

const formSchema = z.object({
    title: z.string().min(1, {
        message: 'Title is required',
    }),
});

const CreatePage = () => {
    
    const { data: session, status } = useSession();
    const router = useRouter();

    // Redirect if not authenticated
    if (status === "unauthenticated") {
        router.push("/");
        return null;
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
        },
    });

    const { isSubmitting } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/courses", values);
            router.push(`/teacher/courses/${response.data.id}`);
            toast.success("Course Created!");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    };
   
    return (
        <div className="max-w-xl mx-auto flex md:items-center md:justify-center h-full p-6">
            <div className="text-center">
                <h1 className="text-2xl mb-2">Name your Course</h1>
                <p className="text-sm text-slate-600">
                    What would you like to name your course? Don’t worry, you can change this later.
                </p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course title</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. Advanced Coding"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        What will you teach in this course?
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Link href="/" passHref>
                                <Button type="button" className="cancelbtn">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Creating...' : 'Create Course'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>

            {/* Welcome section (optional, if relevant to display here) */}
            {session && (
                <div className="flex h-screen items-center justify-center">
                    <div className="bg-white p-6 rounded-md shadow-md">
                        <p>Welcome, <b>{session.user.name}!</b></p>
                        <p>Email: {session.user.email}</p>
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="w-full bg-blue-500 text-white py-2 rounded"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreatePage;
