const React = require('react');
const Result = require('./result.jsx');

const ResultsList = (props) => (
  <div className="container">
    <div style={{'marginTop': '30px'}}>
      {props.list.map((result, i) => {
        return (<Result key={Math.abs(Math.random())} result={result} aboutClick={props.aboutClick}/>);
      })}
    </div>
  </div>
);

module.exports = ResultsList;
