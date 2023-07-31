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

interface MusicCardProps {
  trackName: string
  artistName: string
  trackCover: string
  trackLink: string
}

export function MusicCard({
  trackName,
  artistName,
  trackCover,
  trackLink,
}: MusicCardProps) {
  return (
    <Card className="w-full md:w-1/2 h-[500px] flex flex-col justify-between">
      <CardHeader>
        <CardTitle>{trackName}</CardTitle>
        <CardDescription>{artistName}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 items-center">
        <div className="w-[250px]">
          <AspectRatio ratio={10 / 10}>
            <Image
              src={trackCover}
              width={500}
              height={500}
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
        <Button className="w-full" variant="secondary">
          Indicar
        </Button>
      </CardFooter>
    </Card>
  )
}
