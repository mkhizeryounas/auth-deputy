angular
  .module("app")
  .controller("mainCtrl", function(
    $scope,
    $rootScope,
    $localStorage,
    $state,
    $http
  ) {
    $scope.getSettings = async () => {
      try {
        let settings = await $http.get("/settings");
        console.log(settings.data);
        $scope.obj = settings.data.data;
        // toastr.success(settings.data.message);
        // $state.go("home");
      } catch (err) {
        console.log("Err", err);
        toastr.error(err.data.message);
      }
    };
    $scope.editSettings = async obj => {
      try {
        let settings = await $http.put("/settings", obj);
        console.log(settings.data);
        toastr.success(settings.data.message);
        $state.go("home");
      } catch (err) {
        console.log("Err", err);
        toastr.error(err.data.message);
      }
    };
    $scope.getDashboard = async () => {
      try {
        let dashboard = await $http.get("/dashboard");
        console.log(dashboard.data.data);
        $scope.dashboard = dashboard.data.data;
        $scope.base_url = window.origin;
        $scope.expires_in = new Date(
          Math.floor(
            $scope._user.exp - Math.floor(new Date().getTime() / 1000)
          ) * 1000
        )
          .toISOString()
          .substr(11, 8);

        console.log($scope.expires_in);
      } catch (err) {
        console.log("Err", err);
        toastr.error(err.data.message);
      }
    };
//     if ($localStorage.user) $scope._user = $localStorage.user;
    $rootScope.header = flag => {
      $rootScope.header_show = flag;
      if (!$rootScope.$$phase) $rootScope.$apply();
    };
    $scope.logout = function() {
      $localStorage.user = null;
      toastr.success("Logged out successfully");
      $state.reload();
    };
    $rootScope.btn_loading = (id, flag) => {
      if (flag) {
        $(`#${id}`).each(function(e) {
          $(this).addClass("disabled");
          $(this).addClass("is-loading");
        });
      } else {
        $(`#${id}`).each(function(e) {
          $(this).removeClass("disabled");
          $(this).removeClass("is-loading");
        });
      }
    };
    $scope.nav_active = sub =>
      $state.current.name.includes(sub) ? true : false;
  });
