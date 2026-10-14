'use client'

import { FormEvent, Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, KeyRound, LoaderCircle } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const token = searchParams.get('token') ?? ''

    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setMessage('')
        setError('')

        if (!token) {
            setError('El enlace no contiene un token de recuperación.')
            return
        }

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden.')
            return
        }

        if (newPassword.length < 8 || newPassword.length > 72) {
            setError('La contraseña debe tener entre 8 y 72 caracteres.')
            return
        }

        setLoading(true)

        try {
            const response = await fetch(`${API_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    newPassword
                })
            })

            const data = await response.json().catch(() => null)

            if (!response.ok) {
                throw new Error(
                    data?.message ??
                    data?.detail ??
                    'El enlace no es válido o ha caducado.'
                )
            }

            setMessage(
                typeof data === 'string'
                    ? data
                    : 'Tu contraseña se actualizó correctamente.'
            )

            setTimeout(() => router.push('/login'), 1800)
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'No se pudo conectar con el servidor.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className='flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10'>
            <section className='w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm'>
                <Link
                    href='/login'
                    className='mb-8 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900'
                >
                    <ArrowLeft size={16} />
                    Volver al inicio de sesión
                </Link>

                <div className='mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700'>
                    <KeyRound size={24} />
                </div>

                <h1 className='text-2xl font-bold tracking-tight text-slate-900'>
                    Crea una contraseña nueva
                </h1>

                <p className='mt-3 text-sm leading-6 text-slate-600'>
                    Elige una contraseña segura para volver a acceder a tu cuenta.
                </p>

                <form onSubmit={handleSubmit} className='mt-7 space-y-5'>
                    <div>
                        <label
                            htmlFor='newPassword'
                            className='mb-2 block text-sm font-medium text-slate-700'
                        >
                            Nueva contraseña
                        </label>

                        <input
                            id='newPassword'
                            type='password'
                            autoComplete='new-password'
                            required
                            minLength={8}
                            maxLength={72}
                            value={newPassword}
                            onChange={event => setNewPassword(event.target.value)}
                            placeholder='Mínimo 8 caracteres'
                            className='w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                        />
                    </div>

                    <div>
                        <label
                            htmlFor='confirmPassword'
                            className='mb-2 block text-sm font-medium text-slate-700'
                        >
                            Confirmar contraseña
                        </label>

                        <input
                            id='confirmPassword'
                            type='password'
                            autoComplete='new-password'
                            required
                            minLength={8}
                            maxLength={72}
                            value={confirmPassword}
                            onChange={event => setConfirmPassword(event.target.value)}
                            placeholder='Escribe la contraseña otra vez'
                            className='w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                        />
                    </div>

                    {message && (
                        <p
                            role='status'
                            className='rounded-lg bg-green-50 p-3 text-sm text-green-800'
                        >
                            {message}
                        </p>
                    )}

                    {error && (
                        <p
                            role='alert'
                            className='rounded-lg bg-red-50 p-3 text-sm text-red-700'
                        >
                            {error}
                        </p>
                    )}

                    <button
                        type='submit'
                        disabled={loading || !token}
                        className='flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60'
                    >
                        {loading && <LoaderCircle size={18} className='animate-spin' />}
                        {loading ? 'Actualizando...' : 'Cambiar contraseña'}
                    </button>
                </form>
            </section>
        </main>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense
            fallback={
                <main className='flex min-h-screen items-center justify-center bg-slate-50'>
                    Cargando formulario...
                </main>
            }
        >
            <ResetPasswordForm />
        </Suspense>
    )
}
