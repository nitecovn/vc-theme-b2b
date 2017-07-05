﻿angular.module('storefront.account')
.component('vcAccountProfileUpdate', {
    templateUrl: "themes/assets/account-profile-update.tpl.liquid",
    require: {
        accountManager: '^vcAccountManager'
    },
    controller: ['storefrontApp.mainContext', '$q', '$scope', 'roleService', 'loadingIndicatorService', 'storefront.corporateAccountApi', function (mainContext, $q, $scope, roleService, loader, corporateAccountApi) {
        var $ctrl = this;
        $ctrl.loader = loader;
        $ctrl.currentMember = mainContext.customer;

        this.$routerOnActivate = function (next) {
            loader.wrapLoading(function () {
                return corporateAccountApi.getCompanyMember({ id: $ctrl.currentMember.id }, function (member) {
                    $ctrl.member = {
                        id: member.id,
                        firstName: member.firstName,
                        lastName: member.lastName,
                        email: _.first(member.emails),
                        organizations: member.organizations,
                        title: member.title,
                        addresses: member.addresses,
                        securityAccounts: member.securityAccounts
                    };
                }).$promise;
            });
        };

        $ctrl.submit = function () {
            $ctrl.member.fullName = $ctrl.member.firstName + ' ' + $ctrl.member.lastName;
            $ctrl.member.emails = [$ctrl.member.email];

            return loader.wrapLoading(function () {
                return $q.all([
                    roleService.set($ctrl.member, $ctrl.rolesComponent.currentRole),
                    corporateAccountApi.updateCompanyMember($ctrl.member).$promise
                ]);
            });
        };
    }]
});
