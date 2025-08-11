import { useState } from "react";

export function SpinnerImg({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className='relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden flex items-center justify-center bg-gray-100'>
      {!loaded && (
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin' />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading='lazy'
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`w-16 h-16 object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
