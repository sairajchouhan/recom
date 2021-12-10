import type { MetaFunction } from 'remix'

export let meta: MetaFunction = () => {
  return {
    title: 'Recom',
    description: 'Welcome to Recom',
  }
}

export default function Index() {
  return <div>hi</div>
}
