
class Greeting extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      data: []
    }
  }

  componentDidMount () {
    var args = {
      func: 'queryCar',
      'data[]': 'X4SD23FERTS34DF'
    }
    fetch('http://ec2-54-191-119-86.us-west-2.compute.amazonaws.com:8081/api/query',
      {method: 'post',
        body: JSON.stringify(args)
      })
      .then(response => response.json())
      .then(data => console.log(data))
  }

  render () {
    return (
      <div>
        <h1>Nissan Terrano</h1>
        <div className='ui grid'>
          <div className='ten wide column'>
            <p>Nissan Terrano price starts at ₹ 9.99 Lakhs and goes upto ₹ 14.48 Lakhs. Petrol Terrano price starts at ₹ 9.99 Lakhs. Diesel Terrano price starts at ₹ 9.99 Lakhs.</p>
            <b>VIN: 1HGCM567X5A034579</b>
          </div>
          <div className='six wide column'>
            <img src='https://imgd.aeplcdn.com/1056x594/cw/ec/28376/Nissan-Terrano-Front-view-93548.jpg?v=201711021421&q=80' alt='' width='100%' />
          </div>
        </div>

        <div className='ui hidden divider' />
        <div className='ui divider' />
        <div className='ui hidden divider' />

        <div className='ui cards' id='blocks'>
          <div className='ui top attached tabular menu'>
            <a className='item active' data-tab='first'>Service Reports</a>
            <a className='item' data-tab='second'>Part Replacements</a>
          </div>
          <div className='ui bottom attached tab segment active' data-tab='first'>
            <table className='ui fixed single line celled table'>
              <thead>
                <tr>
                  <th>Service Schedule</th>
                  <th>Scheduled </th>
                  <th>Actual </th>
                  <th>On time 10% </th>
                  <th>Deviation 11% to 25% Deviation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>John</td>
                  <td>Approved</td>
                  <td>Approved</td>
                  <td>Approved</td>
                  <td>Approved</td>
                </tr>
                <tr>
                  <td>John</td>
                  <td>Approved</td>
                  <td>Approved</td>
                  <td>Approved</td>
                  <td>Approved</td>
                </tr>
                <tr>
                  <td>John</td>
                  <td>Approved</td>
                  <td>Approved</td>
                  <td>Approved</td>
                  <td>Approved</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className='ui bottom attached tab segment' data-tab='second'>
            Second
          </div>
        </div>
      </div>
    )
  }
}
ReactDOM.render(
  <Greeting />,
    document.getElementById('root')
)
