"use server"

import { createClient } from "./auth/server"
import { handleError } from "./lib/utils"

export const loginAction = async (email: string, password: string) => {
    try {
        const {auth} = await createClient()

        const {data, error} = await auth.signInWithPassword({
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
        const {auth} = await createClient()

        const {data, error} = await auth.signUp({
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

        // add user to database

        return {errorMessage: null, userId}
    } catch (error) {
        console.error(error)
        return handleError(error)
    }
}