angular
  .module("app")
  .controller("scopesCtrl", function(
    $scope,
    $rootScope,
    $localStorage,
    $state,
    $http
  ) {
    $scope.getAll = async () => {
      try {
        let res = await $http.get("/scopes");
        $scope.data = res.data.data;
        console.log(res);
      } catch (err) {
        toastr.error(err.data.message);
      }
    };
    $scope.get = async () => {
      try {
        let res = await $http.get(`/scopes/${$state.params.id}`);
        $scope.obj = res.data.data;
        console.log(res);
      } catch (err) {
        console.log(err);
        toastr.error(err.data.message);
        $state.go("scopes:list");
      }
    };
    $scope.create = async obj => {
      try {
        let res = await $http.post("/scopes", obj);
        console.log(res);
        toastr.success(res.data.message);
        $state.go("scopes:list");
      } catch (err) {
        toastr.error(err.data.message);
      }
    };
    $scope.edit = async obj => {
      try {
        let res = await $http.put(`/scopes/${$state.params.id}`, obj);
        console.log(res);
        toastr.success(res.data.message);
        $state.go("scopes:list");
      } catch (err) {
        toastr.error(err.data.message);
        $state.go("scopes:list");
      }
    };
    $scope.delete = async id => {
      try {
        if (window.confirm("Do you want to delete this document?")) {
          let res = await $http.delete(`/scopes/${id}`);
          console.log(res);
          toastr.success(res.data.message);
          $state.reload();
        }
      } catch (err) {
        toastr.error(err.data.message);
      }
    };
  });
