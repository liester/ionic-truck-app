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
        StateService.setTruckStatus("AVAILABLE");
        $state.go('tab.dash', {truckId: this.selectedTruckId}, {reload: true});
      });
    };

    this.logOff = () => {
      TruckService.updateStatus(this.selectedTruckId, "Off-duty").then((response) => {
        StateService.setSelectedTruckId("");
        StateService.setTruckStatus("OFF-DUTY");
        this.selectedTruckId = "";
        this.truck = null;
        this.loggedIn = false;
      });
    };

    this.getTruck = (truckId) => {
      TruckService.truck(truckId).then((response) => {
        if(response.data) {
          this.truck = response.data;
        }
      });
    };

  });