import { LoginForm } from "@/components/auth/LoginForm";
import { Suspense } from "react";
export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center">Cargando...</div>}>
            <LoginForm />
        </Suspense>
    )
}