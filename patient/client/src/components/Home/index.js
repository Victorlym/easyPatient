import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../redux/actions";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { TableHead, TableSortLabel } from "@material-ui/core";
import EnhancedInfiniteScroll from "./EnhancedInfiniteScroll";
import Patient from "./Patient";
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';

const StyledTableCell = withStyles(theme => ({
  body: {
    fontSize: 14,
    backgroundColor: theme.palette.common.white,
  },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);

const button_style = {
  borderRadius: 3,
  color: 'white',
  height: 48,
  padding: '0 30px',
  margin: '0 10px',
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: "asc",
      orderBy: "null",
      input: "",
      pageStart: 0,
      page: 1
    };
  }

  handleInput = e => {
    this.setState({ 
      input: e.target.value,
      pageStart: this.state.pageStart === 0 ? -1 : 0,
      page: 1
    },
    () => {
      this.props.onToReset();
      this.props.getPatients(1, this.state.order, this.state.orderBy, this.state.input);
      }
    );
    
  };
  
  handleReset = () => {
    this.setState({
      pageStart: this.state.pageStart === 0 ? -1 : 0,
      page: 1,
      input: "",
      order: "asc",
      orderBy: "null"
    }, () => {
      this.props.onToReset();
      this.props.getPatients(1, this.state.order, this.state.orderBy, this.state.input);
    });
    // set reset to true
    
  }

  handleRequestSort = (sortBy) => {
    const {order} = this.state;
      this.setState(
        {
          order: order === "asc" ? "desc" : "asc",
          orderBy: sortBy,
          pageStart: this.state.pageStart === 0 ? -1 : 0,
          page: 1
        },
        () => {
          this.props.onToReset();
          this.props.getPatients(1, this.state.order, this.state.orderBy, this.state.input);
        }
      );
  };


  handleDelete = id => {
    const func1 = () => {
      return new Promise(resolve => {
        resolve(this.props.deletePatient(id));
      })
    }

    const func2 = () => {
      return new Promise(resolve => {
        resolve(this.setState({
          pageStart: this.state.pageStart === 0 ? -1 : 0,
          page: 0
        }))
      })
    }

    async function SerialFlow() {
      await func1();
      await func2();
      return;
    }
    SerialFlow();    
  };

  loadItems = () => {
    let newPage = this.state.page + 1;
    this.setState({
      page: newPage
      }, 
      () => {
        if (!this.props.isLoading) {
          this.props.getPatients(this.state.page, this.state.order, this.state.orderBy, this.state.input)
        }
      }
    )
    console.log(1);
  }

  componentDidMount() {
    this.props.getPatients(1, this.state.order, this.state.orderBy, this.state.input)
    console.log(2);
  }

  
  render() {
    const { 
      patients, 
      patientsStatus, 
      getAssignedDoctors, 
      getDoctor,
      hasMore
    } = this.props;
    
    const { pageStart, order, orderBy } = this.state;

    return (
      <div>
        <h2>Patient Appointment Dashboard</h2>
        <div className="search">
          <div style={{position: "relative", width: "80%", backgroundColor: "#ffffff"}}>
            <SearchIcon style={{position: "absolute", display: "flex", alignItems: "center"}}/>
            <InputBase
              placeholder="Search…"
              value={this.state.input}
              onChange={this.handleInput}
              style={{width: "100%", margin: "0 20px 0 40px"}}
            />
          </div>
          <Button variant="contained" onClick={this.handleReset} style={button_style}>
            Reset Filter
          </Button>
          <Link to="/add" style={{textDecoration: "none", color: "white"}}>
            <Button variant="contained" style={button_style}>
            Add New Patient
            </Button>
          </Link>
        </div>
       
        <EnhancedInfiniteScroll
          className="listWrap"
          pageStart={pageStart}
          initialLoad={false}
          loadMore={this.loadItems}
          hasMore={hasMore}
          threshold={200}
        >
          <Table aria-labelledby="tableSpecialist">
              <TableHead>
                <StyledTableRow>
                    <StyledTableCell
                      style={{fontSize: "14px"}}
                    >
                      Avatar
                    </StyledTableCell>
                      <StyledTableCell
                        style={{fontSize: "14px"}}
                      >
                        <Tooltip
                          specialist={"Sort"}
                          placement={"bottom-end"}
                          enterDelay={300}
                        >
                        <TableSortLabel
                          active={orderBy === "name"}
                          direction={order === "asc" ? "asc" : "desc"}
                          onClick={() => this.handleRequestSort("name")}
                        >
                          Name
                        </TableSortLabel>
                        </Tooltip>
                        
                      </StyledTableCell>
                      <StyledTableCell
                        style={{fontSize: "14px"}}
                      >
                        <Tooltip
                          specialist={"Sort"}
                          placement={"bottom-end"}
                          enterDelay={300}
                        >
                        <TableSortLabel
                          active={orderBy === "specialist"}
                          direction={order === "asc" ? "asc" : "desc"}
                          onClick={() => this.handleRequestSort("specialist")}
                        >
                          Specialist
                        </TableSortLabel>
                        </Tooltip>
                      </StyledTableCell>
                      <StyledTableCell
                        style={{fontSize: "14px"}}
                      >
                        <Tooltip
                          title={"Sort"}
                          placement={"bottom-end"}
                          enterDelay={300}
                        >
                        <TableSortLabel
                          active={orderBy === "sex"}
                          direction={order === "asc" ? "asc" : "desc"}
                          onClick={() => this.handleRequestSort("sex")}
                        >
                          Sex
                        </TableSortLabel>
                        </Tooltip>
                        
                      </StyledTableCell>
                      <StyledTableCell
                        style={{fontSize: "14px"}}
                      >
                          <Tooltip
                          title={"Sort"}
                          placement={"bottom-end"}
                          enterDelay={300}
                        >
                          <TableSortLabel
                            active={orderBy === "startDate"}
                            direction={order === "asc" ? "asc" : "desc"}
                            onClick={() => this.handleRequestSort("startDate")}
                          >
                            Appointment Date
                          </TableSortLabel>
                        </Tooltip>
                      </StyledTableCell>
                      <StyledTableCell
                        style={{fontSize: "14px"}}
                      >
                        Phone Number
                      </StyledTableCell>
                      <StyledTableCell
                        style={{fontSize: "14px"}}
                      >
                          Email
                      </StyledTableCell>
                      <StyledTableCell
                        style={{fontSize: "14px"}}
                      >
                        <Tooltip
                          title={"Sort"}
                          placement={"bottom-end"}
                          enterDelay={300}
                        >
                          <TableSortLabel
                            active={orderBy === "doctorName"}
                            direction={order === "asc" ? "asc" : "desc"}
                            onClick={() => this.handleRequestSort("doctorName")}
                          >
                            Doctor
                          </TableSortLabel>
                        </Tooltip>
                      </StyledTableCell>
{/*
                      <StyledTableCell
                        style={{fontSize: "14px"}}
                      >
                          # of Direct Reports
                      </StyledTableCell>

                      <StyledTableCell
                        style={{fontSize: "14px"}}
                      >
                        Edit
                      </StyledTableCell>

                      <StyledTableCell
                        style={{fontSize: "14px"}}
                      >
                        Delete
                      </StyledTableCell>
*/}

                </StyledTableRow>
              </TableHead>
              <TableBody>
                {patients.map(patient => (
                  <Patient
                    key={patient._id}
                    id={patient._id}
                    patient={patient}
                    patientDelete={() => this.handleDelete(patient._id)}
                    patientAssignedDoctors={() => getAssignedDoctors(patient._id)}
                    patientDoctor={() => getDoctor(patient._id)}
                  />
                ))}
              </TableBody>
          </Table>
        </EnhancedInfiniteScroll>
        <div>
          {
            patientsStatus === "start" 
            && 
            <div className="alert"> Loading... </div>
          }

          {
            !hasMore && patientsStatus !== "fail" 
            &&
            <div className="alert">Reached Bottom</div>
          }
          {
            patientsStatus === "fail" 
            && 
            <div className="alert">Opps! There was an error loading the patients.</div>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    patients: state.patients,
    patientsStatus: state.patientsStatus,
    hasMore: state.hasMore,
    isLoading: state.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getPatients: (page, orderBy, order, search) => {
      dispatch(actions.getPatients(page, orderBy, order, search));
    },
    deletePatient: id => {
      dispatch(actions.deletePatient(id));
    },
    onToReset: () => {
      dispatch(actions.reset());
    },
    getAssignedDoctors: id => {
      dispatch(actions.getAssignedDoctors(id))
    },
    getDoctor: id => {
      dispatch(actions.getDoctor(id))
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
