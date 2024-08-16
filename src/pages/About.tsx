import {
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
    <div className="ion-margin">
      <IonText color="primary">
        <h1
          className="ion-justify-content-center ion-align-items-center"
          style={{
            display: 'flex',
            gap: '0.5rem',
          }}>
          {title}
          <IonIcon icon={icon} size="large" />
        </h1>
      </IonText>
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
          <IonTitle>About</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-text-center ion-padding">
        <AboutSection
          title="Who"
          body={
            <div
              className="ion-justify-content-center ion-align-items-center"
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginBottom: '2rem',
              }}>
              <img
                src="/images/profile-cropped.jpg"
                alt="Drew"
                style={{ borderRadius: '50%', width: '100px' }}
              />
              <br />
              My name is Drew and I&apos;m a software engineer and a big fan of
              the book series (and now Netflix show)
              <br />
              <br />
              <a href="https://en.wikipedia.org/wiki/The_Three-Body_Problem_(novel)">
                The Three Body Problem
              </a>
              <br />
              which inspired me to create this app!
            </div>
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
              . Unlike two-body problems, there is no general closed-form
              solution for every condition, and it is one of the great unsolved
              problems in physics. The three-body problem is to determine the
              motion of three point particles that interact only by their mutual
              gravitational attraction.
            </>
          }
          icon={informationCircle}
        />
        <AboutSection
          title="Why"
          body={
            <>
              I wanted to create a simple simulation of the three body problem
              to help me visualize and appreciate the complexity of these types
              of gravitational systems. I hope you enjoy it too!
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
