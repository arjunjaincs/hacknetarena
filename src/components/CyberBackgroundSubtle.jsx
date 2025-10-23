/**
 * Subtle 3D Background - Less distracting version for gameplay
 * Blurred and dimmed for better focus
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function CyberBackgroundSubtle({ blur = true }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0e27, 1, 20);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'low-power' // Less intensive
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Lower for performance
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Single subtle sphere
    const geometry = new THREE.SphereGeometry(2, 24, 24);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.15 // Very subtle
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Fewer, smaller particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 800; // Much fewer
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
      
      // Subtle colors
      const colorChoice = Math.random();
      if (colorChoice < 0.5) {
        colors[i * 3] = 0;
        colors[i * 3 + 1] = 0.7;
        colors[i * 3 + 2] = 0.8;
      } else {
        colors[i * 3] = 0.4;
        colors[i * 3 + 1] = 0;
        colors[i * 3 + 2] = 0.6;
      }
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02, // Smaller
      vertexColors: true,
      transparent: true,
      opacity: 0.3, // Very subtle
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 5;

    // Slower, less distracting animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Very slow rotation
      sphere.rotation.x += 0.0003;
      sphere.rotation.y += 0.0005;
      particlesMesh.rotation.y += 0.0002;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className={`fixed inset-0 pointer-events-none ${blur ? 'blur-sm' : ''}`}
      style={{ zIndex: 0, opacity: 0.4 }}
    />
  );
}
