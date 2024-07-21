import { IonContent } from '@ionic/react';
import P5 from 'p5';
import { useEffect, useRef } from 'react';
import { CANVAS_CONTAINER_ID } from '~/constants';

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

  return (
    <IonContent>
      <div
        id={CANVAS_CONTAINER_ID}
        ref={sketchRef}
        style={{
          height: '100%',
          overflow: 'hidden',
        }}
      />
    </IonContent>
  );
};
