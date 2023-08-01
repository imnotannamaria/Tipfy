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
})

interface TrackSearch {
  trackData: Track
}

export default function Home() {
  const [trackSearch, setTrackSearch] = useState<TrackSearch>()
  const [waiting, setWaiting] = useState(false)

  const form = useForm<z.infer<typeof seachSongSchema>>({
    resolver: zodResolver(seachSongSchema),
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
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <main className="flex flex-col h-screen">
      <Header />

      <section className="flex h-full w-full items-center justify-center flex-col lg:flex-row gap-8 p-4">
        {/* LEFT */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 w-full md:w-1/2 lg:w-1/3"
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
              {!waiting ? (
                <Button type="submit" variant="secondary" className="w-full">
                  Verificar
                </Button>
              ) : (
                <LoadingButton />
              )}
            </form>
          </Form>
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-1/2 flex justify-center">
          {trackSearch ? (
            <MusicCard
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
