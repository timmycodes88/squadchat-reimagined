'use client'
import { io as ClientIO } from 'socket.io-client'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

type SocketContextType = {
  socket: any | null
  isConnected: boolean | 'loading'
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export const useSocket = () => {
  return useContext(SocketContext)
}

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [socket, setSocket] = useState<any | null>(null)
  const [isConnected, setIsConnected] = useState<boolean | 'loading'>('loading')
  const knowConnectionRef = useRef(false)
  useEffect(() => {
    const socketInstance = new (ClientIO as any)(
      process.env.NEXT_PUBLIC_SITE_URL!,
      { path: '/api/socket/io', addTrailingSlash: false }
    )

    socketInstance.on('connect', () => {
      knowConnectionRef.current = true
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      knowConnectionRef.current = false
      setIsConnected(false)
    })

    setSocket(socketInstance)
    setTimeout(() => setIsConnected(knowConnectionRef.current), 500)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}
