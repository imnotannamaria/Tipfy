import { Logo } from './Logo'
import { ModeToggle } from './Theme/ModeToggle'

export function Header() {
  return (
    <header className="flex justify-between p-4">
      <Logo />

      <ModeToggle />
    </header>
  )
}
