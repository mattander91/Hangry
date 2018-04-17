const React = require('react');
const ReactDOM = require('react-dom');

class Result extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showItems: false,
      showInfo: false
    };
    this.formatHours = this.formatHours.bind(this);
    this.formatPrice = this.formatPrice.bind(this);
  }

  formatHours(hours) {
    let formattedHours = [];
    for (var key in hours) {
      formattedHours.push({day: key, hours: hours[key].join('')});
    }
    return formattedHours;
  }

  formatPrice(price) {
    price = price.toString();
    if (!price.includes('.')) {
      return price + '.00';
    }
    for (var i = 0; i < price.length; i++) {
      if (price[i] === '.' && price[i+2] === undefined) {
        return price + '0';
      }
    }
    return price;
  }

  render() {
    let addressLink = '';
    this.props.result.address
      ?
        addressLink = 'https://www.google.com/maps/place/' + this.props.result.address.split(/[ +]+/).join('+')
      : null
    let hours = this.formatHours(this.props.result.hours);
    return (
      <div>
       {!this.props.result.noData
        ?
          <div id="restaurant" className="jumbotron Col xs={12} md={6}">
            <div className="row card-block card">
              <div className="col col-md-12 text-center">
                <img className="rounded float-left" src={this.props.result.logo}></img>
                <div className="lead">
                  <p className="main-item">
                    {this.props.result.items[0].item}<span className="price">{'$' + this.formatPrice(this.props.result.items[0].price)}</span>
                  </p>
                  {this.props.result.items[0].description.length > 0
                    ?
                      <div className="description">
                        <i>{this.props.result.items[0].description}</i>
                      </div>
                    : null
                  }
                  {this.props.result.items.length - 1 > 0
                    ? <div className="view-more">
                        <div onClick={() => this.setState({showItems: !this.state.showItems})}>
                          <strong>View {this.props.result.items.slice(1).length} more relevant {this.props.result.items.slice(1).length > 1 ? 'items!' : 'item!'}</strong>
                        </div>
                      </div>
                    : null
                  }
                </div>
                {this.state.showItems
                  ? this.props.result.items.slice(1).map(item => {
                      return (
                        <div className="lead">
                          <p className="main-item">{item.item}<span className="price">{'$' + this.formatPrice(item.price)}</span></p>
                          <p style={{maxWidth: item.description.length > 100 ? '80%' : '100%' }}><i>{item.description}</i></p>
                      </div>
                      )
                    })
                  : null
                }
                <div onClick={() => this.setState({showInfo: !this.state.showInfo})}>
                  <button className="name">{this.props.result.name}</button>
                </div>
                <div className="restaurant-info">
                  {this.state.showInfo
                    ?
                      <div>
                        <div className="info-left">
                          <p><span className="info">Address: </span><a href={addressLink} target="_blank">{this.props.result.address}</a></p>
                          <p><span className="info">Open: </span>{this.props.result.open ? 'Yes' : 'No'}</p>
                          <p><span className="info">Delivery: </span>{this.props.result.delivery ? 'Yes' : 'No'}</p>
                          <p><span className="info">Phone: </span>{this.props.result.phone}</p>
                        </div>
                        <div className="hours">
                          <p><span className="info">Hours:</span></p>
                          {hours.map(day => {
                            return (
                              <div>
                                <p className="hour">{day.day}: {day.hours}</p>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    : null
                  }
                </div>
              </div>
            </div>
          </div>
        : <div>Sorry, we couldn't find anything.
            <p>For more info, please visit the <span className="click-about" onClick={this.props.aboutClick}>About </span> page.</p>
          </div>
      }
      </div>
    )
  }
}

module.exports = Result;
