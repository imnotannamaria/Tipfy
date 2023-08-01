import Link from 'next/link'
import { Logo } from './Logo'
import { Button } from './ui/button'
import { hygraph } from '@/lib/hygraph'
import { IndicationWithId } from '@/graphql/interfaces/Indication'
import { listAllIndicationsQuery } from '@/graphql/mutations/indicationsMutations'

export function Header() {
  async function handleListAllIndications() {
    try {
      const { indications } = await hygraph.request<{
        indications: IndicationWithId[]
      }>(listAllIndicationsQuery)

      console.log(indications)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <header className="flex justify-between p-4">
      <Logo />
      <div className="flex gap-2">
        <Button onClick={handleListAllIndications}>
          <Link href="">Indicações</Link>
        </Button>
      </div>
    </header>
  )
}
