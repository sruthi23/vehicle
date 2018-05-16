### This document is all about the api used in this project.  

##### 1. Vehicle Registration

* url : /api/invoke
* method : POST
*  url params : carno,make,model,year,vin,plate,engine,owner
* success response :  
-- code : 200   
-- carno was successfully registered in the name of owner  
*  sample :
-- arguments :
* carno : CAR1
* make : Suzuki
* model : Baleno
* year : 2015
* vin : 105
* plate : kl09
* engine : L _K-series_ I4 (petrol)
* owner : Anu  
-- result :`{ res : CAR1 was successfully registered in the name of Anu }`

##### 2. Register User

* url : /api/registerUser
* method : POST
* url params : name,address,contact
* success response :  
-- code : 200  
-- name successfully registered
* sample
-- arguments :
* name : Anu
* address : SeaShore
* contact : 9878938603  
-- result :` { " Anu was successfully registered"}`

##### 3. Search

* url :/api/query
*  method :POST
*  url params : func,array of arguments
*  success response :  
-- code :200  
-- stored data will be displayed as per query
- sample 1:  
-- arguments :
*   func : queryCar/queryAllCar
*	user : varun
*	data[] : CAR1  
<<<<<<< HEAD
-- {  
"res": {
"VIN": "105fff",
"docType": "car",
"engine": "fghffgh",
"make": "suzuki",
"model": "Baleno",
"owner": "John",
"plate": "kl07",
"year": "2015"
}
}
=======
-- result : {  
"res": {  
"VIN": "105fff",  
"docType": "car",  
"engine": "fghffgh",  
"make": "suzuki",  
"model": "Baleno",  
"owner": "Jack",  
"plate": "kl07",  
"year": "2015"  
}  
}  
>>>>>>> 10fcdb458e1297223826d713c48d32317a53f65f

##### 4. Change Ownership

* url :/api/changeowner
*  method :POST
*  url params : array of arguments  
*  success response :  
-- code :200  
-- successfully registered in the name of new owner
- sample 1:  
-- arguments :
*	data[]: CAR1
*	data[] : Anu

##### 5. History details

* url :/api/history  
*  method : POST  
*  url params : vin(vehicle identification number)   
*   success response :  
--  code : 200  
<<<<<<< HEAD
-- {  
"res":{    
"TxId": "2188b85c9e6248c58d1a38c2d15a2897c5d3a5e35e2df030b3f430ecf44e4b31",  
"Timestamp": {    
"seconds": {    
"low": 1525854695,    
"high": 0,    
"unsigned": false     
},    
"nanos": 484000000    
=======
-- {
"res": [  
{  
	"TxId": "c6c1aa524fc77118f412816868efbaf394900c194834c8ec4a5d95724adcfe51",   
	"Timestamp": {   
	"seconds": {  
	"low": 1526274745,  
	"high": 0,  
	"unsigned": false  
	>>>>>>> 10fcdb458e1297223826d713c48d32317a53f65f
},  
"nanos": 731000000  
},  
"IsDelete": "false",  
"Value": {  
"docType": "car",  
"make": "suzuki",  
"model": "Baleno",  
"year": "2015",  
"VIN": "105fff", 
"plate": "kl07",  
"engine": "fghffgh",  
"owner": "John"  
}  
},  
{  
	"TxId": "2ba194ac05a20c9ea8280e03e1c0a6433a98967530b5854554163a987726197d",  
	"Timestamp": {  
	"seconds": {  
	"low": 1526274943,  
	"high": 0,  
	"unsigned": false  
},  
"nanos": 258000000  
},  
"IsDelete": "false",  
"Value": {  
"VIN": "105fff",  
"docType": "car",  
"engine": "fghffgh",  
"make": "suzuki",  
"model": "Baleno",  
"owner": "Jack",  
"plate": "kl07",  
"year": "2015"  
}  
}  
]  
}


##### 6. Record Activity

*  url :/api/activity
*  method : POST
*  url params : vin(vehicle identification number), timestamp, data{}
*  success response :  
--  code : 200  
-- result : {  res :'type' was successfully stored for the car of VIN 'vin'  }  

##### 6. Get Activity Details

*  url :/api/query
*  method : POST
*  url params : func(getActivity),vin(vehicle identification number)
*  success response :  
--  code : 200  
-- result : {res : 'type' was successfully stored for the car of VIN 'vin'}    
-- {  
"res": [  
{    
	"Key": "\u0000VIN\u0000105fff\u00001526449627\u0000",  
	"Record": "{type:"pressure",value:010}"  
} 
]  
}
----
