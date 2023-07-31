import Link from 'next/link'
import { Logo } from './Logo'
import { Button } from './ui/button'

export function Header() {
  return (
    <header className="flex justify-between p-4">
      <Logo />

      <Button variant="destructive">
        <Link href="">Admin</Link>
      </Button>
    </header>
  )
}
