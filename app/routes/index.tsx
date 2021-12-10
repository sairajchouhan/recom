import type { MetaFunction } from 'remix'

export let meta: MetaFunction = () => {
  return {
    title: 'Recom',
    description: 'Welcome to Recom',
  }
}

export default function Index() {
  return (
    <div className="text-4xl text-slate-700 first-letter:text-7xl">
      Welcome to Recom
    </div>
  )
}
