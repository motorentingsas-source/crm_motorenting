'use client';
import Image from 'next/image';

const ImagesProcessor = ({ name, alt }) => {
  return (
    <div className="absolute inset-0 -z-10">
      <Image
        src={name}
        alt={alt}
        fill
        priority
        sizes="100vw"
        quality={100}
        className="object-cover object-center md:object-[center_top]"
      />
    </div>
  );
};

export default ImagesProcessor;
