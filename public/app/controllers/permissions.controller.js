angular
  .module("app")
  .controller("permissionsCtrl", function(
    $scope,
    $rootScope,
    $localStorage,
    $state,
    $http
  ) {
    $scope.toggleCheck = id => {
      let index = $scope.obj.scopes.indexOf(id);
      if (index > -1) {
        $scope.obj.scopes.splice(index, 1);
      } else {
        $scope.obj.scopes.push(id);
      }
      console.log($scope.obj.scopes);
    };
    $scope.startForm = async () => {
      try {
        let res = await $http.get("/scopes");
        $scope.scopes = res.data.data;
        console.log($scope.scopes);
        $scope.obj = {
          scopes: []
        };
      } catch (err) {
        console.log(err);
        toastr.error(err.data.message);
      }
    };
    $scope.getAll = async () => {
      try {
        let res = await $http.get("/permissions");
        $scope.data = res.data.data;
        console.log(res);
      } catch (err) {
        toastr.error(err.data.message);
      }
    };
    $scope.get = async () => {
      try {
        let res = await $http.get(`/permissions/${$state.params.id}`);
        $scope.obj = res.data.data;
        $scope.obj.scopes = $scope.obj.scopes.map(e => e._id);
        let res2 = await $http.get("/scopes");
        $scope.scopes = res2.data.data;
        console.log(res);
      } catch (err) {
        console.log(err);
        toastr.error(err.data.message);
        $state.go("permissions:list");
      }
    };
    $scope.create = async obj => {
      try {
        let res = await $http.post("/permissions", obj);
        console.log(res);
        toastr.success(res.data.message);
        $state.go("permissions:list");
      } catch (err) {
        toastr.error(err.data.message);
      }
    };
    $scope.edit = async obj => {
      try {
        let res = await $http.put(`/permissions/${$state.params.id}`, obj);
        console.log(res);
        toastr.success(res.data.message);
        $state.go("permissions:list");
      } catch (err) {
        toastr.error(err.data.message);
        $state.go("permissions:list");
      }
    };
    $scope.delete = async id => {
      try {
        if (window.confirm("Do you want to delete this document?")) {
          let res = await $http.delete(`/permissions/${id}`);
          console.log(res);
          toastr.success(res.data.message);
          $state.reload();
        }
      } catch (err) {
        toastr.error(err.data.message);
      }
    };
  });
