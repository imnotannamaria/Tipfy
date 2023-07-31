import axios from 'axios'

export const apiToken = axios.create({
  baseURL: 'https://accounts.spotify.com/api',
})
