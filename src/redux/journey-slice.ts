export interface JourneySliceState {
  bcbpData: string | null;
  bcbpFields: {
    surname?: string;
    givenName?: string;
  };
}

const initialState: JourneySliceState = {
  bcbpData: null,
  bcbpFields: {},
};

export const SET_BCBP_DATA = 'hkia/journey/setBCBPData';

export function setBCBPData(data: any) {
  return { type: SET_BCBP_DATA, payload: data };
}

export function journeyReducer(
  state = initialState,
  action: { type: string; payload?: any }
): JourneySliceState {
  switch (action.type) {
    case SET_BCBP_DATA:
      return { ...state, bcbpData: action.payload };
    default:
      return state;
  }
}

export default journeyReducer;
