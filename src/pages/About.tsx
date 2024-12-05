import {
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import {
  helpCircleOutline,
  informationCircleOutline,
  personCircleOutline,
} from 'ionicons/icons';
import { APP_VERSION } from '~/constants';

const AboutSection = ({
  body,
  icon,
  title,
}: {
  title: string;
  body: React.ReactNode;
  icon: string;
}) => {
  return (
    <IonCard
      style={{
        border: '2px solid var(--ion-color-medium)',
        margin: '1rem auto',
        maxWidth: '600px',
      }}>
      <div
        style={{
          alignItems: 'center',
          backgroundColor: 'black',
          display: 'flex',
          gap: '0.5rem',
          justifyContent: 'space-between',
          minHeight: '75px',
          padding: '1.5rem',
        }}>
        <IonCardTitle
          style={{
            color: 'var(--ion-color-primary)',
            display: 'flex',
            fontSize: '2rem',
            justifyContent: 'center',
          }}>
          {title}
        </IonCardTitle>
        <IonIcon
          icon={icon}
          size="extra-large"
          color="primary"
          style={{ color: 'white', fontSize: '4rem' }}
        />
      </div>
      <IonCardContent style={{ lineHeight: '1.6' }}>{body}</IonCardContent>
    </IonCard>
  );
};

export const AboutPage = () => {
  return (
    <IonPage
      onClick={(e) => {
        e.stopPropagation();
      }}
      onTouchStart={(e) => {
        e.stopPropagation();
      }}
      onTouchMove={(e) => {
        e.stopPropagation();
      }}
      onTouchEnd={(e) => {
        e.stopPropagation();
      }}>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle
            style={{
              textAlign: 'center',
            }}>
            About
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding ion-text-center">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">About</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonText color="medium">
          Learn more about the app and the inspiration behind it.
        </IonText>
        <AboutSection
          title="Who"
          body={
            <div
              className="ion-text-center"
              style={{ display: 'flex', flexDirection: 'column' }}>
              <img
                src="/images/profile-cropped.jpg"
                alt="Drew"
                style={{
                  border: '4px solid var(--ion-color-primary)',
                  borderRadius: '50%',
                  margin: '1rem auto',
                  width: '120px',
                }}
              />
              <IonText>
                My name is Drew, and I&apos;m a software engineer. I&apos;m also
                a big fan of the book series (and now Netflix show)
              </IonText>
              <a href="https://en.wikipedia.org/wiki/The_Three-Body_Problem_(novel)">
                The Three Body Problem
              </a>
              <IonText>which inspired me to create this app!</IonText>
            </div>
          }
          icon={personCircleOutline}
        />
        <AboutSection
          title="What"
          body={
            <IonText>
              The three-body problem is a special case of the{' '}
              <a href="https://en.wikipedia.org/wiki/N-body_problem">
                N-body problem
              </a>
              . It involves determining the motion of three point particles that
              interact only by their mutual gravitational attraction.
              <br />
              <br />
              Unlike two-body problems, there is no general closed-form solution
              for every condition, making it one of the great unsolved problems
              in physics.
            </IonText>
          }
          icon={informationCircleOutline}
        />
        <AboutSection
          title="Why"
          body={
            <IonText>
              I wanted to create a simple simulation of the 3+ body problem to
              help visualize and appreciate the complexity of these
              gravitational systems. <br />I hope you enjoy it too!
            </IonText>
          }
          icon={helpCircleOutline}
        />
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <a href="mailto:DrewJLLC@gmail.com">DrewJLLC@gmail.com</a>
          <br />
          <a href="https://drewj.dev">https://drewj.dev</a>
          <br />
          <br />
          <br />
          <IonText>{APP_VERSION}</IonText>
        </div>
      </IonContent>
    </IonPage>
  );
};
