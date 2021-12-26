import {
  Links,
  LiveReload,
  LoaderFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from 'remix'

import type { LinksFunction } from 'remix'
import styles from './styles/tailwind-prod.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { isUserAuthenticated } from './utils/session.server'

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: styles,
    },
  ]
}

export const loader: LoaderFunction = async ({ request }) => {
  return await isUserAuthenticated(request)
}

function Document({
  children,
  title,
}: {
  children: React.ReactNode
  title?: string
}) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body
        className={process.env.NODE_ENV !== 'production' ? 'debug-screens' : ''}
      >
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  )
}

export default function App() {
  const isAuthenticated = useLoaderData()
  return (
    <Document>
      <Layout isAuthenticated={isAuthenticated}>
        <Outlet />
      </Layout>
    </Document>
  )
}

function Layout({
  isAuthenticated = false,
  children,
}: {
  isAuthenticated?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="mx-6 sm:mx-10">
      <Header isAuthenticated={isAuthenticated} />
      <div className="">{children}</div>
      <Footer />
    </div>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)
  return (
    <Document title="Error!">
      <Layout>
        <div>
          <h1>There was an error</h1>
          <p>{error.message}</p>
          <hr />
          <p>
            Hey, developer, you should replace this with what you want your
            users to see.
          </p>
        </div>
      </Layout>
    </Document>
  )
}

export function CatchBoundary() {
  let caught = useCatch()

  let message
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      )
      break
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      )
      break

    default:
      throw new Error(caught.data || caught.statusText)
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </Layout>
    </Document>
  )
}
