(function () {
	angular.module("money-saving-challenge.controllers", [])

	.controller("HomeController", function ($scope, $ionicModal, ionicMaterialInk, $ionicPopup, Storage, $ionicLoading, $timeout, $filter, ACCOUNT_TYPE, ionicToast, $cordovaToast) {

		ionicMaterialInk.displayEffect();

		var toast = function (message) {
			if(window.cordova) {
				window.plugins.toast.showWithOptions({
				    message: message,
				    duration: "short", 
				    position: "bottom",
				    styling: {
				      	opacity: 0.8,
				      	cornerRadius: 100,
				      	horizontalPadding: 25, 
      					verticalPadding: 21 
				    }
				});
		    }
		    else {
		    	ionicToast.show(message, 'bottom', false, 2000);
		    }
		};


		Storage.achievements.getAll().then (function (achievements){
			$scope.achievements = [];
			for(var i=0; i<achievements.length; i++){
				$scope.achievements.push({
					amount: achievements[i].amount,
					created_at: moment( achievements[i].created_at).startOf('hour').fromNow()
				});
			}
		});

		Storage.milestones.getAllSelected().then( function (selectedMilestones){
			$scope.selectedMilestones = selectedMilestones;
		});

		Storage.settings.getAll().then(function (settings) {
			var dateStarted = settings.date_started,
				current = moment().add(1, "day").diff(dateStarted, "days"),
				next = moment().add(2, "day").diff(dateStarted, "days");
			
			Storage.milestones.get(current).then(function (currentMilestone) {
				Storage.milestones.get(next).then(function (nextMilestone) {
					$scope.accountInfo = {
						name: settings.account_name,
						currentMilestoneDay: currentMilestone.day,
						currentMilestoneAmount: currentMilestone.amount,
						nextMilestoneAmount: nextMilestone.amount
					};
				});
			});

			if(settings.account_type === ACCOUNT_TYPE.inOrder || settings.account_type === ACCOUNT_TYPE.inReverse) {
				$scope.completeCurrentMilestone = function() {
					Storage.achievements.achievementExist($scope.accountInfo.currentMilestoneDay).then( function (achievementExist) {
						if(achievementExist === false) {
							$ionicPopup.show({
						     	title: '<i class="ion-android-checkmark-circle"></i>  '+
						     			'Complete Your '+ $filter('ordinal')($scope.accountInfo.currentMilestoneDay) +' Milestone',
						     	templateUrl: 'templates/home/popup.html',
						     	buttons: [{
								    text: '<i class="ion-close small"></i> Not Now',
								    type: 'button-dark',
							    }, {
								    text: '<i class="ion-android-done small"></i> Yes',
								    type: 'button-positive',
								    onTap: function(e) {
							    		return {
							    			amount: $scope.accountInfo.currentMilestoneAmount,
							    			day: $scope.accountInfo.currentMilestoneDay
							    		}
							        }
								}],
						     	scope: $scope
						   	}).then(function(result) {
						     	if(result) {						     		
						       		Storage.achievements.add(result).then (function (insertedId){
						       			// console.log(insertedId);
						       		});
						     	}
						   	});
						}
						else if(achievementExist === true){
							toast( $filter('ordinal')($scope.accountInfo.currentMilestoneDay) + " Milestone already completed");
						}
					});
				};
			}
			else if(settings.account_type === ACCOUNT_TYPE.random) {
				$scope.selectedMilestone = {};

				$scope.getSelectedMilestone = function (index, milestone) {
					$scope.selectedMilestone = {
						selectedRow:index,
						amount: milestone.amount,
						day: milestone.day
					};
				};

				$scope.completeCurrentMilestone = function() {
					Storage.achievements.achievementExist($scope.accountInfo.currentMilestoneDay).then( function (achievementExist) {
						if(achievementExist === false) {
							$scope.selectedMilestone.selectedRow = null;
							$ionicPopup.show({
						     	title: '<i class="ion-android-checkmark-circle"></i>  '+
						     			'Complete Your '+ $filter('ordinal')($scope.accountInfo.currentMilestoneDay) +' Milestone',
						     	templateUrl: 'templates/home/popup-list.html',
						     	buttons: [{
								    text: '<i class="ion-close small"></i> Not Now',
								    type: 'button-dark',
							    }, {
								    text: '<i class="ion-android-done small"></i> Ok',
								    type: 'button-positive',
								    onTap: function(e) {
								    	if($scope.selectedMilestone.selectedRow === null){
								    		e.preventDefault();
								    		toast("Please select a milestone");
								    	}
								    	else{
								    		return{
								    			amount: $scope.selectedMilestone.amount,
								    			day: $scope.accountInfo.currentMilestoneDay
								    		}
								    	}
							        }
								}],
						     	scope: $scope
						   	}).then(function(result) {
						     	if(result) {
						       		Storage.achievements.add(result);
						     	}
						   	});
						}
						else if(achievementExist === true){
							toast( $filter('ordinal')($scope.accountInfo.currentMilestoneDay) + " Milestone already completed");
						}

					});
				};
			}
		});
	})
	
	.controller("PreferencesController", function ($scope, $ionicPopup, $ionicLoading, $ionicPlatform, $state, $ionicHistory, ionicToast, $cordovaToast, Storage) {  

		$scope.accountSettings = {};

		var toast = function (message) {
			if(window.cordova) {
				window.plugins.toast.showWithOptions({
				    message: message,
				    duration: "short", 
				    position: "bottom",
				    styling: {
				      	opacity: 0.8,
				      	cornerRadius: 100,
				      	horizontalPadding: 25, 
      					verticalPadding: 21 
				    }
				});
		    }
		    else {
		    	ionicToast.show(message, 'bottom', false, 2000);
		    }
		};

		var disableBackButtonAction = $ionicPlatform.registerBackButtonAction(function (){
		    return; // do nothing
		}, 401);

		$scope.showPreferences = function() {
			$ionicPopup.show({
				templateUrl: 'templates/preferences/preferences.html',
		     	title: '<i class="icon ion-android-settings placeholder-icon"></i> Preferences Setup',
		     	scope: $scope,
		     	buttons: [{
				    text: '<i class="ion-android-done"></i> Start saving challenge!',
				    type: 'button-positive',
				    onTap: function(e) {
			        	if (!$scope.accountSettings.name) {
			            	toast("Please enter an account name");
			          		e.preventDefault();
			          	}
			          	else if(!$scope.accountSettings.accountType) {
			          		toast("Please select type of account");
			          		e.preventDefault();
			          	}
			          	else {
			            	return { 
			            		name: $scope.accountSettings.name,
			            		accountType: $scope.accountSettings.accountType
			            	}
			        	}
			    	}
				}]
		   	}).then(function(result) {
		   		if(result){
			   		Storage.settings.add(result);

			   		$ionicLoading.show({ template: 'Loading...' });

			   		Storage.milestones.setup().then( function(setup){
			   			$ionicLoading.hide();
			   		});

			   		disableBackButtonAction();

			   		$ionicHistory.nextViewOptions({ 
			   			disableBack: true
			   		});

					$state.go('app.home');
				}
		   	});
		};
	})

})();