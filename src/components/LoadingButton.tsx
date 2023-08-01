import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface LoadingButtonProps {
  label: string
}

export function LoadingButton({ label }: LoadingButtonProps) {
  return (
    <Button className="w-full" disabled variant="secondary">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      {label}
    </Button>
  )
}
