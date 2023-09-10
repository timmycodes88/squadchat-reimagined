import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Button } from './ui/button'
import NavigationSideBar from './navigation/NavigationSideBar'
import ServerSidebar from './server/ServerSidebar'

export default function MobileToggle({ serverId }: { serverId: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={'ghost'} size={'icon'} className='md:hidden'>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className='p-0 flex gap-0' side={'left'}>
        <div className='w-[72px]'>
          <NavigationSideBar />
        </div>
        <ServerSidebar serverId={serverId} />
      </SheetContent>
    </Sheet>
  )
}
