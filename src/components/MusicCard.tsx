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

interface MusicCardProps {
  trackName: string
  artistName: string
  trackCover: string
}

export function MusicCard({
  trackName,
  artistName,
  trackCover,
}: MusicCardProps) {
  return (
    <Card className="w-1/2 lg:w-1/2 h-[500px] flex flex-col justify-between">
      <CardHeader>
        <CardTitle>{trackName}</CardTitle>
        <CardDescription>{artistName}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="w-[250px]">
          <AspectRatio ratio={10 / 10}>
            <Image
              src={trackCover}
              width={250}
              height={250}
              alt=""
              className="rounded-md object-cover"
            />
          </AspectRatio>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="secondary">
          Indicar
        </Button>
      </CardFooter>
    </Card>
  )
}
