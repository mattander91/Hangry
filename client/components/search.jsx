const React = require('react');
const $ = require('jquery');

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currFoodSearched: '',
      currLocationSearched: '',
      showSpinner: false
    }
    this.handleFoodUserSearch = this.handleFoodUserSearch.bind(this);
    this.handleLocationUserSearch = this.handleLocationUserSearch.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleFoodUserSearch(searchTerm) {
    this.setState({
      currFoodSearched: searchTerm.target.value
    });
  }

  handleLocationUserSearch(searchTerm) {
    this.setState({
      currLocationSearched: searchTerm.target.value
    });
  }

  //send submit request to server
  handleSubmit(e) {
    e.preventDefault();
    let userQuery = {
      query: this.state.currFoodSearched,
      location: this.state.currLocationSearched
    };
    let url = 'https://hangry2.herokuapp.com/api/search' || 'http://127.0.0.1:3000/api/search';
    if (userQuery.query.length > 0 && userQuery.location.length > 0) {
      this.handleSpinner();
      $.ajax({
        type: 'POST',
        url: url,
        data: userQuery,
        success: (data) => {
          this.handleSpinner();
          this.props.searchedResults(data.slice(0, 20));
        },
        error: () => {
          // console.log('GET has failed');
        }
      });
    }
  }

  //Show/hide 'spinner' loading gif
  handleSpinner() {
    this.setState({showSpinner: !this.state.showSpinner});
  }

  render() {
    return (
      <div>
        <div>
          <div id="hangry-word-logo">Hangry</div>
          <img className="img-responsive" id="main-food-pic-left" src="img/Fork.jpg" />
          <img className="img-responsive" id="main-food-pic-right" src="img/knifeSpoon.jpg" />
          <form id="search-boxes" onSubmit={(e) => {
            this.handleSubmit(e);
            document.getElementById("search-boxes").reset();}}>
            <div>
              <input className="mb-2 mr-sm-2 mb-sm-0" type="text" placeholder='Search Food...' onChange={(e) => {
                this.handleFoodUserSearch(e)}}/>
            </div>
            <div>
              <input className="mb-2 mr-sm-2 mb-sm-0" type="text" placeholder="Enter City or Zip..." onChange={(e) => {
                this.handleLocationUserSearch(e)}}/>
            </div>
            <button type="submit" className="search-button">Search</button>
          </form>
        </div>
        <div>
          {this.state.showSpinner
            ? <img id="loading" src="img/loading.gif"/>
            : null
          }
        </div>
      </div>
    )
  }
}

module.exports = Search;