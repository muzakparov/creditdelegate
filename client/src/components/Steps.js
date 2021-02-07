import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return ["Deposit Collateral", "Approve Borrower"];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return "Select campaign settings...";
    case 1:
      return "What is an ad group anyways?";

    default:
      return "Unknown step";
  }
}

export default function HorizontalLinearStepper({
  instanceCred,
  accounts,
  contract,
}) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getSteps();
  const [amount, setamount] = useState("");

  const isStepOptional = (step) => {
    return step === 0;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleDeposit = async () => {
    // await contract.methods.set(5).send({ from: accounts[0] });
    await instanceCred.methods.depositCollateral("0xaFF4481D10270F50f203E0763e2597776068CBc5",amount).send({ from: accounts[0] });
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === 0 && (
        <div>
          <div
            style={{
              // margin: "auto",
              // textAlign: "center",
              padding: "40px 10px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div style={{ marginRight: 10, verticalAlign: "middle" }}>
              DAI:{" "}
            </div>
            <div>
              <input
                type="text"
                name="amount"
                id="amount"
                placeholder="amount"
                style={{ height: 20 }}
                value={amount}
                onChange={(e) => {
                  setamount(parseInt(e.target.value));
                }}
              />
            </div>
          </div>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <Button
              onClick={handleDeposit}
              variant="contained"
              color="secondary"
            >
              Deposit
            </Button>
          </div>
        </div>
      )}

{activeStep === 1 && (
        <div>
          <div
            style={{
              // margin: "auto",
              // textAlign: "center",
              padding: "40px 10px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div style={{ marginRight: 10, verticalAlign: "middle" }}>
              DAI:{" "}
            </div>
            <div>
              <input
                type="text"
                name="amount"
                id="amount"
                placeholder="amount"
                style={{ height: 20 }}
                value={amount}
                onChange={(e) => {
                  setamount(parseInt(e.target.value));
                }}
              />
            </div>
          </div>
          <div
            style={{
              // margin: "auto",
              // textAlign: "center",
              padding: "40px 10px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div style={{ marginRight: 10, verticalAlign: "middle" }}>
              Delegate To:{" "}
            </div>
            <div>
              <input
                type="text"
                name="address"
                id="address"
                placeholder="address"
                style={{ height: 20 }}
                value={amount}
                onChange={(e) => {
                  setamount(parseInt(e.target.value));
                }}
              />
            </div>
          </div>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <Button
              onClick={handleDeposit}
              variant="contained"
              color="secondary"
            >
              Delegate Credit
            </Button>
          </div>
        </div>
      )}

      <div>
        {activeStep === steps.length ? (
          <div style={{ margin: "auto" }}>
            <Typography className={classes.instructions}>
              You have successfully delegated credit!
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              Delegate a new credit
            </Button>
          </div>
        ) : (
          <div>
            <div style={{ margin: "auto", textAlign: "center" }}>
              {isStepOptional(activeStep) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSkip}
                  className={classes.button}
                >
                  Skip
                </Button>
              )}

              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
