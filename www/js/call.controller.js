angular.module('starter.controllers')

.controller('CallCtrl', function($scope, Calls, DriverService) {


  this.message = 'Test Message';
  console.log('calls');
  
  DriverService.getAll().then((response)=>{
    this.trucks = response.trucks;  
  });

})