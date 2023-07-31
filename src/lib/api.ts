import axios from 'axios'

export const apiToken = axios.create({
  baseURL: 'https://accounts.spotify.com/api',
})

export const apiSearch = axios.create({
  baseURL: 'https://api.spotify.com/v1/',
})
