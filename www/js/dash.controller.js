angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope, $state, TruckService, CallService) {

    let localTruckId = window.localStorage.getItem('truckId');
    this.available = false;
    this.loaded = false;
    let controller = this;

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            //It didn't want to work using 'this'
            if(navigator.userAgent.match(/(Android)/)) {
                controller.currLocation = "geo:?q="+encodeURIComponent(position.coords.latitude)+","+encodeURIComponent(position.coords.longitude);
            } else {
                controller.currLocation = "http://maps.google.com?q="+encodeURIComponent(position.coords.latitude)+","+encodeURIComponent(position.coords.longitude);
            }
            console.log(position);
        });
    } else {
        controller.currLocation ="Location didn't work";
        console.log("Didn't make location call");
    }

    TruckService.getTruckIds().then((response) => {
      this.trucks = response.data;
      if(localTruckId) {
        this.selectedTruckId = localTruckId;
//        this.updateSelectedTruck();
      }
    });

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
      TruckService.truck(this.selectedTruckId).then((response) => {
        console.log(response.data);
        if(response.data) {
          this.truck = response.data;
          this.available = response.data.truckStatusType == "AVAILABLE";
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
      TruckService.updateDriverAvailable(this.selectedTruckId, this.driverName).then((response) => {
        if(response.data) {
          this.available = true;
          this.loggedIn = true;
          this.updateSelectedTruck();
          $state.go('tab.dash');
        }
      });
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
      });
    };

  });
