'use client'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Header } from '@/components/Header'
import { EmptyMusicCard } from '@/components/EmptyMusicCard'
import querystring from 'querystring'
import { apiSearch, apiToken } from '@/lib/api'
import { Track } from '@/@types/Track'
import { useState } from 'react'
import { MusicCard } from '@/components/MusicCard'
import { LoadingButton } from '@/components/LoadingButton'
import { useToast } from '@/components/ui/use-toast'
import { Switch } from '@/components/ui/switch'

const seachSongSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'Seu nome deve ter pelo menos 2 caracteres.',
    })
    .max(20, {
      message: 'Seu nome deve ter no máximo 20 caracteres.',
    }),
  track: z
    .string()
    .min(2, {
      message: 'A música deve ter pelo menos 2 caracteres',
    })
    .max(50, {
      message: 'A música deve ter no máximo 20 caracteres',
    }),
  isPublic: z.boolean().default(true),
})

interface TrackSearch {
  trackData: Track
}

export default function Home() {
  const [trackSearch, setTrackSearch] = useState<TrackSearch>()
  const [waiting, setWaiting] = useState(false)

  const { toast } = useToast()

  const form = useForm<z.infer<typeof seachSongSchema>>({
    resolver: zodResolver(seachSongSchema),
    defaultValues: {
      isPublic: true,
    },
  })

  async function onSubmit(values: z.infer<typeof seachSongSchema>) {
    setWaiting(true)
    const tokenData = {
      grant_type: 'client_credentials',
      client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
    }

    try {
      const tokenResponse = await apiToken.post(
        '/token',
        querystring.stringify(tokenData),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )

      const response = await apiSearch.get('/search', {
        params: {
          q: values.track,
          type: 'track',
        },
        headers: {
          Authorization: `Bearer ${tokenResponse.data.access_token}`,
        },
      })

      setWaiting(false)

      setTrackSearch({ trackData: response.data.tracks.items[0] })

      toast({
        title: 'Música encontrada!',
        description: 'Verique se é a música que você queria e me indique.',
      })
    } catch (error) {
      setWaiting(false)

      toast({
        variant: 'destructive',
        title: 'Ocorreu um erro!',
        description: 'Por favor, tente novamente.',
      })

      console.log(error)
    }
  }

  return (
    <main className="flex flex-col h-screen">
      <Header />

      <section className="flex h-full w-full items-center justify-center flex-col lg:flex-row gap-8 p-4">
        {/* LEFT */}
        <div className="w-full lg:w-3/4 h-full flex justify-center items-center bg-red-">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-full md:w-1/2"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qual seu seu nome?</FormLabel>
                    <FormControl>
                      <Input placeholder="Abimaela" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="track"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qual música você quer me indicar?</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Vampire - Olivia Rodrigo"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A música deve estar no{' '}
                      <Label className="text-green-500">Spotify</Label>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Sua indicação pode ser publicada?
                      </FormLabel>
                      <FormDescription>
                        Ao marcar essa opção, sua indicação será listada na
                        página de indicações
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {!waiting ? (
                <Button type="submit" variant="secondary" className="w-full">
                  Verificar
                </Button>
              ) : (
                <LoadingButton label="Procurando" />
              )}
            </form>
          </Form>
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-3/4 h-full flex justify-center items-center">
          {trackSearch ? (
            <MusicCard
              isPublic={form.watch('isPublic')}
              indicatorName={form.watch('username')}
              trackName={trackSearch.trackData.name}
              artistName={trackSearch.trackData.artists[0].name}
              trackCover={trackSearch.trackData.album.images[0].url}
              trackLink={trackSearch.trackData.external_urls.spotify}
            />
          ) : (
            <EmptyMusicCard />
          )}
        </div>
      </section>
    </main>
  )
}
