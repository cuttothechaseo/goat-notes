"use server"

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { handleError } from "./lib/utils"
import { prisma } from "./db/prisma"

export const loginAction = async (email: string, password: string) => {
    try {
        const supabase = createRouteHandlerClient({ cookies })

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            if (error.message === "Email not confirmed") {
                return {
                    errorMessage: "Please verify your email before logging in. Check your inbox for a confirmation link."
                }
            }
            throw error
        }

        return {errorMessage: null}
    } catch (error) {
        console.error(error)
        if (error instanceof Error && error.message.includes("User from sub claim")) {
            return {
                errorMessage: "Account verification pending. Please try again in a few moments."
            }
        }
        return handleError(error)
    }
}

export const signUpAction = async (email: string, password: string) => {
    try {
        const supabase = createRouteHandlerClient({ cookies })

        const {data, error} = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) {
            throw error
        }
        const userId = data.user?.id
        if (!userId) {
            throw new Error("Error Signing up");
        }
        await prisma.user.create({
            data: {
                id: userId,
                email,
            },
        })

        return {errorMessage: null, userId}
    } catch (error) {
        console.error(error)
        return handleError(error)
    }
}