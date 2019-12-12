angular
  .module("app")
  .controller("mainCtrl", function(
    $scope,
    $rootScope,
    $localStorage,
    $state,
    $http
  ) {
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

    $scope.testHttp = async () => {
      let res = await $http.get("https://www.npmjs.com/package/serve");
      console.log(res);
    };
  });
