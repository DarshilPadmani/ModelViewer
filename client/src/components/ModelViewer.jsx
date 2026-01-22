import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import arIcon from '../assets/ar_icon.png';
import arHandPrompt from '../assets/ar_hand_prompt.png';

/**
 * React wrapper for <model-viewer>.
 * - Fetches model URL from backend API
 * - Binds progress bar logic to <model-viewer>'s 'progress' event
 * - Preserves AR modes: webxr, scene-viewer, quick-look
 */
const ModelViewer = ({ fallbackModelUrl }) => {
  const modelViewerRef = useRef(null);
  const [modelUrl, setModelUrl] = useState(fallbackModelUrl || '');
  const [loadingError, setLoadingError] = useState(null);

  // Fetch model metadata from backend
  useEffect(() => {
    let isMounted = true;

    const fetchModel = async () => {
      try {
        const res = await axios.get('/api/models');
        const models = res.data || [];
        if (isMounted && models.length > 0) {
          // In a real app you might select by id; here we just use the first one
          setModelUrl(models[0].modelUrl);
        }
      } catch (err) {
        console.error('Failed to fetch model metadata', err);
        if (isMounted) {
          setLoadingError('Failed to load model metadata from server.');
        }
      }
    };

    fetchModel();

    return () => {
      isMounted = false;
    };
  }, []);

  // Attach <model-viewer> progress handler (converted from vanilla script.js)
  useEffect(() => {
    const mv = modelViewerRef.current;
    if (!mv) return;

    const onProgress = (event) => {
      const progressBar = event.target.querySelector('.progress-bar');
      const updatingBar = event.target.querySelector('.update-bar');
      if (!progressBar || !updatingBar) return;

      const totalProgress = event.detail?.totalProgress ?? 0;
      updatingBar.style.width = `${totalProgress * 100}%`;

      // Match original behavior: hide when fully loaded, then remove listener
      if (totalProgress === 1) {
        progressBar.classList.add('hide');
        event.target.removeEventListener('progress', onProgress);
      } else {
        progressBar.classList.remove('hide');
      }
    };

    mv.addEventListener('progress', onProgress);

    // Cleanup on unmount
    return () => {
      mv.removeEventListener('progress', onProgress);
    };
  }, []);

  return (
    <>
      {loadingError && (
        <div className="error-banner">
          {loadingError}
        </div>
      )}
      {/* Use the same attributes as original index.html to preserve AR behavior */}
      <model-viewer
        ref={modelViewerRef}
        src={modelUrl}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        tone-mapping="neutral"
        shadow-intensity="1"
      >
        <div className="progress-bar hide" slot="progress-bar">
          <div className="update-bar"></div>
        </div>
        <button
          slot="ar-button"
          id="ar-button"
          // Expose the icon as a CSS custom property so styles.css can pick it up
          style={{ '--ar-button-icon': `url(${arIcon})` }}
        >
          View in your space
        </button>
        <div id="ar-prompt">
          <img src={arHandPrompt} alt="Move phone around to view in AR" />
        </div>
      </model-viewer>
    </>
  );
};

export default ModelViewer;

