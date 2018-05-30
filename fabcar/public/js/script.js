'use strict'

var urlBase = 'http://ec2-54-191-119-86.us-west-2.compute.amazonaws.com:8081'
var addUrl = urlBase + '/api/invoke'
var searchUrl = urlBase + '/api/query'

$(function () {
  // /loadData('X4SD23FERTS34DF')
})

function loadData (vin) {
  $.ajax({
    type: 'POST',
    url: searchUrl,
    data: {func: 'queryCar', 'data[]': vin},
    success: function (data) {
      console.log(data.res)
    }
  })
}
