angular
  .module("app")
  .controller("authCtrl", function($scope, $localStorage, $state) {
    $scope.obj = {};
    $scope.sign_in = async obj => {
      console.log("Sign in", obj);
      $localStorage.user = {
        name: "Khizer Younas",
        email: "m.khizeryounas@gmail.com",
        access_token: "json.web.token",
        id: 1
      };
      $state.reload();
      toastr.success("Logged in successfully");
    };
    $scope.sign_up = async obj => {
      console.log("Sign up", obj);
    };
  });
