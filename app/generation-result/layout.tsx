export const metadata = {
  title: 'Meme Generation Result',
  description: 'View your generated meme',
}

export default function GenerationResultLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section>
      {children}
    </section>
  )
} 