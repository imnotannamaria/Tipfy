import { Logo } from './Logo'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'

export function EmptyMusicCard() {
  return (
    <Card className="w-full md:w-1/2 h-[500px] flex flex-col justify-between">
      <CardHeader>
        <Logo />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <CardTitle>Me indique uma música</CardTitle>
        <CardDescription>
          Preencha seu nome, nome da música e logo abaixo será retornada as
          informações da faixa.
        </CardDescription>
      </CardContent>
    </Card>
  )
}
