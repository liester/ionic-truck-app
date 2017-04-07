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
      updateLocation: function(id, lat, lon) {
        return $http({
          method: "POST",
          url: window.ServiceUrl + "/trucks/location/" + id,
          data: {
            lat: lat,
            lon: lon
          }
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
          url: window.ServiceUrl + "/calls/" + id + "/complete"
        })
      }
    }
  })

  .factory('StateService', function() {
    let selectedTruckId;
    let truckStatus;
    let cookieClientId;

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
        cookieClientId = clientId;
        document.cookie = "clientId=" + this.clientId + ";";
      },
      getClientId: function() {
        if(cookieClientId) {
          return cookieClientId;
        } else {
          var name = "clientId="
          var decodedCookie = decodeURIComponent(document.cookie);
          var ca = decodedCookie.split(';');
          for(var i = 0; i <ca.length; i++) {
              var c = ca[i];
              while (c.charAt(0) == ' ') {
                  c = c.substring(1);
              }
              if (c.indexOf(name) == 0) {
                  return c.substring(name.length, c.length);
              }
          }
          return "";
        }
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
