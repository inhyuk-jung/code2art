'use client';

import dynamic from 'next/dynamic';
import { CodeMetrics } from '@/lib/analyzer';
import { useRef } from 'react';
import { Download } from 'lucide-react';
import { ArtStyle } from '@/components/CodeEditor';

// Dynamically import react-p5 to avoid SSR issues with window object
const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
    ssr: false,
});

interface ArtCanvasProps {
    metrics: CodeMetrics;
    artStyle: ArtStyle;
}

export default function ArtCanvas({ metrics, artStyle }: ArtCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const p5InstanceRef = useRef<any>(null);

    const setup = (p5: any, canvasParentRef: Element) => {
        p5InstanceRef.current = p5;
        // Make canvas responsive to parent container
        const width = containerRef.current?.offsetWidth || 500;
        const height = containerRef.current?.offsetHeight || 400;
        p5.createCanvas(width, height).parent(canvasParentRef);
        p5.noLoop(); // We will draw once, or we can loop for animation
    };

    const draw = (p5: any) => {
        const width = p5.width;
        const height = p5.height;

        // Base background based on consistency (0.0 to 1.0)
        // High consistency = calm background, low consistency = noisy background
        const bgHue = p5.map(metrics.consistency, 0, 1, 0, 200);
        p5.colorMode(p5.HSB, 360, 100, 100);
        p5.background(bgHue, 10, 95);

        // Complexity dictates how many shapes/lines we draw (Multiplying significantly for a fuller canvas)
        const shapeCount = p5.map(metrics.complexity, 0, 1, 100, 600);

        // Cohesion dictates the size/closeness of shapes
        const shapeSize = p5.map(metrics.cohesion, 0, 1, 180, 50);

        // Coupling dictates how many lines connect the shapes
        const connectionCount = p5.map(metrics.coupling, 0, 1, 20, 200);

        const nodes: { x: number, y: number }[] = [];

        // Draw abstract shapes
        p5.noStroke();
        for (let i = 0; i < shapeCount; i++) {
            // Expand drawing area slightly outside bounds to ensure edge filling
            const x = p5.random(-shapeSize, width + shapeSize);
            const y = p5.random(-shapeSize, height + shapeSize);
            nodes.push({ x, y });

            const h = p5.random(bgHue - 40, bgHue + 40);
            const s = p5.random(40, 90);
            const b = p5.random(50, 100);

            p5.fill(h, s, b, 0.8);

            if (artStyle === 'pollock') {
                // Pollock: Splatters, erratic lines
                p5.push();
                p5.translate(x, y);
                p5.rotate(p5.random(p5.TWO_PI));

                // Draw splatters
                const splatterDrops = p5.floor(p5.random(10, 25));
                for (let d = 0; d < splatterDrops; d++) {
                    const dropX = p5.random(-shapeSize, shapeSize);
                    const dropY = p5.random(-shapeSize, shapeSize);
                    const dropSize = p5.random(2, 10);
                    p5.circle(dropX, dropY, dropSize);
                }

                // Draw erratic lines (drip lines)
                p5.stroke(h, s, b, 0.8);
                p5.strokeWeight(p5.random(1, 4));
                p5.noFill();
                p5.beginShape();
                for (let v = 0; v < 5; v++) {
                    p5.curveVertex(p5.random(-shapeSize * 2, shapeSize * 2), p5.random(-shapeSize * 2, shapeSize * 2));
                }
                p5.endShape();
                p5.pop();

            } else if (artStyle === 'picasso') {
                // Picasso: Cubism, sharp intersecting arbitrary polygons (Eye Removed)
                p5.push();
                p5.translate(x, y);
                const sides = p5.floor(p5.random(3, 7));
                p5.rotate(p5.random(p5.TWO_PI));

                p5.stroke(0, 0, 10, 0.8);
                p5.strokeWeight(2);
                p5.fill(h, s, b, 0.7);

                p5.beginShape();
                for (let v = 0; v < sides; v++) {
                    const r = shapeSize * p5.random(0.5, 2.5);
                    const angle = p5.map(v, 0, sides, 0, p5.TWO_PI);
                    p5.vertex(r * p5.cos(angle), r * p5.sin(angle));
                }
                p5.endShape(p5.CLOSE);
                p5.pop();

            } else if (artStyle === 'munch') {
                // Munch: Swirling lines, agonizing curves, intense contrasting colors
                p5.push();
                p5.translate(x, y);
                p5.noFill();

                // Emulate thick, swirling brush strokes
                const strokeH = p5.random() > 0.5 ? h : (h + 180) % 360; // Complementary color for anxiety
                p5.stroke(strokeH, 80, 70, 0.6);
                p5.strokeWeight(p5.random(4, 12));

                p5.beginShape();
                let curX = 0;
                let curY = 0;
                for (let v = 0; v < 6; v++) {
                    p5.curveVertex(curX, curY);
                    curX += p5.random(-shapeSize, shapeSize);
                    // Strong downward/swirling bias
                    curY += p5.random(shapeSize * 0.5, shapeSize * 1.5);
                }
                p5.endShape();
                p5.pop();

            } else if (artStyle === 'mrdoodle') {
                // Mr Doodle: Dense, continuous black and white quirky characters/squiggles
                p5.push();
                p5.translate(x, y);

                // Thick black marker
                p5.stroke(0, 0, 10);
                p5.strokeWeight(p5.random(3, 6));

                if (p5.random() > 0.4) {
                    p5.fill(0, 0, 100); // White inside
                } else if (p5.random() > 0.8) {
                    p5.fill(h, s, b); // Occasional pop color
                } else {
                    p5.fill(0, 0, 10); // Black fill
                }

                // Draw irregular blobby "doodle" shapes
                const blobSides = p5.floor(p5.random(5, 12));
                p5.beginShape();
                for (let v = 0; v < blobSides; v++) {
                    const angle = p5.map(v, 0, blobSides, 0, p5.TWO_PI);
                    const r = shapeSize * p5.random(0.5, 1.3);
                    p5.curveVertex(r * p5.cos(angle), r * p5.sin(angle));
                }
                p5.endShape(p5.CLOSE);

                // Add faces or patterns inside the doodles
                if (p5.random() > 0.5) {
                    p5.fill(0, 0, 10);
                    p5.noStroke();
                    // Eyes
                    p5.circle(-shapeSize * 0.3, -shapeSize * 0.2, shapeSize * 0.15);
                    p5.circle(shapeSize * 0.3, -shapeSize * 0.2, shapeSize * 0.15);
                    // Smile
                    p5.stroke(0, 0, 10);
                    p5.strokeWeight(3);
                    p5.noFill();
                    p5.arc(0, shapeSize * 0.1, shapeSize * 0.6, shapeSize * 0.4, 0, p5.PI);
                } else if (p5.random() > 0.7) {
                    // Lines/Zebra pattern
                    p5.stroke(0, 0, 10);
                    p5.strokeWeight(3);
                    p5.line(-shapeSize * 0.5, -shapeSize * 0.5, shapeSize * 0.5, shapeSize * 0.5);
                    p5.line(-shapeSize * 0.5, shapeSize * 0.5, shapeSize * 0.5, -shapeSize * 0.5);
                }

                p5.pop();

            } else if (artStyle === 'popart') {
                // Pop Art: Ben-Day dots, thick outlines, highly saturated primary colors
                p5.push();
                p5.translate(x, y);

                // Highly saturated colors (CMYK-ish vibe)
                const popColors = [
                    [0, 80, 90],    // Red/Magenta
                    [200, 80, 90],  // Cyan/Blue
                    [60, 90, 90]    // Yellow
                ];
                const col = p5.random(popColors);

                // Thick black stroke
                p5.stroke(0, 0, 10);
                p5.strokeWeight(4);

                if (metrics.coupling > 0.5 && p5.random() > 0.7) {
                    // Draw Ben-day dots mask
                    p5.fill(0, 0, 95); // White base
                    const boxSize = shapeSize * 1.5;
                    p5.rectMode(p5.CENTER);
                    p5.rect(0, 0, boxSize, boxSize);

                    p5.noStroke();
                    p5.fill(col[0], col[1], col[2]);
                    const dotSize = 6;
                    for (let i = -boxSize / 2 + dotSize; i < boxSize / 2; i += dotSize * 2) {
                        for (let j = -boxSize / 2 + dotSize; j < boxSize / 2; j += dotSize * 2) {
                            p5.circle(i, j, dotSize);
                        }
                    }
                } else {
                    // Solid bright shape
                    p5.fill(col[0], col[1], col[2]);
                    if (p5.random() > 0.5) {
                        p5.circle(0, 0, shapeSize * 1.5);
                    } else {
                        p5.rectMode(p5.CENTER);
                        p5.rect(0, 0, shapeSize * 1.5, shapeSize * 1.5);
                    }
                }
                // Exclamations or bursts
                if (p5.random() > 0.9) {
                    p5.fill(0, 0, 10);
                    p5.noStroke();
                    p5.triangle(-10, -20, 10, -20, 0, 0);
                    p5.circle(0, 10, 8);
                }
                p5.pop();

            } else {
                // Mondrian: Strictly orthogonal lines and primary colors (adapted to base hue), geometric perfection
                p5.push();
                // Snap coordinates to a grid for Mondrian effect
                const gridSize = 30; // Smaller grid for a fuller canvas
                const snappedX = p5.round(x / gridSize) * gridSize;
                const snappedY = p5.round(y / gridSize) * gridSize;

                // Mostly white/black/grey, occasionally primary (or the base theme color)
                p5.stroke(0, 0, 10);
                p5.strokeWeight(4);

                const randColor = p5.random();
                if (randColor > 0.6) {
                    p5.fill(h, 80, 80); // Colorful rectangle
                } else if (randColor > 0.3) {
                    p5.fill(0, 0, 15); // Black/Dark rectangle
                } else {
                    p5.fill(0, 0, 95); // White rectangle
                }

                p5.rectMode(p5.CORNER);
                const wMultiplier = p5.floor(p5.random(1, 6));
                const hMultiplier = p5.floor(p5.random(1, 6));
                p5.rect(snappedX, snappedY, gridSize * wMultiplier, gridSize * hMultiplier);

                // Draw long horizontal/vertical black lines to simulate grid intersections
                p5.strokeWeight(p5.random(2, 6));
                if (p5.random() > 0.5) {
                    p5.line(snappedX, 0, snappedX, height);
                } else {
                    p5.line(0, snappedY, width, snappedY);
                }

                p5.pop();
            }
        }

        // Draw coupling threads
        p5.stroke(0, 0, 20, 0.4);
        p5.strokeWeight(2);
        for (let i = 0; i < connectionCount; i++) {
            if (nodes.length > 1) {
                const n1 = nodes[Math.floor(p5.random(nodes.length))];
                const n2 = nodes[Math.floor(p5.random(nodes.length))];
                p5.line(n1.x, n1.y, n2.x, n2.y);
            }
        }

        // Add noise texture overlay
        p5.loadPixels();
        for (let i = 0; i < p5.pixels.length; i += 4) {
            const noise = p5.random(-15, 15);
            p5.pixels[i] += noise;
            p5.pixels[i + 1] += noise;
            p5.pixels[i + 2] += noise;
        }
        p5.updatePixels();
    };

    const handleDownload = () => {
        if (p5InstanceRef.current) {
            p5InstanceRef.current.save('code_art.png');
        }
    };

    return (
        <div className="w-full flex flex-col justify-center items-center h-full gap-4">
            <div ref={containerRef} className="neo-box bg-white w-full max-w-2xl h-[400px] md:h-[500px] overflow-hidden relative">
                <Sketch setup={setup} draw={draw} className="w-full h-full" />
                <div className="absolute bottom-4 right-4 bg-white/80 neo-box-sm px-3 py-1 text-xs font-bold pointer-events-none z-10">
                    Is My Code Art?
                </div>
            </div>
            <button
                onClick={handleDownload}
                className="neo-box-sm px-6 py-2 bg-primary text-primary-foreground font-bold flex items-center gap-2 hover:bg-[#ffafa0]"
            >
                <Download size={20} />
                Download Masterpiece
            </button>
        </div>
    );
}
