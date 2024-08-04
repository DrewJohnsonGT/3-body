import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { APP_NAME } from '~/constants';
import { useLocalStorage } from '~/hooks/useLocalStorage';
import { Body } from '~/utils/Body';
import { Particle } from '~/utils/Particle';
import { System } from '~/utils/systems';

const getSettingsState = (allState: State) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { bodies, particles, ...settingsState } = allState;
  return settingsState;
};

export type NewBodyType = 'random' | 'custom';

const DEFAULT_STATE = {
  bodies: [] as Body[],
  gravityMultiplier: 1,
  isRunning: true,
  newBodyColor: '#ffffff',
  newBodyMass: 50,
  newBodyType: 'random' as NewBodyType,
  particles: [] as Particle[],
  restartSelectedSystem: false,
  selectedSystem: System.CIRCLE,
  showTrails: true,
  speed: 1,
  tapToCreate: true,
  trailLength: 20,
  zoom: 1,
};

export type State = typeof DEFAULT_STATE;
export type Dispatch = React.Dispatch<Actions>;

export enum ActionType {
  Restart = 'RESTART',
  SetIsRunning = 'SET_IS_RUNNING',
  AddBody = 'ADD_BODY',
  SetBodies = 'SET_BODIES',
  SetParticles = 'SET_PARTICLES',
  SetSelectedSystem = 'SET_SELECTED_SYSTEM',
  SetGravityMultiplier = 'SET_GRAVITY_MULTIPLIER',
  SetShowTrails = 'SET_SHOW_TRAILS',
  SetTrailLength = 'SET_TRAIL_LENGTH',
  ZoomIn = 'ZOOM_IN',
  ZoomOut = 'ZOOM_OUT',
  ToggleTapToCreate = 'TOGGLE_TAP_TO_CREATE',
  SystemRestarted = 'SYSTEM_RESTARTED',
  SetSpeed = 'SET_SPEED',
  SetNewBodyType = 'SET_NEW_BODY_TYPE',
  SetNewBodyMass = 'SET_NEW_BODY_MASS',
  SetNewBodyColor = 'SET_NEW_BODY_COLOR',
  MergeLocalStorageState = 'MERGE_LOCAL_STORAGE_STATE',
}

interface Payloads extends Record<ActionType, unknown> {
  [ActionType.SetIsRunning]: boolean;
  [ActionType.AddBody]: Body;
  [ActionType.SetParticles]: Particle[];
  [ActionType.SetBodies]: Body[];
  [ActionType.SetSelectedSystem]: System;
  [ActionType.Restart]: undefined;
  [ActionType.SetGravityMultiplier]: number;
  [ActionType.SetShowTrails]: boolean;
  [ActionType.SetTrailLength]: number;
  [ActionType.ZoomIn]: undefined;
  [ActionType.ZoomOut]: undefined;
  [ActionType.ToggleTapToCreate]: undefined;
  [ActionType.SystemRestarted]: undefined;
  [ActionType.SetSpeed]: number;
  [ActionType.SetNewBodyType]: NewBodyType;
  [ActionType.SetNewBodyMass]: number;
  [ActionType.SetNewBodyColor]: string;
  [ActionType.MergeLocalStorageState]: Partial<State>;
}
export type ActionMap<M extends Record<ActionType, unknown>> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type Actions = ActionMap<Payloads>[keyof ActionMap<Payloads>];

const reducer = (state: typeof DEFAULT_STATE, action: Actions) => {
  console.log('action', action);
  switch (action.type) {
    case ActionType.SetIsRunning:
      return {
        ...state,
        isRunning: action.payload,
      };
    case ActionType.Restart:
      return {
        ...state,
        restartSelectedSystem: true,
      };
    case ActionType.SetSelectedSystem:
      return {
        ...state,
        selectedSystem: action.payload,
      };
    case ActionType.AddBody:
      return {
        ...state,
        bodies: [...state.bodies, action.payload],
      };
    case ActionType.SetBodies:
      return {
        ...state,
        bodies: action.payload,
      };
    case ActionType.SetParticles:
      return {
        ...state,
        particles: action.payload,
      };
    case ActionType.SetGravityMultiplier:
      return {
        ...state,
        gravityMultiplier: action.payload,
      };
    case ActionType.SetShowTrails:
      return {
        ...state,
        showTrails: action.payload,
      };
    case ActionType.SetTrailLength:
      return {
        ...state,
        trailLength: action.payload,
      };
    case ActionType.ZoomIn:
      return {
        ...state,
        zoom: state.zoom * 2,
      };
    case ActionType.ZoomOut:
      return {
        ...state,
        zoom: state.zoom / 2,
      };
    case ActionType.ToggleTapToCreate:
      return {
        ...state,
        tapToCreate: !state.tapToCreate,
      };
    case ActionType.SystemRestarted:
      return {
        ...state,
        restartSelectedSystem: false,
      };
    case ActionType.SetSpeed:
      return {
        ...state,
        speed: action.payload,
      };
    case ActionType.SetNewBodyType:
      return {
        ...state,
        newBodyType: action.payload,
      };
    case ActionType.SetNewBodyMass:
      return {
        ...state,
        newBodyMass: action.payload,
      };
    case ActionType.SetNewBodyColor:
      return {
        ...state,
        newBodyColor: action.payload,
      };
    case ActionType.MergeLocalStorageState:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

const AppContext = createContext<{
  dispatch: Dispatch;
  state: State;
}>({
  dispatch: () => null,
  state: DEFAULT_STATE,
});

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);
  const { get, set } = useLocalStorage<Partial<State>>(
    `${APP_NAME.toLowerCase()}-settings`,
    {},
  );
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    console.log('Get local storage effect');
    get()
      .then((data) => {
        console.log('Got local storage', data);
        dispatch({ payload: data, type: ActionType.MergeLocalStorageState });
        setHasLoaded(true);
      })
      .catch((e: unknown) => {
        console.log('Error getting local storage', e);
      });
  }, []);

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }
    console.log('Set local storage effect');
    const settingsState = getSettingsState(state);
    set(settingsState)
      .then(() => {
        console.log('Set local storage', settingsState);
      })
      .catch((e: unknown) => {
        console.log('Error setting local storage', e);
      });
  }, [state]);

  return (
    <AppContext.Provider value={{ dispatch, state }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const { dispatch, state } = useContext(AppContext);

  return { dispatch, state };
};
