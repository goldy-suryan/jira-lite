import { CrossBtn } from '@/app/components/icons';
import Image from 'next/image';
import React from 'react';

const ImageModal = ({ expandedImage, closeImageModal }) => {
  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm p-4"
      aria-modal="true"
      role="dialog"
      onClick={closeImageModal}
    >
      <div
        className="relative max-w-4xl max-h-[90vh] w-full bg-[#121212] rounded-2xl p-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeImageModal}
          aria-label="Close image modal"
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          <CrossBtn />
        </button>
        <Image
          src={expandedImage}
          alt={expandedImage}
          width={800}
          height={800}
          className="max-w-full max-h-[80vh] object-contain rounded"
        />
        {/* <img
          src={expandedImage}
          alt="Expanded attachment"
          className="max-w-full max-h-[80vh] object-contain rounded"
        /> */}
      </div>
    </div>
  );
};

export default ImageModal;
