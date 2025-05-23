import React from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { fill } from '@cloudinary/url-gen/actions/resize';

interface CloudinaryImageProps {
  publicId: string;
  width?: number;
  height?: number;
}

const CloudinaryImage: React.FC<CloudinaryImageProps> = ({
  publicId,
  width = 800,
  height = 300,
}) => {
  const cld = new Cloudinary({ cloud: { cloudName: 'dvgooco4p' } });
  const img = cld.image(publicId).resize(fill().width(width).height(height)).format('auto').quality('auto');
return (
    <AdvancedImage
        cldImg={img}
        style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain', // Otras opciones: 'contain', 'cover', 'fill', 'none'
            display: 'block'
        }}
    />
);
};

export default CloudinaryImage;