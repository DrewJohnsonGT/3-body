import {
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { helpCircle, informationCircle, personCircle } from 'ionicons/icons';

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
    <div
      className="ion-margin"
      style={{
        display: 'flex',
        flexDirection: 'column',
        lineHeight: '1.25',
        margin: 'auto',
        marginBottom: '2rem',
        maxWidth: '600px',
      }}>
      <IonCard
        style={{
          alignItems: 'center',
          border: '2px solid var(--ion-color-primary-shade)',
          display: 'inline-flex',
          gap: 3,
          justifyContent: 'center',
          margin: '1.5rem auto',
          padding: '0.25rem 0.5rem',
        }}>
        <h1
          style={{
            color: 'var(--ion-color-primary)',
            fontSize: '2rem',
            margin: 0,
            marginBottom: 0,
            padding: 0,
          }}>
          {title}
        </h1>
        <IonIcon icon={icon} size="large" color="primary" />
      </IonCard>
      <IonText>{body}</IonText>
    </div>
  );
};

export const AboutPage = () => {
  return (
    <IonPage
      onClick={(e) => {
        e.stopPropagation();
      }}>
      <IonHeader>
        <IonToolbar>
          <IonTitle
            style={{
              textAlign: 'center',
            }}>
            About
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-text-center ion-padding">
        <AboutSection
          title="Who"
          body={
            <>
              <img
                src="/images/profile-cropped.jpg"
                alt="Drew"
                style={{ borderRadius: '50%', width: '100px' }}
              />
              <br />
              My name is Drew, and I&apos;m a software engineer. I&apos;m also a
              big fan of the book series (and now Netflix show)
              <br />
              <a href="https://en.wikipedia.org/wiki/The_Three-Body_Problem_(novel)">
                The Three Body Problem
              </a>
              <br />
              which inspired me to create this app!
            </>
          }
          icon={personCircle}
        />
        <AboutSection
          title="What"
          body={
            <>
              The three-body problem is a special case of the{' '}
              <a href="https://en.wikipedia.org/wiki/N-body_problem">
                N-body problem
              </a>
              .
              <br />
              The three-body problem is to determine the motion of three point
              particles that interact only by their mutual gravitational
              attraction. <br />
              <br />
              Unlike two-body problems, there is no general closed-form solution
              for every condition, and it is one of the great unsolved problems
              in physics.
            </>
          }
          icon={informationCircle}
        />
        <AboutSection
          title="Why"
          body={
            <>
              I wanted to create a simple simulation of the 3+ body problem to
              help me visualize and appreciate the complexity of these types of
              gravitational systems. <br />I hope you enjoy it too!
            </>
          }
          icon={helpCircle}
        />
        <br />
        <br />
        <a href="https://drewj.dev">https://drewj.dev</a>
      </IonContent>
    </IonPage>
  );
};
