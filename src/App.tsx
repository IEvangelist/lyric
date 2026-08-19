import { StarField } from '@/components/StarField'
import { Header } from '@/components/site/Header'
import { Hero } from '@/components/site/Hero'
import { About } from '@/components/site/About'
import { Gallery } from '@/components/site/Gallery'
import { Swimming } from '@/components/site/Swimming'
import { Aspirations } from '@/components/site/Aspirations'
import { Family } from '@/components/site/Family'
import { Footer } from '@/components/site/Footer'

export default function App() {
  return (
    <>
      <StarField />
      <Header />
      <main>
        <Hero />
        <About />
        <Gallery />
        <Swimming />
        <Aspirations />
        <Family />
      </main>
      <Footer />
    </>
  )
}
