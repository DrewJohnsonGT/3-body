import {
  IonContent,
  IonHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

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
        <IonText color="primary">
          <h1>Who</h1>
        </IonText>
        <IonText>
          My name is Drew and I&apos;m a software engineer and a big fan of the
          book series (and now Netflix show)
          <br />
          <a href="https://en.wikipedia.org/wiki/The_Three-Body_Problem_(novel)">
            The Three Body Problem
          </a>
          <br /> I wanted to create a simple simulation of the three body
          problem to help me visualize the complexity of these types of
          gravitational systems. I hope you enjoy it too!
        </IonText>
        <IonText color="primary">
          <h1>What</h1>
        </IonText>
        <IonText>
          The three-body problem is a special case of the n-body problem. Unlike
          two-body problems, there is no general closed-form solution for every
          condition, and it is one of the great unsolved problems in physics.
          The three-body problem is to determine the motion of three point
          particles that interact only by their mutual gravitational attraction.
        </IonText>
        <IonText color="primary">
          <h1>Why</h1>
        </IonText>
      </IonContent>
    </IonPage>
  );
};
