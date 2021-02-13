import React from "react";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

const StyledTableRow = withStyles(theme => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    }
  }
}))(TableRow);

const Patient = props => {
  let date = props.patient.startDate.substr(0, 10);
  return (
    <StyledTableRow hover tabIndex={-1} key={props.patient._id}>
      <TableCell>
        {props.patient.avatar === null ||
        props.patient.avatar === "" ? null : (
          <img
            className="avatar-small"
            src={props.patient.avatar}
            alt="avatar"
          />
        )}
      </TableCell>
      <TableCell>{props.patient.name}</TableCell>
      <TableCell>{props.patient.specialist}</TableCell>
      <TableCell>{props.patient.sex}</TableCell>
      <TableCell>{date}</TableCell>
      <TableCell>
        <a href={"tel:" + props.patient.cellPhone}>
          {props.patient.cellPhone}
        </a>
      </TableCell>
      <TableCell>
        <a href={"mailto:" + props.patient.email}>{props.patient.email}</a>
      </TableCell>
      <TableCell>
        {props.patient.doctorName === null ? null : (
          <button
            className="btn btn-link"
            onClick={props.patientDoctor}
            style={{ cursor: "pointer" }}
          >
            {props.patient.doctorName}
          </button>
        )}
      </TableCell>
      {/*
      <TableCell>
        {props.patient.directReports.length === 0 ? (
          0
        ) : (
          <button
            className="btn btn-link"
            onClick={props.patientAssignedDoctors}
            style={{ cursor: "pointer" }}
          >
            {props.patient.directReports.length}
          </button>
        )}
      </TableCell>
        */}
      {/* <TableCell>
          <Tooltip specialist="Edit">
            <IconButton
              aria-label="Edit"
              color="primary"
            >
            <Link to={{ pathname: `/edit/${props.patient._id}` }}>
              <EditIcon />
            </Link>
            </IconButton>
          </Tooltip>
        </TableCell> */}
        {/*
      <TableCell>
        <Tooltip title="Delete">
          <IconButton
            aria-label="Delete"
            color="primary"
            onClick={() => props.patientDelete(props.patient._id)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
        */}
    </StyledTableRow>
  );
};

export default Patient;
