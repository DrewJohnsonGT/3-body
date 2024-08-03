import React, { createContext, useContext, useReducer } from 'react';
import { Body } from '~/utils/Body';
import { Particle } from '~/utils/Particle';
import { System } from '~/utils/systems';

const DEFAULT_STATE = {
  bodies: [] as Body[],
  gravityMultiplier: 1,
  isRunning: true,
  particles: [] as Particle[],
  selectedSystem: System.CENTRAL_BODY_ORBIT,
  showTrails: true,
  trailLength: 5,
  zoom: 1
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
        ...DEFAULT_STATE,
        selectedSystem: state.selectedSystem,
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
