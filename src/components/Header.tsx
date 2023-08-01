import Link from 'next/link'
import { Logo } from './Logo'
import { Button } from './ui/button'
import { hygraph } from '@/lib/hygraph'
import { useState } from 'react'
import {
  Indication,
  IndicationWithId,
  IndicationWithState,
} from '@/graphql/interfaces/Indication'
import {
  createIndicationMutation,
  listAllIndicationsQuery,
  setIndicationToPublishMutation,
} from '@/graphql/mutations/indicationsMutations'

export function Header() {
  const [createdIndicationId, setCreatedIndicationId] = useState<string | null>(
    null,
  )

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

  async function handleCreateIndicationMutation() {
    const newIndication: Indication = {
      link: 'testefinal.com',
      name: 'Na Maria',
      track: 'Vampire - Olivia',
    }

    const createIndicationInput = {
      data: newIndication,
    }

    try {
      const { createIndication: createdIndication } = await hygraph.request<{
        createIndication: IndicationWithId
      }>(createIndicationMutation, createIndicationInput)
      console.log(createdIndication)

      setCreatedIndicationId(createdIndication.id)
    } catch (error) {
      console.error(error)
    }
  }

  async function handleSetIndicationStateToPublish() {
    if (createdIndicationId) {
      const setIndicationToPublishInput = {
        id: createdIndicationId,
      }

      try {
        const { publishIndication: publishedIndication } =
          await hygraph.request<{
            publishIndication: IndicationWithState
          }>(setIndicationToPublishMutation, setIndicationToPublishInput)

        console.log(publishedIndication)
      } catch (error) {
        console.error(error)
      }
    } else {
      console.error(
        'There is no created indication id. Please create an indication first.',
      )
    }
  }

  return (
    <header className="flex justify-between p-4">
      <Logo />
      <div className="flex gap-2">
        <Button onClick={handleListAllIndications}>
          <Link href="">Indicações</Link>
        </Button>
        <Button onClick={handleCreateIndicationMutation}>
          Criar Indicação
        </Button>
        <Button onClick={handleSetIndicationStateToPublish}>
          Definir Estado como PUBLISH
        </Button>
      </div>
    </header>
  )
}
