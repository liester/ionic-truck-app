angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope, $state, TruckService, CallService, StateService) {

    let localTruckId = window.localStorage.getItem('truckId');
    this.available = false;
    this.loaded = false;
    let controller = this; //Required for location services.

//    TruckService.getTruckIds().then((response) => {
//      this.trucks = response.data;
//      if(localTruckId) {
//        this.selectedTruckId = localTruckId;
//        this.updateSelectedTruck();
//        this.loggedIn = true;
//      }
//    });

    this.updateSelectedTruck = () => {
      CallService.getActiveCall(this.selectedTruckId).then((response) => {
        localTruckId = this.selectedTruckId;
        window.localStorage.setItem('truckId', this.selectedTruckId);
        this.activeCall = response.data;
        if(navigator.userAgent.match(/(Android)/)) {
          this.activeCall.pickUpURL = "geo:?q="+encodeURIComponent(this.activeCall.pickUpLocation);
          this.activeCall.dropOffURL = "geo:?q="+encodeURIComponent(this.activeCall.dropOffLocation);
        } else {
          this.activeCall.pickUpURL = "http://maps.google.com?q="+encodeURIComponent(this.activeCall.pickUpLocation);
          this.activeCall.dropOffURL = "http://maps.google.com?q="+encodeURIComponent(this.activeCall.dropOffLocation);
        }
      });
    };

    this.startCall = () => {
      TruckService.updateStatus(this.selectedTruckId, "En-Route").then((response) => {
        if(response.data) {
          this.available = response.data.truckStatusType == "AVAILABLE";
          this.loaded = response.data.truckStatusType == "LOADED";
        }
      });
    };

    this.loadTruck = () => {
      TruckService.updateStatus(this.selectedTruckId, "Loaded").then((response) => {
        if(response.data) {
          this.available = response.data.truckStatusType == "AVAILABLE";
          this.loaded = response.data.truckStatusType == "LOADED";
        }
      });
    };

    this.completeCall = () => {
      CallService.completeCall(this.selectedTruckId).then((response) => {
        this.available = true;
        this.loaded = false;
        this.updateSelectedTruck();
      });
    };

    this.logIn = () => {
      StateService.setSelectedTruckId(this.selectedTruckId);
      $state.go('tab.dash');
//      TruckService.updateDriverAvailable(this.selectedTruckId, this.driverName).then((response) => {
//        if(response.data) {
//          this.available = true;
//          this.loggedIn = true;
//          this.updateSelectedTruck();
////          $state.go('tab.dash');
//        }
//      });
    };

    this.logOff = () => {
      TruckService.updateDriverOffDuty(this.selectedTruckId).then((response) => {
        window.localStorage.removeItem('truckId');
        this.selectedTruckId = "";
        this.available = false;
        this.loaded = false;
        this.truck = null;
        this.activeCall = null;
        this.driverName = null;
        this.loggedIn = false;
      });
    };

    this.findLocation = () => {
      if(this.selectedTruckId) {
        if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            TruckService.updateLocation(controller.selectedTruckId, position.coords.latitude.toString(), position.coords.longitude.toString()).then((response) => {
              console.log(response);
            });
            console.log(position.coords);
          });
        } else {
            console.log("Didn't make location call");
        }
      }
    }

    window.setInterval(this.findLocation, 60000);//60 seconds

  });
