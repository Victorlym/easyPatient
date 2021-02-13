
const mongoose = require("mongoose");
const express = require("express");
var cors = require('cors');
const bodyParser = require("body-parser");
const logger = require("morgan");
const Patient = require("./Patient");
var ObjectId = require("mongoose").Types.ObjectId;

const API_PORT = 8080;
const app = express();
app.use(cors());
const router = express.Router();

// this is our MongoDB database
const dbRoute = "mongodb+srv://mc-418:I!mokay418@cluster0-lwts0.mongodb.net/test?retryWrites=true";

// connects our back end code with the database
mongoose.connect(
	dbRoute,
	{ useNewUrlParser: true }
);
mongoose.set("useFindAndModify", false);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));
// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));


// LOAD PATIENTS
app.get("/api/patients?", (req, res) => {
	const { page, orderBy, search } = req.query;
	console.log(req.query);
	const order = req.query.order === "asc" ? 1 : -1;
	let options = {
		sort: {
			[orderBy]: order
		},
		page: parseInt(page),
		limit: 12
	};

	let query = {};
	
	query = {
		$or: [
			{ name: new RegExp(search, "i") },
			{ specialist: new RegExp(search, "i") },
			{ cellPhone: new RegExp(search, "i") },
			{ email: new RegExp(search, "i") },
			{ doctorName: new RegExp(search, "i") }
		]
	};


	Patient.paginate(query, options, (err, patient) => {
		if (err) {
			res.status(500).json({ error: err });
		} else {
			res.status(200).json({ patient });
		}
		console.log(patient);
	});

});


// LOAD DOCTORS
app.get("/api/patient/assignedDoctors/:patientId", (req, res) => {
	Patient.findById(req.params["patientId"], (err, patient) => {
		if (err) {
			res.status(500).json({ error: err });
		} else {
			let reports = patient.directReports.toString();
			Patient.find({}, (err, all) => {
				if (err) {
					res.status(500).json({ error: err });
				} else {
					res.status(200).json({
						assignedDoctors: all.filter(em => reports.includes(em.id))
					});
				}
			});
		}
	});
});

// LOAD DOCTORS
app.get("/api/patient/doctor/:patientId", (req, res) => {
	Patient.findById(req.params["patientId"], (err, patient) => {
		if (err) {
			res.status(500).json({ error: err });
		} else {
			let doctor = patient.doctor.toString();
			Patient.find({}, (err, all) => {
				if (err) {
					res.status(500).json({ error: err });
				} else {
					res.status(200).json({
						doctor: all.filter(em => doctor === em.id)
					});
				}
			});
		}
	});
});

// ADD NEW PATIENT
app.post("/api/patient", (req, res) => {
	if (!req.body.doctor) {
		Patient.create(req.body, (err, patient) => {
			if (err) {
				res.status(500).json({ error: err });
			} else {
				Patient.find({}, (err, patient) => {
					if (err) {
						res.status(500).json({ error: err });
					} else {
						res.status(200).json({ patient });
					}
				});
			}
		});
	} else {
		Patient.create(req.body, (err, patient) => {
			if (err) {
				res.status(500).json({ error: err });
			} else {
				Patient.findById(req.body.doctor, (err, doctor) => {
					if (err) {
						res.status(500).json({ error: err });
					} else {
						let newDoctor = Object.assign({}, doctor._doc);
						newDoctor.directReports = [
							...newDoctor.directReports,
							patient._id
						];
						Patient.findByIdAndUpdate(
							req.body.doctor,
							newDoctor,
							(err, doctor) => {
								if (err) {
									res.status(500).json({ error: err });
								} else {
									Patient.find({}, (err, patient) => {
										if (err) {
											res.status(500).json({ error: err });
										} else {
											res.status(200).json({ patient });
										}
									});
								}
							}
						);
					}
				});
			}
		});
	}
});

// EDIT PATIENT
app.put("/api/patient/:patientId", (req, res) => {
	Patient.findByIdAndUpdate(
		req.params["patientId"],
		req.body,
		(err, patient) => {
			if (err) {
				res.status(500).json({ error: err });
			} else {
				if (patient != null) {
					let obj = patient._doc;
					//name change, need to change name for all DRs
					if (obj.name !== req.body.name) {
						if (obj.directReports.length > 0) {
							obj.directReports.forEach(report => {
								Patient.findById(report, (err, patient) => {
									if (err) {
										res.status(500).json({ error: err });
									} else {
										if (patient !== null) {
											let newAssignedDoctor = Object.assign({}, patient._doc);
											newAssignedDoctor.doctorName = req.body.name;
											Patient.findByIdAndUpdate(
												report,
												newAssignedDoctor,
												(err, patient) => {
													if (err) {
														res.status(500).json({ error: err });
													}
												}
											);
										}
									}
								});
							});
						}
					}
					// doctor dosen`t change
					if (obj.doctor===req.body.doctor||(obj.doctor!==null&&obj.doctor.toString() === req.body.doctor)) {
						Patient.findByIdAndUpdate(
							req.params["patientId"],
							req.body,
							(err, patient) => {
								if (err) {
									res.status(500).json({ error: err });
								} else {
									Patient.find({}, (err, patient) => {
										if (err) {
											res.status(500).json({ error: err });
										} else {
											res.status(200).json({ patient });
										}
									});
								}
							}
						);
					} else {
						// delete previous doctor
						if (patient.doctor !== null) {
							Patient.findById(obj.doctor, (err, doctor) => {
								if (err) {
									res.status(500).json({ error: err });
								} else {
									if (doctor !== null) {
										let newDoctor = Object.assign({}, doctor._doc);
										newDoctor.directReports = newDoctor.directReports.filter(
											user => user.toString() !== req.params["patientId"]
										);
										Patient.findByIdAndUpdate(
											obj.doctor,
											newDoctor,
											(err, doctor) => {
												if (err) {
													res.status(500).json({ error: err });
												}
											}
										);
									}
								}
							});
						}

						// add to new doctor`s reportors
						if (req.body.doctor !== null) {
							Patient.findById(req.body.doctor, (err, doctor) => {
								if (err) {
									res.status(500).json({ error: err });
								} else {
									if (doctor !== null) {
										let newDoctor = Object.assign({}, doctor._doc);
										newDoctor.directReports = [
											...newDoctor.directReports,
											obj._id
										];
										Patient.findByIdAndUpdate(
											req.body.doctor,
											newDoctor,
											(err, doctor) => {
												if (err) {
													res.status(500).json({ error: err });
												} else {
													Patient.find({}, (err, patient) => {
														if (err) {
															res.status(500).json({ error: err });
														} else {
															res.status(200).json({ patient });
														}
													});
												}
											}
										);
									}
								}
							});
						}
					}
				}
			}
		}
	);
});

// DELETE PATIENT
app.delete("/api/patient/:patientId", (req, res) => {
	Patient.findByIdAndRemove(req.params["patientId"], (err, patient) => {
		if (err) {
			res.status(500).json({ error: err });
		} else {
			if (patient !== null) {
				let obj = patient._doc;
				// current patient has doctor
				if (obj.doctor !== null) {
					Patient.findById(obj.doctor, (err, doctor) => {
						if (err) {
							res.status(500).json({ error: err });
						} else {
							if (doctor !== null) {
								let newDoctor = Object.assign({}, doctor._doc);
								let index = newDoctor.directReports.indexOf(
									req.params["patientId"]
								);
								newDoctor.directReports.splice(index, 1);
								Patient.findByIdAndUpdate(
									obj.doctor,
									newDoctor,
									(err, doctor) => {
										if (err) {
											res.status(500).json({ error: err });
										} else {
											if (obj.directReports.length > 0) {
												//with doctor and with directReports: delete DR from doctor, update assignedDoctors doctor, update doctor new DR
												obj.directReports.forEach(report => { // update assignedDoctors doctor
													Patient.findById(report, (err, patient) => {
														if (err) {
															res.status(500).json({ error: err });
														} else {
															if (patient !== null) {
																let newAssignedDoctor = Object.assign(
																	{},
																	patient._doc
																);
																newAssignedDoctor.doctor = obj.doctor;
																newAssignedDoctor.doctorName = obj.doctorName;
																Patient.findByIdAndUpdate(
																	report,
																	newAssignedDoctor,
																	(err, patient) => {
																		if (err) {
																			res.status(500).json({ error: err });
																		}
																	}
																);
															}
														}
													});
												});
												Patient.findById(obj.doctor, (err, doctor) => { // add patient's report to doctor
													if (err) {
														res.status(500).json({ error: err });
													} else {
														if (doctor !== null) {
															let newDoctor = Object.assign({}, doctor._doc);
															newDoctor.directReports = [
																...newDoctor.directReports,
																...obj.directReports
															];
															Patient.findByIdAndUpdate(
																obj.doctor,
																newDoctor,
																(err, doctor) => {
																	if (err) {
																		res.status(500).json({ error: err });
																	} else {
																		Patient.find({}, (err, patient) => {
																			if (err) {
																				res.status(500).json({ error: err });
																			} else {
																				res.status(200).json({ patient });
																			}
																		});
																	}
																}
															);
														} else {
															Patient.find({}, (err, patient) => {
																if (err) {
																	res.status(500).json({ error: err });
																} else {
																	res.status(200).json({ patient });
																}
															});
														}
													}
												});
											} else {
												//with doctor but without DR: just delete DR from doctor
												Patient.find({}, (err, patient) => {
													if (err) {
														res.status(500).json({ error: err });
													} else {
														res.status(200).json({ patient });
													}
												});
											}
										}
									}
								);
							}
						}
					});
				} else {
					//without doctor but with DR: set assignedDoctors doctor to null
					if (obj.directReports.length > 0) {
						obj.directReports.forEach(report => {
							Patient.findById(report, (err, patient) => {
								if (err) {
									res.status(500).json({ error: err });
								} else {
									if (patient !== null) {
										let newAssignedDoctor = Object.assign({}, patient._doc);
										newAssignedDoctor.doctor = null;
										newAssignedDoctor.doctorName = null;
										Patient.findByIdAndUpdate(
											report,
											newAssignedDoctor,
											(err, patient) => {
												if (err) {
													res.status(500).json({ error: err });
												}
											}
										);
									}
								}
							});
						});
					}
					//without doctor without DR: just delete the em
					Patient.find({}, (err, patient) => {
						if (err) {
							res.status(500).json({ error: err });
						} else {
							res.status(200).json({ patient });
						}
					});
				}
			} else {
				res.json({ message: "patient doesn`t exist." });
			}
		}
	});
});

// LOAD ALL DOCTORS
app.get("/api/patient/allDoctors", (req, res) => { 
	Patient.find({}, (err, all) => {
		if (err) {
			res.status(500).json({ error: err });
		} else {
			res.status(200).json({
				validDoctors: all.map(m => {
					const r = (({ name, _id }) => ({ name, _id }))(m);
					return r;
				})
			});
		}
	});
});

// LOAD VALID DOCTORS
app.get("/api/patient/validDoctors/:emId", (req, res) => {
	Patient.aggregate(
		[
			{ $match: { _id: mongoose.Types.ObjectId(req.params.emId) } },
			{
				$graphLookup: {
					from: "users",
					startWith: "$directReports",
					connectFromField: "directReports",
					connectToField: "_id",
					as: "chain"
				}
			},
			{
				$project: {
					drChain: "$chain._id"
				}
			}
		],
		(err, results) => {
			if (err) res.status(500).send(err);
			let self = results[0]._id.toString();
			let notValid = results[0].drChain.map(dr => dr.toString());
			Patient.find({}, (err, all) => {
				if (err) {
					res.status(500).json({ error: err });
				} else {
					let doctors = all.filter(
						em => !notValid.includes(em.id) && self !== em.id
					);
					res.status(200).json({
						validDoctors: doctors.map(m => {
							const r = (({ name, _id }) => ({ name, _id }))(m);
							return r;
						})
					});
				}
			});
		}
	);
	
});

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));