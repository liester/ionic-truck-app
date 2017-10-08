angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope, $state, $ionicLoading, TruckService, CallService, StateService) {

    let controller = this; //Required for location services.

    $scope.$on('$stateChangeSuccess', (event, toState, toParams, fromState) => {
      if(fromState.name == "tab.account" && toState.name == "tab.dash") {
        if(StateService.getSelectedTruckId() != controller.selectedTruckId) {
          controller.selectedTruckId = StateService.getSelectedTruckId();
          controller.status = StateService.getTruckStatus();
          controller.updateSelectedTruck();
          controller.updateTruckStatus();
        }
      }
    });

    controller.selectedTruckId = StateService.getSelectedTruckId();
    controller.status = StateService.getTruckStatus();
    controller.activeCall = StateService.getActiveCall();

    controller.available = false;
    controller.loaded = false;

    controller.updateSelectedTruck = () => {
      if(controller.selectedTruckId && !controller.activeCall) {
        CallService.getActiveCall(controller.selectedTruckId).then((response) => {
          updateSelectedTruckData(response);
        });
      }
    };
    controller.updateSelectedTruck();

    function updateSelectedTruckData(response) {
      let newCall = response.data;
      if(newCall) {
        if(!controller.activeCall || newCall.id != controller.activeCall.id) {
          controller.activeCall = newCall;
          TruckService.updateStatus(controller.selectedTruckId, "Available").then((response) => {
              if(response.data) {
                  StateService.setTruckStatus("AVAILABLE");
                  controller.status = "AVAILABLE";
                  controller.updateTruckStatus();
              }
          });
        }
        if(navigator.userAgent.match(/(Android)/)) {
          controller.activeCall.pickUpURL = "geo:?q="+encodeURIComponent(controller.activeCall.pickUpLocation);
          controller.activeCall.dropOffURL = "geo:?q="+encodeURIComponent(controller.activeCall.dropOffLocation);
        } else {
          controller.activeCall.pickUpURL = "http://maps.google.com?q="+encodeURIComponent(controller.activeCall.pickUpLocation);
          controller.activeCall.dropOffURL = "http://maps.google.com?q="+encodeURIComponent(controller.activeCall.dropOffLocation);
        }
        StateService.setActiveCall(controller.activeCall);
      } else {
        controller.activeCall = null;
      }
    };

    controller.updateTruckStatus = () => {
      if(controller.status.toUpperCase() == "AVAILABLE"){
        controller.available = true;
        controller.loaded = false;
      } else if(controller.status.toUpperCase() == "EN-ROUTE") {
        controller.available = false;
        controller.loaded = false;
      } else if(controller.status.toUpperCase() == "LOADED") {
        controller.available = false;
        controller.loaded = true;
      }
    };
    controller.updateTruckStatus();

    controller.startCall = () => {
      TruckService.updateStatus(controller.selectedTruckId, "En-Route").then((response) => {
        if(response.data) {
          StateService.setTruckStatus("EN-ROUTE");
          controller.status = "EN-ROUTE";
          controller.updateTruckStatus();
        }
      });
    };

    controller.loadTruck = () => {
      TruckService.updateStatus(controller.selectedTruckId, "Loaded").then((response) => {
        if(response.data) {
          StateService.setTruckStatus("LOADED");
          controller.status = "LOADED";
          controller.updateTruckStatus();
        }
      });
    };

    controller.completeCall = () => {
      $ionicLoading.show({
        template: 'Completing call',
        duration: 15000
      });
      CallService.completeCall(controller.activeCall.id).then((response) => {
        StateService.setTruckStatus("AVAILABLE");
        controller.status = "AVAILABLE";
        controller.updateTruckStatus();
        controller.updateSelectedTruck();
        $ionicLoading.hide();
      });
    };

    function alertDriver() {
      document.getElementById('truck_alert').classList.add('truck_alert_div');
      beep();
      window.setTimeout(() => {
        document.getElementById('truck_alert').classList.remove('truck_alert_div');
      }, 500);
      window.setTimeout(() => {
        document.getElementById('truck_alert').classList.add('truck_alert_div');
        beep();
      }, 1000);
      window.setTimeout(() => {
        document.getElementById('truck_alert').classList.remove('truck_alert_div');
      }, 1500);
    }

    function beep() {
        var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
        snd.play();
    }

    function pullForNewCall() {
      if(!controller.activeCall) {
        CallService.getActiveCall(controller.selectedTruckId).then((response) => {
          if(response.data) {
            alertDriver();
            updateSelectedTruckData(response);
          }
        });
      }
    };
    window.setInterval(pullForNewCall, 180000);

  });
