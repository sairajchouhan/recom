import type { MetaFunction } from 'remix'

export let meta: MetaFunction = () => {
  return {
    title: 'Recom',
    description: 'Welcome to Recom',
  }
}

export default function Index() {
  return (
    <div className="">
      <button className="btn">neutral</button>
      <button className="btn btn-primary">primary</button>
      <button className="btn btn-secondary">secondary</button>
      <button className="btn btn-accent">accent</button>
      <button className="btn btn-ghost">ghost</button>
      <button className="btn btn-link">link</button>
    </div>
  )
}
