angular
  .module("app")
  .controller("authCtrl", function($scope, $localStorage, $state, $http) {
    $scope.obj = {};
    $scope.sign_in = async obj => {
      try {
        let user = await $http.post("/users/signin", obj);
        console.log("user", user);
        $localStorage.user = user.data.data;
        toastr.success(user.data.message);
        $state.reload();
      } catch (err) {
        toastr.error(err.data.message);
      }
    };
    $scope.sign_up = async obj => {
      try {
        let user = await $http.post("/users/signup", obj);
        console.log("user", user);
        $state.go("auth:sign_in");
        toastr.success(res.data.message);
      } catch (err) {
        toastr.error(err.data.message);
      }
    };
  });
