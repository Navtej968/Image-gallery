import { useState, useEffect } from "react";
import LightGallery from 'lightgallery/react';

// Import styles
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-autoplay.css';
import 'lightgallery/css/lg-fullscreen.css';
import 'lightgallery/css/lg-share.css';
import 'lightgallery/css/lg-rotate.css';

// Import plugins
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import lgAutoplay from 'lightgallery/plugins/autoplay';
import lgFullscreen from 'lightgallery/plugins/fullscreen';
import lgShare from 'lightgallery/plugins/share';
import lgRotate from 'lightgallery/plugins/rotate';

export function Gallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = () => {
      fetch("https://image-gallery-tfhg.onrender.com/api/images")
        .then(response => response.json())
        .then(data => {
          setImages(data);
          localStorage.setItem("imageData", JSON.stringify(data)); // Store in localStorage
        })
        .catch(err => console.error("Error fetching images:", err));
    };

    fetchImages(); // Fetch once on mount
    const interval = setInterval(fetchImages, 60000); // Refresh every 60s

    return () => clearInterval(interval); // Cleanup
  }, []);

  return (
    <div className="App">
      <LightGallery
        speed={500}
        plugins={[lgThumbnail, lgZoom, lgAutoplay, lgFullscreen, lgRotate, lgShare]}
      >
        {images.map((image, index) => (
          <a href={image.src} key={index}>
            <img alt={image.alt} src={image.src} />
          </a>
        ))}
      </LightGallery>
    </div>
  );
}
