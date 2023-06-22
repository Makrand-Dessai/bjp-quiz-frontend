import React, { useState, useEffect } from 'react';
import { Typography, Radio, Button, TextField, CircularProgress } from '@material-ui/core';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#e95420', // Custom primary color (BJP saffron)
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif', // Custom font-family
    h4: {
      fontWeight: 700, 
      marginBottom: '1rem',
    },
    h5: {
      fontWeight: 600,
      marginBottom: '0.5rem',
    },
    body1: {
      fontWeight: 400,
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(4),
    padding: theme.spacing(4),
    borderRadius: theme.spacing(2),
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
  },
  languageSelection: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(4),
  },
  languageButton: {
    marginRight: theme.spacing(2),
  },
  questionContainer: {
    textAlign: 'center',
    marginBottom: theme.spacing(2),
    color: '#000000', // Custom text color (black)
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '240px',
    marginTop: theme.spacing(2),
  },
  submitContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(4),
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '300px',
  },
}));

const QuizApp = () => {
  const classes = useStyles();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [percentageCorrect, setPercentageCorrect] = useState(0);
  const [percentageWrong, setPercentageWrong] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await fetch(`https://bjp-quiz-backend-lzy3caj3ca-el.a.run.app/quiz?language=${selectedLanguage.toLowerCase()}`);
      const data = await response.json();
      setQuestions(data);
      setAnswers(new Array(data.length).fill(''));
      setIsLoading(false);
    };

    fetchQuestions();
  }, [selectedLanguage]);

  const handleOptionSelect = (option) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = option;
    setAnswers(updatedAnswers);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    const payload = {
      name,
      email,
      phone,
      answers: answers.map((answer, index) => ({
        questionId: questions[index]._id,
        answer,
      })),
    };

    const response = await fetch('https://bjp-quiz-backend-lzy3caj3ca-el.a.run.app/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log(data); // You can handle the response as per your requirement

    setSubmitted(true);

    const totalQuestions = questions.length;
    const correctAnswers = data.correctAnswers;
    const wrongAnswers = totalQuestions - correctAnswers;
    const percentageCorrect = (correctAnswers / totalQuestions) * 100;
    const percentageWrong = (wrongAnswers / totalQuestions) * 100;

    setPercentageCorrect(percentageCorrect);
    setPercentageWrong(percentageWrong);
  };

  if (isLoading) {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        {!submitted && (
          <>
            <div className={classes.languageSelection}>
              <Button
                className={classes.languageButton}
                variant={selectedLanguage === 'English' ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => setSelectedLanguage('English')}
              >
                English
              </Button>
              <Button
                className={classes.languageButton}
                variant={selectedLanguage === 'Hindi' ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => setSelectedLanguage('Hindi')}
              >
                Hindi
              </Button>
            </div>
            <div className={classes.questionContainer}>
              <Typography variant="h5" gutterBottom>
                Question {currentIndex + 1}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {questions[currentIndex].question}
              </Typography>
            </div>
            <div className={classes.optionsContainer}>
              {questions[currentIndex].options.map((option) => (
                <Radio
                  key={option}
                  checked={answers[currentIndex] === option}
                  onChange={() => handleOptionSelect(option)}
                  value={option}
                  name="answer"
                  color="primary"
                  label={option}
                />
              ))}
            </div>
            <div className={classes.buttonContainer}>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePreviousQuestion}
                disabled={currentIndex === 0}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNextQuestion}
                disabled={currentIndex === questions.length - 1}
              >
                Next
              </Button>
            </div>
            {currentIndex === questions.length - 1 && (
              <div className={classes.submitContainer}>
                <TextField
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  variant="outlined"
                  margin="normal"
                />
                <TextField
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  margin="normal"
                />
                <TextField
                  label="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  variant="outlined"
                  margin="normal"
                />
                <Button variant="contained" color="primary" onClick={handleSubmitQuiz}>
                  Submit
                </Button>
              </div>
            )}
          </>
        )}
        {submitted && (
          <div className={classes.submitContainer}>
            <Typography variant="h5" gutterBottom>
              Quiz submitted successfully!
            </Typography>
            <Typography variant="body1" gutterBottom>
              Percentage of Correct Answers: {percentageCorrect}%
            </Typography>
            <Typography variant="body1" gutterBottom>
              Percentage of Wrong Answers: {percentageWrong}%
            </Typography>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};

export default QuizApp;
