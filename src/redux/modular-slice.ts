export interface ModularSliceState {
  bagDropAppId: string;
  bagDropApiKey: string;
  claimTagJson: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ModularSliceState = {
  bagDropAppId: '',
  bagDropApiKey: '',
  claimTagJson: null,
  loading: false,
  error: null,
};

export function modularSdkReducer(
  state = initialState,
  action: { type: string; payload?: any }
): ModularSliceState {
  switch (action.type) {
    case 'hkia/modular/setBagDropCredentials':
      return { ...state, bagDropAppId: action.payload.appId, bagDropApiKey: action.payload.apiKey };
    case 'hkia/modular/bagDropSuccess':
      return { ...state, claimTagJson: action.payload, loading: false };
    default:
      return state;
  }
}

export default modularSdkReducer;
