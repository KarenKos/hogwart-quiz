import React, { PureComponent, Fragment } from 'react';
import update from 'react-addons-update'; // ES6
import Header from 'components/Header';
import styled from 'styled-components';
// import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

// import Home from './home';
// import About from './about';

import quizQuestions from '../../components/Questions/quizQuestions';
import Quiz from '../../components/Questions/quiz';
import Result from '../../components/Questions/result';
import Question from '../../components/Questions/question';





const AppWrapper = styled.div`
  background-color: var(--brown);
  height: 100vh;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const Button = styled.button`
  font-size: 1rem;
  padding: 0.25rem 1rem;
  margin: 0 1rem;
  background: white;
`;

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      counter: 0,
      questionId: 1,
      question: '',
      answerOptions: [],
      answer: '',
      answersCount: {
        Gryffindor: 0,
        Slytherin: 0,
        Hufflepuff: 0,
        Ravenclaw: 0,
      },
      result: '',
    };

    this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
  }

  componentWillMount() {
    const shuffledAnswerOptions = quizQuestions.map(question =>
      this.shuffleArray(question.answers),
    );

    this.setState({
      question: quizQuestions[0].question,
      answerOptions: shuffledAnswerOptions[0],
    });
  }

  shuffleArray(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  setUserAnswer(answer) {
    const updatedAnswersCount = update(this.state.answersCount, {
      [answer]: { $apply: currentValue => currentValue + 1 },
    });
    this.setState({
      answersCount: updatedAnswersCount,
      answer: answer,
    });
  }

  handleAnswerSelected(event) {
    this.setUserAnswer(event.currentTarget.value);
    if (this.state.questionId < quizQuestions.length) {
      setTimeout(() => this.setNextQuestion(), 300);
    } else {
      setTimeout(() => this.setResults(this.getResults()), 300);
    }
  }

  setNextQuestion() {
    const counter = this.state.counter + 1;
    const questionId = this.state.questionId + 1;
    this.setState({
      counter: counter,
      questionId: questionId,
      question: quizQuestions[counter].question,
      answerOptions: quizQuestions[counter].answers,
      answer: '',
    });
  }

  getResults() {
    const answersCount = this.state.answersCount;
    const answersCountKeys = Object.keys(answersCount);
    const answersCountValues = answersCountKeys.map(key => answersCount[key]);
    const maxAnswerCount = Math.max.apply(null, answersCountValues);

    return answersCountKeys.filter(key => answersCount[key] === maxAnswerCount);
  }
  setResults(result) {
    if (result.length === 1) {
      this.setState({ result: result[0] });
    } else {
      this.setState({ result: 'Undetermined' });
    }
  }

  renderQuiz() {
    return (
      <Quiz
        answer={this.state.answer}
        answerOptions={this.state.answerOptions}
        questionId={this.state.questionId}
        question={this.state.question}
        questionTotal={quizQuestions.length}
        onAnswerSelected={this.handleAnswerSelected}
      />
    );
  }

  renderResult() {
    return <Result quizResult={this.state.result} />;
  }



  componentDidMount() {
    document.body.style.background = "brown";
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.result === "Gryffindor") {
      const currentRoute = nextProps.location.pathname;
      switch (currentRoute) {
        case "\a": document.body.style.background = "blue";
          break;
        case "\b": document.body.style.background = "green";
          break;
        default: document.body.style.background = "red";

      }
    }
  }



  render() {

    return (
      <Fragment>
        <AppWrapper>
          <Header text="Dowiedz się, do którego domu w Howgardzie należysz!" color="" />

          {this.state.result ? this.renderResult() : this.renderQuiz()}
        </AppWrapper>
      </Fragment>
    );
  }
}

export default App;


