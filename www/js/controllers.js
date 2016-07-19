(function () {
	angular.module("money-saving-challenge.controllers", [])

	.controller("PreferencesController", function ($scope, $ionicPopup, $ionicLoading, $ionicPlatform, $state, $ionicHistory, ionicToast, $cordovaToast, Storage) {  
		
		var toast = function (message) {
			if(window.cordova) {
				window.plugins.toast.showWithOptions({
				    message: message,
				    duration: "short", 
				    position: "bottom",
				    addPixelsY: -40,
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
		    return; 
		}, 401);

		$scope.accountSettings = {};

		$scope.showPreferences = function() {
			$ionicPopup.show({
				templateUrl: 'templates/preferences/preferences.html',
		     	title: '<i class="icon ion-android-settings placeholder-icon"></i>Preferences Setup',
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
				}],
				scope: $scope
		   	}).then(function(result) {
		   		if(result){
			   		Storage.settings.add(result);
			   		Storage.milestones.setup();
			   		disableBackButtonAction();
			   		$ionicHistory.nextViewOptions({ 
			   			disableBack: true
			   		});
					$state.go('app.home');
				}
		   	});
		};
	})
	
	.controller("MenuController", function ($scope, Storage, $ionicSideMenuDelegate){
		$scope.$on('$ionicView.beforeEnter', function(event, data) {
            Storage.settings.getAll().then(function (settings) {
            	var dateStarted = moment(settings.date_started).format("DD MMM YYYY"),
					current = moment().add(1, "day").diff(new Date(dateStarted), "days"),
					next = moment().add(2, "day").diff(new Date(dateStarted), "days");
				Storage.milestones.get(current).then(function (currentMilestone) {
					Storage.milestones.get(next).then(function (nextMilestone) {
						Storage.achievements.getTotalAmount().then(function (totalAmount){
							$scope.accountInfo = {
								acountType: settings.account_type,
								name: settings.account_name,
								totalAmount: totalAmount.total_amount,
								currentMilestoneDay: currentMilestone.day,
								currentMilestoneAmount: currentMilestone.amount,
								nextMilestoneAmount: nextMilestone.amount
							};
						});
					});
				});
			});
		});
	})

	.controller("HomeController", function ($scope, $ionicHistory, $ionicModal, ionicMaterialInk, $ionicPopup, Storage, $ionicLoading, $timeout, $filter, ACCOUNT_TYPE, ionicToast, $cordovaToast, $state, ACHIEVEMENT_STATUS) {

		var toast = function (message) {
			if(window.cordova) {
				window.plugins.toast.showWithOptions({
				    message: message,
				    duration: "short", 
				    position: "bottom",
				    addPixelsY: -60,
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

		var relativeTime = function (date){
			return moment(date).startOf('minute').fromNow();
		};

		var ordinal = function (input) {
	    	var s = ["th","st","nd","rd"],
	    		v = input%100;
	    	return input+(s[(v-20)%10]||s[v]||s[0]);
	  	};
		
	  	$scope.$on("onResume", function(event, data){
			Storage.settings.getAll().then(function (settings) {
				var dateStarted = moment(settings.date_started).format("DD MMM YYYY"),
					current = moment().add(1, "day").diff(new Date(dateStarted), "days"),
					next = moment().add(2, "day").diff(new Date(dateStarted), "days");
				
				Storage.milestones.get(current).then(function (currentMilestone) {
					Storage.milestones.get(next).then(function (nextMilestone) {
						Storage.achievements.getTotalAmount().then(function (totalAmount){
							$scope.accountInfo = {
								accountType: settings.account_type,
								name: settings.account_name,
								totalAmount: totalAmount.total_amount,
								currentMilestoneDay: currentMilestone.day,
								currentMilestoneAmount: currentMilestone.amount,
								nextMilestoneAmount: nextMilestone.amount
							};
						});
					});
				});

				Storage.achievements.getAll().then(function (achievements){
					$scope.achievements = [];
					for(var i=0; i<achievements.length; i++){
						$scope.achievements.push({
							amount: achievements[i].amount,
							day: achievements[i].day,
							created_at: relativeTime(achievements[i].created_at)
						});
					}
				});
			});
		});
	
		$scope.$on("$ionicView.beforeEnter", function(event, data){

			$ionicLoading.show({duration: 600});

		  	Storage.settings.getAll().then(function (settings) {
				var dateStarted = moment(settings.date_started).format("DD MMM YYYY"),
					current = moment().add(1, "day").diff(new Date(dateStarted), "days"),
					next = moment().add(2, "day").diff(new Date(dateStarted), "days");

				Storage.milestones.get(current).then(function (currentMilestone) {
					Storage.milestones.get(next).then(function (nextMilestone) {
						Storage.achievements.getTotalAmount().then(function (totalAmount){
							$scope.accountInfo = {
								accountType: settings.account_type,
								name: settings.account_name,
								totalAmount: totalAmount.total_amount,
								currentMilestoneDay: currentMilestone.day,
								currentMilestoneAmount: currentMilestone.amount,
								nextMilestoneAmount: nextMilestone.amount
							};
						});
					});
				});
			});

			Storage.achievements.getAll().then (function (achievements){
				$scope.achievements = [];
				for(var i=0; i<achievements.length; i++){
					$scope.achievements.push({
						amount: achievements[i].amount,
						day: achievements[i].day,
						created_at: relativeTime(achievements[i].created_at)
					});
				}
			});
		});
		
		$scope.completeCurrentMilestone = function() {
			if($scope.accountInfo.accountType === ACCOUNT_TYPE.inOrder || $scope.accountInfo.accountType === ACCOUNT_TYPE.inReverse) {
				Storage.achievements.achievementExist($scope.accountInfo.currentMilestoneDay).then( function (achievementExist) {
					if(achievementExist === false) {
						$ionicPopup.show({
					     	title: '<i class="ion-android-checkmark-circle"></i>  '+
					     			'Complete Your '+ ordinal($scope.accountInfo.currentMilestoneDay) +' Milestone',
					     	templateUrl: 'templates/home/popup.html',
					     	buttons: [{
							    text: '<i class="ion-close font-small small"></i> Not Now',
							    type: 'button-dark',
						    }, {
							    text: '<i class="ion-android-done font-small small"></i> Yes',
							    type: 'button-positive',
							    onTap: function(e) {
						    		return {
						    			amount: $scope.accountInfo.currentMilestoneAmount,
						    			day: $scope.accountInfo.currentMilestoneDay,
						    			status: ACHIEVEMENT_STATUS.completed
						    		}
						        }
							}],
					     	scope: $scope
					   	}).then(function(result) {
					     	if(result) {						     		
					       		Storage.achievements.add(result).then (function (insertedId){
					       			Storage.achievements.get(insertedId).then (function (achievement){
					       				$scope.achievements.push({
					       					amount: achievement.amount,
											day: achievement.day,
											created_at: relativeTime(achievement.created_at)
					       				});
					       				$scope.accountInfo.totalAmount += achievement.amount;
					       				toast( ordinal($scope.accountInfo.currentMilestoneDay) + " Milestone completed");
					       			});
					       		});
					     	}
					   	});
					}
					else if(achievementExist === true){
						toast( ordinal($scope.accountInfo.currentMilestoneDay) + " Milestone already completed");
					}
				});
			}
			else if($scope.accountInfo.accountType === ACCOUNT_TYPE.random) {

				Storage.milestones.getAllSelected().then( function (selectedMilestones){
					$scope.selectedMilestones = selectedMilestones;
				});

				Storage.achievements.achievementExist($scope.accountInfo.currentMilestoneDay).then( function (achievementExist) {
					if(achievementExist === false) {
						$state.go('app.home.random-milestone-list', { 
							milestones: $scope.selectedMilestones,
					     	currentMilestoneDay: $scope.accountInfo.currentMilestoneDay,
					     	totalAmount: $scope.accountInfo.totalAmount,
							achievements: $scope.achievements,
							ordinal: ordinal,
							toast: toast,
							relativeTime: relativeTime
						});
					}
					else if(achievementExist === true){
						toast( ordinal($scope.accountInfo.currentMilestoneDay) + " Milestone already completed");
					}
				});
			}
		};
	})
	
	.controller("HomeRandomMilestoneListController", function ($scope, Storage, $state, $ionicPopup, $ionicHistory, $ionicScrollDelegate, ACHIEVEMENT_STATUS){

		$scope.$on("$ionicView.beforeEnter", function(event, data){
			$scope.selectedMilestones = $state.params.milestones;
			$scope.achievements = $state.params.achievements;
			$scope.accountInfo = {
				currentMilestoneDay: $state.params.currentMilestoneDay,
				totalAmount: $state.params.totalAmount
			}
		});

		$scope.getSelectedMilestone = function (index, milestone) {
			$scope.selectedMilestone = {
				row: index,
				amount: milestone.amount,
				day: milestone.day
			};
		};

		$scope.scrollTop = function() {
        	$ionicScrollDelegate.resize();  
    	};

		$scope.addSelectedMilestone = function (){
			if($scope.selectedMilestone !== undefined){
				$ionicPopup.show({
			     	title: '<i class="ion-android-checkmark-circle"></i>  '+
			     			'Complete Your '+ $state.params.ordinal($scope.accountInfo.currentMilestoneDay) +' Milestone',
			     	templateUrl: 'templates/home/popup-list.html',
			     	buttons: [{
					    text: '<i class="ion-close small"></i> Not Now',
					    type: 'button-dark',
				    }, {
					    text: '<i class="ion-android-done small"></i> Ok',
					    type: 'button-positive',
					    onTap: function(e) {
				    		return{
				    			selectedRow: $scope.selectedMilestone.row,
				    			amount: $scope.selectedMilestone.amount,
				    			day: $scope.accountInfo.currentMilestoneDay,
				    			status: ACHIEVEMENT_STATUS.completed
				    		}
				    	}
					}],
			     	scope: $scope
			   	}).then(function(result) {
			     	if(result) {
			       		Storage.achievements.add(result).then (function (insertedId){
			       			Storage.achievements.get(insertedId).then (function (achievement){
			       				$scope.achievements.push({
			       					amount: achievement.amount,
									day: achievement.day,
									created_at: $state.params.relativeTime(achievement.created_at)
			       				});
			       				$scope.accountInfo.totalAmount += achievement.amount;
			       				$scope.selectedMilestones.splice(result.selectedRow, 1);
			       				$state.params.toast( $state.params.ordinal($scope.accountInfo.currentMilestoneDay) + " Milestone completed");
			       				$ionicHistory.currentView($ionicHistory.backView());
			      				$state.go('app.home', {reload:false});					       			
			       			});
			       		});
			     	}
			   	});
			}
			else{
				$state.params.toast("Please select a milestone");
			}
		};
	})

	.controller("MissedMilestonesController", function ($scope, $ionicPopup, Storage, ACCOUNT_TYPE, $state, ionicToast, $cordovaToast, $ionicScrollDelegate, ACHIEVEMENT_STATUS, $ionicLoading){
	
		var toast = function (message) {
			if(window.cordova) {
				window.plugins.toast.showWithOptions({
				    message: message,
				    duration: "short", 
				    position: "bottom",
				    addPixelsY: -60,
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

		var ordinal = function (input) {
	    	var s = ["th","st","nd","rd"],
	    		v = input%100;
	    	return input+(s[(v-20)%10]||s[v]||s[0]);
	  	};

	  	$scope.$on("$ionicView.beforeEnter", function(event, data){

	  		$ionicLoading.show({duration: 600});

		  	Storage.missedMilestones.getAll().then( function (missedMilestones){
				$scope.missedMilestones = missedMilestones;
			});

			Storage.settings.getAll().then(function (settings) {
				$scope.accountType = settings.account_type;
			});
		});

	  	$scope.scrollTop = function() {
        	$ionicScrollDelegate.resize();  
    	};
				
		$scope.completeMilestone = function (index ,milestone) {
			if($scope.accountType === ACCOUNT_TYPE.inOrder || $scope.accountType === ACCOUNT_TYPE.inReverse) {

				$scope.selectedMilestone = {
					row: index,
					amount: milestone.amount,
					day: milestone.day
				};

				Storage.achievements.achievementExist($scope.selectedMilestone.day).then( function (achievementExist) {
					if(achievementExist === false) {
						$ionicPopup.show({
					     	title: '<i class="ion-android-checkmark-circle"></i>  '+
					     			'Complete Your '+ ordinal($scope.selectedMilestone.day) +' Milestone',
					     	templateUrl: 'templates/missed-milestones/popup.html',
					     	buttons: [{
							    text: '<i class="ion-close small"></i> Not Now',
							    type: 'button-dark',
						    }, {
							    text: '<i class="ion-android-done small"></i> Ok',
							    type: 'button-positive',
							    onTap: function(e) {
						    		return{
						    			selectedRow: $scope.selectedMilestone.row,
						    			amount: $scope.selectedMilestone.amount,
						    			day: $scope.selectedMilestone.day,
						    			status: ACHIEVEMENT_STATUS.completedButDelayed
						    		}
						    	}
							}],
					     	scope: $scope
					   	}).then(function(result) {
					   		if(result){
					   			Storage.achievements.add(result);
					   			$scope.missedMilestones.splice($scope.selectedMilestone.row, 1);
					   			toast( ordinal($scope.selectedMilestone.day) + " Milestone completed");
					   		}
					   	});
					}
					else if(achievementExist === true){
						toast( ordinal($scope.selectedMilestone.day) + " Milestone already completed");
						$scope.missedMilestones.splice($scope.selectedMilestone.row, 1);
						$scope.selectedMilestone.row = null;
					}
				});
			}
			else if($scope.accountType === ACCOUNT_TYPE.random) {

				Storage.milestones.getAllSelected().then( function (selectedMilestones){
					$scope.selectedMilestones = selectedMilestones;
				});

				$scope.selectedMilestone = {
					row: index,
					amount: milestone.amount,
					day: milestone.day
				};

				Storage.achievements.achievementExist($scope.selectedMilestone.day).then( function (achievementExist) {
					if(achievementExist === false) {
						$state.go("app.missed-milestones.random-milestone-list", {
							milestones: $scope.selectedMilestones,
							selectedDay: $scope.selectedMilestone.day,
							toast: toast,
							ordinal: ordinal
						});
					}
					else if(achievementExist === true){
						toast( ordinal($scope.selectedMilestone.day) + " Milestone already completed");
						$scope.missedMilestones.splice($scope.selectedMilestone.row, 1);
						$scope.selectedMilestone.row = null;
					}
				});
			}
		};
	})

	.controller("MissedMilestoneRandomListController", function ($scope, Storage, $state, $ionicPopup, ACHIEVEMENT_STATUS, $ionicHistory){
		
		$scope.$on("$ionicView.beforeEnter", function(event, data){
			$scope.selectedMilestones = $state.params.milestones;
			$scope.selectedDay = $state.params.selectedDay;
		});

		$scope.getSelectedMilestone = function (index, milestone) {
			$scope.selectedMilestone = {
				row: index,
				amount: milestone.amount,
				day: milestone.day
			};
		};

		$scope.scrollTop = function() {
        	$ionicScrollDelegate.resize();  
    	};

		$scope.addSelectedMilestone = function () {
			if($scope.selectedMilestone !== undefined){
				$ionicPopup.show({
			     	title: '<i class="ion-android-checkmark-circle"></i>  '+
			     			'Complete Your '+ $state.params.ordinal($scope.selectedDay) +' Milestone',
			     	templateUrl: 'templates/missed-milestones/popup-list.html',
			     	buttons: [{
					    text: '<i class="ion-close small"></i> Not Now',
					    type: 'button-dark',
				    }, {
					    text: '<i class="ion-android-done small"></i> Ok',
					    type: 'button-positive',
					    onTap: function(e) {
				    		return{
				    			selectedRow: $scope.selectedMilestone.row,
				    			amount: $scope.selectedMilestone.amount,
				    			day: $scope.selectedDay,
				    			status: ACHIEVEMENT_STATUS.completedButDelayed
				    		}
				    	}
					}],
			     	scope: $scope
			   	}).then(function(result) {
			   		if(result){
			   			Storage.achievements.add(result);
			   			$state.params.toast( $state.params.ordinal($state.params.selectedDay) + " Milestone completed");
			   			$ionicHistory.currentView($ionicHistory.backView());
			      		$state.go('app.missed-milestones', {reload:false});
			   		}
			   	});
			}
			else{
				$state.params.toast("Please select a milestone");
			}
		}
	})
	
	.controller("SettingsController", function ($ionicLoading, $scope, Storage){
		$scope.$on("$ionicView.beforeEnter", function(event, data){

			$ionicLoading.show({duration: 600});

			Storage.settings.getAll().then( function (settings){
				$scope.settings = {
					accountName: settings.account_name,
					accountType: settings.account_type,
					appStatus: settings.app_status,
					dateStarted: moment(new Date(settings.date_started)).format("MMMM Do YYYY, dddd"),
					dateFinish: moment(new Date(settings.date_finish)).format("MMMM Do YYYY, dddd")
				};
			});
		});
	})

})();