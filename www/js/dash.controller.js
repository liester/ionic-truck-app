angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope, $state, TruckService, CallService, StateService) {

    $scope.$on('$stateChangeSuccess', (event, toState, toParams, fromState) => {
      console.log("NO");
      if(fromState.name == "tab.account" && toState.name == "tab.dash") {
        if(StateService.getSelectedTruckId() != this.selectedTruckId) {
          this.selectedTruckId = StateService.getSelectedTruckId();
          this.updateSelectedTruck();
        }
      }
    });

    this.selectedTruckId = StateService.getSelectedTruckId();
    this.status = StateService.getTruckStatus();

    this.available = false;
    this.loaded = false;
    let controller = this; //Required for location services.

    this.updateSelectedTruck = () => {
      this.activeCall = null;
      if(this.selectedTruckId) {
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
      }
    };
    this.updateSelectedTruck();

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
