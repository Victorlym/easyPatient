// for admin to delete and modify appointment in the future
//have't implemtn yet
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import * as actions from "../../redux/actions";

const getBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};
class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: "",
      name: "",
      specialist: "",
      sex: "M",
      startDate: "",
      cellPhone: "",
      email: "",
      doctorOption: "null",
      doctor: null,
      doctorName: null
    };
  }

  componentDidMount() {
    this.props.getValidDoctors(this.props.match.params.id);

    this.props.patients.forEach(patient => {
      if (patient._id === this.props.match.params.id) {
        this.setState({
          avatar: patient.avatar,
          name: patient.name,
          specialist: patient.specialist === null ? "" : patient.specialist,
          sex: patient.sex === null ? "M" : patient.sex,
          startDate: new Date(patient.startDate).toISOString().split('T')[0],  
          cellPhone: patient.cellPhone === null ? "" : patient.cellPhone,
          email: patient.email === null ? "" : patient.email,
          doctorOption:
            patient.doctor === null
              ? "null"
              : patient.doctor + "-" + patient.doctorName,
          doctor: patient.doctor,
          doctorName: patient.doctorName
        });
      }
    });
    
  }

  avatarChange = e => {
    if (e.target.value) {
      let file = e.target.files[0];
      getBase64(file).then(base64 => {
        this.setState({ avatar: base64 });
      });
    }
  };

  nameChange = e => {
    this.setState({ name: e.target.value });
  };

  specialistChange = e => {
    this.setState({ specialist: e.target.value });
  };

  sexChange = e => {
    this.setState({ sex: e.target.value });
  };

  startDateChange = e => {
    this.setState({ startDate: e.target.value });
  };

  cellPhoneChange = e => {
    this.setState({ cellPhone: e.target.value });
  };

  emailChange = e => {
    this.setState({ email: e.target.value });
  };

  doctorChange = e => {
    if (e.target.value === "null") {
      this.setState({
        doctor: null,
        doctorName: null,
        doctorOption: "null"
      });
    } else {
      let doctorInfo = e.target.value.split("-");
      let id = doctorInfo[0];
      let name = doctorInfo[1];
      this.setState({
        doctor: id,
        doctorName: name,
        doctorOption: e.target.value
      });
    }
  };

  onSubmit = e => {
    e.preventDefault();
    let patient = {
      avatar: this.state.avatar,
      name: this.state.name,
      specialist: this.state.specialist,
      sex: this.state.sex,
      startDate:this.state.startDate,
      cellPhone: this.state.cellPhone,
      email: this.state.email,
      doctor: this.state.doctor,
      doctorName: this.state.doctorName
    };
    this.props.onSave(this.props.match.params.id, patient);
  };

  render() {
      return (
        <div className="edit-patient">
          <form className="myForm" onSubmit={this.onSubmit}>
            <div className="header">
              <h2 className="head">Edit Patient</h2>
            </div>
            <div className="form-content">
            <div>
              <img className="avatar-large" src={this.state.avatar} alt="avatar"/>
                <div>Please select a photo as avator</div>
                <label
                  className="upload-file"
                  htmlFor="my-upload-btn"
                >
                  <input
                    id="my-upload-btn"
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    onChange={this.avatarChange}
                  />
                </label>
              </div>
              <div className="form-left">
                <div className="form-group row">
                  <label htmlFor="name">Name<span className="require-star">*</span>:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    onChange={this.nameChange}
                    value={this.state.name}
                    placeholder="Name"
                    required
                  />
                </div>
                <div className="form-group row">
                  <label htmlFor="specialist">Specialist:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="specialist"
                    onChange={this.specialistChange}
                    value={this.state.specialist}
                    placeholder="Specialist"
                  />
                </div>
                <div className="form-group row">
                  <label htmlFor="sex">Sex<span className="require-star">*</span>:</label>
                  <select
                    className="form-control"
                    id="sex"
                    onChange={this.sexChange}
                    value={this.state.sex}
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
               <div className="form-group row">
                  <label htmlFor="startDate">Appointment Date <span className="require-star">*</span>:</label>
                  <input
                    type="date"
                    className="form-control"
                    id="startDate"
                    onChange={this.startDateChange}
                    value={this.state.startDate}
                    placeholder="Name"
                    required
                  />
                </div>
                <div className="form-group row">
                  <label htmlFor="cellPhone">Cell Phone:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="cellPhone"
                    placeholder="Cell Phone"
                    onChange={this.cellPhoneChange}
                    value={this.state.cellPhone}
                    maxLength="10"
                  />
                </div>
                <div className="form-group row">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Email"
                    onChange={this.emailChange}
                    value={this.state.email}
                  />
                </div>
                <div className="form-group row">
                  <label htmlFor="doctor">Doctor:</label>
                  <select
                    className="form-control"
                    id="doctor"
                    onChange={this.doctorChange}
                    value={this.state.doctorOption}
                  >
                    <option value="null"> </option>
                    
                    { this.props.validDoctors.map(doctor => {
                          return (
                            <option key={doctor._id} value={doctor._id+"-"+doctor.name}>
                              {doctor.name}
                            </option>
                          );
                        })
                      }
                  </select>
                </div>
                <Link to="/">
                  <button type="submit" className="btn btn-secondary back-btn">
                    Back
                  </button>
                </Link>
                <button type="submit" className="btn btn-primary create-btn">
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>
      );
    }
}

const mapStateToProps = state => {
  return {
    patients: state.patients,
    validDoctors: state.validDoctors
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSave: (id, patient) => {
      dispatch(actions.editPatient(id, patient, ownProps));
    },
    getValidDoctors: (id) => {
      dispatch(actions.getValidDoctors(id));
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Edit);
