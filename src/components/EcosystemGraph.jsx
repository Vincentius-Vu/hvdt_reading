import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import SpriteText from 'three-spritetext';
import { ecosystemData } from '../data/index.js';

const EcosystemGraph = forwardRef(({ onNodeClick }, ref) => {
  const fgRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Tái sử dụng Materials để tối ưu GPU/Memory (tránh tạo mới Material cho mỗi node)
  const materials = useRef({
    macro: new THREE.MeshLambertMaterial({ color: '#ffd700', transparent: true, opacity: 0.9 }),
    micro: new THREE.MeshLambertMaterial({ color: '#4ade80', transparent: true, opacity: 0.9 }),
    pressure: new THREE.MeshLambertMaterial({ color: '#f43f5e', transparent: true, opacity: 0.9 }),
    default: new THREE.MeshLambertMaterial({ color: '#8a8a9e', transparent: true, opacity: 0.9 }),
    aura: new THREE.MeshBasicMaterial({ 
      color: '#ffaa00', transparent: true, opacity: 0.15, 
      blending: THREE.AdditiveBlending, side: THREE.BackSide 
    })
  }).current;

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useImperativeHandle(ref, () => ({
    focusNode: (node) => {
      if (!fgRef.current || node.x === undefined) return;
      const distance = 80;
      const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
        node,
        2000
      );
    }
  }));

  useEffect(() => {
    // Add some initial spin or camera positioning
    if (fgRef.current) {
      fgRef.current.cameraPosition({ z: 400 });
      // Add bloom or subtle post processing if needed
    }
  }, []);

  const nodeThreeObject = (node) => {
    const group = new THREE.Group();

    // Core Sphere (Giảm phân giải lưới từ mặc định xuống 16x16 để tăng FPS)
    const geometry = new THREE.SphereGeometry(node.val || 5, 16, 16);
    const material = materials[node.type] || materials.default;
    const sphere = new THREE.Mesh(geometry, material);
    group.add(sphere);

    // Text Label (Sprite)
    const sprite = new SpriteText(node.label);
    sprite.color = node.type === 'macro' ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.7)';
    sprite.textHeight = node.type === 'macro' ? 4 : 2.5;
    sprite.position.y = (node.val || 5) + (node.type === 'macro' ? 4 : 3);
    sprite.fontWeight = node.type === 'macro' ? 'bold' : 'normal';
    group.add(sprite);

    // VRC Aura (Emergent Property) around MCC
    if (node.id === 'MCC') {
      const auraGeo = new THREE.SphereGeometry((node.val || 5) * 4, 32, 32);
      const aura = new THREE.Mesh(auraGeo, materials.aura);
      // Đã loại bỏ vòng lặp requestAnimationFrame gây memory leak tại đây. 
      // ForceGraph tự động xử lý render loop, tạo vòng lặp thủ công sẽ làm tràn RAM/CPU.
      group.add(aura);
    }

    return group;
  };

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <ForceGraph3D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={ecosystemData}
      nodeThreeObject={nodeThreeObject}
      nodeLabel="label"
      onNodeClick={onNodeClick}
      backgroundColor="#050508"
      // Link styling
      linkColor={(link) => {
        if (link.type === 'negative') return 'rgba(244, 63, 94, 0.4)';
        if (link.type === 'macro') return 'rgba(255, 215, 0, 0.6)';
        if (link.type === 'feedback') return 'rgba(255, 170, 0, 0.8)';
        return 'rgba(74, 222, 128, 0.2)'; // micro roots
      }}
      linkWidth={(link) => {
        if (link.type === 'macro' || link.type === 'feedback') return 2;
        if (link.type === 'negative') return 1.5;
        return 0.5; // micro roots
      }}
      linkDirectionalParticles={(link) => {
        if (link.type === 'macro' || link.type === 'causal' || link.type === 'feedback') return 3;
        if (link.type === 'negative') return 0; // Negative pressure absorbs, no flowing particles
        return 1; // slow flow for micro roots
      }}
      linkDirectionalParticleWidth={(link) => {
        if (link.type === 'feedback') return 4;
        return 2;
      }}
      linkDirectionalParticleSpeed={(link) => {
        if (link.type === 'feedback') return 0.01;
        return 0.005;
      }}
      // Physics tweaks
      d3Force={(d3, graph) => {
        // Adjust link distance
        graph.d3Force('link').distance(link => {
          if (link.type === 'negative') return 150;
          if (link.type === 'macro') return 80;
          return 40;
        });
        // Adjust charge
        graph.d3Force('charge').strength(-200);
      }}
      />
    </div>
  );
});

export default EcosystemGraph;
