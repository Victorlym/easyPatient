const InitState = {
    patients: [],
    patientsStatus: "",
    hasMore: true,
    validDoctors:[],
    error: null,
    isLoading: false
  };
  
  const reducer = (state = InitState, action) => {
    switch (action.type) {
      case "FETCH_PATIENTS_FAIL":
        return { 
          ...state, 
          patientsStatus: 'fail', 
          error: action.error,
          isLoading: false
        };
      case "FETCH_PATIENTS_START":
        return { 
          ...state, 
          patientsStatus: 'start', 
          page: action.page, 
          isLoading: true
        };
      case "FETCH_PATIENTS_SUCCESS":
        if(action.page === 1) {
          return {
            ...state,
            patientsStatus: 'success',
            patients: action.patients,
            hasMore: action.hasMore,
            isLoading: false
          }
        } else {
          return { 
            ...state, 
            patientsStatus: 'success', 
            patients: [...state.patients,...action.patients], 
            hasMore:action.hasMore,
            isLoading: false
          };
        }
      case "EDIT_PATIENT_START":
        return {
          ...state,
        }
      case "EDIT_PATIENT_SUCCESS":
        return {
          ...state,
          patients: [],
          hasMore: true
        }
      case "EDIT_PATIENT_FAIL":
        return {
          ...state,
          error: action.error
        }
      case "ADD_PATIENT_START":
        return {
          ...state
        }
      case "ADD_PATIENT_SUCCESS":
        return {
          ...state,
          patients: [],
          hasMore: true
        }
      case "ADD_PATIENT_FAIL":
        return {
          ...state,
          error: action.error
      }
      case "DELETE_PATIENT_START":
        return {
          ...state,
        }
      case "DELETE_PATIENT_SUCCESS":
        return {
          ...state,
          patients: [],
          hasMore: true
        }
      case "DELETE_PATIENT_FAIL":
        return {
          ...state,
          error: action.error
        }
      case "GET_DOCTORS_START":
        return {
          ...state
        }
      case "GET_DOCTORS_SUCCESS":
        return {
          ...state,
          patients: action.patients,
          hasMore: true
        }
      case "GET_DOCTORS_FAIL":
        return {
          ...state,
          error: action.error
      }
      case "GET_DOCTOR_START":
        return {
          ...state
        }
      case "GET_DOCTOR_SUCCESS":
        return {
          ...state,
          patients: action.patients,
          hasMore: true
        }
      case "GET_DOCTOR_FAIL":
        return {
          ...state,
          error: action.error
      }
      case "RESET":
        return { 
          ...state, 
          patients: [], 
          hasMore:true,
          isLoading: false
        }
      case "FETCH_VALID_DOCTORS_START":
        return {
          ...state
        }
      case "FETCH_VALID_DOCTORS_SUCCESS":
         return { 
           ...state, 
           validDoctors: action.validDoctors
          };
      case "FETCH_VALID_DOCTORS_FAIL":
          return {
            ...state,
            error: action.error
      }
      case "FETCH_ALL_DOCTORS_START":
        return {
          ...state
        }
      case "FETCH_ALL_DOCTORS_SUCCESS":
         return { 
           ...state, 
           validDoctors: action.allDoctors
          };
      case "FETCH_ALL_DOCTORS_FAIL":
          return {
            ...state,
            error: action.error
      }
      default:
        return state;
    }
  };
  
  export default reducer;