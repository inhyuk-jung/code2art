'use client';

import dynamic from 'next/dynamic';
import { CodeMetrics } from '@/lib/analyzer';
import { useRef } from 'react';
import { Download } from 'lucide-react';
import { ArtStyle } from '@/components/CodeEditor';
import { useLocale } from '@/context/LocaleContext';

// Dynamically import react-p5 to avoid SSR issues with window object
const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
    ssr: false,
});

interface ArtCanvasProps {
    metrics: CodeMetrics;
    artStyle: ArtStyle;
}

export default function ArtCanvas({ metrics, artStyle }: ArtCanvasProps) {
    const { t } = useLocale();
    const containerRef = useRef<HTMLDivElement>(null);
    const p5InstanceRef = useRef<any>(null);

    const setup = (p5: any, canvasParentRef: Element) => {
        p5InstanceRef.current = p5;
        // Make canvas responsive to parent container
        const width = containerRef.current?.offsetWidth || 500;
        const height = containerRef.current?.offsetHeight || 400;
        p5.createCanvas(width, height).parent(canvasParentRef);
        p5.noLoop(); // Draw once
    };

    const draw = (p5: any) => {
        const width = p5.width;
        const height = p5.height;

        // Base background based on consistency
        const bgHue = p5.map(metrics.consistency, 0, 1, 0, 200);
        p5.colorMode(p5.HSB, 360, 100, 100);
        p5.background(bgHue, 10, 95);

        // Map metrics to drawing parameters
        const shapeCount = p5.map(metrics.complexity, 0, 1, 100, 600);
        const shapeSize = p5.map(metrics.cohesion, 0, 1, 180, 50);
        const connectionCount = p5.map(metrics.coupling, 0, 1, 20, 200);

        const nodes: { x: number, y: number }[] = [];

        p5.noStroke();
        for (let i = 0; i < shapeCount; i++) {
            const x = p5.random(-shapeSize, width + shapeSize);
            const y = p5.random(-shapeSize, height + shapeSize);
            nodes.push({ x, y });

            const h = p5.random(bgHue - 40, bgHue + 40);
            const s = p5.random(40, 90);
            const b = p5.random(50, 100);

            p5.fill(h, s, b, 0.8);

            if (artStyle === 'kandinsky') {
                // Kandinsky: Geometric synthesis
                p5.push();
                p5.translate(x, y);
                p5.rotate(p5.random(p5.TWO_PI));
                p5.stroke(0, 0, 10, 0.8);
                p5.strokeWeight(1.5);

                const rChoice = p5.random();
                if (rChoice > 0.6) {
                    p5.circle(0, 0, shapeSize);
                } else if (rChoice > 0.3) {
                    p5.rectMode(p5.CENTER);
                    p5.rect(0, 0, shapeSize, shapeSize * 0.6);
                } else {
                    p5.triangle(-shapeSize / 2, shapeSize / 2, shapeSize / 2, shapeSize / 2, 0, -shapeSize / 2);
                }

                // Add some math-like lines
                if (p5.random() > 0.7) {
                    p5.line(-shapeSize, -shapeSize, shapeSize, shapeSize);
                }
                p5.pop();

            } else if (artStyle === 'vangogh') {
                // Van Gogh: Thick impasto, swirling
                p5.push();
                p5.translate(x, y);
                p5.noFill();
                const vColor = p5.random() > 0.5 ? p5.color(210, 80, 70, 0.6) : p5.color(45, 90, 90, 0.6); // Blue/Yellow
                p5.stroke(vColor);
                p5.strokeWeight(p5.random(5, 15));

                p5.beginShape();
                let cx = 0, cy = 0;
                for (let v = 0; v < 5; v++) {
                    p5.curveVertex(cx, cy);
                    cx += p5.random(-20, 20);
                    cy += p5.random(-20, 20);
                }
                p5.endShape();
                p5.pop();

            } else if (artStyle === 'monet') {
                // Monet: Soft light, blurred
                const mH = p5.random(180, 260); // Blue/Purple
                const mS = p5.random(20, 50);
                const mB = p5.random(80, 100);
                p5.fill(mH, mS, mB, 0.3);
                p5.noStroke();
                p5.ellipse(x, y, shapeSize * 1.5, shapeSize * 0.8);

            } else if (artStyle === 'dali') {
                // Dali: Surrealist precision
                p5.push();
                p5.translate(x, y);
                p5.stroke(0, 0, 10, 0.9);
                p5.strokeWeight(1);
                p5.fill(h, s, b, 0.7);

                // Melting-like organic shape
                p5.beginShape();
                for (let a = 0; a < p5.TWO_PI; a += 0.5) {
                    const r = shapeSize * (1 + 0.5 * p5.sin(a * 3));
                    p5.vertex(r * p5.cos(a), r * p5.sin(a) + r * 0.5); // Stretched downward
                }
                p5.endShape(p5.CLOSE);
                p5.pop();

            } else if (artStyle === 'basquiat') {
                // Basquiat: Urban energy
                p5.push();
                p5.translate(x, y);
                p5.stroke(0, 0, 0);
                p5.strokeWeight(3);
                p5.fill(h, 95, 90);

                if (p5.random() > 0.8) {
                    // Primitive crown
                    p5.beginShape();
                    p5.vertex(-20, 10);
                    p5.vertex(-20, -10);
                    p5.vertex(-10, 0);
                    p5.vertex(0, -10);
                    p5.vertex(10, 0);
                    p5.vertex(20, -10);
                    p5.vertex(20, 10);
                    p5.endShape(p5.CLOSE);
                } else {
                    p5.rectMode(p5.CENTER);
                    p5.rect(0, 0, shapeSize, shapeSize);
                    p5.line(-shapeSize / 2, -shapeSize / 2, shapeSize / 2, shapeSize / 2);
                }
                p5.pop();

            } else {
                // Default: Simple geometric
                p5.circle(x, y, shapeSize * 0.5);
            }
        }

        // Connections
        p5.stroke(0, 0, 20, 0.4);
        p5.strokeWeight(2);
        for (let i = 0; i < connectionCount; i++) {
            if (nodes.length > 1) {
                const n1 = nodes[Math.floor(p5.random(nodes.length))];
                const n2 = nodes[Math.floor(p5.random(nodes.length))];
                p5.line(n1.x, n1.y, n2.x, n2.y);
            }
        }

        // Texture
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
                {t('result.download')}
            </button>
        </div>
    );
}
