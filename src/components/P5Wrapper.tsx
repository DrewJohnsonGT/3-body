import { useEffect, useRef } from 'react';
import P5 from 'p5';

type Sketch = (p: P5) => void;

interface P5WrapperProps {
  sketch: Sketch;
}

export const P5Wrapper = ({ sketch }: P5WrapperProps) => {
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let myP5: P5;

    if (sketchRef.current) {
      myP5 = new P5(sketch, sketchRef.current);
    }

    return () => {
      myP5.remove();
    };
  }, [sketch]);

  return <div ref={sketchRef}></div>;
};
