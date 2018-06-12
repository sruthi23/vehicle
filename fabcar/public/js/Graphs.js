class Graphs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      query: 'X4SD23FERTS34DF'
    };
  }

  componentDidMount(){
    $('.menu .item').tab()
    this.requestData()
  }

  componentDidUpdate(){
    $('i.circle').popup()
    
    $('td i.circle')
      .transition({
        animation : 'pulse',
        interval  : 100
      });
  }

  handleInputChange = e => {
    e.preventDefault();
    this.setState(
      {
        query: this.search.value
      },
      () => {
        this.requestData();
      }
    );
  };

  requestData() {
    var args = {
      func: 'queryCar',
      'data[]': this.state.query
    };

    var formBody = [];
    for (var property in args) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(args[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    fetch(
      'http://ec2-54-191-119-86.us-west-2.compute.amazonaws.com:8081/api/query',
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody
      }
    )
      .then(response => response.json())
      .then(res_data => this.setState({ data: res_data.res }));
  }

  render () {
    console.log(this.state);
    const { data } = this.state;

    if (data.services) {
      var rows = Object.keys(data.services[0]).map(function(key) {
        var row = data.services[0][key];
        if (row.status === 0) {
          var classes = 'circle icon icon-green';
        } else if (row.status === 1) {
          var classes = 'circle icon icon-blue';
        } else {
          var classes = 'circle icon icon-red';
        }
        return (<i className={classes} key={key} data-content={row.points} data-position="top center" />);
      });
    }

    var rows_replacement = '';
    if (data.replacement) {
      var rows_replacement = data.replacement.map(function(v, k) {
        var keyValue = 'part_' + (k + 1);

        return (
            <tr key={keyValue + k}>
              <th>
                PART {k + 1}
              </th>
              <td>
                <BuildParts data={data.replacement[k][keyValue]} key={k} keyValue={keyValue} k={k}/>
              </td>
            </tr>
          );
        });
    }


    return (
      <div>
      <div className="ui form">
        <div className="two fields">
          <div className="field">
            <input
              placeholder="Enter VIN ..."
              defaultValue={'X4SD23FERTS34DF'}
              ref={input => (this.search = input)}
            />
          </div>

          <div className="field">
            <button
              className="ui submit button"
              onClick={this.handleInputChange}>
              Search
            </button>
          </div>
        </div>
      </div>

      {data.replacement &&
        <table className='ui noborder very basic collapsing celled table'>
          <tbody>
            <tr>
              <th><h3 className="ui header" data-content="Top Left" data-position="top left">Life @ Nissan:: Service </h3></th>
              <td>{rows}</td>
            </tr>
            <tr>
              <th><h3 className="ui header">Life @ Nissan:: Part Replacement </h3></th>
              <td></td>
            </tr>
            {rows_replacement}
          </tbody>
        </table>
      }
      </div>
    )
  }
}

const BuildParts = (data, k, keyValue) => {

  var rowsIcon = []
  data.data.map(function(vd, kd) {
    if (vd.status === 0) {
      var classes = 'circle icon icon-green';
    } else if (vd.status === 1) {
      var classes = 'circle icon icon-blue';
    } else {
      var classes = 'circle icon icon-red';
    }
    rowsIcon.push(<i className={classes} key={kd} data-html={'<h2>g fdg dfg</h2>' + vd.points} data-position="top center" />)
  });
  return (<div>{rowsIcon}</div>);
}


ReactDOM.render(<Graphs />, document.getElementById('root'))
