export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex items-center justify-center p-4 h-full'>
      {children}
    </div>
  )
}
