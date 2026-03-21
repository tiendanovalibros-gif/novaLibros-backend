// ========================================
// 🔐 FRONTEND - LOGIN CON JWT
// ========================================

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPageWithAuth() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Por favor completa todos los campos.')
      return
    }

    setLoading(true)

    const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3012'

    try {
      // 1️⃣ Hacer login
      const res = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: email,
          contrasena: password,
        }),
      })

      if (!res.ok) {
        let message = 'Error al iniciar sesión'
        try {
          const data = await res.json()
          if (data && typeof data.message === 'string') {
            message = data.message
          }
        } catch {
          // ignorar error al parsear JSON
        }
        throw new Error(message)
      }

      const data = await res.json()

      // 2️⃣ Guardar el token y datos del usuario en localStorage
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.usuario))

      console.log('Login exitoso:', data)

      // 3️⃣ Redirigir a la página principal
      router.push('/')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  // ... resto del JSX
  return <div>Tu formulario aquí</div>
}

// ========================================
// 🌐 HACER PETICIONES AUTENTICADAS
// ========================================

// Función helper para hacer peticiones con autenticación
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token')

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  // Si el token expiró (401), redirigir al login
  if (response.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
    throw new Error('Sesión expirada')
  }

  return response
}

// Ejemplo de uso:
async function getMyProfile() {
  const API_URL = 'http://localhost:3012'
  const res = await fetchWithAuth(`${API_URL}/users/profile`)
  return res.json()
}

async function updateMyProfile(data: any) {
  const API_URL = 'http://localhost:3012'
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const res = await fetchWithAuth(`${API_URL}/users/${user.id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

  return res.json()
}

// ========================================
// 🚪 LOGOUT
// ========================================

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.location.href = '/login'
}

// ========================================
// ✅ VERIFICAR SI ESTÁ AUTENTICADO
// ========================================

function isAuthenticated(): boolean {
  return !!localStorage.getItem('token')
}

function getCurrentUser() {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

// ========================================
// 🛡️ PROTEGER RUTAS EN NEXT.JS
// ========================================

// Crear un middleware o usar en los componentes:
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProtectedPage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  // Renderizar contenido protegido
  return <div>Contenido solo para usuarios autenticados</div>
}
