import AdvancedTaskOptimizer from '../components/AdvancedTaskOptimizer'
import { FaGithub } from 'react-icons/fa'

export default function Home() {
  return (
    <main className="container mx-auto p-4 min-h-screen flex flex-col justify-between">
      <AdvancedTaskOptimizer />
      <div className="w-full text-center p-4">
        <a
          href="https://github.com/ashakoen/ought-o-mate-ak"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-700 flex items-center justify-center"
        >
          <FaGithub className="mr-2" />
          View on GitHub
        </a>
      </div>
    </main>
  )
}