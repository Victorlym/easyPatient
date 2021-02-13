import axios from "axios";

// GET PATIENTS
function getPatientsStart() {
  return {
    type: "FETCH_PATIENTS_START",
  };
}

function getPatientsSuccess(page, response) {
  return {
    type: "FETCH_PATIENTS_SUCCESS",
    patients: response,
    hasMore: response.length > 0,
    page: page
  };
}

function getPatientsFail(err) {
  return {
    type: "FETCH_PATIENTS_FAIL",
    error: err
  };
}

export function getPatients(page, order, orderBy, search) {
  return (dispatch) => {
    dispatch(getPatientsStart());
    axios({
      method: 'get', 
      url: "http://localhost:8080/api/patients?"+
            "order=" + order + "&&" +
            "orderBy=" + orderBy + "&&" +
            "page=" + page + "&&" + 
            "search=" + search
    })
      .then(response => {
        dispatch(getPatientsSuccess(page, response.data.patient.docs));
        console.log(response);
      })
      .catch(err => {
        dispatch(getPatientsFail(err));
      });
  };
}

// ADD PATIENT
function addPatientStart() {
  return {
    type: "ADD_PATIENT_START"
  };
}

function addPatientSuccess(response) {
  return {
    type: "ADD_PATIENT_SUCCESS"
  }
}

function addPatientFail(err) {
  return {
    type: "ADD_PATIENT_FAIL",
    error: err
  };
}

export function addPatient(patient, ownProps) {
  return (dispatch) => {
    dispatch(addPatientStart());
    axios
      .post("http://localhost:8080/api/patient", patient)
      .then(response => {
        dispatch(addPatientSuccess(response));
        ownProps.history.push('/');
      })
      .catch(err => {
        dispatch(addPatientFail(err));
      });
  };
}

// EDIT PATIENT
function editPatientStart() {
  return {
    type: "EDIT_PATIENT_START"
  };
}

function editPatientSuccess() {
  return {
    type: "EDIT_PATIENT_SUCCESS"
  };
}

function editPatientFail(err) {
  return {
    type: "EDIT_PATIENT_FAIL",
    error: err
  };
}

export function editPatient(id, patient, ownProps) {
  return (dispatch) => {
    dispatch(editPatientStart());
    axios
      .put(`http://localhost:8080/api/patient/${id}`, patient)
      .then(response => {
        dispatch(editPatientSuccess(response))
        ownProps.history.push('/');
      })
      .catch(err => {
        dispatch(editPatientFail(err));
      });
  };
}

// DELETE PATIENT
function deletePatientStart() {
  return {
    type: "DELETE_PATIENT_START"
  };
}

function deletePatientSuccess() {
  return {
    type: "DELETE_PATIENT_SUCCESS"
  };
}

function deletePatientFail(err) {
  return {
    type: "DELETE_PATIENT_FAIL",
    error: err
  };
}

export function deletePatient(id) {
  return (dispatch) => {
    dispatch(deletePatientStart());
    axios
      .delete(`http://localhost:8080/api/patient/${id}`)
      .then(response => {
        dispatch(deletePatientSuccess(response));
      })
      .catch(err => {
        dispatch(deletePatientFail(err))
      });
  };
}

// GET DOCTORS
function getAssignedDoctorsStart() {
  return {
    type: "GET_DOCTORS_START"
  };
}

function getAssignedDoctorsSuccess(response) {
  return {
    type: "GET_DOCTORS_SUCCESS",
    patients: response,
    hasMore: response.length > 0
  };
}

function getAssignedDoctorsFail(err) {
  return {
    type: "GET_DOCTORS_FAIL",
    error: err
  };
}

export function getAssignedDoctors(id) {
  return (dispatch) => {
    dispatch(getAssignedDoctorsStart());
    axios
      .get(`http://localhost:8080/api/patient/assignedDoctors/${id}`)
      .then(response => {
        dispatch(getAssignedDoctorsSuccess(response.data.assignedDoctors))
      })
      .catch(err => {
        dispatch(getAssignedDoctorsFail(err));
      });
  };
}

// GET DOCTOR
function getDoctorStart() {
  return {
    type: "GET_DOCTOR_START"
  };
}

function getDoctorSuccess(response) {
  return {
    type: "GET_DOCTOR_SUCCESS",
    patients: response,
    hasMore: response.length > 0
  };
}

function getDoctorFail(err) {
  return {
    type: "GET_DOCTOR_FAIL",
    error: err
  };
}

export function getDoctor(id) {
  return (dispatch) => {
    dispatch(getDoctorStart());
    axios
      .get(`http://localhost:8080/api/patient/doctor/${id}`)
      .then(response => {
        dispatch(getDoctorSuccess(response.data.doctor))
      })
      .catch(err => {
        dispatch(getDoctorFail(err));
      });
  };
}

// GET VALID DOCTORS
function getValidDoctorsStart() {
  return {
    type: "FETCH_VALID_DOCTORS_START"
  };
}

function getValidDoctorsSuccess(response) {
  return {
    type: "FETCH_VALID_DOCTORS_SUCCESS",
    validDoctors: response
  };
}

function getValidDoctorsFail(err) {
  return {
    type: "FETCH_VALID_DOCTORS_FAIL",
    error: err
  };
}

export function getValidDoctors(id) {
  return (dispatch) => {
    dispatch(getValidDoctorsStart());
    axios
      .get(`http://localhost:8080/api/patient/validDoctors/${id}`)
      .then(response => {
        dispatch(getValidDoctorsSuccess(response.data.validDoctors));
      })
      .catch(err => {
        dispatch(getValidDoctorsFail(err));
      });
  }
}

// GET ALL DOCTORS
function getAllDoctorsStart() {
  return {
    type: "FETCH_ALL_DOCTORS_START"
  };
}

function getAllDoctorsSuccess(response) {
  return {
    type: "FETCH_ALL_DOCTORS_SUCCESS",
    allDoctors: response
  };
}

function getAllDoctorsFail(err) {
  return {
    type: "FETCH_ALL_DOCTORS_FAIL",
    error: err
  };
}

export function getAllDoctors() {
  return (dispatch) => {
    dispatch(getAllDoctorsStart());
    axios
      .get(`http://localhost:8080/api/patient/allDoctors`)
      .then(response => {
        dispatch(getAllDoctorsSuccess(response.data.validDoctors));
      })
      .catch(err => {
        dispatch(getAllDoctorsFail(err))
      });
  }
}

// CLEAR PATIENTS IN STORE
export function reset() {
  return {
    type: "RESET",
  };
}



