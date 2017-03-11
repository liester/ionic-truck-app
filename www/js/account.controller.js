angular.module('starter.controllers')

  .controller('AccountCtrl', function ($scope, $state, TruckService, CallService, StateService) {
    this.loggedIn = false;

    TruckService.getTruckIds().then((response) => {
      this.trucks = response.data;
      let truckId = StateService.getSelectedTruckId();
      if(truckId) {
        this.selectedTruckId = truckId;
        this.getTruck(truckId);
        this.loggedIn = true;
      }
    });

    this.logIn = () => {
      TruckService.updateStatus(this.selectedTruckId, "AVAILABLE").then((response) => {
        this.loggedIn = true;
        StateService.setSelectedTruckId(this.selectedTruckId);
        $state.go('tab.dash');
      });
    };

    this.logOff = () => {
      TruckService.updateStatus(this.selectedTruckId, "Off-duty").then((response) => {
        StateService.setSelectedTruckId("");
        this.selectedTruckId = "";
        this.truck = null;
        this.loggedIn = false;
      });
    };

    this.getTruck = (truckId) => {
      console.log("HEY");
      TruckService.truck(truckId).then((response) => {
        if(response.data) {
          this.truck = response.data;
        }
      });
    };

  });