import { Squircle } from "ldrs/react"
import "ldrs/react/Squircle.css"

interface LoaderProps {
  fullscreen?: boolean   // use true for page overlay
}

const Loader: React.FC<LoaderProps> = ({ fullscreen = false }) => {
  return (
    <div
      className={`flex justify-center items-center ${
        fullscreen
          ? "fixed inset-0 z-50 bg-white/60 backdrop-blur-sm" // overlay for pages
          : "p-4" // just centered loader for modals
      }`}
    >
      <Squircle
        size="40"
        stroke="5"
        strokeLength="0.15"
        bgOpacity="0.1"
        speed="0.9"
        color="black"
      />
    </div>
  )
}

export default Loader
