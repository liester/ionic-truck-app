angular.module('starter.services', [])


  .factory('TruckService', function ($http, $cookies) {
    return {
      getTruckIds: function () {
        return $http({
          method: "GET",
          url: window.ServiceUrl + "/trucks/ids",
          headers: {'Client-Id': $cookies.get('clientId')}
        })
      },
      truck: function (id) {
        return $http({
          method: "GET",
          url: window.ServiceUrl + "/trucks/" + id,
          headers: {'Client-Id': $cookies.get('clientId')}
        })
      },
      updateStatus: function(id, status) {
        return $http({
          method: "POST",
          url: window.ServiceUrl + "/trucks/status/" + id + "/" + status,
          headers: {'Client-Id': $cookies.get('clientId')}
        })
      },
      updateLocation: function(id, lat, lon) {
        return $http({
          method: "POST",
          url: window.ServiceUrl + "/trucks/location/" + id,
          data: {
            lat: lat,
            lon: lon
          },
          headers: {'Client-Id': $cookies.get('clientId')}
        })
      }
    }
  })

  .factory('CallService', function ($http, $cookies) {
    return {
      getActiveCall: function (truckId) {
        return $http({
          method: "GET",
          url: window.ServiceUrl + "/calls/activeTruck/" + truckId,
          headers: {'Client-Id': $cookies.get('clientId')}
        })
      },
      completeCall: function(id) {
        return $http({
          method: "POST",
          url: window.ServiceUrl + "/calls/" + id + "/complete",
          headers: {'Client-Id': $cookies.get('clientId')}
        })
      }
    }
  })

  .factory('StateService', function($cookies) {
    let selectedTruckId;
    let truckStatus;

    return {
      setSelectedTruckId: function(truckId) {
        selectedTruckId = truckId;
        window.localStorage.setItem('truckId', truckId);
      },
      getSelectedTruckId: function() {
        if(selectedTruckId) {
          return selectedTruckId;
        } else {
          let truckId = window.localStorage.getItem('truckId');
          selectedTruckId = truckId;
          return truckId;
        }
      },
      setTruckStatus: function(status) {
        truckStatus = status;
        window.localStorage.setItem('status', status);
      },
      getTruckStatus: function(status) {
        if(truckStatus) {
          return truckStatus;
        } else {
          let status = window.localStorage.getItem('status');
          truckStatus = status;
          return status;
        }
      },
      setClientId: function(clientId) {
        $cookies.put('clientId', clientId);
      },
      getClientId: function() {
        if($cookies.get('clientId')!='undefined') {
          return $cookies.get('clientId');
        } else {
          return "";
        }
      },
      removeClientId: function() {
        $cookies.remove('clientId');
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
