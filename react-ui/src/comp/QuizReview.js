import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import { checkAuthentication } from './helpers';
import { Container, Header, Accordion } from 'semantic-ui-react';

export default withAuth(class QuizReview extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      userinfo: null,
      authenticated: null,
      name: " ",
      date: " ",
      quizInfo: {},
    };
    this.checkAuthentication = checkAuthentication.bind( this );
    this.displayRound = this.displayRound.bind(this);
    this.handleSubmit = this.handleSubmit.bind( this );
  }

  populateQuiz = async() => {
    const response = await fetch('/api/quizreview/' + this.props.trivia_id);
    const body = await response.json();
    return body;
  }

  async componentDidMount() {
      await this.checkAuthentication()
      await this.populateQuiz()
      .then((res) => {
        var quizData = res;
         this.setState({
           quizInfo: quizData,
         });
      })
  }

  async componentDidUpdate() {
      this.checkAuthentication();
  }

  displayRound(round) {
      let quizInfo = this.state.quizInfo
      let questionsAndAnswers = []
      for (let i = 1; i <= 10; i++){
        questionsAndAnswers.push((<div>
          Question {i}: {quizInfo.rounds[round].questions[0]["question"+i]}
          <br/>
          Answer {i}: {quizInfo.rounds[round].questions[0]["answer"+i]}
          </div>))
      }
        return(
          <div>
          {quizInfo.rounds[round].category}
          {questionsAndAnswers}
          </div>)
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.auth._history.push("/presentation")
  }

  render() {
    if (this.state.quizInfo.name) {
      return(
        <form onSubmit = {this.handleSubmit}>
          <div>
          {this.state.quizInfo.name}
          <br/>
          {this.state.quizInfo.date}
          <br/>
          {this.displayRound(0)}
          <br/>
          {this.displayRound(1)}
          <br/>
          {this.displayRound(2)}
          <br/>
          {this.displayRound(3)}
          <br/>
          {this.displayRound(4)}
          <br/>
          <input type="submit" value="Present Quiz!" />
          </div>
        </form>
      )} else {
        return (<div>Loading...</div>)
      }
    }
  })
