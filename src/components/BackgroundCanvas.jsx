/**
 * Lightweight Canvas Background
 * Wireframe grid with glowing nodes and connections
 * 
 * Features:
 * - Animated wireframe grid (40px spacing)
 * - ~30 glowing nodes that pulse
 * - Nodes connect when distance < 140px
 * - Mouse parallax effect
 * - Performant with requestAnimationFrame
 */

import React, { useEffect, useRef } from 'react';

const BackgroundCanvas = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const nodesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Set canvas size
    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initializeNodes();
    };

    resizeCanvas();

    // Initialize nodes
    const initializeNodes = () => {
      nodesRef.current = [];
      const nodeCount = 30;
      
      for (let i = 0; i < nodeCount; i++) {
        nodesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3, // Slow movement
          vy: (Math.random() - 0.5) * 0.3,
          radius: 2 + Math.random() * 2,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.02
        });
      }
    };

    initializeNodes();

    // Mouse move handler (throttled)
    let mouseTimeout;
    const handleMouseMove = (e) => {
      if (mouseTimeout) return;
      mouseTimeout = setTimeout(() => {
        mouseRef.current = { x: e.clientX, y: e.clientY };
        mouseTimeout = null;
      }, 50);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation variables
    let gridOffset = 0;
    const gridSize = 40;
    const gridSpeed = 0.2;

    // Animation loop
    const animate = () => {
      // Clear canvas
      ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // Calculate parallax offset based on mouse position
      const parallaxX = (mouseRef.current.x / width - 0.5) * 20;
      const parallaxY = (mouseRef.current.y / height - 0.5) * 20;

      // Draw wireframe grid
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.03)';
      ctx.lineWidth = 1;

      gridOffset += gridSpeed;
      if (gridOffset >= gridSize) gridOffset = 0;

      // Vertical lines
      for (let x = -gridSize + gridOffset + parallaxX; x < width + gridSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = -gridSize + gridOffset + parallaxY; y < height + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update and draw nodes
      const nodes = nodesRef.current;
      
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Keep in bounds
        node.x = Math.max(0, Math.min(width, node.x));
        node.y = Math.max(0, Math.min(height, node.y));

        // Update pulse
        node.pulsePhase += node.pulseSpeed;
        const pulse = Math.sin(node.pulsePhase) * 0.5 + 0.5;

        // Draw connections to nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 140) {
            const opacity = (1 - distance / 140) * 0.3;
            ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }

        // Draw node with glow
        const glowSize = node.radius + pulse * 4;
        
        // Outer glow
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, glowSize
        );
        gradient.addColorStop(0, `rgba(0, 240, 255, ${0.8 * pulse})`);
        gradient.addColorStop(0.5, `rgba(0, 240, 255, ${0.3 * pulse})`);
        gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Core node
        ctx.fillStyle = `rgba(0, 240, 255, ${0.9 + pulse * 0.1})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Throttled resize handler
    let resizeTimeout;
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 200);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      if (mouseTimeout) clearTimeout(mouseTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ 
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)'
      }}
    />
  );
};

export default BackgroundCanvas;
