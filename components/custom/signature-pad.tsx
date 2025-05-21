/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import type React from "react";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eraser, Download, Undo, Check } from "lucide-react";

export interface Point {
  x: number;
  y: number;
  time: number;
  pressure?: number;
}

export interface SignatureLine {
  points: Point[];
  color: string;
  width: number;
}

export interface SignaturePadProps {
  /** Width of the signature pad */
  width?: number | string;
  /** Height of the signature pad */
  height?: number | string;
  /** Background color of the signature pad */
  backgroundColor?: string;
  /** Default pen color */
  penColor?: string;
  /** Default pen width */
  penWidth?: number;
  /** Border radius of the signature pad */
  borderRadius?: number | string;
  /** Border color of the signature pad */
  borderColor?: string;
  /** Border width of the signature pad */
  borderWidth?: number | string;
  /** Title of the signature pad */
  title?: string;
  /** Description of the signature pad */
  description?: string;
  /** Placeholder text when signature is empty */
  placeholder?: string;
  /** Whether to show the toolbar */
  showToolbar?: boolean;
  /** Whether to show the clear button */
  showClearButton?: boolean;
  /** Whether to show the undo button */
  showUndoButton?: boolean;
  /** Whether to show the download button */
  showDownloadButton?: boolean;
  /** Whether to show the done button */
  showDoneButton?: boolean;
  /** Callback when signature is done */
  onDone?: (data: {
    svg: string;
    points: SignatureLine[];
    isEmpty: boolean;
  }) => void;
  /** Callback when signature changes */
  onChange?: (data: {
    svg: string;
    points: SignatureLine[];
    isEmpty: boolean;
  }) => void;
  /** Callback when signature is cleared */
  onClear?: () => void;
  /** Class name for the signature pad */
  className?: string;
  /** Class name for the canvas */
  canvasClassName?: string;
  /** Class name for the toolbar */
  toolbarClassName?: string;
  /** Whether the signature pad is disabled */
  disabled?: boolean;
  /** Whether to trim empty space around the signature */
  trim?: boolean;
  /** Whether to scale the signature to fit the canvas */
  scale?: boolean;
  /** Whether to show the signature pad in a card */
  card?: boolean;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  width = "100%",
  height = 200,
  backgroundColor = "transparent",
  penColor = "#000000",
  penWidth = 2,
  borderRadius = "0.5rem",
  borderColor = "#e2e8f0",
  borderWidth = 1,
  title = "Signature",
  description = "Please sign using your mouse or touch screen",
  placeholder = "Sign here",
  showToolbar = true,
  showClearButton = true,
  showUndoButton = true,
  showDownloadButton = true,
  showDoneButton = true,
  onDone,
  onChange,
  onClear,
  className,
  canvasClassName,
  toolbarClassName,
  disabled = false,
  trim = true,
  scale = true,
  card = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState(penColor);
  const [currentWidth, setCurrentWidth] = useState(penWidth);

  console.log({ scale, setCurrentColor, setCurrentWidth });
  const [lines, setLines] = useState<SignatureLine[]>([]);
  const [currentLine, setCurrentLine] = useState<SignatureLine | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw existing lines
    drawLines(ctx, lines);
  }, [backgroundColor, lines]);

  // Draw all lines
  const drawLines = (
    ctx: CanvasRenderingContext2D,
    linesToDraw: SignatureLine[],
  ) => {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    linesToDraw.forEach((line) => {
      if (line.points.length < 2) return;

      ctx.beginPath();
      ctx.moveTo(line.points[0].x, line.points[0].y);

      for (let i = 1; i < line.points.length; i++) {
        const p1 = line.points[i - 1];
        const p2 = line.points[i];

        // Use quadratic curves for smoother lines
        const cx = (p1.x + p2.x) / 2;
        const cy = (p1.y + p2.y) / 2;

        ctx.quadraticCurveTo(p1.x, p1.y, cx, cy);
      }

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.width;
      ctx.stroke();
    });
  };

  // Handle mouse/touch down
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newLine: SignatureLine = {
      points: [{ x, y, time: Date.now(), pressure: e.pressure }],
      color: currentColor,
      width: currentWidth * (e.pressure || 1),
    };

    setCurrentLine(newLine);
    setIsDrawing(true);
    setIsEmpty(false);
  };

  // Handle mouse/touch move
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled || !currentLine) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newPoint: Point = {
      x,
      y,
      time: Date.now(),
      pressure: e.pressure,
    };

    const updatedLine = {
      ...currentLine,
      points: [...currentLine.points, newPoint],
      width: currentWidth * (e.pressure || 1),
    };

    setCurrentLine(updatedLine);

    // Draw the updated line
    ctx.beginPath();

    if (currentLine.points.length >= 1) {
      const prevPoint = currentLine.points[currentLine.points.length - 1];
      ctx.moveTo(prevPoint.x, prevPoint.y);
      ctx.lineTo(x, y);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = currentLine.color;
      ctx.lineWidth = updatedLine.width;
      ctx.stroke();
    }
  };

  // Handle mouse/touch up
  const handlePointerUp = () => {
    if (!isDrawing || disabled || !currentLine) return;

    setIsDrawing(false);

    if (currentLine.points.length > 0) {
      setLines([...lines, currentLine]);

      // Trigger onChange
      if (onChange) {
        const svgData = getSvgData();
        onChange({
          svg: svgData,
          points: [...lines, currentLine],
          isEmpty: false,
        });
      }
    }

    setCurrentLine(null);
  };

  // Handle pointer leave
  const handlePointerLeave = () => {
    handlePointerUp();
  };

  // Clear the signature
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    setLines([]);
    setIsEmpty(true);

    if (onClear) {
      onClear();
    }

    if (onChange) {
      onChange({
        svg: getSvgData(),
        points: [],
        isEmpty: true,
      });
    }
  };

  // Undo the last line
  const handleUndo = () => {
    if (lines.length === 0) return;

    const newLines = [...lines];
    newLines.pop();
    setLines(newLines);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawLines(ctx, newLines);

    setIsEmpty(newLines.length === 0);

    if (onChange) {
      onChange({
        svg: getSvgData(),
        points: newLines,
        isEmpty: newLines.length === 0,
      });
    }
  };

  // Get SVG data
  const getSvgData = (): string => {
    const canvas = canvasRef.current;
    if (!canvas) return "";

    // Find the bounding box of the signature
    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let maxX = 0;
    let maxY = 0;

    lines.forEach((line) => {
      line.points.forEach((point) => {
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);
      });
    });

    // Add padding
    const padding = 10;
    minX = Math.max(0, minX - padding);
    minY = Math.max(0, minY - padding);
    maxX = Math.min(canvas.width, maxX + padding);
    maxY = Math.min(canvas.height, maxY + padding);

    // Calculate dimensions
    const width = trim ? maxX - minX : canvas.width;
    const height = trim ? maxY - minY : canvas.height;

    // Create SVG
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${
      trim
        ? `${minX} ${minY} ${width} ${height}`
        : `0 0 ${canvas.width} ${canvas.height}`
    }">
      <g>`;

    lines.forEach((line) => {
      if (line.points.length < 2) return;

      let pathData = `M ${line.points[0].x} ${line.points[0].y}`;

      for (let i = 1; i < line.points.length; i++) {
        const p1 = line.points[i - 1];
        const p2 = line.points[i];
        const cx = (p1.x + p2.x) / 2;
        const cy = (p1.y + p2.y) / 2;

        pathData += ` Q ${p1.x} ${p1.y} ${cx} ${cy}`;
      }

      svg += `<path d="${pathData}" fill="none" stroke="${line.color}" strokeWidth="${line.width}" strokeLinecap="round" strokeLinejoin="round" />`;
    });

    svg += `</g></svg>`;

    return svg;
  };

  // Download the signature as SVG
  const handleDownload = () => {
    const svg = getSvgData();
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "signature.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle done
  const handleDone = () => {
    if (onDone) {
      onDone({
        svg: getSvgData(),
        points: lines,
        isEmpty,
      });
    }
  };

  const renderCanvas = () => (
    <div
      className={cn("relative", canvasClassName)}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        borderRadius:
          typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius,
        border: `${borderWidth}px solid ${borderColor}`,
        backgroundColor,
      }}
    >
      {isEmpty && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-gray-400">
          {placeholder}
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="h-full w-full cursor-crosshair touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        style={{
          borderRadius:
            typeof borderRadius === "number"
              ? `${borderRadius}px`
              : borderRadius,
        }}
      />
    </div>
  );

  const renderToolbar = () => (
    <div
      className={cn("mt-2 flex items-center justify-between", toolbarClassName)}
    >
      <div className="flex items-center gap-2">
        {showClearButton && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={isEmpty || disabled}
          >
            <Eraser className="mr-1 h-4 w-4" />
            Clear
          </Button>
        )}
        {showUndoButton && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleUndo}
            disabled={lines.length === 0 || disabled}
          >
            <Undo className="mr-1 h-4 w-4" />
            Undo
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {showDownloadButton && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={isEmpty || disabled}
          >
            <Download className="mr-1 h-4 w-4" />
            Download
          </Button>
        )}
        {showDoneButton && (
          <Button
            variant="default"
            size="sm"
            onClick={handleDone}
            disabled={isEmpty || disabled}
          >
            <Check className="mr-1 h-4 w-4" />
            Done
          </Button>
        )}
      </div>
    </div>
  );

  if (card) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{renderCanvas()}</CardContent>
        <CardFooter>{showToolbar && renderToolbar()}</CardFooter>
      </Card>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {renderCanvas()}
      {showToolbar && renderToolbar()}
    </div>
  );
};
