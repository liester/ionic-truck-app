angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope, TruckService, CallService) {

    let localTruckId = window.localStorage.getItem('truckId');
    let available;
    let loaded;

    TruckService.getTruckIds().then((response) => {
      this.trucks = response.data;
      if(localTruckId) {
        this.selectedTruckId = localTruckId;
        this.updateSelectedTruck();
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
          this.available = response.data.truckStatusType == "AVAILABLE";
        }
      });
    };

    this.startCall = () => {
      TruckService.updateStatus(this.selectedTruckId, "En-Route").then((response) => {
        console.log(response.data);
        if(response.data) {
          this.available = response.data.truckStatusType == "AVAILABLE";
          this.loaded = response.data.truckStatusType == "LOADED";
        }
      });
    };

    this.loadTruck = () => {
      TruckService.updateStatus(this.selectedTruckId, "Loaded").then((response) => {
        console.log(response.data);
        if(response.data) {
          this.available = response.data.truckStatusType == "AVAILABLE";
          this.loaded = response.data.truckStatusType == "LOADED";
        }
      });
    };

    this.completeCall = () => {
      CallService.completeCall(this.selectedTruckId).then((response) => {
        console.log(response);
        this.available = true;
        this.loaded = false;
        this.updateSelectedTruck();
      });
    };

  });
