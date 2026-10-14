import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'
import { PageTransition } from '@/components/page-transition'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <PageTransition>
      <section className="mx-auto w-full max-w-5xl px-6 py-20 md:py-28">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-brand" aria-hidden="true" />
          <span className="font-mono text-xs tracking-[0.2em] text-brand uppercase">404</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          This page doesn&apos;t exist
        </h1>
        <p className="mt-4 max-w-md text-pretty text-muted-foreground">
          The link may be out of date, or the page may have moved.
        </p>
        <Button asChild className="mt-8 bg-brand text-background hover:bg-brand/85">
          <Link to="/">
            <ArrowLeft />
            Back home
          </Link>
        </Button>
      </section>
    </PageTransition>
  )
}
