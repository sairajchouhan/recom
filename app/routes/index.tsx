import type { MetaFunction } from 'remix'

export let meta: MetaFunction = () => {
  return {
    title: 'Recom',
    description: 'Welcome to Recom',
  }
}

export default function Index() {
  return (
    <div className="flex flex-col p-5">
      <h1 className="text-5xl">Hi</h1>
    </div>
  )
}
