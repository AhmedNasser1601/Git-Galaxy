// app/[[...username]]/layout.tsx
import type { Metadata } from 'next';

type Props = {
  params: { username?: string[] }
}

// This runs on the server to generate the HTML <head> for WhatsApp/Twitter
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const username = params?.username?.[0];

  if (username) {
    return {
      title: `${username}'s Git-Galaxy`,
      description: `Explore ${username}'s GitHub repositories mapped as an interactive 3D solar system!`,
      openGraph: {
        title: `${username}'s Git-Galaxy`,
        description: `Explore ${username}'s GitHub repositories mapped as an interactive 3D solar system!`,
      }
    }
  }

  // Fallback for the main page
  return {
    title: "Git-Galaxy | Your Code in 3D",
  }
}

export default function UserLayout({ children }: { children: React.ReactNode }) {
  // It simply wraps your page.tsx and passes it through!
  return <>{children}</>;
}
