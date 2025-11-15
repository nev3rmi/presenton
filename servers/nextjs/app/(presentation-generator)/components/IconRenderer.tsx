"use client";

import React, { useState, useEffect } from 'react';

interface IconRendererProps {
  iconUrl: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * IconRenderer - Fetches and renders SVG icons inline from URLs
 *
 * This component fetches SVG content from a URL and renders it inline,
 * preserving CSS color styling via currentColor while using live URLs
 * from slideData for persistence.
 */
const IconRenderer: React.FC<IconRendererProps> = ({ iconUrl, className, style }) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!iconUrl) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchSvg = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(iconUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch icon: ${response.status}`);
        }

        const svgText = await response.text();

        if (isMounted) {
          setSvgContent(svgText);
          setLoading(false);
        }
      } catch (err) {
        console.error('[IconRenderer] Error fetching SVG:', err);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    };

    fetchSvg();

    return () => {
      isMounted = false;
    };
  }, [iconUrl]);

  if (loading) {
    // Show placeholder while loading
    return (
      <span className={className} style={style}>
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth="2" opacity="0.3" />
        </svg>
      </span>
    );
  }

  if (error || !svgContent) {
    // Show error placeholder
    return (
      <span className={className} style={style}>
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <line x1="8" y1="8" x2="16" y2="16" strokeWidth="2" />
          <line x1="16" y1="8" x2="8" y2="16" strokeWidth="2" />
        </svg>
      </span>
    );
  }

  // Render the fetched SVG inline
  // Note: We render the SVG directly with proper sizing
  return (
    <span
      className={className || 'inline-block w-6 h-6'}
      style={{ ...style, display: 'inline-block' }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

export default IconRenderer;
