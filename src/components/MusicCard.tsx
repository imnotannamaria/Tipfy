import { AspectRatio } from './ui/aspect-ratio'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'
import Image from 'next/image'
import { Button } from './ui/button'
import Link from 'next/link'
import {
  Indication,
  IndicationWithId,
  IndicationWithState,
} from '@/graphql/interfaces/Indication'
import { hygraph } from '@/lib/hygraph'
import {
  createIndicationMutation,
  setIndicationToPublishMutation,
} from '@/graphql/mutations/indicationsMutations'
import { useState } from 'react'
import { useToast } from './ui/use-toast'
import { LoadingButton } from './LoadingButton'

interface MusicCardProps {
  isPublic: boolean
  indicatorName: string
  trackName: string
  artistName: string
  trackCover: string
  trackLink: string
}

export function MusicCard({
  indicatorName,
  isPublic,
  trackName,
  artistName,
  trackCover,
  trackLink,
}: MusicCardProps) {
  const [waiting, setWaiting] = useState(false)

  const { toast } = useToast()

  async function handleCreateIndicationMutation() {
    setWaiting(true)

    const newIndication: Indication = {
      link: trackLink,
      name: indicatorName,
      track: trackName,
      artist: artistName,
      cover: trackCover,
    }

    const createIndicationInput = {
      data: newIndication,
    }

    try {
      const { createIndication: createdIndication } = await hygraph.request<{
        createIndication: IndicationWithId
      }>(createIndicationMutation, createIndicationInput)

      if (isPublic && createdIndication.id) {
        const setIndicationToPublishInput = {
          id: createdIndication.id,
        }

        try {
          const { publishIndication: publishedIndication } =
            await hygraph.request<{
              publishIndication: IndicationWithState
            }>(setIndicationToPublishMutation, setIndicationToPublishInput)

          setWaiting(false)

          toast({
            title: 'Música Indicada!',
            description: `Olá ${publishedIndication.name}, sua indicação foi enviada com sucesso!`,
          })
        } catch (error) {
          setWaiting(false)
          toast({
            variant: 'destructive',
            title: 'Ocorreu um erro!',
            description: 'Por favor, tente novamente.',
          })
        }
      } else {
        setWaiting(false)

        toast({
          title: 'Música Indicada!',
          description: `Olá ${createdIndication.name}, sua indicação foi enviada com sucesso!`,
        })
      }
    } catch (error) {
      setWaiting(false)
      toast({
        variant: 'destructive',
        title: 'Ocorreu um erro!',
        description: 'Por favor, tente novamente.',
      })
    }
  }

  return (
    <Card className="w-full md:w-1/2 flex flex-col justify-between">
      <CardHeader>
        <CardTitle>{trackName}</CardTitle>
        <CardDescription>{artistName}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 items-center">
        <div className="w-[250px]">
          <AspectRatio ratio={250 / 250}>
            <Image
              src={trackCover}
              width={250}
              height={250}
              alt=""
              className="rounded-md object-cover"
            />
          </AspectRatio>
        </div>

        <Link href={trackLink} target="_blank">
          <Button className="text-green-500" variant="link">
            Ouvir no Spotify
          </Button>
        </Link>
      </CardContent>
      <CardFooter>
        {!waiting ? (
          <Button
            className="w-full"
            variant="secondary"
            onClick={handleCreateIndicationMutation}
          >
            Indicar
          </Button>
        ) : (
          <LoadingButton label="Indicando" />
        )}
      </CardFooter>
    </Card>
  )
}
