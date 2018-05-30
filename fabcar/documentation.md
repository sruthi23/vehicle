### This document is all about the api used in this project.  

##### 1. Vehicle Registration

* url : http://ec2-54-191-119-86.us-west-2.compute.amazonaws.com:8081/api/invoke
* method : POST
*  url params : data{}
* success response :  
-- code : 200 
-- result :`{ successfully registered }`

##### 2. Search

* url :http://ec2-54-191-119-86.us-west-2.compute.amazonaws.com:8081/api/query
*  method :POST
*  url params : func,array of arguments
*  success response :  
-- code :200  
-- stored data will be displayed as per query
- sample 1:  
-- arguments :
*   func : queryCar
*	data[] : VIN  

-- result :

```

{
	"VIN": "X4SD23FERTS34DF",
	"chasisno": "SD23FERTS34DF",
	"date": "1527235154",
	"docType": "car",
	"grandpoints": 4400,
	"make": "Nissan",
	"model": "Terrano",
	"points": 2000,
	"replacement": [
	{
	"part_1": [
	{
	"actual": 2000,
	"date": "1527235154",
	"points": 500,
	"schedule": 2000
}

]
},
{
	"part_2": [
	{
	"actual": 2000,
	"date": "1527235154",
	"points": 500,
	"schedule": 2000
}
]
}
],
"services": [
{
	"service_1": {
	"actual": 2000,
	"date": "1527235154",
	"points": 500,
	"schedule": 2000
} 
}
]
}
}
```
