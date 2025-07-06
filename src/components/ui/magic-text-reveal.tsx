'use client'
import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';

interface Particle {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  color: string;
  opacity: number;
  originalAlpha: number;
  velocityX: number;
  velocityY: number;
  angle: number;
  speed: number;
  floatingOffsetX: number;
  floatingOffsetY: number;
  floatingSpeed: number;
  floatingAngle: number;
  targetOpacity: number;
  sparkleSpeed: number;
  hue: number;
  saturation: number;
  lightness: number;
}

interface MagicTextRevealProps {
  text?: string;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  spread?: number;
  speed?: number;
  density?: number;
  resetOnMouseLeave?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const MagicTextReveal: React.FC<MagicTextRevealProps> = ({
  text = "Magic Text",
  color = "rgba(255, 255, 255, 1)",
  fontSize = 70,
  fontFamily = "Jakarta Sans, sans-serif",
  fontWeight = 600,
  spread = 40,
  speed = 0.5,
  density = 4,
  resetOnMouseLeave = true,
  className = "",
  style = {}
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const [isHovered, setIsHovered] = useState(false);
  const [showText, setShowText] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);
  const [wrapperSize, setWrapperSize] = useState({ width: 0, height: 0 });
  const [textDimensions, setTextDimensions] = useState({ width: 0, height: 0 });

  const transformedDensity = Math.max(2, 6 - density); // Optimized density
  const globalDpr = useMemo(() => {
    if (typeof window !== "undefined") return Math.min(window.devicePixelRatio, 2) || 1; // Cap DPR for performance
    return 1;
  }, []);

  // Generate rainbow colors - optimized
  const generateRainbowColor = useCallback((baseHue: number, time: number, particleIndex: number) => {
    const hue = (baseHue + time * 30 + particleIndex * 8) % 360; // Reduced animation speed
    const saturation = 70 + Math.sin(time + particleIndex) * 15; // Reduced range
    const lightness = 55 + Math.sin(time * 2 + particleIndex * 0.3) * 15; // Reduced range
    return { hue, saturation, lightness };
  }, []);

  // Convert HSL to RGB - optimized
  const hslToRgb = useCallback((h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;
    
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h * 12) % 12;
      return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    };
    
    return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
  }, []);

  // Measure text dimensions
  const measureText = useCallback((text: string, fontSize: number, fontWeight: number, fontFamily: string) => {
    if (typeof window === "undefined") return { width: 200, height: 60 };
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return { width: 200, height: 60 };
    
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    const metrics = ctx.measureText(text);
    
    return {
      width: Math.ceil(metrics.width + fontSize * 0.5),
      height: Math.ceil(fontSize * 1.4)
    };
  }, []);

  // Update text dimensions when text or font properties change
  useEffect(() => {
    const dimensions = measureText(text, fontSize, fontWeight, fontFamily);
    setTextDimensions(dimensions);
  }, [text, fontSize, fontWeight, fontFamily, measureText]);

  // Create particles from text - optimized
  const createParticles = useCallback((
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    text: string,
    textX: number,
    textY: number,
    font: string,
    color: string,
    transformedDensity: number
  ): Particle[] => {
    const particles: Particle[] = [];
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set text properties
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.imageSmoothingEnabled = false; // Disable for performance
    
    // Render text for sampling
    ctx.fillText(text, textX, textY);
    
    // Sample the rendered text
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Optimized sampling rate
    const sampleRate = Math.max(3, transformedDensity * 2); // Increased for better performance
    
    // Calculate text bounds
    let minX = canvas.width;
    let maxX = 0;
    let minY = canvas.height;
    let maxY = 0;
    
    // First pass: find text bounds
    for (let y = 0; y < canvas.height; y += sampleRate) {
      for (let x = 0; x < canvas.width; x += sampleRate) {
        const index = (y * canvas.width + x) * 4;
        const alpha = data[index + 3];
        if (alpha > 0) {
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }
    }
    
    // Calculate spread area
    const textWidth = maxX - minX;
    const textHeight = maxY - minY;
    const spreadRadius = Math.max(textWidth, textHeight) * 0.16; // Reduced spread
    
    // Second pass: create particles with random initial positions
    let particleIndex = 0;
    for (let y = 0; y < canvas.height; y += sampleRate) {
      for (let x = 0; x < canvas.width; x += sampleRate) {
        const index = (y * canvas.width + x) * 4;
        const alpha = data[index + 3];
        if (alpha > 0) {
          const originalAlpha = alpha / 255;
          
          // Calculate random initial position within spread radius
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * spreadRadius;
          const initialX = x + Math.cos(angle) * distance;
          const initialY = y + Math.sin(angle) * distance;
          
          // Generate initial rainbow color
          const baseHue = Math.random() * 360;
          const { hue, saturation, lightness } = generateRainbowColor(baseHue, 0, particleIndex);
          
          const particle: Particle = {
            x: initialX,
            y: initialY,
            originalX: x,
            originalY: y,
            color: `rgba(${data[index]}, ${data[index + 1]}, ${data[index + 2]}, ${originalAlpha})`,
            opacity: originalAlpha * 0.3, // Reduced base opacity
            originalAlpha,
            velocityX: 0,
            velocityY: 0,
            angle: Math.random() * Math.PI * 2,
            speed: 0,
            floatingOffsetX: 0,
            floatingOffsetY: 0,
            floatingSpeed: Math.random() * 1.5 + 0.5, // Reduced speed range
            floatingAngle: Math.random() * Math.PI * 2,
            targetOpacity: Math.random() * originalAlpha * 0.6, // Reduced target opacity
            sparkleSpeed: Math.random() * 1.5 + 0.5, // Reduced sparkle speed
            hue,
            saturation,
            lightness
          };
          particles.push(particle);
          particleIndex++;
        }
      }
    }
    
    // Clear canvas after sampling
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return particles;
  }, [generateRainbowColor]);

  // Update particles animation - optimized
  const updateParticles = useCallback((
    particles: Particle[],
    deltaTime: number,
    isHovered: boolean,
    showText: boolean,
    setShowText: (show: boolean) => void,
    spread: number,
    speed: number
  ) => {
    const FLOAT_RADIUS = spread;
    const RETURN_SPEED = 4; // Increased return speed
    const FLOAT_SPEED = speed;
    const TRANSITION_SPEED = 4 * FLOAT_SPEED; // Reduced transition speed
    const NOISE_SCALE = 0.6; // Reduced noise
    const CHAOS_FACTOR = 1.2; // Reduced chaos
    const FADE_SPEED = 20; // Increased fade speed for quicker hiding
    const time = Date.now() * 0.001;

    particles.forEach((particle, index) => {
      if (isHovered) {
        // When hovered, quickly return to original position and fade out
        const dx = particle.originalX - particle.x;
        const dy = particle.originalY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0.1) {
          particle.x += (dx / distance) * RETURN_SPEED * deltaTime * 60;
          particle.y += (dy / distance) * RETURN_SPEED * deltaTime * 60;
        } else {
          particle.x = particle.originalX;
          particle.y = particle.originalY;
        }
        
        // Quickly fade out particles when hovered
        particle.opacity = Math.max(0, particle.opacity - FADE_SPEED * deltaTime);
      } else {
        // Update particle's unique movement pattern
        particle.floatingAngle += deltaTime * particle.floatingSpeed * (1 + Math.random() * CHAOS_FACTOR);
        
        // Generate base movement using optimized noise
        const uniqueOffset = particle.floatingSpeed * 1000; // Reduced offset
        const noiseX = (
          Math.sin(time * particle.floatingSpeed + particle.floatingAngle) * 1.2 +
          Math.sin((time + uniqueOffset) * 0.3) * 0.6 + // Reduced frequency
          (Math.random() - 0.5) * CHAOS_FACTOR
        ) * NOISE_SCALE;
        const noiseY = (
          Math.cos(time * particle.floatingSpeed + particle.floatingAngle * 1.2) * 0.6 +
          Math.cos((time + uniqueOffset) * 0.3) * 0.4 + // Reduced frequency
          (Math.random() - 0.5) * CHAOS_FACTOR
        ) * NOISE_SCALE;
        
        // Calculate target position with random offset
        const randomOffsetX = FLOAT_RADIUS * noiseX;
        const randomOffsetY = FLOAT_RADIUS * noiseY;
        const targetX = particle.originalX + randomOffsetX;
        const targetY = particle.originalY + randomOffsetY;
        
        // Smooth movement towards target with variable speed
        const dx = targetX - particle.x;
        const dy = targetY - particle.y;
        
        // Add dynamic jitter based on distance
        const distanceFromTarget = Math.sqrt(dx * dx + dy * dy);
        const jitterScale = Math.min(1, distanceFromTarget / (FLOAT_RADIUS * 1.5));
        const jitterX = (Math.random() - 0.5) * FLOAT_SPEED * jitterScale * 0.5; // Reduced jitter
        const jitterY = (Math.random() - 0.5) * FLOAT_SPEED * jitterScale * 0.5; // Reduced jitter
        
        particle.x += dx * TRANSITION_SPEED * deltaTime + jitterX;
        particle.y += dy * TRANSITION_SPEED * deltaTime + jitterY;
        
        // Contain particles within bounds with soft boundary
        const distanceFromOrigin = Math.sqrt(
          Math.pow(particle.x - particle.originalX, 2) + 
          Math.pow(particle.y - particle.originalY, 2)
        );
        if (distanceFromOrigin > FLOAT_RADIUS) {
          const angle = Math.atan2(particle.y - particle.originalY, particle.x - particle.originalX);
          const pullBack = (distanceFromOrigin - FLOAT_RADIUS) * 0.08; // Reduced pull back
          particle.x -= Math.cos(angle) * pullBack;
          particle.y -= Math.sin(angle) * pullBack;
        }
        
        // Enhanced continuous sparkling effect with color cycling
        const opacityDiff = particle.targetOpacity - particle.opacity;
        particle.opacity += opacityDiff * particle.sparkleSpeed * deltaTime * 3; // Reduced sparkle speed
        
        // Update rainbow colors less frequently for performance
        if (index % 3 === Math.floor(time * 2) % 3) { // Update only 1/3 of particles per frame
          const { hue, saturation, lightness } = generateRainbowColor(particle.hue, time, index);
          particle.hue = hue;
          particle.saturation = saturation;
          particle.lightness = lightness;
        }
        
        // When particle reaches its target opacity, set a new random target
        if (Math.abs(opacityDiff) < 0.01) {
          particle.targetOpacity = Math.random() < 0.4 
            ? Math.random() * 0.15 * particle.originalAlpha
            : particle.originalAlpha * (1.5 + Math.random() * 1); // Reduced max opacity
          particle.sparkleSpeed = Math.random() * 2 + 0.5; // Reduced sparkle speed range
        }
      }
    });

    if (isHovered && !showText) {
      setShowText(true);
    }
    if (!isHovered && showText) {
      setShowText(false);
    }
  }, [generateRainbowColor]);

  // Render particles - optimized with LARGER SIZE
  const renderParticles = useCallback((
    ctx: CanvasRenderingContext2D,
    particles: Particle[],
    globalDpr: number
  ) => {
    ctx.save();
    ctx.scale(globalDpr, globalDpr);
    
    // Batch rendering for better performance
    const particlesByColor = new Map<string, Array<{x: number, y: number, size: number}>>();
    
    particles.forEach((particle, index) => {
      if (particle.opacity <= 0.01) return; // Skip nearly invisible particles
      
      const x = particle.x / globalDpr;
      const y = particle.y / globalDpr;
      
      // Convert HSL to RGB for rainbow effect (cached)
      const [r, g, b] = hslToRgb(particle.hue, particle.saturation, particle.lightness);
      const color = `rgba(${r}, ${g}, ${b}, ${Math.min(particle.opacity, 1)})`;
      
      // INCREASED SIZE - Made particles much larger
      const size = 4.5 + Math.sin(Date.now() * 0.003 + particle.floatingAngle) * 2.0; // Increased from 1.5 + 0.5
      
      if (!particlesByColor.has(color)) {
        particlesByColor.set(color, []);
      }
      particlesByColor.get(color)!.push({ x, y, size });
    });
    
    // Render particles in batches by color
    particlesByColor.forEach((positions, color) => {
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8; // Increased glow for larger particles
      
      positions.forEach(({ x, y, size }) => {
        ctx.fillRect(x - size/2, y - size/2, size, size);
      });
    });
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    
    ctx.restore();
  }, [hslToRgb]);

  // Render canvas
  const renderCanvas = useCallback(() => {
    if (!wrapperRef.current || !canvasRef.current || !wrapperSize.width || !wrapperSize.height) return;
    
    const canvas = canvasRef.current;
    const { width, height } = wrapperSize;
    
    canvas.width = width * globalDpr;
    canvas.height = height * globalDpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Calculate text position
    const textX = canvas.width / 2 + 35 * globalDpr;
    const textY = canvas.height / 2;
    
    // Create font string
    const font = `${fontWeight} ${fontSize * globalDpr}px ${fontFamily}`;
    
    // Create particles from text
    const particles = createParticles(ctx, canvas, text, textX, textY, font, color, transformedDensity);
    
    // Store particles for later use
    particlesRef.current = particles;
    
    // Render particles
    renderParticles(ctx, particles, globalDpr);
  }, [wrapperSize, globalDpr, text, fontSize, fontFamily, fontWeight, color, transformedDensity, createParticles, renderParticles]);

  // Animation loop - optimized with throttling
  useEffect(() => {
    let frameCount = 0;
    const animate = (currentTime: number) => {
      frameCount++;
      
      // Throttle animation to 30fps for better performance
      if (frameCount % 2 !== 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      const deltaTime = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;
      
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      
      if (!canvas || !ctx || !particlesRef.current.length) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      updateParticles(
        particlesRef.current,
        deltaTime,
        isHovered,
        showText,
        setShowText,
        spread,
        speed
      );
      
      renderParticles(ctx, particlesRef.current, globalDpr);
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isHovered, showText, spread, speed, globalDpr, updateParticles, renderParticles]);

  // Handle resize - debounced
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (wrapperRef.current && textDimensions.width && textDimensions.height) {
          // Responsive padding based on screen size and font size
          const isMobile = window.innerWidth < 768;
          const basePadding = isMobile ? Math.max(fontSize * 0.3, 20) : Math.max(fontSize * 0.5, 40);
          
          const minWidth = Math.max(textDimensions.width + basePadding * 2, isMobile ? 120 : 200);
          const minHeight = Math.max(textDimensions.height + basePadding * 2, isMobile ? 60 : 100);
          
          // Get container constraints with responsive maxWidth
          const parentRect = wrapperRef.current.parentElement?.getBoundingClientRect();
          const viewportMargin = isMobile ? 0.95 : 0.9;
          const maxWidth = parentRect ? parentRect.width * viewportMargin : window.innerWidth * viewportMargin;
          const maxHeight = parentRect ? parentRect.height * viewportMargin : window.innerHeight * viewportMargin;
          
          const finalWidth = Math.min(minWidth, maxWidth);
          const finalHeight = Math.min(minHeight, maxHeight);
          
          setWrapperSize({ width: finalWidth, height: finalHeight });
        }
      }, 100); // Debounce resize
    };

    // Initial resize
    if (textDimensions.width && textDimensions.height) {
      handleResize();
    }
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [textDimensions, fontSize]);

  // Render canvas when size changes
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Event handlers
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    setHasBeenShown(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (resetOnMouseLeave || !hasBeenShown) {
      setIsHovered(false);
    }
  }, [resetOnMouseLeave, hasBeenShown]);

  return (
    <div
      ref={wrapperRef}
      className={`relative flex items-center justify-center overflow-hidden rounded-lg transition-all duration-300 ${className}`}
      style={{
        width: wrapperSize.width || 'auto',
        height: wrapperSize.height || 'auto',
        minWidth: '150px',
        minHeight: '80px',
        maxWidth: '100%',
        backgroundColor: 'rgba(15, 15, 15, 0.8)',
        border: isHovered 
          ? '1px solid #ff004f' 
          : '1px solid rgba(255, 255, 255, 0.2)',
        
        boxShadow: isHovered 
          ? '0 0 10px #4285f4, 0 0 20px #d93025, 0 0 30px #f9ab00, 0 0 40px #34a853' 
          : 'none',
        backdropFilter: 'blur(10px)',
        cursor: 'default',
        ...style
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Animated text that appears on hover */}
      <div
        className={`absolute z-20 transition-opacity duration-300 ${
          showText ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          color,
          fontFamily,
          fontWeight,
          fontSize: `${fontSize}px`,
          userSelect: 'text',
          cursor: 'text',
          whiteSpace: 'nowrap',
          left: '60%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          backgroundColor: 'transparent', // Background to hide particles
          padding: '4px 8px',
          borderRadius: '4px'
        }}
      >
        {text}
      </div>
      
      {/* Canvas for particle system */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        style={{ zIndex: 10 }} // Lower z-index than text
      />
    </div>
  );
};