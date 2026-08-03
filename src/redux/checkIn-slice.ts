export interface CheckInSliceState {
  appId: string;
  apiKey: string;
  isEnrolled: boolean;
  enrollmentToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: CheckInSliceState = {
  appId: '',
  apiKey: '',
  isEnrolled: false,
  enrollmentToken: null,
  loading: false,
  error: null,
};

export const SET_CHECKIN_CREDENTIALS = 'hkia/checkIn/setCredentials';
export const ENROLL_PASSPORT_SUCCESS = 'hkia/checkIn/enrollSuccess';
export const ENROLL_PASSPORT_FAILURE = 'hkia/checkIn/enrollFailure';

export function checkInTokenEnrolmentReducer(
  state = initialState,
  action: { type: string; payload?: any }
): CheckInSliceState {
  switch (action.type) {
    case SET_CHECKIN_CREDENTIALS:
      return { ...state, appId: action.payload.appId, apiKey: action.payload.apiKey };
    case ENROLL_PASSPORT_SUCCESS:
      return {
        ...state,
        isEnrolled: true,
        enrollmentToken: action.payload.token,
        loading: false,
        error: null,
      };
    case ENROLL_PASSPORT_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export default checkInTokenEnrolmentReducer;
