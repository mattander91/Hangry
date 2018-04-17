const Favicon = require('react-favicon');
const Search = require('./components/search.jsx');
const ResultsList = require('./components/results-list.jsx');
const About = require('./components/about.jsx');
const React = require('react');
const ReactDom = require('react-dom');
const $ = require('jquery');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      currentState: 'Home'
    };
    this.searchedResults = this.searchedResults.bind(this);
    this.aboutClick = this.aboutClick.bind(this);
  }

  searchedResults(results) {
    this.setState({
      list: results
    });
  }

  //Handle 'About' click on Home page
  aboutClick() {
    this.setState({currentState: 'About'});
  }

  render() {
    if (this.state.currentState === 'Home') {
      return (
        <div>
          <div className="navbar">
            <span style={{'cursor':'pointer'}} className="navbar-brand">
              <strong onClick={() => {this.setState({currentState: 'About'})}}>About</strong>
            </span>
          </div>
          <Search
            searchedResults={this.searchedResults}
          />
          <ResultsList
            list={this.state.list}
            aboutClick={this.aboutClick}
          />
        </div>
      )
    } else if (this.state.currentState === 'About') {
        return (
          <div>
            <div className="navbar">
              <span style={{'cursor':'pointer'}} className="navbar-brand">
                <strong onClick={() => {this.setState({currentState: 'Home'})}}>Home</strong>
              </span>
            </div>
            <div><About/></div>
          </div>
        )
    }
  }
}

ReactDom.render(
  <div>
    <App />
    <Favicon url="img/restaurant-icon.png" />
  </div>
  , document.getElementById('app')
);
