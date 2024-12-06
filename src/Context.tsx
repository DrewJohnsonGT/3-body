/* eslint-disable max-lines */
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { RgbColor } from 'react-colorful';
import { Body } from '~/classes/Body';
import { Particle } from '~/classes/Particle';
import { Star } from '~/classes/Star';
import { APP_NAME, MAX_ZOOM, MIN_ZOOM } from '~/constants';
import { useLocalStorage } from '~/hooks/useLocalStorage';
import { ColorPaletteColor } from '~/utils/color';
import { System } from '~/utils/systems';

// Only store certain state in local storage
const getSettingsState = (allState: State) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { bodies, particles, stars, ...settingsState } = allState;
  return settingsState;
};

export type NewBodyType = 'random' | 'custom';
export type NewBodyColorType = 'random' | 'theme' | 'custom';

const DEFAULT_STATE = {
  bodies: [] as Body[],
  centerOffset: { x: 0, y: 0 },
  gravityMultiplier: 1,
  isRunning: true,
  loading: true,
  newBodyColor: { b: 255, g: 255, r: 255 } as RgbColor,
  newBodyColorPalette: ColorPaletteColor.YELLOW,
  newBodyColorType: 'random' as NewBodyColorType,
  newBodyCustomMass: 50,
  newBodyMassType: 'random' as NewBodyType,
  particles: [] as Particle[],
  restartSelectedSystem: false,
  screenSize: { height: 500, width: 500 },
  selectedSystem: System.FIGURE_EIGHT,
  showBodyGlow: true,
  showData: false,
  showStars: true,
  showTrails: true,
  starCount: 400,
  stars: [] as Star[],
  starSize: 1,
  tapToCreate: true,
  trailLength: 250,
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
  SetNewBodyColorType = 'SET_NEW_BODY_COLOR_TYPE',
  SetNewBodyMassType = 'SET_NEW_BODY_MASS_TYPE',
  SetNewBodyMass = 'SET_NEW_BODY_MASS',
  SetNewBodyColor = 'SET_NEW_BODY_COLOR',
  MergeLocalStorageState = 'MERGE_LOCAL_STORAGE_STATE',
  SetStars = 'SET_STARS',
  SetShowStars = 'SET_SHOW_STARS',
  SetNewBodyColorPalette = 'SET_NEW_BODY_COLOR_PALETTE',
  SetScreenSize = 'SET_SCREEN_SIZE',
  SetZoom = 'SET_ZOOM',
  SetStarCount = 'SET_STAR_COUNT',
  SetStarSize = 'SET_STAR_SIZE',
  Pan = 'PAN',
  ResetPan = 'RESET_PAN',
  SetShowData = 'SET_SHOW_DATA',
  Undo = 'UNDO',
  ResetSettings = 'RESET_SETTINGS',
  SetShowBodyGlow = 'SET_SHOW_BODY_GLOW',
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
  [ActionType.SetNewBodyMass]: number;
  [ActionType.SetNewBodyColor]: RgbColor;
  [ActionType.MergeLocalStorageState]: Partial<State>;
  [ActionType.SetStars]: Star[];
  [ActionType.SetShowStars]: boolean;
  [ActionType.SetNewBodyColorType]: NewBodyColorType;
  [ActionType.SetNewBodyMassType]: NewBodyType;
  [ActionType.SetNewBodyColorPalette]: ColorPaletteColor;
  [ActionType.SetScreenSize]: { height: number; width: number };
  [ActionType.SetZoom]: number;
  [ActionType.SetStarCount]: number;
  [ActionType.SetStarSize]: number;
  [ActionType.Pan]: { deltaX: number; deltaY: number };
  [ActionType.ResetPan]: undefined;
  [ActionType.SetShowData]: boolean;
  [ActionType.Undo]: undefined;
  [ActionType.ResetSettings]: undefined;
  [ActionType.SetShowBodyGlow]: boolean;
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
  switch (action.type) {
    case ActionType.SetIsRunning:
      return {
        ...state,
        isRunning: action.payload,
      };
    case ActionType.Restart:
      return {
        ...state,
        centerOffset: DEFAULT_STATE.centerOffset,
        restartSelectedSystem: true,
        zoom: DEFAULT_STATE.zoom,
      };
    case ActionType.SetSelectedSystem:
      return {
        ...state,
        // Reset gravity multiplier when changing systems to ensure they function by default
        gravityMultiplier: DEFAULT_STATE.gravityMultiplier,
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
    case ActionType.Undo:
      return {
        ...state,
        bodies: state.bodies.slice(0, -1),
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
    case ActionType.Pan:
      return {
        ...state,
        centerOffset: {
          x: state.centerOffset.x + action.payload.deltaX,
          y: state.centerOffset.y + action.payload.deltaY,
        },
      };
    case ActionType.ResetPan:
      return {
        ...state,
        centerOffset: DEFAULT_STATE.centerOffset,
      };
    case ActionType.ZoomIn: {
      const newZoom = Math.min(state.zoom * 2, MAX_ZOOM);
      return {
        ...state,
        zoom: newZoom,
      };
    }
    case ActionType.ZoomOut: {
      const newZoom = Math.max(state.zoom / 2, MIN_ZOOM);
      return {
        ...state,
        zoom: newZoom,
      };
    }
    case ActionType.SetZoom: {
      const newZoom = Math.min(Math.max(action.payload, MIN_ZOOM), MAX_ZOOM);
      return {
        ...state,
        zoom: newZoom,
      };
    }
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
    case ActionType.SetNewBodyColorType:
      return {
        ...state,
        newBodyColorType: action.payload,
      };
    case ActionType.SetNewBodyMassType:
      return {
        ...state,
        newBodyMassType: action.payload,
      };
    case ActionType.SetNewBodyMass:
      return {
        ...state,
        newBodyCustomMass: action.payload,
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
        loading: false,
      };
    case ActionType.SetStars:
      return {
        ...state,
        stars: action.payload,
      };
    case ActionType.SetShowStars:
      return {
        ...state,
        showStars: action.payload,
      };
    case ActionType.SetNewBodyColorPalette:
      return {
        ...state,
        newBodyColorPalette: action.payload,
      };
    case ActionType.SetScreenSize:
      return {
        ...state,
        screenSize: action.payload,
      };
    case ActionType.SetStarCount:
      return {
        ...state,
        starCount: action.payload,
      };
    case ActionType.SetStarSize:
      return {
        ...state,
        starSize: action.payload,
      };
    case ActionType.SetShowData:
      return {
        ...state,
        showData: action.payload,
      };
    case ActionType.SetShowBodyGlow:
      return {
        ...state,
        showBodyGlow: action.payload,
      };
    case ActionType.ResetSettings:
      return {
        ...state,
        ...getSettingsState(DEFAULT_STATE),
        loading: false,
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
    get()
      .then((data) => {
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
    const settingsState = getSettingsState(state);
    set(settingsState).catch((e: unknown) => {
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
