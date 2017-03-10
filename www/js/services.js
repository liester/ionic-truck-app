angular.module('starter.services', [])


  .factory('TruckService', function ($http) {
    return {
      getTruckIds: function () {
        return $http({
          method: "GET",
          url: window.ServiceUrl + "/trucks/ids"
        })
      },
      truck: function (id) {
        return $http({
          method: "GET",
          url: window.ServiceUrl + "/trucks/" + id
        })
      },
      updateStatus: function(id, status) {
        return $http({
          method: "POST",
          url: window.ServiceUrl + "/trucks/status/" + id + "/" + status
        })
      },
      updateDriverAvailable: function(id, name) {
        return $http({
          method: "POST",
          url: window.ServiceUrl + "/trucks/driver/" + id + "/" + name + "/available"
        })
      },
      updateDriverOffDuty: function(id) {
        return $http({
          method: "POST",
          url: window.ServiceUrl + "/trucks/driver/" + id + "/offduty"
        })
      }
    }
  })

  .factory('CallService', function ($http) {
    return {
      getActiveCall: function (truckId) {
        return $http({
          method: "GET",
          url: window.ServiceUrl + "/calls/activeTruck/" + truckId
        })
      },
      completeCall: function(id) {
        return $http({
          method: "POST",
          url: window.ServiceUrl + "/calls/activeTruck/" + id + "/complete"
        })
      }
    }
  })

  .factory('DriverService', function ($http) {
    return {
      getAll: function (truckId) {
        return $http({
          method: 'GET',
          url: window.ServiceUrl + "/trucks"
        })
      }
    }
  });
