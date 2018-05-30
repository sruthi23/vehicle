
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

    var formBody = []
    for (var property in args) {
      var encodedKey = encodeURIComponent(property)
      var encodedValue = encodeURIComponent(args[property])
      formBody.push(encodedKey + '=' + encodedValue)
    }
    formBody = formBody.join('&')

    fetch('http://ec2-54-191-119-86.us-west-2.compute.amazonaws.com:8081/api/query', {
      method: 'post',
      headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      body: formBody
    })
    .then(response => response.json())
    .then(res_data => this.setState({data: res_data.res}))
  }

  render () {
    console.log(this.state.data)
    const statusName = ['On time', '10% Deviation', '11% to 25% Deviation']
    const {data} = this.state

    // const leng = (data.services) ? Object.keys(data.services[0]).length : 0
    // console.log(leng)
    // (data.services)console.log(data.services[0])

    if (data.services) {
      var rows = Object.keys(data.services[0]).map(function (key) {
        var row = data.services[0][key]
        return (<tr key={key}>
          <td>{key.replace('_', ' ').toUpperCase()}</td>
          <td>{row.schedule}</td>
          <td>{row.actual}</td>
          <td>{row.points}</td>
          <td>{statusName[row.status]}</td>
        </tr>)
      })
    }
    var rows_replacement = ''
    if (data.replacement) {
      var rows_replacement = data.replacement.map(function (v, k) {
        var keyValue = 'part_' + (k + 1)

        // console.log(data.replacement[k][keyValue])

        return data.replacement[k][keyValue].map(function (vd, kd) {
          var time = new Date(+vd.date)
          console.log(vd, kd, time, +vd.date)
          return (<tr key={keyValue + kd}>
            {kd === 0 && <td rowSpan={data.replacement[k][keyValue].length}>PART {(k + 1)}</td>}
            <td>{time.toString()}</td>
            <td>{vd.schedule}</td>
            <td>{vd.actual}</td>
            <td>{vd.points}</td>
            <td>{statusName[vd.status]}</td>
          </tr>)
        })
      })
    }

    {
      return (
        <div>
          <h1>{data.make} {data.model}</h1>
          <div className='ui grid'>
            <div className='ten wide column'>
              <p>The all new Nissan Terrano comes with 22 new features which make you drool for it even more. Made to dominate every terrain, this all-rounder of an SUV is power-packed with a diesel engine, producing enough power to tackle every obstacle on road.</p>

              <b>VIN: {data.VIN}</b>
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
                    <th>Points</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>

                  {rows}

                </tbody>
              </table>

            </div>
            <div className='ui bottom attached tab segment' data-tab='second'>

              <table className='ui fixed single line celled table'>
                <thead>
                  <tr>
                    <th>Part Replacement</th>
                    <th>Date</th>
                    <th>Scheduled Replacement</th>
                    <th>Actual</th>
                    <th>Points</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>

                  {rows_replacement}

                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    }
  }
}
ReactDOM.render(
  <Greeting />,
  document.getElementById('root')
  )
